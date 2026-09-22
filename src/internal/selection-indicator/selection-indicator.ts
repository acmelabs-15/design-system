import { SpringController } from "@lit-labs/motion/spring.js";
import { autoUpdate } from "@floating-ui/dom";
import { html, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { readMotionSpring } from "../../shared/motion-spring";
import type { MotionScheme, MotionSpeed } from "../../shared/motion-tokens";
import { motionCss } from "../../generated/shared/motion.styles";
import { selectionIndicatorCss } from "../../generated/shared/selection-indicator.styles";
export type IndicatorRect = Readonly<{ x: number; y: number; width: number; height: number }>;
export type IndicatorGeometry = (target: IndicatorRect, frame: Readonly<{ width: number; height: number }>, orientation: "horizontal" | "vertical") => IndicatorRect;
type Springs = Record<keyof IndicatorRect, SpringController>;
const keys = ["x", "y", "width", "height"] as const;
/** Shared visual-only spring indicator. Selection remains with its owning family.
 * @internal
 * @csspart paint - The animated visual surface.
 */
export class AcmeSelectionIndicator extends AcmeElement {
  static styles = [sharedCss, motionCss, selectionIndicatorCss];
  @atomState() @property({ noAccessor: true, attribute: false }) target?: Element;
  @atomState() @property({ noAccessor: true, attribute: false }) orientation: "horizontal" | "vertical" = "horizontal";
  @atomState() @property({ noAccessor: true, attribute: false }) scheme: MotionScheme = "standard";
  @atomState() @property({ noAccessor: true, attribute: false }) speed: MotionSpeed = "default";
  @atomState() @property({ noAccessor: true, attribute: false }) geometry?: IndicatorGeometry;
  @atomState() private rectangle: IndicatorRect | undefined;
  private readonly themeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private theme?: object;
  private springs?: Springs;
  private parameters = "";
  private observed?: Element;
  private cleanup?: () => void;
  private media?: MediaQueryList;
  private generation = 0;
  private declarations = this.ownerDocument.createElement("span").style;
  get isAnimating() {
    return !!this.springs && keys.some((key) => this.springs![key].isAnimating);
  }
  private stopSprings() {
    if (this.springs)
      for (const spring of Object.values(this.springs)) {
        spring.hostDisconnected();
        this.removeController(spring);
      }
    this.springs = undefined;
  }
  private stopObservation() {
    this.generation++;
    this.cleanup?.();
    this.cleanup = undefined;
    this.observed = undefined;
  }
  private preference = () => {
    if (this.media?.matches) this.stopSprings();
    this.refresh();
    this.requestUpdate();
  };
  private observe() {
    this.stopObservation();
    const target = this.target;
    if (!this.isConnected || !target?.isConnected || target.ownerDocument !== this.ownerDocument) {
      this.hide();
      return;
    }
    this.observed = target;
    const generation = this.generation;
    const cleanup = autoUpdate(target, this, () => {
      if (generation === this.generation) this.refresh();
    });
    if (generation !== this.generation || !this.isConnected) cleanup();
    else this.cleanup = cleanup;
  }
  private hide() {
    this.stopSprings();
    if (this.rectangle !== undefined) this.rectangle = undefined;
  }
  private reference() {
    const box = this.getBoundingClientRect();
    return { box, scaleX: box.width && this.offsetWidth ? box.width / this.offsetWidth : 1, scaleY: box.height && this.offsetHeight ? box.height / this.offsetHeight : 1 };
  }
  refresh() {
    const target = this.target;
    if (!this.isConnected || !target?.isConnected || target.ownerDocument !== this.ownerDocument) {
      this.hide();
      if (this.observed) this.stopObservation();
      return;
    }
    if (this.observed !== target) {
      this.observe();
      return;
    }
    const view = this.ownerDocument.defaultView!;
    const targetBox = target.getBoundingClientRect();
    if (!targetBox.width || !targetBox.height || view.getComputedStyle(target).visibility === "hidden") {
      this.hide();
      return;
    }
    const { box, scaleX, scaleY } = this.reference();
    const local: IndicatorRect = { x: (targetBox.left - box.left) / scaleX, y: (targetBox.top - box.top) / scaleY, width: targetBox.width / scaleX, height: targetBox.height / scaleY };
    const next = this.geometry?.(local, { width: this.offsetWidth, height: this.offsetHeight }, this.orientation) ?? local;
    if (!keys.every((key) => Number.isFinite(next[key])) || next.width <= 0 || next.height <= 0) {
      this.hide();
      return;
    }
    const config = readMotionSpring(this, this.scheme, "spatial", this.speed),
      parameters = JSON.stringify(config);
    if (this.rectangle && keys.every((key) => Math.abs(this.rectangle![key] - next[key]) < 0.01) && this.parameters === parameters) return;
    const paint = this.renderRoot?.querySelector<HTMLElement>("[part=paint]");
    const current = this.rectangle && paint?.getBoundingClientRect();
    const from =
      current && current.width && current.height
        ? { x: (current.left - box.left) / scaleX, y: (current.top - box.top) / scaleY, width: current.width / scaleX, height: current.height / scaleY }
        : next;
    const velocity = Object.fromEntries(keys.map((key) => [key, this.springs?.[key].currentVelocity ?? 0])) as Record<keyof IndicatorRect, number>;
    this.stopSprings();
    this.parameters = parameters;
    this.rectangle = Object.freeze({ ...next });
    if (!this.media?.matches && current) {
      this.springs = Object.fromEntries(keys.map((key) => [key, new SpringController(this, { ...config, fromValue: from[key], toValue: next[key], initialVelocity: velocity[key] })])) as Springs;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.ariaHidden = "true";
    this.media = this.ownerDocument.defaultView!.matchMedia("(prefers-reduced-motion: reduce)");
    this.media.addEventListener("change", this.preference);
    this.requestUpdate();
  }
  disconnectedCallback() {
    this.stopObservation();
    this.stopSprings();
    this.media?.removeEventListener("change", this.preference);
    this.media = undefined;
    this.rectangle = undefined;
    super.disconnectedCallback();
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.stopObservation();
    this.stopSprings();
    this.media?.removeEventListener("change", this.preference);
    this.declarations = this.ownerDocument.createElement("span").style;
    this.media = this.ownerDocument.defaultView!.matchMedia("(prefers-reduced-motion: reduce)");
    if (this.isConnected) this.media.addEventListener("change", this.preference);
    this.requestUpdate();
  }
  protected updated(changed: PropertyValues) {
    const theme = this.themeContext.scope.effective.get();
    if (this.target !== this.observed) this.observe();
    else if (changed.has("geometry") || changed.has("orientation") || changed.has("scheme") || changed.has("speed") || theme !== this.theme) this.refresh();
    this.theme = theme;
  }
  private paintStyle() {
    const rectangle = this.rectangle;
    if (!rectangle) return "";
    const values = Object.fromEntries(keys.map((key) => [key, this.springs?.[key].currentValue ?? rectangle[key]])) as Record<keyof IndicatorRect, number>;
    if (!keys.every((key) => Number.isFinite(values[key]))) {
      this.stopSprings();
      Object.assign(values, rectangle);
    }
    for (const [property, value] of Object.entries({
      "--indicator-x": `${values.x}px`,
      "--indicator-y": `${values.y}px`,
      "--indicator-width": `${rectangle.width}px`,
      "--indicator-height": `${rectangle.height}px`,
      "--indicator-scale-x": String(Math.max(0.001, values.width) / rectangle.width),
      "--indicator-scale-y": String(Math.max(0.001, values.height) / rectangle.height),
    }))
      this.declarations.setProperty(property, value);
    return this.declarations.cssText;
  }
  render() {
    return html`<span class="paint" part="paint" ?hidden=${!this.rectangle} style=${this.paintStyle()}></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-selection-indicator": AcmeSelectionIndicator;
  }
}
