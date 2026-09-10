import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { statusDotCss } from "./status-dot.styles";

export type DeployState = "QUEUED" | "BUILDING" | "READY" | "ERROR" | "CANCELED" | "DELETED";

/** Per state: the short label, the sentence the title carries, and the root's modifier class (queued has none). */
const STATES: Record<DeployState, { label: string; message: string; cls: string }> = {
  QUEUED: { label: "Queued", message: "This deployment is queued.", cls: "" },
  BUILDING: { label: "Building", message: "This deployment is building.", cls: "building" },
  READY: { label: "Ready", message: "This deployment is ready.", cls: "ready" },
  ERROR: { label: "Error", message: "This deployment had an error.", cls: "error" },
  CANCELED: { label: "Canceled", message: "This deployment was canceled.", cls: "canceled" },
  DELETED: { label: "Deleted", message: "This deployment was deleted.", cls: "deleted" },
};

/**
 * Status dot: the deployment lifecycle as a 10px dot. The root carries the state class, an
 * `aria-label` with the short state name and a `title` with the state sentence; the dot is a
 * child span; with `label` the state name follows the dot as text. Queued, canceled and deleted
 * share the neutral colour; building is the warning colour, ready the cyan, error the error red.
 */
@customElement("acme-status-dot")
export class AcmeStatusDot extends AcmeElement {
  static styles = [
    sharedCss,
    statusDotCss,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];
  /** QUEUED · BUILDING · READY · ERROR · CANCELED · DELETED (lower case is accepted). */
  @property() state: DeployState = "QUEUED";
  /** Shows the state name after the dot. */
  @property({ type: Boolean }) label = false;
  render() {
    const s = STATES[this.state.toUpperCase() as DeployState] ?? STATES.QUEUED;
    return html`<span class=${this.cls("status-dot", { [s.cls]: !!s.cls })} aria-label=${s.label} title=${s.message} part="dot"
      ><span class="dot"></span>${this.label ? html`<span class="label">${s.label}</span>` : nothing}</span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-status-dot": AcmeStatusDot;
  }
}
