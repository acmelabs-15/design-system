import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { projectBannerCss } from "./project-banner.styles.js";

/** Geist Project Banner: a non-dismissible project-wide state with the action that resolves it. */
@customElement("acme-project-banner")
export class AcmeProjectBanner extends AcmeElement {
  static styles = [
    sharedCss,
    projectBannerCss,
    css`::slotted([slot=action]){font-weight:500;color:inherit;padding:4px 0;border-radius:2px;background:transparent;border:0;cursor:pointer;text-decoration:none}`,
  ];
  @property() variant: "" | "success" | "warning" | "error" = "";
  render() {
    return html`<aside class=${this.cls("project-banner", { [this.variant]: !!this.variant })} part="banner"><slot name="icon"></slot><span><slot></slot></span><slot name="action"></slot></aside>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-project-banner": AcmeProjectBanner;
  }
}
