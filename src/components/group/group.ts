import { createAtom } from "@tanstack/lit-store";
import { property } from "lit/decorators.js";
import { AcmeFlexLayoutElement } from "../../shared/flex-layout-element";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { copyResponsiveInput, mapResponsiveInput, parseResponsiveAttribute } from "../../shared/responsive-input";
import type { ResponsiveInput } from "../../shared/responsive";
import type { StyleInputKey } from "../../shared/style-input-schema";
import type { AppearanceDefaults } from "../../shared/inherited-appearance";
import { GroupLayout } from "../../shared/group-layout";
import { StoreEffect } from "../../shared/state";
import { groupStructureCss } from "../../generated/components/group/group-structure.styles";

export type GroupOrientation = "horizontal" | "vertical";
const orientationValue = (value: unknown): value is GroupOrientation => value === "horizontal" || value === "vertical";

/**
 * Arranges participating controls with optional attachment, outer outline and appearance defaults.
 * @cssprop --acme-group-outline-color - Frame color; defaults to the theme gray-200 color.
 * @cssprop --acme-group-outline-width - Frame thickness; defaults to 1px.
 * @cssprop --acme-group-outline-radius - Frame radius; defaults to the house radius token.
 * @cssprop --acme-group-outline-padding - Frame padding; defaults to zero.
 */
export class AcmeGroup extends AcmeFlexLayoutElement {
  static styles = [...AcmeFlexLayoutElement.styles, groupStructureCss];
  @atomState() private authoredOrientation: ResponsiveInput<GroupOrientation>;
  /** @default "horizontal" */
  @property({ noAccessor: true })
  get orientation(): Exclude<ResponsiveInput<GroupOrientation>, undefined> {
    return this.authoredOrientation ?? "horizontal";
  }
  set orientation(value: ResponsiveInput<GroupOrientation>) {
    const previous = this.orientation;
    this.authoredOrientation = copyResponsiveInput(value, orientationValue);
    this.requestUpdate("orientation", previous);
  }
  @atomState()
  @property({ type: Boolean, reflect: true, noAccessor: true })
  attached = false;
  @atomState()
  @property({ type: Boolean, reflect: true, noAccessor: true })
  outline = false;
  @atomState()
  @property({ type: Boolean, reflect: true, noAccessor: true })
  grow = false;
  @atomState()
  @property({ noAccessor: true, converter: optionalString })
  size?: string;
  @atomState()
  @property({ noAccessor: true, converter: optionalString })
  variant?: string;
  private readonly defaults = createAtom<AppearanceDefaults>(() => Object.freeze({ size: this.size, variant: this.variant }));
  private readonly group = new GroupLayout(this, {
    root: () => this.renderRoot?.querySelector('[part~="root"]') as HTMLElement | null,
    nodes: () => this.renderRoot?.querySelector("slot")?.assignedNodes({ flatten: true }) ?? [...this.childNodes],
    defaults: this.defaults,
    attached: () => this.attached,
    outline: () => this.outline,
    grow: () => this.grow,
  });
  private readonly groupTheme = new StoreEffect(
    this,
    () => this.themeContext.scope.effective,
    () => this.group.schedule(),
  );
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (name === "orientation") {
      const parsed = parseResponsiveAttribute(value, orientationValue);
      this.orientation = parsed.value;
      if (parsed.diagnostic) {
        console.warn(this.localName, { ...parsed.diagnostic, attribute: name });
      }
    } else {
      super.attributeChangedCallback(name, previous, value);
    }
  }
  protected resolvedStyleInputs(): readonly (readonly [StyleInputKey, unknown])[] {
    const inputs = super.resolvedStyleInputs(),
      direction = mapResponsiveInput(this.authoredOrientation, (value) => (value === "vertical" ? "column" : "row"));
    return direction === undefined ? inputs : [...inputs, ["flexDirection", direction] as const];
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-group": AcmeGroup;
  }
}
