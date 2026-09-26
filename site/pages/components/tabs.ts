import type { Doc } from "../../site";

const content =
  '<acme-tab value="overview">Overview</acme-tab><acme-tab value="settings">Settings</acme-tab><acme-tab-panel value="overview" slot="panels"><p>Overview content.</p></acme-tab-panel><acme-tab-panel value="settings" slot="panels"><p>Settings content.</p></acme-tab-panel>';
export const doc: Doc = {
  id: "tabs",
  title: "Tabs",
  tags: ["acme-tabs", "acme-tab", "acme-tab-panel"],
  lede: "Switch between related content panels with one selected value.",
  examples: [
    { h: "Automatic", html: '<acme-tabs id="tabs-auto" aria-label="Account">' + content + "</acme-tabs>" },
    { h: "Manual activation", html: '<acme-tabs id="tabs-manual" aria-label="Account" activation="manual">' + content + "</acme-tabs>" },
    {
      h: "Inset",
      html: '<acme-tabs id="tabs-inset" variant="inset" aria-label="Preview"><acme-tab value="source">Source</acme-tab><acme-tab value="output">Output</acme-tab><acme-tab-panel slot="panels" value="source"><code>const greeting = "Hello";</code></acme-tab-panel><acme-tab-panel slot="panels" value="output">Hello</acme-tab-panel></acme-tabs>',
    },
    { h: "Vertical", html: '<acme-tabs id="tabs-vertical" orientation="vertical" aria-label="Account">' + content + "</acme-tabs>" },
    {
      h: "Icons",
      html: '<acme-tabs aria-label="Media"><acme-tab value="photos" aria-label="Photos"><acme-photo-icon></acme-photo-icon></acme-tab><acme-tab value="videos" aria-label="Videos"><acme-videocam-icon></acme-videocam-icon></acme-tab><acme-tab-panel slot="panels" value="photos">Photo content.</acme-tab-panel><acme-tab-panel slot="panels" value="videos">Video content.</acme-tab-panel></acme-tabs>',
    },
    {
      h: "Disabled option",
      html: '<acme-tabs aria-label="Account"><acme-tab value="overview">Overview</acme-tab><acme-tab value="admin" disabled>Administration</acme-tab><acme-tab-panel slot="panels" value="overview">Available content.</acme-tab-panel><acme-tab-panel slot="panels" value="admin">Restricted content.</acme-tab-panel></acme-tabs>',
    },
    {
      h: "Lazy content",
      html: '<acme-tabs id="tabs-lazy" aria-label="Editor" lazy-mount unmount-on-exit><acme-tab value="first">First</acme-tab><acme-tab value="second">Second</acme-tab><acme-tab-panel slot="panels" value="first"><template><label>Draft <input value="Fresh draft"></label></template></acme-tab-panel><acme-tab-panel slot="panels" value="second"><template><p>This content is created when selected.</p></template></acme-tab-panel></acme-tabs>',
    },
  ],
  practices: {
    Selection: [
      "Omitted value selects the first enabled tab once. A later undefined value clears selection; a temporarily missing tab does not silently replace the selected value.",
      "Supply unique nonempty values and a matching panel in the panels slot. The root owns selection and emits acme-change with value for user changes.",
      "Use primary for the underline treatment and inset for the outlined filled treatment. Both support horizontal and vertical orientation.",
    ],
    Keyboard: [
      "Automatic activation selects on focus. Manual activation moves focus with arrows, then selects with Space or Enter. Use manual activation when content takes time to display.",
      "Home and End move to the first and last available tab. Disabled tabs are skipped, horizontal keys follow reading direction, and Tab leaves the tablist.",
      "Give the tablist and icon-only tabs accessible names. Use start/end slots for accompanying content and compose Tooltip separately.",
    ],
    Content: [
      "Ordinary panel children remain mounted while inactive panels are hidden and inert. Their form values and node identity are preserved.",
      "lazy-mount and unmount-on-exit apply to one inert template per panel or a Lit renderContent callback. Ordinary author-owned children are never moved or cloned to simulate unmounting.",
      "An unmounted template is created again on entry. Keep durable data in application state when choosing unmount-on-exit. Renderer-owned content stays in the light DOM so native form ownership is preserved.",
    ],
  },
};
