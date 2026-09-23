import { batch } from "@tanstack/lit-store";
import { html, nothing, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { flip, offset, shift, size } from "@floating-ui/dom";
import { AcmeFormElement } from "../../shared/native-form-element";
import { NativeFormController, type NativeFormValidation } from "../../shared/native-form";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { OverlayPresence } from "../../shared/overlay-presence";
import { OverlayPlacement } from "../../shared/overlay-placement";
import { SpringValue } from "../../shared/spring-value";
import { readMotionSpring } from "../../shared/motion-spring";
import { deepActiveElement, composedContains } from "../../shared/composed-tree";
import { DateFormatter, parseDate, toCalendarDate, startOfMonth, startOfWeek, getDayOfWeek, today, getLocalTimeZone, type CalendarDate } from "../../shared/date";
import { calendarEndpoint, calendarEdit, calendarGrid, calendarValue, calendarSnapshot, type CalendarValue, type CalendarMode, type CalendarPreset } from "../../shared/calendar-value";
import { optionalString } from "../../shared/attributes";
import { message, messageCatalogs } from "../../shared/messages";
import { createInheritedAppearance } from "../../shared/inherited-appearance";
import { GroupMemberController, groupMemberStyles } from "../../shared/group-member";
import { sharedCss, boolish } from "../../base";
import { calendarStructureCss } from "../../generated/components/calendar/calendar-structure.styles";
export type { CalendarValue, CalendarPreset } from "../../shared/calendar-value";
type Editors = { startDate: string; endDate: string; startTime: string; endTime: string };

/** Date or range selection, with civil dates or offset-bearing instants.
 * @slot trigger - Noninteractive content inside the native trigger button.
 * @slot footer - Independent content following calendar actions.
 * @csspart root - Calendar control.
 * @csspart trigger - Native popup trigger.
 * @csspart content - Inline or popup date content.
 * @csspart header - Month navigation.
 * @csspart grid - Date grid.
 * @csspart day - Native date button.
 * @csspart time - Native time editor.
 * @fires {CustomEvent<{value:CalendarValue}>} acme-input - A user updates a provisional value.
 * @fires {CustomEvent<{value:CalendarValue}>} acme-change - A user commits a valid value.
 */
export class AcmeCalendar extends AcmeFormElement<CalendarValue> {
  static styles = [sharedCss, groupMemberStyles, calendarStructureCss];
  static shadowRootOptions = { ...AcmeFormElement.shadowRootOptions, delegatesFocus: true };
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      if (event.composedPath()[0] === this && !event.defaultPrevented) this.focus();
    });
  }
  @atomState() private selectionMode: CalendarMode = "range";
  /** @default "range" */
  @property({ noAccessor: true, converter: optionalString }) get mode(): CalendarMode {
    return this.selectionMode;
  }
  set mode(value: CalendarMode | undefined) {
    value ??= "range";
    if (value !== "single" && value !== "range") throw new TypeError("Calendar mode must be single or range");
    if (value === this.mode) return;
    const previous = this.mode,
      current = this.nativeForm?.value;
    batch(() => {
      this.selectionMode = value;
      if (current !== undefined) {
        const converted = value === "single" ? (typeof current === "string" ? current : current.start) : typeof current === "string" ? { start: current } : current;
        if (JSON.stringify(converted) !== JSON.stringify(current)) this.value = converted;
      }
    });
    this.requestUpdate("mode", previous);
  }
  @atomState() private timed = true;
  /** @default true */
  @property({ noAccessor: true, attribute: "show-time-input", converter: boolish }) get showTimeInput(): boolean {
    return this.timed;
  }
  set showTimeInput(value: boolean) {
    const next = Boolean(value),
      previous = this.timed;
    if (next === previous) return;
    const current = this.nativeForm?.value;
    const convert = (text: string, clock: string) => {
      if (text.includes("T") === next) return text;
      const day = toCalendarDate(calendarEndpoint(text, text.includes("T"), this.zone)).toString();
      return calendarEdit(day, clock, next, this.zone, text.includes("T") ? text : undefined);
    };
    const converted =
      current === undefined
        ? undefined
        : typeof current === "string"
          ? convert(current, this.editors.startTime)
          : { start: convert(current.start, this.editors.startTime), ...(current.end ? { end: convert(current.end, this.editors.endTime) } : {}) };
    batch(() => {
      this.timed = next;
      if (current !== undefined && JSON.stringify(converted) !== JSON.stringify(current)) this.value = converted;
    });
    this.requestUpdate("showTimeInput", previous);
  }
  @atomState() private displayMode: "popover" | "inline" = "popover";
  /** @default "popover" */
  @property({ noAccessor: true, converter: optionalString }) get presentation(): "popover" | "inline" {
    return this.displayMode;
  }
  set presentation(value: "popover" | "inline" | undefined) {
    const next = value ?? "popover";
    if (next !== "popover" && next !== "inline") throw new TypeError("Calendar presentation must be inline or popover");
    const old = this.displayMode;
    this.displayMode = next;
    this.requestUpdate("presentation", old);
  }
  @atomState() private authoredLocale?: string;
  @property({ noAccessor: true, converter: optionalString }) get locale(): string | undefined {
    return this.authoredLocale;
  }
  set locale(value: string | undefined) {
    if (value !== undefined) Intl.getCanonicalLocales(value);
    const old = this.authoredLocale;
    this.authoredLocale = value;
    this.requestUpdate("locale", old);
  }
  @atomState() private authoredZone?: string;
  @property({ noAccessor: true, attribute: "time-zone", converter: optionalString }) get timeZone(): string | undefined {
    return this.authoredZone;
  }
  set timeZone(value: string | undefined) {
    if (value !== undefined) new Intl.DateTimeFormat("en-US", { timeZone: value });
    const old = this.authoredZone;
    batch(() => {
      this.authoredZone = value;
      this.editorError = "";
      this.validationVisible = false;
      if (this.nativeForm) {
        this.refreshEditors();
        this.resetView();
      }
    });
    this.requestUpdate("timeZone", old);
  }
  @atomState() @property({ noAccessor: true, attribute: "min-value", converter: optionalString }) minValue?: string;
  @atomState() @property({ noAccessor: true, attribute: "max-value", converter: optionalString }) maxValue?: string;
  @atomState() @property({ noAccessor: true, type: Boolean }) clearable = false;
  @atomState() @property({ noAccessor: true, type: Boolean }) invalid = false;
  @atomState() @property({ noAccessor: true, useDefault: true }) placeholder = "";
  private readonly appearance = createInheritedAppearance({ size: { supported: ["small", "medium"] as const, defaultValue: "medium" } });
  private readonly appearanceChanges = new StoreSelector(this, () => this.appearance.effective);
  private readonly group = new GroupMemberController(this, {
    surface: () => (this.presentation === "popover" ? this.trigger : undefined),
    appearance: this.appearance,
    emphasized: () => this.invalid || !!this.field.description.get()?.invalid,
  });
  /** @default "medium" */
  @property({ noAccessor: true, converter: optionalString }) get size(): "small" | "medium" {
    return this.appearance.effective.get().size!;
  }
  set size(value: "small" | "medium" | undefined) {
    if (value !== undefined && value !== "small" && value !== "medium") throw new TypeError("Calendar size must be small or medium");
    const old = this.size;
    this.appearance.setAuthored({ size: value });
    this.requestUpdate("size", old);
  }
  @atomState() private presetValues: readonly CalendarPreset[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, converter: { fromAttribute: (value: string | null) => (value === null ? undefined : JSON.parse(value)) } }) get presets(): readonly CalendarPreset[] {
    return this.presetValues;
  }
  set presets(value: readonly CalendarPreset[] | undefined) {
    if (value !== undefined && !Array.isArray(value)) throw new TypeError("Calendar presets must be an array");
    this.presetValues = Object.freeze(
      (value ?? []).map((preset) => {
        if (
          !preset ||
          typeof preset !== "object" ||
          typeof preset.label !== "string" ||
          !preset.label.trim() ||
          preset.value === undefined ||
          Object.keys(preset).some((key) => key !== "label" && key !== "value")
        )
          throw new TypeError("Each Calendar preset needs a label and value");
        return Object.freeze({ label: preset.label, value: calendarSnapshot(preset.value, this.zone)! });
      }),
    );
    this.requestUpdate("presets");
  }
  @atomState() private visible = false;
  @property({ noAccessor: true, type: Boolean, reflect: true }) get open() {
    return this.visible;
  }
  set open(value: boolean) {
    const previous = this.visible,
      next = Boolean(value);
    if (previous === next) return;
    this.visible = next;
    this.restoreFocus = true;
    this.requestUpdate("open", previous);
  }
  @property({ noAccessor: true }) get value(): CalendarValue {
    return this.nativeForm.value;
  }
  set value(value: CalendarValue) {
    this.nativeForm.setValue(value);
  }
  @property({ noAccessor: true, attribute: false }) get defaultValue(): CalendarValue {
    return this.nativeForm.defaultValue;
  }
  set defaultValue(value: CalendarValue) {
    this.nativeForm.setDefaultValue(value);
  }
  @atomState() private view: CalendarDate = today(getLocalTimeZone());
  @atomState() private focused: CalendarDate = this.view;
  @atomState() private editors: Editors = { startDate: "", endDate: "", startTime: "00:00:00", endTime: "23:59:00" };
  @atomState() private editorError = "";
  @atomState() private validationVisible = false;
  @atomState() private pendingUserChange = false;
  @atomState() private announcement = "";
  private surface?: HTMLDialogElement;
  private restoreFocus = true;
  private focusPending = false;
  private readonly themeChanges = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly catalogChanges = new StoreSelector(this, () => messageCatalogs);
  private get zone() {
    return this.timeZone ?? getLocalTimeZone();
  }
  private get language() {
    return this.locale ?? this.themeContext.scope.effective.get().locale ?? "en-US";
  }
  private text(key: string, fallback: string) {
    return message(this.language, key, fallback);
  }
  private get trigger() {
    return this.renderRoot?.querySelector<HTMLButtonElement>("[part=trigger]") ?? undefined;
  }
  private get grid() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=grid]") ?? undefined;
  }
  private get unavailable() {
    return this.nativeForm.effectiveDisabled;
  }
  private endpoints(value = this.value) {
    return typeof value === "string" ? { start: value, end: undefined } : (value ?? { start: undefined, end: undefined });
  }
  private day(value: string) {
    return toCalendarDate(calendarEndpoint(value, value.includes("T"), this.zone));
  }
  private format(value: string, full = false) {
    const date = calendarEndpoint(value, value.includes("T"), this.zone);
    const timed = "hour" in date,
      zone = timed ? this.zone : "UTC";
    return new DateFormatter(this.language, {
      calendar: "gregory",
      dateStyle: full ? "full" : "medium",
      ...(this.showTimeInput && timed ? { timeStyle: "short" as const } : {}),
      timeZone: zone,
    }).format(date.toDate(zone));
  }
  private get displayValue() {
    const { start, end } = this.endpoints();
    return start ? this.format(start) + (end ? " – " + this.format(end) : "") : this.placeholder || this.text("calendar.select", "Select date");
  }
  protected readonly nativeForm: NativeFormController<CalendarValue> = new NativeFormController<CalendarValue>(this, {
    initialValue: undefined,
    valueAttribute: "value",
    fromAttribute: (value) => (value === null || value === "" ? undefined : value.trim().startsWith("{") ? JSON.parse(value) : value),
    toAttribute: (value) => (value === undefined ? null : typeof value === "string" ? value : JSON.stringify(value)),
    normalize: (value) => {
      const next = calendarSnapshot(value, this.zone);
      return JSON.stringify(next) === JSON.stringify(this.nativeForm?.value) ? this.nativeForm?.value : next;
    },
    serialize: (state) => (state.value === undefined ? null : typeof state.value === "string" ? state.value : JSON.stringify(state.value)),
    restoration: (state) => JSON.stringify({ value: state.value ?? null }),
    restore: (value) => {
      if (typeof value !== "string") return undefined;
      try {
        return calendarSnapshot(JSON.parse(value).value ?? undefined, this.zone);
      } catch {
        return undefined;
      }
    },
    target: () => (this.presentation === "inline" || this.open ? (this.renderRoot?.querySelector<HTMLButtonElement>('[data-date][tabindex="0"]') ?? undefined) : this.trigger),
    extra: () => {
      this.minValue;
      this.maxValue;
      this.editorError;
      this.mode;
      this.showTimeInput;
      this.timeZone;
      return undefined;
    },
    validate: (state) => this.validation(state.value, state.required),
    changed: (reason) => {
      if (reason !== "user" && reason !== "constraints") {
        this.editorError = "";
        this.validationVisible = false;
        this.pendingUserChange = false;
        this.refreshEditors();
        this.resetView();
      }
    },
    synchronize: (state) => {
      this.trigger?.setAttribute("aria-haspopup", "dialog");
      this.trigger?.setAttribute("aria-expanded", String(this.open));
      if (this.trigger) this.trigger.ariaControlsElements = this.surface ? [this.surface] : null;
      const invalid =
        this.invalid ||
        !!this.field.description.get()?.invalid ||
        !!state.customValidity ||
        !!this.editorError ||
        (this.validationVisible && Object.keys(this.validation(state.value, state.required).flags).length > 0);
      this.semanticTarget?.setAttribute("aria-invalid", String(invalid));
      for (const control of this.renderRoot?.querySelectorAll<HTMLInputElement | HTMLButtonElement>("input,button") ?? [])
        control.disabled = state.disabled || state.platformDisabled || control.hasAttribute("data-unavailable");
    },
  });
  protected get semanticTarget() {
    return this.presentation === "inline" ? (this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined) : this.trigger;
  }
  protected get semanticDefaults() {
    const defaults = super.semanticDefaults;
    const summary = this.presentation === "popover" ? this.renderRoot?.querySelector<HTMLElement>(".selection-summary") : undefined;
    return {
      ...defaults,
      role: this.presentation === "inline" ? "group" : "button",
      controlsElements: this.presentation === "popover" && this.surface ? [this.surface] : undefined,
      describedByElements: summary ? [...(defaults.describedByElements ?? []), summary] : defaults.describedByElements,
    };
  }
  private validation(value: CalendarValue, required: boolean): NativeFormValidation {
    if (this.editorError) return { flags: { badInput: true }, message: this.editorError };
    try {
      calendarValue(value, this.mode, this.showTimeInput, this.zone);
      const { start, end } = this.endpoints(value);
      if (required && (!start || (this.mode === "range" && !end))) return { flags: { valueMissing: true }, message: this.text("calendar.required", "Choose a complete date selection") };
      const min = this.minValue ? calendarEndpoint(this.minValue, this.showTimeInput, this.zone) : undefined,
        max = this.maxValue ? calendarEndpoint(this.maxValue, this.showTimeInput, this.zone) : undefined;
      if (min && max && min.compare(max) > 0) return { flags: { customError: true }, message: this.text("calendar.bounds", "Minimum date must not exceed maximum date") };
      for (const item of [start, end])
        if (item) {
          const parsed = calendarEndpoint(item, this.showTimeInput, this.zone);
          if (min && parsed.compare(min) < 0) return { flags: { rangeUnderflow: true }, message: this.text("calendar.minimum", "Choose a date at or after the minimum") };
          if (max && parsed.compare(max) > 0) return { flags: { rangeOverflow: true }, message: this.text("calendar.maximum", "Choose a date at or before the maximum") };
        }
      return { flags: {}, message: "" };
    } catch {
      return { flags: { customError: true }, message: this.text("calendar.invalid", "Use a valid ISO date and time") };
    }
  }
  private refreshEditors() {
    const { start, end } = this.endpoints();
    const parts = (value: string | undefined, fallback: string) => {
      if (!value) return { day: "", time: fallback };
      const date = calendarEndpoint(value, value.includes("T"), this.zone);
      return { day: toCalendarDate(date).toString(), time: "hour" in date ? [date.hour, date.minute, date.second].map((n) => String(n).padStart(2, "0")).join(":") : fallback };
    };
    const a = parts(start, "00:00:00"),
      b = parts(end, "23:59:00");
    this.editors = { startDate: a.day, endDate: b.day, startTime: a.time, endTime: b.time };
  }
  private bounded(day: CalendarDate) {
    let result = day;
    try {
      if (this.minValue && result.compare(this.day(this.minValue)) < 0) result = this.day(this.minValue);
      if (this.maxValue && result.compare(this.day(this.maxValue)) > 0) result = this.day(this.maxValue);
    } catch {}
    return result;
  }
  private resetView() {
    const start = this.endpoints().start;
    this.focused = this.bounded(start ? this.day(start) : today(this.zone));
    this.view = startOfMonth(this.focused);
  }
  private readonly presence = new OverlayPresence(this, {
    surface: () => this.surface!,
    mode: () => "modal",
    closeOnEscape: () => this.open,
    closeOnOutside: () => this.open,
    dismiss: (reason) => this.close(reason),
    after: (phase) => {
      if (phase === "closed") this.placement.stop();
    },
  });
  private readonly motion = new SpringValue(
    this,
    () => (this.open ? 1 : 0),
    () => readMotionSpring(this, "standard", "effects", "fast"),
  );
  private readonly placement = new OverlayPlacement(this, {
    configuration: () => ({
      strategy: "fixed",
      placement: "bottom-start",
      middleware: [
        offset(4),
        flip(),
        shift({ padding: 8 }),
        size({ padding: 8, apply: ({ availableHeight, elements }) => elements.floating.style.setProperty("--calendar-available-height", `${Math.max(0, availableHeight)}px`) }),
      ],
    }),
    apply: ({ x, y }) => {
      this.surface?.style.setProperty("--calendar-x", `${x}px`);
      this.surface?.style.setProperty("--calendar-y", `${y}px`);
      this.revealFocusedDay();
    },
    error: (error) => {
      console.error("Calendar placement failed", error);
      this.open = false;
    },
  });
  show() {
    if (this.unavailable || this.presentation === "inline") return;
    this.resetView();
    this.focusPending = true;
    this.restoreFocus = true;
    this.open = true;
  }
  hide() {
    this.open = false;
  }
  private toggle = () => {
    if (this.unavailable) return;
    if (this.open) this.close("trigger");
    else {
      this.show();
      this.dispatchEvent(new CustomEvent("acme-open-change", { bubbles: true, composed: true, detail: { open: this.open, reason: "trigger" } }));
    }
  };
  private close(reason: string) {
    if (!this.open) return;
    const event = new CustomEvent("acme-request", { bubbles: true, composed: true, cancelable: true, detail: { action: "close", reason } });
    if (!this.dispatchEvent(event)) return;
    this.open = false;
    this.restoreFocus = reason !== "outside";
    this.dispatchEvent(new CustomEvent("acme-open-change", { bubbles: true, composed: true, detail: { open: false, reason } }));
  }
  private emit(type: "acme-input" | "acme-change") {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail: { value: this.value } }));
  }
  private provisional(value: CalendarValue) {
    const changed = JSON.stringify(value) !== JSON.stringify(this.value);
    this.nativeForm.setValue(value, "user");
    const accepted = this.value;
    this.editorError = "";
    if (changed) {
      this.pendingUserChange = true;
      this.emit("acme-input");
    }
    return this.value === accepted;
  }
  private commit = () => {
    if (this.unavailable) return;
    const { start, end } = this.endpoints();
    if (!this.checkValidity() || (start && this.mode === "range" && !end)) {
      this.validationVisible = true;
      return;
    }
    if (this.pendingUserChange) {
      this.pendingUserChange = false;
      this.emit("acme-change");
    }
    this.close("selection");
  };
  clear() {
    if (this.unavailable) return;
    const changed = this.value !== undefined;
    const accepted = this.provisional(undefined);
    this.refreshEditors();
    if ((changed || this.pendingUserChange) && accepted) {
      this.pendingUserChange = false;
      this.emit("acme-change");
    }
    this.focus();
  }
  private disabledDay(day: CalendarDate) {
    return this.unavailable || this.bounded(day).compare(day) !== 0;
  }
  private pick(day: CalendarDate) {
    if (this.disabledDay(day)) return;
    const { start, end } = this.endpoints();
    try {
      this.focused = day;
      this.view = startOfMonth(day);
      this.focusPending = true;
      if (this.mode === "single") this.provisional(calendarEdit(day.toString(), this.editors.startTime, this.showTimeInput, this.zone, start));
      else if (!start || end) this.provisional({ start: calendarEdit(day.toString(), this.editors.startTime, this.showTimeInput, this.zone) });
      else {
        const before = day.compare(this.day(start)) < 0;
        this.provisional({
          start: before ? calendarEdit(day.toString(), this.editors.startTime, this.showTimeInput, this.zone) : start,
          end: calendarEdit((before ? this.day(start) : day).toString(), this.editors.endTime, this.showTimeInput, this.zone, end),
        });
      }
      this.refreshEditors();
      this.announcement = this.displayValue;
      if (this.mode === "single" && !this.showTimeInput) this.commit();
    } catch (error) {
      this.editorError = String((error as Error).message);
    }
  }
  private edit(event: Event, key: keyof Editors) {
    const input = event.target as HTMLInputElement;
    if (input.validity.badInput) {
      this.editorError = this.text("calendar.invalid", "Use a valid date and time");
      this.nativeForm.sync();
      return;
    }
    this.editors = { ...this.editors, [key]: input.value };
    if ((event as InputEvent).isComposing) return;
    try {
      const { startDate, endDate, startTime, endTime } = this.editors;
      if (!startDate) {
        if (endDate) throw new Error(this.text("calendar.start", "Choose a start date"));
        this.provisional(undefined);
        return;
      }
      const previous = this.endpoints();
      const start = calendarEdit(startDate, startTime, this.showTimeInput, this.zone, previous.start);
      this.provisional(this.mode === "single" ? start : { start, ...(endDate ? { end: calendarEdit(endDate, endTime, this.showTimeInput, this.zone, previous.end) } : {}) });
    } catch (error) {
      this.editorError = String((error as Error).message);
    }
    this.nativeForm.sync();
  }
  private navigate(days: number, months = 0, years = 0, moveFocus = true) {
    this.focused = this.bounded(this.focused.add({ days, months, years }));
    this.view = startOfMonth(this.focused);
    this.focusPending = moveFocus;
  }
  private revealFocusedDay() {
    const active = deepActiveElement(this.ownerDocument);
    if (!active || !this.grid || !composedContains(this.grid, active)) return;
    if (this.presentation === "inline") {
      active.scrollIntoView({ block: "nearest", inline: "nearest" });
      return;
    }
    if (!this.surface) return;
    const bounds = this.surface.getBoundingClientRect();
    const target = active.getBoundingClientRect();
    if (target.top < bounds.top + 4) this.surface.scrollTop -= bounds.top + 4 - target.top;
    else if (target.bottom > bounds.bottom - 4) this.surface.scrollTop += target.bottom - bounds.bottom + 4;
  }
  private key = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || this.unavailable || event.altKey || event.ctrlKey || event.metaKey) return;
    const direction = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl" ? -1 : 1;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => this.navigate(-direction * (event.shiftKey ? 7 : 1)),
      ArrowRight: () => this.navigate(direction * (event.shiftKey ? 7 : 1)),
      ArrowUp: () => this.navigate(-7),
      ArrowDown: () => this.navigate(7),
      Home: () => this.navigate(-getDayOfWeek(this.focused, this.language)),
      End: () => this.navigate(6 - getDayOfWeek(this.focused, this.language)),
      PageUp: () => this.navigate(0, event.shiftKey ? 0 : -1, event.shiftKey ? -1 : 0),
      PageDown: () => this.navigate(0, event.shiftKey ? 0 : 1, event.shiftKey ? 1 : 0),
    };
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };
  protected willUpdate(changes: PropertyValues) {
    if (!["inline", "popover"].includes(this.presentation)) throw new TypeError("Calendar presentation must be inline or popover");
    if (this.unavailable || this.presentation === "inline") this.open = false;
    if (changes.has("timeZone") || changes.has("locale") || changes.has("showTimeInput")) {
      this.refreshEditors();
      this.resetView();
    }
    this.focused = this.bounded(this.focused);
    this.motion.update();
  }
  protected updated() {
    const next = this.renderRoot.querySelector<HTMLDialogElement>("dialog");
    if (this.surface && this.surface !== next) {
      void this.presence.hide([], false);
      this.placement.stop();
    }
    this.surface = next ?? undefined;
    if (this.surface) {
      this.surface.ariaLabelledByElements = this.trigger ? [this.trigger] : null;
      this.surface.ariaDescribedByElements = [...(this.semanticDefaults.describedByElements ?? [])];
      this.surface.inert = !this.open;
      this.surface.style.setProperty("--calendar-opacity", String(Math.max(0, Math.min(1, this.motion.value))));
      if (this.open) {
        if (this.presence.phase.get() === "closed") {
          this.presence.show(this.trigger);
          this.placement.start(this.trigger!, this.surface);
          this.focusPending = true;
        }
      } else if (this.motion.settled && this.presence.phase.get() !== "closed") {
        const active = deepActiveElement(this.ownerDocument);
        const external = active && active !== this.ownerDocument.body && active !== this.trigger && !composedContains(this.surface, active);
        void this.presence.hide([], this.restoreFocus && !external);
      }
    }
    if (this.focusPending && (this.open || this.presentation === "inline")) {
      this.focusPending = false;
      this.renderRoot.querySelector<HTMLButtonElement>('[data-date][tabindex="0"]')?.focus({ preventScroll: true });
      this.revealFocusedDay();
    }
    if (this.grid) this.grid.ariaLabelledByElements = this.semanticDefaults.labelledByElements ?? null;
    this.nativeForm.sync();
  }
  disconnectedCallback() {
    this.open = false;
    super.disconnectedCallback();
  }
  private editor(endpoint: "start" | "end") {
    return html`<label>${this.mode === "single" ? this.text("calendar.date", "Date") : endpoint === "start" ? this.text("calendar.start", "Start date") : this.text("calendar.end", "End date")}<input type="date" data-date-input=${endpoint} .value=${this.editors[`${endpoint}Date`]} ?disabled=${this.unavailable} @input=${(event: Event) => this.edit(event, `${endpoint}Date`)}></label>${this.showTimeInput ? html`<label>${this.mode === "single" ? this.text("calendar.time", "Time") : endpoint === "start" ? this.text("calendar.startTime", "Start time") : this.text("calendar.endTime", "End time")}<input part="time" type="time" step="1" data-time=${endpoint} .value=${this.editors[`${endpoint}Time`]} ?disabled=${this.unavailable} @input=${(event: Event) => this.edit(event, `${endpoint}Time`)}></label>` : nothing}`;
  }
  private get errorMessage() {
    return (
      this.editorError ||
      (this.validationVisible
        ? this.validationMessage || (this.mode === "range" && this.endpoints().start && !this.endpoints().end ? this.text("calendar.required", "Choose a complete date selection") : "")
        : "")
    );
  }
  private content() {
    const days = calendarGrid(this.view, this.language),
      { start, end } = this.endpoints();
    const startDay = start ? this.day(start) : undefined,
      endDay = end ? this.day(end) : undefined,
      selectedStart = startDay?.toString(),
      selectedEnd = endDay?.toString();
    const heading = new DateFormatter(this.language, { calendar: "gregory", month: "long", year: "numeric", timeZone: "UTC" }).format(this.view.toDate("UTC"));
    const weekday = new DateFormatter(this.language, { calendar: "gregory", weekday: "long", timeZone: "UTC" }),
      short = new DateFormatter(this.language, { calendar: "gregory", weekday: "short", timeZone: "UTC" }),
      number = new Intl.NumberFormat(this.language, { useGrouping: false });
    return html`<div class="editors">${this.editor("start")}${this.mode === "range" ? this.editor("end") : nothing}</div>${this.showTimeInput ? html`<p class="zone">${this.zone}</p>` : nothing}${
      this.presets.length
        ? html`<div class="presets" part="presets" role="group" aria-label=${this.text("calendar.presets", "Presets")}>${this.presets.map(
            (preset) =>
              html`<button type="button" ?disabled=${this.unavailable} @click=${() => {
                this.provisional(preset.value);
                this.refreshEditors();
                this.resetView();
                this.commit();
              }}>${preset.label}</button>`,
          )}</div>`
        : nothing
    }<div part="header" class="header"><h2 aria-live="polite">${heading}</h2><button type="button" aria-label=${this.text("calendar.previous", "Previous month")} ?disabled=${this.unavailable} @click=${() => this.navigate(0, -1, 0, false)}><acme-chevron-left-icon class="navigation-icon" size="16px"></acme-chevron-left-icon></button><button type="button" aria-label=${this.text("calendar.next", "Next month")} ?disabled=${this.unavailable} @click=${() => this.navigate(0, 1, 0, false)}><acme-chevron-right-icon class="navigation-icon" size="16px"></acme-chevron-right-icon></button></div><table part="grid" role="grid" aria-label=${this.text("calendar.dates", "Dates")} aria-multiselectable=${this.mode === "range" ? "true" : nothing} @keydown=${this.key}><thead><tr>${days.slice(0, 7).map((day) => html`<th scope="col" abbr=${weekday.format(day.toDate("UTC"))}>${short.format(day.toDate("UTC"))}</th>`)}</tr></thead><tbody>${Array.from(
      { length: 6 },
      (_, week) =>
        html`<tr>${days.slice(week * 7, week * 7 + 7).map((day) => {
          const date = day.toString(),
            selected = date === selectedStart || date === selectedEnd,
            inRange = !!startDay && !!endDay && day.compare(startDay) > 0 && day.compare(endDay) < 0,
            disabled = this.disabledDay(day);
          return html`<td role="gridcell" aria-selected=${String(selected || inRange)}><button part="day" type="button" data-date=${date} ?data-selected=${selected} ?data-in-range=${inRange} ?data-outside=${day.month !== this.view.month} ?data-unavailable=${disabled} ?disabled=${disabled} aria-current=${date === today(this.zone).toString() ? "date" : nothing} tabindex=${day.compare(this.focused) === 0 ? 0 : -1} aria-label=${new DateFormatter(this.language, { calendar: "gregory", dateStyle: "full", timeZone: "UTC" }).format(day.toDate("UTC"))} @focus=${() => {
            this.focused = day;
          }} @click=${() => this.pick(day)}>${number.format(day.day)}</button></td>`;
        })}</tr>`,
    )}</tbody></table>${this.errorMessage ? html`<p class="error" role="alert">${this.errorMessage}</p>` : nothing}<div class="actions">${this.clearable ? html`<button type="button" ?disabled=${this.unavailable} @click=${() => this.clear()}>${this.text("calendar.clear", "Clear")}</button>` : nothing}<button type="button" ?disabled=${this.unavailable} @click=${this.commit}>${this.text("calendar.apply", "Apply")}</button></div><slot name="footer"></slot><span class="sr" aria-live="polite">${this.announcement}</span>`;
  }
  render() {
    return html`<span class="sr selection-summary">${this.value === undefined ? this.text("calendar.none", "No date selected") : this.displayValue}</span><div part="root" data-size=${this.size} data-invalid=${this.invalid || this.field.description.get()?.invalid || false}>${this.presentation === "popover" ? html`<button part="trigger" type="button" aria-haspopup="dialog" aria-expanded=${String(this.open)} ?disabled=${this.unavailable} @click=${this.toggle}><span class="trigger-value"><slot name="trigger">${this.displayValue}</slot></span><acme-calendar-month-icon size="16px"></acme-calendar-month-icon></button><dialog part="content" class="calendar" aria-label=${this.text("calendar.title", "Choose dates")}>${this.content()}</dialog>` : html`<div part="content" class="calendar inline">${this.content()}</div>`}</div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-calendar": AcmeCalendar;
  }
}
