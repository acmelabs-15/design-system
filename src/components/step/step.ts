import { ContextProvider } from "@lit/context";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StepsBinding, stepContext } from "../../shared/steps-context";
import { stepCss } from "../../generated/components/step/step.styles";
/** A stable keyed member of Steps.
 * @slot - Step Trigger and optional descriptive content.
 * @csspart item - The member layout.
 * @csspart separator - The decorative connector.
 */
export class AcmeStep extends AcmeElement {
  static styles = [sharedCss, stepCss];
  @atomState() private key = "";
  /** Required unique key. @default "" */
  @property({ noAccessor: true, useDefault: true }) get value(): string {
    return this.key;
  }
  set value(value: string) {
    if (typeof value !== "string") throw new TypeError("Step value must be a string");
    const previous = this.key;
    this.key = value;
    this.requestUpdate("value", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  @atomState() private completion?: boolean;
  /** Overrides the default completion state derived from position. */
  @property({ noAccessor: true, converter: { fromAttribute: (value) => (value === null ? undefined : value !== "false") } }) get completed(): boolean | undefined {
    return this.completion;
  }
  set completed(value: boolean | undefined) {
    if (value !== undefined && typeof value !== "boolean") throw new TypeError("completed must be a boolean or undefined");
    const previous = this.completion;
    this.completion = value;
    this.requestUpdate("completed", previous);
  }
  private readonly binding = new StepsBinding(this, { kind: "item", value: () => this.value, disabled: () => this.disabled, completed: () => this.completed, target: () => undefined });
  private readonly provider = new ContextProvider(this, { context: stepContext, initialValue: this.binding.record });
  render() {
    const owner = this.binding.current,
      view = owner?.view.get(),
      index = owner?.index(this.value) ?? -1;
    return html`<div part="item" data-orientation=${view?.orientation ?? "horizontal"} ?data-current=${owner?.current(this.value)} ?data-complete=${owner?.complete(this.value)}><slot></slot><span part="separator" aria-hidden="true" ?hidden=${index < 0 || index === (view?.items.length ?? 0) - 1}></span></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-step": AcmeStep;
  }
}
