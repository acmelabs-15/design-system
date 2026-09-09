import { css, html, nothing } from "lit";
import { customElement, property, queryAssignedElements } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import type { AcmeTab } from "../tab/tab.js";
import type { AcmeTabPanel } from "../tab-panel/tab-panel.js";
import { tabsCss } from "./tabs.styles.js";

/** Geist Tabs: the 50px underline row, or `secondary` pills. Children: acme-tab with `value`, panels via `acme-tab-panel`. */
@customElement("acme-tabs")
export class AcmeTabs extends AcmeElement {
  static styles = [sharedCss, tabsCss, css`:host{display:block}`];
  @property() value = "";
  @property({ type: Boolean }) secondary = false;
  @property({ attribute: "aria-label" }) label = "";
  @queryAssignedElements({ selector: "acme-tab" }) tabs!: AcmeTab[];
  @queryAssignedElements({ selector: "acme-tab-panel", slot: "panels" }) panels!: AcmeTabPanel[];
  private sync() {
    const v = this.value || this.tabs[0]?.value || "";
    this.value = v;
    for (const t of this.tabs) t.selected = t.value === v;
    for (const p of this.panels) p.hidden = p.value !== v;
  }
  firstUpdated() {
    this.sync();
  }
  updated(ch: Map<string, unknown>) {
    if (ch.has("value")) this.sync();
  }
  private onKey(e: KeyboardEvent) {
    const list = this.tabs.filter((t) => !t.disabled);
    const i = list.findIndex((t) => t.value === this.value);
    if (e.key === "ArrowRight") this.select(list[(i + 1) % list.length]);
    else if (e.key === "ArrowLeft") this.select(list[(i - 1 + list.length) % list.length]);
    else return;
    e.preventDefault();
  }
  private select(t?: AcmeTab) {
    if (!t || t.disabled) return;
    this.value = t.value;
    t.focus();
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: t.value }, bubbles: true, composed: true }));
  }
  render() {
    return html`<div class=${this.cls("tabs", { secondary: this.secondary })} role="tablist" aria-label=${this.label || nothing} @keydown=${this.onKey} @acme-tab-click=${(e: CustomEvent) => this.select(e.detail as AcmeTab)} part="tablist"><slot @slotchange=${this.sync}></slot></div><slot name="panels"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-tabs": AcmeTabs;
  }
}
