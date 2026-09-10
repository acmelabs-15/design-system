import { describe, expect, test } from "bun:test";
import "../../../index";
import { type AcmeJsonView, makeJsonViewHighlightPattern } from "../json-view";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeJsonView;
  await el.updateComplete;
  return el;
};
const $ = (el: AcmeJsonView, sel: string) => el.shadowRoot!.querySelector(sel) as HTMLElement;
const $$ = (el: AcmeJsonView, sel: string) => Array.from(el.shadowRoot!.querySelectorAll(sel)) as HTMLElement[];
const key = (el: HTMLElement, k: string) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
const data = `{"deployment":{"id":"dpl_1","state":"ready"},"request":{"method":"GET","status":200},"cached":false,"error":null}`;

describe("acme-json-view", () => {
  test("renders the tree: an inline root item over a block group of rows, labels, levels and a roving tab index", async () => {
    const el = await mount(`<acme-json-view default-expand-depth="1" data='${data}'></acme-json-view>`);
    expect($(el, ".json .tree").getAttribute("role")).toBe("tree");
    expect($(el, ".tree").getAttribute("aria-label")).toBe("JSON");
    const top = $(el, ".top");
    expect(top.getAttribute("role")).toBe("treeitem");
    expect(top.getAttribute("aria-label")).toBe("JSON object");
    expect(top.getAttribute("aria-level")).toBe("1");
    expect(top.getAttribute("aria-expanded")).toBe("true");
    expect(top.tabIndex).toBe(0);
    const rows = $$(el, ".top > .group > .item");
    expect(rows.map((r) => r.getAttribute("aria-label"))).toEqual(["deployment: object", "request: object", "cached: false", "error: null"]);
    expect(rows.map((r) => r.getAttribute("aria-posinset"))).toEqual(["1", "2", "3", "4"]);
    expect(rows.every((r) => r.getAttribute("aria-setsize") === "4" && r.tabIndex === -1)).toBe(true);
    expect($(el, ".top > .close").textContent).toBe("}");
  });

  test("depth 1 keeps nested objects collapsed: the toggle shows the ellipsis and the closing bracket with its comma", async () => {
    const el = await mount(`<acme-json-view default-expand-depth="1" data='${data}'></acme-json-view>`);
    const first = $(el, ".item");
    expect(first.getAttribute("aria-expanded")).toBe("false");
    const toggle = first.querySelector(".line > .toggle") as HTMLElement;
    expect(toggle.hasAttribute("data-toggle")).toBe(true);
    expect(toggle.querySelector(".chev svg")).not.toBeNull();
    expect(toggle.querySelector(".key")?.textContent).toBe("deployment: ");
    expect(toggle.querySelector(".dots")?.textContent).toBe("…");
    expect(toggle.textContent).toBe("deployment: {…},");
    expect(first.querySelector(".group")).toBeNull();
  });

  test("the default depth is 3: nested rows render open, with the block closing bracket after the group", async () => {
    const el = await mount(`<acme-json-view data='${data}'></acme-json-view>`);
    const first = $(el, ".item");
    expect(first.getAttribute("aria-expanded")).toBe("true");
    expect(first.querySelector(".line > .toggle")?.textContent).toBe("deployment: {");
    expect(first.querySelectorAll(":scope > .group > .item").length).toBe(2);
    expect(first.querySelector(":scope > .close.block")?.textContent).toBe("},");
  });

  test("value kinds: string, number, boolean and null rows; arrays index their rows", async () => {
    const el = await mount(`<acme-json-view data='{"s":"x","n":1,"b":true,"z":null,"a":["p"]}'></acme-json-view>`);
    const rows = $$(el, ".top > .group > .item > .row");
    expect(rows[0].textContent).toBe('s: "x",');
    expect(Array.from(rows[0].children).map((c) => c.className)).toEqual(["key", "str"]);
    expect(rows[1].querySelector(".num")?.textContent).toBe("1");
    expect(rows[2].querySelector(".bool")?.textContent).toBe("true");
    expect(rows[3].querySelector(".nil")?.textContent).toBe("null");
    const arr = $$(el, ".top > .group > .item")[4];
    expect(arr.getAttribute("aria-label")).toBe("a: array");
    expect(arr.querySelector(".toggle")?.textContent).toBe("a: [");
    expect(arr.querySelector(".group .item")?.getAttribute("aria-label")).toBe("0: p");
    expect(arr.querySelector(".group .key")?.textContent).toBe("0: ");
    expect(arr.querySelector(":scope > .close.block")?.textContent).toBe("]");
  });

  test("an empty object has a bare bracket span, no chevron, no toggle and no aria-expanded", async () => {
    const el = await mount(`<acme-json-view data='{"meta":{},"tail":1}'></acme-json-view>`);
    const item = $(el, ".item");
    expect(item.hasAttribute("aria-expanded")).toBe(false);
    const brace = item.querySelector(".line > .brace") as HTMLElement;
    expect(brace.hasAttribute("data-toggle")).toBe(false);
    expect(brace.querySelector(".chev")).toBeNull();
    expect(brace.textContent).toBe("meta: {");
    expect(item.querySelector(":scope > .group")?.children.length).toBe(0);
    expect(item.querySelector(":scope > .close.block")?.textContent).toBe("},");
  });

  test("one short pair stays on one line in an inline group; a long pair stacks (block line wrapper below the root)", async () => {
    const one = await mount(`<acme-json-view data='{"foo":"bar"}'></acme-json-view>`);
    const line = $(one, ".top > .line");
    expect(line.getAttribute("data-inline")).toBe("true");
    expect(line.classList.contains("block")).toBe(false);
    expect(line.querySelector(".flat > .pair > .cell > .key")?.textContent).toBe("foo: ");
    expect(one.shadowRoot!.textContent).toBe('{ foo: "bar" }');
    const long = await mount(`<acme-json-view data='{"url":{"href":"${"x".repeat(60)}"}}'></acme-json-view>`);
    const stacked = $(long, ".item > .line");
    expect(stacked.classList.contains("block")).toBe(true);
    expect(stacked.hasAttribute("data-inline")).toBe(false);
    expect(stacked.querySelector(":scope > .group > .item > .row")).not.toBeNull();
    expect(stacked.querySelector(":scope > .close.block")?.textContent).toBe("}");
    const topLong = await mount(`<acme-json-view data='{"url":"${"x".repeat(60)}"}'></acme-json-view>`);
    expect($(topLong, ".top > .line").classList.contains("block")).toBe(false);
    expect($(topLong, ".top > .line > .close").classList.contains("block")).toBe(false);
  });

  test("a click, Enter, Space, ArrowRight and ArrowLeft toggle a node", async () => {
    const el = await mount(`<acme-json-view default-expand-depth="0" data='${data}'></acme-json-view>`);
    const top = () => $(el, ".top");
    expect(top().getAttribute("aria-expanded")).toBe("false");
    expect(top().querySelector(".toggle")?.textContent).toBe("{…}");
    key(top(), "Enter");
    await el.updateComplete;
    expect(top().getAttribute("aria-expanded")).toBe("true");
    expect(top().querySelector(".toggle")?.textContent).toBe("{");
    key(top(), " ");
    await el.updateComplete;
    expect(top().getAttribute("aria-expanded")).toBe("false");
    key(top(), "ArrowRight");
    await el.updateComplete;
    expect(top().getAttribute("aria-expanded")).toBe("true");
    key(top(), "ArrowLeft");
    await el.updateComplete;
    expect(top().getAttribute("aria-expanded")).toBe("false");
    (top().querySelector(".toggle") as HTMLElement).click();
    await el.updateComplete;
    expect(top().getAttribute("aria-expanded")).toBe("true");
  });

  test("arrows, Home, End and a typed character move the roving tab index through the visible nodes", async () => {
    const el = await mount(`<acme-json-view default-expand-depth="1" data='${data}'></acme-json-view>`);
    const items = () => $$(el, '[role="treeitem"]');
    key(items()[0], "ArrowDown");
    expect(items().map((x) => x.tabIndex)).toEqual([-1, 0, -1, -1, -1]);
    key(items()[1], "End");
    expect(items()[4].tabIndex).toBe(0);
    key(items()[4], "ArrowUp");
    expect(items()[3].tabIndex).toBe(0);
    key(items()[3], "Home");
    expect(items()[0].tabIndex).toBe(0);
    key(items()[0], "r");
    expect(items()[2].tabIndex).toBe(0);
    expect(items()[2].getAttribute("aria-label")).toBe("request: object");
    key(items()[2], "ArrowLeft");
    expect(items()[0].tabIndex).toBe(0);
  });

  test("highlight-pattern marks keys and primitive values; makeJsonViewHighlightPattern builds it from terms", async () => {
    const el = await mount(`<acme-json-view highlight-pattern="request|failed" data='{"requestId":"req_1","message":"Deployment request failed","statusCode":500}'></acme-json-view>`);
    expect($$(el, "mark").map((m) => m.textContent)).toEqual(["request", "request", "failed"]);
    expect($(el, ".key").textContent).toBe("requestId: ");
    expect($(el, ".key mark").textContent).toBe("request");
    expect(makeJsonViewHighlightPattern(["a", "req.", "Failed"])?.toString()).toBe("/(req\\.|Failed)/gi");
    expect(makeJsonViewHighlightPattern(["a"])).toBeNull();
    el.highlightPattern = makeJsonViewHighlightPattern(["500"]);
    await el.updateComplete;
    expect($$(el, "mark").map((m) => m.textContent)).toEqual(["500"]);
    el.highlightPattern = null;
    await el.updateComplete;
    expect($$(el, "mark").length).toBe(0);
  });

  test("hover lands on the toggle as data-hover for mouse pointers, never for touch", async () => {
    const el = await mount(`<acme-json-view default-expand-depth="1" data='${data}'></acme-json-view>`);
    const toggle = $(el, ".item .toggle");
    toggle.dispatchEvent(new PointerEvent("pointerover", { pointerType: "mouse", bubbles: true }));
    expect(toggle.getAttribute("data-hover")).toBe("true");
    toggle.dispatchEvent(new PointerEvent("pointerout", { pointerType: "mouse", bubbles: true }));
    expect(toggle.hasAttribute("data-hover")).toBe(false);
    toggle.dispatchEvent(new PointerEvent("pointerover", { pointerType: "touch", bubbles: true }));
    expect(toggle.hasAttribute("data-hover")).toBe(false);
  });
});
