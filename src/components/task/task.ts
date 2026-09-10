import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base";
import { taskCss } from "./task.styles";

/** Vercel task row: a tinted 36px row with an icon, done or not. */
@customElement("acme-task")
export class AcmeTask extends AcmeElement {
  static styles = [
    sharedCss,
    taskCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() href = "#";
  @property({ type: Boolean }) done = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  render() {
    return html`<a class=${this.cls("task", { done: this.done, disabled: this.disabled })} href=${this.href}><slot name="icon"></slot><span class="text"><slot></slot></span><span class="end">${this.done ? glyph("check") : nothing}<slot name="end"></slot></span></a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-task": AcmeTask;
  }
}
