import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { loadingDotsCss } from "./loading-dots.styles";

/**
 * Loading dots: three dots blinking in turn, after any content the element holds. The root
 * carries the size class and `aria-label="Loading"`; content sits in a wrapper with a right
 * margin, then the three dot spans (the second and third delayed). Dot sizes sm 2 · md 3 · lg 4,
 * or a number of pixels.
 */
@customElement("acme-loading-dots")
export class AcmeLoadingDots extends AcmeElement {
  static styles = [
    sharedCss,
    loadingDotsCss,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];
  /** `sm`, `md`, `lg`, or a dot diameter in pixels. */
  @property() size: "sm" | "md" | "lg" | string = "md";
  @state() private hasText = false;

  connectedCallback() {
    super.connectedCallback();
    this.scan();
  }
  firstUpdated() {
    this.scan();
  }
  private scan() {
    this.hasText = Array.from(this.childNodes).some((n) => n.nodeType === 1 || (n.nodeType === 3 && !!n.textContent?.trim()));
  }

  render() {
    const px = Number(this.size);
    const dot = px ? `width:${px}px;height:${px}px` : nothing;
    const slot = html`<slot @slotchange=${this.scan}></slot>`;
    return html`<span class=${this.cls("dots", { sm: this.size === "sm", lg: this.size === "lg" })} aria-label="Loading" part="dots"
      >${this.hasText ? html`<div class="text">${slot}</div>` : slot}<span class="dot" style=${dot}></span><span class="dot" style=${dot}></span><span class="dot" style=${dot}></span></span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-loading-dots": AcmeLoadingDots;
  }
}
