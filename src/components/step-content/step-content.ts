import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StepsBinding } from "../../shared/steps-context";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { stepContentCss } from "../../generated/components/step-content/step-content.styles";
/** Retained content for a matching Step key.
 * @slot - Author-owned step content.
 * @csspart content - The panel wrapper.
 */
export class AcmeStepContent extends AcmeElement {
  static styles = [sharedCss, stepContentCss];
  @atomState() private key = "";
  /** Required matching Step key. @default "" */
  @property({ noAccessor: true, useDefault: true }) get value(): string {
    return this.key;
  }
  set value(value: string) {
    if (typeof value !== "string") {
      throw new TypeError("Step Content value must be a string");
    }
    const previous = this.key;
    this.key = value;
    this.requestUpdate("value", previous);
  }
  private readonly internals = this.attachInternals();
  private readonly binding = new StepsBinding(this, { kind: "content", value: () => this.value, disabled: () => false, target: () => this });
  private recover = false;
  protected willUpdate() {
    const active = deepActiveElement(this.ownerDocument),
      current = !!this.binding.current?.current(this.value);
    this.recover = !current && !!active && composedContains(this, active);
    if (this.inert === current) {
      this.inert = !current;
    }
    if (this.hidden === current) {
      this.hidden = !current;
    }
    this.internals.role = "tabpanel";
    const trigger = this.binding.current?.counterpart("trigger", this.value);
    this.internals.ariaLabelledByElements = trigger ? [trigger.host] : null;
  }
  protected updated() {
    if (this.recover) {
      this.recover = false;
      this.binding.current?.recover();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("tabindex")) {
      this.tabIndex = 0;
    }
  }
  render() {
    return html`<div part="content"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-step-content": AcmeStepContent;
  }
}
