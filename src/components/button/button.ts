import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { buttonCss } from "./button.styles";
import "../spinner/spinner";
import { atomState } from "../../shared/atom-state";

/** `default` is the primary look (gray-1000); `custom` takes its colors from `normal`, `hover` and `active`; `unstyled` is only the reset and the label, for a control that draws its own look. */
export type ButtonVariant = "default" | "primary" | "secondary" | "tertiary" | "error" | "warning" | "custom" | "unstyled";
export type ButtonSize = "tiny" | "small" | "medium" | "large";
/** Colors for the `custom` variant, one set per state. */
export type ButtonColors = {
  foreground?: string;
  background?: string;
  border?: string;
};

const customVars = (suffix: string, c?: ButtonColors) =>
  c
    ? [c.foreground && `--button-custom-fg${suffix}:${c.foreground}`, c.background && `--button-custom-bg${suffix}:${c.background}`, c.border && `--button-custom-border${suffix}:${c.border}`].filter(
        Boolean,
      )
    : [];

/**
 * Button. The root carries the interaction states (data-hover, data-focus, data-active),
 * data-prefix and data-suffix, and the icon size variable; the label sits in its own span; a
 * prefix span appears with a prefix or the loading spinner (a loading button is disabled);
 * `href` renders an anchor with role="link". Sizes tiny 24 / small 32 / medium 36 / large 40; variants default (primary),
 * secondary, tertiary, error, warning, custom; shapes square, circle, rounded; svg-only for icon
 * buttons, which need an aria-label.
 */
@customElement("acme-button")
export class AcmeButton extends AcmeElement {
  /** Focus on the host lands on the inner control. */
  static shadowRootOptions = { ...AcmeElement.shadowRootOptions, delegatesFocus: true };
  static styles = [
    sharedCss,
    buttonCss,
    css`
      :host {
        display: inline-flex;
        max-width: 100%;
      }
      :host([block]) {
        display: flex;
      }
      :host([block]) .btn {
        width: 100%;
      }
    `,
  ];
  /** default (primary, gray-1000) · secondary (white with a ring) · tertiary (transparent) · error · warning · custom. The default is the primary look, as in the reference. */
  @property() variant: ButtonVariant = "default";
  @property() size: ButtonSize = "medium";
  /** square or circle for icon-only buttons; rounded is the marketing pill. */
  @property() shape: "square" | "circle" | "rounded" | "" = "";
  /** Icon-only: no label padding, width equals height. Needs an `aria-label`. */
  @property({ type: Boolean, attribute: "svg-only" }) svgOnly = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Shows the spinner in the prefix and disables the button. */
  @property({ type: Boolean }) loading = false;
  /** Alias of `shape="rounded"`. */
  @property({ type: Boolean }) rounded = false;
  /** The inset ring instead of a border, for the rounded marketing pill. */
  @property({ type: Boolean }) shadow = false;
  /** Full width (house). */
  @property({ type: Boolean, reflect: true }) block = false;
  /** A fixed width in px (min and max). */
  @property({ type: Number }) width = 0;
  /** Renders an anchor. */
  @property() href = "";
  /** The anchor's target and rel; a target opens the link there. */
  @property() target = "";
  @property() rel = "";
  /** The HTML button type. */
  @property() type: "button" | "submit" | "reset" = "button";
  /** `custom` colors at rest: `{ "foreground": "#fff", "background": "var(--ds-blue-700)", "border": "…" }`. */
  @property({ type: Object }) normal?: ButtonColors;
  /** `custom` colors on hover. */
  @property({ type: Object }) hover?: ButtonColors;
  /** `custom` colors while pressed. */
  @property({ type: Object }) active?: ButtonColors;
  @property({ attribute: "aria-label" }) label = "";
  /** Forwarded to the inner control, for a button that opens a menu or a popover. */
  @property({ attribute: "aria-haspopup" }) haspopup = "";
  @property({ attribute: "aria-expanded" }) expanded = "";
  @property({ attribute: "aria-controls" }) controls = "";
  @atomState() private hasPrefix = false;
  @atomState() private hasSuffix = false;
  /** The default slot holds elements only (an icon), no text. */
  @atomState() private elementChild = false;
  @query(".btn") private root!: HTMLElement;
  private interaction = new Interaction(this, {
    disabled: () => this.disabled || this.loading,
  });

  connectedCallback() {
    super.connectedCallback();
    // Slotted prefix and suffix are known before the first render (slotchange keeps them current).
    this.hasPrefix = !!this.querySelector('[slot="prefix"]');
    this.hasSuffix = !!this.querySelector('[slot="suffix"]');
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.hasPrefix ||= !!this.querySelector('[slot="prefix"]');
    this.hasSuffix ||= !!this.querySelector('[slot="suffix"]');
    const content = [...this.childNodes].filter((n) => (n.nodeType === 1 && !(n as Element).hasAttribute("slot")) || (n.nodeType === 3 && (n.textContent ?? "").trim()));
    this.elementChild = content.length > 0 && content.every((n) => n.nodeType === 1);
  }

  updated() {
    this.interaction.attach(this.root);
  }

  /** The label is a flex box when its content is elements only, the way an icon child renders. */
  private slottedContent = (e: Event) => {
    const nodes = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).filter((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    this.elementChild = nodes.length > 0 && nodes.every((n) => n.nodeType === 1);
  };

  private slotted = (name: "prefix" | "suffix") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    if (name === "prefix") this.hasPrefix = has;
    else this.hasSuffix = has;
  };

  render() {
    const iconOnly = this.svgOnly || this.shape === "square" || this.shape === "circle";
    const c = this.cls("btn", {
      secondary: this.variant === "secondary",
      tertiary: this.variant === "tertiary",
      error: this.variant === "error",
      warning: this.variant === "warning",
      custom: this.variant === "custom",
      unstyled: this.variant === "unstyled",
      tiny: this.size === "tiny",
      sm: this.size === "small",
      lg: this.size === "large",
      square: this.shape === "square",
      circle: this.shape === "circle",
      rounded: this.rounded || this.shape === "rounded",
      shadow: this.shadow,
      icon: iconOnly,
      loading: this.loading,
      link: !!this.href,
      el: this.elementChild && !iconOnly,
    });
    const style = [
      ...(this.width ? [`min-width:${this.width}px`, `max-width:${this.width}px`] : []),
      ...customVars("", this.normal),
      ...customVars("-hover", this.hover),
      ...customVars("-active", this.active),
      "--acme-icon-size:16px",
    ].join(";");
    const spinnerSize = this.size === "large" ? "lg" : this.size === "medium" ? "md" : "sm";
    const prefixSlot = html`<slot
      name="prefix"
      @slotchange=${this.slotted("prefix")}
    ></slot>`;
    const suffixSlot = html`<slot
      name="suffix"
      @slotchange=${this.slotted("suffix")}
    ></slot>`;
    const prefix = this.loading
      ? html`<span class="prefix" aria-hidden="true"
          ><acme-spinner size=${spinnerSize}></acme-spinner>${prefixSlot}</span
        >`
      : this.hasPrefix
        ? html`<span class="prefix">${prefixSlot}</span>`
        : prefixSlot;
    const suffix = this.hasSuffix ? html`<span class="suffix">${suffixSlot}</span>` : suffixSlot;
    const inner = html`${prefix}<span class="label"><slot @slotchange=${this.slottedContent}></slot></span
      >${suffix}`;
    const shared = {
      "data-prefix": String(this.hasPrefix || this.loading),
      "data-suffix": String(this.hasSuffix),
      "data-custom-button": this.variant === "custom" ? "" : nothing,
      "aria-label": this.label || nothing,
    };
    if (this.href)
      return html`<a
        class=${c}
        style=${style}
        href=${this.href}
        target=${this.target || nothing}
        rel=${this.rel || nothing}
        role="link"
        tabindex="0"
        data-prefix=${shared["data-prefix"]}
        data-suffix=${shared["data-suffix"]}
        data-custom-button=${shared["data-custom-button"]}
        aria-label=${shared["aria-label"]}
        aria-disabled=${this.disabled ? "true" : nothing}
        aria-haspopup=${this.haspopup || nothing}
        aria-expanded=${this.expanded || nothing}
        aria-controls=${this.controls || nothing}
        part="button"
        >${inner}</a
      >`;
    return html`<button
      class=${c}
      style=${style}
      type=${this.type}
      tabindex="0"
      ?disabled=${this.disabled || this.loading}
      aria-busy=${this.loading ? "true" : nothing}
      data-prefix=${shared["data-prefix"]}
      data-suffix=${shared["data-suffix"]}
      data-custom-button=${shared["data-custom-button"]}
      aria-label=${shared["aria-label"]}
      aria-haspopup=${this.haspopup || nothing}
      aria-expanded=${this.expanded || nothing}
      aria-controls=${this.controls || nothing}
      part="button"
    >
      ${inner}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-button": AcmeButton;
  }
}
