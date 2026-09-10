import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeToggle } from "../toggle";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-toggle") as AcmeToggle;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeToggle) => el.shadowRoot!.querySelector(".toggle") as HTMLElement;

describe("acme-toggle", () => {
  test("renders a label root with the hidden switch checkbox, a track and a thumb; no text means no text span", async () => {
    const el = await mount(`<acme-toggle aria-label="Enable Firewall"></acme-toggle>`);
    const r = root(el);
    expect(r.tagName).toBe("LABEL");
    expect(r.className.trim()).toBe("toggle");
    const input = r.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("checkbox");
    expect(input.getAttribute("role")).toBe("switch");
    expect(input.getAttribute("aria-label")).toBe("Enable Firewall");
    expect(r.querySelector(".track > .thumb")).not.toBeNull();
    expect(r.querySelector(".text")).toBeNull();
    expect(r.querySelector(".thumb .icon")).toBeNull();
  });
  test("size, color, direction, label casing and no-margin map to classes and color variables; text renders in its span", async () => {
    const el = await mount(`<acme-toggle size="large" color="amber" direction="switch-first" label-casing="normal" no-margin>Enable Firewall</acme-toggle>`);
    const r = root(el);
    expect(r.className.trim()).toBe("toggle lg colored switch-first normal no-margin");
    expect(r.getAttribute("style")).toContain("--unchecked-bg-color-override:var(--ds-amber-700)");
    expect(r.getAttribute("style")).toContain("--checked-bg-color-override:var(--ds-gray-100)");
    expect(r.querySelector(".text > slot")).not.toBeNull();
  });
  test("checked and disabled reach the input and the root's data attributes; a change emits acme-change", async () => {
    const el = await mount(`<acme-toggle aria-label="x" disabled checked></acme-toggle>`);
    const r = root(el);
    expect(r.hasAttribute("data-checked")).toBe(true);
    expect(r.hasAttribute("data-disabled")).toBe(true);
    const input = r.querySelector("input") as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(input.disabled).toBe(true);
    el.disabled = false;
    await el.updateComplete;
    let got: boolean | undefined;
    el.addEventListener("acme-change", (e) => {
      got = (e as CustomEvent).detail.checked;
    });
    input.checked = false;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(got).toBe(false);
    expect(r.hasAttribute("data-checked")).toBe(false);
  });
  test("icons render in the thumb through the slot of the current state", async () => {
    const el = await mount(`<acme-toggle aria-label="x"><svg slot="icon-checked"></svg><svg slot="icon-unchecked"></svg></acme-toggle>`);
    expect(root(el).querySelector(".thumb .icon[aria-hidden] slot[name=icon-unchecked]")).not.toBeNull();
    el.checked = true;
    await el.updateComplete;
    expect(root(el).querySelector(".thumb .icon slot[name=icon-checked]")).not.toBeNull();
    expect(root(el).querySelector(".text")).toBeNull();
  });
});
