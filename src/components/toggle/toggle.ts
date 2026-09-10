import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { toggleCss } from "./toggle.styles";

export type ToggleSize = "small" | "medium" | "large";
export type ToggleColor = "" | "amber" | "amber-inverted" | "red" | "amber-track-only";

/** Color presets as the four variables the track and thumb read: track, thumb icon (dark), thumb icon (light), track when checked. */
const COLORS: Record<Exclude<ToggleColor, "">, [string, string, string, string]> = {
  amber: ["--ds-amber-700", "--ds-amber-100", "--ds-amber-1000", "--ds-gray-100"],
  "amber-inverted": ["--ds-gray-100", "--ds-gray-100", "--ds-amber-1000", "--ds-amber-700"],
  red: ["--ds-red-600", "--ds-red-100", "--ds-red-1000", "--ds-gray-100"],
  "amber-track-only": ["--ds-amber-700", "--ds-black", "--ds-black", "--ds-gray-100"],
};

/**
 * A boolean switch: a label root with the text (12px, capitalized), a visually hidden checkbox
 * with the switch role, a track and a thumb that slides when checked. Sizes small 28×14 /
 * medium 36×20 / large 40×24; `color` presets amber and red for the track; the `icon-checked`
 * and `icon-unchecked` slots draw an icon in the thumb. The root carries the interaction states
 * (data-hover, data-focus, data-active) and the own states (data-checked, data-disabled).
 * Form-associated and labelable.
 */
@customElement("acme-toggle")
export class AcmeToggle extends AcmeElement {
  static formAssociated = true;
  static styles = [
    sharedCss,
    toggleCss,
    css`
      /* An inline flex box, as the root is: the host sits on the line the root would, and the root fills it. */
      :host {
        display: inline-flex;
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() size: ToggleSize = "small";
  @property() color: ToggleColor = "";
  /** `switch-first` puts the switch before the text. */
  @property() direction: "label-first" | "switch-first" = "label-first";
  /** `title` capitalizes the text; `normal` keeps its case. */
  @property({ attribute: "label-casing" }) labelCasing: "title" | "normal" = "title";
  /** Drops the track's margin. */
  @property({ type: Boolean, attribute: "no-margin" }) noMargin = false;
  @property() name = "";
  @property() value = "on";
  /** Accessible name when the toggle has no text of its own. */
  @property({ attribute: "aria-label" }) label = "";
  @state() private hasText = false;
  @state() private hasIcon = false;
  @query(".toggle") private root!: HTMLElement;
  @query("input") private input!: HTMLInputElement;
  private internals?: ElementInternals;
  private interaction = new Interaction(this, { disabled: () => this.disabled });
  constructor() {
    super();
    try {
      this.internals = this.attachInternals();
    } catch {}
    // A click sent to the host itself (an outer label) flips the switch; clicks inside the root already reach it.
    this.addEventListener("click", (e) => {
      if (!e.composedPath().includes(this.root) && !this.disabled) this.input?.click();
    });
  }
  private readLight() {
    this.hasText = Array.from(this.childNodes).some((n) => (n.nodeType === 3 && (n.textContent ?? "").trim()) || (n.nodeType === 1 && !(n as Element).hasAttribute("slot")));
    this.hasIcon = !!this.querySelector('[slot="icon-checked"], [slot="icon-unchecked"]');
  }
  connectedCallback() {
    super.connectedCallback();
    this.readLight();
  }
  firstUpdated() {
    this.readLight();
  }
  focus() {
    this.input?.focus();
  }
  updated(ch: Map<string, unknown>) {
    this.interaction.attach(this.root);
    if (ch.has("checked") || ch.has("value")) this.internals?.setFormValue?.(this.checked ? this.value : null);
  }
  formResetCallback() {
    this.checked = this.hasAttribute("checked");
  }
  private onChange = (e: Event) => {
    this.checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: this.checked }, bubbles: true, composed: true }));
  };
  render() {
    const c = this.color ? COLORS[this.color] : undefined;
    const style = c
      ? `--unchecked-bg-color-override:var(${c[0]});--checked-bg-color-override:var(${c[3]});--thumb-fg-color-override:var(${c[1]});--thumb-light-fg-color-override:var(${c[2]});-webkit-tap-highlight-color:transparent`
      : nothing;
    return html`<label
      class=${this.cls("toggle", { md: this.size === "medium", lg: this.size === "large", colored: !!this.color, "switch-first": this.direction === "switch-first", normal: this.labelCasing === "normal", "no-margin": this.noMargin })}
      style=${style}
      data-checked=${this.checked ? "" : nothing}
      data-disabled=${this.disabled ? "" : nothing}
      part="toggle"
      >${this.hasText ? html`<span class="text"><slot @slotchange=${() => this.readLight()}></slot></span>` : html`<slot @slotchange=${() => this.readLight()}></slot>`}<input
        type="checkbox"
        role="switch"
        .checked=${this.checked}
        ?disabled=${this.disabled}
        name=${this.name || nothing}
        value=${this.value}
        aria-label=${this.label || nothing}
        @change=${this.onChange}
      /><span class="track"
        ><div class="thumb">
          ${this.hasIcon ? html`<div class="icon" aria-hidden="true"><slot name=${this.checked ? "icon-checked" : "icon-unchecked"}></slot></div>` : nothing}
        </div></span
      ></label
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-toggle": AcmeToggle;
  }
}
