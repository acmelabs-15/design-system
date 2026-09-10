import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
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
  @state() private hasTitle = false;
  @state() private hasDescription = false;

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
    this.hasTitle ||= !!this.querySelector(':scope > [slot="title"]');
    this.hasDescription ||= !!this.querySelector(':scope > [slot="description"]');
  }

  private slotted = (name: "title" | "description") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    if (name === "title") this.hasTitle = has;
    else this.hasDescription = has;
  };

  render() {
    // A plain-text title or description is its own line; a slotted node stands in its place.
    const title = this.title ? html`<p class="title">${this.title}</p>` : html`<slot name="title" @slotchange=${this.slotted("title")}></slot>`;
    const description = this.description ? html`<p class="description">${this.description}</p>` : html`<slot name="description" @slotchange=${this.slotted("description")}></slot>`;
    const hasText = !!this.title || !!this.description || this.hasTitle || this.hasDescription;
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
