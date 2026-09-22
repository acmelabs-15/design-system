import { ContextConsumer, createContext } from "@lit/context";
import { createAtom, type ReadonlyAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
export type MenuReason = "trigger" | "escape" | "outside" | "close-control" | "selection" | "programmatic";
export interface MenuEntry extends HTMLElement {
  value: string;
  type: "action" | "checkbox" | "radio";
  checked: boolean;
  disabled: boolean;
  name: string;
  readonly label: string;
  highlight(value: boolean): void;
}
export interface MenuOwner {
  readonly host: HTMLElement;
  readonly state: ReadonlyAtom<{ open: boolean }>;
  readonly contentElement: HTMLElement | undefined;
  readonly triggerElement: HTMLElement | undefined;
  register(part: HTMLElement, kind: "item" | "trigger" | "content"): () => void;
  toggle(): void;
  openFromTrigger(edge?: "first" | "last"): void;
  select(item: MenuEntry): void;
  key(event: KeyboardEvent): void;
  hover(item: MenuEntry, event: PointerEvent): void;
  focusItem(item: MenuEntry): void;
  focusLeft(): void;
}
export const menuContext = createContext<MenuOwner>(Symbol("acme-menu-owner"));
const owners = new WeakMap<HTMLElement, MenuOwner>();
export const registerMenuOwner = (element: HTMLElement, owner: MenuOwner): void => {
  owners.set(element, owner);
};
export const menuOwnerFor = (element: HTMLElement): MenuOwner | undefined => owners.get(element);
/** Registers a family part with its nearest menu, including when it is moved. */
export class MenuConnection implements ReactiveController {
  private readonly binding = createAtom<{ owner?: MenuOwner }>({});
  private cleanup?: () => void;
  private readonly consumer: ContextConsumer<typeof menuContext, ReactiveElement>;
  private readonly presentation = createAtom(() => ({ owner: this.binding.get().owner, open: this.binding.get().owner?.state.get().open }));
  private readonly updates: StoreSelector<{ owner?: MenuOwner; open?: boolean }>;
  constructor(
    private host: ReactiveElement,
    kind: "item" | "trigger" | "content",
  ) {
    this.consumer = new ContextConsumer(host, {
      context: menuContext,
      subscribe: true,
      callback: (owner) => {
        if (owner === this.owner) return;
        this.cleanup?.();
        this.binding.set({ owner });
        this.cleanup = owner.register(host, kind);
        host.requestUpdate();
      },
    });
    this.updates = new StoreSelector(host, () => this.presentation);
    host.addController(this);
  }
  get owner() {
    return this.binding.get().owner;
  }
  hostDisconnected() {
    this.cleanup?.();
    this.cleanup = undefined;
    this.binding.set({});
  }
}
