import { property } from "lit/decorators.js";
import { html } from "lit";
import { sharedCss } from "../base";
import { layoutStructureCss } from "../generated/shared/layout-structure.styles";
import { responsiveStyleDelivery } from "../generated/responsive-styles";
import { atomState } from "./atom-state";
import type { ResponsiveInput } from "./responsive";
import { AcmeSemanticElement } from "./semantic-element";
import { StyleInputController } from "./style-input-controller";
import { commonStyleInputSchema, styleInputSchema, type StyleInputKey, type StyleScalar, type StyleDisplayMode } from "./style-input-schema";
import { ResponsiveStyleRenderer, type ResponsiveStyleTarget } from "./style-renderer";

export type StructuralTag = "div" | "span" | "section" | "article" | "main" | "nav" | "aside" | "header" | "footer";
export type LayoutStyleValue<Key extends StyleInputKey> = ResponsiveInput<StyleScalar<Key>>;

/**
 * Shared structural semantics and ordered box inputs. Visual defaults come from generated CSS.
 * @slot - Author-owned content.
 * @csspart root - The native semantic element.
 * @attr margin - Responsive margin input.
 * @attr margin-inline - Responsive margin-inline input.
 * @attr margin-block - Responsive margin-block input.
 * @attr margin-inline-start - Responsive margin-inline-start input.
 * @attr margin-inline-end - Responsive margin-inline-end input.
 * @attr margin-block-start - Responsive margin-block-start input.
 * @attr margin-block-end - Responsive margin-block-end input.
 * @attr inset - Responsive inset input.
 * @attr inset-inline - Responsive inset-inline input.
 * @attr inset-block - Responsive inset-block input.
 * @attr inset-inline-start - Responsive inset-inline-start input.
 * @attr inset-inline-end - Responsive inset-inline-end input.
 * @attr inset-block-start - Responsive inset-block-start input.
 * @attr inset-block-end - Responsive inset-block-end input.
 * @attr padding - Responsive padding input.
 * @attr padding-inline - Responsive padding-inline input.
 * @attr padding-block - Responsive padding-block input.
 * @attr padding-inline-start - Responsive padding-inline-start input.
 * @attr padding-inline-end - Responsive padding-inline-end input.
 * @attr padding-block-start - Responsive padding-block-start input.
 * @attr padding-block-end - Responsive padding-block-end input.
 * @attr width - Responsive width input.
 * @attr min-width - Responsive min-width input.
 * @attr max-width - Responsive max-width input.
 * @attr height - Responsive height input.
 * @attr min-height - Responsive min-height input.
 * @attr max-height - Responsive max-height input.
 * @attr flex-basis - Responsive flex-basis input.
 * @attr aspect-ratio - Responsive aspect-ratio input.
 * @attr z-index - Responsive z-index input.
 * @attr grid-column-start - Responsive grid-column-start input.
 * @attr grid-column-end - Responsive grid-column-end input.
 * @attr grid-row-start - Responsive grid-row-start input.
 * @attr grid-row-end - Responsive grid-row-end input.
 * @attr opacity - Responsive opacity input.
 * @attr flex-grow - Responsive flex-grow input.
 * @attr flex-shrink - Responsive flex-shrink input.
 * @attr border-width - Responsive border-width input.
 * @attr border-inline-width - Responsive border-inline-width input.
 * @attr border-block-width - Responsive border-block-width input.
 * @attr border-inline-start-width - Responsive border-inline-start-width input.
 * @attr border-inline-end-width - Responsive border-inline-end-width input.
 * @attr border-block-start-width - Responsive border-block-start-width input.
 * @attr border-block-end-width - Responsive border-block-end-width input.
 * @attr border-radius - Responsive border-radius input.
 * @attr border-start-start-radius - Responsive border-start-start-radius input.
 * @attr border-start-end-radius - Responsive border-start-end-radius input.
 * @attr border-end-start-radius - Responsive border-end-start-radius input.
 * @attr border-end-end-radius - Responsive border-end-end-radius input.
 * @attr position - Responsive position input.
 * @attr visibility - Responsive visibility input.
 * @attr overflow - Responsive overflow input.
 * @attr overflow-x - Responsive overflow-x input.
 * @attr overflow-y - Responsive overflow-y input.
 * @attr color - Responsive color input.
 * @attr background-color - Responsive background-color input.
 * @attr box-shadow - Responsive box-shadow input.
 * @attr border-style - Responsive border-style input.
 * @attr border-inline-style - Responsive border-inline-style input.
 * @attr border-block-style - Responsive border-block-style input.
 * @attr border-inline-start-style - Responsive border-inline-start-style input.
 * @attr border-inline-end-style - Responsive border-inline-end-style input.
 * @attr border-block-start-style - Responsive border-block-start-style input.
 * @attr border-block-end-style - Responsive border-block-end-style input.
 * @attr border-color - Responsive border-color input.
 * @attr border-inline-color - Responsive border-inline-color input.
 * @attr border-block-color - Responsive border-block-color input.
 * @attr border-inline-start-color - Responsive border-inline-start-color input.
 * @attr border-inline-end-color - Responsive border-inline-end-color input.
 * @attr border-block-start-color - Responsive border-block-start-color input.
 * @attr border-block-end-color - Responsive border-block-end-color input.
 * @attr align-self - Responsive align-self input.
 * @attr justify-self - Responsive justify-self input.
 * @attr grid-area - Responsive grid-area input.
 * @attr grid-column - Responsive grid-column input.
 * @attr grid-row - Responsive grid-row input.
 * @attr display - Responsive display input.
 */
export abstract class AcmeLayoutElement extends AcmeSemanticElement {
  static styles = [sharedCss, layoutStructureCss];
  protected static styleKeys: readonly StyleInputKey[] = Object.freeze(Object.keys(commonStyleInputSchema) as StyleInputKey[]);
  protected static layout?: "flex" | "grid";
  protected static displayModes: readonly StyleDisplayMode[] = ["none", "inline", "inline-block", "block"];
  static get observedAttributes(): string[] {
    return [...new Set([...super.observedAttributes, ...this.styleKeys.map((key) => styleInputSchema[key].attribute)])];
  }
  /** Native structural meaning, independent of arrangement. */
  @atomState()
  @property({ reflect: true, noAccessor: true, useDefault: true })
  as: StructuralTag = "div";
  @atomState()
  @property({ attribute: "responsive-target", noAccessor: true, useDefault: true })
  responsiveTarget: ResponsiveStyleTarget = "window";
  @atomState()
  @property({ attribute: "responsive-container", noAccessor: true })
  responsiveContainer?: string;
  protected readonly styleInputs = new StyleInputController(this, (this.constructor as typeof AcmeLayoutElement).styleKeys, {
    displayModes: (this.constructor as typeof AcmeLayoutElement).displayModes,
    supports: (property, value) => {
      const css = this.ownerDocument.defaultView?.CSS;
      if (css?.supports) return css.supports(property, value);
      const style = this.ownerDocument.createElement("div").style;
      style.setProperty(property, value);
      return !!style.getPropertyValue(property);
    },
    diagnostic: (diagnostic) => console.warn(this.localName, diagnostic),
  });
  private readonly renderer = new ResponsiveStyleRenderer(this, responsiveStyleDelivery, {
    root: () => (this.renderRoot?.nodeType === 11 ? (this.renderRoot as ShadowRoot) : undefined),
    state: () => ({ inputs: this.resolvedStyleInputs(), target: this.responsiveTarget, container: this.responsiveContainer }),
    displayModes: (this.constructor as typeof AcmeLayoutElement).displayModes,
    layout: (this.constructor as typeof AcmeLayoutElement).layout,
    diagnostic: (diagnostic) => console.warn(this.localName, diagnostic),
  });
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (!this.styleInputs?.attributeChanged(name, previous, value)) super.attributeChangedCallback(name, previous, value);
  }
  adoptedCallback(): void {
    super.adoptedCallback();
    this.renderer.adopted();
  }
  protected resolvedStyleInputs(): readonly (readonly [StyleInputKey, unknown])[] {
    return this.styleInputs.entries.get();
  }
  protected renderContent() {
    return html`<slot></slot>`;
  }
  render() {
    switch (this.as) {
      case "span":
        return html`<span part="root">${this.renderContent()}</span>`;
      case "section":
        return html`<section part="root">${this.renderContent()}</section>`;
      case "article":
        return html`<article part="root">${this.renderContent()}</article>`;
      case "main":
        return html`<main part="root">${this.renderContent()}</main>`;
      case "nav":
        return html`<nav part="root">${this.renderContent()}</nav>`;
      case "aside":
        return html`<aside part="root">${this.renderContent()}</aside>`;
      case "header":
        return html`<header part="root">${this.renderContent()}</header>`;
      case "footer":
        return html`<footer part="root">${this.renderContent()}</footer>`;
      default:
        return html`<div part="root">${this.renderContent()}</div>`;
    }
  }
  get margin(): LayoutStyleValue<"margin"> {
    return this.styleInputs.get("margin");
  }
  set margin(value: LayoutStyleValue<"margin">) {
    this.styleInputs.set("margin", value);
  }
  get marginInline(): LayoutStyleValue<"marginInline"> {
    return this.styleInputs.get("marginInline");
  }
  set marginInline(value: LayoutStyleValue<"marginInline">) {
    this.styleInputs.set("marginInline", value);
  }
  get marginBlock(): LayoutStyleValue<"marginBlock"> {
    return this.styleInputs.get("marginBlock");
  }
  set marginBlock(value: LayoutStyleValue<"marginBlock">) {
    this.styleInputs.set("marginBlock", value);
  }
  get marginInlineStart(): LayoutStyleValue<"marginInlineStart"> {
    return this.styleInputs.get("marginInlineStart");
  }
  set marginInlineStart(value: LayoutStyleValue<"marginInlineStart">) {
    this.styleInputs.set("marginInlineStart", value);
  }
  get marginInlineEnd(): LayoutStyleValue<"marginInlineEnd"> {
    return this.styleInputs.get("marginInlineEnd");
  }
  set marginInlineEnd(value: LayoutStyleValue<"marginInlineEnd">) {
    this.styleInputs.set("marginInlineEnd", value);
  }
  get marginBlockStart(): LayoutStyleValue<"marginBlockStart"> {
    return this.styleInputs.get("marginBlockStart");
  }
  set marginBlockStart(value: LayoutStyleValue<"marginBlockStart">) {
    this.styleInputs.set("marginBlockStart", value);
  }
  get marginBlockEnd(): LayoutStyleValue<"marginBlockEnd"> {
    return this.styleInputs.get("marginBlockEnd");
  }
  set marginBlockEnd(value: LayoutStyleValue<"marginBlockEnd">) {
    this.styleInputs.set("marginBlockEnd", value);
  }
  get inset(): LayoutStyleValue<"inset"> {
    return this.styleInputs.get("inset");
  }
  set inset(value: LayoutStyleValue<"inset">) {
    this.styleInputs.set("inset", value);
  }
  get insetInline(): LayoutStyleValue<"insetInline"> {
    return this.styleInputs.get("insetInline");
  }
  set insetInline(value: LayoutStyleValue<"insetInline">) {
    this.styleInputs.set("insetInline", value);
  }
  get insetBlock(): LayoutStyleValue<"insetBlock"> {
    return this.styleInputs.get("insetBlock");
  }
  set insetBlock(value: LayoutStyleValue<"insetBlock">) {
    this.styleInputs.set("insetBlock", value);
  }
  get insetInlineStart(): LayoutStyleValue<"insetInlineStart"> {
    return this.styleInputs.get("insetInlineStart");
  }
  set insetInlineStart(value: LayoutStyleValue<"insetInlineStart">) {
    this.styleInputs.set("insetInlineStart", value);
  }
  get insetInlineEnd(): LayoutStyleValue<"insetInlineEnd"> {
    return this.styleInputs.get("insetInlineEnd");
  }
  set insetInlineEnd(value: LayoutStyleValue<"insetInlineEnd">) {
    this.styleInputs.set("insetInlineEnd", value);
  }
  get insetBlockStart(): LayoutStyleValue<"insetBlockStart"> {
    return this.styleInputs.get("insetBlockStart");
  }
  set insetBlockStart(value: LayoutStyleValue<"insetBlockStart">) {
    this.styleInputs.set("insetBlockStart", value);
  }
  get insetBlockEnd(): LayoutStyleValue<"insetBlockEnd"> {
    return this.styleInputs.get("insetBlockEnd");
  }
  set insetBlockEnd(value: LayoutStyleValue<"insetBlockEnd">) {
    this.styleInputs.set("insetBlockEnd", value);
  }
  get padding(): LayoutStyleValue<"padding"> {
    return this.styleInputs.get("padding");
  }
  set padding(value: LayoutStyleValue<"padding">) {
    this.styleInputs.set("padding", value);
  }
  get paddingInline(): LayoutStyleValue<"paddingInline"> {
    return this.styleInputs.get("paddingInline");
  }
  set paddingInline(value: LayoutStyleValue<"paddingInline">) {
    this.styleInputs.set("paddingInline", value);
  }
  get paddingBlock(): LayoutStyleValue<"paddingBlock"> {
    return this.styleInputs.get("paddingBlock");
  }
  set paddingBlock(value: LayoutStyleValue<"paddingBlock">) {
    this.styleInputs.set("paddingBlock", value);
  }
  get paddingInlineStart(): LayoutStyleValue<"paddingInlineStart"> {
    return this.styleInputs.get("paddingInlineStart");
  }
  set paddingInlineStart(value: LayoutStyleValue<"paddingInlineStart">) {
    this.styleInputs.set("paddingInlineStart", value);
  }
  get paddingInlineEnd(): LayoutStyleValue<"paddingInlineEnd"> {
    return this.styleInputs.get("paddingInlineEnd");
  }
  set paddingInlineEnd(value: LayoutStyleValue<"paddingInlineEnd">) {
    this.styleInputs.set("paddingInlineEnd", value);
  }
  get paddingBlockStart(): LayoutStyleValue<"paddingBlockStart"> {
    return this.styleInputs.get("paddingBlockStart");
  }
  set paddingBlockStart(value: LayoutStyleValue<"paddingBlockStart">) {
    this.styleInputs.set("paddingBlockStart", value);
  }
  get paddingBlockEnd(): LayoutStyleValue<"paddingBlockEnd"> {
    return this.styleInputs.get("paddingBlockEnd");
  }
  set paddingBlockEnd(value: LayoutStyleValue<"paddingBlockEnd">) {
    this.styleInputs.set("paddingBlockEnd", value);
  }
  get width(): LayoutStyleValue<"width"> {
    return this.styleInputs.get("width");
  }
  set width(value: LayoutStyleValue<"width">) {
    this.styleInputs.set("width", value);
  }
  get minWidth(): LayoutStyleValue<"minWidth"> {
    return this.styleInputs.get("minWidth");
  }
  set minWidth(value: LayoutStyleValue<"minWidth">) {
    this.styleInputs.set("minWidth", value);
  }
  get maxWidth(): LayoutStyleValue<"maxWidth"> {
    return this.styleInputs.get("maxWidth");
  }
  set maxWidth(value: LayoutStyleValue<"maxWidth">) {
    this.styleInputs.set("maxWidth", value);
  }
  get height(): LayoutStyleValue<"height"> {
    return this.styleInputs.get("height");
  }
  set height(value: LayoutStyleValue<"height">) {
    this.styleInputs.set("height", value);
  }
  get minHeight(): LayoutStyleValue<"minHeight"> {
    return this.styleInputs.get("minHeight");
  }
  set minHeight(value: LayoutStyleValue<"minHeight">) {
    this.styleInputs.set("minHeight", value);
  }
  get maxHeight(): LayoutStyleValue<"maxHeight"> {
    return this.styleInputs.get("maxHeight");
  }
  set maxHeight(value: LayoutStyleValue<"maxHeight">) {
    this.styleInputs.set("maxHeight", value);
  }
  get flexBasis(): LayoutStyleValue<"flexBasis"> {
    return this.styleInputs.get("flexBasis");
  }
  set flexBasis(value: LayoutStyleValue<"flexBasis">) {
    this.styleInputs.set("flexBasis", value);
  }
  get aspectRatio(): LayoutStyleValue<"aspectRatio"> {
    return this.styleInputs.get("aspectRatio");
  }
  set aspectRatio(value: LayoutStyleValue<"aspectRatio">) {
    this.styleInputs.set("aspectRatio", value);
  }
  get zIndex(): LayoutStyleValue<"zIndex"> {
    return this.styleInputs.get("zIndex");
  }
  set zIndex(value: LayoutStyleValue<"zIndex">) {
    this.styleInputs.set("zIndex", value);
  }
  get gridColumnStart(): LayoutStyleValue<"gridColumnStart"> {
    return this.styleInputs.get("gridColumnStart");
  }
  set gridColumnStart(value: LayoutStyleValue<"gridColumnStart">) {
    this.styleInputs.set("gridColumnStart", value);
  }
  get gridColumnEnd(): LayoutStyleValue<"gridColumnEnd"> {
    return this.styleInputs.get("gridColumnEnd");
  }
  set gridColumnEnd(value: LayoutStyleValue<"gridColumnEnd">) {
    this.styleInputs.set("gridColumnEnd", value);
  }
  get gridRowStart(): LayoutStyleValue<"gridRowStart"> {
    return this.styleInputs.get("gridRowStart");
  }
  set gridRowStart(value: LayoutStyleValue<"gridRowStart">) {
    this.styleInputs.set("gridRowStart", value);
  }
  get gridRowEnd(): LayoutStyleValue<"gridRowEnd"> {
    return this.styleInputs.get("gridRowEnd");
  }
  set gridRowEnd(value: LayoutStyleValue<"gridRowEnd">) {
    this.styleInputs.set("gridRowEnd", value);
  }
  get opacity(): LayoutStyleValue<"opacity"> {
    return this.styleInputs.get("opacity");
  }
  set opacity(value: LayoutStyleValue<"opacity">) {
    this.styleInputs.set("opacity", value);
  }
  get flexGrow(): LayoutStyleValue<"flexGrow"> {
    return this.styleInputs.get("flexGrow");
  }
  set flexGrow(value: LayoutStyleValue<"flexGrow">) {
    this.styleInputs.set("flexGrow", value);
  }
  get flexShrink(): LayoutStyleValue<"flexShrink"> {
    return this.styleInputs.get("flexShrink");
  }
  set flexShrink(value: LayoutStyleValue<"flexShrink">) {
    this.styleInputs.set("flexShrink", value);
  }
  get borderWidth(): LayoutStyleValue<"borderWidth"> {
    return this.styleInputs.get("borderWidth");
  }
  set borderWidth(value: LayoutStyleValue<"borderWidth">) {
    this.styleInputs.set("borderWidth", value);
  }
  get borderInlineWidth(): LayoutStyleValue<"borderInlineWidth"> {
    return this.styleInputs.get("borderInlineWidth");
  }
  set borderInlineWidth(value: LayoutStyleValue<"borderInlineWidth">) {
    this.styleInputs.set("borderInlineWidth", value);
  }
  get borderBlockWidth(): LayoutStyleValue<"borderBlockWidth"> {
    return this.styleInputs.get("borderBlockWidth");
  }
  set borderBlockWidth(value: LayoutStyleValue<"borderBlockWidth">) {
    this.styleInputs.set("borderBlockWidth", value);
  }
  get borderInlineStartWidth(): LayoutStyleValue<"borderInlineStartWidth"> {
    return this.styleInputs.get("borderInlineStartWidth");
  }
  set borderInlineStartWidth(value: LayoutStyleValue<"borderInlineStartWidth">) {
    this.styleInputs.set("borderInlineStartWidth", value);
  }
  get borderInlineEndWidth(): LayoutStyleValue<"borderInlineEndWidth"> {
    return this.styleInputs.get("borderInlineEndWidth");
  }
  set borderInlineEndWidth(value: LayoutStyleValue<"borderInlineEndWidth">) {
    this.styleInputs.set("borderInlineEndWidth", value);
  }
  get borderBlockStartWidth(): LayoutStyleValue<"borderBlockStartWidth"> {
    return this.styleInputs.get("borderBlockStartWidth");
  }
  set borderBlockStartWidth(value: LayoutStyleValue<"borderBlockStartWidth">) {
    this.styleInputs.set("borderBlockStartWidth", value);
  }
  get borderBlockEndWidth(): LayoutStyleValue<"borderBlockEndWidth"> {
    return this.styleInputs.get("borderBlockEndWidth");
  }
  set borderBlockEndWidth(value: LayoutStyleValue<"borderBlockEndWidth">) {
    this.styleInputs.set("borderBlockEndWidth", value);
  }
  get borderRadius(): LayoutStyleValue<"borderRadius"> {
    return this.styleInputs.get("borderRadius");
  }
  set borderRadius(value: LayoutStyleValue<"borderRadius">) {
    this.styleInputs.set("borderRadius", value);
  }
  get borderStartStartRadius(): LayoutStyleValue<"borderStartStartRadius"> {
    return this.styleInputs.get("borderStartStartRadius");
  }
  set borderStartStartRadius(value: LayoutStyleValue<"borderStartStartRadius">) {
    this.styleInputs.set("borderStartStartRadius", value);
  }
  get borderStartEndRadius(): LayoutStyleValue<"borderStartEndRadius"> {
    return this.styleInputs.get("borderStartEndRadius");
  }
  set borderStartEndRadius(value: LayoutStyleValue<"borderStartEndRadius">) {
    this.styleInputs.set("borderStartEndRadius", value);
  }
  get borderEndStartRadius(): LayoutStyleValue<"borderEndStartRadius"> {
    return this.styleInputs.get("borderEndStartRadius");
  }
  set borderEndStartRadius(value: LayoutStyleValue<"borderEndStartRadius">) {
    this.styleInputs.set("borderEndStartRadius", value);
  }
  get borderEndEndRadius(): LayoutStyleValue<"borderEndEndRadius"> {
    return this.styleInputs.get("borderEndEndRadius");
  }
  set borderEndEndRadius(value: LayoutStyleValue<"borderEndEndRadius">) {
    this.styleInputs.set("borderEndEndRadius", value);
  }
  get position(): LayoutStyleValue<"position"> {
    return this.styleInputs.get("position");
  }
  set position(value: LayoutStyleValue<"position">) {
    this.styleInputs.set("position", value);
  }
  get visibility(): LayoutStyleValue<"visibility"> {
    return this.styleInputs.get("visibility");
  }
  set visibility(value: LayoutStyleValue<"visibility">) {
    this.styleInputs.set("visibility", value);
  }
  get overflow(): LayoutStyleValue<"overflow"> {
    return this.styleInputs.get("overflow");
  }
  set overflow(value: LayoutStyleValue<"overflow">) {
    this.styleInputs.set("overflow", value);
  }
  get overflowX(): LayoutStyleValue<"overflowX"> {
    return this.styleInputs.get("overflowX");
  }
  set overflowX(value: LayoutStyleValue<"overflowX">) {
    this.styleInputs.set("overflowX", value);
  }
  get overflowY(): LayoutStyleValue<"overflowY"> {
    return this.styleInputs.get("overflowY");
  }
  set overflowY(value: LayoutStyleValue<"overflowY">) {
    this.styleInputs.set("overflowY", value);
  }
  get color(): LayoutStyleValue<"color"> {
    return this.styleInputs.get("color");
  }
  set color(value: LayoutStyleValue<"color">) {
    this.styleInputs.set("color", value);
  }
  get backgroundColor(): LayoutStyleValue<"backgroundColor"> {
    return this.styleInputs.get("backgroundColor");
  }
  set backgroundColor(value: LayoutStyleValue<"backgroundColor">) {
    this.styleInputs.set("backgroundColor", value);
  }
  get boxShadow(): LayoutStyleValue<"boxShadow"> {
    return this.styleInputs.get("boxShadow");
  }
  set boxShadow(value: LayoutStyleValue<"boxShadow">) {
    this.styleInputs.set("boxShadow", value);
  }
  get borderStyle(): LayoutStyleValue<"borderStyle"> {
    return this.styleInputs.get("borderStyle");
  }
  set borderStyle(value: LayoutStyleValue<"borderStyle">) {
    this.styleInputs.set("borderStyle", value);
  }
  get borderInlineStyle(): LayoutStyleValue<"borderInlineStyle"> {
    return this.styleInputs.get("borderInlineStyle");
  }
  set borderInlineStyle(value: LayoutStyleValue<"borderInlineStyle">) {
    this.styleInputs.set("borderInlineStyle", value);
  }
  get borderBlockStyle(): LayoutStyleValue<"borderBlockStyle"> {
    return this.styleInputs.get("borderBlockStyle");
  }
  set borderBlockStyle(value: LayoutStyleValue<"borderBlockStyle">) {
    this.styleInputs.set("borderBlockStyle", value);
  }
  get borderInlineStartStyle(): LayoutStyleValue<"borderInlineStartStyle"> {
    return this.styleInputs.get("borderInlineStartStyle");
  }
  set borderInlineStartStyle(value: LayoutStyleValue<"borderInlineStartStyle">) {
    this.styleInputs.set("borderInlineStartStyle", value);
  }
  get borderInlineEndStyle(): LayoutStyleValue<"borderInlineEndStyle"> {
    return this.styleInputs.get("borderInlineEndStyle");
  }
  set borderInlineEndStyle(value: LayoutStyleValue<"borderInlineEndStyle">) {
    this.styleInputs.set("borderInlineEndStyle", value);
  }
  get borderBlockStartStyle(): LayoutStyleValue<"borderBlockStartStyle"> {
    return this.styleInputs.get("borderBlockStartStyle");
  }
  set borderBlockStartStyle(value: LayoutStyleValue<"borderBlockStartStyle">) {
    this.styleInputs.set("borderBlockStartStyle", value);
  }
  get borderBlockEndStyle(): LayoutStyleValue<"borderBlockEndStyle"> {
    return this.styleInputs.get("borderBlockEndStyle");
  }
  set borderBlockEndStyle(value: LayoutStyleValue<"borderBlockEndStyle">) {
    this.styleInputs.set("borderBlockEndStyle", value);
  }
  get borderColor(): LayoutStyleValue<"borderColor"> {
    return this.styleInputs.get("borderColor");
  }
  set borderColor(value: LayoutStyleValue<"borderColor">) {
    this.styleInputs.set("borderColor", value);
  }
  get borderInlineColor(): LayoutStyleValue<"borderInlineColor"> {
    return this.styleInputs.get("borderInlineColor");
  }
  set borderInlineColor(value: LayoutStyleValue<"borderInlineColor">) {
    this.styleInputs.set("borderInlineColor", value);
  }
  get borderBlockColor(): LayoutStyleValue<"borderBlockColor"> {
    return this.styleInputs.get("borderBlockColor");
  }
  set borderBlockColor(value: LayoutStyleValue<"borderBlockColor">) {
    this.styleInputs.set("borderBlockColor", value);
  }
  get borderInlineStartColor(): LayoutStyleValue<"borderInlineStartColor"> {
    return this.styleInputs.get("borderInlineStartColor");
  }
  set borderInlineStartColor(value: LayoutStyleValue<"borderInlineStartColor">) {
    this.styleInputs.set("borderInlineStartColor", value);
  }
  get borderInlineEndColor(): LayoutStyleValue<"borderInlineEndColor"> {
    return this.styleInputs.get("borderInlineEndColor");
  }
  set borderInlineEndColor(value: LayoutStyleValue<"borderInlineEndColor">) {
    this.styleInputs.set("borderInlineEndColor", value);
  }
  get borderBlockStartColor(): LayoutStyleValue<"borderBlockStartColor"> {
    return this.styleInputs.get("borderBlockStartColor");
  }
  set borderBlockStartColor(value: LayoutStyleValue<"borderBlockStartColor">) {
    this.styleInputs.set("borderBlockStartColor", value);
  }
  get borderBlockEndColor(): LayoutStyleValue<"borderBlockEndColor"> {
    return this.styleInputs.get("borderBlockEndColor");
  }
  set borderBlockEndColor(value: LayoutStyleValue<"borderBlockEndColor">) {
    this.styleInputs.set("borderBlockEndColor", value);
  }
  get alignSelf(): LayoutStyleValue<"alignSelf"> {
    return this.styleInputs.get("alignSelf");
  }
  set alignSelf(value: LayoutStyleValue<"alignSelf">) {
    this.styleInputs.set("alignSelf", value);
  }
  get justifySelf(): LayoutStyleValue<"justifySelf"> {
    return this.styleInputs.get("justifySelf");
  }
  set justifySelf(value: LayoutStyleValue<"justifySelf">) {
    this.styleInputs.set("justifySelf", value);
  }
  get gridArea(): LayoutStyleValue<"gridArea"> {
    return this.styleInputs.get("gridArea");
  }
  set gridArea(value: LayoutStyleValue<"gridArea">) {
    this.styleInputs.set("gridArea", value);
  }
  get gridColumn(): LayoutStyleValue<"gridColumn"> {
    return this.styleInputs.get("gridColumn");
  }
  set gridColumn(value: LayoutStyleValue<"gridColumn">) {
    this.styleInputs.set("gridColumn", value);
  }
  get gridRow(): LayoutStyleValue<"gridRow"> {
    return this.styleInputs.get("gridRow");
  }
  set gridRow(value: LayoutStyleValue<"gridRow">) {
    this.styleInputs.set("gridRow", value);
  }
  get display(): LayoutStyleValue<"display"> {
    return this.styleInputs.get("display");
  }
  set display(value: LayoutStyleValue<"display">) {
    this.styleInputs.set("display", value);
  }
}
