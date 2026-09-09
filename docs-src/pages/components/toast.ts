// Docs page: Toast — mirrors https://vercel.com/geist/toast
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "toast",
  title: "Toast",
  lede: "A succinct message that is displayed temporarily.",
  tags: ["acme-toast", "acme-toaster"],
  examples: [
    {
      h: "Default",
      p: "Shown static.",
      html: `<acme-toast static>The Evil Rabbit jumped over the fence.</acme-toast>`,
    },
    {
      h: "Multi-line and action",
      html: `<acme-toast static>The Evil Rabbit jumped over the fence. The fence was dismantled after the jump.<div slot="actions" class="actions"><acme-button>Dismiss</acme-button><acme-button variant="primary">Undo</acme-button></div></acme-toast>`,
    },
    {
      h: "Success, warning, error",
      html: `<div class="vstack"><acme-toast static variant="success">Domain added</acme-toast><acme-toast static variant="warning">Deployment promoted with 2 routes skipped</acme-toast><acme-toast static variant="error">Couldn’t verify domain. Try again.</acme-toast></div>`,
    },
    {
      h: "Queue",
      p: "Mount one acme-toaster per page and call the shared queue from anywhere.",
      html: `<div class="row"><acme-button onclick="window.acme.toasts.success('Domain added')">Success toast</acme-button><acme-button onclick="window.acme.toasts.error('Couldn’t verify domain. Try again.')">Error toast</acme-button><acme-button onclick="window.acme.toasts.show('Project archived', {action: 'Undo', onAction: () => window.acme.toasts.success('Project restored')})">With an action</acme-button></div>`,
      code: `<acme-toaster></acme-toaster>
<script type="module">
  import { toasts } from "@acmelabs/design-system";
  toasts.success("Domain added");
  toasts.error("Couldn’t verify domain. Try again.");
  toasts.show("Project archived", { action: "Undo", onAction: () => toasts.success("Project restored") });
</script>`,
    },
  ],
  practices: {
    "When to use": ["Non-blocking acknowledgments of user actions: Domain added, Project archived. Billing failures and build failures need a persistent row too."],
    Behavior: ["Auto-dismiss by default; preserve only when the user must act; undo snackbars stay 5–10 seconds with a single Undo."],
    Content: ["One sentence, sentence case, no period; {Noun} {past participle}, never successfully; error toasts are two sentences ending with a recovery step."],
  },
};
