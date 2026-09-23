import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { sharedCss } from "../../base";
import { tocCss } from "../../generated/components/toc/toc.styles";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { discoverHeadingTargets, headingTargetsChanged } from "../../shared/heading-targets";
import { message, messageCatalogs } from "../../shared/messages";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { StoreSelector } from "../../shared/store-connection";
import { copyTocItems, selectTocCurrent, type TocItem } from "../../shared/toc-model";

export type { TocItem } from "../../shared/toc-model";

type Entry = TocItem & { target: HTMLElement; heading?: HTMLElement };
/** Real fragment navigation for native headings and registered Heading targets.
 * @csspart root - Named navigation landmark.
 * @csspart list - Ordered link list.
 * @csspart item - One entry.
 * @csspart link - Native fragment link.
 * @csspart indicator - Current-location marker.
 * @fires {CustomEvent<{current:string|undefined}>} acme-current-change - The observed location changes.
 */
export class AcmeToc extends AcmeSemanticElement {
  static styles = [sharedCss, tocCss];
  @atomState() private sourceValue: Element | string | undefined;
  @property({ noAccessor: true, converter: optionalString }) get source(): Element | string | undefined {
    return this.sourceValue;
  }
  set source(value: Element | string | undefined) {
    if (value !== undefined && typeof value !== "string" && value?.nodeType !== 1) throw new TypeError("TOC source requires an Element or selector");
    const previous = this.sourceValue;
    this.sourceValue = value;
    this.requestUpdate("source", previous);
  }
  @atomState() private authoredItems: readonly TocItem[] | undefined;
  @property({ noAccessor: true, attribute: false }) get items(): readonly TocItem[] | undefined {
    return this.authoredItems;
  }
  set items(value: readonly TocItem[] | undefined) {
    const previous = this.authoredItems;
    this.authoredItems = copyTocItems(value);
    this.requestUpdate("items", previous);
  }
  @atomState() private headingLevels: readonly number[] = Object.freeze([2, 3]);
  /** Native heading levels included in discovery. @default [2,3] */
  @property({ noAccessor: true, attribute: false }) get levels(): readonly number[] {
    return this.headingLevels;
  }
  set levels(value: readonly number[]) {
    if (!Array.isArray(value) || value.some((level) => !Number.isInteger(level) || level < 1 || level > 6)) throw new TypeError("TOC levels must be heading levels");
    const previous = this.headingLevels;
    this.headingLevels = Object.freeze([...new Set(value)]);
    this.requestUpdate("levels", previous);
  }
  @atomState() private scrollElement?: Element;
  @property({ noAccessor: true, attribute: false }) get scrollRoot(): Element | undefined {
    return this.scrollElement;
  }
  set scrollRoot(value: Element | undefined) {
    if (value !== undefined && value?.nodeType !== 1) throw new TypeError("scrollRoot must be an Element");
    const previous = this.scrollElement;
    this.scrollElement = value;
    this.requestUpdate("scrollRoot", previous);
  }
  @atomState() private distance = "0px";
  /** Clearance above a target inside its scroll root. @default "0px" */
  @property({ noAccessor: true, useDefault: true }) get offset(): string {
    return this.distance;
  }
  set offset(value: string) {
    if (typeof value !== "string" || !value.trim() || (this.ownerDocument.defaultView?.CSS && !this.ownerDocument.defaultView.CSS.supports("scroll-margin-top", value)))
      throw new TypeError("TOC offset requires a CSS length");
    const previous = this.distance;
    this.distance = value;
    this.requestUpdate("offset", previous);
  }
  @atomState() private treatment: "line" | "minimal" | "numbers" = "line";
  /** @default "line" */
  @property({ noAccessor: true, useDefault: true }) get variant(): "line" | "minimal" | "numbers" {
    return this.treatment;
  }
  set variant(value: "line" | "minimal" | "numbers") {
    if (!["line", "minimal", "numbers"].includes(value)) throw new TypeError("Invalid TOC variant");
    const previous = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", previous);
  }
  @atomState() private entries: readonly Entry[] = [];
  @atomState() private currentId?: string;
  /** Current observed target ID. */
  get current(): string | undefined {
    return this.currentId;
  }
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private sourceRoot?: Document | ShadowRoot | Element;
  private eventRoot?: Document | ShadowRoot;
  private scrollTarget?: EventTarget;
  private observer?: MutationObserver;
  private sourceObserver?: MutationObserver;
  private resize?: ResizeObserver;
  private frame = 0;
  private dirty = true;
  private warning = "";
  private releaseFocus?: () => void;
  private get authorRoot() {
    return this.getRootNode() as Document | ShadowRoot;
  }
  private resolveSource(): Document | ShadowRoot | Element | undefined {
    if (this.source !== undefined && typeof this.source !== "string" && this.source.nodeType === 1) return this.source as Element;
    if (typeof this.source === "string") {
      try {
        return this.authorRoot.querySelector(this.source) ?? undefined;
      } catch {
        console.warn(this.localName, { code: "invalid-toc-source-selector" });
        return undefined;
      }
    }
    return this.authorRoot;
  }
  private invalidate = () => {
    this.dirty = true;
    this.schedule();
  };
  private schedule = () => {
    if (this.frame || !this.isConnected) return;
    this.frame = this.ownerDocument.defaultView!.requestAnimationFrame(() => {
      this.frame = 0;
      if (this.dirty) {
        this.dirty = false;
        this.readTargets();
      }
      this.track();
    });
  };
  private readTargets() {
    const source = this.resolveSource();
    if (source !== this.sourceRoot) {
      this.sourceObserver?.disconnect();
      this.sourceRoot?.removeEventListener(headingTargetsChanged, this.invalidate);
      this.sourceObserver = undefined;
      this.sourceRoot = source;
      if (source) {
        source.addEventListener(headingTargetsChanged, this.invalidate);
        this.sourceObserver = new MutationObserver((records) => {
          if (records.some((record) => !this.contains(record.target))) this.invalidate();
        });
        this.sourceObserver.observe(source, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["id", "hidden", "inert", "class", "style"] });
      }
    }
    if (!source) {
      this.resize?.disconnect();
      if (this.entries.length) this.entries = [];
      return;
    }
    const targets = discoverHeadingTargets(source),
      ids = new Map<string, HTMLElement[]>();
    if (source.nodeType === 1 && (source as Element).id) ids.set((source as Element).id, [source as HTMLElement]);
    for (const element of source.querySelectorAll<HTMLElement>("[id]")) ids.set(element.id, [...(ids.get(element.id) ?? []), element]);
    const headingByTarget = new Map(targets.map((target) => [target.target, target]));
    const raw =
      this.items ??
      targets.filter((target) => this.levels.includes(target.level)).map((target) => ({ id: target.id, href: "#" + encodeURIComponent(target.id), label: target.label, level: target.level }));
    const entries: Entry[] = [],
      seen = new Set<string>(),
      issues: string[] = [];
    for (const item of raw) {
      const matches = ids.get(item.id) ?? [];
      if (!item.id || matches.length !== 1 || seen.has(item.id)) {
        issues.push(item.id || "(missing ID)");
        continue;
      }
      const target = matches[0];
      let url: URL, fragment: string;
      try {
        url = new URL(item.href, this.ownerDocument.baseURI);
        fragment = decodeURIComponent(url.hash.slice(1));
      } catch {
        issues.push(item.id);
        continue;
      }
      const documentUrl = new URL(this.ownerDocument.URL);
      if (url.origin !== documentUrl.origin || url.pathname !== documentUrl.pathname || url.search !== documentUrl.search || fragment !== item.id) {
        issues.push(item.id);
        continue;
      }
      seen.add(item.id);
      const heading = headingByTarget.get(target);
      entries.push(Object.freeze({ ...item, target, heading: heading?.heading }));
    }
    const warning = issues.join("|");
    if (warning && warning !== this.warning) console.warn(this.localName, { code: "toc-targets-missing-or-ambiguous", targets: issues });
    this.warning = warning;
    const same =
      entries.length === this.entries.length &&
      entries.every((entry, index) => {
        const old = this.entries[index];
        return entry.id === old.id && entry.href === old.href && entry.label === old.label && entry.level === old.level && entry.target === old.target && entry.heading === old.heading;
      });
    if (!same) this.entries = Object.freeze(entries);
    this.resize?.disconnect();
    this.resize = new ResizeObserver(this.schedule);
    for (const entry of entries) this.resize.observe(entry.target);
    if (this.scrollRoot) this.resize.observe(this.scrollRoot);
    if (source.nodeType === 1) this.resize.observe(source as Element);
    else if (source.nodeType === 9) this.resize.observe((source as Document).documentElement);
  }
  private offsetPixels() {
    const measure = this.renderRoot?.querySelector<HTMLElement>("[data-offset]");
    return measure ? Number.parseFloat(this.ownerDocument.defaultView!.getComputedStyle(measure).top) || 0 : 0;
  }
  private track() {
    const root = this.scrollRoot,
      document = this.ownerDocument,
      view = document.defaultView!;
    const viewportTop = root ? root.getBoundingClientRect().top + root.clientTop : 0;
    const position = root ? root.scrollTop : view.scrollY;
    const height = root ? root.clientHeight : view.innerHeight;
    const total = root ? root.scrollHeight : document.documentElement.scrollHeight;
    const visible = this.entries.filter((entry) => entry.target.isConnected && entry.target.getClientRects().length && view.getComputedStyle(entry.target).visibility === "visible");
    const current = selectTocCurrent(
      visible.map((entry) => ({ id: entry.id, top: entry.target.getBoundingClientRect().top - viewportTop })),
      this.offsetPixels(),
      total > height + 1 && position + height >= total - 1,
    );
    if (current !== this.currentId) {
      this.currentId = current;
      this.dispatchEvent(new CustomEvent("acme-current-change", { detail: Object.freeze({ current }), bubbles: true, composed: true }));
    }
  }
  private navigate = (event: MouseEvent, entry: Entry) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const document = this.ownerDocument,
      view = document.defaultView!,
      root = this.scrollRoot;
    const top = entry.target.getBoundingClientRect().top - (root ? root.getBoundingClientRect().top + root.clientTop : 0) + (root ? root.scrollTop : view.scrollY) - this.offsetPixels();
    if (view.location.hash !== new URL(entry.href, document.baseURI).hash) view.history.pushState(view.history.state, "", entry.href);
    const target = entry.heading ?? entry.target;
    this.releaseFocus?.();
    const previous = target.getAttribute("tabindex");
    if (previous === null) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    const release = () => {
      target.removeEventListener("blur", release);
      if (previous === null && target.getAttribute("tabindex") === "-1") target.removeAttribute("tabindex");
    };
    target.addEventListener("blur", release, { once: true });
    this.releaseFocus = release;
    (root ?? view).scrollTo({ top, behavior: view.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    this.schedule();
  };
  private connect() {
    const root = this.authorRoot;
    if (root !== this.eventRoot) {
      this.eventRoot?.removeEventListener(headingTargetsChanged, this.invalidate);
      this.eventRoot?.removeEventListener("load", this.schedule, true);
      this.eventRoot = root;
      root.addEventListener(headingTargetsChanged, this.invalidate);
      root.addEventListener("load", this.schedule, true);
      this.observer?.disconnect();
      this.observer = new MutationObserver((records) => {
        if (records.some((record) => record.type === "childList" || record.attributeName === "id")) this.invalidate();
      });
      this.observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["id"] });
    }
    const target = this.scrollRoot ?? this.ownerDocument.defaultView!;
    if (target !== this.scrollTarget) {
      this.scrollTarget?.removeEventListener("scroll", this.schedule);
      this.scrollTarget = target;
      target.addEventListener("scroll", this.schedule, { passive: true });
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.connect();
    this.ownerDocument.defaultView?.addEventListener("resize", this.invalidate);
    this.ownerDocument.defaultView?.addEventListener("hashchange", this.schedule);
    this.invalidate();
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.sourceObserver?.disconnect();
    this.sourceRoot?.removeEventListener(headingTargetsChanged, this.invalidate);
    this.resize?.disconnect();
    this.eventRoot?.removeEventListener(headingTargetsChanged, this.invalidate);
    this.eventRoot?.removeEventListener("load", this.schedule, true);
    this.scrollTarget?.removeEventListener("scroll", this.schedule);
    this.ownerDocument.defaultView?.removeEventListener("resize", this.invalidate);
    this.ownerDocument.defaultView?.removeEventListener("hashchange", this.schedule);
    if (this.frame) this.ownerDocument.defaultView?.cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.eventRoot = undefined;
    this.scrollTarget = undefined;
    this.sourceRoot = undefined;
    this.releaseFocus?.();
    this.releaseFocus = undefined;
    super.disconnectedCallback();
  }
  protected get semanticDefaults() {
    return { label: message(this.themeContext.scope.effective.get().locale, "toc.label", "On this page") };
  }
  protected updated(changes: Map<string, unknown>) {
    if (!this.isConnected) return;
    const measure = this.renderRoot.querySelector<HTMLElement>("[data-offset]")!;
    measure.style.setProperty("--_toc-offset", this.offset);
    this.connect();
    if (["source", "items", "levels", "scrollRoot", "offset"].some((key) => changes.has(key))) this.invalidate();
  }
  render() {
    const minimum = this.entries.length ? Math.min(...this.entries.map((entry) => entry.level)) : 1;
    return html`<nav part="root" data-variant=${this.variant}><ol part="list">${repeat(
      this.entries,
      (entry) => entry.id,
      (entry, index) =>
        html`<li part="item" data-level=${entry.level - minimum}><a part="link" href=${entry.href} aria-current=${entry.id === this.current ? "location" : nothing} @click=${(event: MouseEvent) => this.navigate(event, entry)}><span part="indicator" aria-hidden="true"></span>${this.variant === "numbers" ? html`<span class="number" aria-hidden="true">${index + 1}.</span>` : nothing}${entry.label}</a></li>`,
    )}</ol></nav><span data-offset aria-hidden="true"></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-toc": AcmeToc;
  }
}
