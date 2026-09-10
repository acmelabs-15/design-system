import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeSeparator } from "../separator";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeSeparator;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeSeparator) => el.shadowRoot!.querySelector(".separator") as HTMLElement;

describe("acme-separator", () => {
  test("horizontal by default, with the separator role and orientation", async () => {
    const r = root(await mount(`<acme-separator></acme-separator>`));
    expect(r.className.trim()).toBe("separator");
    expect(r.getAttribute("role")).toBe("separator");
    expect(r.getAttribute("aria-orientation")).toBe("horizontal");
  });

  test("vertical maps to the class and the orientation", async () => {
    const r = root(await mount(`<acme-separator orientation="vertical"></acme-separator>`));
    expect(r.className.trim()).toBe("separator vertical");
    expect(r.getAttribute("aria-orientation")).toBe("vertical");
  });
});
