import type { ReactiveController, ReactiveElement } from "lit";
import { nativeValidation } from "./native-form-element";
import { RovingTabindex } from "./roving-tabindex";
import { delegateToolbarKey, toolbarKeyboardOwner } from "./keyboard-delegation";
import { selectionOrder, type SelectionMember } from "./selection-member";
type Peer = Readonly<{
  host: ReactiveElement;
  member: SelectionMember;
  name(): string;
  form(): HTMLFormElement | null;
  checked(): boolean;
  setChecked(value: boolean): void;
  required(): boolean;
  grouped(): boolean;
  sync(): void;
}>;
type Key = Readonly<{ root: Node; form: HTMLFormElement | null; name: string }>;
const scopes = new WeakMap<Node, Set<RadioPeers>>();
const arrows = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
/** Coordinates standalone house radios by native tree, form and name scope. */
export class RadioPeers implements ReactiveController {
  private key?: Key;
  private updating = false;
  private resize?: ResizeObserver;
  private readonly constraint: HTMLInputElement;
  private readonly navigation: RovingTabindex;
  constructor(private peer: Peer) {
    this.constraint = peer.host.ownerDocument.createElement("input");
    this.constraint.type = "radio";
    this.constraint.name = "group";
    this.navigation = new RovingTabindex(peer.host, {
      items: () => this.visible().map((item) => item.peer.member.target()),
      current: () => 0,
      orientation: "both",
      wrap: true,
      rtl: () => peer.host.ownerDocument.defaultView!.getComputedStyle(peer.host).direction === "rtl",
      onMove: (target) => target.click(),
    });
    peer.host.addController(this);
  }
  private list(key = this.key): RadioPeers[] {
    if (!key || !key.name) return [this];
    return [...(scopes.get(key.root) ?? [])]
      .filter((item) => item.peer.host.isConnected && !item.peer.grouped() && item.peer.name() === key.name && item.peer.form() === key.form)
      .sort((a, b) => selectionOrder(a.peer.member, b.peer.member));
  }
  private visible() {
    return this.list().filter((item) => {
      const input = item.peer.member.target();
      return !item.peer.member.disabled() && input.isConnected && input.getClientRects().length > 0 && input.ownerDocument.defaultView!.getComputedStyle(input).visibility === "visible";
    });
  }
  private drop() {
    if (!this.key) return;
    scopes.get(this.key.root)?.delete(this);
  }
  reconcile = () => {
    if (this.updating) return;
    this.updating = true;
    try {
      const previous = this.list();
      this.drop();
      this.key = this.peer.host.isConnected && !this.peer.grouped() ? { root: this.peer.host.getRootNode(), form: this.peer.form(), name: this.peer.name() } : undefined;
      if (this.key) {
        let entries = scopes.get(this.key.root);
        if (!entries) {
          entries = new Set();
          scopes.set(this.key.root, entries);
        }
        entries.add(this);
      }
      const current = this.key ? this.list() : [];
      if (this.key && this.peer.checked()) for (const item of current) if (item !== this && item.peer.checked()) item.peer.setChecked(false);
      for (const item of new Set([...previous, ...current])) if (item.peer.host.isConnected) item.peer.sync();
    } finally {
      this.updating = false;
    }
  };
  get required() {
    return this.list().some((item) => item.peer.required());
  }
  validation() {
    const items = this.list();
    this.constraint.required = items.some((item) => item.peer.required());
    this.constraint.checked = items.some((item) => item.peer.checked());
    return nativeValidation(this.constraint);
  }
  tabIndex(): 0 | -1 {
    const items = this.visible();
    const current = items.find((item) => item.peer.checked()) ?? items[0];
    if (current) return current === this ? 0 : -1;
    const initial = this.list().filter((item) => !item.peer.member.disabled());
    return initial.every((item) => !item.peer.member.target().isConnected) && initial[0] === this ? 0 : -1;
  }
  private keydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || this.peer.grouped() || !arrows.has(event.key)) return;
    const origin = event.composedPath()[0];
    if (origin !== this.peer.member.target() && origin !== this.peer.host) return;
    if (delegateToolbarKey(event, this.peer.host)) return;
    const items = this.visible();
    this.navigation.handleKey(event, items.indexOf(this));
    event.preventDefault();
    event.stopPropagation();
  };
  hostConnected() {
    this.peer.host.addEventListener("keydown", this.keydown);
    this.resize = new ResizeObserver(this.reconcile);
    this.resize.observe(this.peer.host);
    this.reconcile();
  }
  hostUpdated() {
    if (!this.peer.grouped() && !toolbarKeyboardOwner(this.peer.host)) this.peer.member.target().tabIndex = this.tabIndex();
  }
  hostDisconnected() {
    const previous = this.list();
    this.drop();
    this.key = undefined;
    this.resize?.disconnect();
    this.resize = undefined;
    this.peer.host.removeEventListener("keydown", this.keydown);
    for (const item of previous) if (item !== this && item.peer.host.isConnected) item.peer.sync();
  }
}
