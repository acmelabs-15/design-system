import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { BreadcrumbBinding } from "../../shared/breadcrumbs-context";
import { breadcrumbStructureCss } from "../../generated/components/breadcrumb/breadcrumb-structure.styles";
/** One native link or current-page label in Breadcrumbs.
 * @slot - Complete page label.
 * @slot separator - Optional decorative separator in place of the chevron.
 * @csspart item - Native list item.
 * @csspart link - Native link or plain label.
 * @csspart separator - Decorative separator.
 */
export class AcmeBreadcrumb extends AcmeElement {
  static styles = [sharedCss, breadcrumbStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) href = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) target = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) rel = "";
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) current = false;
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) disabled = false;
  private readonly binding = new BreadcrumbBinding(this);
  focus(options?: FocusOptions) {
    if (!this.disabled) this.renderRoot.querySelector<HTMLElement>("a")?.focus(options);
  }
  render() {
    const members = this.binding.current?.members.get(),
      last = members?.at(-1) === this.binding.record;
    return html`<li part="item">${
      this.href
        ? html`<a part="link" href=${this.disabled ? nothing : this.href} role=${this.disabled ? "link" : nothing} target=${this.target || nothing} rel=${this.rel || nothing} aria-current=${this.current ? "page" : nothing} aria-disabled=${this.disabled ? "true" : nothing} @click=${(
            event: MouseEvent,
          ) => {
            if (this.disabled) event.preventDefault();
          }}><slot></slot></a>`
        : html`<span part="link" aria-current=${this.current ? "page" : nothing} aria-disabled=${this.disabled ? "true" : nothing}><slot></slot></span>`
    }<span part="separator" aria-hidden="true" ?hidden=${last || !members}><slot name="separator"><acme-chevron-right-icon size="16px"></acme-chevron-right-icon></slot></span></li>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-breadcrumb": AcmeBreadcrumb;
  }
}
