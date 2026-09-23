import { animate } from "@lit-labs/motion";
import { html, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { skeletonSurfaceCss } from "../../generated/components/skeleton/skeleton-surface.styles";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { RepeatingMotion } from "../../shared/repeating-motion";
/** Decorative loading placeholder that retains author-owned content.
 * @slot - Content shown when loading becomes false.
 * @csspart root - Sized placeholder wrapper.
 * @csspart content - Retained author content.
 */
export class AcmeSkeleton extends AcmeElement {
  static styles = [sharedCss, skeletonSurfaceCss];
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) loading = true;
  @atomState() private form: "rectangle" | "circle" = "rectangle";
  /** @default "rectangle" */
  @property({ noAccessor: true, useDefault: true }) get shape() {
    return this.form;
  }
  set shape(value: "rectangle" | "circle") {
    if (value !== "rectangle" && value !== "circle") throw new TypeError("Invalid Skeleton shape");
    const previous = this.form;
    this.form = value;
    this.requestUpdate("shape", previous);
  }
  @atomState() private inlineSize?: string;
  @atomState() private blockSize?: string;
  @property({ noAccessor: true, converter: optionalString }) get width(): string | undefined {
    return this.inlineSize;
  }
  set width(value: string | undefined) {
    this.validateSize(value);
    const previous = this.inlineSize;
    this.inlineSize = value;
    this.requestUpdate("width", previous);
  }
  @property({ noAccessor: true, converter: optionalString }) get height(): string | undefined {
    return this.blockSize;
  }
  set height(value: string | undefined) {
    this.validateSize(value);
    const previous = this.blockSize;
    this.blockSize = value;
    this.requestUpdate("height", previous);
  }
  private validateSize(value: string | undefined) {
    if (
      value !== undefined &&
      (typeof value !== "string" ||
        !value.trim() ||
        /^(initial|inherit|unset|revert)/i.test(value) ||
        (this.ownerDocument.defaultView?.CSS && !this.ownerDocument.defaultView.CSS.supports("width", value)))
    )
      throw new TypeError("Skeleton dimensions require CSS sizes");
  }
  private readonly motion = new RepeatingMotion(this, () => this.loading);
  protected willUpdate(changes: PropertyValues) {
    if (changes.has("loading")) this.motion.reset();
  }
  protected updated() {
    const root = this.renderRoot.querySelector<HTMLElement>("[part=root]")!;
    for (const [name, value] of [
      ["--_skeleton-width", this.width],
      ["--_skeleton-height", this.height],
    ] as const) {
      if (value === undefined) root.style.removeProperty(name);
      else root.style.setProperty(name, value);
    }
  }
  render() {
    return html`<div part="root" data-shape=${this.shape} data-loading=${String(this.loading)}><div part="content" ?inert=${this.loading} aria-hidden=${this.loading ? "true" : "false"}><slot></slot></div>${this.loading ? keyed(this.motion.key, html`<div class="paint" aria-hidden="true"><span class="sweep" ${animate(this.motion.options([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], { duration: 1500, easing: "ease-in-out", direction: "reverse" }, ["transform"]))}></span></div>`) : null}</div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-skeleton": AcmeSkeleton;
  }
}
