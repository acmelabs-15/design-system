import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { boolish, sharedCss } from "../../base";
import { toastViewportCss } from "../../generated/components/toast-viewport/toast-viewport.styles";
import { atomState } from "../../shared/atom-state";
import { ComposedParticipants } from "../../shared/composed-participants";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { message, messageCatalogs } from "../../shared/messages";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { StoreSelector } from "../../shared/store-connection";
import { type ToastGeometry, type ToastOwner, type ToastPart, type ToastPlacement, type ToastView, toastContext, toastPartFor } from "../../shared/toast-context";
import { type ToastEntry, type ToastRuntime, type ToastStore, toastRuntime } from "../../shared/toast-store";
/** Presents one explicit notification store with limited, overlapping messages.
 * @slot - Optional direct Toast children keyed by toast-id for authored content.
 * @csspart root - Stable viewport wrapper.
 * @csspart viewport - Native top-layer notification region.
 * @csspart list - Positioned message list.
 * @csspart announcer - Polite announcements for visible message changes.
 * @fires {CustomEvent<{id:string,reason:string}>} acme-dismiss - Store dismissal; emitted by the matching Toast when rendered.
 */
export class AcmeToastViewport extends AcmeSemanticElement {
  static shadowRootOptions = { ...AcmeSemanticElement.shadowRootOptions, slotAssignment: "manual" as const };
  static styles = [sharedCss, toastViewportCss];
  @atomState() private supplied?: ToastStore;
  @property({ noAccessor: true, attribute: false }) get store(): ToastStore | undefined {
    return this.supplied;
  }
  set store(value: ToastStore | undefined) {
    if (value !== undefined) {
      toastRuntime(value);
    }
    const previous = this.supplied;
    this.supplied = value;
    this.requestUpdate("store", previous);
  }
  @atomState() private edge: ToastPlacement = "bottom-end";
  /** @default "bottom-end" */
  @property({ noAccessor: true, useDefault: true }) get placement(): ToastPlacement {
    return this.edge;
  }
  set placement(value: ToastPlacement) {
    if (!["top-start", "top-end", "bottom-start", "bottom-end"].includes(value)) {
      throw new TypeError("Invalid Toast placement");
    }
    const previous = this.edge;
    this.edge = value;
    this.requestUpdate("placement", previous);
  }
  @atomState() private visibleLimit = 3;
  /** @default 3 */
  @property({ noAccessor: true, type: Number, useDefault: true }) get limit() {
    return this.visibleLimit;
  }
  set limit(value: number) {
    if (!Number.isSafeInteger(value) || value < 1) {
      throw new RangeError("Toast limit requires a positive safe integer");
    }
    const previous = this.visibleLimit;
    this.visibleLimit = value;
    this.requestUpdate("limit", previous);
  }
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true, attribute: "expand-on-interaction" }) expandOnInteraction = true;
  @atomState() private hovered = false;
  @atomState() private focused = false;
  @atomState() private touching = false;
  @atomState() private gap = 12;
  @atomState() private keyboardOffset = 0;
  @atomState() private announcements: readonly { key: string; id: string; text: string }[] = [];
  private readonly parts = createAtom<readonly ToastPart[]>([]);
  private readonly heights = createAtom<ReadonlyMap<string, number>>(new Map());
  private readonly revision = createAtom(0);
  private readonly custom = createAtom(() => {
    this.revision.get();
    const map = new Map<string, ToastPart>();
    for (const part of this.parts.get()) {
      if (part.host.parentNode === this && part.id() && !map.has(part.id())) {
        map.set(part.id(), part);
      }
    }
    return map;
  });
  private get runtime() {
    return this.store ? toastRuntime(this.store) : undefined;
  }
  private readonly view = createAtom<ToastView>(() => {
    const runtime = this.runtime,
      entries = runtime?.entries.get() ?? [],
      active = runtime?.owner.get() === this;
    const visible = entries.filter((entry) => entry.status === "open" && !this.custom.get().get(entry.record.id)?.host.hidden).slice(0, this.limit);
    const expanded = this.expandOnInteraction && (this.hovered || this.focused || this.touching);
    const heightMap = this.heights.get(),
      front = heightMap.get(visible[0]?.record.id) ?? 64,
      sign = this.placement.startsWith("top") ? 1 : -1;
    let offset = 0;
    const geometry = new Map<string, ToastGeometry>();
    for (const [index, entry] of visible.entries()) {
      const own = heightMap.get(entry.record.id) ?? front;
      geometry.set(entry.record.id, {
        index,
        y: sign * (expanded ? offset : index * front * 0.2),
        height: expanded || index === 0 ? own : front,
        scale: expanded ? 1 : Math.max(0, 1 - index * 0.1),
        visible: active,
        behind: !expanded && index > 0,
      });
      offset += own + this.gap;
    }
    return { store: this.store, active, expanded, placement: this.placement, geometry };
  });
  private readonly owner: ToastOwner = {
    view: this.view,
    register: (part) => {
      this.parts.set((parts) => [...parts, part]);
      return () => this.parts.set((parts) => parts.filter((item) => item !== part));
    },
    measure: (id, height) => {
      if (Math.abs((this.heights.get().get(id) ?? 0) - height) < 0.1) {
        return;
      }
      this.heights.set((values) => new Map([...values, [id, height]]));
    },
  };
  private readonly provider = new ContextProvider(this, { context: toastContext, initialValue: this.owner });
  private readonly updates = new StoreSelector(this, () => this.view);
  private readonly entryUpdates = new StoreSelector(this, () => this.runtime?.entries);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.parts.get(),
    find: toastPartFor,
    boundary: (element) => element !== this && element instanceof AcmeToastViewport,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
    changed: () => this.revision.set((value) => value + 1),
  });
  private bound?: ToastRuntime;
  private release?: () => void;
  private unsubscribe?: () => void;
  private document?: Document;
  private window?: Window;
  private previousFocus?: HTMLElement;
  private readonly interactionPause = {};
  private readonly backgroundPause = {};
  private observer?: MutationObserver;
  private get surface() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=viewport]") ?? undefined;
  }
  private bind() {
    if (!this.isConnected) {
      return;
    }
    const runtime = this.runtime;
    if (runtime === this.bound) {
      return;
    }
    this.unbind();
    this.bound = runtime;
    if (!runtime) {
      return;
    }
    this.release = runtime.attachViewport(this);
    this.unsubscribe = runtime.subscribeDismiss((detail) => {
      if (runtime.owner.get() !== this) {
        return;
      }
      const part = this.parts.get().find((part) => part.id() === detail.id);
      (part?.host ?? this).dispatchEvent(new CustomEvent("acme-dismiss", { detail, bubbles: true, composed: true }));
      const active = deepActiveElement(this.ownerDocument);
      if (part && active && composedContains(part.host, active)) {
        this.recoverFocus();
      }
    });
  }
  private unbind() {
    this.bound?.resume(this.interactionPause);
    this.bound?.resume(this.backgroundPause);
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.release?.();
    this.release = undefined;
    this.bound = undefined;
    this.announcements = [];
  }
  private recoverFocus() {
    this.surface?.focus({ preventScroll: true });
    void this.updateComplete.then(async () => {
      if (!this.isConnected) {
        return;
      }
      const next = this.runtime?.entries.get().find((entry) => entry.status === "open" && this.view.get().geometry.get(entry.record.id)?.visible);
      const part = next ? this.parts.get().find((part) => part.id() === next.record.id) : undefined;
      if (part) {
        await part.host.updateComplete;
        if (deepActiveElement(this.ownerDocument) === this.surface) {
          part.target()?.focus({ preventScroll: true });
        }
      } else if (this.previousFocus?.isConnected && deepActiveElement(this.ownerDocument) === this.surface) {
        this.previousFocus.focus({ preventScroll: true });
      }
    });
  }
  private syncPauses() {
    const runtime = this.bound;
    if (!runtime) {
      return;
    }
    if (!this.view.get().active) {
      runtime.resume(this.interactionPause);
      runtime.resume(this.backgroundPause);
      return;
    }
    if (this.hovered || this.focused || this.touching) {
      runtime.pause(this.interactionPause);
    } else {
      runtime.resume(this.interactionPause);
    }
    if (this.ownerDocument.hidden || !this.ownerDocument.hasFocus()) {
      runtime.pause(this.backgroundPause);
    } else {
      runtime.resume(this.backgroundPause);
    }
  }
  private background = () => {
    this.syncPauses();
    this.requestUpdate();
  };
  private viewportChanged = () => {
    const view = this.ownerDocument.defaultView,
      vv = view?.visualViewport;
    this.keyboardOffset = vv && view ? Math.max(0, view.innerHeight - vv.height - vv.offsetTop) : 0;
  };
  private focusIn = (event: FocusEvent) => {
    const previous = event.relatedTarget;
    if (previous instanceof HTMLElement && !composedContains(this, previous)) {
      this.previousFocus = previous;
    }
    this.focused = true;
    this.syncPauses();
  };
  private focusOut = () => {
    queueMicrotask(() => {
      const active = deepActiveElement(this.ownerDocument);
      this.focused = !!active && composedContains(this, active);
      this.syncPauses();
    });
  };
  private outside = (event: PointerEvent) => {
    if (!event.composedPath().includes(this)) {
      this.touching = false;
      this.syncPauses();
    }
  };
  focus(options?: FocusOptions) {
    if (!this.view.get().active) {
      return;
    }
    const previous = deepActiveElement(this.ownerDocument);
    if (previous && previous instanceof HTMLElement && !composedContains(this, previous)) {
      this.previousFocus = previous;
    }
    this.focused = true;
    this.syncPauses();
    void this.updateComplete.then(() => {
      const first = this.runtime?.entries.get().find((entry) => entry.status === "open");
      const part = first ? this.parts.get().find((part) => part.id() === first.record.id) : undefined;
      (part?.target() ?? this.surface)?.focus(options ?? { preventScroll: true });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.document = this.ownerDocument;
    this.window = this.ownerDocument.defaultView ?? undefined;
    this.document.addEventListener("visibilitychange", this.background);
    this.document.addEventListener("pointerdown", this.outside, true);
    this.window?.addEventListener("blur", this.background);
    this.window?.addEventListener("focus", this.background);
    this.window?.visualViewport?.addEventListener("resize", this.viewportChanged);
    this.window?.visualViewport?.addEventListener("scroll", this.viewportChanged);
    this.viewportChanged();
    this.observer = new MutationObserver(() => this.revision.set((value) => value + 1));
    this.observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["toast-id", "hidden"] });
  }
  disconnectedCallback() {
    this.document?.removeEventListener("visibilitychange", this.background);
    this.document?.removeEventListener("pointerdown", this.outside, true);
    this.window?.removeEventListener("blur", this.background);
    this.window?.removeEventListener("focus", this.background);
    this.window?.visualViewport?.removeEventListener("resize", this.viewportChanged);
    this.window?.visualViewport?.removeEventListener("scroll", this.viewportChanged);
    this.document = undefined;
    this.window = undefined;
    this.observer?.disconnect();
    this.observer = undefined;
    this.unbind();
    this.hovered = false;
    this.focused = false;
    this.touching = false;
    super.disconnectedCallback();
  }
  protected get semanticTarget() {
    return this.surface;
  }
  protected get semanticDefaults() {
    return { role: "region", label: message(this.themeContext.scope.effective.get().locale, "toast.region", "Notifications") };
  }
  protected willUpdate() {
    this.bind();
    const active = deepActiveElement(this.ownerDocument);
    const focusedPart = active ? this.parts.get().find((part) => composedContains(part.host, active)) : undefined;
    if (focusedPart && !this.view.get().geometry.get(focusedPart.id())?.visible) {
      this.recoverFocus();
    }
    if (!this.runtime?.entries.get().some((entry) => entry.status === "open")) {
      this.hovered = false;
      this.focused = false;
      this.touching = false;
    }
    this.syncPauses();
  }
  protected updated() {
    const surface = this.surface;
    if (!surface || !this.isConnected) {
      return;
    }
    const view = this.view.get(),
      entries = this.runtime?.entries.get() ?? [];
    for (const slot of this.renderRoot.querySelectorAll<HTMLSlotElement>("slot[data-toast]")) {
      const part = this.custom.get().get(slot.dataset.toast!);
      const nodes = part ? [part.host] : [];
      const previous = slot.assignedNodes();
      if (nodes.length !== previous.length || nodes.some((node, index) => node !== previous[index])) {
        slot.assign(...nodes);
      }
    }
    const shouldShow = view.active && entries.length > 0;
    if (shouldShow && !surface.matches(":popover-open")) {
      surface.showPopover();
    }
    if (!shouldShow && surface.matches(":popover-open")) {
      surface.hidePopover();
    }
    if (shouldShow) {
      const measured = this.renderRoot.querySelector<HTMLElement>(".gap-measure")?.getBoundingClientRect().height ?? 0;
      if (measured > 0 && Math.abs(measured - this.gap) > 0.1) {
        this.gap = measured;
      }
    }
    const height = Math.max(0, ...[...view.geometry.values()].map((item) => Math.abs(item.y) + item.height));
    surface.style.setProperty("--_toast-viewport-height", `${height}px`);
    surface.style.setProperty("--_toast-keyboard-offset", `${this.keyboardOffset}px`);
    const current = new Set(entries.filter((entry) => entry.status === "open").map((entry) => entry.record.id));
    const retained = new Set(entries.map((entry) => entry.record.id));
    if ([...this.heights.get().keys()].some((id) => !retained.has(id))) {
      this.heights.set((heights) => new Map([...heights].filter(([id]) => retained.has(id))));
    }
    const visible = new Set([...view.geometry].filter(([, geometry]) => geometry.visible).map(([id]) => id));
    let next = this.announcements.filter((item) => current.has(item.id) && visible.has(item.id));
    for (const entry of entries) {
      if (!view.geometry.get(entry.record.id)?.visible || entry.status !== "open") {
        continue;
      }
      const record = entry.record,
        key = JSON.stringify([entry.version, record.heading, record.description, record.action, record.variant]);
      if (!this.runtime?.claimAnnouncement(record.id, key)) {
        continue;
      }
      next = next.filter((item) => item.id !== record.id);
      next.push({ key: record.id + key, id: record.id, text: [record.heading, record.description, record.action?.label].filter(Boolean).join(" ") });
    }
    next = next.slice(-this.limit);
    if (next.length !== this.announcements.length || next.some((item, index) => item !== this.announcements[index])) {
      this.announcements = Object.freeze(next);
    }
  }
  render() {
    const view = this.view.get(),
      entries = view.active ? (this.runtime?.entries.get() ?? []) : [];
    return html`<div part="root"><acme-overlay-theme density="normal" .source=${this.themeContext.scope.effective} .reference=${this}><div part="viewport" popover="manual" tabindex="-1" data-placement=${this.placement} data-expanded=${String(view.expanded)} @pointerenter=${(
      event: PointerEvent,
    ) => {
      if (event.pointerType !== "touch") {
        this.hovered = true;
        this.syncPauses();
      }
    }} @pointerleave=${(event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        this.hovered = false;
        this.syncPauses();
      }
    }} @pointerdown=${(event: PointerEvent) => {
      if (event.pointerType === "touch") {
        this.touching = true;
        this.syncPauses();
      }
    }} @focusin=${this.focusIn} @focusout=${this.focusOut}><div part="list">${repeat(
      entries,
      (entry) => entry.record.id,
      (entry) => (this.custom.get().has(entry.record.id) ? html`<slot data-toast=${entry.record.id}></slot>` : html`<acme-toast .store=${this.store} .toastId=${entry.record.id}></acme-toast>`),
    )}</div><span class="gap-measure" aria-hidden="true"></span></div></acme-overlay-theme><div part="announcer" class="sr" role="status" aria-live="polite" aria-atomic="false" aria-relevant="additions text">${repeat(
      this.announcements,
      (item) => item.key,
      (item) => html`<div>${item.text}</div>`,
    )}</div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-toast-viewport": AcmeToastViewport;
  }
}
