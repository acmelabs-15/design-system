import { AcmeTreeView } from "../tree-view.ts";
import { AcmeTreeItem } from "../../tree-item/tree-item.ts";
import { AcmeChevronRightIcon } from "../../../generated/icons/classes/chevron-right-icon.ts";
customElements.define("acme-chevron-right-icon", AcmeChevronRightIcon);
customElements.define("acme-tree-view", AcmeTreeView);
customElements.define("acme-tree-item", AcmeTreeItem);
document.body.innerHTML =
  '<style>body{margin:24px}acme-tree-view{display:block;max-width:360px}</style><button id="before">Before</button><acme-tree-view id="tree" aria-label="Project files"><acme-tree-item value="readme"><span id="rich">README.md</span><span slot="description">Project introduction</span></acme-tree-item></acme-tree-view><button id="after">After</button>';
const tree = document.querySelector("acme-tree-view")!;
tree.items = [
  {
    id: "src",
    label: "Source",
    children: [
      { id: "app", label: "Application", children: [{ id: "main", label: "Main entry" }] },
      { id: "disabled", label: "Unavailable", disabled: true },
      { id: "index", label: "Index" },
    ],
  },
  { id: "readme", label: "README.md", href: "#readme" },
  { id: "license", label: "License" },
];
(window as any).original = document.querySelector("#rich");
