import { noteStructureCss } from "../../generated/components/note/note-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { noteCss } from "../../generated/components/note/note.styles";

export type NoteVariant = "" | "success" | "error" | "warning" | "secondary" | "violet" | "cyan";

const noteIcons = {
  "": html`<acme-info-icon size="14px"></acme-info-icon>`,
  success: html`<acme-check-icon size="14px"></acme-check-icon>`,
  error: html`<acme-error-icon size="14px"></acme-error-icon>`,
  warning: html`<acme-warning-icon size="14px"></acme-warning-icon>`,
  secondary: html`<acme-info-icon size="14px"></acme-info-icon>`,
  violet: html`<acme-info-icon size="14px"></acme-info-icon>`,
  cyan: html`<acme-info-icon size="14px"></acme-info-icon>`,
};

/**
 * Note: a short inline message beside the thing it describes. The root carries the variant, fill,
 * size and disabled modifiers; the body holds the icon and the content column; an action wrapper
 * appears when an action is slotted and rounds the corners to 10px. Slots: default (the content),
 * `label` (a bold prefix), `icon` (replaces the variant's icon), `action` (one small button, which
 * a disabled note disables too).
 */

export class AcmeNote extends AcmeElement {
  static styles = [sharedCss, noteCss, noteStructureCss];
  /** Meaning: `error`, `warning`, `success`, `secondary`, `violet`, `cyan`; unset is the default info note. */
  @property() variant: NoteVariant = "";
  /** Tinted background with a lighter border. */
  @property({ type: Boolean }) fill = false;
  @property() size: "small" | "medium" = "medium";
  /** Gray-700 text and border, transparent background; the slotted action button is disabled too. */
  @property({ type: Boolean }) disabled = false;
  /** No icon at all. */
  @property({ type: Boolean, attribute: "no-icon" }) noIcon = false;
  @atomState() private hasAction = false;
  @atomState() private hasLabel = false;
  @atomState() private hasIcon = false;

  connectedCallback() {
    super.connectedCallback();
    this.hasAction = !!this.querySelector('[slot="action"]');
    this.hasLabel = !!this.querySelector('[slot="label"]');
    this.hasIcon = !!this.querySelector('[slot="icon"]');
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.hasAction ||= !!this.querySelector('[slot="action"]');
    this.hasLabel ||= !!this.querySelector('[slot="label"]');
    this.hasIcon ||= !!this.querySelector('[slot="icon"]');
  }

  updated(ch: Map<string, unknown>) {
    if (ch.has("disabled") || ch.has("hasAction"))
      for (const b of this.querySelectorAll<HTMLElement & { disabled: boolean }>('acme-button[slot="action"], [slot="action"] acme-button')) b.disabled = this.disabled;
  }

  private slotted = (name: "action" | "label" | "icon") => (e: Event) => {
    const has = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || (n.textContent ?? "").trim());
    if (name === "action") this.hasAction = has;
    else if (name === "label") this.hasLabel = has;
    else this.hasIcon = has;
  };

  render() {
    const c = this.cls("note", {
      [this.variant]: !!this.variant,
      fill: this.fill,
      sm: this.size === "small",
      disabled: this.disabled,
      "with-action": this.hasAction,
    });
    const labelSlot = html`<slot name="label" @slotchange=${this.slotted("label")}></slot>`;
    const actionSlot = html`<slot name="action" @slotchange=${this.slotted("action")}></slot>`;
    return html`<div class=${c} role="note" data-disabled=${this.disabled ? "true" : nothing} part="note">
      <div class="body">
        ${this.noIcon ? nothing : html`<span class="icon"><slot name="icon" @slotchange=${this.slotted("icon")}>${this.hasIcon || !Object.hasOwn(noteIcons, this.variant) ? nothing : noteIcons[this.variant]}</slot></span>`}
        <div class="text">
          <div class="content">${this.hasLabel ? html`<span class="label">${labelSlot}</span>` : labelSlot}<slot></slot></div>
        </div>
      </div>
      ${this.hasAction ? html`<div class="action">${actionSlot}</div>` : actionSlot}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-note": AcmeNote;
  }
}
