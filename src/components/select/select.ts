import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, boolish, paths, sharedCss } from "../../base";
import { Places } from "../../shared/places";
import { Interaction } from "../../shared/interaction";
import { selectCss } from "./select.styles";
import { selectLabelCss } from "./select-label.styles";
import "../error/error";
import { atomState } from "../../shared/atom-state";

export type SelectSize = "tiny" | "small" | "medium" | "large";
/** An option: its text, or a value with its label. */
export type SelectOption = string | { value: string; label: string; disabled?: boolean };

/** The end place's fallback: a chevron the place sizes to the control decoration size (14px). */
const chevron = html`<svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${paths["chev-d"]}></path></svg>`;

/**
 * A native select with a styled face. A relative flex wrapper holds the field (32 / 36 / 40px,
 * radius 6, large 8, a hairline ring) and, inside it at each side, a `start` place and an `end`
 * place. The end place holds a chevron unless something is slotted over it; `end="false"` leaves it
 * empty. Both places sit in the field's own box, so a select has no add-on places. Options
 * come from `<option>` children (an `<optgroup>` is kept) or the `options` property. The wrapper
 * carries the size, `error`, `disabled`, `variant="secondary"` (no ring, the field shifted left) and
 * cell modifiers, and the interaction states (data-hover; data-focus for any focus of the field).
 * `placeholder` is a disabled first option; a value equal to it reads gray. `label` renders the
 * text above the field (capitalized unless `bypass-casing`), `with-label="false"` drops the label
 * element around the field, `error` renders the message under it and marks the field invalid,
 * `width` sizes the label element and the message. Form-associated and labelable; `acme-change`
 * carries the value.
 */
@customElement("acme-select")
export class AcmeSelect extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    selectCss,
    selectLabelCss,
    css`
      :host {
        display: block;
      }
      .field {
        display: block;
      }
      /* The tier below small. The reference ships this size on its button only ("Tiny tertiary
         icon", 24px) and never on a select, so these rules are ours: the generated sheet is derived
         from the reference and carries no tiny. The medium default is written :not(.sm, .lg) there,
         so tiny has to out-specify it rather than rely on the cascade. */
      .wrap.tiny :where(select) {
        height: var(--acme-form-tiny-height);
        font-size: var(--acme-form-tiny-font);
        line-height: var(--acme-form-tiny-line-height);
        border-radius: 0.25rem;
        padding-inline: 0.5rem 1.75rem;
      }
      .wrap.tiny :where(.end) {
        right: 0.5rem;
      }
    `,
  ];
  /** The text above the field. */
  @property() label = "";
  /** The disabled first option; its text is its value. */
  @property() placeholder = "";
  @property() value = "";
  @property() name = "";
  /** `tiny` 24 / `small` 32 / `medium` 36 / `large` 40. */
  @property() size: SelectSize = "medium";
  /** `secondary`: no ring, gray-900 text, the field shifted 12px left. */
  @property() variant: "default" | "secondary" = "default";
  /** The message under the field; the field reads as invalid and its ring turns red. */
  @property() error = "";
  /** A fixed width for the label element and the message, as CSS. */
  @property() width = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  /** `"false"` leaves the end place empty, dropping the chevron. */
  @property({ converter: boolish }) end = true;
  /** `"false"` renders the field without the label element around it. */
  @property({ converter: boolish, attribute: "with-label" }) withLabel = true;
  /** Keeps the label text as written (no capitalization). */
  @property({ type: Boolean, attribute: "bypass-casing" }) bypassCasing = false;
  @property({ attribute: "aria-label" }) ariaLabelText = "";
  @property({ attribute: "aria-labelledby" }) ariaLabelledby = "";
  @property({ attribute: "aria-describedby" }) ariaDescribedby = "";
  /** Options set from script, in place of `<option>` children. */
  @property({ type: Array }) options: SelectOption[] = [];
  private places = new Places(this, { places: ["start"] });
  /** The `<option>` and `<optgroup>` children, cloned into the field. */
  @atomState() private lightOptions: HTMLElement[] = [];
  @query("select") select!: HTMLSelectElement;
  @query(".wrap") private wrap!: HTMLElement;
  private internals?: ElementInternals;
  private uid = `select-${Math.random().toString(36).slice(2, 8)}`;
  // Hover reaches a disabled field too (its rules leave it out themselves); the field's focus of any kind is the wrapper's focus.
  private interaction = new Interaction(this, { disabled: () => false, anyFocus: true });
  private lightWatch?: MutationObserver;
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
  }
  /** Reads the light DOM: the start place, and the option children. */
  private readLight = () => {
    this.lightOptions = Array.from(this.children).filter((c): c is HTMLElement => c.tagName === "OPTION" || c.tagName === "OPTGROUP");
  };
  // A place is rendered only while its slot has content, and the option children live in the light DOM, so
  // the light DOM is watched for content that arrives or changes later.
  connectedCallback() {
    super.connectedCallback();
    this.readLight();
    if (typeof MutationObserver !== "undefined") {
      this.lightWatch = new MutationObserver(() => {
        this.readLight();
        this.requestUpdate();
      });
      this.lightWatch.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.lightWatch?.disconnect();
  }
  firstUpdated() {
    this.readLight();
  }
  updated(ch: Map<string, unknown>) {
    this.interaction.attach(this.wrap);
    // The field shows the value, or the placeholder while there is none.
    const shown = this.value || this.placeholder;
    if (this.select && this.select.value !== shown) this.select.value = shown;
    if (ch.has("value") || ch.has("required")) {
      this.internals?.setFormValue?.(this.value);
      try {
        if (this.required && !this.value) this.internals?.setValidity?.({ valueMissing: true }, "Please select an item in the list.", this.select);
        else this.internals?.setValidity?.({});
      } catch {}
    }
  }
  formResetCallback() {
    this.value = this.getAttribute("value") ?? "";
  }
  private onChange = (e: Event) => {
    this.value = (e.target as HTMLSelectElement).value;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  };
  focus(options?: FocusOptions) {
    this.select?.focus(options);
  }
  private renderOption(o: SelectOption) {
    return typeof o === "string" ? html`<option value=${o}>${o}</option>` : html`<option value=${o.value} ?disabled=${o.disabled}>${o.label}</option>`;
  }
  render() {
    const errId = `${this.uid}-error`;
    const cls = this.cls("wrap", {
      tiny: this.size === "tiny",
      sm: this.size === "small",
      lg: this.size === "large",
      error: !!this.error,
      disabled: this.disabled,
      secondary: this.variant === "secondary",
      "has-start": this.places.has("start"),
      empty: !!this.placeholder && this.value === this.placeholder,
    });
    const wrap = html`<div class=${cls} part="wrap">
      ${this.places.has("start") ? html`<span class="start" aria-hidden="true"><slot name="start" @slotchange=${this.places.read}></slot></span>` : nothing}
      <select
        id=${this.uid}
        name=${this.name || nothing}
        ?disabled=${this.disabled}
        ?required=${this.required}
        aria-label=${this.ariaLabelText || nothing}
        aria-labelledby=${this.ariaLabelledby || nothing}
        aria-invalid=${this.error ? "true" : "false"}
        aria-describedby=${this.error ? errId : this.ariaDescribedby || nothing}
        @change=${this.onChange}
        part="select"
      >
        ${this.placeholder ? html`<option class="ph" disabled value=${this.placeholder} label=${this.placeholder}>${this.placeholder}</option>` : nothing}
        ${this.lightOptions.length ? this.lightOptions.map((o) => o.cloneNode(true)) : this.options.map((o) => this.renderOption(o))}
      </select>
      ${this.end ? html`<span class="end" aria-hidden="true"><slot name="end" @slotchange=${this.readLight}>${chevron}</slot></span>` : nothing}
    </div>`;
    const message = this.error
      ? html`<acme-error id=${errId} size=${this.size === "large" ? "large" : "small"} style=${`margin-top:8px${this.width ? `;width:${this.width}` : ""}`}>${this.error}</acme-error>`
      : nothing;
    if (!this.withLabel) return html`${wrap}${message}`;
    return html`<label class=${this.cls("field", { raw: this.bypassCasing })} for=${this.uid} style=${this.width ? `width:${this.width}` : nothing} part="field">
      ${this.label ? html`<div class="text">${this.label}</div>` : nothing}
      ${wrap}${message}
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-select": AcmeSelect;
  }
}
