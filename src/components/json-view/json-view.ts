import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { jsonViewCss } from "./json-view.styles.js";

/** Geist JSON View: a collapsible tree with syntax coloring, search highlighting and selectable text. */
@customElement("acme-json-view")
export class AcmeJsonView extends AcmeElement {
  static styles = [sharedCss, jsonViewCss, css`:host{display:block}`];
  @property({ type: Object }) data: unknown = {};
  @property({ type: Number, attribute: "expand-depth" }) expandDepth = 1;
  @property() highlight = "";
  private mark(s: string) {
    if (!this.highlight) return s;
    const i = s.toLowerCase().indexOf(this.highlight.toLowerCase());
    if (i < 0) return s;
    return html`${s.slice(0, i)}<mark>${s.slice(i, i + this.highlight.length)}</mark>${s.slice(i + this.highlight.length)}`;
  }
  private prim(v: unknown) {
    if (v === null) return html`<span class="z">null</span>`;
    if (typeof v === "string") return html`<span class="s">"${this.mark(v)}"</span>`;
    if (typeof v === "number") return html`<span class="n">${v}</span>`;
    if (typeof v === "boolean") return html`<span class="b">${v}</span>`;
    return html`${String(v)}`;
  }
  private node(key: string | null, v: unknown, depth: number, last: boolean): unknown {
    const comma = last ? "" : ",";
    const k = key !== null ? html`<span class="k">${this.mark(key)}:</span> ` : nothing;
    if (v !== null && typeof v === "object") {
      const arr = Array.isArray(v);
      const entries = arr ? (v as unknown[]).map((x, i) => [String(i), x] as const) : Object.entries(v as object);
      const [o, c] = arr ? ["[", "]"] : ["{", "}"];
      if (entries.length === 1 && typeof entries[0][1] !== "object" && !arr)
        return html`<span class="row">${k}${o} <span class="k">${entries[0][0]}:</span> ${this.prim(entries[0][1])} ${c}${comma}</span>`;
      return html`<details ?open=${depth < this.expandDepth}><summary>${k}<span class="collapsed">${o}<span class="ellipsis">…</span>${c}${comma}</span><span class="opened">${o}</span></summary><div class="kids">${entries.map(([ek, ev], i) => this.node(arr ? null : ek, ev, depth + 1, i === entries.length - 1))}</div><span class="row">${c}${comma}</span></details>`;
    }
    return html`<span class="row plain">${k}${this.prim(v)}${comma}</span>`;
  }
  render() {
    return html`<div class="json" role="tree" aria-label="JSON" part="json"><style>details:not([open]) > summary .opened{display:none}</style>${this.node(null, this.data, 0, true)}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-json-view": AcmeJsonView;
  }
}
