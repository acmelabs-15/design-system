import { css, html } from "lit";
import { customElement, property, queryAssignedElements } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import type { AcmeBreadcrumb } from "../breadcrumb/breadcrumb";
import { breadcrumbsCss } from "./breadcrumbs.styles";

/**
 * Breadcrumbs: where the page sits in the site's hierarchy, as a row of `acme-breadcrumb`
 * crumbs. `type="text"` (the default) is a labelled navigation list, 14px crumbs 6px apart with
 * a chevron after each but the last; `type="menu"` is a row of 12px chips 8px apart that scrolls
 * sideways on a narrow screen. The list hands its type to the crumbs.
 */
@customElement("acme-breadcrumbs")
export class AcmeBreadcrumbs extends AcmeElement {
  static styles = [
    sharedCss,
    breadcrumbsCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** `text`: a navigation list with chevrons between the crumbs; `menu`: a row of chips. */
  @property() type: "text" | "menu" = "text";
  @queryAssignedElements({ selector: "acme-breadcrumb" }) crumbs!: AcmeBreadcrumb[];

  private sync = () => {
    for (const c of this.crumbs) c.menu = this.type === "menu";
  };

  firstUpdated() {
    this.sync();
  }

  updated() {
    this.sync();
  }

  render() {
    const crumbs = html`<slot @slotchange=${this.sync}></slot>`;
    return this.type === "menu" ? html`<div class="list menu" part="list">${crumbs}</div>` : html`<nav aria-label="Breadcrumb"><ol class="list" part="list">${crumbs}</ol></nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-breadcrumbs": AcmeBreadcrumbs;
  }
}
