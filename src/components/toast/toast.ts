import { html, nothing, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { toastSurfaceCss } from "../../generated/components/toast/toast-surface.styles";
import { atomState } from "../../shared/atom-state";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { message, messageCatalogs } from "../../shared/messages";
import { readMotionSpring } from "../../shared/motion-spring";
import { hasOwnedOverlay } from "../../shared/overlay-coordination";
import { Places } from "../../shared/places";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { SpringValue } from "../../shared/spring-value";
import { StoreSelector } from "../../shared/store-connection";
import { ToastBinding, type ToastGeometry } from "../../shared/toast-context";
import { type ToastDismissReason, type ToastRuntime, type ToastStore, toastRuntime } from "../../shared/toast-store";

export type { ToastDismissReason, ToastInput, ToastPatch, ToastRecord, ToastStore, ToastVariant } from "../../shared/toast-store";
export { createToastStore } from "../../shared/toast-store";
/** One notification bound to its store record.
 * @slot - Framework-owned content instead of generated description text.
 * @csspart root - Named nonmodal notification surface.
 * @csspart content - Message presentation.
 * @csspart action - Application action button.
 * @fires {CustomEvent<{action:"toast-action",id:string,actionId:string}>} acme-request - Application-owned action.
 * @fires {CustomEvent<{id:string,reason:ToastDismissReason}>} acme-dismiss - Record dismissal, emitted once by its presentation.
 */
export class AcmeToast extends AcmeSemanticElement {
  static styles = [sharedCss, toastSurfaceCss];
  @atomState() @property({ noAccessor: true, useDefault: true, attribute: "toast-id" }) toastId = "";
  @atomState() private supplied?: ToastStore;
  @property({ noAccessor: true, attribute: false }) get store(): ToastStore | undefined {
    return this.supplied;
  }
  set store(value: ToastStore | undefined) {
    if (value !== undefined) toastRuntime(value);
    const previous = this.supplied;
    this.supplied = value;
    this.requestUpdate("store", previous);
  }
  private readonly binding = new ToastBinding(
    this,
    () => this.toastId,
    () => this.surface,
  );
  private get effectiveStore() {
    return this.store ?? this.binding.current?.view.get().store;
  }
  private get runtime() {
    return this.effectiveStore ? toastRuntime(this.effectiveStore) : undefined;
  }
  private get entry() {
    return this.runtime?.entries.get().find((entry) => entry.record.id === this.toastId);
  }
  get status() {
    return this.entry?.status;
  }
  get position() {
    return this.geometry.index;
  }
  get expanded() {
    return this.binding.current?.view.get().expanded ?? true;
  }
  private get geometry(): ToastGeometry {
    if (this.status === "closing") return this.exitGeometry;
    return this.binding.current?.view.get().geometry.get(this.toastId) ?? { index: 0, y: 0, height: this.naturalHeight, scale: 1, visible: !this.binding.current, behind: false };
  }
  private get visible() {
    return !!this.entry && this.geometry.visible && (this.binding.current?.view.get().active ?? true);
  }
  private readonly entriesSource = new StoreSelector(this, () => this.runtime?.entries);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly places = new Places(this, { places: [""] });
  @atomState() private ready = false;
  @atomState() private naturalHeight = 0;
  @atomState() private dragX = 0;
  @atomState() private dragging = false;
  @atomState() private swiped = 0;
  private lastGeometry: ToastGeometry = { index: 0, y: 0, height: 0, scale: 1, visible: false, behind: false };
  private exitGeometry = this.lastGeometry;
  private lastStatus?: string;
  private version = 0;
  private boundStore?: ToastStore;
  private releasePresentation?: () => void;
  private releaseDismiss?: () => void;
  private observed?: HTMLElement;
  private resize?: ResizeObserver;
  private previousFocus?: Element | null;
  private readonly opacity = new SpringValue(
    this,
    () => (this.visible && this.status === "open" && this.ready ? 1 : 0),
    () => readMotionSpring(this, "standard", "effects", "fast"),
  );
  private readonly vertical = new SpringValue(
    this,
    () => (this.status === "closing" ? this.exitGeometry.y : this.geometry.y),
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private readonly scale = new SpringValue(
    this,
    () => (this.status === "closing" ? this.exitGeometry.scale * 0.96 : this.geometry.scale),
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private readonly horizontal = new SpringValue(
    this,
    () => this.swiped || this.dragX,
    () => readMotionSpring(this, "standard", "spatial", "fast"),
  );
  private pointer?: { id: number; startX: number; startY: number; direction: number; peak: number; cancelled: boolean; firstTouch: boolean };
  private suppressClick = false;
  private suppressionTimer?: ReturnType<typeof setTimeout>;
  constructor() {
    super();
    this.addEventListener(
      "click",
      (event) => {
        if (this.suppressClick) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      { capture: true },
    );
  }
  private get surface() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=root]") ?? undefined;
  }
  private bind() {
    if (!this.isConnected) return;
    const store = this.effectiveStore;
    if (store === this.boundStore) return;
    this.releasePresentation?.();
    this.releaseDismiss?.();
    this.boundStore = store;
    this.releasePresentation = store ? toastRuntime(store).attachToast(this) : undefined;
    this.releaseDismiss = store
      ? toastRuntime(store).subscribeDismiss((detail) => {
          if (detail.id === this.toastId && !this.binding.current) this.dispatchEvent(new CustomEvent("acme-dismiss", { detail, bubbles: true, composed: true }));
        })
      : undefined;
  }
  private dismiss(reason: ToastDismissReason) {
    if (this.entry?.record.dismissible) this.runtime?.dismiss(this.toastId, reason);
  }
  private action = () => {
    const record = this.entry?.record;
    if (record?.action && this.status === "open")
      this.dispatchEvent(
        new CustomEvent("acme-request", { detail: Object.freeze({ action: "toast-action", id: record.id, actionId: record.action.id }), bubbles: true, composed: true, cancelable: true }),
      );
  };
  private closeRequest = (event: CustomEvent) => {
    if (event.detail?.action !== "dismiss") return;
    event.stopPropagation();
    this.dismiss("close");
  };
  protected get semanticDefaults() {
    return { role: "dialog", label: this.entry?.record.heading || message(this.themeContext.scope.effective.get().locale, "toast.notification", "Notification") };
  }
  protected willUpdate(_changes: PropertyValues) {
    this.bind();
    const entry = this.entry;
    if (entry && entry.version !== this.version) {
      this.version = entry.version;
      this.ready = false;
      this.swiped = 0;
      this.dragX = 0;
      this.lastStatus = undefined;
    }
    if (this.status === "closing" && this.lastStatus !== "closing") this.exitGeometry = { ...this.lastGeometry, y: this.vertical.value, scale: this.scale.value };
    if (this.status === "open") this.lastGeometry = this.geometry;
    this.lastStatus = this.status;
    this.previousFocus = deepActiveElement(this.ownerDocument);
    if (this.previousFocus && !composedContains(this, this.previousFocus)) this.previousFocus = undefined;
    this.opacity.update();
    this.vertical.update();
    this.scale.update();
    if (this.dragging) this.horizontal.jump();
    else this.horizontal.update();
  }
  private measure = () => {
    const content = this.renderRoot?.querySelector<HTMLElement>("[part=content]");
    if (!content || !this.visible || this.status !== "open") return;
    const height = content.offsetHeight;
    if (height > 0) {
      if (Math.abs(height - this.naturalHeight) > 0.1) {
        this.naturalHeight = height;
        this.binding.current?.measure(this.toastId, height);
      }
      if (!this.ready) this.ready = true;
    }
  };
  protected updated() {
    const surface = this.surface;
    this.toggleAttribute("data-toast-hidden", !this.visible);
    this.setAttribute("data-toast-placement", this.binding.current?.view.get().placement ?? "bottom-end");
    if (!surface) return;
    surface.inert = !this.visible || this.status === "closing";
    surface.style.setProperty("--_toast-opacity", String(Math.max(0, Math.min(1, this.opacity.value))));
    surface.style.setProperty("--_toast-y", `${this.vertical.value}px`);
    surface.style.setProperty("--_toast-x", `${this.horizontal.value}px`);
    surface.style.setProperty("--_toast-scale", String(this.scale.value));
    surface.style.setProperty("--_toast-height", `${Math.max(0, this.status === "closing" ? this.exitGeometry.height : this.geometry.height || this.naturalHeight)}px`);
    this.style.zIndex = String(1000 - this.position);
    const content = this.renderRoot.querySelector<HTMLElement>("[part=content]");
    if (content && content !== this.observed) {
      this.resize?.disconnect();
      this.observed = content;
      this.resize = new ResizeObserver(this.measure);
      this.resize.observe(content);
    }
    this.measure();
    if (this.previousFocus && !this.previousFocus.isConnected && deepActiveElement(this.ownerDocument) === this.ownerDocument.body && this.visible && this.status === "open")
      surface.focus({ preventScroll: true });
    this.previousFocus = undefined;
    if (this.status === "closing" && (!this.visible || (this.opacity.settled && this.horizontal.settled))) {
      const entry = this.entry;
      if (entry) this.runtime?.finish(this.toastId, entry.version);
    }
  }
  focus(options?: FocusOptions) {
    this.surface?.focus(options);
  }
  private down = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary || !this.entry?.record.dismissible || !this.visible || this.status !== "open") return;
    const interactive = event
      .composedPath()
      .some((node) => node !== this.surface && (node as Node).nodeType === 1 && (node as Element).matches("button,a[href],input,textarea,select,[contenteditable],[data-acme-swipe-ignore]"));
    if (interactive) return;
    const placement = this.binding.current?.view.get().placement ?? "bottom-end",
      rtl = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl";
    const end = placement.endsWith("end");
    this.pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY, direction: end !== rtl ? 1 : -1, peak: 0, cancelled: false, firstTouch: event.pointerType === "touch" };
    this.surface?.setPointerCapture(event.pointerId);
  };
  private move = (event: PointerEvent) => {
    const pointer = this.pointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    if (pointer.firstTouch) {
      pointer.startX = event.clientX;
      pointer.startY = event.clientY;
      pointer.firstTouch = false;
      return;
    }
    const x = event.clientX - pointer.startX,
      y = event.clientY - pointer.startY;
    if (!this.dragging && Math.abs(y) > Math.abs(x)) {
      this.end(event, true);
      return;
    }
    if (Math.abs(x) < 1 && !this.dragging) return;
    event.preventDefault();
    this.dragging = true;
    const distance = x * pointer.direction;
    pointer.peak = Math.max(pointer.peak, distance);
    if (distance > 40) pointer.cancelled = false;
    else if (pointer.peak - distance >= 10) pointer.cancelled = true;
    this.dragX = distance >= 0 ? x : Math.sign(x) * Math.sqrt(Math.abs(x));
  };
  private end = (event: PointerEvent, cancel = false) => {
    const pointer = this.pointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    this.pointer = undefined;
    if (this.surface?.hasPointerCapture(pointer.id)) this.surface.releasePointerCapture(pointer.id);
    if (this.dragging) {
      this.suppressClick = true;
      clearTimeout(this.suppressionTimer);
      this.suppressionTimer = setTimeout(() => {
        this.suppressClick = false;
      }, 0);
    }
    const dismiss = !cancel && event.type !== "pointercancel" && !pointer.cancelled && this.dragX * pointer.direction > 40;
    this.dragging = false;
    if (dismiss) {
      this.swiped = pointer.direction * (this.surface?.getBoundingClientRect().width ?? 420) * 1.2;
      this.dismiss("swipe");
    } else this.dragX = 0;
  };
  disconnectedCallback() {
    this.resize?.disconnect();
    this.resize = undefined;
    this.observed = undefined;
    this.releasePresentation?.();
    this.releasePresentation = undefined;
    this.releaseDismiss?.();
    this.releaseDismiss = undefined;
    this.boundStore = undefined;
    this.pointer = undefined;
    clearTimeout(this.suppressionTimer);
    super.disconnectedCallback();
  }
  render() {
    const entry = this.entry,
      record = entry?.record;
    if (!record) return html``;
    return html`<div part="root" tabindex="0" aria-modal="false" aria-description=${record.description} data-placement=${this.binding.current?.view.get().placement ?? "bottom-end"} @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${(event: PointerEvent) => this.end(event)} @pointercancel=${(event: PointerEvent) => this.end(event, true)} @keydown=${(
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape" && !event.defaultPrevented && record.dismissible && !hasOwnedOverlay(this)) {
        event.preventDefault();
        event.stopPropagation();
        this.dismiss("escape");
      }
    }}><div part="content" ?inert=${this.geometry.behind} aria-hidden=${String(this.geometry.behind)}><acme-alert .heading=${record.heading ?? ""} .variant=${record.variant} .dismissible=${record.dismissible} @acme-request=${this.closeRequest}><slot>${record.description}</slot>${record.action ? html`<acme-button part="action" slot="actions" size="small" variant="secondary" @click=${this.action}>${record.action.label}</acme-button>` : nothing}</acme-alert></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-toast": AcmeToast;
  }
}
