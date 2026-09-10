import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { breadcrumbCss } from "./breadcrumb.styles";
import "../tooltip/tooltip";

/**
 * One crumb of an `acme-breadcrumbs`. In a text list it is a 14px gray-900 list item with a
 * 16px chevron after it (hidden on the last crumb): gray-1000 when `active` (the current page)
 * or hovered, gray-700 with a not-allowed cursor when `disabled`. In a menu it is a chip: a 12px
 * bordered button on the background-200 fill that darkens on hover, white with a gray-600 border
 * when active, a gray-alpha-200 fill and a disabled button when disabled; a chip whose text is cut
 * off shows the full text in a tooltip on hover (desktop only). `href` makes the crumb a link:
 * an anchor around the text in a list, the chip itself in a menu.
 */
@customElement("acme-breadcrumb")
export class AcmeBreadcrumb extends AcmeElement {
  /** Focus on the host lands on the link or the chip. */
  static shadowRootOptions = { ...AcmeElement.shadowRootOptions, delegatesFocus: true };
  static styles = [
    sharedCss,
    breadcrumbCss,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];
  /** The current page. */
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Renders the crumb as a link: an anchor around the text in a list, the chip itself in a menu. */
  @property() href = "";
  /** The link's target and rel. */
  @property() target = "";
  @property() rel = "";
  /** The chip form; set by the list for `type="menu"`. */
  @property({ type: Boolean, reflect: true }) menu = false;
  /** A menu chip whose text is cut off: measured once, when the chip first renders, as the reference does. */
  @state() private truncated = false;
  private measured = false;
  @query(".item") private item?: HTMLElement;
  @query(".chip") private chip?: HTMLElement;
  @query(".link") private link?: HTMLElement;
  /** The list item's hover (a disabled crumb keeps it, like a disabled chip's; the reference keys both off the pointer alone). */
  private itemInteraction = new Interaction(this, { disabled: () => false });
  /** The link's or the chip's focus ring. */
  private controlInteraction = new Interaction(this, { disabled: () => false });

  updated() {
    this.itemInteraction.attach(this.menu ? null : this.item);
    this.controlInteraction.attach(this.menu ? this.chip : this.link);
    if (this.menu && this.chip && !this.measured) {
      this.measured = true;
      this.truncated = this.chip.offsetWidth < this.chip.scrollWidth;
    }
  }

  render() {
    const c = this.cls("item", { menu: this.menu, active: this.active, disabled: this.disabled });
    if (this.menu) {
      const chip = this.href
        ? html`<a class="chip" href=${this.href} target=${this.target || nothing} rel=${this.rel || nothing} part="chip"><slot></slot></a>`
        : html`<button class="chip" type="button" ?disabled=${this.disabled} part="chip"><slot></slot></button>`;
      return html`<span class=${c} part="item"
        ><div>${this.truncated ? html`<acme-tooltip text=${this.textContent?.trim() ?? ""} desktop-only>${chip}</acme-tooltip>` : chip}</div></span
      >`;
    }
    const text = this.href ? html`<a class="link" href=${this.href} target=${this.target || nothing} rel=${this.rel || nothing}><slot></slot></a>` : html`<slot></slot>`;
    return html`<li class=${c} aria-current=${this.active ? "true" : nothing} part="item">${text} ${glyphSized("chev", 16)}</li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-breadcrumb": AcmeBreadcrumb;
  }
}
