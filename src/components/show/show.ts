import { html } from "lit";
import { property } from "lit/decorators.js";
import { focusable } from "tabbable";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { OwnedContent, type ContentRenderer } from "../../shared/owned-content";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { focusAvailable } from "../../shared/focus-recovery";
import { message } from "../../shared/messages";
import { showCss } from "../../generated/components/show/show.styles";

/** Mounts one explicit content branch, or preserves both branches on request.
 * @slot - One inert template for the true branch.
 * @slot fallback - One inert template for the false branch.
 * @csspart content - The true branch.
 * @csspart fallback - The false branch.
 */
export class AcmeShow extends AcmeElement {
  static styles = [sharedCss, showCss];
  @atomState() @property({ noAccessor: true, type: Boolean }) when = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "preserve-state" }) preserveState = false;
  @atomState() private contentRenderer?: ContentRenderer;
  @atomState() private fallbackRenderer?: ContentRenderer;
  @property({ noAccessor: true, attribute: false }) get renderContent(): ContentRenderer | undefined {
    return this.contentRenderer;
  }
  set renderContent(value: ContentRenderer | undefined) {
    if (value !== undefined && typeof value !== "function") throw new TypeError("renderContent must be a function");
    const previous = this.contentRenderer;
    this.contentRenderer = value;
    this.requestUpdate("renderContent", previous);
  }
  @property({ noAccessor: true, attribute: false }) get renderFallback(): ContentRenderer | undefined {
    return this.fallbackRenderer;
  }
  set renderFallback(value: ContentRenderer | undefined) {
    if (value !== undefined && typeof value !== "function") throw new TypeError("renderFallback must be a function");
    const previous = this.fallbackRenderer;
    this.fallbackRenderer = value;
    this.requestUpdate("renderFallback", previous);
  }
  private readonly content = new OwnedContent(this);
  private readonly fallback = new OwnedContent(this, { slot: "fallback" });
  private contentManaged = false;
  private fallbackManaged = false;
  private previous?: boolean;
  private recover = false;
  protected willUpdate() {
    const active = deepActiveElement(this.ownerDocument);
    const departing = this.renderRoot?.querySelector(`[part=${this.previous ? "content" : "fallback"}]`);
    this.recover = this.previous !== undefined && this.previous !== this.when && !!active && !!departing && composedContains(departing, active);
    this.contentManaged = this.content.render(this.when || this.preserveState, this.renderContent, true);
    this.fallbackManaged = this.fallback.render(!this.when || this.preserveState, this.renderFallback, true);
    this.previous = this.when;
  }
  protected updated() {
    if (!this.recover) return;
    this.recover = false;
    const branch = this.renderRoot.querySelector<HTMLElement>(`[part=${this.when ? "content" : "fallback"}]`)!;
    if (!focusAvailable(focusable(branch, { getShadowRoot: true })[0])) branch.focus({ preventScroll: true });
  }
  render() {
    const label = this.ariaLabel || message(this.themeContext.scope.effective.get().locale, "show.content", "Conditional content");
    return html`<div part="content" role="group" aria-label=${label} tabindex="-1" ?hidden=${!this.when} ?inert=${!this.when}><slot ?hidden=${!this.contentManaged}></slot></div>
      <div part="fallback" role="group" aria-label=${label} tabindex="-1" ?hidden=${this.when} ?inert=${this.when}><slot name="fallback" ?hidden=${!this.fallbackManaged}></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-show": AcmeShow;
  }
}
