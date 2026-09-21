import { property } from "lit/decorators.js";
import { AcmeResponsiveElement } from "./responsive-element";
import { atomState } from "./atom-state";
import { copyResponsiveInput, parseResponsiveAttribute } from "./responsive-input";
import type { ResponsiveInput } from "./responsive";
import { isAuthoredStyleScalar, isStyleScalar, type StyleInputKey, type StyleScalar } from "./style-input-schema";
import { ResponsiveStyleRenderer } from "./style-renderer";
import { responsiveStyleDelivery } from "../generated/responsive-styles";
import { typographyCss } from "../generated/shared/typography.styles";
import { sharedCss } from "../base";

type TypographyKey = "fontSize" | "fontWeight" | "color" | "textAlign";
type Value<Key extends TypographyKey> = ResponsiveInput<StyleScalar<Key>>;
const names = { fontSize: "size", fontWeight: "weight", color: "color", textAlign: "textAlign" } as const;
const attributes = { weight: "fontWeight", color: "color", "text-align": "textAlign" } as const;

/** Shared text styling and clipping. Components retain their own native meaning and size vocabulary. */
export abstract class AcmeTypographyElement extends AcmeResponsiveElement {
  static styles = [sharedCss, typographyCss];
  @atomState() private textStyles: Readonly<Partial<Record<TypographyKey, ResponsiveInput<string | number>>>> = Object.freeze({});
  @atomState() private clamp?: number;
  @atomState()
  @property({ type: Boolean, reflect: true, noAccessor: true })
  truncate = false;
  @property({ noAccessor: true })
  get weight(): Value<"fontWeight"> {
    return this.textStyle("fontWeight");
  }
  set weight(value: Value<"fontWeight">) {
    this.setTextStyle("fontWeight", value);
  }
  @property({ noAccessor: true })
  get color(): Value<"color"> {
    return this.textStyle("color");
  }
  set color(value: Value<"color">) {
    this.setTextStyle("color", value);
  }
  @property({ noAccessor: true, attribute: "text-align" })
  get textAlign(): Value<"textAlign"> {
    return this.textStyle("textAlign");
  }
  set textAlign(value: Value<"textAlign">) {
    this.setTextStyle("textAlign", value);
  }
  @property({ noAccessor: true, attribute: "line-clamp" })
  get lineClamp(): number | undefined {
    return this.clamp;
  }
  set lineClamp(value: number | undefined) {
    if (value !== undefined && (!Number.isInteger(value) || value < 1)) throw new RangeError("lineClamp must be a positive integer");
    const previous = this.clamp;
    this.clamp = value;
    this.requestUpdate("lineClamp", previous);
  }
  protected get inlineTypography(): boolean {
    return true;
  }
  private readonly renderer = new ResponsiveStyleRenderer(this, responsiveStyleDelivery, {
    root: () => (this.renderRoot?.nodeType === 11 ? (this.renderRoot as ShadowRoot) : undefined),
    state: () => ({
      inputs: [...(Object.entries(this.textStyles) as [StyleInputKey, unknown][]), ...(this.clamp === undefined ? [] : [["lineClamp", this.clamp] as const])],
      target: this.responsiveTarget,
      container: this.responsiveContainer,
    }),
  });
  protected textStyle<Key extends TypographyKey>(key: Key): Value<Key> {
    return this.textStyles[key] as Value<Key>;
  }
  private supports = (property: string, value: string): boolean => {
    const css = this.ownerDocument.defaultView?.CSS;
    if (css?.supports) return css.supports(property, value);
    const style = this.ownerDocument.createElement("div").style;
    style.setProperty(property, value);
    return !!style.getPropertyValue(property);
  };
  protected setTextStyle<Key extends TypographyKey>(key: Key, input: Value<Key>): void {
    const value = copyResponsiveInput(input, (value): value is StyleScalar<Key> => isAuthoredStyleScalar(key, value, this.supports));
    const previous = this.textStyles[key],
      next = { ...this.textStyles };
    if (value === undefined) delete next[key];
    else next[key] = value;
    this.textStyles = Object.freeze(next);
    this.requestUpdate(names[key], previous);
  }
  protected textAttribute<Key extends TypographyKey>(key: Key, value: string | null): void {
    const parsed = parseResponsiveAttribute(value, (value): value is StyleScalar<Key> => isStyleScalar(key, value, this.supports), { numbers: key === "fontWeight" });
    this.setTextStyle(key, parsed.value);
    if (parsed.diagnostic) console.warn(this.localName, { ...parsed.diagnostic, attribute: names[key] });
  }
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (Object.hasOwn(attributes, name)) {
      this.textAttribute(attributes[name as keyof typeof attributes], value);
      return;
    }
    if (name === "line-clamp") {
      const number = value === null || value.trim() === "" ? undefined : Number(value);
      if (number === undefined || (Number.isInteger(number) && number > 0)) this.lineClamp = number;
      else {
        this.lineClamp = undefined;
        console.warn(this.localName, { code: "invalid-line-clamp" });
      }
      return;
    }
    super.attributeChangedCallback(name, previous, value);
  }
  protected willUpdate(): void {
    this.toggleAttribute("data-acme-text-inline", this.inlineTypography);
    this.toggleAttribute("data-acme-text-clamp", this.lineClamp !== undefined);
  }
  adoptedCallback(): void {
    super.adoptedCallback();
    this.renderer.adopted();
  }
}

/** Typography whose size is an authored font-size rather than a component tier. */
export abstract class AcmeSizedTypographyElement extends AcmeTypographyElement {
  @property({ noAccessor: true })
  get size(): Value<"fontSize"> {
    return this.textStyle("fontSize");
  }
  set size(value: Value<"fontSize">) {
    this.setTextStyle("fontSize", value);
  }
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (name === "size") this.textAttribute("fontSize", value);
    else super.attributeChangedCallback(name, previous, value);
  }
}
