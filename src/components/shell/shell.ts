import { shellStructureCss } from "../../generated/components/shell/shell-structure.styles";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { shellCss } from "../../generated/components/shell/shell.styles";

/** Vercel shell: sidebar, top bar, ground. Slots: side, topbar, default (content). */
@customElement("acme-shell")
export class AcmeShell extends AcmeElement {
  static styles = [
    sharedCss,
    shellCss,
    shellStructureCss,
  ];
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
