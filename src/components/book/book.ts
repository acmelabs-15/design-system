import { html, nothing, svg } from "lit";
import { property, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { AnimateController, animate } from "@lit-labs/motion";
import { sharedCss } from "../../base";
import { AcmeResponsiveElement } from "../../shared/responsive-element";
import { atomState } from "../../shared/atom-state";
import { createStore, StoreEffect, StoreSelector } from "../../shared/state";
import { Interaction } from "../../shared/interaction";
import { Places } from "../../shared/places";
import { optionalString } from "../../shared/attributes";
import { copyResponsiveInput, parseResponsiveAttribute } from "../../shared/responsive-input";
import type { ResponsiveInput } from "../../shared/responsive";
import { isAuthoredStyleScalar, isStyleScalar, type StyleScalar } from "../../shared/style-input-schema";
import { ResponsiveStyleRenderer } from "../../shared/style-renderer";
import { responsiveStyleDelivery } from "../../generated/responsive-styles";
import { bookCoverCss } from "../../generated/components/book/book-cover.styles";
import { bookStructureCss } from "../../generated/components/book/book-structure.styles";

const textureUrl = new URL("../../../assets/book-texture.avif", import.meta.url).href;
type Width = ResponsiveInput<StyleScalar<"width">>;
const textureFlipped = (heading: string) => {
  let hash = 0;
  for (let index = 0; index < heading.length; index++) {
    hash = ((hash << 5) - hash + heading.charCodeAt(index)) | 0;
  }
  return (hash & 1) === 1;
};
const REST = "rotateY(0deg) scale(1) translateX(0px)";
const LIFTED = "rotateY(var(--hover-rotate)) scale(var(--hover-scale)) translateX(var(--hover-translate-x))";
type Gesture = { hovered: boolean; from?: string };
const AT_REST: Gesture = { hovered: false };
const defaultIllustration = svg`<svg width="36" height="56" viewBox="0 0 36 56" fill="none" aria-hidden="true"><circle cx="18" cy="18" r="18" fill="var(--ds-teal-600)"/><circle cx="18" cy="38" r="18" fill="var(--ds-red-700)"/><path d="M3 28a18 18 0 0 1 30 0 18 18 0 0 1-30 0z" fill="var(--ds-blue-700)"/></svg>`;
/** A responsive book cover with interruptible, preference-aware hover motion.
 * @slot illustration - Cover artwork.
 * @slot start - Leading mark on the striped cover.
 * @csspart root - Perspective box.
 * @csspart cover - Front cover.
 * @csspart spine - Binding treatment.
 * @csspart content - Heading and supporting mark.
 * @cssprop --acme-book-texture - Optional CSS image URL for an application-provided texture asset.
 */
export class AcmeBook extends AcmeResponsiveElement {
  static styles = [sharedCss, bookCoverCss, bookStructureCss];
  @atomState() @property({ noAccessor: true, useDefault: true }) heading = "";
  @atomState() private treatment: "stripe" | "simple" = "stripe";
  /** @default "stripe" */
  @property({ noAccessor: true, useDefault: true }) get variant() {
    return this.treatment;
  }
  set variant(value: "stripe" | "simple") {
    if (value !== "stripe" && value !== "simple") {
      throw new TypeError("Invalid Book variant");
    }
    const previous = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", previous);
  }
  @atomState() private coverColor?: string;
  @property({ noAccessor: true, converter: optionalString }) get color() {
    return this.coverColor;
  }
  set color(value: string | undefined) {
    const next = this.colorValue(value),
      previous = this.coverColor;
    this.coverColor = next;
    this.requestUpdate("color", previous);
  }
  @atomState() private foreground?: string;
  @property({ noAccessor: true, attribute: "text-color", converter: optionalString }) get textColor() {
    return this.foreground;
  }
  set textColor(value: string | undefined) {
    const next = this.colorValue(value),
      previous = this.foreground;
    this.foreground = next;
    this.requestUpdate("textColor", previous);
  }
  @atomState() private dimension: Width = "196px";
  /** Canonical size tokens, CSS width or responsive values. @default "196px" */
  @property({ noAccessor: true }) get width(): Width {
    return this.dimension;
  }
  set width(input: Width) {
    const value = copyResponsiveInput(input, (value): value is StyleScalar<"width"> => isAuthoredStyleScalar("width", value, this.supports)),
      previous = this.dimension;
    this.dimension = value ?? "196px";
    this.requestUpdate("width", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) textured = false;
  @atomState() private measuredWidth = 196;
  private readonly places = new Places(this, { places: ["start"] });
  private supports = (property: string, value: string) => {
    const css = this.ownerDocument.defaultView?.CSS;
    if (css?.supports) {
      return css.supports(property, value);
    }
    const style = this.ownerDocument.createElement("div").style;
    style.setProperty(property, value);
    return !!style.getPropertyValue(property);
  };
  private colorValue(value: string | undefined) {
    if (value === undefined || value === "") {
      return undefined;
    }
    if (typeof value !== "string" || !this.supports("color", value)) {
      throw new TypeError("Book color requires a CSS color");
    }
    return value;
  }
  private readonly renderer = new ResponsiveStyleRenderer(this, responsiveStyleDelivery, {
    root: () => (this.renderRoot?.nodeType === 11 ? (this.renderRoot as ShadowRoot) : undefined),
    state: () => ({ inputs: [["width", this.width]], target: this.responsiveTarget, container: this.responsiveContainer }),
  });
  @query(".book") private root!: HTMLElement;
  @query(".wrap") private wrap?: HTMLElement;
  private readonly gesture = createStore(AT_REST, ({ setState }) => ({
    turn: (hovered: boolean, from?: string) => setState((state) => (state.hovered === hovered ? state : { hovered, from })),
    reset: () => setState(() => AT_REST),
  }));
  private readonly frames = createStore((): Keyframe[] | undefined => {
    if (this.gesture.get() === AT_REST) {
      return undefined;
    }
    const { hovered, from } = this.gesture.get();
    return [{ transform: from ?? (hovered ? REST : LIFTED) }, { transform: hovered ? LIFTED : REST }];
  });
  private readonly hovered = new StoreSelector(
    this,
    () => this.gesture,
    (state) => state.hovered,
  );
  private readonly motion = new AnimateController(this, { defaultOptions: { properties: [], skipInitial: true, keyframeOptions: { duration: 250, easing: "ease-out" } } });
  private readonly settle = new StoreEffect(
    this,
    () => this.gesture,
    () => this.motion.cancel(),
  );
  private readonly interaction = new Interaction(this);
  private resize?: ResizeObserver;
  private resizeFrame?: number;
  private resizeView?: Window;
  private pendingWidth = 196;
  private preference?: MediaQueryList;
  private animatedGesture: Gesture = AT_REST;
  private animationFrames = () => {
    const gesture = this.gesture.get();
    if (gesture === this.animatedGesture) {
      return undefined;
    }
    this.animatedGesture = gesture;
    return this.frames.get();
  };
  private motionPreference = () => {
    this.animatedGesture = this.gesture.get();
    this.motion.disabled = !!this.preference?.matches;
    if (this.motion.disabled) {
      this.motion.cancel();
    }
    this.requestUpdate();
  };
  private caught() {
    const matrix = this.wrap && this.ownerDocument.defaultView!.getComputedStyle(this.wrap).transform;
    return matrix && matrix !== "none" ? matrix : undefined;
  }
  // This template listener runs before Interaction changes the generated hover state.
  private turn = (hovered: boolean) => this.gesture.actions.turn(hovered, this.caught());
  attributeChangedCallback(name: string, previous: string | null, value: string | null) {
    if (name === "width") {
      const parsed = parseResponsiveAttribute(value, (leaf): leaf is StyleScalar<"width"> => isStyleScalar("width", leaf, this.supports), { numbers: true });
      this.width = parsed.value;
      if (parsed.diagnostic) {
        console.warn(this.localName, { ...parsed.diagnostic, attribute: "width" });
      }
      return;
    }
    super.attributeChangedCallback(name, previous, value);
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.renderer.adopted();
  }
  connectedCallback() {
    super.connectedCallback();
    const view = this.ownerDocument.defaultView!;
    this.resizeView = view;
    this.preference = view.matchMedia("(prefers-reduced-motion: reduce)");
    this.preference.addEventListener("change", this.motionPreference);
    this.motionPreference();
    this.resize = new view.ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width === undefined) {
        return;
      }
      this.pendingWidth = Math.max(0, width);
      if (this.resizeFrame !== undefined || Math.abs(width - this.measuredWidth) <= 0.01) {
        return;
      }
      this.resizeFrame = view.requestAnimationFrame(() => {
        this.resizeFrame = undefined;
        if (this.isConnected) {
          this.measuredWidth = this.pendingWidth;
        }
      });
    });
    this.resize.observe(this);
  }
  disconnectedCallback() {
    this.resize?.disconnect();
    this.resize = undefined;
    if (this.resizeFrame !== undefined) {
      this.resizeView?.cancelAnimationFrame(this.resizeFrame);
    }
    this.resizeFrame = undefined;
    this.resizeView = undefined;
    this.preference?.removeEventListener("change", this.motionPreference);
    this.preference = undefined;
    this.motion.cancel();
    this.gesture.actions.reset();
    super.disconnectedCallback();
  }
  protected updated() {
    this.interaction.attach(this.root);
  }
  render() {
    const stripe = this.variant === "stripe",
      color = this.color ?? (stripe ? "var(--ds-amber-600)" : undefined);
    const illustration = html`<div class="illustration"><slot name="illustration">${stripe ? nothing : defaultIllustration}</slot></div>`;
    return html`<div class=${this.cls("book", { stripe, simple: !stripe, color: !!color, textured: this.textured })} part="root" style=${styleMap({ "--book-width": String(this.measuredWidth) })} @pointerenter=${(
      event: PointerEvent,
    ) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        this.turn(true);
      }
    }} @pointerleave=${() => this.turn(false)}><div class="wrap" style=${styleMap({ "--book-color": color, "--book-text-color": this.textColor })} ${animate({ guard: () => this.gesture.get().hovered, onFrames: this.animationFrames })}><div class="cover" part="cover">${stripe ? html`<div class="band" aria-hidden="true">${illustration}<div class="bind" part="spine"></div></div>` : nothing}<div class="body"><div class="bind" part="spine" aria-hidden="true"></div><div class="content" part="content"><span class="heading">${this.heading}</span>${stripe ? html`<slot name="start"></slot>${this.places.has("start") ? nothing : html`<acme-layers-icon size="16px"></acme-layers-icon>`}` : illustration}</div></div>${this.textured ? html`<div class="texture" aria-hidden="true" ?data-flipped=${textureFlipped(this.heading)} style=${styleMap({ "--_book-texture": `url(${JSON.stringify(textureUrl)})` })}></div>` : nothing}</div><div class="pages" aria-hidden="true"></div><div class="back" aria-hidden="true"></div></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-book": AcmeBook;
  }
}
