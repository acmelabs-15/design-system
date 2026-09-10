import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import type { AcmeCollapseGroup } from "../collapse-group/collapse-group";
import { collapseCss } from "./collapse.styles";

/**
 * Collapse. A bordered block with a heading (24px semibold; `size="small"` 16px medium) whose
 * button trigger holds the title and a chevron that turns 90° when open, over a region that
 * animates its height (0 when closed, the body's height when open) around the scrolling body
 * (60vh at most). The content stays in the DOM when closed, inert. Closed by default;
 * `default-expanded` starts open. Fires `acme-toggle` (`detail.open`) on a click and `acme-expand`
 * when it opens. Inside an `acme-collapse-group` the group drives `open`: one panel at a time
 * unless the group is `multiple`, and a `default-expanded` panel cannot close itself
 * (its trigger reads aria-disabled while open).
 */
@customElement("acme-collapse")
export class AcmeCollapse extends AcmeElement {
  static styles = [
    sharedCss,
    collapseCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The Title Case topic name in the trigger. */
  @property() title = "";
  /** Starts open. */
  @property({ type: Boolean, attribute: "default-expanded" }) defaultExpanded = false;
  @property() size: "medium" | "small" = "medium";
  /** Whether the panel is open; reflects. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** The group this panel belongs to, set by the group; the group then owns `open`. */
  @property({ attribute: false }) group: AcmeCollapseGroup | null = null;
  @state() private height = 0;
  @query(".trigger") private trigger!: HTMLElement;
  @query(".body") private body!: HTMLElement;
  private uid = Math.random().toString(36).slice(2, 8);
  private interaction = new Interaction(this);
  private observer?: ResizeObserver;

  connectedCallback() {
    super.connectedCallback();
    if (this.defaultExpanded) this.open = true;
    // A panel inside a group belongs to it from the start (the group adopts it again on slot changes).
    const parent = this.parentElement;
    if (parent?.tagName === "ACME-COLLAPSE-GROUP") this.group = parent as AcmeCollapseGroup;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  firstUpdated() {
    // The title lives in the trigger; the host attribute would also raise the browser's own tooltip.
    if (this.hasAttribute("title")) {
      const t = this.title;
      this.removeAttribute("title");
      this.title = t;
    }
    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(() => this.measure());
      this.observer.observe(this.body);
    }
  }

  updated() {
    this.interaction.attach(this.trigger);
    this.measure();
  }

  /** The body's height drives the region's inline height while open. */
  private measure() {
    const h = Math.round(this.body?.getBoundingClientRect().height ?? 0);
    if (h !== this.height) this.height = h;
  }

  /** Flips the panel (through the group when it has one) and fires the events. */
  toggle() {
    if (this.group) this.group.change(this);
    else this.open = !this.open;
    this.dispatchEvent(new CustomEvent("acme-toggle", { detail: { open: this.open }, bubbles: true, composed: true }));
    if (this.open) this.dispatchEvent(new CustomEvent("acme-expand", { bubbles: true, composed: true }));
  }

  private onClick = () => {
    if (this.sticky) return;
    this.toggle();
  };

  /** In a group, an open `default-expanded` panel keeps its state: its trigger reads aria-disabled. */
  private get sticky() {
    return !!this.group && this.defaultExpanded && this.open;
  }

  render() {
    const bid = `collapse-button-${this.uid}`;
    const sid = `collapse-section-${this.uid}`;
    return html`<div class=${this.cls("collapse", { sm: this.size === "small", expanded: this.open, grouped: !!this.group })} part="collapse">
      <h3 class="heading">
        <button class="trigger" type="button" id=${bid} aria-controls=${sid} aria-expanded=${this.open ? "true" : "false"} aria-disabled=${this.sticky ? "true" : nothing} @click=${this.onClick} part="trigger">
          <span class="row">${this.title}<slot name="title"></slot><span class="chev">${glyphSized("chev")}</span></span>
        </button>
      </h3>
      <div class="panel" role="region" id=${sid} aria-labelledby=${bid} style=${`height:${this.open ? this.height : 0}px`} ?inert=${!this.open} part="panel">
        <div class="body"><slot></slot></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-collapse": AcmeCollapse;
  }
}
