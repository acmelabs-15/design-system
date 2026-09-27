import { describe, expect, test } from "bun:test";
import "../../../all";
import type { AcmeSeparator } from "../separator";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeSeparator;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeSeparator) => el.shadowRoot!.querySelector(".separator") as HTMLElement;

describe("acme-separator", () => {
  test("horizontal and decorative by default", async () => {
    const r = root(await mount(`<acme-separator></acme-separator>`));
    expect(r.className.trim()).toBe("separator");
    expect(r.hasAttribute("role")).toBe(false);
    expect(r.hasAttribute("aria-orientation")).toBe(false);
    expect(r.getAttribute("aria-hidden")).toBe("true");
    expect(r.getAttribute("part")).toBe("root");
  });

  test("vertical maps to the class and the orientation", async () => {
    const r = root(await mount(`<acme-separator orientation="vertical" decorative="false"></acme-separator>`));
    expect(r.className.trim()).toBe("separator vertical");
    expect(r.getAttribute("aria-orientation")).toBe("vertical");
    expect(r.getAttribute("role")).toBe("separator");
    expect(r.hasAttribute("aria-hidden")).toBe(false);
  });

  test("property changes and attribute removal restore the canonical defaults", async () => {
    const el = await mount('<acme-separator orientation="vertical" decorative="false"></acme-separator>');
    el.orientation = "horizontal";
    el.decorative = true;
    await el.updateComplete;
    expect(el.getAttribute("orientation")).toBe("horizontal");
    expect(root(el).hasAttribute("role")).toBe(false);
    el.removeAttribute("orientation");
    el.removeAttribute("decorative");
    await el.updateComplete;
    expect(el.orientation).toBe("horizontal");
    expect(el.decorative).toBe(true);
  });
});
