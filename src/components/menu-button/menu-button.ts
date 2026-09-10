import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { glyphSized } from "../../base";
import { atomState } from "../../shared/atom-state";
import { AcmeButton, type ButtonColors } from "../button/button";
import { menuButtonCss } from "./menu-button.styles";

const customVars = (suffix: string, c?: ButtonColors) =>
  c
    ? [c.foreground && `--button-custom-fg${suffix}:${c.foreground}`, c.background && `--button-custom-bg${suffix}:${c.background}`, c.border && `--button-custom-border${suffix}:${c.border}`].filter(
        Boolean,
      )
    : [];

/**
 * The button that opens a menu: an `acme-button` placed in the `trigger` slot of an `acme-menu`,
 * which sets `open` and the ARIA attributes on it. Takes every button property. The label holds
 * the content in a full-width row; `show-chevron` ends it with a chevron that turns while the
 * menu is open, and on the secondary variant the hovered trigger keeps a white fill and reads the
 * chevron in gray-1000. An icon-only trigger (an element as its content, or `svg-only`) is named
 * "Menu" unless `aria-label` says otherwise and reads gray-400 while the menu is open.
 * `variant="unstyled"` (or `type="unstyled"`) is a bare reset button around custom content (an
 * avatar), its label flush.
 */
@customElement("acme-menu-button")
export class AcmeMenuButton extends AcmeButton {
  static styles = [
    ...AcmeButton.styles,
    menuButtonCss,
    css`
      /* The trigger is a block child of its wrapper, as it is of the reference page: the button root keeps its own display and a zero min-width. */
      :host {
        display: inline-block;
      }
      :host([block]) {
        display: block;
      }
    `,
  ];
  /** A chevron at the end of the label that turns while the menu is open. */
  @property({ type: Boolean, attribute: "show-chevron" }) showChevron = false;
  /** Whether the menu is open: the menu keeps it in step. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** The content is elements only (an icon, an avatar), no text: the trigger is then icon-only. */
  @atomState() private elementOnly = false;

  connectedCallback() {
    super.connectedCallback();
    this.readContent();
  }

  firstUpdated() {
    super.firstUpdated();
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.readContent();
  }

  willUpdate() {
    // The reference spelling of the bare trigger.
    if ((this.type as string) === "unstyled") {
      this.variant = "unstyled";
      this.type = "button";
    }
  }

  private readContent() {
    this.hasStart ||= !!this.querySelector('[slot="start"]');
    this.hasEnd ||= !!this.querySelector('[slot="end"]');
    const content = [...this.childNodes].filter((n) => (n.nodeType === 1 && !(n as Element).hasAttribute("slot")) || (n.nodeType === 3 && (n.textContent ?? "").trim()));
    this.elementOnly = content.length > 0 && content.every((n) => n.nodeType === 1);
  }

  private content = (e: Event) => {
    const nodes = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).filter((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    this.elementOnly = nodes.length > 0 && nodes.every((n) => n.nodeType === 1);
  };

  private side = (name: "start" | "end") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    if (name === "start") this.hasStart = has;
    else this.hasEnd = has;
  };

  render() {
    const svgOnly = this.svgOnly || this.elementOnly;
    const iconOnly = svgOnly || this.shape === "square" || this.shape === "circle";
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
      // The bare trigger takes none of the button's own root rules.
      icon: iconOnly && this.variant !== "unstyled",
      "icon-only": svgOnly,
      loading: this.loading,
      chevron: this.showChevron,
      open: this.open,
    });
    const style = [
      ...(this.width ? [`min-width:${this.width}px`, `max-width:${this.width}px`] : []),
      ...customVars("", this.normal),
      ...customVars("-hover", this.hover),
      ...customVars("-active", this.active),
      "--acme-icon-size:16px",
    ].join(";");
    const spinnerSize = this.size === "large" ? "lg" : this.size === "medium" ? "md" : "sm";
    const startSlot = html`<slot name="start" @slotchange=${this.side("start")}></slot>`;
    const endSlot = html`<slot name="end" @slotchange=${this.side("end")}></slot>`;
    const start = this.loading
      ? html`<span class="start" aria-hidden="true"><acme-spinner size=${spinnerSize}></acme-spinner>${startSlot}</span>`
      : this.hasStart
        ? html`<span class="start">${startSlot}</span>`
        : startSlot;
    const end = this.hasEnd ? html`<span class="end">${endSlot}</span>` : endSlot;
    const chevron = this.showChevron ? html`<span class="chev" data-open=${String(this.open)}>${glyphSized("chev-d")}</span>` : nothing;
    const label = html`<span class="label"><span class="inner"><slot @slotchange=${this.content}></slot>${chevron}</span></span>`;
    return html`<button
      class=${c}
      style=${style}
      type=${this.type}
      tabindex="0"
      ?disabled=${this.disabled || this.loading}
      aria-busy=${this.loading ? "true" : nothing}
      aria-label=${this.label || (svgOnly ? "Menu" : nothing)}
      aria-haspopup=${this.haspopup || nothing}
      aria-expanded=${this.expanded || nothing}
      aria-controls=${this.controls || nothing}
      data-is-open=${String(this.open)}
      data-custom-button=${this.variant === "custom" ? "" : nothing}
      part="button"
    >
      ${start}${label}${end}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-menu-button": AcmeMenuButton;
  }
}
