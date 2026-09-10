import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, paths, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { menuItemCss } from "./menu-item.styles";

let seq = 0;

/**
 * One row of a menu: a 36px `menuitem` (44 and 16px text below 601px) with the label in the
 * default slot, an icon in the `start` slot before it and one in the `end` slot at the end.
 * `href` renders an anchor (`external` opens it in a new tab); `variant="error"` reads red-900;
 * `disabled` reads gray-700 and takes no pointer; `locked` is a disabled row with a gray-700 lock
 * end place, for an action that needs more permissions. The menu marks the highlighted row
 * (`selected`, the `data-selected` state: gray-alpha-100, red-100 on an error row) as the keys
 * and the pointer move over the rows. A click, Enter or Space fires `acme-select`.
 */
@customElement("acme-menu-item")
export class AcmeMenuItem extends AcmeElement {
  static styles = [
    sharedCss,
    menuItemCss,
    css`
      :host {
        display: block;
      }
      .link {
        list-style: none;
      }
    `,
  ];
  @property() href = "";
  /** Opens the link in a new tab. */
  @property({ type: Boolean }) external = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** `error` colors the row red for a destructive action. */
  @property() variant: "default" | "error" = "default";
  @property({ type: Boolean, reflect: true }) locked = false;
  /** The highlighted row; the menu sets it. */
  @property({ type: Boolean }) selected = false;
  /** The text typeahead matches: the label's text unless set. */
  @property() value = "";
  @atomState() private hasStart = false;
  @atomState() private hasEnd = false;
  @query(".item") private root?: HTMLElement;
  private uid = `menu-item-${(++seq).toString(36)}`;

  connectedCallback() {
    super.connectedCallback();
    this.readSlots();
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.readSlots();
  }

  private readSlots() {
    this.hasStart ||= !!this.querySelector('[slot="start"]');
    this.hasEnd ||= !!this.querySelector('[slot="end"]');
  }

  private slotted = (name: "start" | "end") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    if (name === "start") this.hasStart = has;
    else this.hasEnd = has;
  };

  /** Whether the row takes no selection. */
  get inert() {
    return this.disabled || this.locked;
  }
  /** The text typeahead reads. */
  get label() {
    return this.value || (this.textContent ?? "").trim();
  }

  focus(options?: FocusOptions) {
    this.root?.focus(options);
  }

  /** Activates the row: a link is followed, then `acme-select` fires; nothing on an inert row. */
  activate() {
    if (this.inert) return;
    if (this.href) this.root?.click();
    else this.select();
  }

  private select() {
    if (this.inert) return;
    this.dispatchEvent(new CustomEvent("acme-select", { bubbles: true, composed: true }));
  }

  private onClick = () => {
    this.select();
  };

  render() {
    const inert = this.inert;
    const startSlot = html`<slot name="start" @slotchange=${this.slotted("start")}></slot>`;
    const endSlot = html`<slot name="end" @slotchange=${this.slotted("end")}>${this.locked ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--ds-gray-700)"><path d=${paths.lock}></path></svg>` : nothing}</slot>`;
    const inner = html`${this.hasStart ? html`<span class="start" aria-hidden="true">${startSlot}</span>` : startSlot}<span id=${this.uid}><slot></slot></span>${
      this.hasEnd || this.locked ? html`<span class="end" aria-hidden="true">${endSlot}</span>` : endSlot
    }`;
    const c = this.cls("item", { error: this.variant === "error" });
    if (this.href)
      return html`<li class="link" role="none"><a
          class=${c}
          role="menuitem"
          href=${this.href}
          target=${this.external ? "_blank" : nothing}
          rel=${this.external ? "noopener noreferrer" : nothing}
          tabindex="-1"
          style="--acme-icon-size:18px"
          aria-labelledby=${this.uid}
          aria-disabled=${inert ? "true" : nothing}
          data-selected=${this.selected ? "" : nothing}
          @click=${this.onClick}
          part="item"
          >${inner}</a
        ></li>`;
    return html`<li
      class=${c}
      role="menuitem"
      tabindex="-1"
      style="--acme-icon-size:18px"
      aria-labelledby=${this.uid}
      aria-disabled=${inert ? "true" : nothing}
      data-selected=${this.selected ? "" : nothing}
      @click=${this.onClick}
      part="item"
    >
      ${inner}
    </li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-item": AcmeMenuItem;
  }
}
