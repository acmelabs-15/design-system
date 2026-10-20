import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSizedTypographyElement } from "../../shared/typography-element";
import { atomState } from "../../shared/atom-state";
import { tokenLines } from "../../shared/highlight";
import { codeStructureCss } from "../../generated/components/code/code-structure.styles";
import { codeCss } from "../../generated/components/code/code.styles";

/** Inline code rendered from plain source text with optional syntax highlighting.
 * @slot - Plain source text; markup is not executed by the renderer.
 * @csspart root - The native code element.
 */
export class AcmeCode extends AcmeSizedTypographyElement {
  static styles = [...AcmeSizedTypographyElement.styles, codeCss, codeStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) syntax = "";
  private observer?: MutationObserver;
  connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver(() => this.requestUpdate());
    this.observer.observe(this, { subtree: true, childList: true, characterData: true });
    this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.observer = undefined;
  }
  render() {
    const text = this.textContent ?? "";
    const lines = this.syntax ? tokenLines(text, this.syntax) : [text];
    return html`<code class="code" part="root">${lines.map((line, index) => html`${index ? "\n" : ""}${line}`)}</code>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-code": AcmeCode;
  }
}
