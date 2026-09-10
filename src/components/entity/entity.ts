import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { entityCss } from "./entity.styles";

/** The row element: a list item (the default, for an acme-entity-list), a button for a clickable row, or a plain block. */
export type EntityTag = "li" | "button" | "div";

/**
 * Entity: one padded row of up to two columns. The left column holds the `left` slot (an avatar,
 * a checkbox) and the default slot (the content, usually an acme-entity-content); the right column
 * appears with the `right` slot (one or two controls) and sits at the row's end; a `footer` slot
 * follows the columns. `as="button"` makes the row a full-width button that inherits the list's
 * background, tints on hover and emits `click` on the host. The columns are the `left` and `right`
 * parts, for a consumer's own border or padding.
 */
@customElement("acme-entity")
export class AcmeEntity extends AcmeElement {
  static styles = [
    sharedCss,
    entityCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** `li` (default) · `button` for a clickable row · `div`. */
  @property({ reflect: true, useDefault: true }) as: EntityTag = "li";
  @atomState() private hasLeft = false;
  @atomState() private hasContent = false;
  @atomState() private hasRight = false;
  /** The row sits in an acme-entity-list: every row but the last carries the list's divider. */
  @atomState() private listed = false;
  @query(".entity") private root!: HTMLElement;
  /** Hover, focus and press land on the row as attributes; only the button row shows them. */
  private interaction = new Interaction(this, { disabled: () => this.as !== "button" });

  connectedCallback() {
    super.connectedCallback();
    this.listed = this.parentElement?.tagName === "ACME-ENTITY-LIST";
    this.scan();
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.scan();
  }

  updated() {
    this.interaction.attach(this.root);
  }

  /** Reads the slotted content off the light DOM (slotchange keeps it current afterwards). */
  private scan() {
    this.hasLeft ||= !!this.querySelector(':scope > [slot="left"]');
    this.hasRight ||= !!this.querySelector(':scope > [slot="right"]');
    this.hasContent ||= [...this.childNodes].some((n) => (n.nodeType === 1 && !(n as Element).hasAttribute("slot")) || (n.nodeType === 3 && (n.textContent ?? "").trim()));
  }

  private slotted = (name: "left" | "content" | "right") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    if (name === "left") this.hasLeft = has;
    else if (name === "right") this.hasRight = has;
    else this.hasContent = has;
  };

  render() {
    const leftSlot = html`<slot name="left" @slotchange=${this.slotted("left")}></slot>`;
    const contentSlot = html`<slot @slotchange=${this.slotted("content")}></slot>`;
    const rightSlot = html`<slot name="right" @slotchange=${this.slotted("right")}></slot>`;
    // A column renders only with content in it: the left one with the left slot or the content, the right one with the right slot.
    const left = this.hasLeft || this.hasContent ? html`<div class="left" part="left">${leftSlot}${contentSlot}</div>` : html`${leftSlot}${contentSlot}`;
    const right = this.hasRight ? html`<div class="right" part="right">${rightSlot}</div>` : rightSlot;
    const inner = html`<section class="row">${left}${right}</section><slot name="footer"></slot>`;
    const c = this.cls("entity", { clickable: this.as === "button" });
    if (this.as === "button") return html`<button class=${c} ?data-listed=${this.listed} part="entity">${inner}</button>`;
    if (this.as === "div") return html`<div class=${c} ?data-listed=${this.listed} part="entity">${inner}</div>`;
    return html`<li class=${c} ?data-listed=${this.listed} part="entity">${inner}</li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-entity": AcmeEntity;
  }
}
