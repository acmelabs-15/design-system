import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
import { ScrollPartBinding } from "../../shared/scroll-area-context";
import { scrollButtonCss } from "../../generated/components/scroll-button/scroll-button.styles";
/** An optional native button for moving its Scroll Area.
 * @slot - Optional button content; the direction supplies the default label.
 * @csspart button - Composed Button control.
 */
export class AcmeScrollButton extends AcmeSemanticElement {
  static styles = [sharedCss, scrollButtonCss];
  @atomState() private directionValue: "inline-start" | "inline-end" | "block-start" | "block-end" = "block-end";
  /** @default "block-end" */
  @property({ noAccessor: true, reflect: true, attribute: "direction", converter: optionalString }) get direction(): "inline-start" | "inline-end" | "block-start" | "block-end" {
    return this.directionValue;
  }
  set direction(value: "inline-start" | "inline-end" | "block-start" | "block-end" | undefined) {
    const next = value ?? "block-end";
    if (!["inline-start", "inline-end", "block-start", "block-end"].includes(next)) throw new TypeError("Invalid direction");
    const previous = this.directionValue;
    this.directionValue = next;
    this.requestUpdate("direction", previous);
  }
  @atomState() private distance?: string;
  @property({ noAccessor: true, converter: optionalString }) get step(): string | undefined {
    return this.distance;
  }
  set step(value: string | undefined) {
    if (value !== undefined) {
      const css = this.ownerDocument.defaultView?.CSS;
      if (
        typeof value !== "string" ||
        !value.trim() ||
        /^(thin|medium|thick|auto|inherit|initial|unset|revert)/i.test(value) ||
        /^0(?:\.0+)?(?:[a-z]+)?$/i.test(value.trim()) ||
        (css && !css.supports("border-top-width", value))
      )
        throw new TypeError("Scroll button step requires a positive CSS length");
    }
    const previous = this.distance;
    this.distance = value;
    this.requestUpdate("step", previous);
  }
  private readonly binding = new ScrollPartBinding(this, { kind: "button", element: () => this.button });
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private get button() {
    return this.renderRoot?.querySelector<HTMLElement>("acme-button") ?? undefined;
  }
  private get horizontal() {
    return this.direction.startsWith("inline");
  }
  private get disabled() {
    const state = this.binding.current?.state.get();
    if (!state) return true;
    const axis = this.horizontal ? state.x : state.y;
    if (!axis.overflow || (state.orientation !== "both" && state.orientation !== (this.horizontal ? "horizontal" : "vertical"))) return true;
    const towardStart = this.direction.endsWith("start");
    const towardMaximum = this.horizontal && state.rtl ? towardStart : !towardStart;
    return towardMaximum ? axis.maximum - axis.position <= 1 : axis.position <= 1;
  }
  private label() {
    const rtl = this.binding.current?.state.get().rtl;
    const fallback = this.horizontal ? (this.direction.endsWith("start") !== !!rtl ? "Scroll left" : "Scroll right") : this.direction === "block-start" ? "Scroll up" : "Scroll down";
    return message(this.themeContext.scope.effective.get().locale, "scroll." + this.direction, fallback);
  }
  focus(options?: FocusOptions) {
    this.button?.focus(options);
  }
  private move = () => {
    const owner = this.binding.current,
      viewport = owner?.viewport();
    if (!viewport || this.disabled) return;
    const measure = this.renderRoot.querySelector<HTMLElement>(".step")!;
    const amount = this.step === undefined ? (this.horizontal ? viewport.clientWidth : viewport.clientHeight) * 0.8 : measure.getBoundingClientRect().width;
    if (!Number.isFinite(amount) || amount <= 0) throw new RangeError("Scroll button step must resolve to a positive length");
    const delta = amount * (this.direction.endsWith("start") ? -1 : 1) * (this.horizontal && owner!.state.get().rtl ? -1 : 1);
    viewport.scrollBy({ [this.horizontal ? "left" : "top"]: delta, behavior: this.ownerDocument.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  protected updated() {
    const measure = this.renderRoot.querySelector<HTMLElement>(".step")!;
    if (this.step === undefined) measure.style.removeProperty("--_scroll-step");
    else measure.style.setProperty("--_scroll-step", this.step);
  }
  render() {
    return html`<acme-button type="button" variant="secondary" size="small" part="root button" .disabled=${this.disabled} @click=${this.move}><slot>${this.label()}</slot></acme-button><span class="step" aria-hidden="true"></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-scroll-button": AcmeScrollButton;
  }
}
