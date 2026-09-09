import { property, query } from "lit/decorators.js";
import { AcmeElement } from "../base.js";

export const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Shared open/close behavior for dialog-like elements: focus trap, Escape, scroll lock, focus return. */
export abstract class Overlay extends AcmeElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, attribute: "no-dismiss" }) noDismiss = false;
  @query("dialog") dialog!: HTMLDialogElement;
  private opener: Element | null = null;
  protected onCancel = (e: Event) => {
    e.preventDefault();
    if (!this.noDismiss) this.close();
  };
  show() {
    this.open = true;
  }
  close() {
    this.open = false;
  }
  updated(ch: Map<string, unknown>) {
    if (!ch.has("open") || !this.dialog) return;
    if (this.open) {
      this.opener = document.activeElement;
      if (!this.dialog.open) this.dialog.showModal();
      document.body.style.overflow = "hidden";
      this.dispatchEvent(new CustomEvent("acme-open", { bubbles: true }));
    } else if (this.dialog.open) {
      this.dialog.close();
      document.body.style.overflow = "";
      (this.opener as HTMLElement | null)?.focus?.();
      this.dispatchEvent(new CustomEvent("acme-close", { bubbles: true }));
    }
  }
  protected backdropClick(e: MouseEvent) {
    if (e.target === this.dialog && !this.noDismiss) this.close();
  }
}
