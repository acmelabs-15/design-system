import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { SelectionConnection, type SelectionMember } from "../../shared/selection-member";
import { StoreSelector } from "../../shared/store-connection";
import { GroupMemberController, groupMemberStyles } from "../../shared/group-member";
import { createInheritedAppearance } from "../../shared/inherited-appearance";
import { segmentedControlItemStructureCss } from "../../generated/components/segmented-control-item/segmented-control-item-structure.styles";
/** One radio choice owned by Segmented Control. Name icon-only content with aria-label.
 * @slot - The visible label or icon.
 * @csspart root - The native label hit surface.
 * @csspart item - The native label hit surface.
 * @csspart control - The native radio.
 * @csspart label - The visible content.
 */
export class AcmeSegmentedControlItem extends AcmeSemanticElement {
  static styles = [sharedCss, groupMemberStyles, segmentedControlItemStructureCss];
  static shadowRootOptions = { ...AcmeSemanticElement.shadowRootOptions, delegatesFocus: true };
  @atomState() private optionValue = "";
  /** Required nonempty choice value. @default "" */
  @property({ noAccessor: true }) get value() {
    return this.optionValue;
  }
  set value(value: string) {
    if (typeof value !== "string") throw new TypeError("Selection value must be a string");
    const old = this.optionValue;
    this.optionValue = value;
    this.selection?.notify();
    this.selection?.owner?.synchronize();
    this.requestUpdate("value", old);
  }
  @atomState() private unavailable = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get disabled() {
    return this.unavailable;
  }
  set disabled(value: boolean) {
    const old = this.unavailable;
    this.unavailable = Boolean(value);
    this.synchronize();
    this.selection?.owner?.synchronize();
    this.requestUpdate("disabled", old);
  }
  private readonly input = this.ownerDocument.createElement("input");
  private readonly member: SelectionMember = {
    host: this,
    kind: "radio",
    owner: () => this.selection.owner,
    value: () => this.value,
    disabled: () => this.effectiveDisabled,
    required: () => false,
    target: () => this.input,
    validation: () => ({ flags: {}, message: "" }),
    synchronize: () => this.synchronize(),
    connect: (owner) => {
      this.selection.setOwner(owner);
      this.synchronize();
    },
  };
  private readonly selection = new SelectionConnection(this, this.member);
  private get selected() {
    return this.selection.owner?.checked(this.member) ?? false;
  }
  private get effectiveDisabled() {
    return this.disabled || !this.selection?.owner || this.selection.owner.state.get().disabled;
  }
  private readonly display = createAtom(() => ({ selected: this.selected, disabled: this.effectiveDisabled }), { compare: (a, b) => a.selected === b.selected && a.disabled === b.disabled });
  private readonly updates = new StoreSelector(this, () => this.display);
  private readonly fallback = createAtom(() => ({ size: this.selection.owner?.state.get().size }));
  private readonly appearance = createInheritedAppearance({ size: { supported: ["small", "medium", "large"] as const, defaultValue: "medium" } }, this.fallback);
  private readonly appearanceUpdates = new StoreSelector(this, () => this.appearance.effective);
  private readonly group = new GroupMemberController(this, { surface: () => this.renderRoot?.querySelector<HTMLElement>('[part~="root"]') ?? undefined, appearance: this.appearance });
  protected get semanticTarget() {
    return this.input;
  }
  protected get semanticDefaults() {
    const label = this.renderRoot?.querySelector("[part=label]");
    return { labelledByElements: label ? [label] : [] };
  }
  private synchronize() {
    if (!this.input) return;
    this.input.type = "radio";
    this.input.checked = this.selected;
    this.input.disabled = this.effectiveDisabled;
    this.input.value = this.value;
  }
  constructor() {
    super();
    this.input.className = "native";
    this.input.setAttribute("part", "control");
    this.input.addEventListener("input", () => {
      if (!this.effectiveDisabled && this.input.checked) this.selection.owner?.change(this.member, true, "user");
    });
    this.addEventListener("click", (event) => {
      if (event.composedPath()[0] === this) this.click();
    });
  }
  click() {
    if (!this.effectiveDisabled) this.input.click();
  }
  focus(options?: FocusOptions) {
    this.input.focus(options);
  }
  protected updated() {
    this.synchronize();
  }
  render() {
    return html`<label class="segment" part="root item" data-size=${this.appearance.effective.get().size} ?data-selected=${this.selected} ?data-disabled=${this.effectiveDisabled}>${this.input}<span part="label"><slot></slot></span></label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-segmented-control-item": AcmeSegmentedControlItem;
  }
}
