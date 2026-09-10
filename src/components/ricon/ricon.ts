import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { riconCss } from "./ricon.styles";

/** House round icon: a tinted circle for a state or a kind. */
@customElement("acme-ricon")
export class AcmeRicon extends AcmeElement {
  static styles = [
    sharedCss,
    riconCss,
    css`
      :host {
        display: inline-grid;
      }
    `,
  ];
  @property() hue: "" | "green" | "red" | "amber" | "blue" | "purple" | "teal" | "pink" = "";
  @property({ type: Boolean }) small = false;
  render() {
    return html`<span class=${this.cls("ricon", { [`hue-${this.hue}`]: !!this.hue, sm: this.small })}><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-ricon": AcmeRicon;
  }
}
