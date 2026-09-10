import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeTable } from "../table";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeTable;
  await el.updateComplete;
  return el;
};
const cols = `columns='[{"key":"a","label":"Col 1","width":"44%"},{"key":"b","label":"Col 2","numeric":true}]'`;
const rows = `rows='[{"a":"1.1","b":"1.2"},{"a":"2.1","b":""}]'`;
const sr = (el: AcmeTable) => el.shadowRoot!;

describe("acme-table", () => {
  test("renders a scroll box around a native table: colgroup, header, spacer body, body; an em dash for an empty cell", async () => {
    const el = await mount(`<acme-table ${cols} ${rows}></acme-table>`);
    const s = sr(el);
    expect(s.querySelector(".root > table")).not.toBeNull();
    expect(s.querySelector("col")!.getAttribute("style")).toBe("width:44%");
    expect(s.querySelectorAll("thead th").length).toBe(2);
    expect(s.querySelector("thead th")!.getAttribute("scope")).toBe("col");
    expect(s.querySelector("tbody.spacer")!.getAttribute("aria-hidden")).toBe("true");
    expect(s.querySelectorAll("tbody.body tr").length).toBe(2);
    expect(s.querySelectorAll("tbody.body td")[3].textContent).toBe("—");
    expect(s.querySelectorAll("tbody.body td")[1].className).toBe("num");
    expect(s.querySelector("tfoot")).toBeNull();
  });

  test("striped, bordered, interactive and a compact density are modifiers on the root; remove-spacing drops the spacer body", async () => {
    const el = await mount(`<acme-table striped bordered interactive density="compact" remove-spacing ${cols} ${rows}></acme-table>`);
    const root = sr(el).querySelector(".root")!;
    expect(root.className.trim()).toBe("root striped bordered interactive compact");
    expect(sr(el).querySelector("tbody.spacer")).toBeNull();
    expect(sr(el).querySelectorAll("tbody").length).toBe(1);
  });

  test("footer cells render in a tfoot with colspan", async () => {
    const el = await mount(`<acme-table ${cols} ${rows} footer='[{"text":"Subtotal","colspan":3},{"text":"$24,000.00"}]'></acme-table>`);
    const cells = sr(el).querySelectorAll("tfoot td");
    expect(cells.length).toBe(2);
    expect(cells[0].getAttribute("colspan")).toBe("3");
    expect(cells[1].textContent).toBe("$24,000.00");
  });

  test("an interactive row carries data-hover under a mouse pointer, never a touch one, and reports a click as acme-row", async () => {
    const el = await mount(`<acme-table interactive ${cols} ${rows}></acme-table>`);
    const [first, second] = [...sr(el).querySelectorAll("tbody.body tr")];
    const cell = first.querySelector("td")!;
    cell.dispatchEvent(new PointerEvent("pointerover", { pointerType: "mouse", bubbles: true }));
    expect(first.getAttribute("data-hover")).toBe("true");
    second.querySelector("td")!.dispatchEvent(new PointerEvent("pointerover", { pointerType: "mouse", bubbles: true }));
    expect(first.hasAttribute("data-hover")).toBe(false);
    expect(second.getAttribute("data-hover")).toBe("true");
    sr(el)
      .querySelector("tbody.body")!
      .dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(second.hasAttribute("data-hover")).toBe(false);
    cell.dispatchEvent(new PointerEvent("pointerover", { pointerType: "touch", bubbles: true }));
    expect(first.hasAttribute("data-hover")).toBe(false);
    let detail: { index: number } | undefined;
    el.addEventListener("acme-row", (e) => {
      detail = (e as CustomEvent).detail;
    });
    second.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(detail?.index).toBe(1);
  });

  test("virtualize keeps the body at full height and holds the place of the rows left out with hidden spacer rows", async () => {
    const el = await mount(`<acme-table virtualize ${cols} ${rows}></acme-table>`);
    const body = sr(el).querySelector("tbody.body")!;
    expect(body.getAttribute("style")).toBe("height:80px");
    const spacers = [...body.querySelectorAll("tr[aria-hidden]")];
    expect(spacers.length).toBe(2);
    expect(spacers[0].getAttribute("style")).toBe("height:0px");
    expect(spacers[spacers.length - 1].getAttribute("style")).toBe("height:0px");
    expect(body.querySelectorAll("tr:not([aria-hidden])").length).toBe(2);
    const compact = await mount(`<acme-table virtualize density="compact" ${cols} ${rows}></acme-table>`);
    expect(sr(compact).querySelector("tbody.body")!.getAttribute("style")).toBe("height:60px");
  });

  test("selectable composes a checkbox column: the header checkbox selects every row, a row's toggles its index, and acme-select reports the selection", async () => {
    const el = await mount(`<acme-table selectable ${cols} ${rows}></acme-table>`);
    const s = sr(el);
    expect(s.querySelectorAll("thead th").length).toBe(3);
    expect(s.querySelector("thead th acme-checkbox")).not.toBeNull();
    expect(s.querySelectorAll("tbody.body tr").length).toBe(2);
    expect(s.querySelectorAll("tbody.body td:first-child > acme-checkbox").length).toBe(2);
    let detail: { selected: number[] } | undefined;
    el.addEventListener("acme-select", (e) => {
      detail = (e as CustomEvent).detail;
    });
    s.querySelectorAll("tbody.body acme-checkbox")[1].dispatchEvent(new CustomEvent("acme-change", { detail: { checked: true }, bubbles: true, composed: true }));
    await el.updateComplete;
    expect(detail?.selected).toEqual([1]);
    expect((s.querySelector("thead acme-checkbox") as HTMLElement & { indeterminate: boolean }).indeterminate).toBe(true);
    s.querySelector("thead acme-checkbox")!.dispatchEvent(new CustomEvent("acme-change", { detail: { checked: true }, bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.selected).toEqual([0, 1]);
    expect((s.querySelector("thead acme-checkbox") as HTMLElement & { checked: boolean }).checked).toBe(true);
  });
});
