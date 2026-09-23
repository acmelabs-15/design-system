import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { boolish, sharedCss } from "../../base";
import { dialogCss } from "../../generated/components/dialog/dialog.styles";
import { drawerStructureCss } from "../../generated/components/drawer/drawer-structure.styles";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { ComposedParticipants } from "../../shared/composed-participants";
import { type DialogFocusTarget, type DialogOwner, type DialogPart, type DialogReason, dialogContext, dialogPartFor, isDialogBoundary, registerDialogBoundary } from "../../shared/dialog-context";
import { DialogLifetime } from "../../shared/dialog-lifetime";
import { Places } from "../../shared/places";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { StoreSelector } from "../../shared/store-connection";
/** A named edge panel with shared native dialog lifetime and directional motion.
 * @slot trigger - Explicit Drawer Trigger controls.
 * @slot heading - Accessible heading content.
 * @slot description - Accessible description content.
 * @slot header - Additional header content.
 * @slot - Main content.
 * @slot footer - Application actions and close controls.
 * @csspart root - The containing region and focus fallback.
 * @csspart surface - The native dialog surface.
 * @csspart header - Header region.
 * @csspart heading - Heading content.
 * @csspart description - Description content.
 * @csspart body - Main content region.
 * @csspart footer - Action region.
 * @fires {CustomEvent<{open:boolean,reason:DialogReason}>} acme-open-change - A user changes intended visibility.
 * @fires {CustomEvent<{action:"close",reason:DialogReason}>} acme-request - Cancelable request before user dismissal.
 * @fires {CustomEvent<{reason:DialogReason}>} acme-after-open - The owned entrance completes.
 * @fires {CustomEvent<{reason:DialogReason}>} acme-after-close - The owned exit and native cleanup complete.
 */
export class AcmeDrawer extends AcmeSemanticElement {
  static styles = [sharedCss, dialogCss, drawerStructureCss];
  @atomState() private opened = false;
  /** Intended visibility; programmatic assignments remain silent. @default false */
  @property({ noAccessor: true, type: Boolean, reflect: true }) get open(): boolean {
    return this.opened;
  }
  set open(value: boolean) {
    this.transition(Boolean(value), "programmatic");
  }
  @atomState() private modalValue = true;
  /** @default true */
  @property({ noAccessor: true, converter: boolish, useDefault: true }) get modal(): boolean {
    return this.modalValue;
  }
  set modal(value: boolean) {
    const previous = this.modalValue;
    this.modalValue = Boolean(value);
    this.requestUpdate("modal", previous);
  }
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true, attribute: "close-on-escape" }) closeOnEscape = true;
  @atomState() private outside = true;
  /** @default true */
  @property({ noAccessor: true, converter: boolish, useDefault: true, attribute: "close-on-outside" }) get closeOnOutside(): boolean {
    return this.outside;
  }
  set closeOnOutside(value: boolean) {
    const previous = this.outside;
    this.outside = Boolean(value);
    this.requestUpdate("closeOnOutside", previous);
  }
  @atomState() private initialTarget: DialogFocusTarget;
  @property({ noAccessor: true, attribute: "initial-focus", converter: optionalString }) get initialFocus(): DialogFocusTarget {
    return this.initialTarget;
  }
  set initialFocus(value: DialogFocusTarget) {
    this.validateTarget(value);
    const previous = this.initialTarget;
    this.initialTarget = value;
    this.requestUpdate("initialFocus", previous);
  }
  @atomState() private returnTarget: DialogFocusTarget;
  @property({ noAccessor: true, attribute: "return-focus", converter: optionalString }) get returnFocus(): DialogFocusTarget {
    return this.returnTarget;
  }
  set returnFocus(value: DialogFocusTarget) {
    this.validateTarget(value);
    const previous = this.returnTarget;
    this.returnTarget = value;
    this.requestUpdate("returnFocus", previous);
  }
  @atomState() private sizeValue?: string;
  /** Authored axis size; omission uses the acme-drawer-size theme token. */
  @property({ noAccessor: true, converter: optionalString }) get size(): string | undefined {
    return this.sizeValue;
  }
  set size(value: string | undefined) {
    if (
      value !== undefined &&
      (typeof value !== "string" ||
        !value.trim() ||
        /^(initial|inherit|unset|revert)/i.test(value) ||
        (this.ownerDocument.defaultView?.CSS && !this.ownerDocument.defaultView.CSS.supports("width", value)))
    )
      throw new TypeError("Drawer size requires a CSS dimension");
    const previous = this.sizeValue;
    this.sizeValue = value;
    this.requestUpdate("size", previous);
  }
  @atomState() private placementValue: "start" | "end" | "top" | "bottom" = "end";
  /** @default "end" */
  @property({ noAccessor: true, useDefault: true }) get placement(): "start" | "end" | "top" | "bottom" {
    return this.placementValue;
  }
  set placement(value: "start" | "end" | "top" | "bottom") {
    if (!["start", "end", "top", "bottom"].includes(value)) throw new TypeError("Invalid Drawer placement");
    const previous = this.placementValue;
    this.placementValue = value;
    this.requestUpdate("placement", previous);
  }
  private reason: DialogReason = "programmatic";
  private readonly places = new Places(this, { places: ["heading", "description", "header", "footer"] });
  private readonly parts = createAtom<readonly DialogPart[]>([]);
  private readonly state = createAtom(() => ({ open: this.open, alert: false }));
  private readonly owner: DialogOwner = {
    host: this,
    state: this.state,
    register: (part) => {
      this.parts.set((parts) => [...parts, part]);
      return () => this.parts.set((parts) => parts.filter((p) => p !== part));
    },
    request: (open, reason, opener) => this.request(open, reason, opener),
  };
  private readonly provider = new ContextProvider(this, { context: dialogContext, initialValue: this.owner });
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.parts.get(),
    find: dialogPartFor,
    boundary: isDialogBoundary,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
  });
  private readonly lifetime = new DialogLifetime(this, {
    state: () => ({
      open: this.open,
      modal: this.modal,
      alert: false,
      closeOnEscape: this.closeOnEscape,
      closeOnOutside: this.closeOnOutside,
      initialFocus: this.initialFocus,
      returnFocus: this.returnFocus,
      reason: this.reason,
    }),
    surface: () => this.surface,
    body: () => this.renderRoot?.querySelector<HTMLElement>(".frame") ?? undefined,
    focusArea: () => this.renderRoot?.querySelector<HTMLElement>("[part=body]") ?? undefined,
    fallback: () => this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined,
    heading: () => this.headingElement,
    cancel: () =>
      this.parts
        .get()
        .find((part) => part.kind === "cancel")
        ?.target(),
    requestClose: (reason) => this.request(false, reason),
    nativeClosed: () => {
      if (this.open) this.transition(false, "programmatic");
    },
  });
  private readonly themeUpdates = new StoreSelector(this, () => this.lifetime.theme?.effective ?? this.themeContext.scope.effective);
  private get surface() {
    return this.renderRoot?.querySelector<HTMLDialogElement>("dialog") ?? undefined;
  }
  private get headingElement() {
    return this.places.has("heading") ? (this.renderRoot?.querySelector<HTMLElement>("[part=heading]") ?? undefined) : undefined;
  }
  constructor() {
    super();
    registerDialogBoundary(this);
  }
  private validateTarget(value: DialogFocusTarget) {
    if (value !== undefined && typeof value !== "string" && (!value || value.nodeType !== 1)) throw new TypeError("Focus target must be an Element or selector");
  }
  private transition(open: boolean, reason: DialogReason, opener?: HTMLElement) {
    if (open === this.opened) return;
    const previous = this.opened;
    this.reason = reason;
    if (open) this.lifetime?.openingFrom(opener);
    this.opened = open;
    this.requestUpdate("open", previous);
  }
  private request(open: boolean, reason: DialogReason, opener?: HTMLElement) {
    if (open === this.open || !this.isConnected) return;
    if (!open) {
      const request = new CustomEvent("acme-request", { detail: Object.freeze({ action: "close", reason }), bubbles: true, composed: true, cancelable: true });
      if (!this.dispatchEvent(request) || !this.open) return;
    }
    this.transition(open, reason, opener);
    this.dispatchEvent(new CustomEvent("acme-open-change", { detail: Object.freeze({ open, reason }), bubbles: true, composed: true }));
  }
  show() {
    this.open = true;
  }
  hide() {
    this.open = false;
  }
  focus() {
    this.lifetime.focus();
  }
  protected get semanticTarget() {
    return this.surface;
  }
  protected get semanticDefaults() {
    return {
      role: "dialog",
      labelledByElements: this.headingElement ? [this.headingElement] : undefined,
      describedByElements: this.places.has("description") ? [this.renderRoot.querySelector<HTMLElement>("[part=description]")!] : undefined,
    };
  }
  protected updated() {
    const surface = this.surface;
    if (!surface) return;
    if (this.size === undefined) surface.style.removeProperty("--_drawer-size");
    else surface.style.setProperty("--_drawer-size", this.size);
  }
  disconnectedCallback() {
    this.open = false;
    super.disconnectedCallback();
  }
  render() {
    const theme = this.lifetime.theme?.effective;
    return html`<div part="root" aria-label=${this.ariaLabel ?? nothing}><slot name="trigger"></slot><acme-overlay-theme density="normal" .source=${theme} .reference=${this.open || this.lifetime.active ? (this.lifetime.themeReference ?? this) : undefined}><dialog part="surface" data-placement=${this.placement} aria-modal=${String(this.modal)} @cancel=${this.lifetime.cancel} @close=${this.lifetime.nativeClose}><div class="frame"><header part="header" ?hidden=${!this.places.has("heading") && !this.places.has("description") && !this.places.has("header")}><div part="heading" tabindex="-1" ?hidden=${!this.places.has("heading")}><slot name="heading"></slot></div><div part="description" ?hidden=${!this.places.has("description")}><slot name="description"></slot></div><slot name="header"></slot></header><div part="body"><slot></slot></div><footer part="footer" ?hidden=${!this.places.has("footer")}><slot name="footer"></slot></footer></div></dialog></acme-overlay-theme></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-drawer": AcmeDrawer;
  }
}
