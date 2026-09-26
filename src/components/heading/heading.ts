import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSizedTypographyElement } from "../../shared/typography-element";
import { atomState } from "../../shared/atom-state";
import { headingStructureCss } from "../../generated/components/heading/heading-structure.styles";
import { HeadingTargets } from "../../shared/heading-targets";
/** A native heading whose semantic level is independent of its visual size.
 * @slot - Author-owned heading content.
 * @csspart root - The native heading element.
 */
export class AcmeHeading extends AcmeSizedTypographyElement {
  static styles = [...AcmeSizedTypographyElement.styles, headingStructureCss];
  @atomState()
  @property({ noAccessor: true, reflect: true, useDefault: true })
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h2";
  private readonly targets = new HeadingTargets(this, () => {
    const heading = this.renderRoot?.querySelector('[part="root"]') as HTMLHeadingElement | null;
    return heading ? [Object.freeze({ heading, target: this, id: this.id, label: this.textContent?.trim() ?? "", level: Number(heading.localName.slice(1)) })] : [];
  });
  private content?: MutationObserver;
  connectedCallback() {
    super.connectedCallback();
    this.content = new MutationObserver(() => this.requestUpdate());
    this.content.observe(this, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["id"] });
    this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.content?.disconnect();
    this.content = undefined;
  }
  protected get inlineTypography() {
    return false;
  }
  getHeadingElement(): HTMLHeadingElement {
    const element = this.renderRoot?.querySelector('[part="root"]');
    if (!element) {
      throw new Error("Await updateComplete before reading the native heading");
    }
    return element as HTMLHeadingElement;
  }
  render() {
    switch (this.as) {
      case "h1":
        return html`<h1 part="root"><slot></slot></h1>`;
      case "h3":
        return html`<h3 part="root"><slot></slot></h3>`;
      case "h4":
        return html`<h4 part="root"><slot></slot></h4>`;
      case "h5":
        return html`<h5 part="root"><slot></slot></h5>`;
      case "h6":
        return html`<h6 part="root"><slot></slot></h6>`;
      default:
        return html`<h2 part="root"><slot></slot></h2>`;
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-heading": AcmeHeading;
  }
}
