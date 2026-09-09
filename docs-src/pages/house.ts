// House components: the parts Geist has no page for, from the Vercel dashboard and the liked
// references. Each is styled from the same tokens.
import type { Doc } from "../site";
import { ic } from "../site";

const svg = (n: string, slot = "") => ic(n, slot ? ` slot="${slot}"` : "");
const H = (d: Omit<Doc, "house">): Doc => ({ ...d, house: true });

export const house: Doc[] = [
  H({
    id: "app-bar",
    title: "App Bar",
    lede: "The sticky top bar: brand left, section links middle, tools right, with the theme switcher built in.",
    tags: ["acme-appbar"],
    examples: [
      {
        h: "Default",
        html: `<acme-appbar name="Runway" meta="ledger" style="margin:-24px;position:static">${svg("chart", "logo")}<a href="#" aria-current="true">Overview</a><a href="#">Cash</a><a href="#">Plan</a></acme-appbar>`,
      },
      {
        h: "With crumbs and tools",
        html: `<acme-appbar name="ACME" no-theme style="margin:-24px;position:static">${svg("chart", "logo")}<acme-breadcrumbs slot="crumbs" variant="menu"><a href="#">acme-labs</a><span aria-current="page">design-system</span></acme-breadcrumbs><acme-button slot="tools" size="small">Feedback</acme-button><acme-avatar slot="tools" size="sm">pk</acme-avatar></acme-appbar>`,
      },
    ],
  }),
  H({
    id: "bar-row",
    title: "Bar Row",
    lede: "A label, a value, a bar, and the result under it. The allocation row from the finance references.",
    tags: ["acme-bar-row", "acme-bar-rows"],
    examples: [
      {
        h: "Default",
        html: `<acme-bar-rows style="display:block;max-width:420px"><acme-bar-row label="Equities" value="45%" percent="45"><span>Target 50%</span><acme-trend direction="up">+2.1%</acme-trend></acme-bar-row><acme-bar-row label="Bonds" value="30%" percent="30" hue="teal"><span>Target 30%</span><acme-trend>0.0%</acme-trend></acme-bar-row><acme-bar-row label="Cash" value="25%" percent="25" hue="amber"><span>Target 20%</span><acme-trend direction="down">−1.4%</acme-trend></acme-bar-row></acme-bar-rows>`,
      },
      {
        h: "Small, lined",
        html: `<acme-bar-rows lined style="display:block;max-width:420px"><acme-bar-row small label="iad1" value="62%" percent="62"></acme-bar-row><acme-bar-row small label="sfo1" value="28%" percent="28"></acme-bar-row><acme-bar-row small label="fra1" value="10%" percent="10"></acme-bar-row></acme-bar-rows>`,
      },
    ],
  }),
  H({
    id: "card",
    title: "Card",
    lede: "The block that must read as its own object: a bordered surface with a 6px radius.",
    tags: ["acme-card"],
    examples: [
      {
        h: "Variants",
        html: `<div class="row" style="gap:16px;align-items:stretch"><acme-card style="padding:16px;width:200px">Default</acme-card><acme-card variant="raised" style="padding:16px;width:200px">Raised</acme-card><acme-card variant="flat" style="padding:16px;width:200px">Flat</acme-card><acme-card variant="feature" style="padding:16px;width:200px">Feature</acme-card></div>`,
      },
    ],
  }),
  H({
    id: "chart",
    title: "Chart",
    lede: "A chart frame: the plot is a slotted inline SVG; the frame draws the head, the legend and the tooltip.",
    tags: ["acme-chart", "acme-legend", "acme-legend-item"],
    examples: [
      {
        h: "Line chart",
        html: `<acme-chart height="160"><acme-panel-head slot="head" heading="Requests" sub="Last 7 days"></acme-panel-head><svg viewBox="0 0 600 160" preserveAspectRatio="none" style="width:100%;height:100%"><polyline fill="none" stroke="var(--chart-1)" stroke-width="2" points="0,120 100,90 200,100 300,60 400,70 500,30 600,40"/><polyline fill="none" stroke="var(--chart-2)" stroke-width="2" points="0,140 100,130 200,120 300,110 400,100 500,90 600,80"/></svg><acme-legend slot="legend"><acme-legend-item series="1" value="12.4k">Edge</acme-legend-item><acme-legend-item series="2" value="3.1k">Serverless</acme-legend-item></acme-legend></acme-chart>`,
      },
      {
        h: "Legend list",
        html: `<acme-legend list><acme-legend-item hue="green" value="82%">Ready</acme-legend-item><acme-legend-item hue="amber" value="12%">Building</acme-legend-item><acme-legend-item hue="red" value="6%">Error</acme-legend-item></acme-legend>`,
      },
    ],
  }),
  H({
    id: "check",
    title: "Check Row",
    lede: "A checklist row: a 20px box, a text with a sub line, and a when.",
    tags: ["acme-check"],
    examples: [
      {
        h: "Default",
        html: `<div class="vstack" style="gap:0;max-width:420px"><acme-check checked when="Done">Connect a Git repository<span slot="sub">GitHub, GitLab or Bitbucket.</span></acme-check><acme-check when="Today">Add a custom domain<span slot="sub">Point a CNAME at cname.vercel-dns.com.</span></acme-check><acme-check disabled>Enable Attack Challenge Mode</acme-check></div>`,
      },
    ],
  }),
  H({
    id: "chip",
    title: "Chip",
    lede: "A pressable filter pill; pressed fills solid. Tags are the static small gray keywords.",
    tags: ["acme-chip", "acme-tag", "acme-tags"],
    examples: [
      {
        h: "Chips",
        html: `<div class="row" style="gap:8px"><acme-chip pressed>All</acme-chip><acme-chip>Production</acme-chip><acme-chip>Preview</acme-chip><acme-chip disabled>Archived</acme-chip></div>`,
      },
      { h: "Tags", html: `<acme-tags><acme-tag>next.js</acme-tag><acme-tag>edge</acme-tag><acme-tag>iad1</acme-tag></acme-tags>` },
    ],
  }),
  H({
    id: "filter",
    title: "Filter",
    lede: "The Vercel filter chips: a pill that names a key and value with a remove, a dashed suggestion, and the add trigger.",
    tags: ["acme-filter", "acme-filters"],
    examples: [
      {
        h: "Filter row",
        html: `<acme-filters><acme-filter add>${svg("filter", "icon")}Add Filter</acme-filter><acme-filter key="Status" value="Error" removable></acme-filter><acme-filter key="Author" value="loriensleafs" suggest></acme-filter></acme-filters>`,
      },
    ],
  }),
  H({
    id: "fold",
    title: "Fold",
    lede: "A section that shows tiles closed and charts open, with a count dot.",
    tags: ["acme-fold"],
    examples: [
      {
        h: "Closed and open",
        html: `<div class="vstack" style="gap:16px"><acme-fold heading="Runway" count="3"><acme-tiles slot="closed"><acme-tile label="Months">6.6</acme-tile><acme-tile label="Cash">$8,429</acme-tile><acme-tile label="Burn">$6,000</acme-tile></acme-tiles><p slot="open" class="text-copy-14">The charts go here.</p></acme-fold><acme-fold heading="Usage" open><acme-tiles slot="closed"><acme-tile label="Edge">12.4k</acme-tile></acme-tiles><acme-bar-rows slot="open"><acme-bar-row small label="iad1" value="62%" percent="62"></acme-bar-row><acme-bar-row small label="sfo1" value="28%" percent="28"></acme-bar-row></acme-bar-rows></acme-fold></div>`,
      },
    ],
  }),
  H({
    id: "item",
    title: "Item",
    lede: "The list row: a lead, a title and meta, an amount and tags, actions.",
    tags: ["acme-item", "acme-items"],
    examples: [
      {
        h: "Rows",
        html: `<acme-items boxed><acme-item amount="−$1,200.00"><acme-ricon slot="lead" hue="blue">${svg("card")}</acme-ricon>Rent<span slot="meta">Sep 1 · Housing</span></acme-item><acme-item amount="+$8,400.00"><acme-ricon slot="lead" hue="green">${svg("dollar")}</acme-ricon>Severance<span slot="meta">Sep 5 · Income</span><acme-tags slot="tags"><acme-tag>net</acme-tag></acme-tags></acme-item><acme-item href="#" amount="−$62.10"><acme-ricon slot="lead" hue="amber">${svg("wifi")}</acme-ricon>Internet<span slot="meta">Sep 8 · Utilities</span><acme-button slot="actions" size="small" variant="tertiary">Edit</acme-button></acme-item></acme-items>`,
      },
      {
        h: "Striped, large amount",
        html: `<acme-items striped><acme-item large amount="$62,450"><acme-avatar slot="lead">pk</acme-avatar>Cash today<span slot="meta">Across 3 accounts</span><acme-badge slot="end" hue="green" subtle>Healthy</acme-badge></acme-item></acme-items>`,
      },
    ],
  }),
  H({
    id: "kv",
    title: "Key Value",
    lede: "A key-value row with a hairline: the key with a sub line, an optional when, the value and its conversion.",
    tags: ["acme-kv"],
    examples: [
      {
        h: "Rows",
        html: `<div style="max-width:420px"><acme-kv when="Sep 30">Rent<span slot="sub">Monthly</span><span slot="value">$1,200</span></acme-kv><acme-kv when="Oct 3" soon>Insurance<span slot="sub">Quarterly</span><span slot="value">€310</span><span slot="conv">≈ $338</span></acme-kv><acme-kv>Runway<span slot="value">6.6 mo</span></acme-kv></div>`,
      },
    ],
  }),
  H({
    id: "link-card",
    title: "Link Card",
    lede: "A title and a one-line description, raised on hover.",
    tags: ["acme-link-card"],
    examples: [
      {
        h: "Grid",
        html: `<div class="row" style="gap:16px;align-items:stretch"><acme-link-card href="#" heading="Analytics" style="width:260px">Traffic and Web Vitals for every deployment.</acme-link-card><acme-link-card href="#" heading="Speed Insights" style="width:260px">Real-user performance scores.<acme-badge slot="badge" hue="blue" subtle size="small">Beta</acme-badge></acme-link-card></div>`,
      },
    ],
  }),
  H({
    id: "logs",
    title: "Logs",
    lede: "Striped 30px mono rows: time, method, status, host, path.",
    tags: ["acme-logs"],
    examples: [
      {
        h: "Default",
        html: `<acme-logs rows='[{"time":"12:02:14","method":"GET","status":200,"host":"acme.vercel.app","path":"/api/tasks"},{"time":"12:02:15","method":"POST","status":201,"host":"acme.vercel.app","path":"/api/tasks"},{"time":"12:02:19","method":"GET","status":500,"host":"acme.vercel.app","path":"/api/tasks/42"}]'></acme-logs>`,
      },
    ],
  }),
  H({
    id: "metric-list",
    title: "Metric List",
    lede: "A column of selectable metric cards with a grade threshold.",
    tags: ["acme-metric-list", "acme-metric"],
    examples: [
      {
        h: "Default",
        html: `<acme-metric-list value="lcp" style="display:block;max-width:280px"><acme-metric value="lcp" label="LCP" unit="s" grade="good">1.2</acme-metric><acme-metric value="inp" label="INP" unit="ms" grade="mid">240</acme-metric><acme-metric value="cls" label="CLS" grade="bad">0.31</acme-metric></acme-metric-list>`,
      },
    ],
  }),
  H({
    id: "page-head",
    title: "Page Head",
    lede: "The page title, a meta line and the actions; a back link above when the page has a parent.",
    tags: ["acme-page-head"],
    examples: [
      {
        h: "Default",
        html: `<acme-page-head heading="Deployments"><span slot="meta">coding-agent-template · Production</span><acme-button slot="actions">Filters</acme-button><acme-button slot="actions" variant="primary">Deploy</acme-button></acme-page-head>`,
      },
      {
        h: "With a back link",
        html: `<acme-page-head heading="dpl_9WjH8QFQySx7" back="Deployments" back-href="#"><acme-status-dot slot="meta" state="ready" label></acme-status-dot><acme-button slot="actions" size="small">Visit</acme-button></acme-page-head>`,
      },
    ],
  }),
  H({
    id: "panel",
    title: "Panel",
    lede: "The dashboard card: radius 6, a shadow border, a 56px head, a body, a footer. Panels lays several out in columns.",
    tags: ["acme-panel", "acme-panel-head", "acme-panel-foot", "acme-panels"],
    examples: [
      {
        h: "Default",
        html: `<acme-panel heading="Environment Variables" sub="Values are encrypted at rest." when="Updated 2h ago"><acme-button slot="actions" size="small">Add</acme-button><p class="text-copy-14">Three variables in Production.</p><acme-panel-foot slot="footer" tinted>Learn more about <a href="#">environment variables</a>.<acme-button slot="actions" size="small" variant="primary">Save</acme-button></acme-panel-foot></acme-panel>`,
      },
      {
        h: "Variants",
        html: `<acme-panels columns="2"><acme-panel variant="danger" heading="Delete Project" sub="This cannot be undone."><acme-panel-foot slot="footer" tinted><acme-button slot="actions" size="small" variant="error">Delete</acme-button></acme-panel-foot></acme-panel><acme-panel variant="warning" heading="Trial Ending Soon" sub="3 days left."><acme-panel-foot slot="footer" tinted><acme-button slot="actions" size="small" variant="primary">Add Payment Method</acme-button></acme-panel-foot></acme-panel></acme-panels>`,
      },
      {
        h: "Chart panel and a bare head",
        html: `<acme-panel chart tight><acme-panel-head slot="head" heading="Requests" sub="Last 24 hours"><acme-switch slot="actions" size="small" value="1d" aria-label="Range" options='[{"value":"1d","label":"1d"},{"value":"7d","label":"7d"}]'></acme-switch></acme-panel-head><acme-chart height="120"><svg viewBox="0 0 600 120" preserveAspectRatio="none" style="width:100%;height:100%"><polyline fill="none" stroke="var(--chart-1)" stroke-width="2" points="0,100 150,60 300,80 450,30 600,50"/></svg></acme-chart></acme-panel>`,
      },
    ],
  }),
  H({
    id: "ricon",
    title: "Round Icon",
    lede: "A tinted circle for a state or a kind, leading a row.",
    tags: ["acme-ricon"],
    examples: [
      {
        h: "Hues",
        html: `<div class="row" style="gap:12px"><acme-ricon>${svg("box")}</acme-ricon><acme-ricon hue="green">${svg("check")}</acme-ricon><acme-ricon hue="red">${svg("alert")}</acme-ricon><acme-ricon hue="amber">${svg("clock")}</acme-ricon><acme-ricon hue="blue">${svg("rocket")}</acme-ricon><acme-ricon hue="purple">${svg("branch")}</acme-ricon><acme-ricon small hue="teal">${svg("globe")}</acme-ricon></div>`,
      },
    ],
  }),
  H({
    id: "setting-row",
    title: "Setting Row",
    lede: "A title and description with a control at the right; rows stack behind hairlines.",
    tags: ["acme-setting-row", "acme-setting-rows"],
    examples: [
      {
        h: "Rows",
        html: `<acme-setting-rows><acme-setting-row heading="Password Protection">Require a password on every preview deployment.<acme-toggle slot="control" checked aria-label="Password Protection"></acme-toggle></acme-setting-row><acme-setting-row heading="Production Branch">The branch that deploys to production.<acme-select slot="control" options='["main","release"]' aria-label="Branch"></acme-select></acme-setting-row><acme-setting-row heading="Transfer Project">Move this project to another team.<acme-button slot="control" size="small">Transfer</acme-button></acme-setting-row></acme-setting-rows>`,
      },
    ],
  }),
  H({
    id: "shell",
    title: "Shell",
    lede: "The dashboard frame: a sidebar, a top bar and the ground.",
    tags: ["acme-shell", "acme-side-nav", "acme-topbar", "acme-subnav"],
    examples: [
      {
        h: "Framed",
        p: "framed keeps the shell inside its container; without it the shell is the page.",
        html: `<acme-shell framed style="display:block;height:360px;margin:-24px"><acme-side-nav slot="side"><a href="#" aria-current="true">${svg("box")}Overview</a><a href="#">${svg("rocket")}Deployments</a><a href="#">${svg("chart")}Analytics</a><a href="#">${svg("gear")}Settings</a></acme-side-nav><acme-topbar slot="topbar" center="coding-agent-template"><acme-breadcrumbs slot="start" variant="menu"><a href="#">acme-labs</a><span aria-current="page">coding-agent-template</span></acme-breadcrumbs><acme-avatar slot="end" size="sm">pk</acme-avatar></acme-topbar><acme-subnav><a href="#" aria-current="true">Project</a><a href="#">Deployments</a><a href="#">Logs</a></acme-subnav><acme-page-head heading="Project" style="margin-top:16px"><acme-button slot="actions" variant="primary" size="small">Deploy</acme-button></acme-page-head></acme-shell>`,
      },
    ],
  }),
  H({
    id: "stat",
    title: "Stat",
    lede: "The one component for a headline figure: label and context, the value with its unit and trend, then a delta, a description, a meter, a spark or a foot.",
    tags: ["acme-stat", "acme-stat-delta", "acme-stat-desc", "acme-stat-foot", "acme-spark"],
    examples: [
      {
        h: "Cells",
        p: "Stats sit in the cells grid; each is a cell.",
        html: `<div class="cells" style="--cols:3"><acme-stat class="cell" label="Runway" context="cash + net severance" unit="mo">6.6<acme-trend slot="trend" direction="up">+1.4</acme-trend><acme-stat-desc slot="desc">On $39,400.</acme-stat-desc></acme-stat><acme-stat class="cell" label="Cash today" meter="48" meter-label="$6,000 of $12,400">$8,429</acme-stat><acme-stat class="cell" label="Burn">$6,000<acme-spark slot="spark" points="[1,3,2,5,4,6]"></acme-spark></acme-stat></div>`,
      },
      {
        h: "Delta, icon, foot",
        html: `<div class="cells" style="--cols:2"><acme-stat class="cell" label="Revenue" context="MTD">${svg("dollar", "icon")}$62,450<acme-stat-delta slot="delta" tone="good"><acme-trend pill direction="up" note="vs last month">+6.03%</acme-trend></acme-stat-delta></acme-stat><acme-stat class="cell" label="Errors" title-label>14<acme-badge slot="end" hue="red" subtle size="small">Alert</acme-badge><acme-stat-foot slot="foot" bar>3 new since yesterday</acme-stat-foot></acme-stat></div>`,
      },
      {
        h: "Meter warning",
        html: `<div class="cells" style="--cols:2"><acme-stat class="cell" label="Bandwidth" unit="GB" meter="92" meter-label="92 of 100 GB" meter-warn>92</acme-stat><acme-stat class="cell" label="Seats" meter="40" meter-label="4 of 10">4</acme-stat></div>`,
      },
    ],
  }),
  H({
    id: "stat-strip",
    title: "Stat Strip",
    lede: "Selectable figures across the top of a chart card; the selected one drives the chart.",
    tags: ["acme-stat-strip", "acme-strip-item"],
    examples: [
      {
        h: "Default",
        html: `<acme-stat-strip value="visitors"><acme-strip-item value="visitors" label="Visitors">2,847</acme-strip-item><acme-strip-item value="views" label="Page Views">9,120</acme-strip-item><acme-strip-item value="bounce" label="Bounce Rate">41%</acme-strip-item></acme-stat-strip>`,
      },
    ],
  }),
  H({
    id: "task",
    title: "Task",
    lede: "A tinted 36px row with an icon, done or not; the getting-started list.",
    tags: ["acme-task", "acme-tasks"],
    examples: [
      {
        h: "List",
        html: `<acme-tasks style="display:block;max-width:420px"><acme-task done>${svg("branch", "icon")}Connect a Git repository</acme-task><acme-task>${svg("globe", "icon")}Add a domain<span slot="end"><acme-badge size="small" subtle>2 min</acme-badge></span></acme-task><acme-task disabled>${svg("shield", "icon")}Enable Attack Challenge Mode</acme-task></acme-tasks>`,
      },
    ],
  }),
  H({
    id: "tile",
    title: "Tile",
    lede: "Small figures in a tinted box; the closed state of a fold.",
    tags: ["acme-tile", "acme-tiles"],
    examples: [
      {
        h: "Default",
        html: `<acme-tiles><acme-tile label="Months">6.6</acme-tile><acme-tile label="Cash" qualifier="today">$8,429</acme-tile><acme-tile label="Burn" qualifier="/mo">$6,000</acme-tile><acme-tile label="Plain" plain>—</acme-tile></acme-tiles>`,
      },
      { h: "Large", html: `<acme-tiles><acme-tile large label="Requests">12.4k</acme-tile><acme-tile large label="Errors">0.2%</acme-tile></acme-tiles>` },
    ],
  }),
  H({
    id: "toolbar",
    title: "Toolbar",
    lede: "A row of controls above a list, with an end group pushed right.",
    tags: ["acme-toolbar"],
    examples: [
      {
        h: "Default",
        html: `<acme-toolbar><acme-search placeholder="Search deployments" style="width:260px"></acme-search><acme-select options='["All branches","main"]' aria-label="Branch"></acme-select><acme-button slot="end">Export</acme-button><acme-button slot="end" variant="primary">Deploy</acme-button></acme-toolbar>`,
      },
    ],
  }),
];
