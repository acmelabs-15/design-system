import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { statusDotCss } from "./status-dot.styles.js";

export type DeployState = "queued" | "building" | "ready" | "error" | "canceled" | "deleted" | "online";

const MESSAGE: Record<DeployState, string> = {
  queued: "is queued",
  building: "is building",
  ready: "is ready",
  error: "errored",
  canceled: "was canceled",
  deleted: "was deleted",
  online: "is online",
};

/** Geist Status Dot: the deployment lifecycle only; the dot pulses while queued or building. */
@customElement("acme-status-dot")
export class AcmeStatusDot extends AcmeElement {
  static styles = [sharedCss, statusDotCss, css`:host{display:inline-flex}`];
  @property() state: DeployState = "queued";
  @property({ type: Boolean }) label = false;
  @property({ attribute: "title-prefix" }) titlePrefix = "This deployment";
  render() {
    const text = this.state.charAt(0).toUpperCase() + this.state.slice(1);
    return html`<span class=${this.cls("status-dot", { [this.state]: true })} role="img" aria-label=${`${this.titlePrefix} ${MESSAGE[this.state]}`} part="dot">${this.label ? html`<b>${text}</b>` : nothing}<slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-status-dot": AcmeStatusDot;
  }
}
