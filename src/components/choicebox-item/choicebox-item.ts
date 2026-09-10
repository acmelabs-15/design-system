import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { choiceboxItemCss } from "./choicebox-item.styles";
import "../checkbox/checkbox";
import "../radio/radio";
import "../tooltip/tooltip";

/**
 * One tile of an acme-choicebox: a bordered list item whose whole face is the label of its
 * control, a composed acme-radio or acme-checkbox at the row's end (or its start, set by the
 * group). The row holds the 14px title and description; a selected tile turns blue (border,
 * row background, text, control) and shows its slotted content under a divider. Hover and
 * press states are the tile's, keyed off attributes the Interaction controller sets
 * (data-hover, data-active, data-focus, data-focus-within); the selection and disabled states
 * are reflected off the group (data-checked, data-disabled). A disabled tile shows
 * `disabled-reason` in a tooltip; `interactive-content` renders the content beside the label,
 * so clicks inside it do not toggle the tile. The tile is a flex item of the group's row and
 * takes an equal share of it. Slot: default (the content shown while selected).
 */
@customElement("acme-choicebox-item")
export class AcmeChoiceboxItem extends AcmeElement {
  static styles = [
    sharedCss,
    choiceboxItemCss,
    css`
      /* The host is the row's flex item (its share is mirrored from the tile); a column, so the tile fills it. */
      :host {
        display: flex;
        flex-direction: column;
      }
    `,
  ];
  /** The tile's title (the `title` attribute is read into this property and removed, so no tooltip shows). */
  @property({ attribute: "title" }) heading = "";
  @property() description = "";
  @property() value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Shown in a tooltip over a disabled tile. */
  @property({ attribute: "disabled-reason" }) disabledReason = "";
  /** The content sits beside the label: clicks inside it do not toggle the tile. */
  @property({ type: Boolean, attribute: "interactive-content" }) interactiveContent = false;
  /** Set by the group: the tile is chosen. */
  @property({ type: Boolean, reflect: true }) checked = false;
  /** Set by the group: radio or checkbox. */
  @property({ attribute: false }) type: "radio" | "checkbox" = "radio";
  /** Set by the group: the shared input name. */
  @property({ attribute: false }) name = "";
  /** Set by the group: the whole group is disabled. */
  @property({ attribute: false }) groupDisabled = false;
  /** Set by the group: where the control sits in the row. */
  @property({ attribute: false }) controlPosition: "start" | "end" = "end";
  /** Set by the group: off the Tab sequence (roving tabindex); arrow keys reach it. */
  @property({ attribute: false }) skipTab = false;
  @state() private hasContent = false;
  @query(".tile") private tile!: HTMLElement;
  @query("acme-radio, acme-checkbox") private control!: HTMLElement & { focus(): void };
  private interaction = new Interaction(this, { disabled: () => this.off });
  /** The radio control's own hover (the box reacts to the pointer over it, not over the whole tile). */
  private controlInteraction = new Interaction(this, { disabled: () => this.off });
  get off() {
    return this.disabled || this.groupDisabled;
  }
  attributeChangedCallback(name: string, old: string | null, val: string | null) {
    if (name === "title") {
      if (val !== null) {
        this.heading = val;
        this.removeAttribute("title");
      }
      return;
    }
    super.attributeChangedCallback(name, old, val);
  }
  connectedCallback() {
    super.connectedCallback();
    this.hasContent = this.hasChildren();
  }
  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.hasContent ||= this.hasChildren();
  }
  private hasChildren() {
    return Array.from(this.childNodes).some((n) => n.nodeType === 1 || (n.nodeType === 3 && !!n.textContent?.trim()));
  }
  private onSlot = (e: Event) => {
    this.hasContent = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
  };
  focus() {
    this.control?.focus();
  }
  updated() {
    this.interaction.attach(this.tile);
    this.controlInteraction.attach(this.type === "radio" ? this.control : null);
  }
  /** The control changed: the tile reports its value and state, and the control's own event stops here. */
  private onControl = (e: Event) => {
    e.stopPropagation();
    const d = (e as CustomEvent).detail ?? {};
    this.checked = this.type === "radio" ? true : !!d.checked;
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { value: this.value, checked: this.checked }, bubbles: true, composed: true }));
  };
  render() {
    const off = this.off;
    const open = this.checked && this.hasContent;
    const label = this.description ? `${this.heading} ${this.description}` : this.heading;
    const control =
      this.type === "radio"
        ? html`<acme-radio .checked=${this.checked} ?disabled=${off} .skipTab=${this.skipTab} name=${this.name || nothing} value=${this.value} aria-label=${label} @acme-change=${this.onControl}></acme-radio>`
        : html`<acme-checkbox .checked=${this.checked} ?disabled=${off} name=${this.name || nothing} value=${this.value} aria-label=${label} @acme-change=${this.onControl}></acme-checkbox>`;
    const text = html`<span class="text"><span class="title">${this.heading}</span><span class="description">${this.description || nothing}</span></span>`;
    const option = html`<div class="option">${this.controlPosition === "start" ? html`${control}${text}` : html`${text}${control}`}</div>`;
    const slot = html`<slot @slotchange=${this.onSlot}></slot>`;
    const body = html`<label class="body" part="body">${option}${this.interactiveContent ? nothing : html`<span class="content" ?hidden=${!open}>${slot}</span>`}</label>`;
    return html`<li
      class=${this.cls("tile", { start: this.controlPosition === "start", interactive: this.interactiveContent, open })}
      data-checked=${this.checked ? "" : nothing}
      data-disabled=${off ? "" : nothing}
      part="tile"
    >
      ${off && this.disabledReason ? html`<acme-tooltip text=${this.disabledReason}>${body}</acme-tooltip>` : body}${this.interactiveContent ? html`<div class="panel" ?hidden=${!open}>${slot}</div>` : nothing}
    </li>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-choicebox-item": AcmeChoiceboxItem;
  }
}
