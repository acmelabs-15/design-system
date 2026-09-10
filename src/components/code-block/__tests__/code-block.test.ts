import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeCodeBlock } from "../code-block";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeCodeBlock;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeCodeBlock) => el.shadowRoot!.querySelector(".code-block") as HTMLElement;
const src = `function a() {\n  return 1;\n}`;

describe("acme-code-block", () => {
  test("a filename renders the bar with the file icon, the name and the copy button; the content is a grid of numbered lines", async () => {
    const el = await mount(`<acme-code-block aria-label="Hello world" filename="Table.jsx" language="jsx">${src}</acme-code-block>`);
    const r = root(el);
    expect(r.classList.contains("with-bar")).toBe(true);
    expect(r.getAttribute("aria-label")).toBe("Hello world");
    expect(r.querySelector(".bar > .name > .file-icon svg")).not.toBeNull();
    expect(r.querySelector(".bar > .name > .filename")!.textContent).toBe("Table.jsx");
    const copy = r.querySelector(".bar > .actions > acme-button")!;
    expect(copy.getAttribute("aria-label")).toBe("Copy to clipboard");
    expect(copy.querySelector(".stack > .check")).not.toBeNull();
    expect(r.querySelector("acme-button.floating")).toBeNull();
    const lines = r.querySelectorAll(".content > pre.pre > code.body > .line");
    expect(lines.length).toBe(3);
    expect(lines[1].id).toBe("L2");
    expect(lines[1].querySelector("button.ln")!.textContent).toBe("2");
    expect(lines[1].querySelector(".ln")!.getAttribute("tabindex")).toBe("-1");
    expect(lines[0].querySelector(".tokens .token.keyword")!.textContent).toBe("function");
    expect(lines[0].hasAttribute("data-highlighted")).toBe(false);
  });

  test("without a filename the copy button floats over the code", async () => {
    const el = await mount(`<acme-code-block language="jsx">${src}</acme-code-block>`);
    const r = root(el);
    expect(r.classList.contains("with-bar")).toBe(false);
    expect(r.querySelector(".bar")).toBeNull();
    expect(r.querySelector(":scope > acme-button.floating")).not.toBeNull();
  });

  test("highlighted, added and removed lines mark every line; hide-line-numbers marks the root", async () => {
    const el = await mount(
      `<acme-code-block filename="a.js" highlighted-lines-numbers="[1]" added-lines-numbers="[3]" removed-lines-numbers="[2]" hide-line-numbers language="js">${src}</acme-code-block>`,
    );
    const r = root(el);
    expect(r.classList.contains("hide-numbers")).toBe(true);
    const lines = r.querySelectorAll(".line");
    expect(lines[0].getAttribute("data-highlighted")).toBe("true");
    expect(lines[1].getAttribute("data-highlighted")).toBe("false");
    expect(lines[1].getAttribute("data-removed")).toBe("true");
    expect(lines[2].getAttribute("data-added")).toBe("true");
  });

  test("pressing a line number references the line and fires acme-reference; pressing again clears it", async () => {
    const el = await mount(`<acme-code-block language="js">${src}</acme-code-block>`);
    const seen: number[] = [];
    el.addEventListener("acme-reference", (e) => seen.push((e as CustomEvent).detail.line));
    (root(el).querySelectorAll(".ln")[1] as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.referencedLine).toBe(2);
    expect(root(el).querySelectorAll(".line")[1].getAttribute("data-active")).toBe("true");
    (root(el).querySelectorAll(".ln")[1] as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.referencedLine).toBe(0);
    expect(seen).toEqual([2, 0]);
  });

  test("switcher renders the face and the select in the actions; a change fires acme-change", async () => {
    const el = await mount(
      `<acme-code-block filename="a.js" language="js" switcher='[{"label":"JavaScript","value":"js"},{"label":"Lua","value":"lua"}]' switcher-value="js">${src}</acme-code-block>`,
    );
    const sw = root(el).querySelector(".actions > .switcher")!;
    expect(sw.querySelector(".face > span")!.textContent).toBe("JavaScript");
    const select = sw.querySelector("select") as HTMLSelectElement;
    expect(select.querySelectorAll("option").length).toBe(2);
    const seen: string[] = [];
    el.addEventListener("acme-change", (e) => seen.push((e as CustomEvent).detail.value));
    select.value = "lua";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(seen).toEqual(["lua"]);
    expect(sw.querySelector(".face > span")!.textContent).toBe("Lua");
  });

  test("tabs render a strip with an acme-tabs above the bar; the reference form with options and value is read too", async () => {
    const el = await mount(
      `<acme-code-block filename="a.js" language="js" tabs='{"options":[{"label":"JavaScript","value":"js"},{"label":"Lua","value":"lua"}],"value":"lua"}'>${src}</acme-code-block>`,
    );
    const strip = root(el).querySelector(":scope > .strip")!;
    const tabs = strip.querySelector("acme-tabs")!;
    expect(tabs.getAttribute("variant")).toBe("secondary");
    expect(tabs.getAttribute("value")).toBe("lua");
    expect(tabs.querySelectorAll("acme-tab").length).toBe(2);
    expect(root(el).querySelector(".switcher")).toBeNull();
  });

  test("v0 adds a foot: ask is a link button, build a split button", async () => {
    const ask = await mount(`<acme-code-block filename="a.js" language="js" v0="ask">${src}</acme-code-block>`);
    expect(root(ask).classList.contains("ask")).toBe(true);
    const link = root(ask).querySelector(".foot > acme-button")!;
    expect(link.getAttribute("href")!.startsWith("https://v0.app/chat?q=")).toBe(true);
    expect(link.querySelector(".sr")!.textContent).toBe("Open in v0");
    const build = await mount(`<acme-code-block filename="a.js" language="js" v0="build">${src}</acme-code-block>`);
    expect(root(build).querySelector(".foot > acme-split-button")).not.toBeNull();
  });

  test("copy writes the source to the clipboard and fires acme-copy", async () => {
    const written: string[] = [];
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t: string) => void written.push(t) }, configurable: true });
    const el = await mount(`<acme-code-block filename="a.js" language="js" code="let x = 1">ignored</acme-code-block>`);
    const seen: string[] = [];
    el.addEventListener("acme-copy", (e) => seen.push((e as CustomEvent).detail.text));
    (root(el).querySelector(".actions > acme-button") as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(written).toEqual(["let x = 1"]);
    expect(seen).toEqual(["let x = 1"]);
    expect(root(el).querySelector(".stack")!.classList.contains("copied")).toBe(true);
  });
});
