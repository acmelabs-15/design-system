// Docs page: Collapse — mirrors https://vercel.com/geist/collapse
import type { Doc } from "../../site";

const a = `<p class="text-copy-16" style="margin-bottom:16px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`;
const b = `<p class="text-copy-16" style="margin-bottom:16px">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>`;

export const doc: Doc = {
  id: "collapse",
  title: "Collapse",
  lede: "A stack of headings that each reveal a related section of content; often called an accordion.",
  tags: ["acme-collapse", "acme-collapse-group"],
  examples: [
    {
      h: "Default",
      html: `<acme-collapse-group><acme-collapse title="Question A">${a}</acme-collapse><acme-collapse title="Question B">${b}</acme-collapse></acme-collapse-group>`,
    },
    {
      h: "Expanded",
      html: `<acme-collapse-group><acme-collapse title="Question A">${a}</acme-collapse><acme-collapse default-expanded title="Question B">${b}</acme-collapse></acme-collapse-group>`,
    },
    {
      h: "Multiple",
      html: `<acme-collapse-group multiple><acme-collapse title="Question A">${a}</acme-collapse><acme-collapse title="Question B">${b}</acme-collapse></acme-collapse-group>`,
    },
    {
      h: "Small",
      html: `<acme-collapse size="small" title="Question A">${a}</acme-collapse>`,
    },
  ],
  practices: {
    "When to use": [
      "Collapse holds optional, advanced or repetitive content most readers skip: an FAQ, advanced settings, a request payload.",
      "Content every reader needs is a page section with a normal heading; a collapsed primary section hides what the page is about.",
      "One Collapse for one optional block; a group for a related set; Tabs when the items are sibling views rather than optional detail.",
    ],
    Behavior: [
      "Closed by default, unless a first-time visitor has to read the content to act.",
      "In a group, one panel open at a time when the items exclude each other; several when they are independent.",
      "The open and close transition animates; a jump cut makes the page feel like it teleported.",
      "One level of nesting at most; a second level hides too much and breaks the tab order.",
    ],
    Content: [
      "The heading is Title Case and names the topic, not the action: Advanced Settings, not Show Advanced Settings.",
      "The body is sentence case prose with normal section formatting: a small page, not a tooltip.",
      "A primary destructive action stays out of a closed Collapse; two clicks to reach a warning is one too many.",
    ],
    Accessibility: [
      "The trigger is a button with aria-expanded that flips on toggle and aria-controls that names the panel.",
      "Enter and Space toggle; no other key is bound globally, and arrow keys move through the panel content.",
      "The panel content stays in the DOM when closed, so find-in-page still reaches it; render lazily only when the content is expensive.",
    ],
  },
};
