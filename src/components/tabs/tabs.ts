import { createAtom } from "@tanstack/lit-store";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { StoreEffect } from "../../shared/state";
import { optionalString } from "../../shared/attributes";
import { TabRegistry, tabOrder, type TabPart, type TabOwner, type TabsState } from "../../shared/tab-parts";
import { RovingTabindex } from "../../shared/roving-tabindex";
import type { IndicatorGeometry } from "../../internal/selection-indicator/selection-indicator";
import { tabsStructureCss } from "../../generated/components/tabs/tabs-structure.styles";
/** One selected tab and its related content panels.
 * @slot - Tab members, optionally wrapped for presentation.
 * @slot panels - Tab Panel members.
 * @csspart root - The tab and panel layout.
 * @csspart list - The named tablist and scrolling region.
 * @csspart indicator - The moving selected surface.
 * @csspart panels - The content region.
 * @fires {CustomEvent<{value:string}>} acme-change - The user selects a different tab.
 */
export class AcmeTabs extends AcmeSemanticElement {
  static styles = [sharedCss, tabsStructureCss];
  private readonly selection = createAtom<Readonly<{ value?: string; initialized: boolean }>>(Object.freeze({ initialized: false }));
  @property({ noAccessor: true, converter: optionalString }) get value() {
    return this.selection.get().value;
  }
  set value(value: string | undefined) {
    if (value !== undefined && (typeof value !== "string" || !value)) {
      throw new TypeError("Tab value must be a nonempty string or undefined");
    }
    this.selection.set(Object.freeze({ value, initialized: true }));
    this.synchronize();
    this.requestUpdate("value");
  }
  @atomState() private direction: "horizontal" | "vertical" = "horizontal";
  /** @default "horizontal" */
  @property({ noAccessor: true, converter: optionalString }) get orientation(): "horizontal" | "vertical" {
    return this.direction;
  }
  set orientation(value: "horizontal" | "vertical" | undefined) {
    const next = value ?? "horizontal";
    if (!["horizontal", "vertical"].includes(next)) {
      throw new TypeError("Invalid tab orientation");
    }
    this.direction = next;
    this.synchronize();
    this.requestUpdate("orientation");
  }
  @atomState() private mode: "automatic" | "manual" = "automatic";
  /** @default "automatic" */
  @property({ noAccessor: true, converter: optionalString }) get activation(): "automatic" | "manual" {
    return this.mode;
  }
  set activation(value: "automatic" | "manual" | undefined) {
    const next = value ?? "automatic";
    if (!["automatic", "manual"].includes(next)) {
      throw new TypeError("Invalid tab activation");
    }
    this.mode = next;
    this.requestUpdate("activation");
  }
  @atomState() private treatment: "primary" | "inset" = "primary";
  /** @default "primary" */
  @property({ noAccessor: true, converter: optionalString }) get variant(): "primary" | "inset" {
    return this.treatment;
  }
  set variant(value: "primary" | "inset" | undefined) {
    const next = value ?? "primary";
    if (!["primary", "inset"].includes(next)) {
      throw new TypeError("Invalid tab variant");
    }
    this.treatment = next;
    this.requestUpdate("variant");
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "lazy-mount" }) lazyMount = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "unmount-on-exit" }) unmountOnExit = false;
  private readonly state = createAtom<TabsState>(() =>
    Object.freeze({
      value: this.value,
      orientation: this.orientation,
      activation: this.activation,
      variant: this.variant,
      disabled: this.disabled,
      lazyMount: this.lazyMount,
      unmountOnExit: this.unmountOnExit,
    }),
  );
  private readonly focused = createAtom<{ member?: TabPart }>({});
  private readonly owner: TabOwner = {
    state: this.state,
    selected: (member) => (member.kind === "tab" ? this.selected() === member : !!this.selected() && this.counterpart(this.selected()!) === member),
    select: (member) => this.select(member),
    focus: (member) => this.focusedPart(member),
    tabindex: (member) => (this.entry() === member ? 0 : -1),
    counterpart: (member) => this.counterpart(member),
    synchronize: () => this.synchronize(),
    remove: (member) => this.registry.remove(member),
  };
  private readonly registry = new TabRegistry(this, this.owner);
  private readonly view = createAtom(() => ({
    state: this.state.get(),
    members: this.registry.members.get().map((member) => ({ member, value: member.value(), disabled: member.disabled() })),
    focused: this.focused.get(),
  }));
  private readonly viewUpdates = new StoreSelector(this, () => this.view);
  private readonly syncUpdates = new StoreEffect(
    this,
    () => this.view,
    () => this.synchronize(),
  );
  private readonly roving = new RovingTabindex(this, {
    items: () => this.available().flatMap((member) => member.target() ?? []),
    current: () => 0,
    orientation: () => this.orientation,
    rtl: () => getComputedStyle(this).direction === "rtl",
    wrap: true,
    homeEnd: true,
    onMove: () => {},
  });
  private observer?: ResizeObserver;
  private mutation?: MutationObserver;
  private readonly observed = new Set<HTMLElement>();
  private syncing = false;
  private diagnostic = "";
  private list() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=list]");
  }
  private tabs() {
    return [...this.registry.members.get()].filter((member) => member.kind === "tab").sort(tabOrder);
  }
  private available() {
    if (this.disabled) {
      return [];
    }
    return this.tabs().filter((member) => {
      const target = member.target();
      return !!member.value() && !member.disabled() && !!target?.isConnected && !!target.getClientRects().length && getComputedStyle(target).visibility === "visible";
    });
  }
  private selected() {
    return this.tabs().find((member) => !!member.value() && member.value() === this.value);
  }
  private entry() {
    const available = this.available(),
      focused = this.focused.get().member;
    return focused && available.includes(focused) ? focused : (available.find((member) => member === this.selected()) ?? available[0]);
  }
  private counterpart(member: TabPart) {
    if (!member.value()) {
      return undefined;
    }
    const kind = member.kind === "tab" ? "panel" : "tab";
    return [...this.registry.members.get()].filter((part) => part.kind === kind && part.value() === member.value()).sort(tabOrder)[0];
  }
  private synchronize() {
    if (this.syncing || !this.registry) {
      return;
    }
    this.syncing = true;
    try {
      const members = this.registry.members.get();
      if (!this.selection.get().initialized) {
        const first = this.disabled ? undefined : this.tabs().find((member) => member.value() && !member.disabled() && !member.host.hidden);
        if (first) {
          this.selection.set(Object.freeze({ value: first.value(), initialized: true }));
        }
      }
      for (const member of members) {
        member.synchronize();
      }
      const targets = new Set<HTMLElement>(members.map((member) => member.host));
      if (this.observer) {
        for (const target of this.observed) {
          if (!targets.has(target)) {
            this.observer.unobserve(target);
            this.observed.delete(target);
          }
        }
        for (const target of targets) {
          if (!this.observed.has(target)) {
            this.observer.observe(target);
            this.observed.add(target);
          }
        }
      }
      const invalid =
        members.some((member) => !member.value()) ||
        (["tab", "panel"] as const).some((kind) => {
          const values = members.filter((member) => member.kind === kind).map((member) => member.value());
          return new Set(values).size !== values.length;
        });
      const signature = invalid ? "invalid-tab-values" : "";
      if (signature && signature !== this.diagnostic) {
        console.warn(this.localName, { code: signature });
      }
      this.diagnostic = signature;
    } finally {
      this.syncing = false;
    }
  }
  private select(member: TabPart) {
    if (!this.available().includes(member) || this.value === member.value()) {
      return;
    }
    this.selection.set(Object.freeze({ value: member.value(), initialized: true }));
    this.synchronize();
    this.scrollToMember(member);
    this.dispatchEvent(new CustomEvent<{ value: string }>("acme-change", { detail: { value: member.value() }, bubbles: true, composed: true }));
  }
  private focusedPart(member: TabPart) {
    if (!this.available().includes(member)) {
      return;
    }
    this.focused.set({ member });
    if (this.activation === "automatic") {
      this.select(member);
    }
    this.synchronize();
    this.scrollToMember(member);
  }
  private scrollToMember(member: TabPart) {
    const list = this.list(),
      target = member.target();
    if (!list || !target) {
      return;
    }
    const viewport = list.getBoundingClientRect(),
      box = target.getBoundingClientRect();
    if (this.orientation === "horizontal") {
      const left =
        box.width > viewport.width
          ? getComputedStyle(this).direction === "rtl"
            ? box.right - viewport.right
            : box.left - viewport.left
          : box.left < viewport.left
            ? box.left - viewport.left
            : box.right > viewport.right
              ? box.right - viewport.right
              : 0;
      if (left) {
        list.scrollBy({ left: left > 0 ? Math.ceil(left) : Math.floor(left), behavior: "instant" });
      }
    } else {
      const top = box.top < viewport.top ? box.top - viewport.top : box.bottom > viewport.bottom ? box.bottom - viewport.bottom : 0;
      if (top) {
        list.scrollBy({ top: top > 0 ? Math.ceil(top) : Math.floor(top), behavior: "instant" });
      }
    }
  }
  private keydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || this.disabled) {
      return;
    }
    const origin = event.composedPath()[0];
    const available = this.available(),
      index = available.findIndex((member) => member.target() === origin);
    if (index >= 0 && this.roving.handleKey(event, index)) {
      event.stopPropagation();
    }
  };
  private focusout = () =>
    queueMicrotask(() => {
      if (!this.list()?.matches(":focus-within")) {
        this.focused.set({});
        this.synchronize();
      }
    });
  private geometry: IndicatorGeometry = (target, frame, orientation) => {
    if (this.variant === "inset") {
      return target;
    }
    const length = Math.max(24, (orientation === "horizontal" ? target.width : target.height) - 4);
    return orientation === "horizontal"
      ? { x: target.x + (target.width - length) / 2, y: frame.height - 3, width: length, height: 3 }
      : { x: getComputedStyle(this).direction === "rtl" ? frame.width - 3 : 0, y: target.y + (target.height - length) / 2, width: 3, height: length };
  };
  protected get semanticTarget() {
    return this.list() ?? undefined;
  }
  protected get semanticDefaults() {
    return { role: "tablist" };
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this.keydown);
    this.addEventListener("focusout", this.focusout);
    this.observer = new ResizeObserver(() => this.synchronize());
    this.observer.observe(this);
    this.mutation = new MutationObserver(() => {
      this.synchronize();
      this.renderRoot.querySelector("acme-selection-indicator")?.refresh();
    });
    this.mutation.observe(this, { subtree: true, attributes: true, attributeFilter: ["hidden", "inert", "style", "class", "dir"] });
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this.keydown);
    this.removeEventListener("focusout", this.focusout);
    this.observer?.disconnect();
    this.observer = undefined;
    this.observed.clear();
    this.mutation?.disconnect();
    this.mutation = undefined;
    this.focused.set({});
    super.disconnectedCallback();
  }
  protected updated() {
    this.synchronize();
    this.renderRoot.querySelector("acme-selection-indicator")?.refresh();
  }
  focus(options?: FocusOptions) {
    this.entry()?.target()?.focus(options);
  }
  render() {
    const selected = this.selected(),
      inset = this.variant === "inset";
    return html`<div class="tabs" part="root" data-orientation=${this.orientation} data-variant=${this.variant}><div class="viewport" part="list" aria-orientation=${this.orientation} aria-disabled=${this.disabled ? "true" : nothing}><div class="list"><acme-group ?attached=${inset} ?outline=${inset} .orientation=${this.orientation} .gap=${inset ? 0 : 6}><slot></slot></acme-group><acme-selection-indicator exportparts="paint:indicator" .target=${inset ? selected?.target() : selected?.indicatorTarget()} .orientation=${this.orientation} .geometry=${this.geometry}></acme-selection-indicator></div></div><div class="panels" part="panels"><slot name="panels"></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-tabs": AcmeTabs;
  }
}
