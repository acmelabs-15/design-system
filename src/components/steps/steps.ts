import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { isFocusable } from "tabbable";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { ComposedParticipants } from "../../shared/composed-participants";
import { RovingTabindex } from "../../shared/roving-tabindex";
import { deepActiveElement, composedContains } from "../../shared/composed-tree";
import { focusAvailable } from "../../shared/focus-recovery";
import { message, messageCatalogs } from "../../shared/messages";
import { stepsContext, stepsPartFor, isStepsBoundary, registerStepsBoundary, type StepsOwner, type StepsPart, type StepsView } from "../../shared/steps-context";
import { stepsCss } from "../../generated/components/steps/steps.styles";
/** Coordinates a named sequence of interactive steps and application-owned validation.
 * @slot - Step members.
 * @slot panels - Step Content members keyed to their Step.
 * @slot completed - Content displayed at value=count.
 * @slot actions - Previous and Next controls.
 * @csspart root - The sequence layout.
 * @csspart list - The named tab list.
 * @csspart panels - The content region.
 * @csspart completed - The completion region.
 * @csspart actions - The action region.
 * @fires {CustomEvent<{action:"step",value:number,previousValue:number}>} acme-request - Cancelable request before a user transition.
 * @fires {CustomEvent<{value:number}>} acme-change - An accepted user transition.
 */
export class AcmeSteps extends AcmeSemanticElement {
  static styles = [sharedCss, stepsCss];
  @atomState() private indexValue = 0;
  /** Zero-based index; count explicitly represents completion. @default 0 */
  @property({ noAccessor: true, type: Number, useDefault: true }) get value(): number {
    return this.indexValue;
  }
  set value(value: number) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError("Steps value requires a nonnegative safe integer");
    }
    const previous = this.indexValue;
    this.indexValue = value;
    this.requestUpdate("value", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) linear = false;
  @atomState() private axis: "horizontal" | "vertical" = "horizontal";
  /** @default "horizontal" */
  @property({ noAccessor: true, useDefault: true }) get orientation(): "horizontal" | "vertical" {
    return this.axis;
  }
  set orientation(value: "horizontal" | "vertical") {
    if (value !== "horizontal" && value !== "vertical") {
      throw new TypeError("Invalid Steps orientation");
    }
    const previous = this.axis;
    this.axis = value;
    this.requestUpdate("orientation", previous);
  }
  private readonly parts = createAtom<readonly StepsPart[]>([]);
  private readonly revision = createAtom(0);
  private readonly focused = createAtom<{ part?: StepsPart }>({});
  private readonly view = createAtom<StepsView>(() => {
    this.revision.get();
    const parts = this.parts.get();
    for (const part of parts) {
      part.value();
    }
    const items = parts
      .filter((part) => part.kind === "item")
      .sort((a, b) => (a.host.compareDocumentPosition(b.host) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1))
      .map((part) => ({ part, value: part.value(), disabled: part.disabled(), completed: part.completed?.() }));
    return { value: this.value, linear: this.linear, orientation: this.orientation, items, parts, focused: this.focused.get().part };
  });
  /** Number of registered steps. */
  get count(): number {
    return this.view.get().items.length;
  }
  /** Completion is the explicit value=count state of a nonempty sequence. */
  get completed(): boolean {
    return this.count > 0 && this.value === this.count;
  }
  private readonly owner: StepsOwner = {
    view: this.view,
    register: (part) => {
      this.parts.set((parts) => [...parts, part]);
      return () => this.parts.set((parts) => parts.filter((p) => p !== part));
    },
    index: (value) => this.view.get().items.findIndex((item) => item.value === value),
    valid: (value) => !!value.trim() && this.view.get().items.filter((item) => item.value === value).length === 1,
    current: (value) => this.owner.valid(value) && this.owner.index(value) === this.value,
    complete: (value) => {
      const item = this.view.get().items.find((item) => item.value === value);
      return this.owner.valid(value) && (item?.completed ?? this.owner.index(value) < this.value);
    },
    counterpart: (kind, value) => this.parts.get().find((part) => part.kind === kind && part.value() === value),
    tabindex: (part) => (this.entry() === part ? 0 : -1),
    focus: (part) => {
      this.focused.set({ part });
    },
    move: (part) => this.move(part),
    recover: () => this.recover(),
    canMove: (part) => this.destination(part) !== undefined,
  };
  private readonly provider = new ContextProvider(this, { context: stepsContext, initialValue: this.owner });
  private readonly updates = new StoreSelector(this, () => this.view);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.parts.get(),
    find: stepsPartFor,
    boundary: isStepsBoundary,
    descend: (part) => part.kind === "item",
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
    changed: () => this.revision.set((value) => value + 1),
  });
  private readonly roving = new RovingTabindex(this, {
    items: () => this.available().flatMap((part) => part.target() ?? []),
    current: () => 0,
    orientation: () => this.orientation,
    rtl: () => getComputedStyle(this).direction === "rtl",
    wrap: true,
    homeEnd: true,
    onMove: () => {
      /* Focus movement does not change the current step. */
    },
  });
  private diagnostic = "";
  constructor() {
    super();
    registerStepsBoundary(this);
  }
  private available() {
    return this.view.get().items.flatMap((item) => {
      const part = this.owner.counterpart("trigger", item.value),
        target = part?.target();
      return !item.disabled && this.owner.valid(item.value) && (!this.linear || this.owner.current(item.value)) && part && target && isFocusable(target, { getShadowRoot: true }) ? [part] : [];
    });
  }
  private entry() {
    const available = this.available(),
      focused = this.focused.get().part;
    return focused && available.includes(focused) ? focused : (available.find((part) => this.owner.current(part.value())) ?? available[0]);
  }
  private destination(part: StepsPart): number | undefined {
    if (this.value > this.count || !this.count) {
      return;
    }
    if (part.kind === "trigger") {
      if (this.linear || part.disabled() || !this.owner.valid(part.value())) {
        return;
      }
      const index = this.owner.index(part.value());
      return index === this.value ? undefined : index;
    }
    const direction = part.kind === "next" ? 1 : part.kind === "previous" ? -1 : 0;
    if (!direction) {
      return;
    }
    let next = this.value + direction;
    const items = this.view.get().items;
    while (next >= 0 && next < items.length && (items[next].disabled || !this.owner.valid(items[next].value))) {
      next += direction;
    }
    if (next >= 0 && next <= this.count && next !== this.value) {
      return next;
    }
  }
  private move(part: StepsPart) {
    const next = this.destination(part);
    if (next === undefined) {
      return;
    }
    const previous = this.value;
    const request = new CustomEvent("acme-request", { detail: Object.freeze({ action: "step", value: next, previousValue: previous }), bubbles: true, composed: true, cancelable: true });
    if (!this.dispatchEvent(request) || this.value !== previous || !this.isConnected || next !== this.destination(part)) {
      return;
    }
    this.value = next;
    this.focused.set({});
    this.dispatchEvent(new CustomEvent("acme-change", { detail: Object.freeze({ value: next }), bubbles: true, composed: true }));
  }
  private recover() {
    const selected = this.view.get().items[this.value];
    if (selected && focusAvailable(this.owner.counterpart("trigger", selected.value)?.target())) {
      return;
    }
    if (this.completed) {
      this.renderRoot.querySelector<HTMLElement>("[part=completed]")?.focus({ preventScroll: true });
    } else {
      this.renderRoot.querySelector<HTMLElement>("[part=list]")?.focus({ preventScroll: true });
    }
  }
  private keydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.isComposing) {
      return;
    }
    const available = this.available(),
      index = available.findIndex((part) => part.target() === event.composedPath()[0]);
    if (index >= 0 && this.roving.handleKey(event, index)) {
      event.stopPropagation();
    }
  };
  protected get semanticTarget() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=list]") ?? undefined;
  }
  protected get semanticDefaults() {
    return { role: "tablist" };
  }
  protected willUpdate() {
    const completed = this.renderRoot?.querySelector<HTMLElement>("[part=completed]"),
      active = deepActiveElement(this.ownerDocument);
    if (!this.completed && completed && active && composedContains(completed, active)) {
      this.recover();
    }
  }
  protected updated() {
    const keys = this.view.get().items.map((item) => item.value);
    const issue = keys.some((key) => !this.owner.valid(key)) ? "step-values-must-be-unique" : this.count && this.value > this.count ? "step-index-out-of-range" : "";
    if (issue && issue !== this.diagnostic) {
      console.warn(this.localName, { code: issue });
    }
    this.diagnostic = issue;
    for (const part of this.parts.get()) {
      part.host.requestUpdate();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this.keydown);
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this.keydown);
    this.focused.set({});
    super.disconnectedCallback();
  }
  render() {
    return html`<div part="root" data-orientation=${this.orientation}><div part="list" tabindex="-1" aria-orientation=${this.orientation}><slot></slot></div><div part="panels"><slot name="panels"></slot></div><div part="completed" role="group" aria-label=${message(this.themeContext.scope.effective.get().locale, "steps.completed", "Completed steps")} tabindex="-1" ?hidden=${!this.completed} ?inert=${!this.completed}><slot name="completed"></slot></div><div part="actions"><slot name="actions"></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-steps": AcmeSteps;
  }
}
