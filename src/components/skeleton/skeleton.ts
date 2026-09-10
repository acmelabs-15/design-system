import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { skeletonCss } from "./skeleton.styles";

const px = (v: string | number) => (typeof v === "number" ? `${v}px` : /^\d+(\.\d+)?$/.test(v) ? `${v}px` : v);
/** Unset stays undefined (automatic); `show="false"` turns it off; any other value turns it on. */
const tristate = { fromAttribute: (v: string | null) => (v === null ? undefined : v !== "false") };

/**
 * Skeleton: a block with a gray sweep, shown while content loads. The root carries the shape
 * classes (pill, rounded, squared), `still` without animation, `button` for the wider sweep,
 * and one of four states: bare (a block of the given size), `wrap` (children present, hidden
 * under the sweep), `off` (`show="false"`: children visible, no sweep), `auto` (a fixed size
 * with children: the children show, the block keeps its size). Width, min-height (24 by
 * default) and the bottom margin from `box-height` are inline styles. The host renders as its
 * contents, so the block itself is the flex or block item of the layout around it.
 */
@customElement("acme-skeleton")
export class AcmeSkeleton extends AcmeElement {
  static styles = [
    sharedCss,
    skeletonCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** Pixels or any CSS length ("100%"). */
  @property() width: string | number = "";
  /** Pixels or any CSS length; the block's min-height (24 when a size is given). */
  @property() height: string | number = "";
  /** Height reserved for the box; the difference to `height` becomes bottom margin. */
  @property({ attribute: "box-height" }) boxHeight: string | number = "";
  /** Force the skeleton on or off (`show="false"`); unset, a fixed-size skeleton hides once children are present. */
  @property({ converter: tristate }) show?: boolean;
  @property({ type: Boolean }) pill = false;
  @property({ type: Boolean }) rounded = false;
  @property({ type: Boolean }) squared = false;
  /** Inside a Button: the sweep extends by 1px so the border is covered. */
  @property({ type: Boolean }) button = false;
  /** `animated="false"` stops the sweep. */
  @property({ converter: boolish }) animated = true;
  @atomState() private hasChildren = false;

  connectedCallback() {
    super.connectedCallback();
    this.scan();
  }
  firstUpdated() {
    this.scan();
  }
  private scan() {
    this.hasChildren = Array.from(this.childNodes).some((n) => n.nodeType === 1 || (n.nodeType === 3 && !!n.textContent?.trim()));
  }

  render() {
    const fixed = this.width !== "" || this.height !== "" || this.boxHeight !== "";
    const st = this.show === false ? "off" : fixed && this.hasChildren ? "auto" : this.hasChildren ? "wrap" : "on";
    const h = this.height !== "" ? px(this.height) : "24px";
    const bh = this.boxHeight !== "" ? px(this.boxHeight) : "";
    const hn = Number.parseFloat(h);
    const bn = Number.parseFloat(bh);
    const margin = bh.endsWith("px") && h.endsWith("px") && bn > hn ? `${bn - hn}px` : "";
    const style = fixed ? [this.width !== "" ? `width:${px(this.width)}` : "", `min-height:${h}`, margin ? `margin-bottom:${margin}` : ""].filter(Boolean).join(";") : "";
    return html`<span
      class=${this.cls("skeleton", { pill: this.pill, rounded: this.rounded, squared: this.squared, still: !this.animated, button: this.button, [st]: st !== "on" })}
      style=${style || nothing}
      part="skeleton"
      ><slot @slotchange=${this.scan}></slot
    ></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-skeleton": AcmeSkeleton;
  }
}
