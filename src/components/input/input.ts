import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { inputCss } from "./input.styles";
import { inputLabelCss } from "./input-label.styles";
import "../error/error";
import { atomState } from "../../shared/atom-state";

export type InputSize = "small" | "medium" | "large";

/** A boolean that is true unless the attribute says `"false"`, for props that default to true. */
/** The four places around the field, in the order the wrapper lays them out. */
const PLACES = ["start-addon", "start", "end-addon", "end"] as const;

/**
 * A single-line text field. A flex wrapper (32 / 36 / 40px, radius 6, large 8) holds the field and
 * up to four places around it, each a slot:
 *
 *   `start-addon` / `end-addon`  attached to the outside of the field: its own ground, and a
 *                                hairline where the two meet.
 *   `start` / `end`              inside the field's own box: the field's ground, no line.
 *
 * A place is where a thing sits, not what it holds, so every slot takes text or an element alike.
 *
 * The wrapper carries the size, `error`, `rounded`, the occupied places, and the interaction states
 * (data-hover, data-focus: focus within the field, data-active). `label` renders the text above the
 * field; `error` renders the message under it and marks the field invalid. Form-associated and
 * labelable.
 */
@customElement("acme-input")
export class AcmeInput extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    inputCss,
    inputLabelCss,
    css`
      /* A flex column: the wrapper is its flex item, as it is in the stacks the field usually sits in, and fills the host width. */
      :host {
        display: flex;
        flex-direction: column;
      }
      .field {
        display: block;
      }
    `,
  ];
  /** The text above the field. */
  @property() label = "";
  @property() placeholder = "";
  @property() value = "";
  @property() type = "text";
  @property() name = "";
  @property() size: InputSize = "medium";
  /** The message under the field; the wrapper turns red and the field reads as invalid. */
  @property() error = "";
  /** The pill shape. */
  @property({ type: Boolean }) rounded = false;
  /** Set by a clearable field: the end place loses its right padding. */
  @property({ type: Boolean }) clearable = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property() autocomplete = "off";
  /** A fixed width for the wrapper, as CSS. */
  @property() width = "";
  @property({ attribute: "aria-label" }) ariaLabelText = "";
  @property({ attribute: "aria-labelledby" }) ariaLabelledby = "";
  /** The occupied places, read from the light DOM. */
  @atomState() private filled = { "start-addon": false, start: false, "end-addon": false, end: false };
  @query("input") input!: HTMLInputElement;
  @query(".wrap") private wrap!: HTMLElement;
  private internals?: ElementInternals;
  private uid = `input-${Math.random().toString(36).slice(2, 8)}`;
  // Hover reaches a disabled field too (its own ring), so the controller never holds it back.
  private interaction = new Interaction(this, { disabled: () => false });
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
  }
  private readSlots() {
    this.filled = Object.fromEntries(PLACES.map((n) => [n, !!this.querySelector(`[slot="${n}"]`)])) as typeof this.filled;
  }
  // A place is rendered only while it has content, because the wrapper's rules address its children by
  // position: an empty slot would take the place of the one that follows it. The light DOM is watched
  // so content that arrives later still lands.
  private slotWatch?: MutationObserver;
  connectedCallback() {
    super.connectedCallback();
    this.readSlots();
    if (typeof MutationObserver !== "undefined") {
      this.slotWatch = new MutationObserver(() => this.readSlots());
      this.slotWatch.observe(this, { childList: true });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.slotWatch?.disconnect();
  }
  firstUpdated() {
    this.readSlots();
  }
  updated(ch: Map<string, unknown>) {
    this.interaction.attach(this.wrap);
    if (ch.has("value")) this.internals?.setFormValue?.(this.value);
  }
  formResetCallback() {
    this.value = this.getAttribute("value") ?? "";
  }
  private onInput = (e: Event) => {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent("acme-input", { detail: { value: this.value }, bubbles: true, composed: true }));
  };
  private onChange = () => this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }
  render() {
    const f = this.filled;
    const iconSize = this.size === "large" ? 24 : 16;
    const cls = this.cls("wrap", {
      sm: this.size === "small",
      lg: this.size === "large",
      error: !!this.error,
      rounded: this.rounded,
      "has-start": f["start-addon"] || f.start,
      "has-end": f["end-addon"] || f.end,
      // A side renders one cell, and an add-on takes it: the inside class follows what rendered, so
      // filling both places on one side reads as the add-on rather than as a contradiction.
      "start-inside": f.start && !f["start-addon"],
      "end-inside": f.end && !f["end-addon"],
      clearable: this.clearable,
    });
    const style = [`--acme-icon-size:${iconSize}px`, ...(this.width ? [`width:${this.width}`] : [])].join(";");
    // Both places on a side are the same cell. Which one is occupied decides only the ground and the
    // hairline, and the wrapper carries that as `start-inside` / `end-inside`.
    const cell = (side: "start" | "end") => {
      const name = f[`${side}-addon`] ? (`${side}-addon` as const) : f[side] ? side : null;
      return name === null ? nothing : html`<label class=${side} aria-hidden="true" for=${this.uid}><slot name=${name} @slotchange=${this.readSlots}></slot></label>`;
    };
    const wrap = html`<div class=${cls} style=${style} part="wrap">
      <input
        id=${this.uid}
        type=${this.type}
        .value=${this.value}
        placeholder=${this.placeholder || nothing}
        name=${this.name || nothing}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        autocomplete=${this.autocomplete || nothing}
        autocapitalize="none"
        autocorrect="off"
        spellcheck="false"
        aria-label=${this.ariaLabelText || nothing}
        aria-labelledby=${this.ariaLabelledby || nothing}
        aria-invalid=${this.error ? "true" : "false"}
        @input=${this.onInput}
        @change=${this.onChange}
        part="input"
      />
      ${cell("start")}${cell("end")}
    </div>`;
    const field = this.label ? html`<label class="field" for=${this.uid}><div class="text">${this.label}</div>${wrap}</label>` : wrap;
    // The error line is small for every size but large, as the reference sizes it.
    return this.error ? html`<div>${field}<acme-error size=${this.size === "large" ? "large" : "small"} style="margin-top:var(--acme-gap-quarter)">${this.error}</acme-error></div>` : field;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-input": AcmeInput;
  }
}
