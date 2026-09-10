import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeLabel } from "../label";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeLabel;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeLabel) => el.shadowRoot!.querySelector(".label") as HTMLLabelElement;

describe("acme-label", () => {
  test("renders a label with the text block and for", async () => {
    const r = root(await mount(`<acme-label for="email" value="Email Address"></acme-label>`));
    expect(r.tagName).toBe("LABEL");
    expect(r.className.trim()).toBe("label");
    expect(r.getAttribute("for")).toBe("email");
    expect(r.querySelector(".text")?.textContent).toBe("Email Address");
  });

  test("bypass-casing and with-input map to classes", async () => {
    const r = root(await mount(`<acme-label bypass-casing with-input value="Email address"></acme-label>`));
    expect(r.className.trim()).toBe("label plain with-input");
    expect(r.hasAttribute("for")).toBe(false);
  });

  test("a click focuses the control the label names", async () => {
    document.body.innerHTML = `<div><acme-label for="t" value="Name"></acme-label><input id="t"></div>`;
    const el = document.body.querySelector("acme-label") as AcmeLabel;
    await el.updateComplete;
    root(el).click();
    expect(document.activeElement?.id).toBe("t");
  });
});
