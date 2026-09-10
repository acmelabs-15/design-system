import { css, html, LitElement, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { gridSystemCss } from "./grid-system.styles";

/** A number (or a bare number in an attribute) is px; any other length stays as written. */
const px = (v: number | string | undefined) => (typeof v === "number" || (typeof v === "string" && /^\d+(\.\d+)?$/.test(v.trim())) ? `${v}px` : v);

/**
 * The frame every `acme-grid` sits in: a box up to 1080px wide (368px at least) that draws the
 * outer guide border and gives its grids the guide width, the guide and cross colors and the
 * width they lay out from (the viewport, or with `use-container` the system's own container).
 * The first two children lay out in the box; the rest sit in a lazy-content box below them.
 * `debug` tints the guides amber and names the breakpoint in a corner overlay; `dashed-guides`
 * draws every guide dashed.
 */
@customElement("acme-grid-system")
export class AcmeGridSystem extends AcmeElement {
  static styles = [
    sharedCss,
    gridSystemCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  static shadowRootOptions = { ...LitElement.shadowRootOptions, slotAssignment: "manual" as const };
  /** The guide line width: a number of px or a length. */
  @property({ attribute: "guide-width" }) guideWidth?: number | string;
  @property({ attribute: "guide-color" }) guideColor?: string;
  @property({ attribute: "cross-color" }) crossColor?: string;
  /** The widest the system lays out (1080px): a number of px or a length. */
  @property({ attribute: "max-width" }) maxWidth?: number | string;
  /** The narrowest the system lays out (368px): a number of px or a length. */
  @property({ attribute: "min-width" }) minWidth?: number | string;
  /** Amber guides, tinted cells, and the breakpoint's name in the corner. */
  @property({ type: Boolean, reflect: true }) debug = false;
  @property({ type: Boolean, reflect: true, attribute: "dashed-guides" }) dashedGuides = false;
  /** The grids lay out from the system's own width, not the viewport's. */
  @property({ type: Boolean, attribute: "use-container" }) useContainer = false;
  @query("slot:not([name])") private main!: HTMLSlotElement;
  @query("slot[name=lazy]") private lazy!: HTMLSlotElement;
  private childWatch?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    if (typeof MutationObserver !== "undefined") {
      this.childWatch = new MutationObserver(() => this.assign());
      this.childWatch.observe(this, { childList: true });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.childWatch?.disconnect();
  }
  firstUpdated() {
    this.assign();
  }
  /** The first two children go to the box, the rest to the lazy-content box. */
  private assign() {
    if (typeof this.main?.assign !== "function") return;
    const nodes = [...this.childNodes].filter((n): n is Element | Text => n.nodeType === 1 || (n.nodeType === 3 && !!n.textContent?.trim()));
    this.main.assign(...nodes.slice(0, 2));
    this.lazy.assign(...nodes.slice(2));
  }

  render() {
    const vars = {
      "--guide-width": px(this.guideWidth),
      "--max-width": px(this.maxWidth),
      "--min-width": px(this.minWidth),
      "--guide-color": this.guideColor,
      "--cross-color": this.crossColor,
    };
    const style = Object.entries(vars)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
    return html`<div class=${this.cls("wrap", { contained: this.useContainer, debug: this.debug, dashed: this.dashedGuides })}>
      <div class="sys" style=${style || nothing}>
        <slot></slot>
        <div class="lazy"><slot name="lazy"></slot></div>
        ${this.debug ? html`<div class="overlay"></div>` : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-grid-system": AcmeGridSystem;
  }
}
