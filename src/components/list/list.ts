import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeResponsiveElement } from "../../shared/responsive-element";
import { atomState } from "../../shared/atom-state";
import { RootStyles } from "../../shared/root-styles";
import { copyResponsiveInput, parseResponsiveAttribute } from "../../shared/responsive-input";
import { numericTokenKeys, type NumericTokenKey } from "../../shared/numeric-tokens";
import type { ResponsiveInput } from "../../shared/responsive";
import { ResponsiveStyleRenderer } from "../../shared/style-renderer";
import { responsiveStyleDelivery } from "../../generated/responsive-styles";
import { listStructureCss } from "../../generated/components/list/list-structure.styles";
import { listLightCss } from "../../generated/components/list/list-light.styles";

const spacingToken = (value: unknown): value is NumericTokenKey => typeof value === "number" && (numericTokenKeys as readonly number[]).includes(value);
/** Styles an author-owned native list without taking ownership of its items.
 * @slot - One native ul or ol with native li children.
 * @csspart root - The list wrapper.
 */
export class AcmeList extends AcmeResponsiveElement {
  static styles = [sharedCss, listStructureCss];
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) marker: "native" | "none" | "custom" = "native";
  @atomState() private currentSpacing: ResponsiveInput<NumericTokenKey>;
  @property({ noAccessor: true }) get spacing(): ResponsiveInput<NumericTokenKey> {
    return this.currentSpacing;
  }
  set spacing(value: ResponsiveInput<NumericTokenKey>) {
    const previous = this.currentSpacing;
    this.currentSpacing = copyResponsiveInput(value, spacingToken);
    this.requestUpdate("spacing", previous);
  }
  private readonly lightStyles = new RootStyles(this, [listLightCss]);
  private readonly renderer = new ResponsiveStyleRenderer(this, responsiveStyleDelivery, {
    root: () => this.shadowRoot ?? undefined,
    state: () => ({ inputs: [["rowGap", this.spacing]], target: this.responsiveTarget, container: this.responsiveContainer }),
  });
  private readonly ownedRoles = new Set<Element>();
  private syncLists = () => {
    for (const list of this.ownedRoles) {
      if (list.parentElement !== this || this.marker === "native") {
        if (list.getAttribute("role") === "list") {
          list.removeAttribute("role");
        }
        this.ownedRoles.delete(list);
      }
    }
    if (this.marker !== "native") {
      for (const list of this.children) {
        if ((list.localName === "ul" || list.localName === "ol") && !list.hasAttribute("role")) {
          list.setAttribute("role", "list");
          this.ownedRoles.add(list);
        }
      }
    }
  };
  attributeChangedCallback(name: string, previous: string | null, value: string | null) {
    if (name === "spacing") {
      const parsed = parseResponsiveAttribute(value, spacingToken, { numbers: true });
      this.spacing = parsed.value;
      if (parsed.diagnostic) {
        console.warn(this.localName, parsed.diagnostic);
      }
    } else {
      super.attributeChangedCallback(name, previous, value);
    }
  }
  protected updated() {
    this.syncLists();
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.renderer.adopted();
  }
  render() {
    return html`<div part="root"><slot @slotchange=${this.syncLists}></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-list": AcmeList;
  }
}
