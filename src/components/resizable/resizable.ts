import { ContextProvider } from "@lit/context";
import { batch, createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { StoreSelector } from "../../shared/store-connection";
import { ComposedParticipants } from "../../shared/composed-participants";
import { isPlainRecord } from "../../shared/plain-record";
import { resolveLayout, resizePair, togglePane, handleRange, type Layout as ResizableLayout, type Pane } from "../../shared/resizable-layout";
import {
  resizableContext,
  resizablePartFor,
  resizableBoundary,
  markResizableBoundary,
  type ResizableOwner,
  type ResizablePart,
  type ResizableState,
  type ResizeHandleInfo,
} from "../../shared/resizable-context";
import { message, messageCatalogs } from "../../shared/messages";
import { resizableCss } from "../../generated/components/resizable/resizable.styles";
export type { Layout as ResizableLayout } from "../../shared/resizable-layout";
type Gesture = {
  part: ResizablePart;
  initial: ResizableLayout;
  pivot: number;
  signature: string;
  axis: "horizontal" | "vertical";
  rtl: boolean;
  kind: "pointer" | "keyboard";
  pointer?: number;
  point?: number;
  keys: Set<string>;
  target: HTMLElement;
  release(): void;
};
const same = (a: ResizableLayout, b: ResizableLayout) => JSON.stringify(a) === JSON.stringify(b);
function copySizes(value: readonly number[] | undefined): readonly number[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || !value.length || [...value].some((n) => typeof n !== "number" || !Number.isFinite(n) || n < 0 || n > 100) || value.every((n) => n === 0))
    throw new TypeError("sizes requires positive-total percentages");
  return Object.freeze([...value]);
}
function dataRecord(value: unknown): Record<string, unknown> {
  if (!isPlainRecord(value)) throw new TypeError("Layout fields must be plain data records");
  const output: [string, unknown][] = [];
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (typeof key !== "string" || !descriptor.enumerable || !("value" in descriptor)) throw new TypeError("Layout fields require enumerable data");
    output.push([key, descriptor.value]);
  }
  return Object.fromEntries(output);
}
function copyLayout(value: ResizableLayout): ResizableLayout {
  const input = dataRecord(value);
  if (Object.keys(input).some((key) => !["sizes", "collapsed", "previousSizes"].includes(key)) || !Array.isArray(input.collapsed) || input.collapsed.some((key) => typeof key !== "string" || !key))
    throw new TypeError("Layout requires sizes, collapsed and previousSizes");
  const records = [dataRecord(input.sizes), dataRecord(input.previousSizes)];
  for (const record of records)
    for (const size of Object.values(record)) if (typeof size !== "number" || !Number.isFinite(size) || size < 0 || size > 100) throw new TypeError("Layout sizes must be percentages");
  return Object.freeze({
    sizes: Object.freeze(records[0]) as Readonly<Record<string, number>>,
    collapsed: Object.freeze([...new Set(input.collapsed)]),
    previousSizes: Object.freeze(records[1]) as Readonly<Record<string, number>>,
  });
}
/** Keyed percentage panes with native keyboard and pointer resize controls.
 * @slot - Direct, alternating Resizable Panel and Resize Handle elements.
 * @csspart root - The layout surface.
 * @fires {CustomEvent<{sizes:readonly number[]}>} acme-input - Live user resize.
 * @fires {CustomEvent<ResizableLayout>} acme-change - Committed user layout.
 */
export class AcmeResizable extends AcmeSemanticElement {
  static styles = [sharedCss, resizableCss];
  @atomState() private axis: "horizontal" | "vertical" = "horizontal";
  /** @default "horizontal" */
  @property({ noAccessor: true, reflect: true, converter: optionalString }) get orientation(): "horizontal" | "vertical" {
    return this.axis;
  }
  set orientation(value: "horizontal" | "vertical" | undefined) {
    const next = value ?? "horizontal";
    if (next !== "horizontal" && next !== "vertical") throw new TypeError("Invalid Resizable orientation");
    const previous = this.axis;
    this.axis = next;
    this.requestUpdate("orientation", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean, reflect: true }) disabled = false;
  @atomState() private requestedSizes?: { value: readonly number[] | undefined };
  @atomState() private requestedLayout?: ResizableLayout;
  @property({ noAccessor: true, converter: { fromAttribute: (value: string | null) => (value === null ? undefined : JSON.parse(value)) } }) get sizes(): readonly number[] | undefined {
    if (this.requestedSizes) return this.requestedSizes.value;
    const panes = this.panels();
    if (!panes.length) return undefined;
    const sizes = this.current.get().layout.sizes;
    return panes.every((part) => Object.hasOwn(sizes, part.definition!().value)) ? Object.freeze(panes.map((part) => sizes[part.definition!().value])) : undefined;
  }
  set sizes(value: readonly number[] | undefined) {
    const next = copySizes(value),
      previous = this.sizes;
    const panes = this.definitions();
    if (panes.length && panes.every((p) => p.value) && (next === undefined || next.length === panes.length)) {
      const base = this.current.get().layout;
      const resolved = resolveLayout(panes, next, next === undefined ? { ...base, sizes: {} } : base);
      if (!same(resolved, base)) {
        this.finish(false);
        this.commit(resolved, false);
      }
      this.requestedSizes = undefined;
    } else this.requestedSizes = { value: next };
    this.requestedLayout = undefined;
    this.requestUpdate("sizes", previous);
  }
  private readonly members = createAtom<readonly ResizablePart[]>([]);
  private readonly structure = createAtom(0);
  private readonly current = createAtom<ResizableState>({ layout: resolveLayout([]), orientation: "horizontal", disabled: false, dragging: false, animate: false });
  private readonly initialCollapse = new Map<ResizablePart, { value: boolean; explicit: boolean }>();
  private gesture?: Gesture;
  private warned?: string;
  private signature = "";
  private readonly owner: ResizableOwner = {
    state: this.current,
    register: (part) => {
      this.members.set((parts) => [...parts, part]);
      if (part.kind === "panel") this.initialCollapse.set(part, { value: part.initialCollapsed?.() ?? false, explicit: false });
      return () => {
        if (this.gesture?.part === part) this.finish(false);
        this.members.set((parts) => parts.filter((p) => p !== part));
        this.initialCollapse.delete(part);
      };
    },
    collapse: (part, value) => {
      const key = part.definition?.().value;
      if (key && Object.hasOwn(this.current.get().layout.sizes, key)) this.changeCollapse(key, value);
      else {
        this.initialCollapse.set(part, { value, explicit: true });
        this.requestUpdate();
      }
    },
    handle: (part) => this.handleInfo(part),
    pointer: (part, event) => this.pointer(part, event),
    key: (part, event) => this.key(part, event),
    toggle: (part) => {
      const info = this.handleInfo(part);
      if (info.disabled || !info.before?.definition?.().collapsible) return;
      const value = info.before.definition().value;
      this.startKeyboard(part);
      this.tryUser(() => togglePane(this.definitions(), this.current.get().layout, value, !this.current.get().layout.collapsed.includes(value), info.pivot), true);
      this.finish(true);
    },
    blur: (part) => {
      if (this.gesture?.part === part) this.finish(false);
    },
    recover: (part) => this.recover(part),
  };
  private readonly provider = new ContextProvider(this, { context: resizableContext, initialValue: this.owner });
  private readonly projection = createAtom(() => ({
    members: this.members.get().map((part) => ({ part, definition: part.definition?.(), disabled: part.disabled?.() })),
    structure: this.structure.get(),
    state: this.current.get(),
  }));
  private readonly updates = new StoreSelector(this, () => this.projection);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.members.get(),
    find: resizablePartFor,
    boundary: resizableBoundary,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
    changed: () => this.structure.set((value) => value + 1),
  });
  constructor() {
    super();
    markResizableBoundary(this);
  }
  private elements(): Element[] {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>("slot");
    const nodes = slot ? slot.assignedElements({ flatten: true }) : [...this.children];
    return nodes.flatMap((node) => (node.localName === "slot" ? (node as HTMLSlotElement).assignedElements({ flatten: true }) : [node]));
  }
  private ordered(): ResizablePart[] {
    return this.elements()
      .map(resizablePartFor)
      .filter((part): part is ResizablePart => !!part && part.currentOwner() === this.owner);
  }
  private panels() {
    return this.ordered().filter((part) => part.kind === "panel");
  }
  private definitions(): Pane[] {
    return this.panels().map((part) => part.definition!());
  }
  /** A frozen snapshot; applications own its persistence. */
  getLayout(): ResizableLayout {
    return this.current.get().layout;
  }
  setLayout(value: ResizableLayout): void {
    const snapshot = copyLayout(value),
      panes = this.definitions();
    if (panes.length && panes.every((p) => p.value)) {
      const next = resolveLayout(panes, undefined, snapshot);
      if (!same(next, this.getLayout())) {
        this.finish(false);
        this.commit(next, true);
      }
      this.requestedLayout = undefined;
    } else this.requestedLayout = snapshot;
    this.requestedSizes = undefined;
    this.requestUpdate();
  }
  collapse(value: string) {
    this.changeCollapse(value, true);
  }
  expand(value: string) {
    this.changeCollapse(value, false);
  }
  private changeCollapse(value: string, collapsed: boolean) {
    if (!Object.hasOwn(this.getLayout().sizes, value)) throw new Error("Resizable layout is not ready for this pane");
    const panes = this.definitions();
    const base = resolveLayout(panes, undefined, this.getLayout());
    const next = togglePane(panes, base, value, collapsed);
    if (!same(next, this.getLayout())) {
      this.finish(false);
      this.commit(next, true);
    }
  }
  private commit(layout: ResizableLayout, animate: boolean) {
    const previous = this.current.get();
    this.current.set({ ...previous, layout, orientation: this.orientation, disabled: Boolean(this.disabled), animate, error: undefined });
  }
  private reconcile() {
    const parts = this.ordered(),
      panes = this.definitions();
    if (parts.length && (parts.length !== this.elements().length || parts.some((part, index) => part.kind !== (index % 2 === 0 ? "panel" : "handle")) || parts.at(-1)?.kind !== "panel"))
      throw new TypeError("Resizable requires direct alternating panels and handles");
    let base = this.requestedLayout ?? this.getLayout();
    const closed = new Set(base.collapsed);
    for (const [part, request] of this.initialCollapse) {
      const pane = part.definition!();
      if (request.explicit || !Object.hasOwn(base.sizes, pane.value)) {
        if (request.value && !pane.collapsible) throw new TypeError("Only collapsible panes can start collapsed");
        if (request.value) closed.add(pane.value);
        else closed.delete(pane.value);
      }
    }
    base = { ...base, collapsed: [...closed] };
    if (this.requestedSizes && this.requestedSizes.value === undefined) base = { ...base, sizes: {} };
    const next = resolveLayout(panes, this.requestedSizes?.value, base),
      previous = this.current.get();
    const signature = JSON.stringify({ panes, orientation: this.orientation });
    const configurationChanged = signature !== this.signature;
    if (this.gesture && (signature !== this.gesture.signature || this.disabled || this.gesture.part.disabled?.())) this.finish(false);
    this.signature = signature;
    if (configurationChanged || !same(next, previous.layout) || previous.error || previous.orientation !== this.orientation || previous.disabled !== Boolean(this.disabled))
      this.commit(next, this.requestedLayout !== undefined);
    this.requestedSizes = undefined;
    this.requestedLayout = undefined;
    this.initialCollapse.clear();
    this.warned = undefined;
  }
  private handleInfo(part: ResizablePart): ResizeHandleInfo {
    const parts = this.ordered(),
      index = parts.indexOf(part),
      before = parts[index - 1],
      after = parts[index + 1],
      panes = this.panels(),
      pivot = panes.indexOf(before);
    const state = this.current.get();
    if (
      pivot < 0 ||
      before?.kind !== "panel" ||
      after?.kind !== "panel" ||
      !Object.hasOwn(state.layout.sizes, before.definition!().value) ||
      !Object.hasOwn(state.layout.sizes, after.definition!().value)
    )
      return { pivot: -1, min: 0, max: 100, now: 0, disabled: true };
    const definitions = this.definitions();
    if (state.error || JSON.stringify({ panes: definitions, orientation: this.orientation }) !== this.signature || definitions.some((pane) => !Object.hasOwn(state.layout.sizes, pane.value)))
      return { before, after, pivot, min: 0, max: 100, now: state.layout.sizes[before.definition!().value], disabled: true };
    return {
      before,
      after,
      pivot,
      ...handleRange(definitions, state.layout, pivot),
      disabled: !!this.disabled || !!part.disabled?.(),
    };
  }
  private direction() {
    return this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl";
  }
  private paneExtent() {
    return this.panels().reduce((total, part) => total + (this.orientation === "horizontal" ? part.host.getBoundingClientRect().width : part.host.getBoundingClientRect().height), 0);
  }
  private startKeyboard(part: ResizablePart): Gesture {
    if (this.gesture?.kind === "keyboard" && this.gesture.part === part) return this.gesture;
    this.finish(false);
    const info = this.handleInfo(part),
      target = part.element()!;
    const gesture: Gesture = {
      part,
      initial: this.getLayout(),
      pivot: info.pivot,
      signature: this.signature,
      axis: this.orientation,
      rtl: this.direction(),
      kind: "keyboard",
      keys: new Set(),
      target,
      release: () => {},
    };
    const view = this.ownerDocument.defaultView!,
      keyup = (event: KeyboardEvent) => {
        gesture.keys.delete(event.key);
        if (!gesture.keys.size) this.finish(true);
      },
      blur = () => this.finish(false);
    view.addEventListener("keyup", keyup);
    view.addEventListener("blur", blur);
    gesture.release = () => {
      view.removeEventListener("keyup", keyup);
      view.removeEventListener("blur", blur);
    };
    this.gesture = gesture;
    return gesture;
  }
  private applyUser(layout: ResizableLayout, animate = false) {
    if (same(layout, this.getLayout())) return;
    this.commit(layout, animate);
    this.dispatchEvent(new CustomEvent("acme-input", { bubbles: true, composed: true, detail: Object.freeze({ sizes: this.sizes }) }));
  }
  private tryUser(action: () => ResizableLayout, animate = false) {
    try {
      this.applyUser(action(), animate);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      if (this.warned !== error.message) {
        this.warned = error.message;
        console.warn(this.localName, { code: "resize-limit", message: error.message });
      }
    }
  }
  private finish(commit: boolean) {
    const gesture = this.gesture;
    if (!gesture) return;
    this.gesture = undefined;
    gesture.release();
    if (gesture.pointer !== undefined && gesture.target.hasPointerCapture?.(gesture.pointer)) gesture.target.releasePointerCapture(gesture.pointer);
    this.current.set((previous) => ({ ...previous, dragging: false }));
    if (commit && !same(gesture.initial, this.getLayout())) this.dispatchEvent(new CustomEvent("acme-change", { bubbles: true, composed: true, detail: this.getLayout() }));
  }
  private pointer(part: ResizablePart, event: PointerEvent) {
    const info = this.handleInfo(part);
    if (event.defaultPrevented || !event.isPrimary || event.button !== 0 || info.disabled) return;
    this.finish(false);
    const target = part.element()!,
      extent = this.paneExtent();
    if (extent <= 0) return;
    event.preventDefault();
    event.stopPropagation();
    target.focus({ preventScroll: true });
    const gesture: Gesture = {
      part,
      initial: this.getLayout(),
      pivot: info.pivot,
      signature: this.signature,
      axis: this.orientation,
      rtl: this.direction(),
      kind: "pointer",
      pointer: event.pointerId,
      point: this.orientation === "horizontal" ? event.clientX : event.clientY,
      keys: new Set(),
      target,
      release: () => {},
    };
    const move = (input: PointerEvent) => {
      if (input.pointerId !== gesture.pointer || this.gesture !== gesture) return;
      const length = this.paneExtent();
      if (!length || this.direction() !== gesture.rtl || this.disabled || part.disabled?.() || JSON.stringify({ panes: this.definitions(), orientation: this.orientation }) !== gesture.signature) {
        this.finish(false);
        return;
      }
      const point = gesture.axis === "horizontal" ? input.clientX : input.clientY,
        delta = ((point - gesture.point!) / length) * 100 * (gesture.axis === "horizontal" && gesture.rtl ? -1 : 1);
      this.applyUser(resizePair(this.definitions(), gesture.initial, gesture.pivot, delta, gesture.initial));
    };
    const up = (input: PointerEvent) => {
        if (input.pointerId === gesture.pointer) this.finish(true);
      },
      cancel = (input: Event) => {
        if (!("pointerId" in input) || (input as PointerEvent).pointerId === gesture.pointer) this.finish(false);
      },
      view = this.ownerDocument.defaultView!;
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
    target.addEventListener("pointercancel", cancel);
    target.addEventListener("lostpointercapture", cancel);
    view.addEventListener("blur", cancel);
    const document = this.ownerDocument;
    const visibility = () => {
      if (document.hidden) this.finish(false);
    };
    document.addEventListener("visibilitychange", visibility);
    const resize = new ResizeObserver(() => {
      if (this.gesture === gesture && Math.abs(this.paneExtent() - extent) > 0.5) this.finish(false);
    });
    resize.observe(this.semanticTarget ?? this);
    gesture.release = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", cancel);
      target.removeEventListener("lostpointercapture", cancel);
      view.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", visibility);
      resize.disconnect();
    };
    this.gesture = gesture;
    this.current.set((previous) => ({ ...previous, dragging: true, animate: false }));
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
      this.finish(false);
    }
  }
  private key(part: ResizablePart, event: KeyboardEvent) {
    const info = this.handleInfo(part);
    if (info.disabled || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    const horizontal = this.orientation === "horizontal",
      direction = horizontal && this.direction() ? -1 : 1,
      step = part.step!(event.shiftKey);
    const delta =
      event.key === "Home"
        ? -100
        : event.key === "End"
          ? 100
          : horizontal && event.key === "ArrowLeft"
            ? -step * direction
            : horizontal && event.key === "ArrowRight"
              ? step * direction
              : !horizontal && event.key === "ArrowUp"
                ? -step
                : !horizontal && event.key === "ArrowDown"
                  ? step
                  : undefined;
    if (delta === undefined && event.key !== "Enter") return;
    event.preventDefault();
    const gesture = this.startKeyboard(part);
    gesture.keys.add(event.key);
    const panes = this.definitions(),
      layout = this.getLayout();
    if (event.key === "Enter") {
      if (event.repeat) return;
      const pane = panes[info.pivot];
      if (pane.collapsible) this.tryUser(() => togglePane(panes, layout, pane.value, !layout.collapsed.includes(pane.value), info.pivot, gesture.initial), true);
      return;
    }
    const shrinking = delta! < 0 ? panes[info.pivot] : panes[info.pivot + 1];
    if (shrinking.collapsible && !layout.collapsed.includes(shrinking.value) && layout.sizes[shrinking.value] <= (shrinking.minSize ?? 0) + 1e-8) {
      try {
        this.applyUser(togglePane(panes, layout, shrinking.value, true, info.pivot, gesture.initial), true);
        return;
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
      }
    }
    this.tryUser(() => resizePair(panes, layout, info.pivot, delta!, gesture.initial));
  }
  private recover(part: ResizablePart) {
    const parts = this.ordered(),
      index = parts.indexOf(part);
    const handle = [parts[index + 1], parts[index - 1]].find((candidate) => candidate?.kind === "handle" && !this.handleInfo(candidate).disabled);
    (handle?.element() ?? this.semanticTarget)?.focus({ preventScroll: true });
  }
  protected get semanticDefaults() {
    return { role: "group", label: message(this.themeContext.scope.effective.get().locale, "resizable.label", "Resizable panes") };
  }
  protected willUpdate() {
    if (!this.isConnected) return;
    try {
      batch(() => this.reconcile());
    } catch (error) {
      this.finish(false);
      const message = (error as Error).message;
      if (this.warned !== message) {
        this.warned = message;
        console.warn(this.localName, { code: "invalid-resizable-layout", message });
      }
      if (this.current.get().error !== message || this.current.get().orientation !== this.orientation || this.current.get().disabled !== Boolean(this.disabled))
        this.current.set((previous) => ({ ...previous, error: message, orientation: this.orientation, disabled: Boolean(this.disabled) }));
    }
  }
  disconnectedCallback() {
    this.finish(false);
    super.disconnectedCallback();
  }
  render() {
    return html`<div part="root" tabindex="-1" data-axis=${this.orientation} ?data-resizing=${this.current.get().dragging} ?data-invalid=${!!this.current.get().error}><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-resizable": AcmeResizable;
  }
}
