import type { Doc } from "../../site";

const menu = (content: string, attributes = "") =>
  `<acme-menu ${attributes}><acme-menu-trigger slot="trigger">Actions</acme-menu-trigger><acme-menu-content aria-label="Actions">${content}</acme-menu-content></acme-menu>`;
const items = '<acme-menu-item value="save">Save</acme-menu-item><acme-menu-item value="duplicate">Duplicate</acme-menu-item><acme-menu-item value="archive" disabled>Archive</acme-menu-item>';
export const doc: Doc = {
  id: "menu",
  title: "Menu",
  lede: "Actions and checked choices in a keyboard-accessible popup.",
  tags: ["acme-menu", "acme-menu-trigger", "acme-menu-content", "acme-menu-item", "acme-menu-section", "acme-menu-separator"],
  examples: [
    {
      h: "Default",
      html: menu(items) + "<output></output>",
      script: "root.addEventListener('acme-request',event=>{if(event.detail.action==='select')root.querySelector('output').textContent=event.detail.value;});",
    },
    {
      h: "Checked choices",
      p: "Keep the menu open while changing several options.",
      html: menu(
        '<acme-menu-item type="checkbox" value="status" checked>Status bar</acme-menu-item><acme-menu-separator></acme-menu-separator><acme-menu-section heading="Sort order"><acme-menu-item type="radio" name="sort" value="name" checked>Name</acme-menu-item><acme-menu-item type="radio" name="sort" value="date">Date</acme-menu-item></acme-menu-section>',
        'close-on-select="false"',
      ),
    },
    {
      h: "Nested menu",
      html: menu(
        '<acme-menu-item value="export">Export<acme-menu slot="submenu"><acme-menu-content aria-label="Export format"><acme-menu-item value="csv">CSV</acme-menu-item><acme-menu-item value="json">JSON</acme-menu-item></acme-menu-content></acme-menu></acme-menu-item>' +
          items,
      ),
    },
    {
      h: "Descriptions and icons",
      html: menu(
        '<acme-menu-item value="settings"><acme-settings-icon slot="start" size="18px"></acme-settings-icon>Settings<span slot="description">Manage project preferences.</span></acme-menu-item><acme-menu-item value="docs" href="https://developer.mozilla.org/" target="_blank">Documentation<span slot="end">↗</span></acme-menu-item>',
      ),
    },
    { h: "Placement", html: menu(items, 'placement="top-start"') },
  ],
  practices: {
    Behavior: [
      "Every item has a stable value. Action requests contain action and value; checked changes contain value and checked.",
      "Arrow keys, Home, End and typeahead move focus. Disabled items remain discoverable and cannot activate.",
      "Escape closes the current menu. Tab leaves the menu. A submenu occupies the submenu slot of its owning item.",
      "Use show(), hide() or open for programmatic visibility. User changes emit acme-open-change; completed transitions emit acme-after-open and acme-after-close.",
    ],
    Accessibility: [
      "Name each Menu Content and Menu Trigger. Keep each item one action; decorative slots do not hold independent controls.",
      "Use ordinary links for navigation lists. Use menu semantics for an action collection.",
    ],
  },
};
