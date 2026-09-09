import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { taskCss } from "../task/task.styles.js";

@customElement("acme-tasks")
export class AcmeTasks extends AcmeElement {
  static styles = [sharedCss, taskCss, css`:host{display:block}`];
  render() {
    return html`<div class="tasks"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tasks": AcmeTasks;
  }
}
