import { SignalWatcher, signal } from "@lit-labs/signals";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import type { ToastVariant } from "../toast/toast.js";
import { toastCss } from "../toast/toast.styles.js";

export type ToastItem = { id: number; text: string; variant: ToastVariant; preserve?: boolean; action?: string; onAction?: () => void };

/** Shared toast queue: `toasts.show("Domain added", {variant: "success"})` from anywhere. */
export const toastQueue = signal<ToastItem[]>([]);

let seq = 0;

export const toasts = {
  show(text: string, opts: Partial<Omit<ToastItem, "id" | "text">> = {}) {
    const item: ToastItem = { id: ++seq, text, variant: opts.variant ?? "", preserve: opts.preserve, action: opts.action, onAction: opts.onAction };
    toastQueue.set([...toastQueue.get(), item]);
    if (!item.preserve) setTimeout(() => toasts.dismiss(item.id), opts.action ? 8000 : 4000);
    return item.id;
  },
  success: (t: string) => toasts.show(t, { variant: "success" }),
  error: (t: string) => toasts.show(t, { variant: "error", preserve: true }),
  warning: (t: string) => toasts.show(t, { variant: "warning" }),
  dismiss(id: number) {
    toastQueue.set(toastQueue.get().filter((t) => t.id !== id));
  },
};

/** Mounts once per page and renders the shared queue, bottom right. */
@customElement("acme-toaster")
export class AcmeToaster extends SignalWatcher(AcmeElement) {
  static styles = [sharedCss, toastCss, buttonCss];
  render() {
    return html`${toastQueue.get().map(
      (t, i) =>
        html`<div class=${this.cls("toast show", { [t.variant]: !!t.variant })} role=${t.action ? "alertdialog" : t.variant === "error" ? "alert" : "status"} style=${`bottom:calc(24px + env(safe-area-inset-bottom) + ${i * 76}px)`}><span>${t.text}</span>${
          t.action
            ? html`<div class="actions"><button class="btn" @click=${() => toasts.dismiss(t.id)}>Dismiss</button><button class="btn primary" @click=${() => {
                t.onAction?.();
                toasts.dismiss(t.id);
              }}>${t.action}</button></div>`
            : html`<button class="x" aria-label="Dismiss toast" @click=${() => toasts.dismiss(t.id)}>${glyph("x")}</button>`
        }</div>`,
    )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-toaster": AcmeToaster;
  }
}
