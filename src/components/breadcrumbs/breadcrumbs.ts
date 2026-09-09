import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { breadcrumbsCss } from "./breadcrumbs.styles.js";

/** Geist Breadcrumbs: text type, or `menu` type chips. Children: acme-breadcrumb or plain a/span. */
@customElement("acme-breadcrumbs")
export class AcmeBreadcrumbs extends AcmeElement {
  static styles = [
    sharedCss,
    breadcrumbsCss,
    css`:host{display:block} ::slotted(a){color:var(--text-2);text-decoration:none} ::slotted(a:hover){color:var(--text)} ::slotted([aria-current]){color:var(--text)} ::slotted(.disabled){color:var(--ds-gray-700)} :host([variant="menu"]) ::slotted(a),:host([variant="menu"]) ::slotted(span){display:inline-flex;align-items:center;height:22px;padding:2px 6px;border-radius:4px;background:var(--surface-2);border:1px solid var(--ds-gray-alpha-200);font-size:12px;line-height:16px}`,
  ];
  @property({ reflect: true }) variant: "" | "menu" = "";
  @property() separator = "/";
  firstUpdated() {
    this.inject();
  }
  private inject() {
    const kids = Array.from(this.children).filter((k) => !k.classList.contains("sep"));
    kids.forEach((k, i) => {
      if (i < kids.length - 1 && !k.nextElementSibling?.classList.contains("sep")) {
        const s = document.createElement("span");
        s.className = "sep";
        s.textContent = this.separator;
        s.setAttribute("aria-hidden", "true");
        k.after(s);
      }
    });
  }
  render() {
    return html`<nav class=${this.cls("breadcrumbs", { menu: this.variant === "menu" })} aria-label="Breadcrumb" part="nav"><slot @slotchange=${this.inject}></slot></nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-breadcrumbs": AcmeBreadcrumbs;
  }
}
