import { riconStructureCss } from "../../generated/components/ricon/ricon-structure.styles";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { riconCss } from "../../generated/components/ricon/ricon.styles";

/** House round icon: a tinted circle for a state or a kind. */

export class AcmeRicon extends AcmeElement {
  static styles = [
    sharedCss,
    riconCss,
    riconStructureCss,
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
