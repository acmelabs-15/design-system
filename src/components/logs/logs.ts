import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { logsCss } from "./logs.styles.js";

/** Vercel logs: striped 30px mono rows. Pass `rows` of {time, method, status, host, path}. */
@customElement("acme-logs")
export class AcmeLogs extends AcmeElement {
  static styles = [sharedCss, logsCss, css`:host{display:block}`];
  @property({ type: Array }) rows: { time: string; method: string; status: number; host: string; path: string }[] = [];
  render() {
    return html`<div class="logs-head"><span>Time</span><span>Method</span><span>Status</span><span>Host</span><span>Path</span></div><div class="logs" role="log">${this.rows.map((r) => html`<div class="logrow"><span class="t">${r.time}</span><span class="method">${r.method}</span><span class=${this.cls("http", { ok: r.status < 400, err: r.status >= 400 })}>${r.status}</span><span class="host">${r.host}</span><span class="path">${r.path}</span></div>`)}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-logs": AcmeLogs;
  }
}
