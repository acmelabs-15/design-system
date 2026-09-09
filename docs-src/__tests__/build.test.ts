// Every built docs fragment renders with the real elements: no unknown acme-* tag, no element
// left with an empty shadow root, no error thrown while Lit renders the examples (a bad JSON
// attribute, a missing property, a template fault). Run `bun run build && bun run docs` first.
import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import "../../src/index.ts";

const DOCS = path.resolve(import.meta.dir, "../../docs");
const PAGES = path.join(DOCS, "pages");
const fragments = fs.existsSync(PAGES) ? [...fs.readdirSync(PAGES).filter((f) => f.endsWith(".html")), ...fs.readdirSync(path.join(PAGES, "components")).map((f) => `components/${f}`)] : [];

// Elements whose own shadow root is legitimately empty, plus the docs-only token rows the app defines.
const LIGHT = new Set(["acme-toaster", "acme-menu-divider", "acme-grid-cross", "acme-switch-control", "acme-tab-panel", "docs-tokens"]);
const settle = () => new Promise((r) => setTimeout(r, 20));

describe("docs site", () => {
  test("the shell, its 404 twin, the app and the fragments are built", () => {
    expect(fragments.length).toBeGreaterThan(80);
    const index = fs.readFileSync(path.join(DOCS, "index.html"), "utf8");
    expect(fs.readFileSync(path.join(DOCS, "404.html"), "utf8")).toBe(index);
    expect(index).toContain("<acme-docs-app>");
    expect(index).toContain("window.__docsNav");
    expect(fs.existsSync(path.join(DOCS, "app.js"))).toBe(true);
    expect(fs.existsSync(path.join(DOCS, ".nojekyll"))).toBe(true);
  });

  for (const page of fragments) {
    test(`pages/${page} renders`, async () => {
      const html = fs.readFileSync(path.join(PAGES, page), "utf8");
      expect(html.length).toBeGreaterThan(0);
      expect(html).not.toContain("<script");
      const errors: string[] = [];
      const onError = (e: Event) => errors.push(String((e as ErrorEvent).message ?? e));
      window.addEventListener("error", onError);
      const orig = console.error;
      console.error = (...a: unknown[]) => errors.push(a.map(String).join(" "));
      try {
        document.body.innerHTML = html;
        await settle();
        await settle();
        const all = Array.from(document.body.querySelectorAll("*")).filter((e) => e.tagName.includes("-") && e.localName.startsWith("acme-"));
        const undef = Array.from(new Set(all.filter((e) => !customElements.get(e.localName)).map((e) => e.localName)));
        expect(undef).toEqual([]);
        const empty = Array.from(new Set(all.filter((e) => !LIGHT.has(e.localName) && e.shadowRoot && e.shadowRoot.childElementCount === 0).map((e) => e.localName)));
        expect(empty).toEqual([]);
        if (page.startsWith("components/")) expect(html).toContain('class="api-el"');
        expect(errors).toEqual([]);
      } finally {
        document.body.innerHTML = "";
        window.removeEventListener("error", onError);
        console.error = orig;
      }
    });
  }
});
