import { html } from "lit";
import { sharedCss } from "../base";
import { AcmeSemanticElement } from "./semantic-element";
import { DisclosureBinding } from "./disclosure";
import { Interaction } from "./interaction";
import { SpringValue } from "./spring-value";
import { readMotionSpring } from "./motion-spring";
import { disclosureTriggerCss } from "../generated/shared/disclosure-trigger.styles";
/** Shared native disclosure activation and accessible references. */
export abstract class AcmeDisclosureTrigger extends AcmeSemanticElement {
  static styles = [sharedCss, disclosureTriggerCss];
  private readonly binding = new DisclosureBinding(this, "trigger", () => this.button);
  private readonly interaction = new Interaction(this);
  private readonly indicator = new SpringValue(
    this,
    () => (this.binding.current?.state.get().expanded ? 180 : 0),
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private get button() {
    return this.renderRoot?.querySelector<HTMLButtonElement>("button") ?? undefined;
  }
  protected get semanticTarget() {
    return this.button;
  }
  protected get semanticDefaults() {
    const content = this.binding.current?.counterpart("content");
    return { controlsElements: content ? [content.host] : [] };
  }
  protected semanticUpdated() {
    this.sync();
  }
  private sync() {
    const state = this.binding.current?.state.get();
    this.button?.setAttribute("aria-expanded", String(!!state?.expanded));
  }
  focus(options?: FocusOptions) {
    this.button?.focus(options);
  }
  protected willUpdate() {
    this.indicator.update();
  }
  protected updated() {
    this.sync();
    this.interaction.attach(this.button!);
    this.renderRoot.querySelector<HTMLElement>("[part=indicator]")?.style.setProperty("--_disclosure-angle", `${this.indicator.value}deg`);
  }
  render() {
    const state = this.binding.current?.state.get(),
      disabled = !state || state.disabled,
      locked = !!state?.expanded && !state.canCollapse;
    return html`<button type="button" part="root trigger" ?disabled=${disabled} aria-expanded=${String(!!state?.expanded)} aria-disabled=${String(disabled || locked)} @click=${(event: MouseEvent) => {
      if (event.defaultPrevented || disabled) return;
      this.button?.focus({ preventScroll: true });
      this.binding.current?.toggle();
    }} @keydown=${(event: KeyboardEvent) => this.binding.current?.key(this.binding.record, event)}><span part="label"><slot></slot></span><span part="indicator" aria-hidden="true"><acme-expand-more-icon size="16px"></acme-expand-more-icon></span></button>`;
  }
}
