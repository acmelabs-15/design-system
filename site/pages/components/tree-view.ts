import type { Doc } from "../../site";

const data =
  '[{id:"source",label:"Source",children:[{id:"components",label:"Components",children:[{id:"button",label:"Button"},{id:"input",label:"Input"}]},{id:"styles",label:"Styles"}]},{id:"docs",label:"Documentation"},{id:"unavailable",label:"Unavailable",disabled:true}]';
export const doc: Doc = {
  id: "tree-view",
  title: "Tree View",
  lede: "An interactive hierarchy with independent focus, expansion and selection.",
  tags: ["acme-tree-view", "acme-tree-item"],
  examples: [
    {
      h: "Project hierarchy",
      html: '<acme-tree-view aria-label="Project hierarchy"></acme-tree-view><output></output>',
      script: `const tree=root.querySelector("acme-tree-view");tree.items=${data};tree.expanded=["source"];tree.addEventListener("acme-change",event=>{root.querySelector("output").textContent="Selected: "+event.detail.value;});`,
    },
    {
      h: "File tree recipe",
      html: '<acme-tree-view aria-label="Project files"><acme-tree-item value="source"><acme-folder-icon slot="start" size="16px"></acme-folder-icon>src</acme-tree-item><acme-tree-item value="index"><acme-description-icon slot="start" size="16px"></acme-description-icon>index.ts<span slot="description">Application entry point</span></acme-tree-item><acme-tree-item value="package"><acme-description-icon slot="start" size="16px"></acme-description-icon>package.json</acme-tree-item></acme-tree-view>',
      script:
        'const tree=root.querySelector("acme-tree-view");tree.items=[{id:"source",label:"src",children:[{id:"index",label:"index.ts"}]},{id:"package",label:"package.json"}];tree.expanded=["source"];',
    },
    {
      h: "Navigation without selection",
      html: '<acme-tree-view aria-label="Documentation sections" selection="none"></acme-tree-view>',
      script:
        'root.querySelector("acme-tree-view").items=[{id:"layout",label:"Layout",children:[{id:"box",label:"Box",href:"./box"},{id:"stack",label:"Stack",href:"./stack"}]},{id:"text",label:"Text",href:"./text"}];',
    },
  ],
  practices: {
    Data: [
      "items is the sole source of hierarchy, stable IDs, accessible labels and href links. IDs must be unique throughout the tree. Arrays and records are copied and frozen.",
      "Optional direct Tree Item children are keyed by value. They supply rich visible content; the node label remains the accessible name and typeahead text. Unknown or duplicate content keys are reported and omitted.",
      "Tree Item start content is decorative; end and description add supporting text. Use semantic List and Item when each row needs independent form controls or actions.",
      "Disabled data nodes and disabled Tree Item parts cannot activate. Keyboard movement skips disabled nodes. An expanded disabled branch can still expose enabled descendants.",
    ],
    Interaction: [
      "Arrow Down and Arrow Up move through visible enabled nodes. The forward horizontal arrow expands a branch, then enters its first child. The backward arrow collapses it or moves to its parent; directions follow RTL. Home, End and typeahead move focus.",
      "Enter, Space and ordinary click request activation. The default selects the node in single mode and toggles branch expansion. Cancel acme-request to prevent the default activation. Arrow movement never selects.",
      "expanded and value are independent canonical state. Programmatic setters and expand(id) or collapse(id) stay silent. focus(id) focuses a visible enabled node.",
      'User changes emit acme-change { value } and acme-expanded-change { expanded }. acme-request contains { action: "activate", value }. Native links retain href behavior and modified clicks.',
      "Collapsed child content remains mounted and inert. If collapse or a data update hides the focused node, focus moves to its nearest enabled visible ancestor or the first available node.",
      "Use Sidebar links or Table of Contents for ordinary navigation. Tree View is for content that benefits from coordinated hierarchy keys.",
    ],
  },
};
