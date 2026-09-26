import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { boolish, sharedCss } from "../../base";
import { feedbackFormCss } from "../../generated/components/feedback/feedback-form.styles";
import { atomState } from "../../shared/atom-state";
import { type FeedbackTopic, type FeedbackValue, feedbackTopics, feedbackValue } from "../../shared/feedback-data";
import { message, messageCatalogs } from "../../shared/messages";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { StoreSelector } from "../../shared/store-connection";
import type { AcmeInput } from "../input/input";
import type { AcmeTextarea } from "../textarea/textarea";

export type { FeedbackTopic, FeedbackValue } from "../../shared/feedback-data";
/** A composed feedback form. The application sends submissions and supplies their result.
 * @slot heading - Form heading.
 * @slot description - Supporting instructions.
 * @slot actions - Application-owned actions instead of the submit button.
 * @slot - Additional form content.
 * @csspart root - Form container.
 * @csspart form - Native form.
 * @csspart rating - Rating field.
 * @csspart message - Message field.
 * @csspart email - Optional email field.
 * @csspart topic - Optional topic field.
 * @csspart actions - Submission actions.
 * @fires {CustomEvent<{value:FeedbackValue}>} acme-input - Current user-edited fields.
 * @fires {CustomEvent<{value:FeedbackValue}>} acme-change - Committed user edits.
 * @fires {CustomEvent<{action:"submit",value:FeedbackValue}>} acme-request - Cancelable application submission.
 */
export class AcmeFeedback extends AcmeSemanticElement {
  static styles = [sharedCss, feedbackFormCss];
  @atomState() private current: FeedbackValue = feedbackValue(undefined);
  @property({ noAccessor: true, type: Object }) get value(): FeedbackValue {
    return this.current;
  }
  set value(value: FeedbackValue) {
    const previous = this.current;
    this.current = feedbackValue(value);
    this.cancelSubmission();
    this.requestUpdate("value", previous);
  }
  @atomState() private choices: readonly FeedbackTopic[] = [];
  @property({ noAccessor: true, type: Array }) get topics(): readonly FeedbackTopic[] {
    return this.choices;
  }
  set topics(value: readonly FeedbackTopic[]) {
    const previous = this.choices;
    this.choices = feedbackTopics(value);
    this.requestUpdate("topics", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "collect-email" }) collectEmail = false;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true, attribute: "required-message" }) requiredMessage = true;
  @atomState() private busy = false;
  @property({ noAccessor: true, type: Boolean }) get submitting() {
    return this.busy;
  }
  set submitting(value: boolean) {
    const previous = this.busy;
    this.busy = Boolean(value);
    if (!this.busy) {
      this.cancelSubmission();
    }
    this.requestUpdate("submitting", previous);
  }
  @atomState() private failure = "";
  @property({ noAccessor: true, useDefault: true }) get error() {
    return this.failure;
  }
  set error(value: string) {
    const previous = this.failure;
    this.failure = value ?? "";
    if (this.failure) {
      this.cancelSubmission();
    }
    this.requestUpdate("error", previous);
  }
  @atomState() private pending = false;
  @atomState() private attempted = false;
  private submissionGeneration = 0;
  private cancelSubmission() {
    this.submissionGeneration++;
    this.pending = false;
  }
  private initial: FeedbackValue = feedbackValue(undefined);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private text(key: string, fallback: string) {
    return message(this.themeContext.scope.effective.get().locale, "feedback." + key, fallback);
  }
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLFormElement>("form") ?? undefined;
  }
  protected get semanticDefaults() {
    return { label: this.text("label", "Feedback") };
  }
  protected firstUpdated() {
    this.initial = this.value;
  }
  private edit = (field: keyof FeedbackValue, event: CustomEvent<{ value: string }>) => {
    event.stopPropagation();
    if (this.submitting) {
      return;
    }
    this.current = feedbackValue({ ...this.value, [field]: event.detail.value });
    this.cancelSubmission();
    const detail = Object.freeze({ value: this.value });
    if (event.type === "acme-change" && (field === "rating" || field === "topic")) {
      this.dispatchEvent(new CustomEvent("acme-input", { detail, bubbles: true, composed: true }));
    }
    this.dispatchEvent(new CustomEvent(event.type, { detail, bubbles: true, composed: true }));
  };
  reset() {
    this.current = this.initial;
    this.attempted = false;
    this.cancelSubmission();
    this.requestUpdate();
  }
  private get controls() {
    return [...this.renderRoot.querySelectorAll<AcmeInput | AcmeTextarea>("acme-input,acme-textarea")];
  }
  private invalid(part: string) {
    const control = this.renderRoot?.querySelector<AcmeInput | AcmeTextarea>(`[part=${part}] acme-input,[part=${part}] acme-textarea`);
    return this.attempted && !!control && !control.validity.valid;
  }
  private validation(part: string) {
    return this.renderRoot?.querySelector<AcmeInput | AcmeTextarea>(`[part=${part}] acme-input,[part=${part}] acme-textarea`)?.validationMessage ?? "";
  }
  /** Validates the displayed fields and requests application submission once. */
  async requestSubmit(): Promise<void> {
    if (this.submitting || this.pending || !this.isConnected) {
      return;
    }
    const generation = ++this.submissionGeneration;
    this.pending = true;
    await this.updateComplete;
    await Promise.all(this.controls.map((control) => control.updateComplete));
    if (generation !== this.submissionGeneration || this.submitting || !this.isConnected) {
      return;
    }
    this.attempted = true;
    const invalid = this.controls.find((control) => !control.checkValidity());
    if (invalid) {
      this.pending = false;
      invalid.reportValidity();
      this.requestUpdate();
      return;
    }
    const value = feedbackValue({
      message: this.value.message,
      rating: this.value.rating,
      ...(this.collectEmail ? { email: this.value.email } : {}),
      ...(this.topics.length ? { topic: this.value.topic } : {}),
    });
    if (!this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "submit", value }), bubbles: true, composed: true, cancelable: true }))) {
      this.pending = false;
    }
  }
  private submit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void this.requestSubmit();
  };
  disconnectedCallback() {
    this.cancelSubmission();
    super.disconnectedCallback();
  }
  render() {
    const ratings = [
      ["very-dissatisfied", this.text("veryDissatisfied", "Hate it")],
      ["dissatisfied", this.text("dissatisfied", "Not great")],
      ["satisfied", this.text("satisfied", "It’s okay")],
      ["very-satisfied", this.text("verySatisfied", "Love it!")],
    ];
    return html`<div part="root"><form part="form" novalidate aria-busy=${String(this.submitting)} @submit=${this.submit} @reset=${(event: Event) => {
      event.preventDefault();
      this.reset();
    }}><header><slot name="heading"><h2>${this.text("heading", "Share feedback")}</h2></slot><slot name="description"><p>${this.text("description", "Tell us what worked and what could be better.")}</p></slot></header><acme-field part="rating" .disabled=${this.submitting}><span slot="label">${this.text("rating", "How was your experience?")}</span><acme-radio-group .value=${this.value.rating || undefined} orientation="horizontal" @acme-change=${(event: CustomEvent<{ value: string }>) => this.edit("rating", event)}><acme-group flex-wrap="wrap">${ratings.map(([value, label]) => html`<acme-radio-card .value=${value}>${label}</acme-radio-card>`)}</acme-group></acme-radio-group></acme-field><acme-field part="message" .required=${this.requiredMessage} .disabled=${this.submitting} .invalid=${this.invalid("message")}><span slot="label">${this.text("message", "Message")}</span><acme-textarea name="message" .value=${this.value.message} .required=${this.requiredMessage} @acme-input=${(event: CustomEvent<{ value: string }>) => this.edit("message", event)} @acme-change=${(event: CustomEvent<{ value: string }>) => this.edit("message", event)}></acme-textarea><span slot="error">${this.validation("message")}</span></acme-field>${this.collectEmail ? html`<acme-field part="email" .disabled=${this.submitting} .invalid=${this.invalid("email")}><span slot="label">${this.text("email", "Email (optional)")}</span><acme-input name="email" type="email" autocomplete="email" .value=${this.value.email ?? ""} @acme-input=${(event: CustomEvent<{ value: string }>) => this.edit("email", event)} @acme-change=${(event: CustomEvent<{ value: string }>) => this.edit("email", event)}></acme-input><span slot="error">${this.validation("email")}</span></acme-field>` : nothing}${this.topics.length ? html`<acme-field part="topic" .disabled=${this.submitting}><span slot="label">${this.text("topic", "Topic (optional)")}</span><acme-select name="topic" .value=${this.value.topic || undefined} @acme-change=${(event: CustomEvent<{ value: string }>) => this.edit("topic", event)}>${this.topics.map((topic) => html`<acme-option .value=${topic.value}>${topic.label}</acme-option>`)}</acme-select></acme-field>` : nothing}<slot></slot>${this.error ? html`<acme-alert variant="error" role="alert">${this.error}</acme-alert>` : nothing}<div part="actions"><slot name="actions"><acme-button type="submit" .disabled=${this.pending && !this.submitting} .loading=${this.submitting}>${this.text("submit", "Send feedback")}</acme-button></slot></div></form></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-feedback": AcmeFeedback;
  }
}
