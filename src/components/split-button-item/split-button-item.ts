import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { splitButtonItemCss } from "./split-button-item.styles";

/**
 * One row of a split button's menu: the title (Title Case, Verb + Noun) in the default slot,
 * an 18px `icon` before it, and a `description` below in gray-900. A menu item row that
 * highlights on hover and keyboard focus; Enter, Space or a click select it. Fires `acme-select`.
 */
@customElement("acme-split-button-item")
export class AcmeSplitButtonItem extends AcmeElement {
  static styles = [
    sharedCss,
    splitButtonItemCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  @property() description = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @query(".item") private item?: HTMLElement;

  focus(options?: FocusOptions) {
    this.item?.focus(options);
  }

  private select = () => {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent("acme-select", { bubbles: true, composed: true }));
  };

  private onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.select();
    }
  };

  private mark = (name: "data-highlighted" | "data-selected", on: boolean) => () => {
    if (on && !this.disabled) this.item?.setAttribute(name, "");
    else this.item?.removeAttribute(name);
  };

  render() {
    return html`<li
      class="item"
      role="menuitem"
      tabindex="-1"
      style="--acme-icon-size:18px;height:fit-content;padding:8px"
      aria-disabled=${this.disabled ? "true" : nothing}
      @click=${this.select}
      @keydown=${this.onKey}
      @pointerenter=${this.mark("data-highlighted", true)}
      @pointerleave=${this.mark("data-highlighted", false)}
      @focus=${this.mark("data-selected", true)}
      @blur=${this.mark("data-selected", false)}
      part="item"
    >
      <span class="body">
        <span class="row"><slot name="icon"></slot><span class="title"><slot></slot></span></span>
        ${this.description ? html`<span class="desc">${this.description}</span>` : nothing}
      </span>
    </li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-split-button-item": AcmeSplitButtonItem;
  }
}
