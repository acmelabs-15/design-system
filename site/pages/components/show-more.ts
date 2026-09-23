import type { Doc } from "../../site";
export const doc: Doc = {
  id: "show-more",
  title: "Show More",
  lede: "A button that changes expansion while the application owns the content.",
  tags: ["acme-show-more"],
  examples: [
    {
      h: "Reveal content",
      html: "<acme-show-more></acme-show-more><acme-show><template><p>Additional delivery information.</p></template></acme-show>",
      script:
        'const control=root.querySelector("acme-show-more"), content=root.querySelector("acme-show");control.ariaControlsElements=[content];control.addEventListener("acme-expanded-change",e=>content.when=e.detail.expanded);',
    },
    { h: "Expanded", html: "<acme-show-more expanded></acme-show-more>" },
    { h: "Loading", html: "<acme-show-more loading></acme-show-more>" },
    { h: "Custom label", html: "<acme-show-more>More delivery options</acme-show-more>" },
  ],
  practices: {
    Behavior: [
      "User activation updates expanded and emits one acme-expanded-change event. Programmatic writes stay silent.",
      "Connect aria-controls or ariaControlsElements to the content you reveal. The control does not own or fetch unrelated content.",
      "Loading blocks repeated activation and retains a focusable action. Use the shared button size, variant and shape properties for presentation.",
    ],
  },
};
