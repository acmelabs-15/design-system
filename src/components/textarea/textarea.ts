import { html } from "lit";
import { optionalString } from "../../shared/attributes";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { atomState } from "../../shared/atom-state";
import { AcmeTextControl, type TextNativeControl } from "../../shared/text-control";
import { textareaStructureCss } from "../../generated/components/textarea/textarea-structure.styles";

export type TextareaSize = "small" | "medium" | "large";
/** A native multiline field with optional content sizing.
 * @csspart root - The field surface.
 * @csspart textarea - The native editing control.
 * @fires {CustomEvent<{value:string}>} acme-input - A live value edit.
 * @fires {CustomEvent<{value:string}>} acme-change - A committed value edit.
 */
export class AcmeTextarea extends AcmeTextControl {
  static styles = [...AcmeTextControl.styles, textareaStructureCss];
  protected createControl() {
    return this.ownerDocument.createElement("textarea");
  }
  @atomState() private rowCount = 3;
  /** @default 3 */
  @property({ noAccessor: true, converter: { fromAttribute: (value: string | null) => (value === null ? 3 : Number(value)) } }) get rows(): number {
    return this.rowCount ?? 3;
  }
  set rows(value: number | undefined) {
    value ??= 3;
    if (!Number.isInteger(value) || value < 1) {
      throw new RangeError("rows must be a positive integer");
    }
    this.rowCount = value;
    this.nativeForm?.sync();
    this.requestUpdate("rows");
  }
  @atomState() private resizeDirection: "none" | "vertical" | "horizontal" | "both" = "vertical";
  /** @default "vertical" */
  @property({ noAccessor: true, converter: optionalString }) get resize(): "none" | "vertical" | "horizontal" | "both" {
    return this.resizeDirection;
  }
  set resize(value: "none" | "vertical" | "horizontal" | "both" | undefined) {
    value ??= "vertical";
    if (!["none", "vertical", "horizontal", "both"].includes(value)) {
      throw new TypeError("Invalid resize direction");
    }
    this.resizeDirection = value;
    this.requestUpdate("resize");
  }
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "auto-resize" }) autoResize = false;
  @atomState() @property({ noAccessor: true, attribute: "min-height" }) minHeight?: string;
  @atomState() @property({ noAccessor: true, attribute: "max-height" }) maxHeight?: string;
  @atomState() private wrapping: "soft" | "hard" = "soft";
  /** @default "soft" */
  @property({ noAccessor: true, converter: optionalString }) get wrap(): "soft" | "hard" {
    return this.wrapping ?? "soft";
  }
  set wrap(value: "soft" | "hard" | undefined) {
    value ??= "soft";
    if (!["soft", "hard"].includes(value)) {
      throw new TypeError("Invalid textarea wrap");
    }
    this.wrapping = value;
    this.nativeForm?.sync();
    this.requestUpdate("wrap");
  }
  protected configuration() {
    return `${this.rows}:${this.wrap}`;
  }
  protected configure(control: TextNativeControl) {
    const textarea = control as HTMLTextAreaElement;
    if (textarea.rows !== this.rows) {
      textarea.rows = this.rows;
    }
    if (textarea.wrap !== this.wrap) {
      textarea.wrap = this.wrap;
    }
  }
  protected serializeValue(value: string): string {
    const form = this.control.form;
    if (this.wrap !== "hard" || !form || !this.control.name) {
      return value;
    }
    const result = new this.ownerDocument.defaultView!.FormData(form).get(this.control.name);
    return typeof result === "string" ? result : value;
  }
  private observer?: ResizeObserver;
  private width = -1;
  constructor() {
    super();
    this.control.setAttribute("part", "textarea");
  }
  connectedCallback() {
    super.connectedCallback();
    this.observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width !== undefined && width !== this.width) {
        this.width = width;
        this.edited();
        this.nativeForm.sync();
      }
    });
    this.observer.observe(this.control);
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
    super.disconnectedCallback();
  }
  protected edited() {
    if (!this.control.isConnected) {
      return;
    }
    this.control.style.removeProperty("--acme-textarea-height");
    if (!this.autoResize) {
      return;
    }
    const scroll = this.control.scrollTop;
    this.control.style.setProperty("--acme-textarea-height", "0px");
    const height = this.control.scrollHeight;
    this.control.style.setProperty("--acme-textarea-height", `${height}px`);
    this.control.scrollTop = scroll;
  }
  protected updated() {
    super.updated();
    this.edited();
  }
  render() {
    return html`<form novalidate @submit=${(event: Event) => event.preventDefault()} class="root" part="root" data-size=${this.size} data-resize=${this.autoResize ? "none" : this.resize} ?data-disabled=${this.nativeForm.effectiveDisabled} ?data-invalid=${this.effectiveInvalid} style=${styleMap({ "--acme-textarea-rows": String(this.rows), "--acme-textarea-min": this.minHeight ?? null, "--acme-textarea-max": this.maxHeight ?? null })}>${this.control}</form>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-textarea": AcmeTextarea;
  }
}
