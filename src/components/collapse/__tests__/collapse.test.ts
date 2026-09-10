import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeCollapseGroup } from "../../collapse-group/collapse-group";
import type { AcmeCollapse } from "../collapse";

const mount = async <T extends HTMLElement & { updateComplete: Promise<boolean> }>(markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as T;
  await el.updateComplete;
  return el;
};
const settle = () => new Promise((r) => setTimeout(r, 0));
const sr = (el: HTMLElement) => el.shadowRoot!;

describe("acme-collapse", () => {
  test("a heading with the button trigger over the inert region; a click opens it and fires the events", async () => {
    const el = await mount<AcmeCollapse>(`<acme-collapse title="Question A"><p>Body</p></acme-collapse>`);
    const root = sr(el).querySelector(".collapse")!;
    expect(root.className.trim()).toBe("collapse");
    const t = sr(el).querySelector("h3.heading > button.trigger")!;
    expect(t.getAttribute("type")).toBe("button");
    expect(t.querySelector(".row")!.textContent!.trim()).toBe("Question A");
    expect(t.querySelector(".row > .chev svg")).not.toBeNull();
    expect(t.getAttribute("aria-expanded")).toBe("false");
    expect(el.hasAttribute("title")).toBe(false);
    const panel = sr(el).getElementById(t.getAttribute("aria-controls")!)!;
    expect(panel.className).toBe("panel");
    expect(panel.getAttribute("role")).toBe("region");
    expect(panel.getAttribute("aria-labelledby")).toBe(t.id);
    expect(panel.getAttribute("style")).toBe("height:0px");
    expect(panel.hasAttribute("inert")).toBe(true);
    expect(panel.querySelector(".body > slot")).not.toBeNull();
    const seen: string[] = [];
    el.addEventListener("acme-toggle", (e) => seen.push(`toggle:${(e as CustomEvent).detail.open}`));
    el.addEventListener("acme-expand", () => seen.push("expand"));
    (t as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(t.getAttribute("aria-expanded")).toBe("true");
    expect(root.classList.contains("expanded")).toBe(true);
    expect(panel.hasAttribute("inert")).toBe(false);
    expect(seen).toEqual(["toggle:true", "expand"]);
  });

  test("default-expanded starts open; size small maps to sm", async () => {
    const el = await mount<AcmeCollapse>(`<acme-collapse default-expanded size="small" title="Q">x</acme-collapse>`);
    expect(el.open).toBe(true);
    expect(sr(el).querySelector(".collapse")!.className).toContain("sm");
    expect(sr(el).querySelector(".trigger")!.hasAttribute("aria-disabled")).toBe(false);
  });
});

describe("acme-collapse-group", () => {
  test("marks its panels grouped; one open at a time, several with multiple, a second click closes", async () => {
    const g = await mount<AcmeCollapseGroup>(`<acme-collapse-group><acme-collapse title="A">a</acme-collapse><acme-collapse title="B">b</acme-collapse></acme-collapse-group>`);
    const [a, b] = [...g.querySelectorAll("acme-collapse")];
    await settle();
    await a.updateComplete;
    expect(a.group).toBe(g);
    expect(sr(a).querySelector(".collapse")!.classList.contains("grouped")).toBe(true);
    a.toggle();
    b.toggle();
    await settle();
    expect(a.open).toBe(false);
    expect(b.open).toBe(true);
    b.toggle();
    await settle();
    expect(b.open).toBe(false);
    g.multiple = true;
    a.toggle();
    b.toggle();
    await settle();
    expect(a.open).toBe(true);
    expect(b.open).toBe(true);
  });

  test("a default-expanded panel shows while nothing is chosen and cannot close itself", async () => {
    const g = await mount<AcmeCollapseGroup>(`<acme-collapse-group><acme-collapse title="A">a</acme-collapse><acme-collapse default-expanded title="B">b</acme-collapse></acme-collapse-group>`);
    const [a, b] = [...g.querySelectorAll("acme-collapse")];
    await settle();
    await b.updateComplete;
    expect(b.open).toBe(true);
    const t = sr(b).querySelector<HTMLElement>(".trigger")!;
    expect(t.getAttribute("aria-disabled")).toBe("true");
    t.click();
    await settle();
    expect(b.open).toBe(true);
    a.toggle();
    await settle();
    await b.updateComplete;
    expect(a.open).toBe(true);
    expect(b.open).toBe(false);
    expect(sr(b).querySelector(".trigger")!.hasAttribute("aria-disabled")).toBe(false);
  });
});
