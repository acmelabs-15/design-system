import { customElement } from "lit/decorators.js";
import { AcmeElement } from "../../base.js";

@customElement("acme-switch-control")
export class AcmeSwitchControl extends AcmeElement {
  createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-switch-control": AcmeSwitchControl;
  }
}
