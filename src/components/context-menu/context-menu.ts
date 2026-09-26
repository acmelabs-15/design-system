import { html } from "lit";
import { property } from "lit/decorators.js";
import { atomState } from "../../shared/atom-state";
import { AcmeMenu } from "../menu/menu";
/** Contextual actions opened from a native context-menu gesture or a held touch.
 * @slot - The trigger region.
 * @slot content - Menu Content.
 */
export class AcmeContextMenu extends AcmeMenu {
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) disabled = false;
  private press?: { id: number; x: number; y: number; timer: ReturnType<typeof setTimeout> };
  private suppressClick = false;
  private listeningDocument?: Document;
  protected get opener() {
    return this.renderRoot.querySelector<HTMLElement>("[part=trigger]") ?? undefined;
  }
  private inContent(event: Event) {
    return event.composedPath().some((node) => node instanceof Element && node.localName === "acme-menu-content");
  }
  private point(x: number, y: number) {
    const region = this.opener;
    if (!region || this.disabled) {
      return;
    }
    this.showAt({ contextElement: region, getBoundingClientRect: () => new DOMRect(x, y, 0, 0) }, region);
  }
  private cancelPress = () => {
    if (this.press) {
      clearTimeout(this.press.timer);
    }
    this.press = undefined;
  };
  private onContext = (event: MouseEvent) => {
    if (this.disabled || event.defaultPrevented || this.inContent(event)) {
      return;
    }
    event.preventDefault();
    this.cancelPress();
    const box = this.opener!.getBoundingClientRect();
    this.point(event.clientX || event.clientY ? event.clientX : box.left, event.clientX || event.clientY ? event.clientY : box.bottom);
  };
  private onKey = (event: KeyboardEvent) => {
    if (this.disabled || event.defaultPrevented || event.isComposing || this.inContent(event)) {
      return;
    }
    if (event.key === "ContextMenu" || (event.key === "F10" && event.shiftKey)) {
      event.preventDefault();
      const box = this.opener!.getBoundingClientRect();
      this.point(box.left, box.bottom);
    }
  };
  constructor() {
    super();
    this.addEventListener("contextmenu", this.onContext);
    this.addEventListener("keydown", this.onKey);
    this.addEventListener("pointerdown", (event) => {
      this.cancelPress();
      this.suppressClick = false;
      if (this.disabled || this.inContent(event) || !event.isPrimary || event.pointerType === "mouse" || event.button !== 0) {
        return;
      }
      const { pointerId: id, clientX: x, clientY: y } = event;
      this.press = {
        id,
        x,
        y,
        timer: setTimeout(() => {
          this.press = undefined;
          if (!this.disabled && this.isConnected) {
            this.suppressClick = true;
            this.point(x, y);
          }
        }, 700),
      };
    });
    this.addEventListener("pointermove", (event) => {
      if (this.press && (event.pointerId !== this.press.id || Math.hypot(event.clientX - this.press.x, event.clientY - this.press.y) > 10)) {
        this.cancelPress();
      }
    });
    this.addEventListener(
      "click",
      (event) => {
        if (this.suppressClick && !this.inContent(event)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.suppressClick = false;
        }
      },
      true,
    );
  }
  connectedCallback() {
    super.connectedCallback();
    this.listeningDocument = this.ownerDocument;
    this.ownerDocument.addEventListener("pointerup", this.cancelPress, true);
    this.ownerDocument.addEventListener("pointercancel", this.cancelPress, true);
    this.ownerDocument.addEventListener("scroll", this.cancelPress, true);
    this.ownerDocument.defaultView?.addEventListener("blur", this.cancelPress);
  }
  disconnectedCallback() {
    this.cancelPress();
    this.listeningDocument?.removeEventListener("pointerup", this.cancelPress, true);
    this.listeningDocument?.removeEventListener("pointercancel", this.cancelPress, true);
    this.listeningDocument?.removeEventListener("scroll", this.cancelPress, true);
    this.listeningDocument?.defaultView?.removeEventListener("blur", this.cancelPress);
    this.listeningDocument = undefined;
    super.disconnectedCallback();
  }
  protected willUpdate(changes: Map<string, unknown>) {
    if (this.disabled) {
      this.cancelPress();
      if (this.open) {
        this.hide();
      }
    }
    super.willUpdate(changes);
  }
  render() {
    return html`<div part="trigger" tabindex="0"><slot></slot></div><slot name="content"></slot>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-context-menu": AcmeContextMenu;
  }
}
