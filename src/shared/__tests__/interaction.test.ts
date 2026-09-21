import { afterEach, expect, test } from "bun:test";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { Interaction } from "../interaction";

const resources: Interaction[] = [];
afterEach(() => {
  for (const interaction of resources.splice(0)) interaction.detach();
  document.body.replaceChildren();
});
function fixture(options: ConstructorParameters<typeof Interaction>[1] = {}) {
  const controllers: ReactiveController[] = [];
  const host = { addController: (controller: ReactiveController) => controllers.push(controller), requestUpdate() {} } as unknown as ReactiveControllerHost;
  const element = document.createElement("button");
  document.body.append(element);
  const interaction = new Interaction(host, options);
  resources.push(interaction);
  for (const controller of controllers) controller.hostConnected?.();
  interaction.attach(element);
  return { element, interaction, controllers };
}
const pointer = (type: string, id = 1, pointerType = "mouse") => new PointerEvent(type, { pointerId: id, pointerType, button: 0, isPrimary: true, bubbles: true });

test("secondary contacts and non-primary buttons do not start a visual press", () => {
  const { element } = fixture();
  element.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 2, pointerType: "touch", button: 0, isPrimary: false }));
  expect(element.hasAttribute("data-active")).toBe(false);
  element.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse", button: 2, isPrimary: true }));
  expect(element.hasAttribute("data-active")).toBe(false);
});

test("disconnect removes temporary window release listeners and clears visual state", () => {
  const added = new Map<string, Set<EventListenerOrEventListenerObject>>();
  const count = () => [...added.values()].reduce((sum, listeners) => sum + listeners.size, 0);
  const add = window.addEventListener.bind(window),
    remove = window.removeEventListener.bind(window);
  window.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: unknown) => {
    if (["pointerup", "pointercancel", "blur"].includes(type)) (added.get(type) ?? (added.set(type, new Set()), added.get(type)!)).add(listener);
    add(type, listener, options as AddEventListenerOptions);
  }) as typeof window.addEventListener;
  window.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: unknown) => {
    added.get(type)?.delete(listener);
    remove(type, listener, options as EventListenerOptions);
  }) as typeof window.removeEventListener;
  try {
    const { element, interaction } = fixture();
    element.dispatchEvent(pointer("pointerdown"));
    expect(element.hasAttribute("data-active")).toBe(true);
    expect(count()).toBeGreaterThan(0);
    interaction.hostDisconnected();
    expect(count()).toBe(0);
    expect(element.hasAttribute("data-active")).toBe(false);
  } finally {
    window.addEventListener = add;
    window.removeEventListener = remove;
  }
});

test("an unrelated pointer cannot end the active pointer's visual press", () => {
  const { element } = fixture();
  element.dispatchEvent(pointer("pointerdown", 7));
  window.dispatchEvent(pointer("pointerup", 8));
  expect(element.hasAttribute("data-active")).toBe(true);
  window.dispatchEvent(pointer("pointercancel", 7));
  expect(element.hasAttribute("data-active")).toBe(false);
});

test("reconnect restores the retained target without requiring another attach call", () => {
  const { element, interaction, controllers } = fixture();
  interaction.hostDisconnected();
  for (const controller of controllers) controller.hostConnected?.();
  element.dispatchEvent(pointer("pointerenter"));
  expect(element.hasAttribute("data-hover")).toBe(true);
  element.dispatchEvent(pointer("pointerdown"));
  expect(element.hasAttribute("data-active")).toBe(true);
  window.dispatchEvent(pointer("pointerup"));
  expect(element.hasAttribute("data-active")).toBe(false);
});

test("touch does not hover, and disabling cancels current visual interaction", () => {
  let disabled = false;
  const { element, controllers } = fixture({ disabled: () => disabled });
  element.dispatchEvent(pointer("pointerenter", 1, "touch"));
  expect(element.hasAttribute("data-hover")).toBe(false);
  element.dispatchEvent(pointer("pointerenter"));
  element.dispatchEvent(pointer("pointerdown"));
  disabled = true;
  for (const controller of controllers) controller.hostUpdated?.();
  expect(element.hasAttribute("data-hover")).toBe(false);
  expect(element.hasAttribute("data-active")).toBe(false);
});

test("keyboard release must match the held activation key and window blur cancels it", () => {
  const { element } = fixture();
  element.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
  element.dispatchEvent(new KeyboardEvent("keyup", { key: "x" }));
  expect(element.hasAttribute("data-active")).toBe(true);
  window.dispatchEvent(new Event("blur"));
  expect(element.hasAttribute("data-active")).toBe(false);
});
