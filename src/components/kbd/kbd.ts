import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { kbdCss } from "./kbd.styles";
import { tooltipKbdCss } from "./tooltip-kbd.styles";

/** True on Apple platforms, where the modifiers render as glyphs (⌘ ⌥ ⌃). */
export const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * Keyboard input: a key cap. The root carries the small class; each modifier (⌘ ⇧ ⌥ ⌃, in
 * that order, ⌘ as Ctrl and ⌥ as Alt off Apple platforms) is its own span, the meta span an
 * inline block of 1em, and the key given as content is a span after them. 24px high (small 20),
 * radius 4, the background colour with a 1px ring, a 4px (small 2px) left margin. The host is an
 * inline box, so the key cap keeps its inline-flex box in the line of text around it.
 */
@customElement("acme-kbd")
export class AcmeKbd extends AcmeElement {
  static styles = [
    sharedCss,
    kbdCss,
    // A key inside a tooltip's bubble takes the bubble's rules for it (the tooltip marks the key).
    tooltipKbdCss,
    css`
      /* The reference's key is one element: inline-flex in prose, and blockified to flex when a flex
         row holds it, so the row sizes to the key's own 20px rather than to a line box. A host box of
         ours would sit between the row and the key and take that place instead, so the host stands
         aside and the key is the box every container lays out. */
      :host {
        display: contents;
      }
    `,
  ];
  @property({ type: Boolean }) small = false;
  @property({ type: Boolean }) meta = false;
  @property({ type: Boolean }) shift = false;
  @property({ type: Boolean }) alt = false;
  @property({ type: Boolean }) ctrl = false;
  @atomState() private hasKey = false;

  connectedCallback() {
    super.connectedCallback();
    this.scan();
  }
  firstUpdated() {
    this.scan();
  }
  private scan() {
    this.hasKey = Array.from(this.childNodes).some((n) => n.nodeType === 1 || (n.nodeType === 3 && !!n.textContent?.trim()));
  }

  render() {
    const mac = isMac();
    const slot = html`<slot @slotchange=${this.scan}></slot>`;
    return html`<kbd class=${this.cls("kbd", { sm: this.small })} part="kbd"
      >${this.meta ? html`<span class="key" style="min-width:1em;display:inline-block">${mac ? "⌘" : "Ctrl"}</span>` : nothing}${this.shift ? html`<span class="key">⇧</span>` : nothing}${
        this.alt ? html`<span class="key">${mac ? "⌥" : "Alt"}</span>` : nothing
      }${this.ctrl ? html`<span class="key">${mac ? "⌃" : "Ctrl"}</span>` : nothing}${this.hasKey ? html`<span class="key">${slot}</span>` : slot}</kbd
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-kbd": AcmeKbd;
  }
}
