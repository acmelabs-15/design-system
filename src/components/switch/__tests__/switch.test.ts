import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeSwitchControl } from "../../switch-control/switch-control";
import type { AcmeSwitch } from "../switch";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.querySelector("acme-switch") as AcmeSwitch;
  await el.updateComplete;
  for (const c of el.querySelectorAll("acme-switch-control")) await (c as AcmeSwitchControl).updateComplete;
  return el;
};
const root = (c: AcmeSwitchControl) => c.shadowRoot!.querySelector(".switch-control") as HTMLElement;

describe("acme-switch", () => {
  test("renders the group root with the size class and the controls as label roots with a hidden radio and a label box", async () => {
    const el = await mount(
      `<acme-switch name="v" size="large"><acme-switch-control default-checked label="Source" value="source"></acme-switch-control><acme-switch-control label="Output" value="output"></acme-switch-control></acme-switch>`,
    );
    expect(el.shadowRoot!.querySelector(".switch")!.className.trim()).toBe("switch lg");
    const [a, b] = el.querySelectorAll("acme-switch-control") as unknown as AcmeSwitchControl[];
    expect(root(a).tagName).toBe("LABEL");
    expect(root(a).className.trim()).toBe("switch-control lg");
    expect(root(a).hasAttribute("data-checked")).toBe(true);
    expect(root(b).hasAttribute("data-checked")).toBe(false);
    expect(root(a).querySelector("input[type=radio]")!.getAttribute("name")).toBe("v");
    expect(root(a).querySelector(".label slot:not([name])")).not.toBeNull();
    expect(root(a).querySelector(".label")!.getAttribute("style")).toContain("--switch-checked-color:var(--ds-gray-100)");
    expect(el.value).toBe("source");
  });
  test("selecting a control moves the value, the checked state and the Tab stop, and emits acme-change", async () => {
    const el = await mount(`<acme-switch><acme-switch-control default-checked label="A" value="a"></acme-switch-control><acme-switch-control label="B" value="b"></acme-switch-control></acme-switch>`);
    let got = "";
    el.addEventListener("acme-change", (e) => {
      got = (e as CustomEvent).detail.value;
    });
    const [a, b] = el.querySelectorAll("acme-switch-control") as unknown as AcmeSwitchControl[];
    expect(root(a).querySelector("input")!.getAttribute("tabindex")).toBe("0");
    expect(root(b).querySelector("input")!.getAttribute("tabindex")).toBe("-1");
    root(b)
      .querySelector("input")!
      .dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    await a.updateComplete;
    await b.updateComplete;
    expect(el.value).toBe("b");
    expect(got).toBe("b");
    expect(root(a).hasAttribute("data-checked")).toBe(false);
    expect(root(b).hasAttribute("data-checked")).toBe(true);
  });
  test("a disabled control carries data-disabled and disables its radio; hide-border and checked-color reach the DOM", async () => {
    const el = await mount(`<acme-switch hide-border checked-color="var(--ds-blue-100)"><acme-switch-control disabled label="A" value="a"></acme-switch-control></acme-switch>`);
    expect(el.shadowRoot!.querySelector(".switch")!.className).toContain("no-border");
    const c = el.querySelector("acme-switch-control") as AcmeSwitchControl;
    expect(root(c).hasAttribute("data-disabled")).toBe(true);
    expect((root(c).querySelector("input") as HTMLInputElement).disabled).toBe(true);
    expect(root(c).querySelector(".label")!.getAttribute("style")).toContain("--switch-checked-color:var(--ds-blue-100)");
  });
  test("the group's size wins over a direct control's own size; an icon control hides its text and sizes the icon", async () => {
    const el = await mount(`<acme-switch size="large"><acme-switch-control size="small" label="Grid" value="g"><svg slot="icon" width="16" height="16"></svg></acme-switch-control></acme-switch>`);
    const c = el.querySelector("acme-switch-control") as AcmeSwitchControl;
    expect(root(c).className.trim()).toBe("switch-control lg icon");
    expect(root(c).querySelector(".sr")!.textContent).toBe("Grid");
    expect(root(c).querySelector("input")!.getAttribute("aria-label")).toBe("Grid");
    expect(c.querySelector("svg")!.getAttribute("width")).toBe("20");
  });
  test("interaction states land as data attributes on the label root", async () => {
    const el = await mount(`<acme-switch><acme-switch-control label="A" value="a"></acme-switch-control></acme-switch>`);
    const r = root(el.querySelector("acme-switch-control") as AcmeSwitchControl);
    r.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" }));
    expect(r.getAttribute("data-hover")).toBe("true");
    r.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(r.hasAttribute("data-hover")).toBe(false);
  });
});
