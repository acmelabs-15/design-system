import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import type { AcmeButton } from "../button/button";
import { fieldsetCss } from "./fieldset.styles";
import "../disabled-wall/disabled-wall";

export type FieldsetVariant = "" | "error" | "warning";

/**
 * Fieldset: a card that groups related form controls. The content holds the title, the subtitle,
 * an error or warning line in its own row, and any slotted content; the footer holds a status line
 * and small action buttons, or text of its own. `variant` colors the card's border and its footer;
 * `disabled` dims the content behind a wall (the title stays above it) and grays a button or an
 * icon slotted into it; `highlight` tints the footer. Slots: default (content), `title` (beside
 * `heading`), `subtitle`, `error`, `warning`, `status`, `actions` (one acme-button each, small
 * unless sized), `footer` (text in place of the status and the actions). The actions each get a
 * wrapper of their own, so the element assigns its slots itself.
 */
@customElement("acme-fieldset")
export class AcmeFieldset extends AcmeElement {
  static shadowRootOptions: ShadowRootInit = { ...AcmeElement.shadowRootOptions, slotAssignment: "manual" };
  static styles = [
    sharedCss,
    fieldsetCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The title line; the `title` slot adds to it. */
  @property() heading = "";
  /** `error` or `warning`: a colored border, and a tinted footer. */
  @property() variant: FieldsetVariant = "";
  /** Dims the content behind a wall; the footer stays active. */
  @property({ type: Boolean }) disabled = false;
  /** A tinted footer. */
  @property({ type: Boolean }) highlight = false;
  /** The light-DOM children by slot name (`""` for the default slot). */
  @state() private slotted: Record<string, (Element | Text)[]> = {};
  private observer = new MutationObserver(() => this.collect());

  connectedCallback() {
    super.connectedCallback();
    this.collect();
    this.observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    if (!Object.keys(this.slotted).length) this.collect();
  }

  /** Groups the children by slot name; a blank text node counts for nothing. */
  private collect() {
    const slotted: Record<string, (Element | Text)[]> = {};
    for (const n of this.childNodes) {
      if (n.nodeType === 3 ? !(n.textContent ?? "").trim() : n.nodeType !== 1) continue;
      const name = n.nodeType === 1 ? ((n as Element).getAttribute("slot") ?? "") : "";
      slotted[name] ??= [];
      slotted[name].push(n as Element | Text);
    }
    this.slotted = slotted;
  }

  updated() {
    // Every slot takes the children of its name; each action takes the slot of its index.
    const slots = new Map<string, HTMLSlotElement>();
    for (const s of this.shadowRoot!.querySelectorAll("slot")) slots.set(s.name, s);
    const assigned = new Map<HTMLSlotElement, (Element | Text)[]>();
    for (const [name, nodes] of Object.entries(this.slotted))
      nodes.forEach((n, i) => {
        const slot = slots.get(name === "actions" ? `action-${i}` : name);
        if (slot) (assigned.get(slot) ?? assigned.set(slot, []).get(slot)!).push(n);
      });
    for (const s of slots.values()) s.assign(...(assigned.get(s) ?? []));
    for (const b of this.slotted.actions ?? []) if ((b as Element).tagName === "ACME-BUTTON" && !(b as Element).hasAttribute("size")) (b as AcmeButton).size = "small";
  }

  render() {
    const has = (name: string) => !!this.slotted[name]?.length;
    const actions = this.slotted.actions ?? [];
    const footer = has("footer") || has("status") || actions.length > 0;
    const c = this.cls("fieldset", {
      error: this.variant === "error",
      warning: this.variant === "warning",
      disabled: this.disabled,
      highlight: this.highlight,
    });
    return html`<div class=${c} part="fieldset">
      <div class="content" part="content">
        ${this.disabled ? html`<acme-disabled-wall></acme-disabled-wall>` : nothing}
        ${this.heading || has("title") ? html`<h4 class="title">${this.heading}<slot name="title"></slot></h4>` : nothing}
        ${has("subtitle") ? html`<p class="subtitle"><slot name="subtitle"></slot></p>` : nothing}
        ${has("error") ? html`<div class="row"><span class="error"><slot name="error"></slot></span></div>` : nothing}
        ${has("warning") ? html`<div class="row"><span class="warning"><slot name="warning"></slot></span></div>` : nothing}
        ${has("") ? html`<slot></slot>` : nothing}
      </div>
      ${
        footer
          ? html`<footer class="footer" part="footer">
              ${has("footer") ? html`<slot name="footer"></slot>` : nothing}
              ${has("status") ? html`<div class="status"><slot name="status"></slot></div>` : nothing}
              ${actions.length ? html`<div class="actions">${actions.map((_, i) => html`<div class="action"><slot name=${`action-${i}`}></slot></div>`)}</div>` : nothing}
            </footer>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-fieldset": AcmeFieldset;
  }
}
