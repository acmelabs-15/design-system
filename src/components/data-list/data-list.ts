import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { RootStyles } from "../../shared/root-styles";
import { dataListStructureCss } from "../../generated/components/data-list/data-list-structure.styles";
import { dataListLightCss } from "../../generated/components/data-list/data-list-light.styles";
/** Presents author-owned native terms and definitions.
 * @slot - A native dl containing dt/dd pairs, optionally grouped in div elements.
 * @csspart root - The description-list wrapper.
 */
export class AcmeDataList extends AcmeSemanticElement {
  static styles = [sharedCss, dataListStructureCss];
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) orientation: "horizontal" | "vertical" = "horizontal";
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) size: "small" | "medium" | "large" = "medium";
  @atomState() private column?: string;
  @property({ noAccessor: true, attribute: "column-width", converter: optionalString }) get columnWidth(): string | undefined {
    return this.column;
  }
  set columnWidth(value: string | undefined) {
    if (value !== undefined) {
      const scratch = this.ownerDocument.createElement("div").style;
      scratch.width = value;
      if (!scratch.width || value.trim() === "" || value.includes("url(")) throw new TypeError("columnWidth requires a CSS size");
    }
    const previous = this.column;
    this.column = value;
    this.requestUpdate("columnWidth", previous);
  }
  private readonly lightStyles = new RootStyles(this, [dataListLightCss]);
  protected updated() {
    const root = this.renderRoot.querySelector<HTMLElement>("[part=root]")!;
    if (this.columnWidth === undefined) root.style.removeProperty("--acme-data-list-column-width");
    else root.style.setProperty("--acme-data-list-column-width", this.columnWidth);
  }
  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-data-list": AcmeDataList;
  }
}
