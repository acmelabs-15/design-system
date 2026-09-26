import * as markdownParser from "@tanstack/markdown/parser";

import { expect, test, spyOn } from "bun:test";
import "../../../all";
import { discoverHeadingTargets } from "../../../shared/heading-targets";
import { highlighter } from "../../../shared/highlight";

async function mount(text: string, id = "article") {
  const el = document.createElement("acme-markdown");
  el.id = id;
  el.text = text;
  document.body.replaceChildren(el);
  await el.updateComplete;
  return el;
}
test("Markdown owns native prose and real stable fragment targets", async () => {
  const el = await mount("## Install\n\nSome **strong** text and `inline()` code.\n\n[Jump](#install)");
  const heading = el.querySelector("h2")!;
  expect(heading).not.toBeNull();
  expect(heading.id).toBe("article-install");
  expect(el.querySelector("strong")!.textContent).toBe("strong");
  expect(el.querySelector("a")!.getAttribute("href")).toBe("#article-install");
  expect(discoverHeadingTargets(el).map((target) => target.id)).toEqual(["article-install"]);
  el.requestUpdate();
  await el.updateComplete;
  expect(el.querySelector("h2")).toBe(heading);
});
test("default raw HTML and executable URLs remain inert; HTML is an explicit trusted opt-in", async () => {
  const el = await mount("<img src=x onerror=bad()>\n\n[bad](javascript:alert(1))");
  expect(el.querySelector("img")).toBeNull();
  expect(el.querySelector("a[href^=javascript]")).toBeNull();
  el.text = "<b>Trusted</b>";
  el.allowHtml = true;
  await el.updateComplete;
  expect(el.querySelector("b")!.textContent).toBe("Trusted");
});
test("text is the only source and output IDs remain unique across instances", async () => {
  const first = await mount("## Shared\n\nA footnote[^a].\n\n[^a]: A note.", "one");
  const second = document.createElement("acme-markdown");
  second.id = "two";
  second.text = first.text;
  second.append(document.createTextNode("# Ignored"));
  document.body.append(second);
  await second.updateComplete;
  expect(second.querySelector("h1")).toBeNull();
  const ids = [...document.querySelectorAll("[data-acme-markdown-prose] [id]")].map((node) => node.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(second.querySelector("h2")!.id).toBe("two-shared");
});
test("code fences highlight and failed highlighting preserves safe source", async () => {
  const el = await mount("```ts\nconst value = 1;\n```");
  expect(el.querySelector(".th-keyword")!.textContent).toBe("const");
  const errors: any[] = [];
  el.addEventListener("acme-error", (e) => errors.push((e as CustomEvent).detail));
  const mock = spyOn(highlighter, "tokenize").mockImplementation(() => {
    throw Error("broken highlighter");
  });
  try {
    el.text = "```html\n<img src=x>\n```";
    await el.updateComplete;
    expect(el.querySelector("img")).toBeNull();
    expect(el.querySelector("pre")!.textContent).toContain("<img");
    expect(errors[0]?.code).toBe("highlight");
  } finally {
    mock.mockRestore();
  }
});
test("table alignment uses generated hooks and relative links retain page resolution", async () => {
  const el = await mount("| Name | Count |\n| :--- | ---: |\n| Example | 2 |\n\n[Guide](./guide)");
  expect(el.querySelector("th:last-child")!.getAttribute("data-acme-markdown-align")).toBe("right");
  expect(el.querySelector("th:last-child")!.hasAttribute("style")).toBe(false);
  expect(el.querySelector("a")!.getAttribute("href")).toBe("./guide");
});

test("parser failure keeps safe source and reports its failure", async () => {
  const mock = spyOn(markdownParser, "parseMarkdown").mockImplementation(() => {
    throw Error("parser unavailable");
  });
  try {
    const el = document.createElement("acme-markdown");
    el.text = "<img src=x>";
    const errors: any[] = [];
    el.addEventListener("acme-error", (event) => errors.push((event as CustomEvent).detail));
    document.body.replaceChildren(el);
    await el.updateComplete;
    expect(el.querySelector("img")).toBeNull();
    expect(el.querySelector("pre")?.textContent).toBe("<img src=x>");
    expect(errors[0]?.code).toBe("parse");
  } finally {
    mock.mockRestore();
  }
});
