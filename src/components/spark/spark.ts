import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { statCss } from "../stat/stat.styles.js";

/** Sparkline: pass `points` (numbers) and a `tone`. */
@customElement("acme-spark")
export class AcmeSpark extends AcmeElement {
  static styles = [sharedCss, statCss, css`:host{display:block;padding-top:8px} svg{display:block;width:100%;height:40px;overflow:visible}`];
  @property({ type: Array }) points: number[] = [];
  @property() tone: "" | "down" | "flat" = "";
  render() {
    const p = this.points;
    if (p.length < 2) return html``;
    const min = Math.min(...p),
      max = Math.max(...p) || 1;
    const w = 100,
      h = 40;
    const pts = p.map((v, i) => [(i / (p.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 4) - 2] as const);
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
    return html`<span class=${this.cls("spark", { [this.tone]: !!this.tone })}><svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path class="area" d=${`${d}L100 ${h}L0 ${h}Z`}></path><path class="line" d=${d}></path></svg></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-spark": AcmeSpark;
  }
}
