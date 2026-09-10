import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { createStore, StoreSelector } from "../../shared/state";
import { entityContentCss } from "./entity-content.styles";

/**
 * Entity content: the text of an entity row, the title (14px semibold) over the description
 * (14px gray-900), each truncated to one line, with an optional avatar after the text (the
 * `avatar` slot). `fill` takes the free width of the row; without it the content is as wide as
 * its text. A title or description that is not plain text goes in the `title` or `description`
 * slot instead of the attribute.
 */
@customElement("acme-entity-content")
export class AcmeEntityContent extends AcmeElement {
  static styles = [
    sharedCss,
    entityContentCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The title line. */
  @property() title = "";
  /** The line under the title. */
  @property() description = "";
  /** Written to the content's `--width` variable. */
  @property() width = "";
  /** Takes the free width of the row. */
  @property({ type: Boolean, reflect: true }) fill = false;
  /** Which of the two text slots hold anything, one store per instance. */
  private slots = createStore({ title: false, description: false });
  /** The element lays out differently once it has any text at all, from either source: a plain-text
   *  property or a slotted node. Derived, so it recomputes only when one of those four changes. */
  private hasText = createStore(() => {
    const s = this.slots.get();
    return !!this.title || !!this.description || s.title || s.description;
  });
  private slotSelector = new StoreSelector(this, () => this.slots);
  private textSelector = new StoreSelector(this, () => this.hasText);

  connectedCallback() {
    super.connectedCallback();
    this.scan();
  }

  firstUpdated() {
    // The title lives in its own line; the host attribute would also raise the browser's own tooltip.
    if (this.hasAttribute("title")) {
      const t = this.title;
      this.removeAttribute("title");
      this.title = t;
    }
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.scan();
  }

  private scan() {
    this.slots.setState((s) => ({
      title: s.title || !!this.querySelector(':scope > [slot="title"]'),
      description: s.description || !!this.querySelector(':scope > [slot="description"]'),
    }));
  }

  private slotted = (name: "title" | "description") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    this.slots.setState((s) => ({ ...s, [name]: has }));
  };

  render() {
    // A plain-text title or description is its own line; a slotted node stands in its place.
    const title = this.title ? html`<p class="title">${this.title}</p>` : html`<slot name="title" @slotchange=${this.slotted("title")}></slot>`;
    const description = this.description ? html`<p class="description">${this.description}</p>` : html`<slot name="description" @slotchange=${this.slotted("description")}></slot>`;
    const hasText = this.hasText.get();
    return html`<div class=${this.cls("content", { fill: this.fill })} style=${this.width ? `--width:${this.width}` : nothing} part="content">${
      hasText ? html`<div class="text">${title}${description}</div>` : html`${title}${description}`
    }<slot name="avatar"></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-entity-content": AcmeEntityContent;
  }
}
