import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeSelectionControl } from "../../shared/selection-control";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { SpringValue } from "../../shared/spring-value";
import { readMotionSpring } from "../../shared/motion-spring";
import { motionCss } from "../../generated/shared/motion.styles";
import { switchStructureCss } from "../../generated/components/switch/switch-structure.styles";
/** A binary setting with native checkbox form behavior and switch semantics.
 * @slot - The visible label.
 * @csspart root - The label hit surface.
 * @csspart control - The native checkbox.
 * @csspart thumb - The moving thumb.
 * @csspart label - The visible label.
 * @fires {CustomEvent<{checked:boolean}>} acme-change - The user changed the setting.
 */
export class AcmeSwitch extends AcmeSelectionControl {
  static styles = [...AcmeSelectionControl.styles, motionCss, switchStructureCss];
  protected get selectionKind() {
    return "switch" as const;
  }
  protected get defaultSize() {
    return "small" as const;
  }
  /** @default "small" */
  @property({ noAccessor: true, converter: optionalString }) get size(): "small" | "medium" | "large" {
    return super.size;
  }
  set size(value: "small" | "medium" | "large" | undefined) {
    super.size = value;
  }
  @atomState() private position: "start" | "end" = "start";
  /** @default "start" */
  @property({ noAccessor: true, attribute: "label-position", converter: optionalString }) get labelPosition(): "start" | "end" {
    return this.position;
  }
  set labelPosition(value: "start" | "end" | undefined) {
    const next = value ?? "start";
    if (!["start", "end"].includes(next)) {
      throw new TypeError("Invalid label position");
    }
    const old = this.position;
    this.position = next;
    this.requestUpdate("labelPosition", old);
  }
  private readonly thumbMotion = new SpringValue(
    this,
    () => (this.checked ? 1 : 0),
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private declarations = this.ownerDocument.createElement("span").style;
  protected emitUserChange() {
    this.dispatchEvent(new CustomEvent<{ checked: boolean }>("acme-change", { detail: { checked: this.checked }, bubbles: true, composed: true }));
  }
  protected updated() {
    super.updated();
    this.thumbMotion.update();
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.declarations = this.ownerDocument.createElement("span").style;
  }
  render() {
    this.declarations.setProperty("--switch-progress", String(this.thumbMotion.value));
    return html`<label class="selection-label switch" part="root" data-size=${this.size} data-label-position=${this.labelPosition} ?data-checked=${this.checked} ?data-disabled=${this.effectiveDisabled} style=${this.declarations.cssText}><span class="switch-control">${this.input}<span class="track" aria-hidden="true"><span class="thumb" part="thumb"></span></span></span><span part="label" ?hidden=${!this.places.has("")}><slot></slot></span>${this.pressEffect.render()}</label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-switch": AcmeSwitch;
  }
}
