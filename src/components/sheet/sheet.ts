import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sharedCss } from "../../base.js";
import { Overlay } from "../../shared/overlay.js";
import { buttonCss } from "../button/button.styles.js";
import { sheetCss } from "./sheet.styles.js";

/** Geist Sheet: a side panel inset 12 from the edges, radius 16; the page stays readable. */
@customElement("acme-sheet")
export class AcmeSheet extends Overlay {
  static styles = [
    sharedCss,
    sheetCss,
    buttonCss,
    css`dialog{padding:0;border:0;background:transparent;max-width:none;max-height:none;overflow:visible;color:var(--text);inset:0;width:100vw;height:100dvh;margin:0} dialog::backdrop{background:var(--scrim)} .sheet{position:absolute} :host([static]) dialog{position:static;display:block;width:auto;height:auto} :host([static]) .sheet{position:static;width:100%;min-height:320px}`,
  ];
  @property() heading = "";
  @property() side: "right" | "left" = "right";
  @property({ type: Boolean, reflect: true }) static = false;
  render() {
    return html`<dialog @cancel=${this.onCancel} @click=${this.backdropClick} aria-labelledby="t" ?open=${this.static}>
      <div class=${this.cls("sheet", { left: this.side === "left" })} part="sheet">
        <div class="sheet-h"><h2 id="t">${this.heading}</h2><slot name="description"></slot></div>
        <div class="sheet-b"><slot></slot></div>
        <div class="sheet-f"><slot name="actions"><button class="btn" @click=${() => this.close()}>Close</button></slot></div>
      </div></dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-sheet": AcmeSheet;
  }
}
