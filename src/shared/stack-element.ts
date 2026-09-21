import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { stackStructureCss } from "../generated/shared/stack-structure.styles";
import { responsiveStyleDelivery } from "../generated/responsive-styles";
import { atomState } from "./atom-state";
import { AcmeFlexLayoutElement } from "./flex-layout-element";
import { StackSeparators } from "./stack-separators";
import { StoreEffect } from "./state";

/**
 * Shared spacing and line-aware decoration for Stack, HStack and VStack.
 * @slot - Author-owned stack items.
 * @csspart root - The native arrangement and semantic element.
 * @csspart separator - A decorative separator between same-line neighbors.
 * @cssprop --acme-stack-separator-color - Separator color; defaults to the theme gray-200 color.
 * @cssprop --acme-stack-separator-width - Nonnegative line thickness; defaults to 1px.
 * @cssprop --acme-stack-separator-inset - Inset at both line ends; defaults to 0px.
 */
export abstract class AcmeStackElement extends AcmeFlexLayoutElement {
  static styles = [...AcmeFlexLayoutElement.styles, stackStructureCss];
  @atomState()
  @property({ type: Boolean, reflect: true, noAccessor: true })
  separator = false;
  private readonly separators = new StackSeparators(this, { enabled: () => this.separator, root: () => this.renderRoot?.querySelector('[part~="root"]') as HTMLElement | null });
  private readonly separatorTheme = new StoreEffect(
    this,
    () => this.themeContext.scope.effective,
    () => this.separators.schedule(),
  );
  protected renderContent() {
    const state = this.separators.state.get(),
      rules = responsiveStyleDelivery.rules;
    return html`<slot></slot>${
      this.separator
        ? html`<div data-stack-overlay aria-hidden="true"><span data-stack-measure></span>${state.rectangles.map(
            (rectangle) => html`<acme-separator
      data-stack-separator exportparts="root:separator" orientation=${state.vertical ? "horizontal" : "vertical"}
      style=${styleMap({ [rules.inset.property]: `${rectangle.y}px auto auto ${rectangle.x}px`, [rules.width.property]: `${rectangle.width}px`, [rules.height.property]: `${rectangle.height}px` })}
    ></acme-separator>`,
          )}</div>`
        : nothing
    }`;
  }
}
