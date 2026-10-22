import type * as Playwright from "playwright";
import path from "node:path";
import { loadDocs } from "../../../site/pages/components/index";
import { exampleSources, exampleId } from "../../../site/example-source";
import assert from "node:assert/strict";
import { browserDistribution } from "../browser-distribution";

const root = path.resolve(import.meta.dir, "../../..");
const distribution = browserDistribution(root, process.env.ACME_BROWSER_PACKAGE, process.env.ACME_RELEASE_CONSUMER);
const examples = [];
for (const doc of await loadDocs()) {
  for (const e of doc.examples) {
    if (e.census || e.code) {
      continue;
    }
    const [source] = await exampleSources(e, exampleId(doc.id, e.h));
    examples.push({ id: exampleId(doc.id, e.h), code: source.code, script: !!e.script });
  }
}
for (const example of examples) {
  const references = [...example.code.matchAll(/https:\/\/cdn\.jsdelivr\.net\/npm\/@acmelabs\/design-system-browser@([^/]+)(\/[^"'<>\s]+)/g)];
  assert.ok(references.length, example.id + ": missing browser distribution references");
  for (const match of references) {
    assert.equal(match[1], distribution.version);
    const file = distribution.file(match[2]);
    assert.ok(file && (await Bun.file(file).exists()), example.id + ": " + match[2]);
  }
}
const selected = examples.filter((e) => e.script && ["toast", "theme", "button", "checkbox", "middle-truncate"].some((prefix) => e.id.startsWith(prefix + "-")));
const server = Bun.serve({
  port: 0,
  fetch(req): Response {
    const path = new URL(req.url).pathname;
    const file = distribution.file(path);
    if (file) {
      return new Response(Bun.file(file));
    }
    const example = selected.find((e) => "/" + e.id === path);
    return new Response(example?.code.replaceAll(/https:\/\/cdn\.jsdelivr\.net\/npm\/@acmelabs\/design-system-browser@[^/]+/g, server.url.origin) ?? "missing", {
      headers: { "Content-Type": "text/html" },
    });
  },
});
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) {
  throw new Error("Set ACME_BROWSER_RUNTIME");
}
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const pw: typeof Playwright = await import(runtime + "/node_modules/playwright/index.mjs");
const results = [];
try {
  for (const engine of ["chromium", "firefox", "webkit"] as const) {
    const browser = await pw[engine].launch({ headless: true, ...(engine === "chromium" ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
    const page = await browser.newPage();
    await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
    await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
    let errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const example of selected) {
      errors = [];
      try {
        await page.goto(server.url.origin + "/" + example.id, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => [...document.querySelectorAll("*")].filter((e) => e.localName.startsWith("acme-")).every((e) => customElements.get(e.localName)));
        await page.evaluate(async () => Promise.all([...document.querySelectorAll("*")].map((e) => (e as Element & { updateComplete?: Promise<boolean> }).updateComplete)));
        assert.deepEqual(errors, []);
        results.push({ engine, id: example.id, pass: true });
      } catch (e) {
        results.push({ engine, id: example.id, pass: false, error: String(e) });
        console.log(engine, example.id, e);
      }
    }
    await browser.close();
    console.log(engine, "copied", selected.length);
  }
} finally {
  server.stop(true);
}
await Bun.write(".artifacts/m23-docs/copied-results.json", JSON.stringify({ allSourcesChecked: examples.length, results }, null, 2));
if (results.some((r) => !r.pass)) {
  process.exitCode = 1;
}
