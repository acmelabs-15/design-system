import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
import { focusable, type FocusableElement } from "tabbable";
import { composedContains, deepActiveElement, composedParent } from "./composed-tree";
import { delegatedKeyboardOwner, keyboardCollection, registerToolbarKeyboardOwner, toolbarKeyboardOwner } from "./keyboard-delegation";
import { RovingTabindex } from "./roving-tabindex";

type Options = { root(): HTMLElement | undefined; content(): HTMLElement | undefined; disabled(): boolean; orientation(): "horizontal" | "vertical"; loop(): boolean };
type Managed = { original: string | null; written: string };
/** Coordinates tab entry without taking ownership of action or collection values. */
export class ToolbarFocus implements ReactiveController {
  private readonly focused = createAtom<{ target?: HTMLElement }>({});
  private readonly managed = new Map<HTMLElement, Managed>();
  private readonly observers = new Map<Node, MutationObserver>();
  private release?: () => void;
  private registered?: HTMLElement;
  private resize?: ResizeObserver;
  private pending = false;
  private syncing = false;
  private targets: HTMLElement[] = [];
  private readonly roving: RovingTabindex;
  constructor(
    private host: ReactiveElement,
    private options: Options,
  ) {
    host.addController(this);
    this.roving = new RovingTabindex(host, {
      items: () => this.targets,
      current: () => 0,
      orientation: options.orientation,
      rtl: () => getComputedStyle(host).direction === "rtl",
      wrap: options.loop,
      homeEnd: true,
      onMove: (target) => {
        this.focused.set({ target });
        this.synchronize();
      },
    });
  }
  private separate(target: HTMLElement): boolean {
    return toolbarKeyboardOwner(target) !== this.options.root();
  }
  private collection(target: HTMLElement): boolean {
    for (let node: Node | null = target; node && node !== this.host; node = composedParent(node)) {
      if (node.nodeType === 1) {
        const targets = keyboardCollection(node as Element)?.();
        if (targets?.includes(target)) {
          return true;
        }
      }
    }
    return false;
  }
  private authored(target: HTMLElement): number {
    const record = this.managed.get(target),
      attribute = target.getAttribute("tabindex");
    if (record && attribute !== record.written) {
      record.original = attribute;
    }
    const value = record ? record.original : attribute;
    return value === null ? 0 : Number(value);
  }
  private collect(): HTMLElement[] {
    const root = this.options.content();
    if (!root) {
      return [];
    }
    const roots = new Set<Node>([this.host, this.host.renderRoot]);
    const targets = focusable(root, {
      getShadowRoot: (node: FocusableElement) => {
        const shadow = node.shadowRoot;
        if (shadow) {
          roots.add(shadow);
        }
        return shadow ?? false;
      },
    })
      .filter((target): target is HTMLElement => target.namespaceURI === "http://www.w3.org/1999/xhtml")
      .filter((target) => {
        if (this.separate(target)) {
          return false;
        }
        if (this.collection(target)) {
          return true;
        }
        return this.authored(target) >= 0;
      });
    for (const [node, observer] of this.observers) {
      if (!roots.has(node)) {
        observer.disconnect();
        this.observers.delete(node);
      }
    }
    for (const node of roots) {
      if (!this.observers.has(node)) {
        const observer = new MutationObserver(this.schedule);
        observer.observe(node, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ["tabindex", "disabled", "hidden", "inert", "style", "class", "slot", "href", "aria-selected", "aria-checked"],
        });
        this.observers.set(node, observer);
      }
    }
    return targets;
  }
  private restore(target: HTMLElement, record: Managed) {
    if (target.getAttribute("tabindex") === record.written) {
      if (record.original === null) {
        target.removeAttribute("tabindex");
      } else {
        target.setAttribute("tabindex", record.original);
      }
    }
    this.managed.delete(target);
  }
  synchronize = () => {
    if (this.syncing || !this.host.isConnected) {
      return;
    }
    const root = this.options.root();
    if (!root) {
      return;
    }
    this.syncing = true;
    try {
      if (this.registered !== root) {
        this.release?.();
        this.release = registerToolbarKeyboardOwner(this.host, root);
        this.registered = root;
      }
      this.targets = this.options.disabled() ? [] : this.collect();
      for (const [target, record] of this.managed) {
        if (!this.targets.includes(target)) {
          this.restore(target, record);
        }
      }
      const focused = this.focused.get().target,
        entry = focused && this.targets.includes(focused) ? focused : this.targets[0];
      for (const target of this.targets) {
        let record = this.managed.get(target);
        if (!record) {
          record = { original: target.getAttribute("tabindex"), written: "" };
          this.managed.set(target, record);
        }
        const next = target === entry ? "0" : "-1";
        record.written = next;
        if (target.getAttribute("tabindex") !== next) {
          target.setAttribute("tabindex", next);
        }
      }
    } finally {
      this.syncing = false;
    }
  };
  private schedule = () => {
    if (this.pending) {
      return;
    }
    this.pending = true;
    queueMicrotask(() => {
      this.pending = false;
      this.synchronize();
    });
  };
  private focusin = (event: FocusEvent) => {
    const target = event.composedPath()[0] as HTMLElement;
    this.synchronize();
    if (this.targets.includes(target)) {
      this.focused.set({ target });
      this.synchronize();
    }
  };
  private focusout = () =>
    queueMicrotask(() => {
      const active = deepActiveElement(this.host.ownerDocument);
      if (!active || !composedContains(this.host, active)) {
        this.focused.set({});
        this.synchronize();
      }
    });
  private keydown = (event: KeyboardEvent) => {
    const root = this.options.root(),
      delegated = delegatedKeyboardOwner(event) === root;
    if (this.options.disabled() || event.altKey || event.ctrlKey || event.metaKey || event.isComposing || (event.defaultPrevented && !delegated)) {
      return;
    }
    const target = event.composedPath()[0] as HTMLElement;
    if (
      !delegated &&
      (target.isContentEditable ||
        target.localName === "textarea" ||
        target.localName === "select" ||
        (target.localName === "input" && !["button", "checkbox", "radio", "submit", "reset"].includes((target as HTMLInputElement).type)))
    ) {
      return;
    }
    this.synchronize();
    const index = this.targets.indexOf(target);
    if (index < 0) {
      return;
    }
    if (this.roving.handleKey(event, index)) {
      event.stopPropagation();
    }
  };
  focus(options?: FocusOptions) {
    this.synchronize();
    const remembered = this.focused.get().target;
    ((remembered && this.targets.includes(remembered) ? remembered : this.targets[0]) ?? this.options.root())?.focus(options);
  }
  prepare() {
    const active = deepActiveElement(this.host.ownerDocument),
      content = this.options.content();
    if (this.options.disabled() && active && content && composedContains(content, active)) {
      this.options.root()?.focus({ preventScroll: true });
    }
  }
  hostConnected() {
    this.host.addEventListener("keydown", this.keydown);
    this.host.addEventListener("focusin", this.focusin);
    this.host.addEventListener("focusout", this.focusout);
    this.host.addEventListener("slotchange", this.schedule);
    this.resize = new ResizeObserver(this.schedule);
    this.resize.observe(this.host);
  }
  hostUpdated() {
    this.synchronize();
  }
  hostDisconnected() {
    this.host.removeEventListener("keydown", this.keydown);
    this.host.removeEventListener("focusin", this.focusin);
    this.host.removeEventListener("focusout", this.focusout);
    this.host.removeEventListener("slotchange", this.schedule);
    this.release?.();
    this.release = undefined;
    this.registered = undefined;
    this.resize?.disconnect();
    this.resize = undefined;
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
    for (const [target, record] of this.managed) {
      this.restore(target, record);
    }
    this.targets = [];
    this.focused.set({});
  }
}
