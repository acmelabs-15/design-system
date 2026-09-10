import { Store, type Subscription } from "@tanstack/lit-store";
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import type { AcmeCollapse } from "../collapse/collapse";
import { collapseGroupCss } from "./collapse-group.styles";

/**
 * Collapse group. A stack of `acme-collapse` under one shared top border. One panel is open at
 * a time (opening one closes the other) unless `multiple`; a click on an open panel closes it.
 * While nothing has been chosen, the panels show their own `default-expanded` state, and a
 * `default-expanded` panel cannot close itself.
 */
@customElement("acme-collapse-group")
export class AcmeCollapseGroup extends AcmeElement {
  static styles = [
    sharedCss,
    collapseGroupCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** Lets several panels stay open at once. */
  @property({ type: Boolean }) multiple = false;
  /** The panels the reader opened, in a store the group applies to its panels on every change. */
  private selected = new Store<Set<AcmeCollapse>>(new Set<AcmeCollapse>());
  private subscription?: Subscription;

  connectedCallback() {
    super.connectedCallback();
    this.subscription = this.selected.subscribe(() => this.apply());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription?.unsubscribe();
  }

  firstUpdated() {
    this.adopt();
  }

  private get panels() {
    return [...this.querySelectorAll<AcmeCollapse>(":scope > acme-collapse")];
  }

  /** Adopts the slotted panels: each learns its group, and the current selection lands on them. */
  private adopt = () => {
    for (const p of this.panels) p.group = this;
    this.apply();
  };

  /** A panel was clicked: it leaves the selection, or joins it (alone unless `multiple`). */
  change(panel: AcmeCollapse) {
    this.selected.setState((s) => {
      const next = new Set(s);
      if (next.has(panel)) next.delete(panel);
      else {
        if (!this.multiple) next.clear();
        next.add(panel);
      }
      return next;
    });
  }

  private apply() {
    const s = this.selected.state;
    for (const p of this.panels) p.open = s.size === 0 ? p.defaultExpanded : s.has(p);
  }

  render() {
    return html`<div class="collapse-group" part="group"><slot @slotchange=${this.adopt}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-collapse-group": AcmeCollapseGroup;
  }
}
