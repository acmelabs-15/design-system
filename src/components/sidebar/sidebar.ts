import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { boolish, sharedCss } from "../../base";
import { sidebarCss } from "../../generated/components/sidebar/sidebar.styles";
import { atomState } from "../../shared/atom-state";
import { useBreakpoints } from "../../shared/breakpoints";
import { ComposedParticipants } from "../../shared/composed-participants";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { focusAvailable, focusSection } from "../../shared/focus-recovery";
import { type ResponsiveBand, responsiveBands } from "../../shared/responsive";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { isSidebarBoundary, registerSidebarBoundary, type SidebarOwner, type SidebarPart, sidebarContext, sidebarPartFor } from "../../shared/sidebar-context";
import { StoreSelector } from "../../shared/store-connection";
import type { AcmeDrawer } from "../drawer/drawer";
/** Responsive complementary content with independent desktop and mobile state.
 * @slot - Sidebar Content.
 * @slot trigger - Explicit named Sidebar Trigger.
 * @csspart root - Sidebar wrapper.
 * @csspart content - Desktop complementary region.
 * @csspart trigger - Trigger region.
 * @csspart surface - Mobile Drawer surface.
 * @fires {CustomEvent<{expanded:boolean}>} acme-expanded-change - A user changes desktop expansion.
 * @fires {CustomEvent<{open:boolean}>} acme-open-change - A user changes mobile visibility.
 */
export class AcmeSidebar extends AcmeSemanticElement {
  static styles = [sharedCss, sidebarCss];
  @atomState() private expandedValue = true;
  /** @default true */
  @property({ noAccessor: true, converter: boolish, useDefault: true }) get expanded(): boolean {
    return this.expandedValue;
  }
  set expanded(value: boolean) {
    const previous = this.expandedValue;
    if (previous && !value && !this.mobile && this.collapsible) this.recoverContentFocus();
    this.expandedValue = Boolean(value);
    this.requestUpdate("expanded", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "mobile-open" }) mobileOpen = false;
  @atomState() private collapseAllowed = true;
  /** @default true */
  @property({ noAccessor: true, converter: boolish, useDefault: true }) get collapsible(): boolean {
    return this.collapseAllowed;
  }
  set collapsible(value: boolean) {
    const previous = this.collapseAllowed;
    if (!previous && value && !this.expanded && !this.mobile) this.recoverContentFocus();
    this.collapseAllowed = Boolean(value);
    this.requestUpdate("collapsible", previous);
  }
  @atomState() private edge: "start" | "end" = "start";
  /** @default "start" */
  @property({ noAccessor: true, useDefault: true }) get placement(): "start" | "end" {
    return this.edge;
  }
  set placement(value: "start" | "end") {
    if (value !== "start" && value !== "end") throw new TypeError("Invalid Sidebar placement");
    const previous = this.edge;
    this.edge = value;
    this.requestUpdate("placement", previous);
  }
  @atomState() private fullWidth = "16rem";
  /** @default "16rem" */
  @property({ noAccessor: true, useDefault: true }) get width(): string {
    return this.fullWidth;
  }
  set width(value: string) {
    this.validateWidth(value);
    const previous = this.fullWidth;
    this.fullWidth = value;
    this.requestUpdate("width", previous);
  }
  @atomState() private railWidth = "3rem";
  /** @default "3rem" */
  @property({ noAccessor: true, useDefault: true, attribute: "collapsed-width" }) get collapsedWidth(): string {
    return this.railWidth;
  }
  set collapsedWidth(value: string) {
    this.validateWidth(value);
    const previous = this.railWidth;
    this.railWidth = value;
    this.requestUpdate("collapsedWidth", previous);
  }
  @atomState() private threshold: ResponsiveBand = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, useDefault: true, attribute: "mobile-below" }) get mobileBelow(): ResponsiveBand {
    return this.threshold;
  }
  set mobileBelow(value: ResponsiveBand) {
    if (!responsiveBands.includes(value)) throw new TypeError("Invalid Sidebar breakpoint");
    const previous = this.threshold;
    this.threshold = value;
    this.requestUpdate("mobileBelow", previous);
  }
  @atomState() private mobileValue = false;
  /** Whether the viewport uses the mobile Drawer. */
  get mobile() {
    return this.mobileValue;
  }
  private readonly parts = createAtom<readonly SidebarPart[]>([]);
  private readonly view = createAtom(() => ({ mobile: this.mobile, expanded: this.expanded, mobileOpen: this.mobileOpen, collapsible: this.collapsible }));
  private readonly owner: SidebarOwner = {
    host: this,
    view: this.view,
    register: (part) => {
      this.parts.set((parts) => [...parts, part]);
      return () => this.parts.set((parts) => parts.filter((item) => item !== part));
    },
    toggle: (opener) => {
      if (this.mobile) {
        this.opener = opener;
        this.mobileOpen = !this.mobileOpen;
        this.dispatchEvent(new CustomEvent("acme-open-change", { detail: Object.freeze({ open: this.mobileOpen }), bubbles: true, composed: true }));
      } else if (this.collapsible) {
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent("acme-expanded-change", { detail: Object.freeze({ expanded: this.expanded }), bubbles: true, composed: true }));
      }
    },
  };
  private readonly provider = new ContextProvider(this, { context: sidebarContext, initialValue: this.owner });
  private readonly updates = new StoreSelector(this, () => this.view);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.parts.get(),
    find: sidebarPartFor,
    boundary: isSidebarBoundary,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
  });
  private media?: MediaQueryList;
  private query = "";
  private desiredMobile = false;
  private waitingForClose = false;
  private opener?: HTMLElement;
  private releaseFocus?: () => void;
  constructor() {
    super();
    registerSidebarBoundary(this);
  }
  private validateWidth(value: string) {
    if (
      typeof value !== "string" ||
      !value.trim() ||
      /^(initial|inherit|unset|revert)/i.test(value) ||
      (this.ownerDocument.defaultView?.CSS && !this.ownerDocument.defaultView.CSS.supports("width", value))
    )
      throw new TypeError("Sidebar width requires a CSS dimension");
  }
  private get drawer() {
    return this.renderRoot?.querySelector<AcmeDrawer>("acme-drawer") ?? undefined;
  }
  private recoverContentFocus() {
    const focused = deepActiveElement(this.ownerDocument);
    if (!focused || !this.parts?.get().some((part) => part.kind === "content" && composedContains(part.host, focused))) return;
    const trigger = this.parts.get().find((part) => part.kind === "trigger" && focusAvailable(part.target()));
    if (!trigger) {
      const root = this.renderRoot?.querySelector<HTMLElement>("[part=root]");
      if (root) {
        this.releaseFocus?.();
        this.releaseFocus = focusSection(root);
        void this.updateComplete.then(async () => {
          for (const part of this.parts.get()) {
            if (part.kind !== "trigger") continue;
            await part.host.updateComplete;
            if (!this.isConnected || deepActiveElement(this.ownerDocument) !== root) return;
            if (focusAvailable(part.target())) return;
          }
        });
      }
    }
  }
  private mediaChanged = () => {
    this.desiredMobile = !!this.media?.matches;
    if (this.mobile === this.desiredMobile) return;
    if (this.mobile && (this.drawer?.open || this.waitingForClose)) {
      this.waitingForClose = true;
      this.mobileOpen = false;
      return;
    }
    this.recoverContentFocus();
    this.mobileValue = this.desiredMobile;
  };
  private configureMedia() {
    if (!this.isConnected) return;
    const widths = useBreakpoints();
    const threshold = this.mobileBelow === "compact" ? 0 : widths[this.mobileBelow];
    const query = `(width < ${threshold}rem)`;
    if (this.media && this.query === query) return;
    this.media?.removeEventListener("change", this.mediaChanged);
    this.query = query;
    this.media = this.ownerDocument.defaultView!.matchMedia(query);
    this.media.addEventListener("change", this.mediaChanged);
    this.mediaChanged();
  }
  private afterClose = (event: Event) => {
    if (event.target !== this.drawer) return;
    event.stopPropagation();
    if (this.waitingForClose) {
      this.waitingForClose = false;
      this.mobileValue = this.desiredMobile;
    }
  };
  private openChanged = (event: CustomEvent<{ open: boolean }>) => {
    if (event.target !== this.drawer) return;
    event.stopPropagation();
    this.mobileOpen = event.detail.open;
    this.dispatchEvent(new CustomEvent("acme-open-change", { detail: Object.freeze({ open: this.mobileOpen }), bubbles: true, composed: true }));
  };
  connectedCallback() {
    super.connectedCallback();
    this.configureMedia();
  }
  disconnectedCallback() {
    this.media?.removeEventListener("change", this.mediaChanged);
    this.media = undefined;
    this.waitingForClose = false;
    this.releaseFocus?.();
    this.releaseFocus = undefined;
    super.disconnectedCallback();
  }
  protected get semanticTarget() {
    return this.mobile ? this.drawer : (this.renderRoot?.querySelector<HTMLElement>("aside") ?? undefined);
  }
  protected updated() {
    this.configureMedia();
    const aside = this.renderRoot.querySelector<HTMLElement>("aside")!;
    aside.style.setProperty("--_sidebar-width", this.collapsible && !this.expanded ? this.collapsedWidth : this.width);
  }
  render() {
    return html`<div part="root" aria-label=${this.ariaLabel ?? nothing}><div part="trigger"><slot name="trigger"></slot></div><aside part="content" ?hidden=${this.mobile} data-placement=${this.placement}>${this.mobile ? nothing : html`<slot></slot>`}</aside><acme-drawer .open=${this.mobile && this.mobileOpen} .size=${this.width} .placement=${this.placement} .returnFocus=${this.opener} exportparts="surface" @acme-open-change=${this.openChanged} @acme-after-close=${this.afterClose}>${this.mobile ? html`<slot></slot>` : nothing}</acme-drawer></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-sidebar": AcmeSidebar;
  }
}
