import { ContextProvider } from "@lit/context";
import { createAtom, batch } from "@tanstack/lit-store";
import { flip, offset, shift, size, type Placement, type ReferenceElement } from "@floating-ui/dom";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { menuContext, registerMenuOwner, menuPartFor, menuOwnerFor, MenuConnection, type MenuPartKind, type MenuEntry, type MenuOwner, type MenuReason } from "../../shared/menu-context";
import { ComposedParticipants } from "../../shared/composed-participants";
import { OverlayPresence } from "../../shared/overlay-presence";
import { OverlayPlacement } from "../../shared/overlay-placement";
import { RovingTabindex } from "../../shared/roving-tabindex";
import { Typeahead } from "../../shared/typeahead";
import { SpringValue } from "../../shared/spring-value";
import { readMotionSpring } from "../../shared/motion-spring";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { menuStructureCss } from "../../generated/components/menu/menu-structure.styles";
import type { AcmeMenuItem } from "../menu-item/menu-item";
/** A scoped collection of actions with a native popup surface.
 * @slot trigger - Menu Trigger.
 * @slot - Menu Content.
 * @fires {CustomEvent<{open:boolean;reason:string}>} acme-open-change - A user changes visibility.
 * @fires {CustomEvent<{action:"close";reason:string}>} acme-request - Cancelable user dismissal.
 * @fires {CustomEvent<{reason:string}>} acme-after-open - The owned enter transition completes.
 * @fires {CustomEvent<{reason:string}>} acme-after-close - The owned exit transition completes.
 */
export class AcmeMenu extends AcmeElement {
  static styles = [sharedCss, menuStructureCss];
  @atomState() private visibility = false;
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
  @atomState() @property({ noAccessor: true, attribute: "close-on-select", converter: boolish }) closeOnSelect = true;
  @atomState() @property({ noAccessor: true, converter: boolish }) loop = true;
  @atomState() @property({ useDefault: true, noAccessor: true }) placement: Placement = "bottom-start";
  @atomState() @property({ useDefault: true, noAccessor: true, type: Number, attribute: "side-offset" }) sideOffset = 4;
  private readonly state = createAtom(() => ({ open: this.open }));
  private readonly owner = this.createOwner();
  private readonly provider = new ContextProvider(this, { context: menuContext, initialValue: this.owner });
  private readonly parentConnection = new MenuConnection(this, "root");
  private get parent(): AcmeMenu | undefined {
    const host = this.parentConnection.owner?.host;
    return host instanceof AcmeMenu ? host : undefined;
  }
  private readonly participants = new Set<MenuConnection>();
  private readonly scopes = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => [...this.participants],
    find: menuPartFor,
    boundary: (element) => !!menuOwnerFor(element as HTMLElement),
    slots: () => Array.from(this.renderRoot?.querySelectorAll<HTMLSlotElement>("slot") ?? []),
    descend: (part) => part.kind === "content" || part.kind === "item",
    changed: () => this.requestUpdate(),
  });
  private readonly entries = new Set<MenuEntry>();
  private triggerPart?: HTMLElement;
  private content?: HTMLElement;
  @atomState() private current?: MenuEntry;
  @atomState() private reason: MenuReason = "programmatic";
  private restoreFocus = true;
  private pendingFocus?: "first" | "last";
  private completedOpen = false;
  private reference?: ReferenceElement;
  private openingAnchor?: HTMLElement;
  private readonly presence = new OverlayPresence(this, {
    surface: () => this.content!,
    mode: () => "popover",
    closeOnEscape: () => this.open,
    closeOnOutside: () => this.open,
    dismiss: (reason, event) => {
      if (reason !== "outside") {
        this.dismiss(reason);
        return;
      }
      let owner: AcmeMenu = this;
      const path = event?.composedPath() ?? [];
      while (owner.dismiss("outside", false) && owner.parent instanceof AcmeMenu) {
        const parent = owner.parent;
        if ((parent.content && path.includes(parent.content)) || (parent.opener && path.includes(parent.opener))) {
          break;
        }
        owner = parent;
      }
    },
    after: (phase) => {
      if (phase === "closed") {
        this.positioner.stop();
        this.typeahead.clear();
        this.completedOpen = false;
        this.current = undefined;
        if (this.open) {
          this.open = false;
        }
        for (const item of this.entries) {
          item.highlight(false);
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
      placement: this.submenuTrigger ? (this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl" ? "left-start" : "right-start") : this.placement,
      strategy: "fixed",
      middleware: [
        offset(this.sideOffset),
        flip(),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply: ({ availableWidth, availableHeight, elements }) => {
            elements.floating.style.setProperty("--menu-available-width", `${Math.max(0, availableWidth)}px`);
            elements.floating.style.setProperty("--menu-available-height", `${Math.max(0, availableHeight)}px`);
          },
        }),
      ],
    }),
    apply: ({ x, y }) => {
      this.content?.style.setProperty("--menu-x", `${x}px`);
      this.content?.style.setProperty("--menu-y", `${y}px`);
    },
    error: (error) => {
      console.error("Menu placement failed", error);
      this.open = false;
    },
  });
  private readonly roving = new RovingTabindex(this, {
    items: () => this.items,
    current: () => this.items.indexOf(this.current!),
    onMove: (item) => this.focusItem(item as MenuEntry),
    orientation: "vertical",
    wrap: () => this.loop,
    homeEnd: true,
    disabled: () => false,
  });
  private readonly typeahead = new Typeahead(this, {
    items: () => this.items,
    current: () => this.current,
    text: (item) => item.label,
    move: (item) => item.focus(),
    locale: () => this.themeContext.scope.effective.get().locale,
  });
  private get submenuTrigger(): AcmeMenuItem | undefined {
    return this.slot === "submenu" && ["acme-menu-item", "acme-split-button-item"].includes(this.parentElement?.localName ?? "") ? (this.parentElement as AcmeMenuItem) : undefined;
  }
  protected get opener(): HTMLElement | undefined {
    return this.openingAnchor ?? this.submenuTrigger ?? this.triggerPart;
  }
  constructor() {
    super();
    registerMenuOwner(this, this.owner);
  }
  private createOwner(): MenuOwner {
    const host = this;
    return {
      host,
      state: this.state,
      get contentElement() {
        return host.content;
      },
      get triggerElement() {
        return host.opener;
      },
      register: (part, kind) => this.register(part, kind),
      toggle: () => this.toggle(),
      openFromTrigger: (edge) => this.openFromTrigger(edge),
      select: (item) => this.select(item),
      key: (event) => this.key(event),
      hover: (item, event) => this.hover(item, event),
      focusItem: (item) => this.focusItem(item),
      focusLeft: () => this.focusLeft(),
    };
  }
  private get items(): MenuEntry[] {
    return [...this.entries].filter((item) => item.isConnected && item.getClientRects().length > 0).sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  }
  private register(part: HTMLElement, kind: MenuPartKind) {
    const participant = menuPartFor(part);
    if (participant) {
      this.participants.add(participant);
    }
    if (kind === "item") {
      this.entries.add(part as MenuEntry);
    } else if (kind === "trigger") {
      this.triggerPart = part;
    } else if (kind === "content") {
      if (this.content && this.content !== part) {
        throw new Error("Menu accepts one Content");
      }
      this.content = part;
    }
    this.requestUpdate();
    return () => {
      if (participant) {
        this.participants.delete(participant);
      }
      if (kind === "item") {
        this.entries.delete(part as MenuEntry);
        if (this.current === part) {
          this.current = undefined;
          if (this.open) {
            queueMicrotask(() => this.items[0]?.focus());
          }
        }
      } else if (this.triggerPart === part) {
        this.triggerPart = undefined;
        this.presence.hostDisconnected();
      } else if (this.content === part) {
        this.presence.hostDisconnected();
        this.content = undefined;
      }
      this.requestUpdate();
    };
  }
  private toggle() {
    if (this.open) {
      this.dismiss("trigger");
    } else {
      this.openFromTrigger();
    }
  }
  private openFromTrigger(edge: "first" | "last" = "first") {
    this.pendingFocus = edge;
    if (this.open) {
      this.focusEdge();
      return;
    }
    this.open = true;
    this.reason = "trigger";
    this.restoreFocus = true;
    this.notify();
  }
  show() {
    this.reason = "programmatic";
    this.restoreFocus = true;
    this.pendingFocus = "first";
    this.open = true;
  }
  hide() {
    this.reason = "programmatic";
    this.restoreFocus = true;
    this.open = false;
  }
  protected showAt(reference: ReferenceElement, opener: HTMLElement) {
    this.reference = reference;
    this.openingAnchor = opener;
    this.openFromTrigger();
    if (this.open && this.content) {
      this.positioner.start(reference, this.content);
    }
  }
  private notify() {
    this.dispatchEvent(new CustomEvent("acme-open-change", { bubbles: true, composed: true, detail: { open: this.open, reason: this.reason } }));
  }
  private dismiss(reason: MenuReason, restore = true): boolean {
    if (!this.open) {
      return true;
    }
    if (!this.dispatchEvent(new CustomEvent("acme-request", { bubbles: true, composed: true, cancelable: true, detail: { action: "close", reason } }))) {
      return false;
    }
    this.restoreFocus = restore;
    this.open = false;
    this.reason = reason;
    this.notify();
    return true;
  }
  private closeChain(reason: MenuReason, restore: boolean): boolean {
    if (!this.dismiss(reason, restore)) {
      return false;
    }
    return this.parent instanceof AcmeMenu ? this.parent.closeChain(reason, restore) : true;
  }
  private select(item: MenuEntry) {
    if (!this.open || !this.entries.has(item) || item.disabled || !item.value) {
      return;
    }
    if (item.type === "action") {
      item.dispatchEvent(new CustomEvent("acme-request", { bubbles: true, composed: true, detail: { action: "select", value: item.value } }));
    } else {
      if (item.type === "radio" && !item.name) {
        return;
      }
      const checked = item.type === "checkbox" ? !item.checked : true;
      if (checked !== item.checked) {
        batch(() => {
          if (item.type === "radio") {
            for (const peer of this.entries) {
              if (peer !== item && peer.type === "radio" && peer.name === item.name) {
                peer.checked = false;
              }
            }
          }
          item.checked = checked;
        });
        item.dispatchEvent(new CustomEvent("acme-change", { bubbles: true, composed: true, detail: { value: item.value, checked } }));
      }
    }
    if (this.closeOnSelect) {
      this.closeChain("selection", true);
    }
  }
  private focusItem(item: MenuEntry) {
    if (!this.open || !this.entries.has(item)) {
      return;
    }
    if (this.current !== item) {
      this.current?.highlight(false);
      this.current = item;
      item.highlight(true);
      item.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    for (const peer of this.entries) {
      const nested = (peer as AcmeMenuItem).submenu;
      if (peer !== item && nested?.open) {
        nested.dismiss("outside", false);
      }
    }
  }
  private focusLeft(): void {
    queueMicrotask(() => {
      const active = deepActiveElement(this.ownerDocument);
      if (this.open && active && !(this.content && composedContains(this.content, active)) && !(this.opener && composedContains(this.opener, active))) {
        this.dismiss("outside", false);
      }
    });
  }
  private hover(item: MenuEntry, event: PointerEvent) {
    if (this.open && event.pointerType === "mouse" && !event.buttons && this.entries.has(item)) {
      item.focus({ preventScroll: true });
      this.focusItem(item);
    }
  }
  private key(event: KeyboardEvent) {
    if (!this.open || event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    const nearest = event.composedPath().find((node) => node instanceof Element && node.localName === "acme-menu-content");
    if (nearest && nearest !== this.content) {
      return;
    }
    if (event.key === "Tab") {
      let root: AcmeMenu = this;
      while (root.parent instanceof AcmeMenu) {
        root = root.parent;
      }
      if (this.closeChain("outside", false)) {
        root.opener?.focus();
      } else {
        event.preventDefault();
      }
      return;
    }
    const back = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (this.submenuTrigger && event.key === back) {
      event.preventDefault();
      event.stopPropagation();
      this.dismiss("escape");
      return;
    }
    if (this.roving.handleKey(event)) {
      this.typeahead.clear();
      event.stopPropagation();
      return;
    }
    if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      this.typeahead.clear();
      return;
    }
    if (this.typeahead.handleKey(event)) {
      event.stopPropagation();
    }
  }
  private focusEdge() {
    const items = this.items;
    const item = this.pendingFocus === "last" ? items.at(-1) : items[0];
    this.pendingFocus = undefined;
    if (item) {
      item.focus({ preventScroll: true });
      this.focusItem(item);
    } else {
      this.content?.focus();
    }
  }
  protected willUpdate(changes: Map<string, unknown>) {
    if (changes.has("open")) {
      this.completedOpen = false;
    }
    this.motion.update();
  }
  protected updated(changes: Map<string, unknown>) {
    const content = this.content,
      opener = this.opener;
    if (changes.has("open")) {
      this.submenuTrigger?.requestUpdate();
    }
    if (!content) {
      return;
    }
    const active = deepActiveElement(this.ownerDocument);
    if (!this.open && !content.inert && active && composedContains(content, active) && this.restoreFocus) {
      opener?.focus();
      this.restoreFocus = false;
    }
    content.inert = !this.open;
    content.style.setProperty("--menu-opacity", String(Math.max(0, Math.min(1, this.motion.value))));
    if (this.open && opener) {
      if (this.presence.phase.get() === "closed") {
        this.completedOpen = false;
        this.presence.show(opener);
        this.positioner.start(this.reference ?? opener, content);
        queueMicrotask(() => {
          if (this.open && this.isConnected) {
            this.focusEdge();
          }
        });
      } else if (changes.has("placement") || changes.has("sideOffset")) {
        this.positioner.refresh();
      }
      if (this.motion.settled && !this.completedOpen) {
        this.completedOpen = true;
        this.dispatchEvent(new CustomEvent("acme-after-open", { bubbles: true, composed: true, detail: { reason: this.reason } }));
      }
    } else if (!this.open && this.motion.settled && this.presence.phase.get() !== "closed") {
      const focused = deepActiveElement(this.ownerDocument);
      const retainFocus = focused && focused !== this.ownerDocument.body && focused !== this.ownerDocument.documentElement && !composedContains(content, focused);
      void this.presence.hide([], this.restoreFocus && !retainFocus);
    }
  }
  disconnectedCallback() {
    this.open = false;
    this.pendingFocus = undefined;
    this.openingAnchor = undefined;
    this.reference = undefined;
    super.disconnectedCallback();
  }
  render() {
    return html`<slot name="trigger"></slot><slot></slot>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-menu": AcmeMenu;
  }
}
