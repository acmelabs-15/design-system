import { ContextConsumer } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { optionContext, registerOptionPart, type OptionOwner, type OptionPart } from "../../shared/option-context";
import { StoreSelector } from "../../shared/store-connection";
import { optionStructureCss } from "../../generated/components/option/option-structure.styles";
/** One owned value in a Select, ComboBox or Multi Select.
 * @slot - Noninteractive label content.
 * @slot start - Leading decorative content.
 * @slot end - Trailing decorative content.
 * @slot description - Supporting text.
 * @csspart root - Option surface.
 * @csspart indicator - Selected mark.
 * @csspart content - Label and description.
 */
export class AcmeOption extends AcmeElement {
  static styles = [sharedCss, optionStructureCss];
  @atomState() private choiceValue?: string;
  @property({ noAccessor: true, converter: optionalString }) get value(): string | undefined {
    return this.choiceValue;
  }
  set value(value: string | undefined) {
    if (value !== undefined && (typeof value !== "string" || !value)) {
      throw new TypeError("Option value must be a nonempty string or undefined");
    }
    const previous = this.value;
    this.choiceValue = value;
    this.requestUpdate("value", previous);
  }
  @atomState() private authoredLabel?: string;
  @property({ noAccessor: true, converter: optionalString }) get label(): string {
    return (this.authoredLabel ?? this.text).replace(/\s+/g, " ").trim();
  }
  set label(value: string | undefined) {
    if (value !== undefined && typeof value !== "string") {
      throw new TypeError("Option label must be a string or undefined");
    }
    const previous = this.label;
    this.authoredLabel = value;
    this.requestUpdate("label", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) disabled = false;
  /** Plain-text section label used by ranked ComboBox results. */
  @atomState() @property({ useDefault: true, noAccessor: true }) section = "";
  @atomState() private text = "";
  @atomState() private description = "";
  private readonly internals = this.attachInternals();
  private readonly binding = createAtom<{ owner?: OptionOwner }>({});
  private release?: () => void;
  private readonly partRecord: OptionPart = {
    host: this,
    value: () => this.value,
    text: () => this.label,
    section: () => this.section,
    disabled: () => this.disabled,
    currentOwner: () => this.binding.get().owner,
    reconnect: () => this.reconnectOwner(),
  };
  private readonly owner = new ContextConsumer(this, {
    context: optionContext,
    subscribe: true,
    callback: (owner) => {
      if (this.binding.get().owner === owner) {
        return;
      }
      this.release?.();
      this.binding.set({ owner });
      this.release = owner.register(this.partRecord);
      this.requestUpdate();
    },
  });
  private readonly projection = createAtom(() => {
    const owner = this.binding.get().owner;
    owner?.revision.get();
    return owner?.presentation(this.partRecord) ?? { selected: false, highlighted: false, disabled: true, hidden: false };
  });
  private readonly updates = new StoreSelector(this, () => this.projection);
  private observer?: MutationObserver;
  private read = () => {
    const content = Array.from(this.childNodes)
      .filter((node) => node.nodeType === 3 || (node.nodeType === 1 && !(node as Element).hasAttribute("slot")))
      .map((node) => node.textContent ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const description = Array.from(this.children)
      .filter((node) => node.getAttribute("slot") === "description")
      .map((node) => node.textContent ?? "")
      .join(" ")
      .trim();
    if (content !== this.text) {
      this.text = content;
    }
    if (description !== this.description) {
      this.description = description;
    }
  };
  constructor() {
    super();
    registerOptionPart(this.partRecord);
    this.addEventListener("pointerdown", (event) => {
      if (event.isPrimary && event.button === 0 && this.binding.get().owner) {
        event.preventDefault();
      }
    });
    this.addEventListener("click", (event) => {
      if (event.defaultPrevented || this.projection.get().disabled) {
        return;
      }
      this.binding.get().owner?.choose(this.partRecord);
    });
    this.addEventListener("pointermove", (event) => {
      if (event.pointerType === "mouse" && !event.buttons && !this.projection.get().disabled) {
        this.binding.get().owner?.highlight(this.partRecord);
      }
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.read();
    this.observer = new MutationObserver(this.read);
    this.observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["slot"] });
  }
  private reconnectOwner(): void {
    this.release?.();
    this.release = undefined;
    this.binding.set({});
    this.owner.hostDisconnected();
    this.owner.value = undefined;
    if (this.isConnected) {
      this.owner.hostConnected();
    }
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
    this.release?.();
    this.release = undefined;
    this.binding.set({});
    this.owner.value = undefined;
    super.disconnectedCallback();
  }
  protected updated() {
    const state = this.projection.get();
    this.internals.role = this.binding.get().owner ? "option" : null;
    this.internals.ariaLabel = this.label ?? this.text;
    this.internals.ariaDescription = this.description || null;
    this.internals.ariaSelected = String(state.selected);
    this.internals.ariaDisabled = String(state.disabled);
    this.toggleAttribute("data-option-hidden", state.hidden);
  }
  render() {
    const state = this.projection.get();
    return html`<div class="option" part="root" ?data-selected=${state.selected} ?data-highlighted=${state.highlighted} ?data-disabled=${state.disabled}><span aria-hidden="true"><slot name="start"></slot></span><span class="content" part="content"><slot @slotchange=${this.read}></slot><span class="description"><slot name="description" @slotchange=${this.read}></slot></span></span><span aria-hidden="true"><slot name="end"></slot></span><acme-check-icon class="indicator" part="indicator" size="16px" ?data-selected=${state.selected}></acme-check-icon></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-option": AcmeOption;
  }
}
