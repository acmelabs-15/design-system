import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { switchControlCss } from "./switch-control.styles";

/**
 * One option of an acme-switch: a visually hidden radio and a padded label box. The root carries
 * the interaction states (data-hover, data-focus, data-active) and the own states (data-checked,
 * data-disabled); the box holds the text, or the `icon` slot with the text read to screen readers
 * only. The icon is sized 16px, 20px in a large control. A control directly inside a group takes
 * the group's size; a wrapped one (a tooltip) uses its own.
 */
@customElement("acme-switch-control")
export class AcmeSwitchControl extends AcmeElement {
  static styles = [
    sharedCss,
    switchControlCss,
    css`
      /* The host takes the root's place among the group's flex items: it grows with its siblings and stretches to the group's height; the root fills it. */
      :host {
        display: flex;
        flex: 1 1 0%;
        align-self: stretch;
      }
    `,
  ];
  @property() value = "";
  /** The text; read to screen readers when the `icon` slot carries the meaning. */
  @property() label = "";
  /** Own radio name; the group's name wins inside a group. */
  @property() name = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  /** Checked on first mount; the group then owns the state. */
  @property({ type: Boolean, attribute: "default-checked" }) defaultChecked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Own size, for a control the group does not reach directly. */
  @property() size: "" | "small" | "medium" | "large" = "";
  /** Background of the box when checked (default gray-100). */
  @property({ attribute: "checked-color" }) checkedColor = "";
  @state() groupSize: "small" | "medium" | "large" = "medium";
  @state() groupName = "";
  @state() groupCheckedColor = "";
  @state() private hasIcon = false;
  @query(".switch-control") private root!: HTMLElement;
  @query("input") private input!: HTMLInputElement;
  private interaction = new Interaction(this, { disabled: () => this.disabled });
  connectedCallback() {
    super.connectedCallback();
    if (this.defaultChecked) this.checked = true;
    this.hasIcon = !!this.querySelector('[slot="icon"]');
  }
  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses the icon at connect.
    this.hasIcon ||= !!this.querySelector('[slot="icon"]');
  }
  focus() {
    this.input?.focus();
  }
  private get inGroup() {
    return this.parentElement?.localName === "acme-switch";
  }
  private get effectiveSize() {
    return this.inGroup ? this.groupSize : this.size || "medium";
  }
  private get text() {
    return this.label || this.textContent?.trim() || "";
  }
  /** The slotted icon takes the control's icon size, as its width and height attributes. */
  private sizeIcon() {
    const px = this.effectiveSize === "large" ? "20" : "16";
    for (const svg of this.querySelectorAll(':scope > [slot="icon"]')) {
      svg.setAttribute("width", px);
      svg.setAttribute("height", px);
    }
  }
  updated() {
    this.interaction.attach(this.root);
    this.sizeIcon();
  }
  private onIconSlot = (e: Event) => {
    this.hasIcon = (e.target as HTMLSlotElement).assignedElements().length > 0;
    this.sizeIcon();
  };
  private onChange = () => {
    this.checked = true;
    this.dispatchEvent(new CustomEvent("acme-switch-select", { detail: this, bubbles: true, composed: true }));
  };
  render() {
    const size = this.effectiveSize;
    const color = this.checkedColor || this.groupCheckedColor || "var(--ds-gray-100)";
    return html`<label
      class=${this.cls("switch-control", { sm: size === "small", lg: size === "large", icon: this.hasIcon })}
      data-checked=${this.checked ? "" : nothing}
      data-disabled=${this.disabled ? "" : nothing}
      part="control"
    >
      <input
        type="radio"
        name=${this.groupName || this.name || nothing}
        value=${this.value}
        .checked=${this.checked}
        ?disabled=${this.disabled}
        tabindex=${this.checked ? 0 : -1}
        aria-label=${this.hasIcon ? this.text || this.value : nothing}
        @change=${this.onChange}
      />
      <div class="label" style="--switch-checked-color:${color}">
        <slot name="icon" @slotchange=${this.onIconSlot}></slot>
        ${this.hasIcon ? html`<span class="sr">${this.text}</span>` : html`<slot>${this.label}</slot>`}
      </div>
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-switch-control": AcmeSwitchControl;
  }
}
