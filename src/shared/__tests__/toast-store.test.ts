import { expect, test } from "bun:test";
import { createToastStore, toastRuntime } from "../toast-store";

test("Toast stores own immutable serializable records and never share a default queue", () => {
  const a = createToastStore(),
    b = createToastStore();
  const input = { description: "Saved", action: { id: "undo", label: "Undo" } };
  const id = a.add(input);
  input.action.label = "Changed";
  expect(a.state.get()[0]).toMatchObject({ id, description: "Saved", duration: 5000, variant: "default", dismissible: true, action: { id: "undo", label: "Undo" } });
  expect(b.state.get()).toEqual([]);
  expect(Object.isFrozen(a.state.get()[0].action)).toBe(true);
  expect(() => a.add({ description: "Bad", onAction() {} } as never)).toThrow();
  a.clear();
});
test("updates preserve identity, ending records ignore updates, and re-add starts a new lifetime", () => {
  const store = createToastStore(),
    runtime = toastRuntime(store);
  const release = runtime.attachViewport({});
  store.add({ id: "save", description: "Saving", duration: 0 });
  store.update("save", { description: "Saved", variant: "success" });
  expect(store.state.get()[0].description).toBe("Saved");
  store.dismiss("save");
  const closing = runtime.entries.get()[0];
  expect(store.state.get()).toEqual([]);
  store.update("save", { description: "Late" });
  expect(runtime.entries.get()[0].record.description).toBe("Saved");
  store.add({ id: "save", description: "Again", duration: 0 });
  runtime.finish("save", closing.version);
  expect(store.state.get()[0].description).toBe("Again");
  store.clear();
  release();
  expect(runtime.entries.get()).toEqual([]);
});
test("one presentation owner changes on detach and each dismissal has one reason", () => {
  const store = createToastStore(),
    runtime = toastRuntime(store),
    first = {},
    second = {},
    events: unknown[] = [];
  const a = runtime.attachViewport(first),
    b = runtime.attachViewport(second);
  runtime.subscribeDismiss((detail) => events.push(detail));
  expect(runtime.owner.get()).toBe(first);
  a();
  expect(runtime.owner.get()).toBe(second);
  const id = store.add({ description: "Notice", duration: 0 });
  runtime.dismiss(id, "close");
  runtime.dismiss(id, "close");
  expect(events).toEqual([{ id, reason: "close" }]);
  b();
  expect(runtime.entries.get()).toEqual([]);
});
test("announcement ownership follows the store through viewport handoff", () => {
  const store = createToastStore(),
    runtime = toastRuntime(store);
  store.add({ id: "one", description: "Once", duration: 0 });
  expect(runtime.claimAnnouncement("one", "Once")).toBe(true);
  expect(runtime.claimAnnouncement("one", "Once")).toBe(false);
  expect(runtime.claimAnnouncement("one", "Changed")).toBe(true);
  store.dismiss("one");
  store.add({ id: "one", description: "Once", duration: 0 });
  expect(runtime.claimAnnouncement("one", "Once")).toBe(true);
  store.clear();
});
test("generated identities never replace an explicitly supplied identity", () => {
  const store = createToastStore();
  const first = store.add({ description: "First", duration: 0 });
  const reserved = first.replace(/-1$/, "-2");
  store.add({ id: reserved, description: "Reserved", duration: 0 });
  const generated = store.add({ description: "Generated", duration: 0 });
  expect(generated).not.toBe(reserved);
  expect(store.state.get()).toHaveLength(3);
  store.clear();
});
