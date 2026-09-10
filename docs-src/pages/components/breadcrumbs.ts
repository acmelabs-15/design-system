// Docs page: Breadcrumbs — mirrors https://vercel.com/geist/breadcrumbs
import type { Doc } from "../../site";

const crumbs = (type = "", mid = "") =>
  `<acme-breadcrumbs${type ? ` type="${type}"` : ""}><acme-breadcrumb>Home</acme-breadcrumb><acme-breadcrumb${mid}>Dashboard</acme-breadcrumb><acme-breadcrumb>Overview</acme-breadcrumb></acme-breadcrumbs>`;
const links = (type: string) =>
  `<acme-breadcrumbs type="${type}"><acme-breadcrumb href="#">Home</acme-breadcrumb><acme-breadcrumb href="#" active>Dashboard</acme-breadcrumb><acme-breadcrumb>Overview</acme-breadcrumb></acme-breadcrumbs>`;

export const doc: Doc = {
  id: "breadcrumbs",
  title: "Breadcrumbs",
  lede: "Navigation aid that shows the user's location within a site's hierarchy, with text and menu variants.",
  tags: ["acme-breadcrumbs", "acme-breadcrumb"],
  examples: [
    { h: "Default", html: `<div class="vstack" style="gap:16px">${crumbs("text")}${crumbs("menu")}</div>` },
    { h: "Active", html: crumbs("", " active") },
    { h: "Disabled", html: crumbs("", " disabled") },
    {
      h: "Menu states", census: true,
      p: "A menu chip is white with a gray-600 border when active, and a disabled button with a gray-alpha-200 fill when disabled.",
      html: `<acme-breadcrumbs type="menu"><acme-breadcrumb>Home</acme-breadcrumb><acme-breadcrumb active>Dashboard</acme-breadcrumb><acme-breadcrumb disabled>Overview</acme-breadcrumb></acme-breadcrumbs>`,
    },
    {
      h: "Links", census: true,
      p: "<code>href</code> makes a crumb a link: an anchor around the text in a list, the chip itself in a menu.",
      html: `<div class="vstack" style="gap:16px">${links("text")}${links("menu")}</div>`,
    },
  ],
};
