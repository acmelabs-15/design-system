import { message, messageCatalogs } from "../../shared/messages";
import { createAtom } from "@tanstack/lit-store";
import { StoreSelector } from "../../shared/store-connection";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { ResizablePartBinding } from "../../shared/resizable-context";
import { resizeHandleCss } from "../../generated/components/resize-handle/resize-handle.styles";
/** A focusable separator between two adjacent Resizable Panels.
 * @csspart handle - The native separator.
 * @csspart indicator - The visible resize grip.
 */
export class AcmeResizeHandle extends AcmeSemanticElement {
  static styles = [sharedCss, resizeHandleCss];
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) disabled = false;
  @atomState() private keyboardStepValue = 1;
  /** @default 1 */
  @property({ noAccessor: true, attribute: "keyboard-step", converter: { fromAttribute: (v: string | null) => (v === null ? undefined : Number(v)) } }) get keyboardStep(): number {
    return this.keyboardStepValue;
  }
  set keyboardStep(value: number | undefined) {
    const next = value ?? 1;
    if (!Number.isFinite(next) || next <= 0) {
      throw new RangeError("Resize steps must be positive percentage points");
    }
    const previous = this.keyboardStepValue;
    this.keyboardStepValue = next;
    this.requestUpdate("keyboardStep", previous);
  }
  @atomState() private largeKeyboardStepValue = 10;
  /** @default 10 */
  @property({ noAccessor: true, attribute: "large-keyboard-step", converter: { fromAttribute: (v: string | null) => (v === null ? undefined : Number(v)) } }) get largeKeyboardStep(): number {
    return this.largeKeyboardStepValue;
  }
  set largeKeyboardStep(value: number | undefined) {
    const next = value ?? 10;
    if (!Number.isFinite(next) || next <= 0) {
      throw new RangeError("Resize steps must be positive percentage points");
    }
    const previous = this.largeKeyboardStepValue;
    this.largeKeyboardStepValue = next;
    this.requestUpdate("largeKeyboardStep", previous);
  }
  private readonly binding = new ResizablePartBinding(this, {
    kind: "handle",
    element: () => this.control,
    disabled: () => this.disabled,
    step: (large) => {
      const value = large ? this.largeKeyboardStep : this.keyboardStep;
      if (!Number.isFinite(value) || value <= 0) {
        throw new RangeError("Resize steps must be positive percentage points");
      }
      return value;
    },
  });
  private readonly naming = createAtom(() => ({ label: this.info?.before?.host.ariaLabel, labels: this.info?.before?.host.ariaLabelledByElements }));
  private readonly namingUpdates = new StoreSelector(this, () => this.naming);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private shareFormatter?: { locale: string; value: Intl.NumberFormat };
  private valueText() {
    const locale = this.themeContext.scope.effective.get().locale ?? "en-US";
    const info = this.info;
    const key = info?.before?.definition?.().value;
    if (key && this.binding.current?.state.get().layout.collapsed.includes(key)) {
      return message(locale, "resizable.collapsed", "Collapsed");
    }
    if (this.shareFormatter?.locale !== locale) {
      this.shareFormatter = { locale, value: new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }) };
    }
    return this.shareFormatter.value.format((info?.now ?? 0) / 100);
  }
  private get control() {
    return this.renderRoot?.querySelector<HTMLElement>("[part~=handle]") ?? undefined;
  }
  private get info() {
    return this.binding.current?.handle(this.binding.record);
  }
  protected get semanticDefaults() {
    const pane = this.info?.before;
    return {
      role: "separator",
      label: pane?.host.ariaLabel ?? pane?.definition?.().value,
      labelledByElements: pane?.host.ariaLabelledByElements ?? undefined,
      controlsElements: pane ? [pane.host] : [],
    };
  }
  focus(options?: FocusOptions) {
    this.control?.focus(options);
  }
  render() {
    const info = this.info,
      horizontal = this.binding.current?.state.get().orientation !== "vertical",
      disabled = this.disabled || !info || info.disabled;
    return html`<div part="root handle" role="separator" tabindex=${disabled ? -1 : 0} aria-disabled=${String(disabled)} aria-orientation=${horizontal ? "vertical" : "horizontal"} aria-valuemin=${info?.min ?? 0} aria-valuemax=${info?.max ?? 100} aria-valuenow=${info?.now ?? 0} aria-valuetext=${this.valueText()} data-axis=${horizontal ? "horizontal" : "vertical"} @pointerdown=${(event: PointerEvent) => this.binding.current?.pointer(this.binding.record, event)} @keydown=${(event: KeyboardEvent) => this.binding.current?.key(this.binding.record, event)} @dblclick=${(
      event: MouseEvent,
    ) => {
      if (!event.defaultPrevented) {
        this.binding.current?.toggle(this.binding.record);
      }
    }} @blur=${() => this.binding.current?.blur(this.binding.record)}><span part="indicator" aria-hidden="true"></span></div>`;
  }
  protected updated() {
    this.setAttribute("data-axis", this.binding.current?.state.get().orientation ?? "horizontal");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-resize-handle": AcmeResizeHandle;
  }
}
