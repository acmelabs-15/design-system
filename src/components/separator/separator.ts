import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { separatorCss } from "./separator.styles";

/**
 * Separator: a 1px gray-200 line. Horizontal fills the width; vertical fills the height of the
 * row it sits in. The host renders as its contents, so the line itself is the flex or block
 * item, and a percentage height resolves against the row.
 */
@customElement("acme-separator")
export class AcmeSeparator extends AcmeElement {
  static styles = [
    sharedCss,
    separatorCss,
    css`
      :host {
        display: block;
      }
      :host([orientation="vertical"]) {
        display: inline-block;
        height: 100%;
        vertical-align: top;
      }
    `,
  ];
  /** horizontal · vertical. */
  @property() orientation: "horizontal" | "vertical" = "horizontal";
  render() {
    const vertical = this.orientation === "vertical";
    return html`<div class=${this.cls("separator", { vertical })} role="separator" aria-orientation=${vertical ? "vertical" : "horizontal"} part="separator"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-separator": AcmeSeparator;
  }
}
