import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { message } from "../../shared/messages";
import { disabledWallStructureCss } from "../../generated/components/disabled-wall/disabled-wall-structure.styles";

/** Temporarily blocks interaction while retaining content and its state.
 * @slot - Content that becomes inert while disabled.
 * @slot explanation - Noninteractive guidance shown outside the inert content.
 * @csspart root - The containing region.
 * @csspart content - The inert content wrapper.
 * @csspart explanation - The focusable explanation used for focus recovery.
 */
export class AcmeDisabledWall extends AcmeSemanticElement {
  static styles = [sharedCss, disabledWallStructureCss];
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) disabled = false;
  @atomState() @property({ noAccessor: true, useDefault: true }) reason = "";
  private recoverFocus = false;
  protected willUpdate() {
    const content = this.renderRoot?.querySelector<HTMLElement>("[part=content]");
    const active = deepActiveElement(this.ownerDocument);
    this.recoverFocus = !!(this.disabled && content && !content.inert && active && composedContains(content, active));
  }
  protected updated() {
    if (this.recoverFocus) {
      this.renderRoot.querySelector<HTMLElement>("[part=explanation]")?.focus({ preventScroll: true });
    }
    this.recoverFocus = false;
  }
  render() {
    const fallback = this.reason || message(this.themeContext.scope.effective.get().locale ?? "en-US", "disabledWall.unavailable", "This content is unavailable");
    return html`<div part="root"><div part="content" ?inert=${this.disabled}><slot></slot></div><div part="explanation" role="group" aria-labelledby="explanation-text" tabindex="-1" ?hidden=${!this.disabled}><span id="explanation-text"><slot name="explanation">${fallback}</slot></span></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-disabled-wall": AcmeDisabledWall;
  }
}
