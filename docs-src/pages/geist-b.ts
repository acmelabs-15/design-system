// Geist component pages, JSON View to Video, in Geist's nav order.
import type { Doc } from "../site";
import { ic } from "../site";

const svg = (n: string, slot = "") => ic(n, slot ? ` slot="${slot}"` : "");
const tableRows = `[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]`;
const tableCols = `[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]`;

export const geistB: Doc[] = [
  {
    id: "json-view",
    title: "JSON View",
    lede: "Render JSON objects and arrays as a collapsible tree with syntax coloring.",
    tags: ["acme-json-view"],
    examples: [
      {
        h: "Default",
        p: "Levels below expand-depth start collapsed.",
        html: `<acme-json-view data='{"deployment":{"id":"dpl_9WjH8QFQySx7","project":"docs","target":"production"},"request":{"method":"GET","status":200},"cached":false,"error":null}'></acme-json-view>`,
      },
      { h: "Expanded", html: `<acme-json-view expand-depth="3" data='{"deployment":{"id":"dpl_9WjH8QFQySx7","regions":["iad1","sfo1"]}}'></acme-json-view>` },
      {
        h: "Highlighted",
        p: "Search matches in field names and values.",
        html: `<acme-json-view expand-depth="2" highlight="request" data='{"level":"error","requestId":"req_00042","message":"Deployment request failed","statusCode":500}'></acme-json-view>`,
      },
    ],
    practices: {
      "When to use": ["JSON the reader inspects, collapses, selects or copies; a code block for static documentation."],
      Behavior: ["Depth 1 for logs and detail surfaces, 0 for dense tables; highlight only during an active search; keep the text selectable."],
    },
  },
  {
    id: "keyboard-input",
    title: "Keyboard Input",
    lede: "Display a keyboard shortcut that triggers an action.",
    tags: ["acme-kbd"],
    examples: [
      {
        h: "Modifiers",
        p: "The modifier props render the platform's glyph: ⌘ on a Mac, Ctrl elsewhere.",
        html: `<div class="row" style="gap:8px"><acme-kbd meta></acme-kbd><acme-kbd shift></acme-kbd><acme-kbd alt></acme-kbd><acme-kbd ctrl></acme-kbd></div>`,
      },
      { h: "Combination", html: `<div class="row" style="gap:8px"><acme-kbd meta shift></acme-kbd><acme-kbd meta>K</acme-kbd></div>` },
      { h: "Small", html: `<acme-kbd small>/</acme-kbd>` },
    ],
    practices: {
      Content: ["One key per element; modifiers swap ⌘ for Ctrl on Windows and Linux; punctuation stays outside the element.", "Small inside dense surfaces: menu rows, command items, table cells."],
    },
  },
  {
    id: "label",
    title: "Label",
    lede: "Accessible text label for form controls.",
    tags: ["acme-label"],
    examples: [
      { h: "Default", html: `<acme-label>This is a label</acme-label>` },
      {
        h: "With input",
        p: "Input carries its own label; use acme-label for a control that has none.",
        html: `<acme-input label="Email Address" type="email" placeholder="Enter email address..." style="max-width:280px"></acme-input>`,
      },
      { h: "Bypass casing", html: `<acme-label bypass-casing>Email address</acme-label>` },
    ],
  },
  {
    id: "load-more-button",
    title: "Load More Button",
    lede: "A full-width button that appends more items to a paginated list.",
    tags: ["acme-load-more"],
    examples: [
      { h: "Default", html: `<acme-load-more></acme-load-more>` },
      { h: "Loading", html: `<acme-load-more loading></acme-load-more>` },
      { h: "Custom text", html: `<acme-load-more>Show More Results</acme-load-more>` },
    ],
  },
  {
    id: "loading-dots",
    title: "Loading Dots",
    lede: "Indicate an action running in the background, inside copy.",
    tags: ["acme-loading-dots"],
    examples: [
      {
        h: "Default",
        html: `<div class="row" style="gap:24px"><acme-loading-dots size="small"></acme-loading-dots><acme-loading-dots></acme-loading-dots><acme-loading-dots size="large"></acme-loading-dots></div>`,
      },
      { h: "With text", html: `<p class="text-copy-14" style="color:var(--text-2)" aria-live="polite"><acme-loading-dots>Loading</acme-loading-dots></p>` },
    ],
    practices: {
      "When to use": [
        "Short indeterminate waits inside copy: Saving, Building. For buttons, the loading state of Button; for layout, Skeleton; for known progress, Progress; icon-sized waits, Spinner.",
      ],
      Content: ["Name the work in flight (Deploying, Uploading); never after a completed verb."],
    },
  },
  {
    id: "menu",
    title: "Menu",
    lede: "A dropdown list of actions opened from a button, with typeahead and keyboard navigation.",
    tags: ["acme-menu", "acme-menu-item", "acme-menu-section", "acme-menu-divider"],
    examples: [
      {
        h: "Default",
        p: "The trigger slot opens the items slot. Shown static.",
        html: `<div class="row" style="gap:24px;align-items:flex-start"><acme-menu static><acme-button slot="trigger" variant="primary">Actions</acme-button><acme-menu-item slot="items">One</acme-menu-item><acme-menu-item slot="items">Two</acme-menu-item><acme-menu-item slot="items">Three</acme-menu-item><acme-menu-item slot="items" href="#">Test for a link${svg("ext", "suffix")}</acme-menu-item></acme-menu><acme-menu static><acme-button slot="trigger">Actions${svg("chev", "suffix")}</acme-button><acme-menu-item slot="items">Rename Project</acme-menu-item><acme-menu-item slot="items" disabled>Transfer Project…</acme-menu-item><acme-menu-divider slot="items"></acme-menu-divider><acme-menu-item slot="items" danger>Delete Project</acme-menu-item></acme-menu></div>`,
      },
      {
        h: "With section, shortcut and lock",
        html: `<acme-menu static><acme-button slot="trigger">Actions</acme-button><acme-menu-section slot="items" heading="Section"><acme-menu-item>One</acme-menu-item><acme-menu-item>Two</acme-menu-item></acme-menu-section><acme-menu-divider slot="items"></acme-menu-divider><acme-menu-item slot="items" locked>Three</acme-menu-item><acme-menu-item slot="items" shortcut="⌘K">Four</acme-menu-item></acme-menu>`,
      },
      {
        h: "Live",
        p: "Click to open; Escape, outside click and activation close it.",
        html: `<div style="min-height:200px"><acme-menu><acme-button slot="trigger" variant="primary">Actions</acme-button><acme-menu-item slot="items">Rename Project</acme-menu-item><acme-menu-item slot="items">Transfer Project…</acme-menu-item><acme-menu-divider slot="items"></acme-menu-divider><acme-menu-item slot="items" danger>Delete Project</acme-menu-item></acme-menu></div>`,
      },
    ],
    practices: {
      Behavior: [
        "Open on click, not hover; close on activation, Escape and outside click; return focus to the trigger; auto-flip at the window bounds.",
        "Cap around 10 items; group with a section past that; lock permission-gated items with a lock suffix.",
      ],
      Content: ["Title Case Verb + Noun (Rename Project); … only when a dialog follows; destructive items last after a divider; section titles 1–2 words."],
    },
  },
  {
    id: "middle-truncate",
    title: "Middle Truncate",
    lede: "Truncate in the middle so the start and the end of a string both survive.",
    tags: ["acme-middle-truncate"],
    examples: [
      {
        h: "Examples",
        html: `<div class="vstack" style="gap:8px;max-width:420px"><div class="row" style="gap:16px;padding:12px 16px;border:1px solid var(--ds-gray-alpha-200);border-radius:6px"><span class="text-copy-13" style="width:128px;flex:none;color:var(--text-2)">Branch</span><acme-middle-truncate text="feature/redesign-dashboard-analytics-charts-with-new-tokens" tail="6"></acme-middle-truncate></div><div class="row" style="gap:16px;padding:12px 16px;border:1px solid var(--ds-gray-alpha-200);border-radius:6px"><span class="text-copy-13" style="width:128px;flex:none;color:var(--text-2)">Deployment</span><acme-middle-truncate class="mono" style="font-size:13px" text="dpl_8gmXTT1yJRP8UbGfXDvw5jhTE3Rb9" tail="4"></acme-middle-truncate></div></div>`,
      },
    ],
    practices: {
      "When to use": [
        "Paths, URLs, deployment IDs, commit hashes, branch names with prefixes; prose and headings end-truncate.",
        "Pair with a tooltip or a copy affordance; copying yields the full string.",
      ],
    },
  },
  {
    id: "modal",
    title: "Modal",
    lede: "Display popup content that requires attention or provides additional information.",
    tags: ["acme-modal", "acme-modal-inset"],
    examples: [
      {
        h: "Default",
        p: "Shown static. Without static the modal opens with showModal() on open.",
        html: `<acme-modal static heading="Create Token"><p slot="subtitle">Enter a unique name for your token to differentiate it from other tokens and then select the scope.</p><p>Some content contained within the modal.</p><acme-button slot="actions">Cancel</acme-button><acme-button slot="actions" variant="primary">Submit</acme-button></acme-modal>`,
      },
      {
        h: "Inset",
        html: `<acme-modal static heading="Modal"><p slot="subtitle">This is a modal.</p><acme-modal-inset><p>Content within the inset.</p></acme-modal-inset><p style="margin-top:20px">Content outside the inset.</p><acme-button slot="actions">Cancel</acme-button><acme-button slot="actions" variant="primary">Submit</acme-button></acme-modal>`,
      },
      {
        h: "Single button",
        html: `<acme-modal static heading="Token Created"><p slot="subtitle">Copy the token now. It is shown once.</p><acme-snippet text="vcp_9WjH8QFQySx7…" prompt="false"></acme-snippet><acme-button slot="actions" variant="primary">Done</acme-button></acme-modal>`,
      },
      {
        h: "Live",
        p: "Open it from a button; Escape and the backdrop close it.",
        html: `<acme-button onclick="this.nextElementSibling.open = true">Open Modal</acme-button><acme-modal heading="Create Token"><p slot="subtitle">Enter a unique name for your token.</p><acme-input label="Name" placeholder="CI token"></acme-input><acme-button slot="actions" onclick="this.closest('acme-modal').open = false">Cancel</acme-button><acme-button slot="actions" variant="primary" onclick="this.closest('acme-modal').open = false">Submit</acme-button></acme-modal>`,
      },
    ],
    practices: {
      "When to use": ["A decision that must block the page. Sheet for persistent context on desktop, Drawer on mobile. Destructive confirmations belong in a Modal."],
      Behavior: ["Focus trapped; default focus on Cancel for a destructive modal; Escape and outside click dismiss non-destructive ones; return focus to the trigger."],
      Content: ["Title Case statement, never a question; body 1–3 sentences with the consequence first; primary Verb + Noun matching the title; Cancel stays Cancel; acknowledgment modals use Done."],
    },
  },
  {
    id: "multi-select",
    title: "Multi Select",
    lede: "A keyboard-navigable dropdown for selecting several items.",
    tags: ["acme-multi-select"],
    examples: [
      {
        h: "Default",
        p: "The trigger reads the count; each row has a checkbox and a button whose action label appears on hover or focus.",
        html: `<acme-multi-select static options='[{"value":"ds","label":"Design System"},{"value":"c","label":"Components"},{"value":"t","label":"Design Tokens"}]' value='["ds","c"]' noun="categories"></acme-multi-select>`,
      },
      { h: "Single selection", html: `<acme-multi-select options='[{"value":"a","label":"analytics"},{"value":"b","label":"billing"}]' value='["a"]'></acme-multi-select>` },
    ],
    practices: {
      "When to use": ["More than one value from a known list (regions, scopes, tags); Select for one value, Combobox when filtering matters, Toggle for a boolean."],
      Behavior: ["Up and Down move rows, Left and Right move between the checkbox and the button; the trigger shows the count, or the single name."],
    },
  },
  {
    id: "note",
    title: "Note",
    lede: "Display text that requires attention or provides additional information.",
    tags: ["acme-note"],
    examples: [
      { h: "Default", html: `<acme-note>A default note.</acme-note>` },
      { h: "Size", html: `<div class="vstack"><acme-note size="small">A small note.</acme-note><acme-note>A medium note.</acme-note><acme-note size="large">A large note.</acme-note></div>` },
      { h: "Action", html: `<acme-note>This note details something that needs an action.<acme-button slot="action" size="small" variant="primary">Upgrade</acme-button></acme-note>` },
      {
        h: "Variants",
        html: `<div class="vstack"><acme-note variant="success">This note details something positive. <a href="#">Learn more</a></acme-note><acme-note variant="error">This note details an error.</acme-note><acme-note variant="warning">This note details a warning.</acme-note><acme-note variant="secondary">This note is secondary.</acme-note><acme-note variant="violet">This note is violet.</acme-note><acme-note variant="cyan">This note is cyan.</acme-note></div>`,
      },
      {
        h: "Fill",
        html: `<div class="vstack"><acme-note variant="success" fill>Filled success.</acme-note><acme-note variant="error" fill>Filled error.</acme-note><acme-note variant="warning" fill>Filled warning.</acme-note><acme-note variant="secondary" fill>Filled secondary.</acme-note></div>`,
      },
      { h: "Label", html: `<acme-note><b slot="label" class="label">Region Change:</b>Changing this region restarts all functions.</acme-note>` },
      { h: "Disabled", html: `<acme-note disabled>This note details a warning that no longer applies.<acme-button slot="action" size="small">Upgrade</acme-button></acme-note>` },
    ],
    practices: {
      "When to use": [
        "Inline contextual feedback beside the field, card or section it describes. Banner for page-level, Toast for transient, Modal for destructive confirmations.",
        "Error for a problem to fix, warning for a consequence to acknowledge, success for a passed check, secondary for neutral information; there is no info variant.",
      ],
      Behavior: ["Persistent until the state changes; no dismiss control; one Note per concept; a single inline CTA."],
      Content: ["A 1–2 word Title Case label names the topic (Region Change); the body is one active sentence naming the impact."],
    },
  },
  {
    id: "pagination",
    title: "Pagination",
    lede: "Navigate to the previous or next page.",
    tags: ["acme-pagination"],
    examples: [{ h: "Default", html: `<acme-pagination prev-title="Home" prev-href="#" next-title="Introduction" next-href="#"></acme-pagination>` }],
    practices: { Content: ["Sibling pages only; titles are the destination names in Title Case with the distinctive word first; hide an end slot rather than disable it."] },
  },
  {
    id: "phone",
    title: "Phone",
    lede: "A realistic phone frame for screenshots and recordings.",
    tags: ["acme-phone"],
    examples: [{ h: "Composition", html: `<acme-phone address="vercel.com"></acme-phone>` }],
    practices: { "When to use": ["Marketing chrome around a mobile screenshot; decorative and aria-hidden; the inner image carries the alt text and a real device ratio."] },
  },
  {
    id: "progress",
    title: "Progress",
    lede: "Display progress relative to a limit or a task.",
    tags: ["acme-progress"],
    examples: [
      { h: "Default", html: `<acme-progress value="30" aria-label="Upload"></acme-progress>` },
      {
        h: "Themed",
        html: `<div class="vstack" style="gap:24px"><acme-progress variant="success" value="100"></acme-progress><acme-progress variant="error" value="10"></acme-progress><acme-progress variant="warning" value="40"></acme-progress><acme-progress variant="secondary" value="70"></acme-progress></div>`,
      },
      { h: "With stops", html: `<acme-progress variant="success" value="30" stops="[25,50,75]"></acme-progress>` },
      {
        h: "Heights",
        html: `<div class="vstack" style="gap:24px"><acme-progress value="60" height="4"></acme-progress><acme-progress value="60"></acme-progress><acme-progress value="60" height="24"></acme-progress></div>`,
      },
    ],
    practices: {
      "When to use": ["Determinate work with a knowable total: uploads, setup steps, batch deletions. Spinner for short waits, Loading Dots inline, Gauge for a quota."],
      Content: ["Pair the bar with text naming the work and the units: Uploading 12 of 30 files."],
    },
  },
  {
    id: "project-banner",
    title: "Project Banner",
    lede: "A project-wide notification that needs resolution and cannot be dismissed.",
    tags: ["acme-project-banner"],
    examples: [
      {
        h: "Variants",
        html: `<div class="vstack" style="margin:-24px"><acme-project-banner>${svg("shield", "icon")}Attack Challenge Mode is enabled for this project.<a slot="action" href="#">Disable</a></acme-project-banner><acme-project-banner variant="success">${svg("shield", "icon")}Attack Challenge Mode is enabled for this project.<a slot="action" href="#">Disable</a></acme-project-banner><acme-project-banner variant="warning">${svg("rollback", "icon")}This project was rolled back by <span>@johnphamous</span>.<button slot="action">Undo Rollback</button></acme-project-banner><acme-project-banner variant="error">${svg("warn-tri", "icon")}Payment failed, update your card to keep deploying.<a slot="action" href="#">Add Credit Card</a></acme-project-banner></div>`,
      },
    ],
    practices: {
      "When to use": ["Overdue billing, an active rollback, attack mitigation, an expiring trial. One at a time; always with a call to action that resolves the state."],
      Content: ["One sentence in sentence case naming the impact; the CTA is Title Case Verb + Noun (Update Payment Method)."],
    },
  },
  {
    id: "radio",
    title: "Radio",
    lede: "Single user input from a selection of options.",
    tags: ["acme-radio"],
    examples: [
      { h: "Default", html: `<div class="row" style="gap:24px"><acme-radio name="r1" value="1" checked>Option 1</acme-radio><acme-radio name="r1" value="2">Option 2</acme-radio></div>` },
      { h: "Disabled", html: `<div class="row" style="gap:24px"><acme-radio name="r2" checked disabled>Option 1</acme-radio><acme-radio name="r2" disabled>Option 2</acme-radio></div>` },
      {
        h: "Group",
        html: `<fieldset style="border:0;padding:0;margin:0"><legend class="text-label-14" style="font-weight:500">Billing Cycle</legend><div class="vstack" style="gap:8px;margin-top:8px"><acme-radio name="r3" value="monthly" checked>Monthly</acme-radio><acme-radio name="r3" value="yearly">Yearly</acme-radio></div></fieldset>`,
      },
    ],
    practices: {
      "When to use": ["Two to six mutually exclusive options where seeing every option matters. Past six, Select or Combobox; binary, Toggle; rich options, Choicebox."],
      Content: ["Group label is a Title Case noun in a legend; option labels stay parallel (Monthly / Yearly); a disabled option gets a tooltip naming why."],
    },
  },
  {
    id: "relative-time-card",
    title: "Relative Time Card",
    lede: "A popover that shows a given date in local time.",
    tags: ["acme-relative-time"],
    examples: [
      {
        h: "Default",
        p: "The trigger renders the short form; hover shows the moment in UTC and local time.",
        html: `<div class="row" style="gap:32px"><acme-relative-time date="1789002000000"></acme-relative-time><acme-relative-time date="1788900000000"></acme-relative-time><acme-relative-time date="1788300000000"></acme-relative-time></div>`,
      },
      { h: "Static", p: "The card pinned open.", html: `<div style="min-height:140px"><acme-relative-time static open date="1789002000000"></acme-relative-time></div>` },
    ],
    practices: {
      "When to use": ["Recent timestamps in tables, entity rows, deploy lists and feeds; past 7 days in prose, render Mar 14, 2026 directly."],
      Content: ["Pass the date as epoch ms; the formatter produces 2m, 5h, Yesterday and already includes ago; children only for non-time labels (Just now, Queued)."],
    },
  },
  {
    id: "scroller",
    title: "Scroller",
    lede: "Display an overflowing list of items along one axis with edge fades.",
    tags: ["acme-scroller"],
    examples: [
      {
        h: "Horizontal",
        html: `<acme-scroller>${Array.from({ length: 8 }, (_, i) => `<div style="flex:none;width:232px;height:120px;border-radius:6px;background:var(--ds-gray-1000);color:var(--ds-background-100);display:grid;place-items:center;font-weight:500">${i + 1}</div>`).join("")}</acme-scroller>`,
      },
      {
        h: "With buttons",
        html: `<acme-scroller buttons label="customer logos">${Array.from({ length: 8 }, (_, i) => `<div style="flex:none;width:160px;height:80px;border-radius:6px;background:var(--comp);display:grid;place-items:center;font-weight:500">${i + 1}</div>`).join("")}</acme-scroller>`,
      },
    ],
  },
  {
    id: "search-input",
    title: "Search Input",
    lede: "A search input with a magnifying glass and a clear button.",
    tags: ["acme-search"],
    examples: [
      { h: "Default", html: `<acme-search placeholder="Search projects" style="max-width:360px"></acme-search>` },
      { h: "With ⌘K", html: `<acme-search cmdk placeholder="Search projects" style="max-width:360px"></acme-search>` },
      { h: "Disabled", html: `<acme-search placeholder="Search projects" disabled style="max-width:360px"></acme-search>` },
      { h: "Loading", html: `<acme-search value="Project A" loading style="max-width:360px"></acme-search>` },
    ],
  },
  {
    id: "select",
    title: "Select",
    lede: "Display a dropdown list of items.",
    tags: ["acme-select"],
    examples: [
      {
        h: "Size",
        html: `<div class="row" style="gap:16px;align-items:flex-start"><acme-select size="small" options='["Small"]' aria-label="Small"></acme-select><acme-select options='["Medium"]' aria-label="Medium"></acme-select><acme-select size="large" options='["Large"]' aria-label="Large"></acme-select></div>`,
      },
      { h: "Disabled", html: `<acme-select disabled options='["Disabled"]' style="max-width:220px"></acme-select>` },
      { h: "Error", html: `<acme-select error="Select a framework." placeholder="Default with error" options='["Next.js","Astro"]' style="max-width:220px"></acme-select>` },
      { h: "Label", html: `<acme-select label="My Label" options='["With label"]' style="max-width:220px"></acme-select>` },
      { h: "With options and a placeholder", html: `<acme-select placeholder="Fruit" options='["Apple","Orange","Mango"]' style="max-width:220px"></acme-select>` },
    ],
    practices: {
      "When to use": ["Short fixed lists under ~10 items; Combobox once filtering helps; MultiSelect for several values; Switch for a 2–3 option segmented choice."],
      Content: ["Title Case options that match canonical branding (Next.js); a short Title Case noun label; an action-oriented placeholder (Select a framework); validate on blur."],
    },
  },
  {
    id: "separator",
    title: "Separator",
    lede: "A visual divider between sections, horizontal or vertical.",
    tags: ["acme-separator"],
    examples: [
      {
        h: "Horizontal",
        html: `<div><h3 class="text-label-16">Section 1</h3><p class="text-copy-14" style="color:var(--text-2)">This is the first section.</p><acme-separator></acme-separator><h3 class="text-label-16">Section 2</h3><p class="text-copy-14" style="color:var(--text-2)">This is the second section.</p></div>`,
      },
      {
        h: "Vertical",
        html: `<div class="row" style="gap:16px;height:32px"><span class="text-copy-14">Home</span><acme-separator vertical></acme-separator><span class="text-copy-14">Services</span><acme-separator vertical></acme-separator><span class="text-copy-14">Contact</span></div>`,
      },
    ],
  },
  {
    id: "sheet",
    title: "Sheet",
    lede: "Content in a side panel that slides in from the edge of the screen.",
    tags: ["acme-sheet"],
    examples: [
      {
        h: "Default",
        p: "Inset 12px from the edges, radius 16, the page stays interactive. Shown static.",
        html: `<acme-sheet static heading="Sheet Title"><p slot="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<acme-button slot="actions">Close</acme-button><acme-button slot="actions" variant="primary">Next</acme-button></acme-sheet>`,
      },
    ],
    practices: {
      "When to use": ["Persistent associated context: deployment details, log row inspection, a member profile. Modal for a blocking decision, Drawer for mobile."],
      Behavior: ["Outside click does not close, so always render Close and honor Escape; trap focus and return it to the trigger row."],
      Content: ["Title Case title naming the entity (Deployment Details); read-mostly body; buttons Verb + Noun."],
    },
  },
  {
    id: "show-more",
    title: "Show More",
    lede: "Progressive disclosure of a single long list or block.",
    tags: ["acme-show-more"],
    examples: [
      { h: "Default", html: `<acme-show-more></acme-show-more>` },
      { h: "Expanded", html: `<acme-show-more expanded></acme-show-more>` },
      { h: "No border, with a count", html: `<acme-show-more no-border count="12"></acme-show-more>` },
    ],
    practices: { Behavior: ["Show 5–10 rows before truncating; name the hidden count (Show 12 More); move focus to the first revealed row; aria-expanded on the trigger."] },
  },
  {
    id: "skeleton",
    title: "Skeleton",
    lede: "Display a placeholder while the real content loads.",
    tags: ["acme-skeleton"],
    examples: [
      { h: "Default with set width", html: `<acme-skeleton width="160px"></acme-skeleton>` },
      { h: "Box height", html: `<acme-skeleton width="160px" height="42px"></acme-skeleton>` },
      {
        h: "Shapes",
        p: "Pill for avatars, rounded for buttons and chips, squared for image tiles.",
        html: `<div class="row" style="gap:16px"><acme-skeleton shape="pill" width="48px" height="48px"></acme-skeleton><acme-skeleton shape="rounded" width="96px" height="36px"></acme-skeleton><acme-skeleton shape="squared" width="48px" height="48px"></acme-skeleton></div>`,
      },
      { h: "No animation", html: `<acme-skeleton still height="100px"></acme-skeleton>` },
    ],
    practices: {
      "When to use": ["Async data filling a known layout: rows, card grids, profile blocks. Never as decoration or as an empty state."],
      Behavior: ["Match the final content's size so nothing shifts; aria-busy on the region; honor reduced motion."],
    },
  },
  {
    id: "slider",
    title: "Slider",
    lede: "Select a value from a range.",
    tags: ["acme-slider"],
    examples: [
      { h: "Default", html: `<acme-slider value="50" aria-label="Volume"></acme-slider>` },
      { h: "With label", html: `<acme-slider label="Volume" value="40"></acme-slider>` },
      { h: "Disabled", html: `<acme-slider value="25" disabled aria-label="Volume"></acme-slider>` },
    ],
    practices: {
      "When to use": [
        "Ranged numeric input where shape matters more than precision. Pair with a numeric Input for exact values; snap to a sensible step; show the live value in tabular numbers with its unit.",
      ],
    },
  },
  {
    id: "snippet",
    title: "Snippet",
    lede: "A copyable command for the command line.",
    tags: ["acme-snippet"],
    examples: [
      { h: "Default", html: `<acme-snippet text="npm init next-app" style="display:block;max-width:300px"></acme-snippet>` },
      { h: "Inverted", html: `<acme-snippet variant="dark" text="npm init next-app" style="display:block;max-width:300px"></acme-snippet>` },
      { h: "Multi line", html: `<acme-snippet lines='["cd project","now"]'></acme-snippet>` },
      { h: "No prompt", html: `<acme-snippet prompt="false" text="https://vercel.com/acme-labs" style="display:block;max-width:300px"></acme-snippet>` },
      {
        h: "Variants",
        html: `<div class="vstack" style="max-width:300px"><acme-snippet variant="success" text="npm init next-app"></acme-snippet><acme-snippet variant="error" text="npm init next-app"></acme-snippet><acme-snippet variant="warning" text="npm init next-app"></acme-snippet></div>`,
      },
    ],
    practices: {
      Content: [
        "One runnable command per snippet; the component renders the prompt, so the text never starts with $.",
        "No prompt for URLs, JSON and verbatim output; Code Block for longer scripts; inline code for tokens.",
      ],
    },
  },
  {
    id: "spinner",
    title: "Spinner",
    lede: "Indicate an action running in response to something the user did.",
    tags: ["acme-spinner"],
    examples: [
      {
        h: "Sizes",
        html: `<div class="row" style="gap:24px;align-items:flex-end"><acme-spinner size="small"></acme-spinner><acme-spinner></acme-spinner><acme-spinner size="large"></acme-spinner></div>`,
      },
      {
        h: "Colors",
        html: `<div class="row" style="gap:24px"><acme-spinner></acme-spinner><acme-spinner color="var(--warn)"></acme-spinner><acme-spinner color="var(--success)"></acme-spinner></div>`,
      },
    ],
    practices: {
      "When to use": ["Indeterminate single-action waits of one to three seconds: submit buttons, an inline refresh, a row-level retry. For buttons, the Button loading state."],
      Behavior: ["Mount only when the action starts; pair waits over a second with copy naming the work; aria-busy on the wrapper."],
    },
  },
  {
    id: "split-button",
    title: "Split Button",
    lede: "A primary action coupled with a dropdown of close variants.",
    tags: ["acme-split-button"],
    examples: [
      {
        h: "Sizes and types",
        html: `<div class="vstack" style="gap:16px"><div class="row" style="gap:16px"><acme-split-button size="small">Save<acme-menu-item slot="items">Save</acme-menu-item><acme-menu-item slot="items">Save as Draft</acme-menu-item></acme-split-button><acme-split-button>Save<acme-menu-item slot="items">Save</acme-menu-item><acme-menu-item slot="items">Save as Draft</acme-menu-item></acme-split-button><acme-split-button size="large">Save<acme-menu-item slot="items">Save</acme-menu-item><acme-menu-item slot="items">Save as Draft</acme-menu-item></acme-split-button></div><div class="row" style="gap:16px"><acme-split-button variant="secondary" size="small">Save<acme-menu-item slot="items">Save</acme-menu-item></acme-split-button><acme-split-button variant="secondary">Save<acme-menu-item slot="items">Save</acme-menu-item></acme-split-button><acme-split-button variant="secondary" size="large">Save<acme-menu-item slot="items">Save</acme-menu-item></acme-split-button></div></div>`,
      },
    ],
    practices: { "When to use": ["One clear default with 1–4 close variants (Deploy, Deploy to Preview). The first menu item mirrors the primary label exactly. Primary and secondary types only."] },
  },
  {
    id: "status-dot",
    title: "Status Dot",
    lede: "An indicator of deployment status.",
    tags: ["acme-status-dot"],
    examples: [
      {
        h: "Default",
        html: `<div class="row" style="gap:24px"><acme-status-dot state="queued"></acme-status-dot><acme-status-dot state="building"></acme-status-dot><acme-status-dot state="error"></acme-status-dot><acme-status-dot state="ready"></acme-status-dot><acme-status-dot state="canceled"></acme-status-dot></div>`,
      },
      {
        h: "Label",
        html: `<div class="vstack" style="gap:24px"><acme-status-dot state="queued" label></acme-status-dot><acme-status-dot state="building" label></acme-status-dot><acme-status-dot state="error" label></acme-status-dot><acme-status-dot state="ready" label></acme-status-dot><acme-status-dot state="canceled" label></acme-status-dot></div>`,
      },
    ],
    practices: {
      "When to use": ["Deployment lifecycle only: QUEUED, BUILDING, READY, ERROR, CANCELED, DELETED. Other statuses use a Badge."],
      Behavior: ["The dot animates while building or queued and goes static in a terminal state; no separate spinner beside it."],
      Content: ["The label sentence-cases the state; never wrap it in Status: Ready."],
    },
  },
  {
    id: "switch",
    title: "Switch",
    lede: "Choose between a set of two or three views of the same surface.",
    tags: ["acme-switch", "acme-switch-control"],
    examples: [
      {
        h: "Default",
        html: `<acme-switch value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch>`,
      },
      {
        h: "Disabled",
        html: `<acme-switch value="source" disabled aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch>`,
      },
      {
        h: "Sizes",
        html: `<div class="row" style="gap:16px"><acme-switch size="small" value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch><acme-switch value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch><acme-switch size="large" value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch></div>`,
      },
      {
        h: "Full width",
        html: `<acme-switch fill value="source" aria-label="View"><acme-switch-control value="source">Source</acme-switch-control><acme-switch-control value="output">Output</acme-switch-control></acme-switch>`,
      },
      {
        h: "Options as data",
        p: "The options attribute takes the same list as JSON.",
        html: `<acme-switch value="grid" aria-label="Layout" options='[{"value":"grid","label":"Grid"},{"value":"list","label":"List"},{"value":"map","label":"Map","disabled":true}]'></acme-switch>`,
      },
    ],
    practices: {
      "When to use": ["Two or three mutually exclusive views (Source / Output). Toggle for on/off; Tabs or Select past three options."],
      Content: ["Title Case, one or two parallel words; every control has a label, hidden when an icon carries it, with a tooltip."],
    },
  },
  {
    id: "table",
    title: "Table",
    lede: "A semantic HTML table, or a virtualized grid past a few hundred rows.",
    tags: ["acme-table"],
    examples: [
      { h: "Basic", p: "Columns and rows as data.", html: `<acme-table columns='${tableCols}' rows='${tableRows}'></acme-table>` },
      { h: "Striped", html: `<acme-table striped columns='${tableCols}' rows='${tableRows}'></acme-table>` },
      { h: "Bordered", html: `<acme-table bordered columns='${tableCols}' rows='${tableRows}'></acme-table>` },
      {
        h: "Full featured",
        p: "Sortable and numeric columns, an interactive row, a footer slot.",
        html: `<acme-table striped interactive sort="product" columns='[{"key":"product","label":"Product","sortable":true},{"key":"usage","label":"Usage"},{"key":"rate","label":"Rate"},{"key":"charge","label":"Charge","numeric":true,"sortable":true}]' rows='[{"product":"Brake Pads Set","usage":"100 sets","rate":"$50.00","charge":"$5,000.00"},{"product":"Spark Plugs","usage":"500 sets","rate":"$5.00","charge":"$2,500.00"},{"product":"Oil Filter","usage":"—","rate":"$8.00","charge":"$16,500.00"}]'><div slot="foot" class="row" style="justify-content:space-between;padding:8px 12px"><span class="text-copy-13" style="color:var(--text-2)">Subtotal</span><b class="mono">$24,000.00</b></div></acme-table>`,
      },
      { h: "Empty", html: `<acme-table columns='${tableCols}' rows='[]'><span slot="empty">No rows match the filter.</span></acme-table>` },
    ],
    practices: {
      "When to use": ["Rows that share a shape with at least one comparable column. Entity for a row with one action; Description for key/value metadata."],
      Behavior: ["Empty list: an Empty State outside the table. Unknown cells show an em dash. Sortable headers are buttons; numeric columns are tabular."],
      Content: ["Title Case noun headers (Last Used, Requests (7d)); short relative times in cells; pager copy Page 2 of 7 or 21–40 of 142."],
    },
  },
  {
    id: "tabs",
    title: "Tabs",
    lede: "Switch between sibling views inside a single page.",
    tags: ["acme-tabs", "acme-tab", "acme-tab-panel"],
    examples: [
      {
        h: "Default",
        html: `<acme-tabs value="apple" aria-label="Fruit"><acme-tab value="apple">Apple</acme-tab><acme-tab value="orange">Orange</acme-tab><acme-tab value="mango">Mango</acme-tab></acme-tabs>`,
      },
      {
        h: "With panels",
        html: `<acme-tabs value="overview" aria-label="Project"><acme-tab value="overview">Overview</acme-tab><acme-tab value="logs">Logs</acme-tab><acme-tab-panel slot="panels" value="overview"><p class="text-copy-14" style="padding:16px 0">The overview panel.</p></acme-tab-panel><acme-tab-panel slot="panels" value="logs"><p class="text-copy-14" style="padding:16px 0">The logs panel.</p></acme-tab-panel></acme-tabs>`,
      },
      {
        h: "Disabled",
        html: `<acme-tabs value="apple" aria-label="Fruit"><acme-tab value="apple" disabled>Apple</acme-tab><acme-tab value="orange" disabled>Orange</acme-tab><acme-tab value="mango" disabled>Mango</acme-tab></acme-tabs>`,
      },
      {
        h: "Disable specific tabs",
        html: `<acme-tabs value="apple" aria-label="Fruit"><acme-tab value="apple">Apple</acme-tab><acme-tab value="orange">Orange</acme-tab><acme-tab value="mango" disabled tooltip="Only visible to project owners.">Mango</acme-tab></acme-tabs>`,
      },
      {
        h: "With icons",
        html: `<acme-tabs value="github" aria-label="Git provider"><acme-tab value="github">${svg("github", "icon")}GitHub</acme-tab><acme-tab value="gitlab">${svg("branch", "icon")}GitLab</acme-tab><acme-tab value="bitbucket">${svg("commit", "icon")}Bitbucket</acme-tab></acme-tabs>`,
      },
      {
        h: "Secondary",
        html: `<acme-tabs secondary value="github" aria-label="Git provider"><acme-tab value="github">GitHub</acme-tab><acme-tab value="gitlab">GitLab</acme-tab><acme-tab value="bitbucket" disabled>Bitbucket</acme-tab></acme-tabs>`,
      },
    ],
    practices: {
      "When to use": ["Sibling views inside one page (Overview, Logs, Settings); a sub-menu for unrelated pages. Cap at 5–7 on desktop."],
      Behavior: ["Selection is instant and lives in the URL; a disabled tab gets a tooltip naming the constraint; Left/Right move focus."],
      Content: ["Title Case 1–2 word nouns; no counts in the title, a badge slot instead."],
    },
  },
  {
    id: "text-with-copy-button",
    title: "Text With Copy Button",
    lede: "Text beside a button that copies it.",
    tags: ["acme-text-copy"],
    examples: [
      { h: "Default", html: `<acme-text-copy text="prj_WxDl2RuzJGJACJgC661Uj3BEEe5k"></acme-text-copy>` },
      { h: "Ellipsis", html: `<acme-text-copy ellipsis text="prj_WxDl2RuzJGJACJgC661Uj3BEEe5k" style="display:block;max-width:200px"></acme-text-copy>` },
    ],
  },
  {
    id: "textarea",
    title: "Textarea",
    lede: "Retrieve multi-line user input.",
    tags: ["acme-textarea"],
    examples: [
      { h: "Default", html: `<acme-textarea placeholder="Default" aria-label="Default" style="max-width:420px"></acme-textarea>` },
      { h: "Disabled", html: `<acme-textarea placeholder="Disabled" disabled style="max-width:420px"></acme-textarea>` },
      { h: "Error", html: `<acme-textarea value="Lorem ipsum" error="There has been an error." style="max-width:420px"></acme-textarea>` },
      { h: "Large with label", html: `<acme-textarea size="large" label="Release Notes" placeholder="Large" style="max-width:420px"></acme-textarea>` },
    ],
    practices: { Content: ["Short Title Case noun labels (Description, Release Notes); example placeholders; validation names the field and the constraint and ends with a period."] },
  },
  {
    id: "theme-switcher",
    title: "Theme Switcher",
    lede: "Switch between system, light and dark.",
    tags: ["acme-theme-switcher"],
    examples: [
      { h: "Default", p: "Every instance shares the theme signal; changing one updates all and persists the choice.", html: `<acme-theme-switcher></acme-theme-switcher>` },
      { h: "Small", html: `<acme-theme-switcher small></acme-theme-switcher>` },
      { h: "Disabled", html: `<acme-theme-switcher disabled></acme-theme-switcher>` },
    ],
    practices: { "When to use": ["Once per app, in the footer or the settings; small in dense chrome. Never rebuilt from a Switch or three icon buttons."] },
  },
  {
    id: "toast",
    title: "Toast",
    lede: "A succinct message that is displayed temporarily.",
    tags: ["acme-toast", "acme-toaster"],
    examples: [
      { h: "Default", p: "Shown static.", html: `<acme-toast static>The Evil Rabbit jumped over the fence.</acme-toast>` },
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
  },
  {
    id: "toggle",
    title: "Toggle",
    lede: "Display a boolean value.",
    tags: ["acme-toggle"],
    examples: [
      { h: "Default", html: `<div class="row" style="gap:24px"><acme-toggle aria-label="Off"></acme-toggle><acme-toggle checked aria-label="On"></acme-toggle></div>` },
      { h: "Disabled", html: `<div class="row" style="gap:24px"><acme-toggle disabled aria-label="Off"></acme-toggle><acme-toggle checked disabled aria-label="On"></acme-toggle></div>` },
      {
        h: "Sizes",
        html: `<div class="row" style="gap:24px"><acme-toggle aria-label="Small"></acme-toggle><acme-toggle size="medium" aria-label="Medium"></acme-toggle><acme-toggle size="large" aria-label="Large"></acme-toggle></div>`,
      },
      {
        h: "Custom color",
        html: `<div class="row" style="gap:24px"><acme-toggle color="amber" checked aria-label="Amber"></acme-toggle><acme-toggle color="red" checked aria-label="Red"></acme-toggle></div>`,
      },
      { h: "With label", html: `<div class="row" style="gap:24px"><acme-toggle label="Enable Firewall"></acme-toggle><acme-toggle size="large" label="Enable Firewall" checked></acme-toggle></div>` },
    ],
    practices: {
      "When to use": ["One boolean setting where ON takes effect immediately (Password Protection). Checkbox for a multi-select list, Switch for 2–3 views."],
      Behavior: ["Persist on change and confirm with a toast; disable only when the action is impossible and say why."],
      Content: ["A Title Case noun phrase naming what is true when ON: Password Protection, not Enable Password Protection; a description explains ON only."],
    },
  },
  {
    id: "tooltip",
    title: "Tooltip",
    lede: "A floating label on hover or focus that adds context to an element.",
    tags: ["acme-tooltip"],
    examples: [
      {
        h: "Default",
        p: "Hover or focus the text.",
        html: `<div class="row" style="gap:32px"><acme-tooltip text="The Evil Rabbit Jumped over the Fence"><span class="text-copy-16" tabindex="0">Top</span></acme-tooltip><acme-tooltip side="bottom" text="The Evil Rabbit Jumped over the Fence"><span class="text-copy-16" tabindex="0">Bottom</span></acme-tooltip></div>`,
      },
      {
        h: "Static",
        p: "The bubble itself: gray-1000, 13px, padding 6 8, radius 8, max width 250.",
        html: `<div class="row" style="gap:16px;padding-top:40px"><acme-tooltip open text="The Evil Rabbit Jumped over the Fence"><span>Default</span></acme-tooltip><acme-tooltip open variant="success" text="Success"><span>Success</span></acme-tooltip><acme-tooltip open variant="error" text="Error"><span>Error</span></acme-tooltip><acme-tooltip open variant="warning" text="Warning"><span>Warning</span></acme-tooltip><acme-tooltip open variant="violet" text="Violet"><span>Violet</span></acme-tooltip></div>`,
      },
      {
        h: "Components",
        html: `<div class="row" style="gap:24px"><acme-tooltip side="bottom" text="Deploy to production"><acme-button size="small" variant="primary">Bottom</acme-button></acme-tooltip><acme-tooltip text="Left"><acme-badge tabindex="0">Left</acme-badge></acme-tooltip><acme-tooltip text="Press ⌘K"><span class="text-copy-16" tabindex="0">Shortcut</span></acme-tooltip></div>`,
      },
    ],
    practices: {
      "When to use": ["Explain why something exists, not what it is; Context Card for an entity preview; never wrap a labelled Input."],
      Behavior: ["Opens on hover and focus after ~150ms; Escape closes; primary actions stay outside."],
      Content: ["One sentence or fragment, sentence case, no period; never repeat the visible label or describe the click."],
    },
  },
  {
    id: "trend",
    title: "Trend",
    lede: "A signed change with its direction: the arrow, the sign and the percent. A house component; Geist has no page for it.",
    tags: ["acme-trend"],
    house: true,
    examples: [
      {
        h: "Default",
        p: "Green up, red down, gray flat; mono, 12px, weight 500.",
        html: `<div class="row" style="gap:16px"><acme-trend direction="up">+12.5%</acme-trend><acme-trend direction="down">−2.1%</acme-trend><acme-trend>0.0%</acme-trend></div>`,
      },
      {
        h: "Pill",
        p: "When it stands alone in a head or beside a note.",
        html: `<div class="row" style="gap:16px"><acme-trend pill direction="up">+6.03%</acme-trend><acme-trend pill direction="down">−1.2%</acme-trend><acme-trend pill note="vs last month">0.0%</acme-trend></div>`,
      },
      { h: "Large", html: `<div class="row" style="gap:16px"><acme-trend large direction="up">+12.5%</acme-trend><acme-trend large direction="down">−2.1%</acme-trend></div>` },
      {
        h: "In a Stat",
        p: "Plain after the value in the trend slot; a pill in the delta slot beside its note.",
        html: `<div class="cells" style="--cols:2"><acme-stat class="cell" label="Revenue">$62,450<acme-trend slot="trend" direction="up">+4.8%</acme-trend><acme-stat-delta slot="delta"><acme-trend pill direction="up" note="vs last month">+6.03%</acme-trend></acme-stat-delta></acme-stat><acme-stat class="cell" label="Churn">3.2%<acme-trend slot="trend" direction="down">−0.4%</acme-trend><acme-stat-desc slot="desc">Lower is better.</acme-stat-desc></acme-stat></div>`,
      },
      {
        h: "In a bar row",
        html: `<acme-bar-row label="Equities" value="45%" percent="45" style="display:block;max-width:360px"><span>Target 50%</span><acme-trend direction="up">+2.1%</acme-trend></acme-bar-row>`,
      },
    ],
    practices: {
      "When to use": [
        "A change over a period, never a state: a badge names a state, a trend never does.",
        "Plain when it follows a value or sits in a bar row; a pill when it stands alone in a head or beside a vs-note.",
      ],
      Content: ["Always signed (+4.8%, −2.1%); the arrow carries the direction; the note names the baseline (vs last month)."],
    },
  },
  {
    id: "video",
    title: "Video",
    lede: "Embed a video with playback controls and lazy loading.",
    tags: ["acme-video"],
    examples: [
      {
        h: "Default",
        p: "With a src the element renders the player; the control bar floats over the frame.",
        html: `<acme-video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" style="display:block;max-width:600px"></acme-video>`,
      },
      {
        h: "No controls",
        html: `<acme-video controls="false" autoplay src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" style="display:block;max-width:600px"></acme-video>`,
      },
    ],
    practices: { "When to use": ["Marketing and docs video with loop, controls and lazy loading; honor reduced motion with a paused poster."] },
  },
];
