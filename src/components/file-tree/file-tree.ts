import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { fileTreeCss } from "./file-tree.styles";

/**
 * File tree. A 13px column of rows, 1px apart: `acme-folder` and `acme-file` elements nested in
 * the default slot, each row indented one 23px guide per folder level above it. `card` puts the
 * tree in a padded card: the page background, the smallest shadow, radius 8, padding 24 and 16px
 * text.
 */
@customElement("acme-file-tree")
export class AcmeFileTree extends AcmeElement {
  static styles = [
    sharedCss,
    fileTreeCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** Renders the tree as a card: page background, the smallest shadow, radius 8, padding 24, 16px text. */
  @property({ type: Boolean, reflect: true }) card = false;

  render() {
    return html`<div class=${this.cls("tree", { card: this.card })} part="tree"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-file-tree": AcmeFileTree;
  }
}
