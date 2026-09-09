import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { buttonCss } from "../button/button.styles.js";
import { feedbackCss } from "./feedback.styles.js";

/** Geist Feedback: an emoji plus text, desktop only. `inline` renders the pill; otherwise a button opens the panel. */
@customElement("acme-feedback")
export class AcmeFeedback extends AcmeElement {
  static styles = [
    sharedCss,
    feedbackCss,
    buttonCss,
    css`:host{display:inline-block;position:relative} .feedback-panel{position:absolute;right:0;top:calc(100% + 8px);z-index:20} :host([static]) .feedback-panel{position:static}`,
  ];
  @property() label = "Feedback";
  @property() prompt = "Was this helpful?";
  @property({ type: Boolean }) inline = false;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) static = false;
  private emotion = "";
  private text = "";
  private emojis: [string, string][] = [
    ["🤩", "Love it"],
    ["🙂", "Like it"],
    ["😕", "Meh"],
    ["😭", "Hate it"],
  ];
  private send() {
    this.dispatchEvent(new CustomEvent("acme-submit", { detail: { emotion: this.emotion, text: this.text }, bubbles: true, composed: true }));
    this.open = false;
    this.text = "";
    this.emotion = "";
  }
  private radios() {
    return this.emojis.map(
      ([e, l]) =>
        html`<button class="emoji" role="radio" aria-checked=${this.emotion === l} aria-label=${`Select ${l} emoji`} @click=${() => {
          this.emotion = l;
          this.open = true;
          this.requestUpdate();
        }}>${e}</button>`,
    );
  }
  render() {
    const panel = html`<div class="feedback-panel"><div class="head"><span class="prompt">${this.prompt}</span>${this.radios()}</div><div class="body"><textarea placeholder="Your feedback..." aria-label="Your feedback" .value=${this.text} @input=${(
      e: Event,
    ) => {
      this.text = (e.target as HTMLTextAreaElement).value;
    }}></textarea><div class="hint">${glyph("info", "ic")}Markdown supported.</div></div><div class="foot"><button class="btn primary" @click=${this.send}>Send</button></div></div>`;
    if (this.inline)
      return html`<div class="feedback" role="radiogroup" aria-label=${this.prompt}><span class="prompt">${this.prompt}</span>${this.radios()}</div>${this.open || this.static ? panel : nothing}`;
    return html`<button class="btn sm" aria-expanded=${this.open} @click=${() => {
      this.open = !this.open;
    }}><slot name="prefix"></slot>${this.label}<slot name="suffix"></slot></button>${this.open || this.static ? panel : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-feedback": AcmeFeedback;
  }
}
