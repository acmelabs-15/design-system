import { ContextConsumer } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { property } from "lit/decorators.js";
import { AcmeActionElement, type ButtonSize, type ButtonVariant } from "./action-element";
import { numberInputContext, registerNumberInputPart, type NumberInputOwner, type NumberInputPart } from "./number-input-context";
import { StoreSelector } from "./store-connection";
import { optionalString } from "./attributes";
/** An action owned by its nearest Number Input. */
export abstract class AcmeNumberInputAction extends AcmeActionElement {
  protected abstract get direction(): 1 | -1;
  private readonly ownerState = createAtom<{ owner?: NumberInputOwner }>({});
  private readonly registration: NumberInputPart = { host: this, currentOwner: () => this.owner, reconnect: () => this.reconnectOwner() };
  private readonly context = new ContextConsumer(this, {
    context: numberInputContext,
    subscribe: true,
    callback: (owner) => {
      if (this.owner !== owner) {
        this.owner?.release(this);
        this.owner?.unregister(this.registration);
        this.ownerState.set({ owner });
        owner.register(this.registration);
      }
      this.requestUpdate();
    },
  });
  private readonly ownerPresentation = createAtom(() => this.ownerState.get().owner?.state.get());
  private readonly updates = new StoreSelector(this, () => this.ownerPresentation);
  private get owner() {
    return this.ownerState?.get().owner;
  }
  protected get trackedPlaces() {
    return [...super.trackedPlaces, ""];
  }
  protected get iconOnly() {
    return true;
  }
  protected get fallbackAppearance() {
    const state = this.owner?.state.get();
    return { size: state?.size === "large" ? "small" : "tiny", variant: "tertiary" };
  }
  /** @default "tiny" */
  @property({ noAccessor: true, converter: optionalString }) get size(): ButtonSize {
    return super.size;
  }
  set size(value: ButtonSize | undefined) {
    super.size = value;
  }
  /** @default "tertiary" */
  @property({ noAccessor: true, converter: optionalString }) get variant(): ButtonVariant {
    return super.variant;
  }
  set variant(value: ButtonVariant | undefined) {
    super.variant = value;
  }
  private get unavailable() {
    const state = this.owner?.state.get();
    return !state || state.disabled || (this.direction === 1 ? !state.canIncrement : !state.canDecrement);
  }
  protected get submission() {
    return { ...super.submission, disabled: super.submission.disabled || this.unavailable };
  }
  protected get effectiveDisabled() {
    return super.effectiveDisabled || this.unavailable;
  }
  protected get semanticDefaults() {
    const state = this.owner?.state.get();
    return { ...super.semanticDefaults, label: this.direction === 1 ? (state?.incrementLabel ?? "Increase value") : (state?.decrementLabel ?? "Decrease value") };
  }
  protected synchronizeControl() {
    super.synchronizeControl();
    if (this.control?.localName === "button") {
      (this.control as HTMLButtonElement).disabled = this.effectiveDisabled;
    }
    if (this.effectiveDisabled) {
      this.owner?.release(this);
    }
  }
  protected activate(event: MouseEvent) {
    if (event.detail === 0) {
      this.owner?.step(this.direction);
    }
  }
  constructor() {
    super();
    registerNumberInputPart(this.registration);
    this.addEventListener("pointerdown", (event) => {
      if (!this.effectiveDisabled) {
        this.owner?.press(event, this.direction);
      }
    });
  }
  private reconnectOwner(): void {
    this.owner?.release(this);
    this.owner?.unregister(this.registration);
    this.ownerState.set({});
    this.context.hostDisconnected();
    this.context.value = undefined;
    if (this.isConnected) {
      this.context.hostConnected();
    }
    this.requestUpdate();
  }
  disconnectedCallback() {
    this.owner?.release(this);
    this.owner?.unregister(this.registration);
    this.ownerState.set({});
    this.context.value = undefined;
    super.disconnectedCallback();
  }
}
