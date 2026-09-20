// The docs site as one Lit app: @lit-labs/router owns the URL, the shell is the design system's
// own elements, and each page is a prebuilt HTML fragment under /pages fetched on first visit.
// Renders in light DOM so the page rules, the icon sprite and the examples live in the document.
import { Router } from "@lit-labs/router";
import { html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { bindField, setAssetsBase, TanStackFormController } from "../../dist/index";

type NavItem = { title: string; href: string; house?: boolean };
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
const ICON_CHART = html`<svg class="ic" width="16" height="16" slot="logo" aria-hidden="true"><use href="#i-chart"></use></svg>`;
const cache = new Map<string, string>();

@customElement("acme-docs-app")
export class AcmeDocsApp extends LitElement {
  private nav: Nav = window.__docsNav ?? [];
  private flat = this.nav.flatMap((g) => g.items);
  @state() private page = "";
  @state() private body = "";
  @state() private missing = false;

  private router = new Router(
    this,
    [
      { path: `${prefix}/`, enter: () => this.load("index"), render: () => this.frame() },
      { path: `${prefix}/index.html`, enter: () => this.load("index"), render: () => this.frame() },
      { path: `${prefix}/:page`, enter: (p) => this.load(p.page ?? "index"), render: () => this.frame() },
      { path: `${prefix}/components/:id`, enter: (p) => this.load(`components/${p.id}`), render: () => this.frame() },
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
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("click", this.onHash, true);
  }
  private onHash = (e: MouseEvent) => {
    const a = e.composedPath().find((n) => (n as HTMLElement).tagName === "A") as HTMLAnchorElement | undefined;
    const href = a?.getAttribute("href");
    if (!a || !href?.startsWith("#")) return;
    e.preventDefault();
    if (href.length > 1) {
      document.getElementById(href.slice(1))?.scrollIntoView({ block: "start" });
      history.replaceState({}, "", href);
    }
  };

  private async load(page: string): Promise<boolean> {
    const file = page.replace(/\.html$/, "");
    if (file === "__missing") {
      this.page = file;
      this.body = "";
      this.missing = true;
      return true;
    }
    let body = cache.get(file);
    if (body === undefined) {
      const r = await fetch(`${prefix}/pages/${file}.html`, { cache: "no-cache" });
      if (!r.ok) return this.load("__missing");
      body = await r.text();
      cache.set(file, body);
    }
    this.page = file;
    this.body = body;
    this.missing = false;
    // A census page is not in the navigation: it takes its element's title.
    const census = file.startsWith("census/") ? this.flat.find((i) => i.href === `components/${file.slice(7)}`) : undefined;
    const item = census ? { ...census, title: `${census.title} (census)` } : this.flat.find((i) => i.href === file);
    document.title = file === "index" ? "ACME Design System" : `${item?.title ?? "Not found"} · ACME Design System`;
    if (!location.hash) window.scrollTo(0, 0);
    return true;
  }

  updated() {
    // Content links are written root-relative; on a project site they need the prefix.
    if (prefix)
      for (const a of this.querySelectorAll<HTMLAnchorElement>('main a[href^="/"]:not([data-prefixed])')) {
        a.setAttribute("href", prefix + a.getAttribute("href"));
        a.dataset.prefixed = "";
      }
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
    // An example's script runs once, after its markup is in the document, with the preview root.
    for (const sc of this.querySelectorAll<HTMLElement>(".showcase[data-script]:not([data-ran])")) {
      sc.dataset.ran = "";
      try {
        new Function("root", sc.dataset.script ?? "")(sc.querySelector(".preview"));
      } catch (e) {
        console.error("example script failed", e);
      }
    }
  }

  private frame() {
    const i = this.flat.findIndex((x) => x.href === this.page);
    const prev = i > 0 ? this.flat[i - 1] : undefined;
    const next = i >= 0 && i < this.flat.length - 1 ? this.flat[i + 1] : undefined;
    return html`<main class="docs-main">
      ${this.missing ? html`<article class="doc"><div class="doc-hero"><h1>Not found</h1><p>No page at this address. <a href="${prefix}/">Start over</a>.</p></div></article>` : unsafeHTML(this.body)}
      ${prev || next ? html`<acme-pagination prev-title=${prev?.title ?? ""} prev-href=${prev ? `${prefix}/${prev.href}` : ""} next-title=${next?.title ?? ""} next-href=${next ? `${prefix}/${next.href}` : ""}></acme-pagination>` : nothing}
      <p class="foot">ACME Design System · Foundations and components after vercel.com/geist, read in full · Google Sans Flex and Google Sans Code · Built with Lit.</p>
    </main>`;
  }

  render() {
    const cur = (href: string) => (this.page === href ? "page" : nothing);
    const section = this.page.startsWith("components/") ? "components" : ["colors", "typography", "materials"].includes(this.page) ? "foundations" : this.page === "index" ? "start" : "";
    return html`<acme-appbar name="ACME Design System" href="${prefix}/">
        ${ICON_CHART}
        <a href="${prefix}/" aria-current=${section === "start" ? "true" : nothing}>Get Started</a>
        <a href="${prefix}/colors" aria-current=${section === "foundations" ? "true" : nothing}>Foundations</a>
        <a href="${prefix}/components/avatar" aria-current=${section === "components" ? "true" : nothing}>Components</a>
        <a href="https://github.com/acmelabs-15/design-system" rel="external" target="_blank">GitHub</a>
        <a href="https://www.npmjs.com/package/@acmelabs/design-system" rel="external" target="_blank">npm</a>
      </acme-appbar>
      <div class="docs">
        <nav class="docs-side" aria-label="Pages">
          ${this.nav.map((g) => html`<div class="grp">${g.group}</div>${g.items.map((i) => html`<a href="${prefix}/${i.href === "index" ? "" : i.href}" aria-current=${cur(i.href)}>${i.title}</a>`)}`)}
        </nav>
        ${this.router.outlet()}
      </div>
      <acme-toaster></acme-toaster>`;
  }
}

/** The Colors page: rows reading the live value of each token, redrawn when the theme changes. */
@customElement("docs-tokens")
export class DocsTokens extends LitElement {
  @state() private tick = 0;
  createRenderRoot() {
    return this;
  }
  private redraw = () => setTimeout(() => this.tick++, 0);
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("acme-change", this.redraw);
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.redraw);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("acme-change", this.redraw);
  }
  render() {
    const tokens = (this.getAttribute("tokens") ?? "").split(/\s+/).filter(Boolean);
    const s = getComputedStyle(document.documentElement);
    return html`${tokens.map((v) => html`<div class="def-row"><span class="d" style=${`background:var(${v})`}></span><b class="mono" style="font-size:13px">${v}</b><span class="mono" style="font-size:12px">${s.getPropertyValue(v).trim().slice(0, 48)}</span></div>`)}`;
  }
}

/** The Colors page: one swatch of a scale. The token is its tooltip; a right click copies the raw value. */
@customElement("docs-swatch")
export class DocsSwatch extends LitElement {
  createRenderRoot() {
    return this;
  }
  private copy = (e: Event) => {
    e.preventDefault();
    const token = this.getAttribute("token") ?? "";
    const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    navigator.clipboard
      ?.writeText(value)
      .then(() => window.acme?.toasts.success(`Copied ${value}`))
      .catch(() => window.acme?.toasts.error(`Could not copy ${token}`));
  };
  render() {
    const token = this.getAttribute("token") ?? "";
    return html`<acme-tooltip text=${token}><button type="button" class="sw" style=${`background:var(${token})`} aria-label=${token} @contextmenu=${this.copy}></button></acme-tooltip>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-docs-app": AcmeDocsApp;
    "docs-tokens": DocsTokens;
    "docs-swatch": DocsSwatch;
  }
}

/** The Forms page demo: TanStack Form bound to the acme inputs with bindField. */
@customElement("docs-form-demo")
export class DocsFormDemo extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: { name: "", email: "", plan: "hobby", updates: true },
    onSubmit: ({ value }) => {
      window.acme?.toasts.success(`Account for ${value.name} created`);
    },
  });
  createRenderRoot() {
    return this;
  }
  render() {
    return html`<form
      class="vstack"
      style="max-width:360px;gap:16px"
      @submit=${(e: Event) => {
        e.preventDefault();
        this.form.api.handleSubmit();
      }}
    >
      ${this.form.field({ name: "name", validators: { onChange: ({ value }) => (value.length < 2 ? "Name needs two characters." : undefined) } }, (f) => html`<acme-input label="Name" placeholder="Ada Lovelace" ${bindField(f)}></acme-input>`)}
      ${this.form.field({ name: "email", validators: { onChange: ({ value }) => (/@/.test(value) ? undefined : "Enter an email address.") } }, (f) => html`<acme-input label="Email" type="email" placeholder="ada@acme.dev" ${bindField(f)}></acme-input>`)}
      ${this.form.field({ name: "plan" }, (f) => html`<acme-select label="Plan" options='["hobby","pro","enterprise"]' ${bindField(f)}></acme-select>`)}
      ${this.form.field({ name: "updates" }, (f) => html`<acme-toggle label="Product updates" ${bindField(f)}></acme-toggle>`)}
      <div><acme-button type="submit" variant="primary" ?disabled=${!this.form.api.state.canSubmit}>Create Account</acme-button></div>
    </form>`;
  }
}
