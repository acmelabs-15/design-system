import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeCheckbox } from "../checkbox/checkbox";
import { Places } from "../../shared/places";
import { optionalString } from "../../shared/attributes";
import { GroupMemberController, groupMemberStyles } from "../../shared/group-member";
import { selectionCardCss } from "../../generated/shared/selection-card.styles";
/** Rich checkbox content with a separate region for independent actions.
 * @slot - Selectable card content.
 * @slot heading - The primary label.
 * @slot description - Supporting text.
 * @slot start - Leading content.
 * @slot end - Trailing content.
 * @slot actions - Independent controls outside the selection label.
 * @csspart content - The selectable content column.
 */
export class AcmeCheckboxCard extends AcmeCheckbox {
  static styles = [...AcmeCheckbox.styles, selectionCardCss, groupMemberStyles];
  protected get appearanceVariants() {
    return ["default", "secondary"] as const;
  }
  private readonly content = new Places(this, { places: ["", "heading", "description", "start", "end", "actions"] });
  private readonly groupMember = new GroupMemberController(this, {
    surface: () => this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined,
    appearance: this.appearance,
    emphasized: () => this.checked || this.indeterminate || this.effectiveInvalid,
  });
  /** @default "default" */
  @property({ noAccessor: true, converter: optionalString }) get variant(): "default" | "secondary" {
    return this.appearance.effective.get().variant!;
  }
  set variant(value: "default" | "secondary" | undefined) {
    if (value !== undefined && value !== "default" && value !== "secondary") throw new TypeError("Invalid Checkbox Card variant");
    const previous = this.variant;
    this.appearance.setAuthored({ variant: value });
    this.requestUpdate("variant", previous);
  }
  protected get surface() {
    return this.renderRoot?.querySelector<HTMLElement>(".activation") ?? undefined;
  }
  protected get semanticDefaults() {
    const external = Array.from(this.nativeForm.labels).filter((label) => (label as HTMLLabelElement).control === this) as Element[];
    const label = this.renderRoot?.querySelector(this.content?.has("heading") ? ".heading" : ".body");
    const body = this.renderRoot?.querySelector(".body");
    const description = this.renderRoot?.querySelector("[part=description]");
    const field = this.field.association.defaults;
    const descriptions: Element[] = [...(field.describedByElements ?? [])];
    if (this.content?.has("heading") && this.content.has("") && body) descriptions.push(body);
    if (this.content?.has("description") && description) descriptions.push(description);
    return { labelledByElements: external.length ? external : field.labelledByElements?.length ? field.labelledByElements : label ? [label] : [], describedByElements: descriptions };
  }
  protected renderControl() {
    return html`${this.input}<span class="indicator" part="indicator" aria-hidden="true">${this.renderIndicator()}</span>`;
  }
  render() {
    return html`<div class="card" part="root" data-size=${this.size} data-variant=${this.variant} ?data-checked=${this.checked} ?data-indeterminate=${this.indeterminate} ?data-disabled=${this.effectiveDisabled} ?data-invalid=${this.effectiveInvalid}>
  <label class="selection-label activation" data-size=${this.size} ?data-checked=${this.checked} ?data-indeterminate=${this.indeterminate} ?data-disabled=${this.effectiveDisabled}>
   <span class="affix" ?hidden=${!this.content.has("start")}><slot name="start"></slot></span>
   <span class="content" part="content"><span class="heading" part="label" ?hidden=${!this.content.has("heading")}><slot name="heading"></slot></span><span class="body" part=${this.content.has("heading") ? nothing : "label"} ?hidden=${!this.content.has("")}><slot></slot></span><span part="description" ?hidden=${!this.content.has("description")}><slot name="description"></slot></span></span>
   <span class="affix" ?hidden=${!this.content.has("end")}><slot name="end"></slot></span>${this.renderControl()}${this.pressEffect.render()}
  </label><div class="actions" ?hidden=${!this.content.has("actions")}><slot name="actions"></slot></div>
 </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-checkbox-card": AcmeCheckboxCard;
  }
}
