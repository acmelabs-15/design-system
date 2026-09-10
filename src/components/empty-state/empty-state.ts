import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { emptyStateCss } from "./empty-state.styles";

/**
 * Empty state: fills a space that has no content yet. A full-width bordered column, centred: an
 * optional icon (the `icon` slot, usually an `acme-icon-tile`), the text column with the title and
 * the description (each centred, at most 340px wide), then the default slot's children as they
 * come, one per row (a button, a link). `border="false"` keeps the border box and makes it
 * transparent; `secondary` swaps the background for background-200 and the title for the 14px
 * heading. Slots: default (the calls to action), `icon`, `title` and `description` (rich content
 * in place of the attributes).
 */
@customElement("acme-empty-state")
export class AcmeEmptyState extends AcmeElement {
  static styles = [sharedCss, emptyStateCss];
  /** The title line, Title Case. */
  @property() title = "";
  /** The sentence under the title. */
  @property() description = "";
  /** `border="false"` turns the border transparent. */
  @property({ converter: boolish }) border = true;
  /** The background-200 form with the 14px title, for a state inside a tinted panel. */
  @property({ type: Boolean }) secondary = false;
  @atomState() private hasIcon = false;
  @atomState() private hasTitle = false;
  @atomState() private hasDescription = false;

  connectedCallback() {
    super.connectedCallback();
    this.readSlots();
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.readSlots();
  }

  private readSlots() {
    this.hasIcon ||= !!this.querySelector('[slot="icon"]');
    this.hasTitle ||= !!this.querySelector('[slot="title"]');
    this.hasDescription ||= !!this.querySelector('[slot="description"]');
  }

  private slotted = (name: "icon" | "title" | "description") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    if (name === "icon") this.hasIcon = has;
    else if (name === "title") this.hasTitle = has;
    else this.hasDescription = has;
  };

  render() {
    const c = this.cls("empty-state", { "no-border": !this.border, secondary: this.secondary });
    const iconSlot = html`<slot name="icon" @slotchange=${this.slotted("icon")}></slot>`;
    const titleSlot = html`<slot name="title" @slotchange=${this.slotted("title")}>${this.title}</slot>`;
    const descriptionSlot = html`<slot name="description" @slotchange=${this.slotted("description")}>${this.description}</slot>`;
    return html`<div class=${c} part="empty-state">
      ${this.hasIcon ? html`<div class="icon">${iconSlot}</div>` : iconSlot}
      <div class="text">
        ${this.title || this.hasTitle ? html`<div class="title">${titleSlot}</div>` : titleSlot}
        ${this.description || this.hasDescription ? html`<div class="description">${descriptionSlot}</div>` : descriptionSlot}
      </div>
      <slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-empty-state": AcmeEmptyState;
  }
}
