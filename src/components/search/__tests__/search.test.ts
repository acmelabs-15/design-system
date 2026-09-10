import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeInput } from "../../input/input";
import type { AcmeSearch } from "../search";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-search") as AcmeSearch;
  await el.updateComplete;
  await (el.shadowRoot!.querySelector("acme-input") as AcmeInput).updateComplete;
  return el;
};
const field = (el: AcmeSearch) => el.shadowRoot!.querySelector("acme-input") as AcmeInput;

describe("acme-search", () => {
  test("composes a search-typed clearable input named Search, with the glass in the start place", async () => {
    const el = await mount(`<acme-search placeholder="Enter some text..."></acme-search>`);
    const f = field(el);
    expect(f.getAttribute("type")).toBe("search");
    expect(f.getAttribute("aria-label")).toBe("Search");
    expect(f.shadowRoot!.querySelector("input")!.placeholder).toBe("Enter some text...");
    const slot = el.shadowRoot!.querySelector("slot[name=start][slot=start]") as HTMLSlotElement;
    expect(slot.querySelector("svg")).not.toBeNull();
  });
  test("cmdk shows the keys, loading swaps the glass for a spinner, disabled reaches the field", async () => {
    document.body.innerHTML = `<acme-search cmdk></acme-search><acme-search loading value="Project A"></acme-search><acme-search disabled></acme-search>`;
    const [cmdk, loading, disabled] = Array.from(document.body.querySelectorAll("acme-search")) as AcmeSearch[];
    for (const el of [cmdk, loading, disabled]) await el.updateComplete;
    expect(cmdk.shadowRoot!.querySelectorAll(".cmdk acme-kbd").length).toBe(2);
    const start = loading.shadowRoot!.querySelector("slot[name=start][slot=start]") as HTMLSlotElement;
    expect(start.querySelector("acme-spinner")).not.toBeNull();
    expect(start.querySelector("svg")).toBeNull();
    expect(field(disabled).disabled).toBe(true);
  });
  test("a value shows the Esc key and clear() empties it; clearable false drops both", async () => {
    const el = await mount(`<acme-search value="Project A"></acme-search>`);
    expect(el.shadowRoot!.querySelector("button.clear acme-kbd")!.textContent).toBe("Esc");
    el.clear();
    await el.updateComplete;
    expect(el.value).toBe("");
    const plain = await mount(`<acme-search clearable="false" value="x"></acme-search>`);
    expect(plain.shadowRoot!.querySelector(".clear")).toBeNull();
    plain.clear();
    expect(plain.value).toBe("x");
  });
});
