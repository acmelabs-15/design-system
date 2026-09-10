import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import type { AcmeMenu, MenuCloseKind } from "../menu/menu";
import { dotsMenuCss } from "./dots-menu.styles";
import "../menu/menu";
import "../menu-button/menu-button";

/** The three dots on a 16-box: across, or stacked. */
const DOTS = {
  horizontal: "M4 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m5.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3",
  vertical: "M8 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m-1.5 4a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0",
};

/**
 * An overflow menu: a small square tertiary `acme-menu-button` (named "Menu", or `label`) holding
 * three dots, `icon-size` wide (18), that opens an `acme-menu` at its bottom end, as wide as its
 * rows and at least 200px, of the `acme-menu-item` children (sections and dividers too). The open
 * trigger reads gray-alpha-100; `disabled` fades it and reads the dots gray under a not-allowed
 * cursor; `horizontal="false"` stacks the dots. `close-on-select="false"` keeps the menu open after
 * a row; `height` caps the list in px. `open` follows the menu, and `show()` and `close()` drive it.
 * Fires `acme-open` and `acme-close` (`detail.kind`) as the menu does. The trigger is the `trigger`
 * part; the menu's `floating` and `menu` parts are exported.
 */
@customElement("acme-dots-menu")
export class AcmeDotsMenu extends AcmeElement {
  static styles = [
    sharedCss,
    dotsMenuCss,
    css`
      :host {
        display: inline-block;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** The dots icon's width and height in px. */
  @property({ type: Number, attribute: "icon-size" }) iconSize = 18;
  /** The dots run across; `horizontal="false"` stacks them. */
  @property({ converter: boolish }) horizontal = true;
  /** Whether a selected row closes the menu (`close-on-select="false"` keeps it open). */
  @property({ attribute: "close-on-select", converter: boolish }) closeOnSelect = true;
  /** The list's greatest height in px; past it the rows scroll. */
  @property({ type: Number }) height = 0;
  /** The trigger's accessible name. */
  @property() label = "Menu";
  /** Whether the menu is open: follows the menu, and opens or closes it when set. */
  @property({ type: Boolean, reflect: true }) open = false;
  @query("acme-menu") private menu?: AcmeMenu;

  /** Opens the menu; by the keys, the first row is highlighted. */
  show(kind: MenuCloseKind = "pointer") {
    this.menu?.show(kind);
  }

  /** Closes the menu; closed by the keys, focus returns to the trigger. */
  close(kind: MenuCloseKind = "pointer") {
    this.menu?.close(kind);
  }

  /** The menu's own events stop at this shadow root: they fire again from the host, and `open` follows. */
  private relay = (e: Event) => {
    const menu = e.target as AcmeMenu;
    this.open = menu.open;
    this.dispatchEvent(new CustomEvent(e.type, { bubbles: true, detail: (e as CustomEvent).detail }));
  };

  /** Escape asks first: a listener on the host that cancels keeps the menu open. */
  private relayEscape = (e: Event) => {
    const out = new CustomEvent("acme-escape", { bubbles: true, cancelable: true });
    this.dispatchEvent(out);
    if (out.defaultPrevented) e.preventDefault();
  };

  updated(ch: Map<string, unknown>) {
    const menu = this.menu;
    if (ch.has("open") && menu && menu.open !== this.open) {
      if (this.open) menu.show();
      else menu.close();
    }
  }

  render() {
    const size = String(this.iconSize);
    return html`<acme-menu
      position="bottom-end"
      width="auto"
      min-width="200"
      close-on-select=${String(this.closeOnSelect)}
      height=${this.height}
      exportparts="floating,menu"
      @acme-open=${this.relay}
      @acme-close=${this.relay}
      @acme-escape=${this.relayEscape}
    >
      <acme-menu-button slot="trigger" variant="tertiary" shape="square" size="small" ?disabled=${this.disabled} aria-label=${this.label} part="trigger">
        <span class="wrap"><span class="icon"><svg viewBox="0 0 16 16" width=${size} height=${size}><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d=${this.horizontal ? DOTS.horizontal : DOTS.vertical}></path></svg></span></span>
      </acme-menu-button>
      <slot slot="items"></slot>
    </acme-menu>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-dots-menu": AcmeDotsMenu;
  }
}
