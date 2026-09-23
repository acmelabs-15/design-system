import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Places } from "../../shared/places";
import { CommandBinding } from "../../shared/command-context";
import { commandItemStructureCss } from "../../generated/components/command-item/command-item-structure.styles";
/** One named action in a Command Menu.
 * @slot - Visible label; label supplies the fallback text.
 * @slot start - Decorative leading content.
 * @slot end - Supporting content, such as a keyboard hint.
 * @slot description - Supporting description.
 * @csspart item - The action row.
 * @csspart label - Label content.
 * @csspart description - Supporting text.
 * @csspart start - Leading content.
 * @csspart end - Trailing content.
 */
export class AcmeCommandItem extends AcmeElement {
  static styles = [sharedCss, commandItemStructureCss];
  private readonly places = new Places(this, { places: ["start", "end", "description"] });
  @atomState() private key = "";
  /** Required stable identifier. @default "" */
  @property({ noAccessor: true, useDefault: true }) get value() {
    return this.key;
  }
  set value(value: string) {
    if (typeof value !== "string") throw new TypeError("Command value must be a string");
    const previous = this.key;
    this.key = value;
    this.requestUpdate("value", previous);
  }
  @atomState() private authoredLabel = "";
  @atomState() private contentLabel = "";
  /** Explicit search and accessible label; omission uses the default content. @default "" */
  @property({ noAccessor: true, useDefault: true }) get label() {
    return this.authoredLabel || this.contentLabel;
  }
  set label(value: string) {
    if (typeof value !== "string") throw new TypeError("Command label must be a string");
    const previous = this.authoredLabel;
    this.authoredLabel = value;
    this.requestUpdate("label", previous);
  }
  @atomState() private aliases: readonly string[] = Object.freeze([]);
  /** Additional search aliases. @default [] */
  @property({ noAccessor: true, attribute: false }) get keywords(): readonly string[] {
    return this.aliases;
  }
  set keywords(value: readonly string[] | undefined) {
    if (value !== undefined && (!Array.isArray(value) || value.some((word) => typeof word !== "string"))) throw new TypeError("Command keywords require strings");
    const previous = this.aliases;
    this.aliases = Object.freeze([...(value ?? [])]);
    this.requestUpdate("keywords", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  private readonly binding = new CommandBinding(this, { kind: "item", value: () => this.value, label: () => this.label, keywords: () => this.keywords, disabled: () => this.disabled });
  private readonly internals = this.attachInternals();
  private observer?: MutationObserver;
  private read = () => {
    const text = [...this.childNodes]
      .filter((node) => node.nodeType === 3 || (node.nodeType === 1 && !(node as Element).getAttribute("slot")))
      .map((node) => node.textContent ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text !== this.contentLabel) this.contentLabel = text;
  };
  connectedCallback() {
    super.connectedCallback();
    this.read();
    this.observer = new MutationObserver(this.read);
    this.observer.observe(this, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["slot"] });
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
    super.disconnectedCallback();
  }
  protected willUpdate() {
    this.read();
  }
  protected updated() {
    const state = this.binding.current?.state.get();
    this.internals.role = "option";
    this.internals.ariaLabel = this.label;
    this.internals.ariaSelected = String(state?.active === this.binding.record);
    this.internals.ariaDisabled = String(!this.binding.current?.canSelect(this.binding.record));
    this.internals.ariaDescribedByElements = ["description", "end"].flatMap((name) => [
      ...(this.renderRoot.querySelector<HTMLSlotElement>(`slot[name=${name}]`)?.assignedElements({ flatten: true }) ?? []),
    ]);
  }
  private interactive(event: Event) {
    return event.composedPath().some((node) => (node as Node).nodeType === 1 && (node as Element).matches("button,a[href],input,select,textarea,[contenteditable=true]"));
  }
  click() {
    this.renderRoot?.querySelector<HTMLElement>("[part=item]")?.click();
  }
  private activate = (event: MouseEvent) => {
    if (!event.defaultPrevented && !this.disabled && !this.interactive(event)) this.binding.current?.select(this.binding.record);
  };
  render() {
    const active = this.binding.current?.state.get().active === this.binding.record;
    return html`<div part="item" ?data-active=${active} ?data-disabled=${this.disabled} @pointermove=${() => {
      if (!this.disabled) this.binding.current?.highlight(this.binding.record);
    }} @pointerdown=${(event: PointerEvent) => {
      if (event.button === 0 && !this.interactive(event)) event.preventDefault();
    }} @click=${this.activate}><span part="start" aria-hidden="true" ?hidden=${!this.places.has("start")}><slot name="start"></slot></span><span class="text"><span part="label"><slot>${this.authoredLabel}</slot></span><span part="description" ?hidden=${!this.places.has("description")}><slot name="description"></slot></span></span><span part="end" ?hidden=${!this.places.has("end")}><slot name="end"></slot></span></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-command-item": AcmeCommandItem;
  }
}
