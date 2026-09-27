import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeCopyButton } from "../copy-button";

const clipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
afterEach(() => {
  document.body.replaceChildren();
  if (clipboard) {
    Object.defineProperty(navigator, "clipboard", clipboard);
  } else {
    delete (navigator as unknown as { clipboard?: unknown }).clipboard;
  }
});
const mount = async (markup = '<acme-copy-button value="exact text"></acme-copy-button>') => {
  document.body.innerHTML = markup;
  const button = document.body.firstElementChild as AcmeCopyButton;
  await button.updateComplete;
  return button;
};
const write = (implementation: (value: string) => Promise<void>) => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: implementation } });
test("copy waits for success, reports no copied data and owns readonly feedback", async () => {
  let complete!: () => void;
  const received: string[] = [];
  write((value) => {
    received.push(value);
    return new Promise((resolve) => {
      complete = resolve;
    });
  });
  const button = await mount();
  const events: unknown[] = [];
  button.addEventListener("acme-copy", (event) => events.push((event as CustomEvent).detail));
  const operation = button.copy();
  expect(events).toEqual([]);
  expect(button.copied).toBe(false);
  complete();
  await operation;
  expect(received).toEqual(["exact text"]);
  expect(events).toEqual([{}]);
  expect(button.copied).toBe(true);
  expect(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(button), "copied")?.set).toBeUndefined();
});
test("clipboard failures reject and emit a safe message", async () => {
  write(async () => {
    throw new Error("secret copied input");
  });
  const button = await mount();
  let detail: unknown;
  button.addEventListener("acme-error", (event) => (detail = (event as CustomEvent).detail));
  await expect(button.copy()).rejects.toThrow();
  expect(detail).toEqual({ code: "clipboard", message: "Could not copy text" });
  expect(button.copied).toBe(false);
});
test("changing the value invalidates stale completion and feedback", async () => {
  let complete!: () => void;
  write(
    () =>
      new Promise((resolve) => {
        complete = resolve;
      }),
  );
  const button = await mount();
  let events = 0;
  button.addEventListener("acme-copy", () => events++);
  const operation = button.copy();
  button.value = "new";
  complete();
  await operation;
  expect(button.copied).toBe(false);
  expect(events).toBe(0);
});
test("feedback duration and disconnect release the timer", async () => {
  write(async () => {});
  const button = await mount('<acme-copy-button value="x" copied-duration="5"></acme-copy-button>');
  await button.copy();
  expect(button.copied).toBe(true);
  await new Promise((resolve) => {
    setTimeout(resolve, 15);
  });
  expect(button.copied).toBe(false);
  await button.copy();
  button.remove();
  expect(button.copied).toBe(false);
});
test("empty forwarded start content preserves the built-in copy icon", async () => {
  const button = await mount('<acme-copy-button value="x"><slot slot="start"></slot></acme-copy-button>');
  await button.updateComplete;
  expect(button.shadowRoot!.querySelector("acme-content-copy-icon")).not.toBeNull();
  expect(button.shadowRoot!.querySelector("slot[name=start]")).not.toBeNull();
});
