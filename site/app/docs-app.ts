// The docs site as one Lit app: @lit-labs/router owns the URL, the shell is the design system's
// own elements, and each page is a prebuilt HTML fragment under /pages fetched on first visit.
// Renders in light DOM so the page rules, the icon sprite and the examples live in the document.
import { Router } from "@lit-labs/router";
import { html, LitElement, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { setAssetsBase, registerTheme, createToastStore } from "../../dist/index";
import { atomState } from "../../dist/shared/atom-state";
import { StoreSelector } from "../../dist/shared/store-connection";
import { ThemeContextController } from "../../dist/shared/theme-context";
import type { ThemeAppearance } from "../../dist/shared/theme-scope";
import { notifications } from "./notifications";
import { ExampleController } from "./example";

type NavItem = { title: string; href: string };
type Nav = { group: string; items: NavItem[] }[];
declare global {
  interface Window {
    __docsNav?: Nav;
  }
}

/** GitHub Pages serves a project site under /<repo>/; locally the site is at the root. */
export const prefix = location.hostname.endsWith("github.io") ? `/${location.pathname.split("/")[1]}` : "";
// The docs serve the package's asset files themselves (the build copies `assets/` next to the pages).
setAssetsBase(`${prefix}/assets/`);
const ICON_CHART = html`<acme-bar-chart-icon class="ic" size="16px"></acme-bar-chart-icon>`;
const cache = new Map<string, string>();

export class AcmeDocsApp extends LitElement {
  @atomState() private appearance: ThemeAppearance = "auto";
  private onAppearance = (event: CustomEvent) => {
    const value = event.detail?.value;
    if (event.defaultPrevented || event.detail?.action !== "appearance" || !["auto", "light", "dark"].includes(value)) {
      return;
    }
    this.appearance = value;
    if (value === "auto") {
      document.documentElement.removeAttribute("data-acme-appearance");
    } else {
      document.documentElement.setAttribute("data-acme-appearance", value);
    }
    event.stopPropagation();
  };
  private nav: Nav = window.__docsNav ?? [];
  private flat = this.nav.flatMap((g) => g.items);
  @atomState() private page = "";
  @atomState() private body = "";
  @atomState() private missing = false;
  @atomState() private loadError = "";
  @atomState() private menuOpen = false;
  private focusAfterMenu = false;
  private focusPage = false;
  private navigationObserver?: ResizeObserver;
  private observedNavigation?: HTMLElement;
  private readonly wideLayout = matchMedia("(min-width: 901px)");
  private onLayoutChange = () => {
    if (this.wideLayout.matches) {
      this.menuOpen = false;
    }
  };
  private onMenuChange = (event: CustomEvent<{ open: boolean }>) => {
    if (event.target !== this.querySelector(".docs-menu")) {
      return;
    }
    this.menuOpen = event.detail.open;
  };
  private onMenuLink = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const anchor = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (!anchor) {
      return;
    }
    this.focusAfterMenu = true;
    this.menuOpen = false;
  };
  private focusHeading() {
    const heading = this.querySelector<HTMLElement>("main h1");
    if (!heading) {
      return;
    }
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  private onMenuClosed = () => {
    if (!this.focusAfterMenu) {
      return;
    }
    this.focusAfterMenu = false;
    this.focusPage = false;
    this.focusHeading();
  };
  private loadGeneration = 0;
  private request?: AbortController;
  private readonly examples = new Map<HTMLElement, ExampleController>();
  private disposeExamples() {
    for (const example of this.examples.values()) {
      example.dispose();
    }
    this.examples.clear();
  }

  private router = new Router(
    this,
    [
      { path: `${prefix}/`, enter: () => this.load("index"), render: () => this.frame() },
      { path: `${prefix}/index.html`, enter: () => this.load("index"), render: () => this.frame() },
      { path: `${prefix}/:page`, enter: (p) => this.load(p.page ?? "index"), render: () => this.frame() },
      { path: `${prefix}/components/:id`, enter: (p) => this.load(`components/${p.id}`), render: () => this.frame() },
      { path: `${prefix}/recipes/:id`, enter: (p) => this.load(`recipes/${p.id}`), render: () => this.frame() },
      { path: `${prefix}/census/:id`, enter: (p) => this.load(`census/${p.id}`), render: () => this.frame() },
    ],
    { fallback: { enter: () => this.load("__missing"), render: () => this.frame() } },
  );

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    // In-page anchors stay in the page: the router would otherwise push "#" and re-route.
    window.addEventListener("click", this.onHash, true);
    this.wideLayout.addEventListener("change", this.onLayoutChange);
  }
  disconnectedCallback() {
    this.loadGeneration++;
    this.request?.abort();
    this.disposeExamples();
    this.navigationObserver?.disconnect();
    this.observedNavigation = undefined;
    this.wideLayout.removeEventListener("change", this.onLayoutChange);
    super.disconnectedCallback();
    window.removeEventListener("click", this.onHash, true);
  }
  private onHash = (e: MouseEvent) => {
    const a = e.composedPath().find((n) => (n as HTMLElement).tagName === "A") as HTMLAnchorElement | undefined;
    const href = a?.getAttribute("href");
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !a || a.getRootNode() !== document || !href?.startsWith("#")) {
      return;
    }
    e.preventDefault();
    if (href.length > 1) {
      const target = document.getElementById(href.slice(1));
      target?.scrollIntoView({ block: "start" });
      if (target?.id === "docs-main") {
        target.focus({ preventScroll: true });
      }
      history.replaceState(history.state, "", href);
    }
  };

  private async load(page: string): Promise<boolean> {
    const focusPage = this.page !== "" && this.page !== page;
    const generation = ++this.loadGeneration;
    this.request?.abort();
    const request = new AbortController();
    this.request = request;
    const file = page.replace(/\.html$/, "");
    if (file === "__missing") {
      this.disposeExamples();
      this.page = file;
      this.body = "";
      this.missing = true;
      this.loadError = "";
      this.focusPage = focusPage;
      return true;
    }
    let body = cache.get(file);
    if (body === undefined) {
      try {
        const r = await fetch(`${prefix}/pages/${file}.html`, { cache: "no-cache", signal: request.signal });
        if (generation !== this.loadGeneration) {
          return false;
        }
        if (r.status === 404) {
          return this.load("__missing");
        }
        if (!r.ok) {
          throw new Error(`The page request failed (${r.status}).`);
        }
        body = await r.text();
        if (generation !== this.loadGeneration) {
          return false;
        }
        cache.set(file, body);
      } catch (error) {
        if (request.signal.aborted || generation !== this.loadGeneration) {
          return false;
        }
        this.disposeExamples();
        this.page = file;
        this.body = "";
        this.missing = false;
        this.loadError = error instanceof Error ? error.message : String(error);
        this.focusPage = focusPage;
        return true;
      }
    }
    this.page = file;
    if (this.body !== body) {
      this.disposeExamples();
    }
    this.body = body;
    this.missing = false;
    this.loadError = "";
    this.focusPage = focusPage;
    // A census page is not in the navigation: it takes its element's title.
    const census = file.startsWith("census/") ? this.flat.find((i) => i.href === `components/${file.slice(7)}`) : undefined;
    const item = census ? { ...census, title: `${census.title} (census)` } : this.flat.find((i) => i.href === file);
    document.title = file === "index" ? "ACME Design System" : `${item?.title ?? "Not found"} · ACME Design System`;
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
    return true;
  }

  updated() {
    const navigation = this.querySelector<HTMLElement>(".docs-page-navigation");
    if (navigation !== this.observedNavigation) {
      this.navigationObserver?.disconnect();
      this.observedNavigation = navigation ?? undefined;
      if (navigation) {
        const measure = () => this.style.setProperty("--docs-navigation-height", `${navigation.getBoundingClientRect().height}px`);
        this.navigationObserver = new ResizeObserver(measure);
        this.navigationObserver.observe(navigation);
        measure();
      } else {
        this.style.setProperty("--docs-navigation-height", "0px");
      }
    }
    if (this.focusPage && !this.menuOpen && !this.focusAfterMenu) {
      this.focusPage = false;
      this.focusHeading();
    }
    // Content links are written root-relative; on a project site they need the prefix.
    if (prefix) {
      for (const a of this.querySelectorAll<HTMLAnchorElement>('main a[href^="/"]:not([data-prefixed])')) {
        a.setAttribute("href", prefix + a.getAttribute("href"));
        a.dataset.prefixed = "";
      }
    }
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
    }
    for (const [host, example] of this.examples) {
      if (!this.contains(host)) {
        example.dispose();
        this.examples.delete(host);
      }
    }
    for (const host of this.querySelectorAll<HTMLElement>(".showcase[data-example]")) {
      if (!this.examples.has(host)) {
        this.examples.set(host, new ExampleController(host, { registerTheme, createToastStore }));
      }
    }
  }

  private frame() {
    const i = this.flat.findIndex((x) => x.href === this.page);
    const prev = i > 0 ? this.flat[i - 1] : undefined;
    const next = i >= 0 && i < this.flat.length - 1 ? this.flat[i + 1] : undefined;
    return html`<main class="docs-main" id="docs-main" tabindex="-1">
      ${this.loadError ? html`<article class="doc"><div class="doc-hero"><h1>Page unavailable</h1><p role="alert">${this.loadError}</p><acme-button @click=${() => this.router.goto(location.pathname)}>Retry page</acme-button></div></article>` : this.missing ? html`<article class="doc"><div class="doc-hero"><h1>Not found</h1><p>No page at this address. <a href="${prefix}/">Start over</a>.</p></div></article>` : unsafeHTML(this.body)}
      ${prev || next ? html`<nav class="docs-page-navigation" aria-label="Documentation pages"><div class="docs-page-navigation-inner">${prev ? html`<a class="docs-previous" href=${`${prefix}/${prev.href === "index" ? "" : prev.href}`} rel="prev"><span>Previous</span><strong>${prev.title}</strong></a>` : nothing}${next ? html`<a class="docs-next" href=${`${prefix}/${next.href}`} rel="next"><span>Next</span><strong>${next.title}</strong></a>` : nothing}</div></nav>` : nothing}
    </main>`;
  }

  render() {
    const cur = (href: string) => (this.page === href ? "page" : nothing);
    const section = this.page.startsWith("components/")
      ? "components"
      : this.page.startsWith("recipes/")
        ? "recipes"
        : ["colors", "typography", "materials", "tokens"].includes(this.page)
          ? "foundations"
          : this.page === "index"
            ? "start"
            : "";
    return html`<acme-theme .appearance=${this.appearance} @acme-request=${this.onAppearance}><a class="docs-skip" href="#docs-main">Skip to content</a><acme-app-bar class="docs-header" placement="sticky">
        <acme-app-bar-start><a class="docs-brand" href="${prefix}/">${ICON_CHART}<strong>ACME Design System</strong></a></acme-app-bar-start>
        <nav class="docs-header-nav" aria-label="Sections">
        <a href="${prefix}/" aria-current=${section === "start" ? "page" : nothing}>Get Started</a>
        <a href="${prefix}/colors" aria-current=${section === "foundations" ? "page" : nothing}>Foundations</a>
        <a href="${prefix}/components/avatar" aria-current=${section === "components" ? "page" : nothing}>Components</a>
        ${this.nav.find((group) => group.group === "Recipes")?.items[0] ? html`<a href="${prefix}/${this.nav.find((group) => group.group === "Recipes")!.items[0]!.href}" aria-current=${section === "recipes" ? "page" : nothing}>Recipes</a>` : nothing}
        <a href="https://github.com/acmelabs-15/design-system" rel="external" target="_blank">GitHub</a>
        <a href="https://www.npmjs.com/package/@acmelabs/design-system" rel="external" target="_blank">npm</a>
      </nav>
        <acme-app-bar-end><acme-button id="docs-menu-button" class="docs-menu-button" variant="tertiary" size="small" aria-label="Open page navigation" aria-haspopup="dialog" aria-expanded=${String(this.menuOpen)} @click=${() => {
          this.menuOpen = true;
        }}>Pages</acme-button><acme-theme-switcher class="docs-header-appearance" size="small" .value=${this.appearance}></acme-theme-switcher></acme-app-bar-end>
      </acme-app-bar>
      <div class="docs">
        <nav class="docs-side" aria-label="Pages">
          ${this.nav.map((g) => html`<div class="grp">${g.group}</div>${g.items.map((i) => html`<a href="${prefix}/${i.href === "index" ? "" : i.href}" aria-current=${cur(i.href)}>${i.title}</a>`)}`)}
        </nav>
        ${this.router.outlet()}
      </div>
      <acme-drawer class="docs-menu" placement="start" size="min(22rem, 100vw)" .open=${this.menuOpen} return-focus="#docs-menu-button" @acme-open-change=${this.onMenuChange} @acme-after-close=${this.onMenuClosed}>
        <h2 slot="heading">Documentation pages</h2>
        <nav class="docs-menu-links" aria-label="Mobile pages" @click=${this.onMenuLink}>
          ${this.nav.map((group) => html`<h3 class="grp">${group.group}</h3>${group.items.map((item) => html`<a href="${prefix}/${item.href === "index" ? "" : item.href}" aria-current=${cur(item.href)}>${item.title}</a>`)}`)}
          <h3 class="grp">Project</h3><a href="https://github.com/acmelabs-15/design-system" rel="external" target="_blank">GitHub</a><a href="https://www.npmjs.com/package/@acmelabs/design-system" rel="external" target="_blank">npm</a>
        </nav>
        <acme-theme-switcher slot="footer" size="small" .value=${this.appearance}></acme-theme-switcher><acme-drawer-close slot="footer">Close navigation</acme-drawer-close>
      </acme-drawer>
      <acme-toast-viewport .store=${notifications}></acme-toast-viewport></acme-theme>`;
  }
}

/** The Colors page: rows reading the live value of each token, redrawn when the theme changes. */
export class DocsTokens extends LitElement {
  createRenderRoot() {
    return this;
  }
  private readonly themeContext = new ThemeContextController(this);
  constructor() {
    super();
    new StoreSelector(this, () => this.themeContext.scope.effective);
  }
  render() {
    const tokens = (this.getAttribute("tokens") ?? "").split(/\s+/).filter(Boolean);
    const s = getComputedStyle(this);
    return html`${tokens.map((v) => html`<div class="def-row"><span class="d" style=${`background:var(${v})`}></span><b class="mono" style="font-size:13px">${v}</b><span class="mono" style="font-size:12px">${s.getPropertyValue(v).trim().slice(0, 48)}</span></div>`)}`;
  }
}

/** The Colors page: one swatch of a scale. The token is its tooltip; a right click copies the raw value. */
export class DocsSwatch extends LitElement {
  createRenderRoot() {
    return this;
  }
  private copy = (e: Event) => {
    e.preventDefault();
    const token = this.getAttribute("token") ?? "";
    const value = getComputedStyle(this).getPropertyValue(token).trim();
    navigator.clipboard
      ?.writeText(value)
      .then(() => notifications.add({ description: `Copied ${value}`, variant: "success" }))
      .catch(() => notifications.add({ description: `Could not copy ${token}`, variant: "error" }));
  };
  render() {
    const token = this.getAttribute("token") ?? "";
    return html`<acme-tooltip content=${token}><button type="button" class="sw" style=${`background:var(${token})`} aria-label=${token} @contextmenu=${this.copy}></button></acme-tooltip>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-docs-app": AcmeDocsApp;
    "docs-tokens": DocsTokens;
    "docs-swatch": DocsSwatch;
  }
}
