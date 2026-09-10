import { describe, expect, test } from "bun:test";
import "../../../index";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const g = document.body.querySelector("acme-radio-group") as any;
  await g.updateComplete;
  for (const r of g.radios) await r.updateComplete;
  await g.updateComplete;
  for (const r of g.radios) await r.updateComplete;
  return g;
};
const two = `<acme-radio value="one">Option 1</acme-radio><acme-radio value="two">Option 2</acme-radio>`;

describe("acme-radio-group", () => {
  test("renders the hidden group label, shares a name and checks the radio matching value", async () => {
    const g = await mount(`<acme-radio-group label="Default Radio Example" value="one">${two}</acme-radio-group>`);
    expect(g.shadowRoot.querySelector(".radio-group[role=radiogroup] .sr").textContent).toBe("Default Radio Example");
    expect(g.shadowRoot.querySelector(".radio-group").getAttribute("aria-labelledby")).toBe(g.shadowRoot.querySelector(".sr").id);
    const [a, b] = g.radios;
    expect(a.name).toBe(g.name);
    expect(b.name).toBe(g.name);
    expect(a.checked).toBe(true);
    expect(b.checked).toBe(false);
    expect(a.skipTab).toBe(false);
    expect(b.skipTab).toBe(true);
  });
  test("a radio change updates the value and dispatches acme-change from the group", async () => {
    const g = await mount(`<acme-radio-group value="one">${two}</acme-radio-group>`);
    const seen: string[] = [];
    g.addEventListener("acme-change", (e: any) => seen.push(`${e.target.localName}:${e.detail.value}`));
    g.radios[1].select();
    await g.updateComplete;
    expect(g.value).toBe("two");
    expect(seen).toEqual(["acme-radio-group:two"]);
  });
  test("arrow keys move the selection and skip disabled radios", async () => {
    const g = await mount(`<acme-radio-group value="one">${two}<acme-radio value="three" disabled>Option 3</acme-radio></acme-radio-group>`);
    const [a, b] = g.radios;
    a.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await g.updateComplete;
    expect(g.value).toBe("two");
    b.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await g.updateComplete;
    expect(g.value).toBe("one");
  });
  test("disabled and required reach every radio; aria-label names a group with no label", async () => {
    const g = await mount(`<acme-radio-group disabled required aria-label="Options">${two}</acme-radio-group>`);
    expect(g.shadowRoot.querySelector(".sr")).toBeNull();
    expect(g.shadowRoot.querySelector(".radio-group").getAttribute("aria-label")).toBe("Options");
    for (const r of g.radios) {
      expect(r.groupDisabled).toBe(true);
      expect(r.required).toBe(true);
    }
  });
});
