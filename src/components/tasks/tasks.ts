import { tasksStructureCss } from "../../generated/components/tasks/tasks-structure.styles";
import { html } from "lit";

import { AcmeElement, sharedCss } from "../../base";
import { taskCss } from "../../generated/components/task/task.styles";

export class AcmeTasks extends AcmeElement {
  static styles = [
    sharedCss,
    taskCss,
    tasksStructureCss,
  ];
  render() {
    return html`<div class="tasks"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tasks": AcmeTasks;
  }
}
