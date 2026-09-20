// Docs page: Shell (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "shell",
  title: "Shell",
  lede: "The dashboard frame: a sidebar, a top bar and the ground.",
  tags: ["acme-shell", "acme-side-nav", "acme-topbar", "acme-subnav"],
  house: true,
  examples: [
    {
      h: "Framed",
      p: "framed keeps the shell inside its container; without it the shell is the page.",
      html: `<acme-shell framed style="display:block;height:360px;margin:-24px"><acme-side-nav slot="side"><a href="#" aria-current="true"><svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-box"/></svg>Overview</a><a href="#"><svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-rocket"/></svg>Deployments</a><a href="#"><svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-chart"/></svg>Analytics</a><a href="#"><svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-gear"/></svg>Settings</a></acme-side-nav><acme-topbar slot="topbar" center="coding-agent-template"><acme-breadcrumbs slot="start" variant="menu"><a href="#">acme-labs</a><span aria-current="page">coding-agent-template</span></acme-breadcrumbs><acme-avatar slot="end" size="24" letter="PK"></acme-avatar></acme-topbar><acme-subnav><a href="#" aria-current="true">Project</a><a href="#">Deployments</a><a href="#">Logs</a></acme-subnav><acme-page-head heading="Project" style="margin-top:16px"><acme-button slot="actions" variant="primary" size="small">Deploy</acme-button></acme-page-head></acme-shell>`,
    },
  ],
};
