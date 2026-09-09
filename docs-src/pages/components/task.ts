// Docs page: Task (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "task",
  title: "Task",
  lede: "A tinted 36px row with an icon, done or not; the getting-started list.",
  tags: ["acme-task", "acme-tasks"],
  house: true,
  examples: [
    {
      h: "List",
      html: `<acme-tasks style="display:block;max-width:420px"><acme-task done><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-branch"/></svg>Connect a Git repository</acme-task><acme-task><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-globe"/></svg>Add a domain<span slot="end"><acme-badge size="small" subtle>2 min</acme-badge></span></acme-task><acme-task disabled><svg class="ic" slot="icon" aria-hidden="true"><use href="#i-shield"/></svg>Enable Attack Challenge Mode</acme-task></acme-tasks>`,
    },
  ],
};
