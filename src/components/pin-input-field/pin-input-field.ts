import { ContextConsumer } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { createInheritedAppearance } from "../../shared/inherited-appearance";
import { GroupMemberController, groupMemberStyles } from "../../shared/group-member";
import { pinInputContext, type PinFieldPart, type PinInputOwner } from "../../shared/pin-input-context";
import { textControlCss } from "../../generated/shared/text-control.styles";
import { pinInputFieldStructureCss } from "../../generated/components/pin-input-field/pin-input-field-structure.styles";
/** One indexed character field owned by the nearest Pin Input.
 * @csspart root - The field surface.
 * @csspart input - The native character input.
 */
export class AcmePinInputField extends AcmeSemanticElement {
  static styles = [sharedCss, textControlCss, groupMemberStyles, pinInputFieldStructureCss];
  static shadowRootOptions = { ...AcmeSemanticElement.shadowRootOptions, delegatesFocus: true };
  private readonly control = this.ownerDocument.createElement("input");
  private readonly ownerState = createAtom<{ owner?: PinInputOwner }>({});
  private get owner() {
    return this.ownerState.get().owner;
  }
  private readonly presentation = createAtom(() => this.ownerState.get().owner?.state.get());
  private readonly presentationUpdates = new StoreSelector(this, () => this.presentation);
  private readonly appearance = createInheritedAppearance(
    { size: { supported: ["small", "medium", "large"] as const, defaultValue: "medium" } },
    createAtom(() => ({ size: this.presentation.get()?.size })),
  );
  private readonly appearanceUpdates = new StoreSelector(this, () => this.appearance.effective);
  private readonly group = new GroupMemberController(this, {
    surface: () => this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined,
    appearance: this.appearance,
    emphasized: () => this.presentation.get()?.invalid ?? false,
  });
  @atomState() private position?: number;
  @property({ noAccessor: true, type: Number, converter: { fromAttribute: (value: string | null) => (value === null ? undefined : Number(value)) } }) get index(): number | undefined {
    return this.position;
  }
  set index(value: number | undefined) {
    if (value !== undefined && (!Number.isInteger(value) || value < 0)) throw new RangeError("index must be a nonnegative integer");
    this.position = value;
    this.owner?.synchronize();
    this.requestUpdate("index");
  }
  private readonly registration: PinFieldPart = { host: this, control: this.control, index: () => this.index };
  private readonly context = new ContextConsumer(this, {
    context: pinInputContext,
    subscribe: true,
    callback: (owner) => {
      if (this.owner !== owner) {
        this.owner?.unregister(this.registration);
        this.ownerState.set({ owner });
        owner.register(this.registration);
      }
      this.requestUpdate();
    },
  });
  constructor() {
    super();
    this.control.className = "native";
    this.control.setAttribute("part", "input");
    this.control.disabled = true;
  }
  protected get semanticTarget() {
    return this.control;
  }
  private labelNumbers?: { locale?: string; format: Intl.NumberFormat };
  protected get semanticDefaults() {
    const state = this.presentation.get();
    if (!this.labelNumbers || this.labelNumbers.locale !== state?.locale) this.labelNumbers = { locale: state?.locale, format: new Intl.NumberFormat(state?.locale, { useGrouping: false }) };
    const format = this.labelNumbers.format;
    return { label: state && this.index !== undefined ? state.labelTemplate.replaceAll("{index}", format.format(this.index + 1)).replaceAll("{count}", format.format(state.count)) : "Code character" };
  }
  focus(options?: FocusOptions) {
    this.control.focus(options);
  }
  disconnectedCallback() {
    this.owner?.unregister(this.registration);
    this.ownerState.set({});
    this.control.disabled = true;
    this.control.value = "";
    super.disconnectedCallback();
  }
  protected updated() {
    this.owner?.synchronize();
  }
  render() {
    const state = this.presentation.get(),
      disabled = !state || state.disabled || this.index === undefined || this.index >= state.count;
    return html`<form class="root" part="root" novalidate data-size=${this.appearance.effective.get().size} ?data-disabled=${disabled} ?data-invalid=${state?.invalid} ?data-filled=${this.index !== undefined && !!state?.value[this.index]} @submit=${(
      event: Event,
    ) => {
      event.preventDefault();
      event.stopPropagation();
      this.owner?.submit();
    }}>${this.control}</form>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pin-input-field": AcmePinInputField;
  }
}
