import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { focusable } from "tabbable";
import { AcmeElement, sharedCss } from "../base";
import { helpSurfaceCss } from "../generated/shared/help-surface.styles";
import { AnchoredHelp, type HelpAlign, type HelpSide } from "./anchored-help";
import { atomState } from "./atom-state";
import { composedContains, deepActiveElement } from "./composed-tree";
import { Places } from "./places";
import { StoreSelector } from "./store-connection";
import { TargetDescription } from "./target-description";
/** Shared hover/focus preview policy; application controls stay in the trigger. */
export abstract class AcmeHoverHelp extends AcmeElement {
  static styles = [sharedCss, helpSurfaceCss];
  protected get initialValues(): Readonly<{ side: HelpSide; align: HelpAlign; openDelay: number; closeDelay: number }> {
    return { side: "top", align: "center", openDelay: 0, closeDelay: 100 };
  }
  constructor() {
    super();
    // Record public defaults before attributes can override the atom-backed accessors.
    for (const name of ["side", "align", "sideOffset", "openDelay", "closeDelay"]) {
      this.requestUpdate(name, undefined);
    }
  }
  protected abstract get kind(): "tooltip" | "hover-card";
  protected abstract previewText(): string;
  @atomState() private opened = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean, reflect: true }) get open() {
    return this.opened;
  }
  set open(value: boolean) {
    const previous = this.opened;
    this.opened = Boolean(value) && !this.disabled;
    this.requestUpdate("open", previous);
  }
  @atomState() private unavailable = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get disabled() {
    return this.unavailable;
  }
  set disabled(value: boolean) {
    const previous = this.unavailable;
    this.unavailable = Boolean(value);
    if (this.unavailable) {
      this.cancelTimers();
      this.open = false;
    }
    this.requestUpdate("disabled", previous);
  }
  @atomState() private edge: HelpSide = this.initialValues.side;
  /** @default "top" */
  @property({ noAccessor: true, useDefault: true }) get side(): HelpSide {
    return this.edge;
  }
  set side(value: HelpSide) {
    if (!["top", "bottom", "left", "right"].includes(value)) {
      throw new TypeError("Invalid help side");
    }
    const previous = this.edge;
    this.edge = value;
    this.requestUpdate("side", previous);
  }
  @atomState() private alignment: HelpAlign = this.initialValues.align;
  /** @default "center" */
  @property({ noAccessor: true, useDefault: true }) get align(): HelpAlign {
    return this.alignment;
  }
  set align(value: HelpAlign) {
    if (!["start", "center", "end"].includes(value)) {
      throw new TypeError("Invalid help alignment");
    }
    const previous = this.alignment;
    this.alignment = value;
    this.requestUpdate("align", previous);
  }
  @atomState() private gap = 4;
  /** @default 4 */
  @property({ noAccessor: true, type: Number, useDefault: true, attribute: "side-offset" }) get sideOffset() {
    return this.gap;
  }
  set sideOffset(value: number) {
    this.validateNumber(value);
    const previous = this.gap;
    this.gap = value;
    this.requestUpdate("sideOffset", previous);
  }
  @atomState() private waitOpen = this.initialValues.openDelay;
  /** @default 0 */
  @property({ noAccessor: true, type: Number, useDefault: true, attribute: "open-delay" }) get openDelay() {
    return this.waitOpen;
  }
  set openDelay(value: number) {
    this.validateNumber(value);
    const previous = this.waitOpen;
    this.waitOpen = value;
    this.requestUpdate("openDelay", previous);
  }
  @atomState() private waitClose = this.initialValues.closeDelay;
  /** @default 100 */
  @property({ noAccessor: true, type: Number, useDefault: true, attribute: "close-delay" }) get closeDelay() {
    return this.waitClose;
  }
  set closeDelay(value: number) {
    this.validateNumber(value);
    const previous = this.waitClose;
    this.waitClose = value;
    this.requestUpdate("closeDelay", previous);
  }
  private validateNumber(value: number) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError("Help distance and delay require nonnegative finite numbers");
    }
  }
  private readonly places = new Places(this, { places: ["", "content"] });
  private readonly description = new TargetDescription(this);
  protected readonly lifetime = new AnchoredHelp(this, {
    open: () => this.open,
    anchor: () => this.anchor(),
    surface: () => this.surface(),
    arrow: () => this.renderRoot?.querySelector<HTMLElement>("[part=arrow]") ?? undefined,
    placement: () => ({ side: this.side, align: this.align, sideOffset: this.sideOffset }),
    closeOnEscape: () => true,
    closeOnOutside: () => true,
    dismiss: (reason) => {
      this.dismissed = true;
      this.cancelTimers();
      this.userOpen(false, reason);
    },
    closed: () => {
      this.open = false;
    },
    opened: () => {
      /* Opening a preview does not move focus or start another action. */
    },
    restoreFocus: () => false,
  });
  private readonly updates = new StoreSelector(this, () => this.lifetime.theme ?? this.themeContext.scope.effective);
  private pointer = false;
  private contentPointer = false;
  private focused = false;
  private dismissed = false;
  private openTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;
  private observer?: MutationObserver;
  private surface() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=content]") ?? undefined;
  }
  private trigger() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  private anchor() {
    const wrapper = this.trigger();
    if (!wrapper || !this.places.has("")) {
      return undefined;
    }
    const control = focusable(wrapper, { getShadowRoot: true }).find((element): element is HTMLElement => element.namespaceURI === "http://www.w3.org/1999/xhtml");
    const assigned = this.renderRoot.querySelector<HTMLSlotElement>("slot:not([name])")?.assignedElements({ flatten: true })[0];
    return control ?? (assigned?.namespaceURI === "http://www.w3.org/1999/xhtml" ? (assigned as HTMLElement) : wrapper);
  }
  protected contentText() {
    return this.places.has("content")
      ? [...(this.renderRoot.querySelector<HTMLSlotElement>("slot[name=content]")?.assignedNodes({ flatten: true }) ?? [])]
          .map((node) => node.textContent ?? "")
          .join(" ")
          .trim()
      : this.previewText();
  }
  private cancelTimers() {
    clearTimeout(this.openTimer);
    clearTimeout(this.closeTimer);
    this.openTimer = undefined;
    this.closeTimer = undefined;
  }
  private userOpen(open: boolean, reason: string) {
    if ((open && (this.disabled || this.dismissed || (!this.contentText() && !this.places.has("content")))) || open === this.open) {
      return;
    }
    this.open = open;
    this.dispatchEvent(new CustomEvent("acme-open-change", { detail: Object.freeze({ open, reason }), bubbles: true, composed: true }));
  }
  private reconcile = () => {
    if (this.disabled) {
      return;
    }
    const desired = this.pointer || this.contentPointer || this.focused;
    if (desired) {
      clearTimeout(this.closeTimer);
      if (this.open || this.openTimer || this.dismissed) {
        return;
      }
      this.openTimer = setTimeout(() => {
        this.openTimer = undefined;
        if (this.pointer || this.contentPointer || this.focused) {
          this.userOpen(true, "interaction");
        }
      }, this.openDelay);
    } else {
      this.dismissed = false;
      clearTimeout(this.openTimer);
      this.openTimer = undefined;
      clearTimeout(this.closeTimer);
      this.closeTimer = setTimeout(() => {
        this.closeTimer = undefined;
        if (!this.pointer && !this.contentPointer && !this.focused) {
          this.userOpen(false, "leave");
        }
      }, this.closeDelay);
    }
  };
  private triggerEnter = (event: PointerEvent) => {
    if (event.pointerType === "touch") {
      return;
    }
    this.pointer = true;
    this.reconcile();
  };
  private triggerLeave = (event: PointerEvent) => {
    if (event.pointerType === "touch") {
      return;
    }
    this.pointer = false;
    this.reconcile();
  };
  private focusIn = () => {
    this.focused = true;
    this.reconcile();
  };
  private focusOut = () => {
    queueMicrotask(() => {
      const active = deepActiveElement(this.ownerDocument);
      this.focused = !!active && !!this.trigger() && composedContains(this.trigger()!, active);
      this.reconcile();
    });
  };
  private changed = () => this.requestUpdate();
  connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver(this.changed);
    this.observer.observe(this, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["slot", "disabled"] });
  }
  disconnectedCallback() {
    this.cancelTimers();
    this.observer?.disconnect();
    this.observer = undefined;
    this.pointer = false;
    this.contentPointer = false;
    this.focused = false;
    this.dismissed = false;
    this.open = false;
    super.disconnectedCallback();
  }
  protected updated() {
    const anchor = this.anchor();
    this.description.update(!this.disabled ? anchor : undefined, this.contentText());
    if (this.open && (!anchor || (!this.contentText() && !this.places.has("content")))) {
      this.open = false;
    }
  }
  render() {
    return html`<span part="root" @pointerenter=${this.triggerEnter} @pointerleave=${this.triggerLeave} @focusin=${this.focusIn} @focusout=${this.focusOut}><slot @slotchange=${this.changed}></slot></span><acme-overlay-theme .source=${this.lifetime.theme} .reference=${this.lifetime.active ? this.lifetime.reference : undefined}><div part="content" popover="manual" role=${this.kind === "tooltip" ? "tooltip" : nothing} aria-label=${this.kind === "tooltip" ? this.contentText() : nothing} data-kind=${this.kind} @pointerenter=${(
      event: PointerEvent,
    ) => {
      if (event.pointerType !== "touch") {
        this.contentPointer = true;
        this.reconcile();
      }
    }} @pointerleave=${() => {
      this.contentPointer = false;
      this.reconcile();
    }}><span part="arrow" aria-hidden="true"></span><div class="preview" inert>${this.places.has("content") ? html`<slot name="content" @slotchange=${this.changed}></slot>` : html`${this.previewText()}<slot name="content" @slotchange=${this.changed}></slot>`}</div></div></acme-overlay-theme>`;
  }
}
