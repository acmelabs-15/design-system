import { ContextProvider } from "@lit/context";
import { ComposedParticipants } from "../../shared/composed-participants";
import { Places } from "../../shared/places";
import { pinInputContext, pinFieldPartFor, registerPinInputBoundary, isPinInputBoundary, type PinInputOwner, type PinFieldPart, type PinPresentation } from "../../shared/pin-input-context";
import { sharedCss } from "../../base";
import { optionalString } from "../../shared/attributes";
import { message, messageCatalogs } from "../../shared/messages";
import { pinInputStructureCss } from "../../generated/components/pin-input/pin-input-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { createAtom, batch } from "@tanstack/lit-store";
import { AcmeReadOnlyFormElement, nativeValidation } from "../../shared/native-form-element";
import { NativeFormController } from "../../shared/native-form";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { registerTextControl, submitImplicitly } from "../../shared/implicit-submit";
import { pinValue, pinCharacters, pinCharacter, pinDelete, pinPaste, pinInsertion, pinFocus, type PinInputType } from "../../shared/pin-value";

type Extra = { count: number; kind: PinInputType; mask: boolean; otp: boolean; placeholder: string; focused: number };
export type { PinInputType } from "../../shared/pin-value";
/** One logical code value edited through indexed character fields.
 * @slot - Supplied fields and separators; omission generates count fields.
 * @csspart root - The named code group.
 * @csspart field - A default field surface.
 * @fires {CustomEvent<{value:readonly string[];valueAsString:string}>} acme-input - A user edits the code.
 * @fires {CustomEvent<{value:readonly string[];valueAsString:string}>} acme-change - A user commits a changed code.
 * @fires {CustomEvent<{value:readonly string[];valueAsString:string}>} acme-complete - A user completes a previously incomplete code.
 */
export class AcmePinInput extends AcmeReadOnlyFormElement<readonly string[], Extra> {
  static styles = [sharedCss, pinInputStructureCss];
  static shadowRootOptions = { ...AcmeReadOnlyFormElement.shadowRootOptions, delegatesFocus: true };
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private text(key: string, fallback: string) {
    return message(this.themeContext.scope.effective.get().locale, key, fallback);
  }
  @atomState() private controlSize: "small" | "medium" | "large" = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, converter: optionalString }) get size(): "small" | "medium" | "large" {
    return this.controlSize;
  }
  set size(value: "small" | "medium" | "large" | undefined) {
    const next = value ?? "medium";
    if (!["small", "medium", "large"].includes(next)) {
      throw new TypeError("Invalid Pin Input size");
    }
    this.controlSize = next;
    this.requestUpdate("size");
  }

  @atomState() private cells?: number;
  /** Required positive number of character fields. */
  @property({ noAccessor: true, type: Number, converter: { fromAttribute: (v: string | null) => (v === null ? undefined : Number(v)) } }) get count() {
    return this.cells;
  }
  set count(value: number | undefined) {
    if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
      throw new RangeError("count must be a positive integer");
    }
    const refocus = this.controls.some((control) => control?.matches(":focus")) && this.focusState.get().index >= (value ?? 0);
    batch(() => {
      this.composition.set({});
      this.cells = value;
      if (this.focusState.get().index >= (value ?? 0)) {
        this.focusState.set({ index: -1 });
      }
      this.nativeForm?.refreshValue();
      if (this.nativeForm) {
        this.committed.set({ value: JSON.stringify(this.value) });
      }
    });
    this.requestUpdate("count");
    if (refocus && value) {
      queueMicrotask(() => {
        if (this.isConnected) {
          this.focus(pinInsertion(this.value));
        }
      });
    }
  }
  @atomState() private kind: PinInputType = "numeric";
  /** @default "numeric" */
  @property({ noAccessor: true, converter: optionalString }) get type(): PinInputType {
    return this.kind ?? "numeric";
  }
  set type(value: PinInputType | undefined) {
    const next = value ?? "numeric";
    if (!["numeric", "alphabetic", "alphanumeric"].includes(next)) {
      throw new TypeError("Invalid Pin Input type");
    }
    this.kind = next;
    this.nativeForm?.sync();
    this.requestUpdate("type");
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) mask = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) otp = false;
  @atomState() private hint = "○";
  /** @default "○" */
  @property({ noAccessor: true, converter: optionalString }) get placeholder(): string {
    return this.hint ?? "○";
  }
  set placeholder(value: string | undefined) {
    this.hint = value ?? "○";
    this.nativeForm?.sync();
    this.requestUpdate("placeholder");
  }
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "auto-focus" }) autoFocus = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "blur-on-complete" }) blurOnComplete = false;
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "auto-submit" }) autoSubmit = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) invalid = false;
  private readonly focusState = createAtom({ index: -1 });
  private readonly focusUpdates = new StoreSelector(this, () => this.focusState);
  private readonly content = new Places(this, { places: [""] });
  private readonly registered = createAtom<readonly PinFieldPart[]>([]);
  private readonly bindings = new Map<PinFieldPart, () => void>();
  private readonly indexed = createAtom(() => {
    const indices = new Map<number, PinFieldPart>();
    for (const part of this.registered.get()) {
      const index = part.index();
      if (index !== undefined && !indices.has(index)) {
        indices.set(index, part);
      }
    }
    return indices;
  });
  private get controls(): readonly (HTMLInputElement | undefined)[] {
    const indexed = this.indexed.get();
    return Array.from({ length: this.count ?? 0 }, (_, index) => indexed.get(index)?.control);
  }
  private register(part: PinFieldPart) {
    if (this.bindings.has(part)) {
      return;
    }
    this.bindings.set(part, this.bindControl(part.control, part.index));
    this.registered.set([...this.registered.get(), part]);
    this.nativeForm.sync();
  }
  private unregister(part: PinFieldPart) {
    this.bindings.get(part)?.();
    this.bindings.delete(part);
    this.registered.set(this.registered.get().filter((item) => item !== part));
    this.nativeForm.sync();
    queueMicrotask(() => {
      if (this.isConnected && !this.controls.some((control) => control?.matches(":focus")) && this.focusState.get().index !== -1) {
        this.focusState.set({ index: -1 });
      }
    });
  }
  private readonly presentation = createAtom<PinPresentation>(() => ({
    count: this.count ?? 0,
    value: this.value,
    size: this.size,
    disabled: this.nativeForm.effectiveDisabled || !this.count,
    invalid: this.invalid || (this.field.description.get()?.invalid ?? false),
    complete: this.complete,
    locale: this.themeContext.scope.effective.get().locale,
    labelTemplate: this.text("pinInput.character", "Character {index} of {count}"),
  }));
  private readonly pinOwner: PinInputOwner = {
    state: this.presentation,
    register: (part) => this.register(part),
    unregister: (part) => this.unregister(part),
    synchronize: () => this.nativeForm.sync(),
    submit: () => this.submit(),
  };
  private readonly provider = new ContextProvider(this, { context: pinInputContext, initialValue: this.pinOwner });
  private readonly scopes = new ComposedParticipants(this, {
    owner: this.pinOwner,
    parts: () => this.registered.get(),
    find: pinFieldPartFor,
    boundary: isPinInputBoundary,
    slots: () => Array.from(this.renderRoot?.querySelectorAll<HTMLSlotElement>(".pin-root > slot") ?? []),
  });
  private readonly constraint = this.ownerDocument.createElement("input");
  private readonly committed = createAtom<{ value?: string }>({});
  private readonly composition = createAtom<{ index?: number; draft?: string }>({});
  protected readonly nativeForm: NativeFormController<readonly string[], Extra> = new NativeFormController(this, {
    initialValue: Object.freeze([]),
    valueAttribute: "value",
    normalize: (value) => {
      const next = pinValue(value, this.count ?? 0),
        current = this.nativeForm?.value;
      return current && current.length === next.length && current.every((cell, index) => cell === next[index]) ? current : next;
    },
    fromAttribute: (value) => {
      try {
        return value === null ? [] : pinValue(JSON.parse(value), 0);
      } catch {
        console.warn(this.localName, { code: "invalid-value-attribute" });
        return [];
      }
    },
    toAttribute: JSON.stringify,
    changed: (reason) => {
      if (["programmatic", "default", "reset", "restore"].includes(reason)) {
        const composing = this.composition.get().index !== undefined;
        this.composition.set({});
        this.committed.set({ value: JSON.stringify(this.value) });
        if (composing) {
          this.nativeForm.sync();
        }
      }
    },
    extra: () => {
      for (const part of this.registered.get()) {
        part.index();
      }
      return { count: this.count ?? 0, kind: this.type, mask: this.mask, otp: this.otp, placeholder: this.placeholder, focused: this.focusState.get().index };
    },
    serialize: (state) => state.value.join(""),
    restoration: (state) => JSON.stringify(state.value),
    restore: (value, mode) => {
      if (typeof value !== "string") {
        return [];
      }
      try {
        return pinValue(mode === "autocomplete" ? [...value] : JSON.parse(value), this.count ?? 0);
      } catch {
        return [];
      }
    },
    target: () => this.controls.find((control, index) => !this.value[index] && control?.isConnected) ?? this.controls.find((control) => control?.isConnected) ?? this.semanticTarget,
    synchronize: (state, extra) => {
      if ((state.disabled || state.platformDisabled || state.readOnly) && this.composition.get().index !== undefined) {
        this.composition.set({});
      }
      for (const part of this.registered.get()) {
        const index = part.index();
        if (index === undefined || index >= extra.count) {
          part.control.disabled = true;
          part.control.value = "";
          part.control.tabIndex = -1;
        }
      }
      for (const [index, control] of this.controls.entries()) {
        if (!control) {
          continue;
        }
        const type = extra.mask ? "password" : extra.kind === "numeric" ? "tel" : "text";
        if (control.type !== type) {
          if (this.composition.get().index === index) {
            this.composition.set({});
          }
          control.type = type;
        }
        const value = this.composition.get().index === index ? (this.composition.get().draft ?? "") : (state.value[index] ?? "");
        if (control.value !== value) {
          control.value = value;
        }
        control.disabled = state.disabled || state.platformDisabled;
        control.readOnly = state.readOnly;
        control.required = state.required;
        control.inputMode = extra.kind === "numeric" ? "numeric" : "text";
        control.autocomplete = extra.otp ? "one-time-code" : "off";
        control.placeholder = extra.focused === index ? "" : extra.placeholder;
        control.tabIndex = index === (extra.focused < 0 ? pinInsertion(state.value) : extra.focused) ? 0 : -1;
        control.setAttribute("aria-invalid", String(this.invalid || (this.field.description.get()?.invalid ?? false)));
        control.enterKeyHint = index === extra.count - 1 ? "done" : "next";
      }
      this.constraint.required = state.required;
      this.constraint.disabled = state.disabled || state.platformDisabled;
      this.constraint.readOnly = state.readOnly;
      this.constraint.pattern = (extra.kind === "numeric" ? "[0-9]" : extra.kind === "alphabetic" ? "[A-Za-z]" : "[A-Za-z0-9]") + "{" + extra.count + "}";
      this.constraint.value = state.value.join("");
    },
    validate: (_state, extra) => {
      if (extra.count < 1) {
        return { flags: { customError: true }, message: this.text("pinInput.count", "Set the number of code fields.") };
      }
      if (this.content.has("")) {
        const indices = this.registered.get().map((part) => part.index());
        if (indices.length !== extra.count || new Set(indices).size !== extra.count || indices.some((index) => index === undefined || index < 0 || index >= extra.count)) {
          return { flags: { customError: true }, message: this.text("pinInput.fields", "Supply one field for each code position.") };
        }
      }
      return nativeValidation(this.constraint);
    },
  });
  /** @default [] */
  @property({ noAccessor: true, type: Array }) get value(): readonly string[] {
    return this.nativeForm.value;
  }
  set value(value: readonly string[]) {
    this.nativeForm.setValue(value);
  }
  /** @default [] */
  @property({ noAccessor: true, attribute: false }) get defaultValue(): readonly string[] {
    return this.nativeForm.defaultValue;
  }
  set defaultValue(value: readonly string[]) {
    this.nativeForm.setDefaultValue(value);
  }
  get valueAsString() {
    return this.value.join("");
  }
  private get complete() {
    return !!this.count && this.value.length === this.count && this.value.every((value) => value !== "" && pinCharacters(value, this.type));
  }
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  protected get semanticDefaults() {
    return { ...super.semanticDefaults, role: "group" };
  }
  constructor() {
    super();
    registerPinInputBoundary(this);
    registerTextControl(this);
  }
  private emit(type: "acme-input" | "acme-change" | "acme-complete") {
    this.dispatchEvent(new CustomEvent(type, { detail: { value: this.value, valueAsString: this.valueAsString }, bubbles: true, composed: true }));
  }
  private commit() {
    const value = JSON.stringify(this.value);
    if (this.committed.get().value === value) {
      return;
    }
    this.committed.set({ value });
    this.emit("acme-change");
  }
  private edit(value: readonly string[], after?: () => void) {
    if (this.nativeForm.effectiveDisabled || this.readOnly || (value.length === this.value.length && value.every((cell, index) => cell === this.value[index]))) {
      return false;
    }
    const complete = this.complete;
    this.nativeForm.setValue(value, "user");
    this.emit("acme-input");
    if (!this.isConnected) {
      return true;
    }
    after?.();
    if (value.length !== this.value.length || value.some((cell, index) => cell !== this.value[index])) {
      return true;
    }
    if (!complete && this.complete) {
      this.commit();
      this.emit("acme-complete");
      if (this.blurOnComplete) {
        this.controls[this.focusState.get().index]?.blur();
      }
      if (this.autoSubmit && this.complete && this.form) {
        this.ownerDocument.defaultView!.HTMLFormElement.prototype.requestSubmit.call(this.form);
      }
    }
    return true;
  }
  private bindControl(control: HTMLInputElement, index: () => number | undefined): () => void {
    const cleanups: (() => void)[] = [];
    const getIndex = () => index() ?? -1;
    const on = <K extends keyof HTMLElementEventMap>(type: K, listener: (event: HTMLElementEventMap[K]) => void) => {
      const wrapped = (event: Event) => {
        if (getIndex() >= 0 && getIndex() < (this.count ?? 0)) {
          listener(event as HTMLElementEventMap[K]);
        }
      };
      control.addEventListener(type, wrapped);
      cleanups.push(() => control.removeEventListener(type, wrapped));
    };
    on("focus", () => {
      const wanted = pinFocus(this.value, getIndex()),
        next = this.controls[wanted] ? wanted : getIndex();
      this.focusState.set({ index: next });
      if (next !== getIndex()) {
        this.controls[next]?.focus({ preventScroll: true });
      }
      this.nativeForm.sync();
    });
    on("blur", () => {
      if (this.composition.get().index === getIndex()) {
        this.composition.set({});
        this.nativeForm.sync();
      }
      queueMicrotask(() => {
        if (!this.isConnected || this.controls.some((input) => input?.matches(":focus"))) {
          return;
        }
        this.focusState.set({ index: -1 });
        this.commit();
      });
    });
    on("keydown", (event) => this.key(event, getIndex()));
    on("paste", (event) => {
      const text = event.clipboardData?.getData("text/plain");
      if (event.defaultPrevented || !text || this.readOnly || this.nativeForm.effectiveDisabled) {
        return;
      }
      event.preventDefault();
      if (pinCharacters(text, this.type) && !this.edit(pinPaste(this.value, getIndex(), text), () => this.move(pinInsertion(this.value)))) {
        this.move(pinInsertion(this.value));
      }
    });
    on("beforeinput", (raw) => {
      const event = raw as InputEvent;
      if (event.defaultPrevented || event.isComposing || event.inputType.startsWith("delete") || event.data === null) {
        return;
      }
      if (!pinCharacters(event.data, this.type)) {
        event.preventDefault();
        return;
      }
      if (control.value.length) {
        control.setSelectionRange(0, control.value.length);
      }
    });
    on("compositionstart", () => {
      this.composition.set({ index: getIndex(), draft: control.value });
    });
    on("compositionend", () => {
      const value = control.value;
      this.composition.set({});
      control.value = value;
      this.input(new InputEvent("input", { inputType: "insertCompositionText" }), getIndex());
    });
    on("input", (event) => this.input(event as InputEvent, getIndex()));
    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }

  private move(index: number) {
    if (this.nativeForm.effectiveDisabled) {
      return;
    }
    index = pinFocus(this.value, index);
    if (!this.controls[index]?.isConnected) {
      return;
    }
    this.focusState.set({ index });
    this.nativeForm.sync();
    this.controls[index]?.focus({ preventScroll: true });
  }
  private key(event: KeyboardEvent, index: number) {
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.altKey || event.metaKey || this.nativeForm.effectiveDisabled) {
      return;
    }
    if (this.readOnly && !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
      }
      return;
    }
    const rtl = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl";
    if (event.key.length === 1 && event.key === this.value[index]) {
      event.preventDefault();
      this.move(index + 1);
      return;
    }
    switch (event.key) {
      case "Backspace":
        event.preventDefault();
        if (this.value[index]) {
          this.edit(pinDelete(this.value, index));
        } else {
          this.edit(pinDelete(this.value, Math.max(0, index - 1)));
        }
        this.move(Math.max(0, index - 1));
        break;
      case "Delete":
        event.preventDefault();
        this.edit(pinDelete(this.value, index));
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.move(index + (rtl ? 1 : -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        this.move(index + (rtl ? -1 : 1));
        break;
      case "Home":
        event.preventDefault();
        this.move(0);
        break;
      case "End":
        event.preventDefault();
        this.move(Math.max(0, this.value.filter(Boolean).length - 1));
        break;

      // no default: Other keys keep their native text-input behavior.
    }
  }
  private input(event: InputEvent, index: number) {
    const input = this.controls[index];
    if (!input || this.readOnly || this.nativeForm.effectiveDisabled) {
      return;
    }
    const raw = input.value;
    if (event.isComposing || this.composition.get().index === index) {
      this.composition.set({ index, draft: raw });
      return;
    }
    if (!pinCharacters(raw, this.type)) {
      this.nativeForm.sync();
      return;
    }
    if (event.inputType.startsWith("delete")) {
      if (event.inputType === "deleteContentBackward") {
        if (this.value[index]) {
          this.edit(pinDelete(this.value, index));
        } else {
          this.edit(pinDelete(this.value, Math.max(0, index - 1)));
        }
        this.move(Math.max(0, index - 1));
      } else {
        this.edit(pinDelete(this.value, index));
      }
      return;
    }
    if (raw.length > 2 || (this.count! > 1 && raw.length >= this.count!) || (event.inputType === "insertReplacementText" && raw.length > 1)) {
      if (!this.edit(pinPaste(this.value, index, raw), () => this.move(pinInsertion(this.value)))) {
        this.move(pinInsertion(this.value));
      }
      return;
    }
    const next = [...this.value];
    next[index] = pinCharacter(next[index] ?? "", raw);
    this.edit(next, () => {
      if (next[index]) {
        this.move(index + 1);
      }
    });
  }
  focus(options?: FocusOptions): void;
  focus(index?: number, options?: FocusOptions): void;
  focus(indexOrOptions: number | FocusOptions = 0, options?: FocusOptions) {
    const index = typeof indexOrOptions === "number" ? indexOrOptions : 0;
    if (!this.nativeForm.effectiveDisabled) {
      this.controls[pinFocus(this.value, index)]?.focus(typeof indexOrOptions === "number" ? options : indexOrOptions);
    }
  }
  /** Clears the code and focuses the first field. */
  clear() {
    if (this.nativeForm.effectiveDisabled || this.readOnly) {
      return;
    }
    if (this.edit(pinValue([], this.count ?? 0))) {
      this.commit();
    }
    this.move(0);
  }
  /** Sets one character without user notifications. */
  setValueAt(index: number, value: string) {
    if (!Number.isInteger(index) || index < 0 || index >= (this.count ?? 0)) {
      throw new RangeError("Invalid code field index");
    }
    const next = [...this.value];
    next[index] = value;
    this.value = next;
  }
  formResetCallback() {
    this.composition.set({});
    super.formResetCallback();
    this.nativeForm.sync();
  }
  formStateRestoreCallback(value: string | File | FormData, mode: "restore" | "autocomplete") {
    this.composition.set({});
    super.formStateRestoreCallback(value, mode);
    this.nativeForm.sync();
  }
  disconnectedCallback() {
    this.composition.set({});
    this.focusState.set({ index: -1 });
    super.disconnectedCallback();
  }
  protected firstUpdated() {
    queueMicrotask(() => {
      if (this.autoFocus && this.isConnected) {
        this.focus();
      }
    });
  }
  protected updated() {
    this.nativeForm.sync();
  }
  private submit() {
    this.commit();
    if (this.complete && this.form) {
      submitImplicitly(this.form);
    }
  }
  render() {
    const custom = this.content.has("");
    return html`<div class="pin-root" part="root" tabindex="-1" ?data-complete=${this.complete}><slot ?hidden=${!custom} @slotchange=${this.content.read}></slot>${custom ? nothing : Array.from({ length: this.count ?? 0 }, (_, index) => html`<acme-pin-input-field .index=${index} exportparts="root:field"></acme-pin-input-field>`)}</div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-pin-input": AcmePinInput;
  }
}
