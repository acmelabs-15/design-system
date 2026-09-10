import { css, html, nothing } from "lit";
import { customElement, property, query, queryAssignedElements } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { RovingTabindex } from "../../shared/roving-tabindex";
import type { AcmeTab } from "../tab/tab";
import type { AcmeTabPanel } from "../tab-panel/tab-panel";
import { tabsCss } from "./tabs.styles";

/**
 * Tabs. A row of `acme-tab` under an inset hairline (`variant="secondary"`: rounded pills,
 * no hairline), scrolling sideways without a scrollbar. The tab whose `value` matches is
 * selected; without a value the first tab is. Focusing a tab selects it; Left and Right move to
 * the neighbouring tab and select it, stopping at a disabled one; the focus ring stays hidden
 * after a key move until a tab blurs. `disabled` disables every tab. Fires `acme-change`
 * (`detail.value`). `acme-tab-panel` elements in the `panels` slot show for their value.
 */
@customElement("acme-tabs")
export class AcmeTabs extends AcmeElement {
  static styles = [
    sharedCss,
    tabsCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The selected tab's value. */
  @property() value = "";
  @property() variant: "primary" | "secondary" = "primary";
  /** Disables every tab. */
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: "aria-label" }) label = "";
  @atomState() private showFocusRing = true;
  @query(".tabs") private row?: HTMLElement;
  @queryAssignedElements({ selector: "acme-tab" }) tabs!: AcmeTab[];
  @queryAssignedElements({ selector: "acme-tab-panel", slot: "panels" }) panels!: AcmeTabPanel[];
  private roving = new RovingTabindex(this, {
    items: () => this.tabs,
    current: () => this.tabs.findIndex((t) => t.value === this.value),
    disabled: (t) => (t as AcmeTab).off,
    onMove: (t) => {
      this.showFocusRing = false;
      this.select(t as AcmeTab);
    },
  });

  // Key, focus and select events come up from the tab buttons (composed) and are handled on the host.
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this.onKey);
    this.addEventListener("focusin", this.onFocusIn);
    this.addEventListener("focusout", this.onFocusOut);
    this.addEventListener("acme-tab-select", this.onTabSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.onKey);
    this.removeEventListener("focusin", this.onFocusIn);
    this.removeEventListener("focusout", this.onFocusOut);
    this.removeEventListener("acme-tab-select", this.onTabSelect);
  }

  private onTabSelect = (e: Event) => this.select((e as CustomEvent).detail as AcmeTab);

  private sync() {
    const v = this.value || this.tabs[0]?.value || "";
    this.value = v;
    for (const t of this.tabs) {
      t.selected = t.value === v;
      t.groupDisabled = this.disabled;
      t.secondary = this.variant === "secondary";
      t.showFocusRing = this.showFocusRing;
    }
    for (const p of this.panels) p.hidden = p.value !== v;
  }

  firstUpdated() {
    this.sync();
  }

  updated() {
    this.sync();
  }

  private onKey = (e: KeyboardEvent) => {
    if (!this.disabled) this.roving.handleKey(e);
  };

  private select(t?: AcmeTab) {
    if (!t || t.off) return;
    const changed = this.value !== t.value;
    this.value = t.value;
    if (changed) this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: t.value }, bubbles: true, composed: true }));
  }

  // A keyboard-focused tab lifts the row's clipping so its ring shows whole.
  private onFocusIn = (e: FocusEvent) => {
    const target = e.composedPath()[0] as Element;
    if (target.matches?.(":focus-visible")) this.row?.setAttribute("data-focus-within", "true");
  };
  private onFocusOut = () => {
    this.row?.removeAttribute("data-focus-within");
    this.showFocusRing = true;
  };

  render() {
    return html`<div
        class=${this.cls("tabs", { secondary: this.variant === "secondary" })}
        role="tablist"
        aria-orientation="horizontal"
        data-variant=${this.variant}
        aria-label=${this.label || nothing}
        part="tablist"
      >
        <slot @slotchange=${this.sync}></slot>
      </div>
      <slot name="panels"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tabs": AcmeTabs;
  }
}
