import { ContextConsumer } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { stepContext, StepsBinding, type StepsPart } from "../../shared/steps-context";
import { stepTriggerCss } from "../../generated/components/step-trigger/step-trigger.styles";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
/** The native tab button for its enclosing Step.
 * @slot - The step label.
 * @slot indicator - Optional noninteractive indicator content.
 * @csspart trigger - The native button.
 * @csspart indicator - The numbered or completed indicator.
 * @csspart label - The step label.
 */
export class AcmeStepTrigger extends AcmeSemanticElement {
  static styles = [sharedCss, stepTriggerCss];
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private readonly item = createAtom<{ part?: StepsPart }>({});
  private readonly consumer = new ContextConsumer(this, {
    context: stepContext,
    subscribe: true,
    callback: (part) => {
      this.item.set({ part });
      this.requestUpdate();
    },
  });
  private get key() {
    return this.item.get().part?.value() ?? "";
  }
  private get button() {
    return this.renderRoot?.querySelector<HTMLButtonElement>("button") ?? undefined;
  }
  private readonly binding = new StepsBinding(this, { kind: "trigger", value: () => this.key, disabled: () => this.item.get().part?.disabled() ?? true, target: () => this.button });
  private get disabled() {
    return !this.binding.current?.valid(this.key) || this.binding.record.disabled() || this.item.get().part?.currentOwner() !== this.binding.current;
  }
  protected get semanticTarget() {
    return this.button;
  }
  protected get semanticDefaults() {
    const content = this.binding.current?.counterpart("content", this.key);
    return { role: "tab", controlsElements: content ? [content.host] : [] };
  }
  private synchronize() {
    const owner = this.binding.current,
      button = this.button;
    if (!button) {
      return;
    }
    button.setAttribute("aria-selected", String(!!owner?.current(this.key)));
    button.setAttribute("aria-disabled", String(this.disabled || (!!owner?.view.get().linear && !owner.current(this.key))));
    button.disabled = this.disabled;
    button.tabIndex = owner?.tabindex(this.binding.record) ?? -1;
  }
  protected semanticUpdated() {
    this.synchronize();
  }
  protected updated() {
    this.synchronize();
  }
  click() {
    if (!this.disabled) {
      this.button?.click();
    }
  }
  focus(options?: FocusOptions) {
    if (!this.disabled) {
      this.button?.focus(options);
    }
  }
  disconnectedCallback() {
    this.item.set({});
    this.consumer.value = undefined;
    super.disconnectedCallback();
  }
  render() {
    const owner = this.binding.current,
      current = !!owner?.current(this.key),
      complete = !!owner?.complete(this.key),
      index = owner?.index(this.key) ?? -1;
    return html`<button type="button" part="root trigger" ?disabled=${this.disabled} aria-selected=${String(current)} aria-description=${complete ? message(this.themeContext.scope.effective.get().locale, "steps.complete", "Completed") : nothing} tabindex=${owner?.tabindex(this.binding.record) ?? -1} ?data-current=${current} ?data-complete=${complete} @focus=${() => owner?.focus(this.binding.record)} @click=${(
      event: MouseEvent,
    ) => {
      if (!event.defaultPrevented && !this.disabled) {
        owner?.move(this.binding.record);
      }
    }}><span part="indicator" aria-hidden="true"><slot name="indicator">${complete ? html`<acme-check-icon size="16px"></acme-check-icon>` : index + 1}</slot></span><span part="label"><slot></slot></span></button>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-step-trigger": AcmeStepTrigger;
  }
}
