import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeKbd } from "../kbd";
import { keyLabel } from "../../../shared/key-labels";
import { configureMessages } from "../../../shared/messages";

afterEach(() => document.body.replaceChildren());
const root = (element: AcmeKbd) => element.shadowRoot!.querySelector("kbd")!;
test("named keys are owned values and describe rather than register a shortcut", async () => {
  document.body.innerHTML = '<acme-kbd keys=\'["Control","Shift","K"]\'></acme-kbd>';
  const kbd = document.querySelector("acme-kbd") as AcmeKbd;
  await kbd.updateComplete;
  expect(root(kbd).getAttribute("part")).toBe("root");
  expect(root(kbd).querySelectorAll("span[aria-hidden]")).toHaveLength(3);
  expect(kbd.keys).toEqual(["Control", "Shift", "K"]);
  expect(Object.isFrozen(kbd.keys)).toBe(true);
  expect(root(kbd).querySelector(".sr")!.textContent).toContain("Shift");
  expect("small" in kbd).toBe(false);
  expect("ctrl" in kbd).toBe(false);
});
test("the default slot is used only when keys is absent", async () => {
  document.body.innerHTML = '<acme-kbd size="small">Enter</acme-kbd>';
  const kbd = document.querySelector("acme-kbd") as AcmeKbd;
  await kbd.updateComplete;
  expect(kbd.size).toBe("small");
  expect(root(kbd).querySelector("slot")).not.toBeNull();
  kbd.keys = [];
  await kbd.updateComplete;
  expect(root(kbd).querySelector("slot")).toBeNull();
  kbd.keys = undefined;
  await kbd.updateComplete;
  expect(root(kbd).querySelector("slot")).not.toBeNull();
});
test("key labels are replaceable and plus remains a key", () => {
  configureMessages("fr", { "kbd.Control": "Ctrl FR", "kbd.Control.label": "Contrôle" });
  expect(keyLabel("Control", "fr-FR", false, "windows")).toBe("Ctrl FR");
  expect(keyLabel("Control", "fr-FR", true, "windows")).toBe("Contrôle");
  expect(keyLabel("+", "en-US", false, "mac")).toBe("+");
});
test("key input rejects accessors without invoking them", () => {
  const kbd = document.createElement("acme-kbd") as AcmeKbd;
  const keys: string[] = [];
  let read = false;
  Object.defineProperty(keys, 0, {
    get() {
      read = true;
      return "K";
    },
  });
  expect(() => {
    kbd.keys = keys;
  }).toThrow();
  expect(read).toBe(false);
});
