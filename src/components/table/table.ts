import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { tableLightCss } from "../../generated/components/table/table-light.styles";
import { tableStructureCss } from "../../generated/components/table/table-structure.styles";
import { atomState } from "../../shared/atom-state";
import { RootStyles } from "../../shared/root-styles";
import { AcmeSemanticElement } from "../../shared/semantic-element";
/** Styles and scrolls one author-owned native table. Data and interactions belong to the application.
 * @slot - One native table, with native caption, sections, rows and cells.
 * @csspart root - Stable outer box.
 * @csspart viewport - Native scrolling viewport.
 * @cssprop --acme-table-max-height - Optional maximum viewport block size.
 * @cssprop --acme-table-column-width - Measured width assigned to a native column or cell.
 * @cssprop --acme-table-row-height - Optional native row block size.
 * @cssprop --acme-table-sticky-block-start - Sticky header or pinned-row offset.
 * @cssprop --acme-table-sticky-block-end - Pinned footer-row offset.
 * @cssprop --acme-table-sticky-inline-start - Pinned start-column offset.
 * @cssprop --acme-table-sticky-inline-end - Pinned end-column offset.
 * @cssprop --acme-table-spacer-height - Virtual spacer-row block size.
 */
export class AcmeTable extends AcmeSemanticElement {
  static styles = [sharedCss, tableStructureCss];
  @atomState() private treatment: "default" | "striped" | "bordered" = "default";
  /** @default "default" */
  @property({ noAccessor: true, reflect: true, useDefault: true }) get variant() {
    return this.treatment;
  }
  set variant(value: "default" | "striped" | "bordered") {
    if (!["default", "striped", "bordered"].includes(value)) {
      throw new TypeError("Invalid Table variant");
    }
    const previous = this.treatment;
    this.treatment = value;
    this.requestUpdate("variant", previous);
  }
  @atomState() private scale: "small" | "medium" | "large" = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, reflect: true, useDefault: true }) get size() {
    return this.scale;
  }
  set size(value: "small" | "medium" | "large") {
    if (!["small", "medium", "large"].includes(value)) {
      throw new TypeError("Invalid Table size");
    }
    const previous = this.scale;
    this.scale = value;
    this.requestUpdate("size", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true, attribute: "sticky-header" }) stickyHeader = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) loading = false;
  private readonly lightStyles = new RootStyles(this, [tableLightCss]);
  private readonly viewport = this.ownerDocument.createElement("div");
  private readonly content = this.ownerDocument.createElement("slot");
  private resize?: ResizeObserver;
  private observed?: HTMLTableElement;
  constructor() {
    super();
    this.viewport.setAttribute("part", "viewport");
    this.viewport.append(this.content);
    this.content.addEventListener("slotchange", this.observe);
  }
  /** Returns the stable native element used by a consumer virtualizer. */
  getScrollElement(): HTMLElement {
    return this.viewport;
  }
  /** Returns the application's direct native table without changing its ownership. */
  getTableElement(): HTMLTableElement | null {
    return ([...this.children].find((child) => child.localName === "table" && !child.getAttribute("slot")) as HTMLTableElement | undefined) ?? null;
  }
  private measure = () => {
    const overflow = this.viewport.scrollWidth > this.viewport.clientWidth + 1 || this.viewport.scrollHeight > this.viewport.clientHeight + 1;
    this.viewport.tabIndex = overflow ? 0 : -1;
  };
  private observe = () => {
    const table = this.getTableElement();
    if (table !== this.observed) {
      this.resize?.disconnect();
      this.observed = table ?? undefined;
      if (this.resize) {
        this.resize.observe(this.viewport);
        if (table) {
          this.resize.observe(table);
        }
      }
    }
    this.measure();
  };
  connectedCallback() {
    super.connectedCallback();
    this.resize = new ResizeObserver(this.measure);
    this.resize.observe(this.viewport);
    this.observed = undefined;
    this.observe();
  }
  disconnectedCallback() {
    this.resize?.disconnect();
    this.resize = undefined;
    this.observed = undefined;
    super.disconnectedCallback();
  }
  protected get semanticTarget() {
    return this.viewport;
  }
  protected get semanticDefaults() {
    return { role: this.ariaLabel || this.ariaLabelledByElements?.length ? "region" : undefined };
  }
  protected updated() {
    this.viewport.setAttribute("aria-busy", String(this.loading));
    this.observe();
  }
  render() {
    return html`<div part="root">${this.viewport}</div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-table": AcmeTable;
  }
}
