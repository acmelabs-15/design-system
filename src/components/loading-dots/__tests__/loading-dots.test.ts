import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeLoadingDots } from "../loading-dots";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeLoadingDots;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeLoadingDots) => el.shadowRoot!.querySelector(".dots") as HTMLElement;

describe("acme-loading-dots", () => {
  test("renders three dots on a labelled root, no text wrapper without content", async () => {
    const r = root(await mount(`<acme-loading-dots></acme-loading-dots>`));
    expect(r.className.trim()).toBe("dots");
    expect(r.getAttribute("aria-label")).toBe("Loading");
    expect(r.querySelectorAll(".dot").length).toBe(3);
    expect(r.querySelector(".text")).toBeNull();
    expect(r.querySelector("slot")).not.toBeNull();
  });

  test("sm and lg map to classes; a number sets the dot size inline", async () => {
    expect(root(await mount(`<acme-loading-dots size="sm"></acme-loading-dots>`)).className.trim()).toBe("dots sm");
    expect(root(await mount(`<acme-loading-dots size="lg"></acme-loading-dots>`)).className.trim()).toBe("dots lg");
    const r = root(await mount(`<acme-loading-dots size="6"></acme-loading-dots>`));
    expect(r.className.trim()).toBe("dots");
    expect(r.querySelector(".dot")?.getAttribute("style")).toBe("width:6px;height:6px");
  });

  test("content goes into the text wrapper before the dots", async () => {
    const el = await mount(`<acme-loading-dots><p>Loading</p></acme-loading-dots>`);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const r = root(el);
    const text = r.querySelector(".text") as HTMLElement;
    expect(text).not.toBeNull();
    expect(text.querySelector("slot")).not.toBeNull();
    expect(text.nextElementSibling?.className).toBe("dot");
  });
});
