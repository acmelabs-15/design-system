import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { gridPageCss } from "./grid-page.styles";

/**
 * The page a grid system sits on: a background-200 column with 16px of vertical padding on
 * small screens, 32px on medium and 90px on large. A `banner` slot goes above the content and
 * takes the place of the top padding on large screens; `remove-padding-y` drops the padding,
 * `remove-bottom-margin` pulls the page up by the width of a guide.
 */
@customElement("acme-grid-page")
export class AcmeGridPage extends AcmeElement {
  static styles = [
    sharedCss,
    gridPageCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property({ type: Boolean, attribute: "remove-padding-y" }) removePaddingY = false;
  @property({ type: Boolean, attribute: "remove-bottom-margin" }) removeBottomMargin = false;
  @atomState() private hasBanner = false;

  connectedCallback() {
    super.connectedCallback();
    // A slotted banner is known before the first render (slotchange keeps it current).
    this.hasBanner = !!this.querySelector('[slot="banner"]');
  }
  firstUpdated() {
    // A parser that connects the element before its children misses them at connect.
    this.hasBanner ||= !!this.querySelector('[slot="banner"]');
  }
  private bannerChange = (e: Event) => {
    this.hasBanner = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
  };

  render() {
    const padding = this.removePaddingY ? ["--stack-padding:0px"] : ["--sm-stack-padding:16px 0px", "--md-stack-padding:32px 0px", "--lg-stack-padding:90px 0px", "--xl-stack-padding:90px 0px"];
    const style = [
      "--stack-flex:initial",
      "--stack-direction:column",
      "--stack-align:stretch",
      "--stack-justify:flex-start",
      ...padding,
      "--stack-gap:0px",
      ...(this.removeBottomMargin ? ["margin-bottom:-1px"] : []),
    ].join(";");
    return html`<div class=${this.cls("page", { banner: this.hasBanner })} style=${style} part="page">
      <slot name="banner" @slotchange=${this.bannerChange}></slot><slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-grid-page": AcmeGridPage;
  }
}
