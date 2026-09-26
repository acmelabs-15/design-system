import { expect, test } from "bun:test";
import "../../../all";

async function mount(value: unknown) {
  const el = document.createElement("acme-json-view");
  el.value = value;
  document.body.replaceChildren(el);
  await el.updateComplete;
  return el;
}
test("JSON View renders safe typed values, accessors and cycles without calling getters", async () => {
  let calls = 0;
  const value: any = { text: "<img src=x>", number: 2, missing: undefined };
  Object.defineProperty(value, "secret", {
    enumerable: true,
    get() {
      calls++;
      throw Error("must not run");
    },
  });
  value.self = value;
  const el = await mount(value);
  expect(calls).toBe(0);
  expect(el.shadowRoot!.querySelector("img")).toBeNull();
  expect(el.shadowRoot!.textContent).toContain("[Accessor]");
  expect(el.shadowRoot!.textContent).toContain("[Circular]");
  expect(el.readOnly).toBe(true);
});
test("hierarchy owns real groups and programmatic expansion remains silent", async () => {
  const el = await mount({ branch: { leaf: 1 } });
  let events = 0;
  el.addEventListener("acme-expanded-change", () => events++);
  el.collapseAll();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelectorAll("[role=treeitem]").length).toBe(1);
  el.expandAll();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector("[role=treeitem] > [role=group] [role=treeitem]")).not.toBeNull();
  expect(events).toBe(0);
});
test("user expansion reports encoded paths and replacing one branch preserves another branch choice", async () => {
  const left = { leaf: 1 },
    right = { leaf: 2 };
  const el = await mount({ left, right });
  el.expandedDepth = 1;
  await el.updateComplete;
  const leftRow = el.shadowRoot!.querySelector<HTMLElement>('[data-path="/left"] [part=toggle]')!;
  const events: any[] = [];
  el.addEventListener("acme-expanded-change", (e) => events.push((e as CustomEvent).detail));
  leftRow.click();
  await el.updateComplete;
  expect(events[0].expanded).toContain("/left");
  el.value = { left, right: { leaf: 3 } };
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('[data-path="/left"]')!.getAttribute("aria-expanded")).toBe("true");
  expect(el.shadowRoot!.querySelector('[data-path="/right"]')!.getAttribute("aria-expanded")).toBe("false");
});
test("plain highlights are literal and a caller regex keeps its state", async () => {
  const el = await mount({ "a.b": "a.b axb" });
  el.highlight = "a.b";
  await el.updateComplete;
  expect([...el.shadowRoot!.querySelectorAll("mark")].map((e) => e.textContent)).toEqual(["a.b", "a.b"]);
  const regex = /a.b/g;
  regex.lastIndex = 2;
  el.highlight = regex;
  await el.updateComplete;
  expect(regex.lastIndex).toBe(2);
  expect(el.shadowRoot!.querySelectorAll("mark").length).toBe(3);
});
