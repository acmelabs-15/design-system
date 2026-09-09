import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { shellCss } from "./shell.styles.js";

/** Vercel shell: sidebar, top bar, ground. Slots: side, topbar, default (content). */
@customElement("acme-shell")
export class AcmeShell extends AcmeElement {
  static styles = [sharedCss, shellCss, css`:host{display:block} .shell.framed{height:var(--frame-h,760px)}`];
  @property({ type: Boolean }) framed = false;
  render() {
    return html`<div class=${this.cls("shell", { framed: this.framed })} part="shell"><aside class="side"><slot name="side"></slot></aside><div class="main"><slot name="topbar"></slot><div class="content"><slot></slot></div></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-shell": AcmeShell;
  }
}
