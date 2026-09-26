import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../base";
import { atomState } from "./atom-state";
import { DisclosureBinding } from "./disclosure";
import { OwnedContent, type ContentRenderer } from "./owned-content";
import { SpringValue } from "./spring-value";
import { readMotionSpring } from "./motion-spring";
import { deepActiveElement, composedContains } from "./composed-tree";
import { disclosureContentCss } from "../generated/shared/disclosure-content.styles";
/** Shared owned height/opacity motion and controlled content lifetime. */
export abstract class AcmeDisclosureContent extends AcmeElement {
  static styles = [sharedCss, disclosureContentCss];
  @atomState() private renderer?: ContentRenderer;
  @property({ noAccessor: true, attribute: false }) get renderContent(): ContentRenderer | undefined {
    return this.renderer;
  }
  set renderContent(value: ContentRenderer | undefined) {
    if (value !== undefined && typeof value !== "function") {
      throw new TypeError("renderContent must be a function");
    }
    const old = this.renderer;
    this.renderer = value;
    this.requestUpdate("renderContent", old);
  }
  @atomState() private height = 0;
  @atomState() private visited = false;
  private initialized = false;
  private readonly binding = new DisclosureBinding(this, "content", () => this);
  private readonly owned = new OwnedContent(this);
  private readonly internals = this.attachInternals();
  private readonly motion = new SpringValue(
    this,
    () => (this.expanded ? this.height : 0),
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private observer?: ResizeObserver;
  private get expanded() {
    return !!this.binding.current?.state.get().expanded;
  }
  private get body() {
    return this.renderRoot?.querySelector<HTMLElement>(".body") ?? undefined;
  }
  private measure = () => {
    if (this.hidden || !this.body) {
      return;
    }
    const value = this.body.getBoundingClientRect().height;
    if (Math.abs(value - this.height) > 0.1) {
      this.height = value;
    }
  };
  protected willUpdate() {
    const expanded = this.expanded,
      active = deepActiveElement(this.ownerDocument);
    if (!expanded && active && composedContains(this, active)) {
      this.binding.current?.recover();
    }
    this.inert = !expanded;
    if (expanded) {
      this.hidden = false;
      if (!this.visited) {
        this.visited = true;
      }
    }
    this.motion.update();
  }
  protected updated() {
    const state = this.binding.current?.state.get(),
      expanded = this.expanded;
    const visible = expanded || !this.motion.settled;
    this.hidden = !visible;
    this.internals.role = "region";
    const trigger = this.binding.current?.counterpart("trigger");
    this.internals.ariaLabelledByElements = this.ariaLabel === null && this.ariaLabelledByElements === null && trigger ? [trigger.host] : null;
    const mounted = !!state && (expanded || (!this.motion.settled && this.visited) || (!state.unmountOnExit && (!state.lazyMount || this.visited)));
    this.owned.render(mounted, this.renderContent, !!(state?.lazyMount || state?.unmountOnExit));
    if (!this.observer && this.body) {
      this.observer = new ResizeObserver(this.measure);
      this.observer.observe(this.body);
    }
    this.measure();
    if (!this.initialized) {
      this.motion.jump();
      this.initialized = true;
    }
    const container = this.renderRoot.querySelector<HTMLElement>("[part=content]")!;
    container.style.setProperty("--_disclosure-height", expanded && this.motion.settled ? "auto" : `${Math.max(0, this.motion.value)}px`);
    container.style.setProperty("--_disclosure-opacity", String(expanded && this.motion.settled ? 1 : this.height ? Math.max(0, Math.min(1, this.motion.value / this.height)) : 0));
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
    this.initialized = false;
    super.disconnectedCallback();
  }
  render() {
    return html`<div part="content"><div class="body"><slot @slotchange=${this.measure}></slot></div></div>`;
  }
}
