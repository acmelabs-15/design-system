import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { labelCss } from "./label.styles";

/**
 * Label: the text above a form control. The label element carries `for` and the modifier
 * classes; the text sits in a block of its own, 13px gray-900 with an 8px bottom margin,
 * capitalized unless `bypass-casing`. A click focuses the element `for` names, in the same
 * root as the label.
 */
@customElement("acme-label")
export class AcmeLabel extends AcmeElement {
  static styles = [
    sharedCss,
    labelCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The label text; content in the default slot follows it. */
  @property() value = "";
  /** Keeps the text as written. */
  @property({ type: Boolean, attribute: "bypass-casing" }) bypassCasing = false;
  /** The label of an input that follows. */
  @property({ type: Boolean, attribute: "with-input" }) withInput = false;
  /** The id of the control the label names. */
  @property() for = "";
  private focusTarget() {
    if (!this.for) return;
    const root = this.getRootNode() as Document | ShadowRoot;
    const t = root.querySelector?.(`#${CSS.escape(this.for)}`) as HTMLElement | null;
    t?.focus?.();
  }
  render() {
    return html`<label class=${this.cls("label", { plain: this.bypassCasing, "with-input": this.withInput })} for=${this.for || nothing} @click=${this.focusTarget} part="label"
      ><div class="text">${this.value}<slot></slot></div></label
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-label": AcmeLabel;
  }
}
