import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { css, html, nothing } from "lit";
import { customElement, property, query, queryAssignedElements, state } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import type { AcmeSplitButtonItem } from "../split-button-item/split-button-item";
import { splitButtonCss } from "./split-button.styles";
import { splitButtonMenuCss } from "./split-button-menu.styles";
import "../button/button";

/** The menu keeps its box for this long after it starts to fade out. */
const EXIT_MS = 400;
/** Space between the buttons and the menu. */
const MENU_GAP = 8;

/**
 * Split button. The primary action (the default slot) joined to a chevron button that opens a
 * menu of `acme-split-button-item` rows (slot `items`): two composed `acme-button`s of one
 * variant (default or secondary) and size (32 / 36 / 40) with a hairline divider between them.
 * The menu opens under the split button, its start under the primary button
 * (`menu-alignment="bottom-start"`) or its end under the chevron (`bottom-end`), `menu-width`
 * wide; it fades out over 150ms. A click on the primary button fires `acme-click`; an item fires
 * `acme-select` and closes the menu. The chevron button is named by `menu-button-label`. Keys:
 * Down opens; in the menu Up and Down move, Home and End jump, Escape closes and returns focus,
 * Tab closes; a click outside closes.
 */
@customElement("acme-split-button")
export class AcmeSplitButton extends AcmeElement {
  static styles = [
    sharedCss,
    splitButtonCss,
    splitButtonMenuCss,
    css`
      :host {
        display: inline-flex;
        position: relative;
      }
      /* The menu rises to the top layer as a manual popover: the browser's popover box (fixed, inset, bordered, padded, scrolling, on a canvas fill) gives way to a bare wrapper the script places. */
      .popover {
        position: fixed;
        inset: auto;
        margin: 0;
        border: 0;
        padding: 0;
        width: max-content;
        height: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
      }
    `,
  ];
  /** `default` (the primary look; `primary` is accepted) or `secondary`. */
  @property() variant: "default" | "primary" | "secondary" = "default";
  @property() size: "small" | "medium" | "large" = "medium";
  /** The primary button's HTML type. */
  @property() type: "button" | "submit" | "reset" = "button";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** The chevron button's accessible name: a sentence naming the action set ("Select save method"). */
  @property({ attribute: "menu-button-label" }) menuButtonLabel = "More options";
  /** `bottom-start` under the primary button (default) or `bottom-end` under the chevron. */
  @property({ attribute: "menu-alignment" }) menuAlignment: "bottom-start" | "bottom-end" = "bottom-start";
  /** The menu's width in px. */
  @property({ type: Number, attribute: "menu-width" }) menuWidth = 150;
  @property({ type: Boolean, reflect: true }) open = false;
  /** The menu's presence: mounted and shown, fading out, or gone. */
  @state() private phase: "entered" | "exiting" | null = null;
  @query("acme-button.main") private main!: HTMLElement;
  @query("acme-button.trigger") private trigger!: HTMLElement;
  @query(".popover") private floating?: HTMLElement;
  @query(".menu") private menu?: HTMLElement;
  @queryAssignedElements({ slot: "items", selector: "acme-split-button-item" }) items!: AcmeSplitButtonItem[];
  private uid = `menu-${Math.random().toString(36).slice(2, 8)}`;
  private stopAutoUpdate?: () => void;
  private exitTimer?: ReturnType<typeof setTimeout>;
  // The chevron button's hover is a state of the split button's own rules, kept on the composed button's host.
  private triggerInteraction = new Interaction(this, { disabled: () => this.disabled });

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.onOutside);
    this.addEventListener("acme-select", this.onSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.onOutside);
    this.removeEventListener("acme-select", this.onSelect);
    this.stopAutoUpdate?.();
    clearTimeout(this.exitTimer);
  }

  private onOutside = (e: Event) => {
    if (this.open && !e.composedPath().includes(this)) this.open = false;
  };

  private onSelect = () => {
    this.open = false;
    this.trigger?.focus();
  };

  private enabledItems() {
    return this.items.filter((i) => !i.disabled);
  }

  private onTriggerKey = (e: KeyboardEvent) => {
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !this.open) {
      this.open = true;
      e.preventDefault();
    }
  };

  private onMenuKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.open = false;
      this.trigger?.focus();
      e.preventDefault();
      return;
    }
    if (e.key === "Tab") {
      this.open = false;
      return;
    }
    const items = this.enabledItems();
    if (!items.length) return;
    const i = items.findIndex((x) => x.matches(":focus-within"));
    if (e.key === "ArrowDown") items[(i + 1) % items.length].focus();
    else if (e.key === "ArrowUp") items[(i - 1 + items.length) % items.length].focus();
    else if (e.key === "Home") items[0].focus();
    else if (e.key === "End") items[items.length - 1].focus();
    else return;
    e.preventDefault();
  };

  /** Anchors the menu under the chevron button; the start offset then lines it up under the primary button. */
  private place = async () => {
    const popover = this.floating;
    const menu = this.menu;
    if (!popover || !menu || !this.trigger) return;
    // The popover is in the top layer, whose containing block is the viewport: viewport coordinates place it.
    const { x, y } = await computePosition(this.trigger, popover, {
      placement: this.menuAlignment,
      strategy: "fixed",
      middleware: [offset(MENU_GAP), flip(), shift({ padding: 8 })],
    });
    Object.assign(popover.style, { left: `${x}px`, top: `${y}px` });
    const mainWidth = this.main?.getBoundingClientRect().width ?? 0;
    menu.style.setProperty("--split-button-menu-offset", this.menuAlignment === "bottom-start" ? `${-mainWidth}px` : "0");
  };

  updated(ch: Map<string, unknown>) {
    this.triggerInteraction.attach(this.trigger);
    if (ch.has("open")) {
      clearTimeout(this.exitTimer);
      if (this.open) {
        this.phase = "entered";
      } else if (this.phase === "entered") {
        this.phase = "exiting";
        this.exitTimer = setTimeout(() => {
          this.phase = null;
        }, EXIT_MS);
      }
    }
    if (ch.has("phase")) {
      this.stopAutoUpdate?.();
      this.stopAutoUpdate = undefined;
      if (this.phase === "entered" && this.floating) {
        // The popover joins the top layer once, on entry; the fade-out keeps it shown until the box goes.
        const floating = this.floating;
        if (typeof floating.showPopover === "function" && !floating.matches(":popover-open")) floating.showPopover();
        this.stopAutoUpdate = autoUpdate(this.trigger, this.floating, this.place);
        this.enabledItems()[0]?.focus();
      }
    }
  }

  render() {
    const variant = this.variant === "primary" ? "default" : this.variant;
    const secondary = variant === "secondary";
    const c = this.cls("split", { sm: this.size === "small", lg: this.size === "large", secondary });
    const style = `--divider-color:${secondary ? "var(--ds-gray-300)" : "var(--ds-gray-alpha-900)"}`;
    return html`<div class=${c} style=${style} part="split">
        <acme-button class="main" variant=${variant} size=${this.size} type=${this.type} ?disabled=${this.disabled} @click=${() => this.dispatchEvent(new CustomEvent("acme-click", { bubbles: true, composed: true }))} part="button"><slot></slot></acme-button>
        <acme-button
          class="trigger"
          variant=${variant}
          size=${this.size}
          type="button"
          ?disabled=${this.disabled}
          aria-label=${this.menuButtonLabel}
          aria-haspopup="menu"
          aria-expanded=${String(this.open)}
          aria-controls=${this.uid}
          data-is-open=${String(this.open)}
          @click=${() => {
            this.open = !this.open;
          }}
          @keydown=${this.onTriggerKey}
          part="menu-button"
          ><span class="inner">${glyphSized("chev-d")}</span></acme-button
        >
      </div>
      ${
        this.phase
          ? html`<div class="popover" popover="manual">
              <div class=${this.cls("menu", { end: this.menuAlignment === "bottom-end" })} data-phase=${this.phase} part="menu">
                <ul class="list" role="menu" tabindex="-1" id=${this.uid} aria-label=${this.menuButtonLabel} style=${`width:${this.menuWidth}px`} @keydown=${this.onMenuKey}>
                  <slot name="items"></slot>
                </ul>
              </div>
            </div>`
          : nothing
      }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-split-button": AcmeSplitButton;
  }
}
