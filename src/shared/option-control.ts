import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { flip, offset, shift, size, type Placement } from "@floating-ui/dom";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeFormElement, nativeValidation } from "./native-form-element";
import { NativeFormController } from "./native-form";
import { atomState } from "./atom-state";
import { StoreSelector } from "./store-connection";
import { optionContext, optionPartFor, registerOptionBoundary, isOptionBoundary, type OptionOwner, type OptionPart } from "./option-context";
import { OverlayPresence } from "./overlay-presence";
import { OverlayPlacement } from "./overlay-placement";
import { SpringValue } from "./spring-value";
import { readMotionSpring } from "./motion-spring";
import { Typeahead } from "./typeahead";
import { registerTextControl, submitImplicitly } from "./implicit-submit";
import { composedContains, deepActiveElement } from "./composed-tree";
import { createInheritedAppearance } from "./inherited-appearance";
import { GroupMemberController, groupMemberStyles } from "./group-member";
import { optionalString } from "./attributes";
import { Places } from "./places";
import { sharedCss, boolish } from "../base";
import { textControlCss } from "../generated/shared/text-control.styles";
import { singleLineControlCss } from "../generated/shared/single-line-control.styles";
import { optionControlCss } from "../generated/shared/option-control.styles";
import { selectionOrder } from "./selection-member";
import { ComposedParticipants } from "./composed-participants";
import { message, messageCatalogs } from "./messages";

const empty: readonly string[] = Object.freeze([]);
/** Shared popup and native-form mechanics; public families expose their own value shape. */
export abstract class AcmeOptionControl extends AcmeFormElement<readonly string[], readonly OptionPart[]> {
  static shadowRootOptions = { ...AcmeFormElement.shadowRootOptions, delegatesFocus: true };
  static styles = [sharedCss, groupMemberStyles, textControlCss, singleLineControlCss, optionControlCss];
  protected get multiple(): boolean {
    return false;
  }
  protected get editable(): boolean {
    return false;
  }
  @atomState() protected queryValue = "";
  @atomState() protected composing = false;
  @atomState() private members: readonly OptionPart[] = Object.freeze([]);
  @atomState() private activeValue?: string;
  protected get active(): OptionPart | undefined {
    return this.activeValue === undefined ? undefined : this.members.find((part) => part.value() === this.activeValue);
  }
  protected set active(part: OptionPart | undefined) {
    this.activeValue = part?.value();
  }
  @atomState() private visibility = false;
  @atomState() private reason = "programmatic";
  @atomState() @property({ useDefault: true, noAccessor: true }) placeholder = "";
  @atomState() @property({ noAccessor: true, type: Boolean }) clearable = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) invalid = false;
  @atomState() @property({ useDefault: true, noAccessor: true }) side: "top" | "bottom" | "left" | "right" = "bottom";
  @atomState() @property({ useDefault: true, noAccessor: true }) align: "start" | "center" | "end" = "start";
  @atomState() @property({ useDefault: true, noAccessor: true, type: Number, attribute: "side-offset" }) sideOffset = 4;
  @atomState() @property({ noAccessor: true, attribute: "avoid-collisions", converter: boolish }) avoidCollisions = true;
  /** @default false */
  @property({ noAccessor: true, type: Boolean, reflect: true }) get open(): boolean {
    return this.visibility;
  }
  set open(value: boolean) {
    const previous = this.visibility;
    if (previous === Boolean(value)) {
      return;
    }
    this.visibility = Boolean(value);
    this.restoreFocus = true;
    this.reason = "programmatic";
    this.requestUpdate("open", previous);
  }
  protected readonly appearance = createInheritedAppearance({ size: { supported: ["small", "medium", "large"] as const, defaultValue: "medium" } });
  private readonly appearanceUpdates = new StoreSelector(this, () => this.appearance.effective);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private text(key: string, fallback: string): string {
    return message(this.themeContext.scope.effective.get().locale, key, fallback);
  }
  /** @default "medium" */
  @property({ noAccessor: true, converter: optionalString }) get size(): "small" | "medium" | "large" {
    return this.appearance.effective.get().size!;
  }
  set size(value: "small" | "medium" | "large" | undefined) {
    if (value !== undefined && !["small", "medium", "large"].includes(value)) {
      throw new TypeError("Invalid selection control size");
    }
    const previous = this.size;
    this.appearance.setAuthored({ size: value });
    this.requestUpdate("size", previous);
  }
  protected readonly control: HTMLInputElement | HTMLButtonElement = this.ownerDocument.createElement(this.editable ? "input" : "button");
  private readonly constraint = this.ownerDocument.createElement("select");
  private readonly triggerContent = this.ownerDocument.createElement("slot");
  private readonly places = new Places(this, { places: ["start", "end", "start-addon", "end-addon", "trigger"] });
  private readonly group = new GroupMemberController(this, {
    surface: () => this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined,
    appearance: this.appearance,
    emphasized: () => this.effectiveInvalid,
  });
  private surface?: HTMLElement;
  private list?: HTMLElement;
  @atomState() private structureVersion = 0;
  private readonly ordered = createAtom(() => {
    void this.structureVersion;
    return Object.freeze(
      [...this.members].sort((a, b) =>
        this.editable ? (a.host === b.host ? 0 : a.host.compareDocumentPosition(b.host) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1) : selectionOrder({ host: a.host }, { host: b.host }),
      ),
    );
  });
  private readonly valueCounts = createAtom(() => {
    const counts = new Map<string | undefined, number>();
    for (const part of this.ordered.get()) {
      counts.set(part.value(), (counts.get(part.value()) ?? 0) + 1);
    }
    return counts;
  });
  private constraintValues = "";
  private completedOpen = false;
  private restoreFocus = true;
  private readonly presentation = createAtom(() => ({
    structureVersion: this.structureVersion,
    value: this.nativeForm.value,
    open: this.open,
    active: this.active,
    disabled: this.nativeForm.effectiveDisabled,
    members: this.members,
    query: this.queryValue,
    metadata: this.members.map((part) => [part.value(), part.text(), part.disabled(), part.section()]),
  }));
  private readonly ownerUpdates = new StoreSelector(this, () => this.presentation);
  private readonly owner: OptionOwner = {
    revision: this.presentation,
    register: (part) => {
      if (this.editable && part.host.parentNode !== this) {
        console.error("ComboBox options must be direct children. Use the section property for labelled groups.");
        return () => {
          /* A rejected option has no registration to release. */
        };
      }
      if (!this.members.includes(part)) {
        this.members = Object.freeze([...this.members, part]);
      }
      return () => {
        this.members = Object.freeze(this.members.filter((item) => item !== part));
        if (this.active === part) {
          this.active = undefined;
        }
      };
    },
    presentation: (part) => ({
      selected: this.validPart(part) && this.selectedValues.includes(part.value() ?? ""),
      highlighted: this.open && this.active === part,
      disabled: this.nativeForm.effectiveDisabled || part.disabled() || !this.validPart(part),
      hidden: !this.visibleOptions.includes(part),
    }),
    choose: (part) => this.choose(part),
    highlight: (part) => this.highlight(part),
  };
  private readonly provider = new ContextProvider(this, { context: optionContext, initialValue: this.owner });
  private readonly scopes = new ComposedParticipants(this, {
    owner: this.owner,
    // Ranked projection does not change direct-child collection ownership.
    parts: () => (this.editable ? [] : this.members),
    find: (element) => (this.editable ? undefined : optionPartFor(element)),
    boundary: isOptionBoundary,
    slots: () => Array.from(this.renderRoot?.querySelectorAll<HTMLSlotElement>("[part=list] slot") ?? []),
    changed: () => {
      this.structureVersion++;
    },
  });
  protected readonly nativeForm: NativeFormController<readonly string[], readonly OptionPart[]> = new NativeFormController<readonly string[], readonly OptionPart[]>(this, {
    initialValue: empty,
    valueAttribute: this.multiple ? undefined : "value",
    fromAttribute: (value) => this.attributeValue(value),
    toAttribute: (value) => (this.multiple ? JSON.stringify(value) : (value[0] ?? null)),
    normalize: (value) => {
      if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item) || new Set(value).size !== value.length || (!this.multiple && value.length > 1)) {
        throw new TypeError("Selection values must be unique nonempty strings");
      }
      const previous = this.nativeForm?.value;
      return previous && previous.length === value.length && previous.every((item, i) => item === value[i]) ? previous : Object.freeze([...value]);
    },
    extra: () => {
      for (const part of this.members) {
        part.value();
        part.disabled();
        part.text();
      }
      return this.members;
    },
    serialize: (state) => {
      const values = state.value.filter((value) => this.members.some((part) => part.value() === value && !part.disabled()));
      if (!this.multiple) {
        return values[0] ?? null;
      }
      const data = new FormData();
      if (state.name) {
        for (const value of values) {
          data.append(state.name, value);
        }
      }
      return state.name ? data : null;
    },
    restoration: (state) => JSON.stringify(state.value),
    restore: (value, mode) => {
      if (typeof value !== "string") {
        return empty;
      }
      if (mode === "autocomplete") {
        return value ? [value] : empty;
      }
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) && (this.multiple || parsed.length <= 1) && parsed.every((item) => typeof item === "string" && item) && new Set(parsed).size === parsed.length ? parsed : empty;
      } catch {
        return empty;
      }
    },
    target: () => (this.control.isConnected ? this.control : undefined),
    changed: (reason) => {
      if (reason === "reset" || reason === "restore" || reason === "programmatic" || reason === "default") {
        this.valueChanged();
      }
    },
    synchronize: (state) => {
      this.control.disabled = state.disabled || state.platformDisabled;
      if (this.multiple) {
        this.control.removeAttribute("aria-required");
      } else {
        this.control.setAttribute("aria-required", String(state.required));
      }
      this.control.setAttribute("aria-invalid", String(this.effectiveInvalid));
      this.control.setAttribute("aria-expanded", String(this.open));
      this.control.setAttribute("aria-haspopup", "listbox");
      if (this.list) {
        this.list.ariaLabelledByElements = [this.control];
      }
      const active = this.open && this.active && this.visibleOptions.includes(this.active) ? this.active.host : null;
      this.control.ariaActiveDescendantElement = this.multiple ? null : active;
      if (this.list) {
        this.list.ariaActiveDescendantElement = this.multiple ? active : null;
        this.list.setAttribute("aria-required", String(state.required));
      }
      this.constraint.multiple = this.multiple;
      this.constraint.required = state.required;
      this.constraint.disabled = state.disabled || state.platformDisabled;
      const known = state.value.filter((value) => this.members.some((part) => part.value() === value));
      const values = known.length ? known : this.multiple ? empty : [""];
      const signature = JSON.stringify(values);
      if (signature !== this.constraintValues) {
        this.constraintValues = signature;
        this.constraint.replaceChildren(
          ...values.map((value) => {
            const option = this.ownerDocument.createElement("option");
            option.value = value;
            option.selected = true;
            return option;
          }),
        );
      }
    },
    validate: () =>
      this.members.some((part) => !this.validPart(part))
        ? { flags: { customError: true }, message: this.text("selection.values", "Each option needs a unique nonempty value.") }
        : nativeValidation(this.constraint),
  });
  protected get selectedValues(): readonly string[] {
    return this.nativeForm.value;
  }
  protected set selectedValues(value: readonly string[]) {
    this.nativeForm.setValue(value);
  }
  protected get resetValues(): readonly string[] {
    return this.nativeForm.defaultValue;
  }
  protected set resetValues(value: readonly string[]) {
    this.nativeForm.setDefaultValue(value);
  }
  protected attributeValue(value: string | null): readonly string[] {
    if (value === null) {
      return empty;
    }
    if (!this.multiple) {
      return value ? [value] : empty;
    }
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : empty;
    } catch {
      return empty;
    }
  }
  protected valueChanged(): void {
    if (this.editable) {
      this.queryValue = this.displayValue;
    }
  }
  protected get allOptions(): readonly OptionPart[] {
    return this.ordered.get();
  }
  protected get visibleOptions(): readonly OptionPart[] {
    return this.allOptions.filter((part) => {
      let node: Node | null = part.host;
      while (node && node !== this && node !== this.surface) {
        if (node.nodeType === 1 && (node as HTMLElement).hidden) {
          return false;
        }
        node = (node.nodeType === 1 ? (node as Element).assignedSlot : null) ?? node.parentNode ?? (node.nodeType === 11 && "host" in node ? (node as ShadowRoot).host : null);
      }
      return true;
    });
  }
  private validPart(part: OptionPart): boolean {
    const value = part.value();
    return typeof value === "string" && value.length > 0 && this.valueCounts.get().get(value) === 1;
  }
  protected get enabled(): readonly OptionPart[] {
    return this.visibleOptions.filter((part) => !part.disabled() && this.validPart(part));
  }
  protected get displayValue(): string {
    return this.selectedValues.map((value) => this.members.find((part) => part.value() === value)?.text() ?? value).join(", ");
  }
  protected get effectiveInvalid(): boolean {
    return this.invalid || (this.field.description.get()?.invalid ?? false);
  }
  protected get semanticDefaults() {
    const defaults = super.semanticDefaults;
    const summary = this.multiple ? this.renderRoot?.querySelector<HTMLElement>("[part=value]") : undefined;
    return {
      ...defaults,
      role: this.multiple ? "button" : "combobox",
      controlsElements: this.list ? [this.list] : undefined,
      describedByElements: summary ? [...(defaults.describedByElements ?? []), summary] : defaults.describedByElements,
    };
  }
  private readonly presence = new OverlayPresence(this, {
    surface: () => this.surface!,
    mode: () => "popover",
    closeOnEscape: () => this.open,
    closeOnOutside: () => this.open,
    dismiss: (reason) => this.dismiss(reason, reason !== "outside"),
    after: (phase) => {
      if (phase === "closed") {
        this.positioner.stop();
        this.active = undefined;
        this.typeahead.clear();
        this.completedOpen = false;
        if (this.open) {
          this.open = false;
        }
        this.dispatchEvent(new CustomEvent("acme-after-close", { bubbles: true, composed: true, detail: { reason: this.reason } }));
      }
    },
  });
  private readonly motion = new SpringValue(
    this,
    () => (this.open ? 1 : 0),
    () => readMotionSpring(this, "standard", "effects", "fast"),
  );
  private readonly positioner = new OverlayPlacement(this, {
    configuration: () => ({
      strategy: "fixed",
      placement: (this.align === "center" ? this.side : `${this.side}-${this.align}`) as Placement,
      middleware: [
        offset(this.sideOffset),
        ...(this.avoidCollisions ? [flip(), shift({ padding: 8 })] : []),
        size({
          padding: 8,
          apply: ({ availableHeight, availableWidth, rects, elements }) => {
            elements.floating.style.setProperty("--option-available-height", `${Math.max(0, availableHeight)}px`);
            elements.floating.style.setProperty("--option-available-width", `${Math.max(0, availableWidth)}px`);
            elements.floating.style.setProperty("--option-trigger-width", `${rects.reference.width}px`);
          },
        }),
      ],
    }),
    apply: ({ x, y }) => {
      this.surface?.style.setProperty("--option-x", `${x}px`);
      this.surface?.style.setProperty("--option-y", `${y}px`);
    },
    error: (error) => {
      console.error("Selection placement failed", error);
      this.open = false;
    },
  });
  private readonly typeahead = new Typeahead(this, {
    items: () => this.enabled,
    current: () => this.active ?? this.enabled.find((part) => this.selectedValues.includes(part.value()!)),
    text: (part) => part.text(),
    move: (part) => {
      if (this.open) {
        this.highlight(part);
      } else {
        this.choose(part, true);
      }
    },
    locale: () => this.themeContext.scope.effective.get().locale,
  });
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      if (event.composedPath()[0] === this && !event.defaultPrevented) {
        this.focus();
      }
    });
    this.control.className = "native";
    this.control.setAttribute("part", this.editable ? "input" : "trigger");
    registerOptionBoundary(this);
    if (this.editable) {
      registerTextControl(this);
    }
    this.control.setAttribute("type", this.editable ? "text" : "button");
    if (!this.editable) {
      this.triggerContent.name = "trigger";
      this.control.append(this.triggerContent);
    }
    (this.control as HTMLElement).addEventListener("keydown", this.key);
    this.control.addEventListener("click", this.toggle);
    this.control.addEventListener("input", (event) => this.edit(event));
    this.control.addEventListener("compositionstart", () => {
      this.composing = true;
    });
    this.control.addEventListener("compositionend", () => {
      this.composing = false;
      this.edit(new Event("input"));
    });
    this.addEventListener("focusout", () =>
      queueMicrotask(() => {
        const active = deepActiveElement(this.ownerDocument);
        if (this.open && active && !composedContains(this, active)) {
          this.dismiss("outside", false);
        }
      }),
    );
  }
  protected edit(_event: Event): void {}
  private toggle = (event: Event): void => {
    if (event.defaultPrevented || this.nativeForm.effectiveDisabled) {
      return;
    }
    if (this.open && !this.editable) {
      this.dismiss("trigger");
    } else {
      this.openFromUser();
    }
  };
  show(): void {
    if (!this.nativeForm.effectiveDisabled) {
      this.open = true;
      this.active = this.enabled.find((part) => this.selectedValues.includes(part.value()!)) ?? this.enabled[0];
    }
  }
  hide(): void {
    this.restoreFocus = true;
    this.open = false;
  }
  protected openFromUser(): void {
    if (this.nativeForm.effectiveDisabled || this.open) {
      return;
    }
    this.show();
    this.control.focus({ preventScroll: true });
    this.reason = "trigger";
    this.notifyOpen();
  }
  private notifyOpen(): void {
    this.dispatchEvent(new CustomEvent("acme-open-change", { bubbles: true, composed: true, detail: { open: this.open, reason: this.reason } }));
  }
  protected dismiss(reason: string, restore = true): void {
    if (!this.open) {
      return;
    }
    if (!this.dispatchEvent(new CustomEvent("acme-request", { bubbles: true, composed: true, cancelable: true, detail: { action: "close", reason } }))) {
      return;
    }
    this.open = false;
    this.reason = reason;
    this.restoreFocus = restore;
    this.dismissed(reason);
    this.notifyOpen();
  }
  protected dismissed(_reason: string): void {}
  protected choose(part: OptionPart, closed = false): void {
    if ((!this.open && !closed) || this.nativeForm.effectiveDisabled || part.disabled() || !this.validPart(part)) {
      return;
    }
    const value = part.value()!;
    const values = this.multiple ? (this.selectedValues.includes(value) ? this.selectedValues.filter((item) => item !== value) : [...this.selectedValues, value]) : [value];
    const changed = values.length !== this.selectedValues.length || values.some((item, index) => item !== this.selectedValues[index]);
    this.nativeForm.setValue(values, "user");
    this.valueChanged();
    if (changed) {
      this.notifyValue();
    }
    if (this.open && !this.multiple) {
      this.dismiss("selection");
    }
  }
  private notifyValue(): void {
    this.dispatchEvent(new CustomEvent("acme-change", { bubbles: true, composed: true, detail: { value: this.multiple ? this.selectedValues : this.selectedValues[0] } }));
  }
  clear(): void {
    if (this.nativeForm.effectiveDisabled) {
      return;
    }
    const changed = this.selectedValues.length > 0;
    this.nativeForm.setValue(empty, "user");
    this.valueChanged();
    if (changed) {
      this.notifyValue();
    }
    if (this.multiple && this.open) {
      this.list?.focus();
    } else {
      this.control.focus();
    }
  }
  private highlight(part: OptionPart): void {
    if (!this.open || part.disabled() || !this.enabled.includes(part)) {
      return;
    }
    this.active = part;
    part.host.scrollIntoView({ block: "nearest", inline: "nearest" });
    this.nativeForm.sync();
  }
  private key = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || this.composing || this.nativeForm.effectiveDisabled || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (event.key === "Tab") {
      return;
    }
    if (this.multiple && event.currentTarget === this.control && ["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      if (!this.open) {
        this.openFromUser();
      } else if (event.key === "Enter" || event.key === " ") {
        this.dismiss("trigger");
      } else {
        this.list?.focus();
      }
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open) {
        this.openFromUser();
        if (event.key === "ArrowUp") {
          this.active = this.enabled.at(-1);
        }
        return;
      }
      const index = this.enabled.indexOf(this.active!),
        next = Math.max(0, Math.min(this.enabled.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)));
      if (this.enabled[next]) {
        this.highlight(this.enabled[next]);
      }
      return;
    }
    if (this.open && !this.editable && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      const part = event.key === "Home" ? this.enabled[0] : this.enabled.at(-1);
      if (part) {
        this.highlight(part);
      }
      return;
    }
    if (!this.editable && (this.open || !this.multiple) && this.typeahead.handleKey(event)) {
      return;
    }
    if (this.editable && !this.open && event.key === "Enter") {
      return;
    }
    if (event.key === "Enter" || (!this.editable && event.key === " ")) {
      event.preventDefault();
      if (this.open) {
        if (this.active) {
          this.choose(this.active);
        } else if (this.editable) {
          this.dismiss("selection");
        }
      } else {
        this.openFromUser();
      }
    }
  };
  disconnectedCallback() {
    this.open = false;
    super.disconnectedCallback();
  }
  protected willUpdate(changes: Map<string, unknown>) {
    if (changes.has("open")) {
      this.completedOpen = false;
    }
    if (this.nativeForm.effectiveDisabled && this.open) {
      this.open = false;
    }
    if (this.active && !this.enabled.includes(this.active)) {
      this.active = undefined;
    }
    this.motion.update();
    if (this.control instanceof HTMLButtonElement) {
      const text = this.displayValue || this.placeholder;
      if (this.triggerContent.textContent !== text) {
        this.triggerContent.textContent = text;
      }
    } else if (!this.composing && this.control.value !== this.queryValue) {
      this.control.value = this.queryValue;
    }
  }
  protected updated(changes: Map<string, unknown>) {
    this.surface = this.renderRoot.querySelector<HTMLElement>("[part=content]") ?? undefined;
    this.list = this.renderRoot.querySelector<HTMLElement>("[part=list]") ?? undefined;
    const surface = this.surface;
    if (!surface) {
      return;
    }
    const focused = deepActiveElement(this.ownerDocument);
    if (!this.open && !surface.inert && focused && composedContains(surface, focused) && this.restoreFocus) {
      this.control.focus();
      this.restoreFocus = false;
    }
    surface.inert = !this.open;
    surface.style.setProperty("--option-opacity", String(Math.max(0, Math.min(1, this.motion.value))));
    this.nativeForm.sync();
    if (this.open) {
      if (this.presence.phase.get() === "closed") {
        this.presence.show(this.control);
        this.positioner.start(this.renderRoot.querySelector<HTMLElement>("[part=root]")!, surface);
        if (this.multiple) {
          this.list?.focus({ preventScroll: true });
        }
      } else if (changes.has("side") || changes.has("align") || changes.has("sideOffset")) {
        this.positioner.refresh();
      }
      if (this.motion.settled && !this.completedOpen) {
        this.completedOpen = true;
        this.dispatchEvent(new CustomEvent("acme-after-open", { bubbles: true, composed: true, detail: { reason: this.reason } }));
      }
    } else if (this.motion.settled && this.presence.phase.get() !== "closed") {
      const active = deepActiveElement(this.ownerDocument);
      const transferred = active && active !== this.ownerDocument.body && active !== this.ownerDocument.documentElement && active !== this.control && !composedContains(surface, active);
      void this.presence.hide([], this.restoreFocus && !transferred);
    }
  }
  private submit = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    if (this.editable && this.form && !this.nativeForm.effectiveDisabled) {
      submitImplicitly(this.form);
    }
  };
  protected renderEndContent() {
    return html`<acme-expand-more-icon size="16px" @click=${this.toggle}></acme-expand-more-icon>`;
  }
  protected renderOptionContent() {
    return html`<slot></slot>`;
  }
  render() {
    return html`${this.multiple ? html`<span class="sr" part="value">${this.displayValue || this.text("selection.none", "No selection")}</span>` : nothing}<div class="root" part="root" data-size=${this.size} ?data-invalid=${this.effectiveInvalid} ?data-disabled=${this.nativeForm.effectiveDisabled}><span class="addon start-addon" part="start-addon" ?hidden=${!this.places.has("start-addon")}><slot name="start-addon" @slotchange=${this.places.read}></slot></span><form class="entry" novalidate @submit=${this.submit}><span class="affix" part="start" ?hidden=${!this.places.has("start")}><slot name="start" @slotchange=${this.places.read}></slot></span>${this.control}<span class="affix" part="end"><slot name="end">${this.renderEndContent()}</slot></span>${this.clearable && (this.selectedValues.length || (this.editable && this.queryValue)) ? html`<acme-icon-button part="clear" variant="tertiary" size="tiny" aria-label=${this.text("selection.clear", "Clear selection")} .disabled=${this.nativeForm.effectiveDisabled} @click=${() => this.clear()}><acme-close-icon size="16px"></acme-close-icon></acme-icon-button>` : nothing}</form><span class="addon end-addon" part="end-addon" ?hidden=${!this.places.has("end-addon")}><slot name="end-addon" @slotchange=${this.places.read}></slot></span></div><div class="content" part="content" popover="manual"><div part="list" role="listbox" tabindex="-1" @keydown=${this.key} aria-multiselectable=${this.multiple ? "true" : nothing}>${this.renderOptionContent()}</div>${this.visibleOptions.length ? nothing : html`<div role="status"><slot name="empty">${this.text("selection.empty", "No options")}</slot></div>`}<slot name="footer"></slot></div>`;
  }
}
