import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { fileTreeCss } from "./file-tree.styles.js";

/** Geist File Tree: pass `data` (name, children, href, open) or slot native details/ul markup. */
export type TreeNode = { name: string; href?: string; open?: boolean; current?: boolean; children?: TreeNode[] };

@customElement("acme-file-tree")
export class AcmeFileTree extends AcmeElement {
  static styles = [sharedCss, fileTreeCss, css`:host{display:block}`];
  @property({ type: Array }) data: TreeNode[] = [];
  private node = (n: TreeNode): unknown =>
    n.children
      ? html`<li><details ?open=${n.open}><summary>${glyph("chev", "ic caret")}${glyph("folder")}${n.name}</summary><ul>${n.children.map(this.node)}</ul></details></li>`
      : html`<li><a href=${n.href ?? "#"} aria-current=${n.current ? "true" : nothing} @click=${(e: Event) => {
          this.dispatchEvent(new CustomEvent("acme-select", { detail: n, bubbles: true, composed: true }));
          if (!n.href) e.preventDefault();
        }}>${glyph("file")}${n.name}</a></li>`;
  render() {
    return html`<ul class="tree" role="tree" part="tree">${this.data.map(this.node)}<slot></slot></ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-file-tree": AcmeFileTree;
  }
}
