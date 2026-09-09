// Docs page: Context Menu — mirrors https://vercel.com/geist/context-menu
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "context-menu",
  title: "Context Menu",
  lede: "A menu for contextual actions, revealed on right click or long press.",
  tags: ["acme-context-menu", "acme-menu-item"],
  examples: [
    {
      h: "Default",
      p: "Right click the target; the Menu opens at the pointer.",
      html: `<acme-context-menu><div class="context-target">Right click here</div><acme-menu-item slot="items"><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-eye"/></svg>Item one</acme-menu-item><acme-menu-item slot="items"><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-copy"/></svg>Item Two</acme-menu-item><acme-menu-item slot="items"><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-edit"/></svg>Item Three</acme-menu-item><acme-menu-item slot="items"><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-ext"/></svg>Item Four</acme-menu-item></acme-context-menu>`,
    },
    {
      h: "Disabled and destructive",
      p: "The same items in a static Menu.",
      html: `<acme-menu static><acme-menu-item slot="items"><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-eye"/></svg>Open in New Tab</acme-menu-item><acme-menu-item slot="items"><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-copy"/></svg>Copy URL</acme-menu-item><acme-menu-item slot="items" disabled><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-edit"/></svg>Rename…</acme-menu-item><acme-menu-divider slot="items"></acme-menu-divider><acme-menu-item slot="items" danger><svg class="ic" slot="prefix" aria-hidden="true"><use href="#i-trash"/></svg>Delete Deployment</acme-menu-item></acme-menu>`,
    },
  ],
  practices: {
    "When to use": ["Power-user shortcuts over a row, file or canvas object; every item also exists in a visible Menu or row button."],
    Behavior: ["Position at the pointer, flip before clipping; close on activation, Escape and outside click, never on hover-out; Shift+F10 opens it from the keyboard."],
  },
};
