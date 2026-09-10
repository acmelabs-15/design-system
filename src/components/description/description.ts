import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, paths, sharedCss } from "../../base";
import "../tooltip/tooltip";
import { descriptionCss } from "./description.styles";

/**
 * Description: a definition list of one Title Case key (dt, 14px gray-900, capitalized) and its
 * value (dd, 14/16 500 gray-1000). `tooltip` adds a 14px info icon after the key, wrapped in a
 * tooltip that opens on hover or keyboard focus; `right` aligns the text right; `ellipsis`
 * truncates both lines.
 */
@customElement("acme-description")
export class AcmeDescription extends AcmeElement {
  static styles = [sharedCss, descriptionCss];
  /** The Title Case key. */
  @property() title = "";
  /** The value; the default slot carries richer content. */
  @property() content = "";
  @property({ type: Boolean }) right = false;
  @property({ type: Boolean }) ellipsis = false;
  /** One sentence shown on the info icon after the key. */
  @property() tooltip = "";

  firstUpdated() {
    // The key lives in the dt; the host attribute would also raise the browser's own tooltip.
    if (this.hasAttribute("title")) {
      const t = this.title;
      this.removeAttribute("title");
      this.title = t;
    }
  }

  render() {
    // The tooltip element is the trigger inside the info wrapper; the icon takes keyboard focus.
    const info = this.tooltip
      ? html`<span class="info"><acme-tooltip class="trigger" text=${this.tooltip}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" role="img" tabindex="0" aria-label=${this.tooltip}><path d=${paths.info}></path></svg></acme-tooltip></span>`
      : nothing;
    return html`<dl class=${this.cls("description", { right: this.right, ellipsis: this.ellipsis })} part="description">
      <dt class="title">${this.title}${info}</dt>
      <dd class="content">${this.content}<slot></slot></dd>
    </dl>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-description": AcmeDescription;
  }
}
