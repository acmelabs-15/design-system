import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { tabbable } from "tabbable";
import { boolish, sharedCss } from "../../base";
import { helpSurfaceCss } from "../../generated/shared/help-surface.styles";
import { AnchoredHelp, type HelpAlign, type HelpSide } from "../../shared/anchored-help";
import { atomState } from "../../shared/atom-state";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { message, messageCatalogs } from "../../shared/messages";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { StoreSelector } from "../../shared/store-connection";
import type { AcmeButton } from "../button/button";
/** Explicitly activated nonmodal help with application-owned links and actions.
 * @slot trigger - Required label content for the native trigger button.
 * @slot - Interactive help content.
 * @csspart trigger - Trigger button.
 * @csspart content - Native nonmodal help surface.
 * @csspart arrow - Decorative pointing arrow.
 * @csspart close - Explicit close control.
 * @fires {CustomEvent<{open:boolean,reason:string}>} acme-open-change - User visibility changes.
 * @fires {CustomEvent<{action:"close",reason:string}>} acme-request - Cancelable dismissal.
 */
export class AcmeToggleTip extends AcmeSemanticElement {
  static styles = [sharedCss, helpSurfaceCss];
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) open = false;
  @atomState() private edge: HelpSide = "bottom";
  /** @default "bottom" */
  @property({ noAccessor: true, useDefault: true }) get side(): HelpSide {
    return this.edge;
  }
  set side(value: HelpSide) {
    if (!["top", "bottom", "left", "right"].includes(value)) throw new TypeError("Invalid help side");
    const previous = this.edge;
    this.edge = value;
    this.requestUpdate("side", previous);
  }
  @atomState() private alignment: HelpAlign = "start";
  /** @default "start" */
  @property({ noAccessor: true, useDefault: true }) get align(): HelpAlign {
    return this.alignment;
  }
  set align(value: HelpAlign) {
    if (!["start", "center", "end"].includes(value)) throw new TypeError("Invalid help alignment");
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
    if (!Number.isFinite(value) || value < 0) throw new RangeError("Help distance requires a nonnegative finite number");
    const previous = this.gap;
    this.gap = value;
    this.requestUpdate("sideOffset", previous);
  }
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true, attribute: "close-on-escape" }) closeOnEscape = true;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true, attribute: "close-on-outside" }) closeOnOutside = true;
  private focusOnOpen = false;
  private readonly lifetime = new AnchoredHelp(this, {
    open: () => this.open,
    anchor: () => this.trigger(),
    surface: () => this.surface(),
    arrow: () => this.renderRoot?.querySelector<HTMLElement>("[part=arrow]") ?? undefined,
    placement: () => ({ side: this.side, align: this.align, sideOffset: this.sideOffset }),
    closeOnEscape: () => this.closeOnEscape,
    closeOnOutside: () => this.closeOnOutside,
    dismiss: (reason) => this.userOpen(false, reason),
    closed: () => {
      this.open = false;
    },
    opened: () => {
      if (this.focusOnOpen) {
        const surface = this.surface();
        if (surface) (tabbable(surface, { getShadowRoot: true })[0] ?? surface).focus({ preventScroll: true });
      }
      this.focusOnOpen = false;
    },
    restoreFocus: () => true,
  });
  private readonly themeUpdates = new StoreSelector(this, () => this.lifetime.theme ?? this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private trigger() {
    return this.renderRoot?.querySelector<AcmeButton>("acme-button[part=trigger]") ?? undefined;
  }
  private surface() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=content]") ?? undefined;
  }

  private userOpen(open: boolean, reason: string) {
    if (open === this.open) return;
    if (!open && !this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "close", reason }), bubbles: true, composed: true, cancelable: true }))) return;
    this.open = open;
    this.dispatchEvent(new CustomEvent("acme-open-change", { detail: Object.freeze({ open, reason }), bubbles: true, composed: true }));
  }
  private toggle = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    this.focusOnOpen = event.detail === 0 && !this.open;
    this.userOpen(!this.open, "trigger");
  };
  private focusOut = () => {
    queueMicrotask(() => {
      const active = deepActiveElement(this.ownerDocument);
      if (this.open && this.closeOnOutside && active && !composedContains(this, active)) this.userOpen(false, "focus-outside");
    });
  };
  private readonly documentFocus = () => {
    if (this.open) this.focusOut();
  };
  private focusDocument?: Document;
  connectedCallback() {
    super.connectedCallback();
    this.focusDocument = this.ownerDocument;
    this.focusDocument.addEventListener("focusin", this.documentFocus);
  }
  protected get semanticTarget() {
    return this.surface();
  }
  protected get semanticDefaults() {
    return { role: "dialog", labelledByElements: this.trigger() ? [this.trigger()!] : undefined };
  }
  protected updated() {
    const trigger = this.trigger(),
      surface = this.surface();
    if (trigger) {
      trigger.ariaExpanded = String(this.open);
      trigger.ariaHasPopup = "dialog";
      trigger.ariaControlsElements = surface ? [surface] : null;
    }
  }
  disconnectedCallback() {
    this.focusDocument?.removeEventListener("focusin", this.documentFocus);
    this.focusDocument = undefined;
    this.open = false;
    this.focusOnOpen = false;
    super.disconnectedCallback();
  }
  render() {
    return html`<acme-button part="trigger" variant="secondary" .ariaLabel=${this.ariaLabel} @click=${this.toggle} @focusout=${this.focusOut}><slot name="trigger" @slotchange=${() => this.requestUpdate()}></slot></acme-button><acme-overlay-theme .source=${this.lifetime.theme} .reference=${this.lifetime.active ? this.lifetime.reference : undefined}><div part="content" data-kind="toggle-tip" popover="manual" role="dialog" tabindex="-1" @focusout=${this.focusOut}><span part="arrow" aria-hidden="true"></span><div class="preview"><slot></slot></div><acme-button part="close" size="small" variant="secondary" @click=${() => this.userOpen(false, "close-control")}>${message(this.themeContext.scope.effective.get().locale, "help.close", "Close")}</acme-button></div></acme-overlay-theme>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-toggle-tip": AcmeToggleTip;
  }
}
