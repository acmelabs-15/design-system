// Docs page: Check Row (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "check",
  title: "Check Row",
  lede: "A checklist row: a 20px box, a text with a sub line, and a when.",
  tags: ["acme-check"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<div class="vstack" style="gap:0;max-width:420px"><acme-check checked when="Done">Connect a Git repository<span slot="sub">GitHub, GitLab or Bitbucket.</span></acme-check><acme-check when="Today">Add a custom domain<span slot="sub">Point a CNAME at cname.vercel-dns.com.</span></acme-check><acme-check disabled>Enable Attack Challenge Mode</acme-check></div>`,
    },
  ],
};
