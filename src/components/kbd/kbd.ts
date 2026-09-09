import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { kbdCss } from "./kbd.styles.js";

/** Geist Keyboard Input: 24px, small 20; one key per element, modifiers via props. */
@customElement("acme-kbd")
export class AcmeKbd extends AcmeElement {
  static styles = [sharedCss, kbdCss, css`:host{display:inline-flex}`];
  @property({ type: Boolean }) small = false;
  @property({ type: Boolean }) meta = false;
  @property({ type: Boolean }) shift = false;
  @property({ type: Boolean }) alt = false;
  @property({ type: Boolean }) ctrl = false;
  @property({ type: Boolean }) mono = false;
  render() {
    const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
    const mods = [this.meta && (mac ? "⌘" : "Ctrl"), this.shift && "⇧", this.alt && (mac ? "⌥" : "Alt"), this.ctrl && "⌃"].filter(Boolean).join("");
    return html`<kbd class=${this.cls("kbd", { sm: this.small, mono: this.mono })} part="kbd">${mods}<slot></slot></kbd>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-kbd": AcmeKbd;
  }
}
