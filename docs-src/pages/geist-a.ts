// Geist component pages, Avatar to Input, in Geist's nav order. Every example is the acme-*
// markup a page author writes; the "Show code" panel shows exactly this.
import type { Doc } from "../site";
import { ic } from "../site";

const svg = (n: string, slot = "") => ic(n, slot ? ` slot="${slot}"` : "");

export const geistA: Doc[] = [
  {
    id: "avatar",
    title: "Avatar",
    lede: "Avatars represent a user or a team, and stacked avatars a group.",
    tags: ["acme-avatar", "acme-avatar-group"],
    examples: [
      {
        h: "Group",
        p: "Each member carries a 1px ring in the page color and overlaps the next; the first sits on top.",
        html: `<acme-avatar-group><acme-avatar>ab</acme-avatar><acme-avatar>cd</acme-avatar><acme-avatar>ef</acme-avatar><acme-avatar>gh</acme-avatar></acme-avatar-group>`,
      },
      {
        h: "Stacking order",
        p: "Add reverse so the last member sits on top.",
        html: `<acme-avatar-group reverse><acme-avatar>ab</acme-avatar><acme-avatar>cd</acme-avatar><acme-avatar>ef</acme-avatar></acme-avatar-group>`,
      },
      {
        h: "Limit",
        p: "Over the limit, the last slot is a +N counter.",
        html: `<acme-avatar-group limit="3"><acme-avatar>ab</acme-avatar><acme-avatar>cd</acme-avatar><acme-avatar>ef</acme-avatar><acme-avatar>gh</acme-avatar><acme-avatar>ij</acme-avatar><acme-avatar>kl</acme-avatar><acme-avatar>mn</acme-avatar></acme-avatar-group>`,
      },
      {
        h: "Size",
        p: "16, 24, 32, 48 and 64.",
        html: `<div class="row" style="gap:16px"><acme-avatar size="xs">a</acme-avatar><acme-avatar size="sm">ab</acme-avatar><acme-avatar>ab</acme-avatar><acme-avatar size="lg">ab</acme-avatar><acme-avatar size="xl">ab</acme-avatar></div>`,
      },
      { h: "Image", p: "A src with an alt; the fallback letters show until it loads.", html: `<acme-avatar src="https://avatars.githubusercontent.com/u/14985020?s=64" alt="Vercel"></acme-avatar>` },
      {
        h: "Presence",
        p: "A 16px service dot at the bottom right.",
        html: `<div class="row" style="gap:16px"><acme-avatar presence="on">pk</acme-avatar><acme-avatar presence="away">pk</acme-avatar><acme-avatar presence="off">pk</acme-avatar></div>`,
      },
      {
        h: "Letter and placeholder",
        p: "One or two uppercase letters, weight 500, on a gray fill.",
        html: `<div class="row" style="gap:16px"><acme-avatar>sl</acme-avatar><acme-avatar>e</acme-avatar><acme-avatar placeholder></acme-avatar><acme-avatar square>sq</acme-avatar></div>`,
      },
    ],
    practices: { "When to use": ["20–24px next to label-14, 32px next to label-16, 48–64px in headers.", "A placeholder is a loading shell, never a permanent fallback."] },
  },
  {
    id: "badge",
    title: "Badge",
    lede: "A short scannable label beside the thing it describes.",
    tags: ["acme-badge", "acme-pill"],
    examples: [
      {
        h: "Size",
        p: "small 20, medium 24, large 32; the text is capitalized.",
        html: `<div class="row"><acme-badge size="small">Small</acme-badge><acme-badge>Medium</acme-badge><acme-badge size="large">Large</acme-badge></div>`,
      },
      {
        h: "Variant",
        p: "Solid fills with the 900 step and white text; amber is amber-700 with black text; inverted is gray-1000.",
        html: `<div class="row" style="gap:8px"><acme-badge>Gray</acme-badge><acme-badge hue="blue">Blue</acme-badge><acme-badge hue="purple">Purple</acme-badge><acme-badge hue="amber">Amber</acme-badge><acme-badge hue="red">Red</acme-badge><acme-badge hue="pink">Pink</acme-badge><acme-badge hue="green">Green</acme-badge><acme-badge hue="teal">Teal</acme-badge><acme-badge inverted>Inverted</acme-badge></div>`,
      },
      {
        h: "Subtle",
        p: "Low contrast keeps the hue for the text on the hue's 100 background.",
        html: `<div class="row" style="gap:8px"><acme-badge subtle>Gray</acme-badge><acme-badge hue="blue" subtle>Blue</acme-badge><acme-badge hue="purple" subtle>Purple</acme-badge><acme-badge hue="amber" subtle>Amber</acme-badge><acme-badge hue="red" subtle>Red</acme-badge><acme-badge hue="pink" subtle>Pink</acme-badge><acme-badge hue="green" subtle>Green</acme-badge><acme-badge hue="teal" subtle>Teal</acme-badge></div>`,
      },
      {
        h: "Icon",
        p: "12, 14 or 16px by size, in the icon slot before the text.",
        html: `<div class="row"><acme-badge size="small" hue="green">${svg("check", "icon")}Ready</acme-badge><acme-badge hue="blue">${svg("rocket", "icon")}Production</acme-badge><acme-badge size="large" hue="red">${svg("alert", "icon")}Error</acme-badge></div>`,
      },
      {
        h: "Pill",
        p: "The badge shape as a link: white with an inset ring, in the same three sizes.",
        html: `<div class="row"><acme-pill size="small" href="#">${svg("github", "icon")}Repository</acme-pill><acme-pill href="#">${svg("branch", "icon")}main</acme-pill><acme-pill size="large" href="#">${svg("commit", "icon")}4rxecep</acme-pill></div>`,
      },
    ],
    practices: {
      "When to use": [
        "One badge per row; a badge is static and never carries a click handler.",
        "Green healthy, red error, amber warning, blue informational or production, gray neutral; the color carries the state, so no check or X icons.",
      ],
      Content: ["Title Case, one or two words.", "Subtle on dense surfaces; a title attribute on an ambiguous badge."],
    },
  },
  {
    id: "banner",
    title: "Banner",
    lede: "A full-width message that announces important information.",
    tags: ["acme-banner"],
    examples: [
      {
        h: "Default",
        html: `<acme-banner style="display:block;margin:-24px"><b>Vercel Ship 2026</b> is on Sep 24. Save your seat.<acme-button slot="action">Register Now</acme-button></acme-banner>`,
      },
    ],
  },
  {
    id: "book",
    title: "Book",
    lede: "A decorative cover for marketing and docs landings, never for product rows.",
    tags: ["acme-book"],
    examples: [
      {
        h: "Default",
        html: `<div class="row" style="gap:24px;align-items:flex-start"><acme-book heading="The Design of Everyday Things" author="Don Norman"></acme-book><acme-book heading="Next.js Handbook" author="Vercel" hue="blue"></acme-book></div>`,
      },
      {
        h: "Variants",
        p: "simple fills the cover with the hue; stripe keeps a thin band.",
        html: `<div class="row" style="gap:24px;align-items:flex-start"><acme-book variant="simple" hue="teal" heading="Fluid Compute"></acme-book><acme-book variant="stripe" hue="pink" heading="Observability Guide" author="Vercel"></acme-book><acme-book hue="gray" heading="Git Workflows">${svg("branch", "icon")}</acme-book></div>`,
      },
    ],
    practices: { "When to use": ["Marketing and docs landings only; not in dashboards or rows.", "The band takes any token; textured covers are for hero shots only."] },
  },
  {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    lede: "Show the path to the current page and let the reader step back up it.",
    tags: ["acme-breadcrumbs"],
    examples: [
      {
        h: "Text",
        p: "Plain links and a final span with aria-current; the element inserts the separators.",
        html: `<acme-breadcrumbs><a href="#">Home</a><a href="#">Projects</a><span aria-current="page">coding-agent-template</span></acme-breadcrumbs>`,
      },
      { h: "Disabled item", html: `<acme-breadcrumbs><a href="#">Home</a><span class="disabled">Archive</span><span aria-current="page">2025</span></acme-breadcrumbs>` },
      {
        h: "Menu type",
        p: "Each item is a 22px button on background-200.",
        html: `<acme-breadcrumbs variant="menu"><a href="#">acme-labs</a><a href="#">coding-agent-template</a><span aria-current="page">Settings</span></acme-breadcrumbs>`,
      },
    ],
  },
  {
    id: "browser",
    title: "Browser",
    lede: "Marketing chrome around a screenshot, never live UI.",
    tags: ["acme-browser"],
    examples: [
      {
        h: "Default",
        html: `<acme-browser address="https://vercel.com/acme-labs/coding-agent-template"><div style="display:grid;place-items:center;min-height:160px;color:var(--text-2);font-size:14px">A screenshot goes here</div></acme-browser>`,
      },
    ],
    practices: { "When to use": ["A captured screen, not an interactive surface; decorative and aria-hidden, with the accessible name on the inner image."] },
  },
  {
    id: "button",
    title: "Button",
    lede: "Trigger an action or event, such as submitting a form or displaying a dialog.",
    tags: ["acme-button", "acme-button-group"],
    examples: [
      {
        h: "All types and sizes in comparison",
        html: `<div class="vstack"><div class="row"><acme-button size="small" variant="primary">Upload</acme-button><acme-button size="small" variant="error">Upload</acme-button><acme-button size="small" variant="warning">Upload</acme-button><acme-button size="small">Upload</acme-button><acme-button size="small" variant="tertiary">Upload</acme-button></div><div class="row"><acme-button variant="primary">Upload</acme-button><acme-button variant="error">Upload</acme-button><acme-button variant="warning">Upload</acme-button><acme-button>Upload</acme-button><acme-button variant="tertiary">Upload</acme-button></div><div class="row"><acme-button size="large" variant="primary">Upload</acme-button><acme-button size="large" variant="error">Upload</acme-button><acme-button size="large" variant="warning">Upload</acme-button><acme-button size="large">Upload</acme-button><acme-button size="large" variant="tertiary">Upload</acme-button></div></div>`,
      },
      {
        h: "Size",
        p: "small 32, medium 36, large 40 with an 8px radius.",
        html: `<div class="row"><acme-button size="small" variant="primary">Small</acme-button><acme-button variant="primary">Medium</acme-button><acme-button size="large" variant="primary">Large</acme-button></div>`,
      },
      {
        h: "Disabled and loading",
        p: "Disabled is gray-100 with gray-700 text; loading keeps the label and spins at the left.",
        html: `<div class="row"><acme-button variant="primary" disabled>Upload</acme-button><acme-button disabled>Upload</acme-button><acme-button variant="tertiary" disabled>Upload</acme-button><acme-button variant="primary" loading>Saving</acme-button><acme-button loading>Loading</acme-button></div>`,
      },
      {
        h: "Shapes",
        p: "Square and circle at small 32, medium 36, large 40; icon-only needs an aria-label.",
        html: `<div class="row"><acme-button shape="square" size="small" aria-label="Copy page">${svg("copy")}</acme-button><acme-button shape="square" aria-label="Copy page">${svg("copy")}</acme-button><acme-button shape="square" size="large" aria-label="Copy page">${svg("copy")}</acme-button><acme-button shape="circle" size="small" aria-label="Notifications">${svg("bell")}</acme-button><acme-button shape="circle" aria-label="Notifications">${svg("bell")}</acme-button><acme-button shape="circle" size="large" aria-label="Notifications">${svg("bell")}</acme-button></div>`,
      },
      {
        h: "Prefix and suffix",
        html: `<div class="row"><acme-button>${svg("download", "prefix")}Export CSV</acme-button><acme-button>Continue${svg("arrow", "suffix")}</acme-button><acme-button variant="tertiary">${svg("plus", "prefix")}Add Filter</acme-button></div>`,
      },
      { h: "Rounded with shadow", p: "The marketing pill: white, an inset ring, full radius.", html: `<acme-button rounded shadow>Get Started</acme-button>` },
      { h: "Link", p: "An href renders an anchor with the same look.", html: `<acme-button variant="primary" href="#">Visit Deployment${svg("ext", "suffix")}</acme-button>` },
      {
        h: "Group",
        p: "Joined buttons share one border.",
        html: `<acme-button-group><acme-button>Day</acme-button><acme-button>Week</acme-button><acme-button>Month</acme-button></acme-button-group>`,
      },
    ],
    practices: {
      "When to use": [
        "Secondary for the supporting action, error for destructive confirmations. Primary, success, ghost and violet are not variants.",
        "Disable only when the action is impossible, and pair the disabled button with a tooltip that says why.",
      ],
      Content: ["Title Case, Verb + Noun: Deploy Project, Invite Member.", "A destructive button pairs 1:1 with its toast: Delete Project, then Project deleted. Mode switches end in Instead."],
    },
  },
  {
    id: "calendar",
    title: "Calendar",
    lede: "Select a date or a range from a calendar behind a button.",
    tags: ["acme-calendar"],
    examples: [
      {
        h: "Range",
        p: "The trigger is a secondary button labelled with the chosen range; the popover holds the range form and the month grid. Shown static here.",
        html: `<acme-calendar static range value="2026-09-08" end="2026-09-12"></acme-calendar>`,
      },
      { h: "Single date", html: `<acme-calendar static value="2026-09-15"></acme-calendar>` },
      {
        h: "Presets",
        p: "Real buttons for the common ranges.",
        html: `<acme-calendar static range presets='[{"label":"Last 7 Days","days":7},{"label":"Last 30 Days","days":30},{"label":"Month to Date","days":9}]'></acme-calendar>`,
      },
      { h: "Closed", p: "Without static, the calendar opens from the button and closes on Escape or a pick.", html: `<acme-calendar value="2026-09-15" min="2026-01-01"></acme-calendar>` },
    ],
    practices: {
      Behavior: ["Min and max bound the retention window; the timezone can be pinned; Apply commits the range."],
      Content: ["Presets are Title Case (Last 7 Days, Month to Date); the trigger reads the chosen range."],
    },
  },
  {
    id: "checkbox",
    title: "Checkbox",
    lede: "A control that toggles between checked and unchecked, alone or in a list.",
    tags: ["acme-checkbox"],
    examples: [
      {
        h: "Default",
        html: `<div class="row" style="gap:24px"><acme-checkbox>Default</acme-checkbox><acme-checkbox checked>Checked</acme-checkbox><acme-checkbox indeterminate>Indeterminate</acme-checkbox></div>`,
      },
      { h: "Disabled", html: `<div class="row" style="gap:24px"><acme-checkbox disabled>Disabled</acme-checkbox><acme-checkbox checked disabled>Disabled checked</acme-checkbox></div>` },
      {
        h: "Group",
        p: "A fieldset with a Title Case legend and no colon.",
        html: `<fieldset style="border:0;padding:0;margin:0"><legend class="text-label-14" style="font-weight:500">Notify On</legend><div class="vstack" style="gap:8px;margin-top:8px"><acme-checkbox checked>Failed deployments</acme-checkbox><acme-checkbox>Successful deployments</acme-checkbox><acme-checkbox>Domain expiry</acme-checkbox></div></fieldset>`,
      },
    ],
    practices: {
      "When to use": ["Multi-select in lists and acknowledgments. A single boolean setting is a Toggle.", "Indeterminate is a visual state driven by a parent, not a third value."],
      Content: ["An acknowledgment label is a full sentence with a period.", 'A row-select box carries aria-label="Select {row name}".'],
    },
  },
  {
    id: "clearable-input",
    title: "Clearable Input",
    lede: "An input with a button that clears its value, and Escape does the same.",
    tags: ["acme-input"],
    examples: [
      { h: "Default", html: `<acme-input clearable value="coding-agent-template" aria-label="Project" style="max-width:320px"></acme-input>` },
      { h: "Search with ⌘K", p: "The Search Input carries the keycaps.", html: `<acme-search cmdk placeholder="Search projects…" style="max-width:320px"></acme-search>` },
    ],
  },
  {
    id: "code",
    title: "Code",
    lede: "Inline code and a code block for a snippet with highlighting.",
    tags: ["acme-code", "acme-code-block"],
    examples: [
      { h: "Inline", html: `<p class="text-copy-14">Set <acme-code>VERCEL_ENV</acme-code> to <acme-code>production</acme-code> before the build.</p>` },
      {
        h: "Block",
        html: `<acme-code-block language="ts">const res = await fetch("/api/tasks");
if (!res.ok) throw new Error("Failed to load tasks.");</acme-code-block>`,
      },
    ],
  },
  {
    id: "code-block",
    title: "Code Block",
    lede: "Multi-line source with a filename, line numbers and highlighted lines.",
    tags: ["acme-code-block"],
    examples: [
      {
        h: "With filename",
        html: `<acme-code-block filename="app/page.tsx" language="tsx" line-numbers highlight-lines="[2]">export default function Page() {
  return <main>Hello</main>;
}</acme-code-block>`,
      },
      {
        h: "Line numbers only",
        html: `<acme-code-block line-numbers>runtime: "nodejs20.x"
regions: ["iad1"]</acme-code-block>`,
      },
    ],
    practices: { Content: ["Always name the language; highlight only the lines under discussion.", "Show the filename when there is a paste destination; snippets stay runnable and never prefix $."] },
  },
  {
    id: "collapse",
    title: "Collapse",
    lede: "Reveal or hide a section of content behind a title.",
    tags: ["acme-collapse"],
    examples: [
      {
        h: "Default",
        p: "The small form: 48px rows, 16/24 at weight 500.",
        html: `<div><acme-collapse heading="Advanced Settings" open>Root directory, build command and output directory for this project.</acme-collapse><acme-collapse heading="Environment Variables">Values are encrypted at rest.</acme-collapse></div>`,
      },
      {
        h: "Large",
        p: "84px rows with a 24/36 title.",
        html: `<div><acme-collapse large heading="What is Fluid Compute?" open>Fluid compute runs several requests on one function instance and bills active CPU only.</acme-collapse><acme-collapse large heading="How is usage measured?">Per active CPU millisecond, per region.</acme-collapse></div>`,
      },
    ],
    practices: {
      Behavior: [
        "One open at a time when exclusive, several when independent; closed by default; never nested more than one level.",
        "Content stays in the DOM when closed; the trigger carries aria-expanded.",
      ],
      Content: ["Title Case topic names (Advanced Settings); no destructive primary action inside."],
    },
  },
  {
    id: "combobox",
    title: "Combobox",
    lede: "Filters a large list to selectable options based on the matching query.",
    tags: ["acme-combobox"],
    examples: [
      {
        h: "Default",
        p: "Focus opens the list; typing filters it; Enter picks the active option.",
        html: `<acme-combobox options='["One","Two","Three"]' placeholder="Search…" style="display:block;max-width:420px"></acme-combobox>`,
      },
      { h: "With a value", html: `<acme-combobox options='["One","Two","Three"]' value="Two" style="display:block;max-width:420px"></acme-combobox>` },
      {
        h: "Sizes and states",
        html: `<div class="vstack" style="max-width:420px"><acme-combobox size="small" placeholder="Small" options='["One","Two"]'></acme-combobox><acme-combobox size="large" placeholder="Large" options='["One","Two"]'></acme-combobox><acme-combobox placeholder="Disabled" disabled></acme-combobox><acme-combobox value="us-west-9" error="No such region." options='["us-east-1","us-west-2"]' noun="regions"></acme-combobox></div>`,
      },
    ],
    practices: {
      "When to use": ["A known list the user filters by typing. Select for a short fixed list, Multi Select for several values, Search for free text."],
      Content: ["The placeholder names the scope (Search regions), never bare Search…; the empty state reads No {items} match “{query}”."],
    },
  },
  {
    id: "command-menu",
    title: "Command Menu",
    lede: "A set of actions in a full-screen overlay behind ⌘K.",
    tags: ["acme-command-menu"],
    examples: [
      {
        h: "Default",
        p: "Shown static here. Without static it opens on ⌘K and closes on Escape.",
        html: `<acme-command-menu static groups='[{"heading":"Suggestions","items":[{"label":"Deploy Project","icon":"arrow"}]},{"heading":"Commands","items":[{"label":"Import Extension","icon":"folder"},{"label":"Manage Extensions","icon":"file"}]},{"heading":"Collaboration","items":[{"label":"Flags Explorer","icon":"globe"}]}]'></acme-command-menu>`,
      },
      {
        h: "With suffix and footer",
        html: `<acme-command-menu static placeholder="Search projects…" groups='[{"items":[{"label":"coding-agent-template","icon":"folder","suffix":"P"},{"label":"next-year-boilerplate","icon":"folder","suffix":"Project"}]},{"heading":"Settings","items":[{"label":"Settings","icon":"globe","suffix":"⌘ ,"}]}]'><div slot="footer" class="cmdk-foot">3 results</div></acme-command-menu>`,
      },
    ],
    practices: {
      Behavior: ["Focus trapped; an aria-live result count; groups keep the visible label first so typeahead matches."],
      Content: ["Title Case Verb + Noun items (Deploy Project); page labels Title Case; placeholders sentence case ending with …; group names 1–2 words."],
    },
  },
  {
    id: "context-card",
    title: "Context Card",
    lede: "A floating card on hover or focus, richer than a tooltip.",
    tags: ["acme-context-card"],
    examples: [
      {
        h: "Default",
        p: "White, radius 6, the tooltip material, a 14×7 stem, about 150 ms of entry delay. Hover the trigger.",
        html: `<acme-context-card><acme-pill href="#">coding-agent-template</acme-pill><div slot="content"><p class="text-label-14" style="font-weight:500">coding-agent-template</p><p class="text-copy-13" style="color:var(--text-2)">acme-labs · Production</p><acme-description title="Last Deployed" style="margin-top:12px">2h ago</acme-description><acme-description title="Region">iad1</acme-description><acme-button size="small" style="margin-top:12px">View Project</acme-button></div></acme-context-card>`,
      },
      {
        h: "Static",
        p: "The card itself, pinned open.",
        html: `<acme-context-card open static><span class="text-copy-14">Hover me</span><div slot="content">The Evil Rabbit Jumped over the Fence</div></acme-context-card>`,
      },
    ],
    practices: {
      Content: ["A Title Case entity name, one identifying line, then 2–4 Label: value rows with Title Case keys and an em dash for unknowns; at most one primary action."],
      Behavior: ["Never nested in a tooltip; the trigger may be a link, button or badge."],
    },
  },
  {
    id: "context-menu",
    title: "Context Menu",
    lede: "A menu for contextual actions, revealed on right click or long press.",
    tags: ["acme-context-menu", "acme-menu-item"],
    examples: [
      {
        h: "Default",
        p: "Right click the target; the Menu opens at the pointer.",
        html: `<acme-context-menu><div class="context-target">Right click here</div><acme-menu-item slot="items">${svg("eye", "prefix")}Item one</acme-menu-item><acme-menu-item slot="items">${svg("copy", "prefix")}Item Two</acme-menu-item><acme-menu-item slot="items">${svg("edit", "prefix")}Item Three</acme-menu-item><acme-menu-item slot="items">${svg("ext", "prefix")}Item Four</acme-menu-item></acme-context-menu>`,
      },
      {
        h: "Disabled and destructive",
        p: "The same items in a static Menu.",
        html: `<acme-menu static><acme-menu-item slot="items">${svg("eye", "prefix")}Open in New Tab</acme-menu-item><acme-menu-item slot="items">${svg("copy", "prefix")}Copy URL</acme-menu-item><acme-menu-item slot="items" disabled>${svg("edit", "prefix")}Rename…</acme-menu-item><acme-menu-divider slot="items"></acme-menu-divider><acme-menu-item slot="items" danger>${svg("trash", "prefix")}Delete Deployment</acme-menu-item></acme-menu>`,
      },
    ],
    practices: {
      "When to use": ["Power-user shortcuts over a row, file or canvas object; every item also exists in a visible Menu or row button."],
      Behavior: ["Position at the pointer, flip before clipping; close on activation, Escape and outside click, never on hover-out; Shift+F10 opens it from the keyboard."],
    },
  },
  {
    id: "copy-button",
    title: "Copy Button",
    lede: "A button that copies a string and swaps its icon to a check.",
    tags: ["acme-copy-button"],
    examples: [
      {
        h: "Default",
        html: `<div class="row"><acme-copy-button text="prj_WxDl2RuzJGJACJgC661Uj3BEEe5k" label="Copy project ID"></acme-copy-button><acme-copy-button size="small" text="dpl_9WjH8QFQySx7" label="Copy deployment ID"></acme-copy-button></div>`,
      },
    ],
  },
  {
    id: "description",
    title: "Description",
    lede: "A brief heading and content that give the reader context to continue.",
    tags: ["acme-description"],
    examples: [
      { h: "Default", html: `<acme-description title="Section Title" tooltip="Data about this section.">Data about this section.</acme-description>` },
      { h: "Text right", html: `<acme-description title="Section Title" right>Data about this section.</acme-description>` },
      {
        h: "Ellipsis",
        html: `<acme-description title="Section Title" ellipsis style="display:block;max-width:240px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</acme-description>`,
      },
    ],
    practices: {
      Content: [
        "Title Case noun keys (Last Deployed, Region, Plan); sentence-case values unless the value is a literal ID or timestamp.",
        "A tooltip only when the title alone is ambiguous; no controls in the title.",
      ],
    },
  },
  {
    id: "destructive-action-modal",
    title: "Destructive Action Modal",
    lede: "Confirm a destructive action with a required type-to-confirm gate and an irreversibility band.",
    tags: ["acme-destructive-modal"],
    examples: [
      {
        h: "Default",
        p: "Shown static. The primary enables only when the typed phrase matches; submit dispatches acme-confirm.",
        html: `<acme-destructive-modal static heading="Delete Project" phrase="next-year-boilerplate" action="Delete Project" irreversible="Deleting next-year-boilerplate cannot be undone."><b>next-year-boilerplate</b> and all its deployments, domains, and environment variables will be permanently deleted.</acme-destructive-modal>`,
      },
    ],
    practices: {
      Behavior: [
        "The input gets focus on open; submit stays disabled until the phrase matches exactly; loading disables both buttons; an error keeps the modal open.",
        "Reversible but serious actions keep the typed gate and drop the red band.",
      ],
      Content: ["Title Case Verb + Noun as a statement, never a question; the description names the resource in bold; the success toast verb matches the button 1:1."],
    },
  },
  {
    id: "dots-menu",
    title: "Dots Menu",
    lede: "An overflow menu behind a three-dot icon.",
    tags: ["acme-dots-menu", "acme-menu-item"],
    examples: [
      {
        h: "Default",
        p: "Click the dots.",
        html: `<div style="display:flex;justify-content:flex-end;min-height:160px"><acme-dots-menu label="Deployment actions"><acme-menu-item>View Build Logs</acme-menu-item><acme-menu-item>View Projects</acme-menu-item><acme-menu-item disabled>View Analytics</acme-menu-item></acme-dots-menu></div>`,
      },
    ],
  },
  {
    id: "drawer",
    title: "Drawer",
    lede: "Content in a separate view that slides up from the bottom on small viewports.",
    tags: ["acme-drawer"],
    examples: [
      { h: "Default", p: "Shown static here; in a page it is fixed to the bottom over a 40% black scrim.", html: `<acme-drawer static heading="A drawer title">Drawer body</acme-drawer>` },
      {
        h: "With actions",
        html: `<acme-drawer static heading="Filter Logs">Narrow the list to one status or route.<div slot="actions" class="row"><acme-button variant="primary">Apply Filters</acme-button><acme-button>Cancel</acme-button></div></acme-drawer>`,
      },
    ],
    practices: {
      "When to use": ["Small viewports only; Modal or Sheet on desktop; never for a destructive confirmation."],
      Behavior: ["Tap-outside and swipe-down dismiss; body scroll locked; focus trapped and returned; Escape and the system back gesture close it."],
    },
  },
  {
    id: "empty-state",
    title: "Empty State",
    lede: "Fill a space that has no content yet, so the reader knows what to do next.",
    tags: ["acme-empty-state", "acme-icon-tile"],
    examples: [
      { h: "Blank slate", html: `<acme-empty-state heading="Title"><acme-icon-tile slot="icon">${svg("chart")}</acme-icon-tile>A message conveying the state of the product.</acme-empty-state>` },
      {
        h: "Informational",
        html: `<acme-empty-state heading="No Custom Events"><acme-icon-tile slot="icon">${svg("chart")}</acme-icon-tile>This should detail the actions you can take on this screen, as well as why it is valuable.<acme-button slot="actions">Primary Action</acme-button><a slot="actions" href="#">Learn more ${svg("arrow")}</a></acme-empty-state>`,
      },
      {
        h: "No results",
        html: `<acme-empty-state heading="No Logs Match Your Filter">No logs match “status:500”. Clear the filter to see all logs.<acme-button slot="actions">Clear Filter</acme-button></acme-empty-state>`,
      },
      {
        h: "Dashboard forms",
        p: "flat drops the border; quiet is the inline note.",
        html: `<div class="vstack"><acme-empty-state variant="flat" heading="No deployments yet">Push to a connected branch to create one.</acme-empty-state><acme-empty-state variant="quiet">No data for this range.</acme-empty-state></div>`,
      },
    ],
    practices: {
      "When to use": [
        "Pick the variant by need: no-results, blank slate or informational, educational, guide, cleared, permission, error.",
        "One primary CTA, at most one secondary; the CTA is a real button or link.",
      ],
      Content: [
        "Title Case title, sentence-case description that adds new information; quote a typed query with curly quotes.",
        "CTA labels are Title Case Verb + Noun, never Get Started, Continue or OK.",
      ],
    },
  },
  {
    id: "entity",
    title: "Entity",
    lede: "A row of descriptive content with one or two controls at the right.",
    tags: ["acme-entity", "acme-entity-list"],
    examples: [
      {
        h: "Default",
        html: `<acme-entity><acme-avatar slot="left">er</acme-avatar><b>Evil Rabbit</b><span slot="description">Glenn Hitchcock (@gln)</span><span slot="right">Connected 1h ago</span></acme-entity>`,
      },
      {
        h: "List",
        html: `<acme-entity-list><acme-entity>GitHub Desktop on MacBook Pro<span slot="description">Last used just now</span><acme-button slot="right" size="small">Decline</acme-button></acme-entity><acme-entity>VS Code on Windows 11<span slot="description">Last used 10min ago</span><acme-button slot="right" size="small">Decline</acme-button></acme-entity><acme-entity>Terminal on Ubuntu 24.04<span slot="description">Last used 25min ago</span><acme-button slot="right" size="small">Decline</acme-button></acme-entity></acme-entity-list>`,
      },
      {
        h: "List with checkbox",
        html: `<acme-entity-list><acme-entity selectable selected label="GitHub Desktop">GitHub Desktop on MacBook Pro<span slot="description">Last used just now</span></acme-entity><acme-entity selectable label="VS Code">VS Code on Windows 11<span slot="description">Last used 10min ago</span></acme-entity></acme-entity-list>`,
      },
      { h: "Skeleton", html: `<acme-entity loading></acme-entity>` },
    ],
    practices: {
      "When to use": ["Member rows, integration rows, domain rows. Table for sortable columns; Description for a static key/value block."],
      Content: ["Lead with an avatar or icon, a Title Case label, then sentence-case metadata; right-column buttons are Verb + Noun (Remove Member)."],
    },
  },
  {
    id: "error",
    title: "Error",
    lede: "Clear, useful, friendly error copy that unblocks the reader.",
    tags: ["acme-error"],
    examples: [
      { h: "Default", html: `<acme-error>This email address is already in use.</acme-error>` },
      { h: "Custom label", html: `<acme-error label="Email Error">This email address is already in use.</acme-error>` },
      {
        h: "Sizes",
        html: `<div class="vstack"><acme-error size="small">This email is in use.</acme-error><acme-error>This email is in use.</acme-error><acme-error size="large">This email is in use.</acme-error></div>`,
      },
      { h: "With an action", html: `<acme-error>The request failed. <a href="#">Contact Us ${svg("arrow")}</a></acme-error>` },
    ],
    practices: {
      Content: [
        "State what happened, then what to do next; no apology, no humor.",
        "Couldn't or Can't for user-state errors, Failed to for system errors; Unable to and Something went wrong are banned.",
        "Pair a system error with a stable ID in monospace under a collapsed details.",
      ],
      Accessibility: ["The element is aria-live polite; use a Note with role alert only for a blocking error."],
    },
  },
  {
    id: "error-card",
    title: "Error Card",
    lede: "A card that communicates an error state with a title and a message.",
    tags: ["acme-error-card"],
    examples: [{ h: "Default", html: `<acme-error-card title="No credits left">Add a payment method to keep deploying past the free allowance.</acme-error-card>` }],
  },
  {
    id: "feedback",
    title: "Feedback",
    lede: "Gather text feedback with an associated emotion, on desktop.",
    tags: ["acme-feedback"],
    examples: [
      { h: "Trigger", p: "Click to open the panel.", html: `<div class="row"><acme-feedback></acme-feedback><acme-feedback>${svg("flag", "prefix")}</acme-feedback></div>` },
      { h: "Inline", html: `<acme-feedback inline prompt="Was this helpful?"></acme-feedback>` },
      { h: "Panel", p: "The open panel, static.", html: `<acme-feedback static prompt="How did the import go?"></acme-feedback>` },
    ],
    practices: {
      "When to use": ["At the end of a page, doc or completed flow; not a support form or NPS."],
      Behavior: ["Collapsed until clicked; submit closes the panel and returns focus; metadata carries non-PII context (route, build ID, plan)."],
      Content: ["The label is Title Case and short without a question mark; the prompt is sentence case; the placeholder Your feedback... is fixed."],
    },
  },
  {
    id: "fieldset",
    title: "Fieldset",
    lede: "Groups related form controls inside a bordered card with optional footer actions.",
    tags: ["acme-fieldset"],
    examples: [
      {
        h: "Default",
        html: `<acme-fieldset heading="Account Settings"><p slot="description" class="desc">Manage your account preferences and profile information.</p><span slot="status">Need help? <a href="#">View documentation</a></span><acme-button slot="actions" size="small" variant="primary">Save Changes</acme-button></acme-fieldset>`,
      },
      {
        h: "With error text",
        html: `<acme-fieldset heading="API Configuration" status="Last checked: 5 minutes ago"><p slot="description" class="desc">Configure your API endpoints and authentication.</p><acme-error>API key validation failed. Check the key and try again.</acme-error><acme-button slot="actions" size="small" variant="primary">Verify API Connection</acme-button></acme-fieldset>`,
      },
      {
        h: "Error type",
        html: `<acme-fieldset variant="error" heading="Payment Failed" status="Payment failed on February 14"><p slot="description" class="desc">Your payment method was declined.</p><acme-button slot="actions" size="small">Contact Support</acme-button><acme-button slot="actions" size="small" variant="primary">Update Payment Method</acme-button></acme-fieldset>`,
      },
      {
        h: "Warning type",
        html: `<acme-fieldset variant="warning" heading="Trial Ending Soon" status="Trial expires: February 20"><p slot="description" class="desc">Your trial period will end in 3 days.</p><acme-button slot="actions" size="small">Remind Me Later</acme-button><acme-button slot="actions" size="small" variant="primary">Add Payment Method</acme-button></acme-fieldset>`,
      },
      {
        h: "Disabled wall",
        html: `<acme-fieldset disabled heading="Advanced Features" status="Upgrade to a Pro plan to unlock these features."><p slot="description" class="desc">Access premium capabilities.</p><div class="disabled-wall">This content is behind a plan gate.</div></acme-fieldset>`,
      },
    ],
  },
  {
    id: "file-tree",
    title: "File Tree",
    lede: "A hierarchical directory structure with expandable folders and files.",
    tags: ["acme-file-tree"],
    examples: [
      {
        h: "Default",
        html: `<acme-file-tree data='[{"name":".vercel","open":true,"children":[{"name":"output","open":true,"children":[{"name":"functions","open":true,"children":[{"name":"edge.func","open":true,"children":[{"name":".vc-config.json","href":"#"},{"name":"index.js","href":"#","current":true}]}]}]}]},{"name":"app","children":[{"name":"page.tsx","href":"#"}]},{"name":"package.json","href":"#"}]'></acme-file-tree>`,
      },
    ],
    practices: { "When to use": ["Illustrating a project layout; rows are 28px mono, each level indents 16px behind a guide line."] },
  },
  {
    id: "gauge",
    title: "Gauge",
    lede: "A circular visual for a percentage against a fixed maximum.",
    tags: ["acme-gauge"],
    examples: [
      {
        h: "Size",
        p: "tiny 20, small 32, medium 64, large 128.",
        html: `<div class="row" style="gap:32px"><acme-gauge size="tiny" value="50"></acme-gauge><acme-gauge value="50"></acme-gauge><acme-gauge size="medium" value="50"></acme-gauge><acme-gauge size="large" value="50"></acme-gauge></div>`,
      },
      {
        h: "Label",
        html: `<div class="row" style="gap:32px"><acme-gauge value="80" show-value></acme-gauge><acme-gauge size="medium" value="80" show-value></acme-gauge><acme-gauge size="large" value="100" show-value></acme-gauge></div>`,
      },
      {
        h: "Default color scale",
        p: "red-800 low, amber-700 mid, green-700 high; the arc follows the value.",
        html: `<div class="row" style="gap:32px"><acme-gauge value="14"></acme-gauge><acme-gauge value="34"></acme-gauge><acme-gauge value="68"></acme-gauge><acme-gauge value="92"></acme-gauge></div>`,
      },
      { h: "Custom color", html: `<acme-gauge size="medium" value="50" color="accent"></acme-gauge>` },
    ],
    practices: {
      "When to use": ["A 0–100 ratio where the comparison is the point: quota, cache hit rate, uptime. Progress for known task progress; Status Dot or Badge for a state."],
      Content: ["Always pair the gauge with a label naming the metric; thresholds match the product's breakpoints (80 warning, 95 error)."],
    },
  },
  {
    id: "grid",
    title: "Grid",
    lede: "Display elements in a grid with visible guide lines.",
    tags: ["acme-grid", "acme-grid-cell", "acme-grid-cross"],
    examples: [
      {
        h: "Basic grid",
        html: `<acme-grid columns="3"><acme-grid-cell>1</acme-grid-cell><acme-grid-cell>2</acme-grid-cell><acme-grid-cell>3</acme-grid-cell><acme-grid-cell>4</acme-grid-cell><acme-grid-cell>5</acme-grid-cell><acme-grid-cell>6</acme-grid-cell></acme-grid>`,
      },
      {
        h: "Solid cells",
        p: "A solid cell occludes the guides it overlaps.",
        html: `<acme-grid columns="3"><acme-grid-cell solid span="2">1 + 2</acme-grid-cell><acme-grid-cell>3</acme-grid-cell><acme-grid-cell>4</acme-grid-cell><acme-grid-cell solid span="2">5 + 6</acme-grid-cell></acme-grid>`,
      },
      {
        h: "Hidden guides",
        html: `<div class="vstack" style="gap:24px"><acme-grid columns="6" hide-guides="row"><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell></acme-grid><acme-grid columns="6" hide-guides="column"><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell></acme-grid></div>`,
      },
      {
        h: "Dashed grid with cross and page",
        html: `<acme-grid columns="1" dashed page><acme-grid-cross slot="cross" style="left:0;top:0"></acme-grid-cross><acme-grid-cross slot="cross" style="right:-11px;top:0;transform:translate(0,-50%)"></acme-grid-cross><acme-grid-cell>Content here</acme-grid-cell></acme-grid>`,
      },
      {
        h: "Debug",
        html: `<acme-grid columns="5" debug><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell><acme-grid-cell></acme-grid-cell></acme-grid>`,
      },
    ],
    practices: {
      "When to use": ["Marketing pages, docs landings and feature breakdowns where the rule lines are part of the design; plain CSS grid for app content."],
      Behavior: ["Set columns and rows at every breakpoint; solid cells for opaque tiles; hide guides only when it helps; never nest more than one level; guides are aria-hidden."],
    },
  },
  {
    id: "input",
    title: "Input",
    lede: "Retrieve text input from a user.",
    tags: ["acme-input"],
    examples: [
      {
        h: "Size",
        html: `<div class="row" style="gap:16px;align-items:flex-start"><acme-input size="small" placeholder="Small" aria-label="Small" style="width:194px"></acme-input><acme-input placeholder="Medium" aria-label="Medium" style="width:194px"></acme-input><acme-input size="large" placeholder="Large" aria-label="Large" style="width:221px"></acme-input></div>`,
      },
      {
        h: "Prefix and suffix",
        html: `<div class="vstack" style="gap:16px;max-width:340px"><acme-input prefix="https://" suffix=".com" placeholder="Default" aria-label="URL"></acme-input><acme-input prefix="vercel/" placeholder="Default" aria-label="Repository"></acme-input></div>`,
      },
      { h: "Disabled", html: `<acme-input placeholder="Disabled with placeholder" disabled style="max-width:194px"></acme-input>` },
      { h: "Error", html: `<acme-input type="email" value="long-error@gmail.com" error="An error message." style="max-width:194px"></acme-input>` },
      { h: "Label and helper", html: `<acme-input label="Label" placeholder="Label" helper="Helper text." style="max-width:194px"></acme-input>` },
      { h: "Rounded prefix and suffix", html: `<acme-input rounded prefix="www." suffix=".com" placeholder="Label example" aria-label="Domain" style="max-width:340px"></acme-input>` },
    ],
    practices: {
      Behavior: ["Validate on blur, not on every keystroke; trim whitespace before submit; keep the field focusable while saving."],
      Content: [
        "Labels are short Title Case nouns; placeholders show an example value, never an instruction.",
        "Helper text is one sentence with a period; validation names the field and the constraint and skips please.",
      ],
    },
  },
];
