// Read-only check of the deployed 0.3.3 documentation and its CDN links.
// Usage: bun docs/verification/releases/0.3.3/verify-pages.ts <unpacked pages artifact> <browser archive .tgz> <output dir>
// Browser criteria follow docs/verification/releases/0.3.2/verify-pages-browser.ts; the full-site byte crawl is replaced by entry files.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [site, browserArchive, output] = process.argv.slice(2);
assert.ok(site && browserArchive && output, "Pass the unpacked pages artifact, the browser archive and an output directory");
fs.mkdirSync(output, { recursive: true });
const origin = "https://acmelabs-15.github.io/design-system/";
const cdn = "https://cdn.jsdelivr.net/npm/@acmelabs/design-system-browser@0.3.3/";
const sha256 = (bytes: ArrayBuffer | Uint8Array) => new Bun.CryptoHasher("sha256").update(bytes).digest("hex");
const fetchBytes = async (url: string) => {
  const response = await fetch(url, { headers: { "cache-control": "no-cache" } });
  return { status: response.status, bytes: new Uint8Array(await response.arrayBuffer()) };
};

const entryFiles = ["index.html", "404.html", "app.js", "styles/tokens.css", "styles/dashboard.css", "styles/docs.css", "index.md", "components/button.md"];
const files = [];
for (const file of entryFiles) {
  const local = sha256(await Bun.file(path.join(site, file)).arrayBuffer());
  const remote = await fetchBytes(origin + file);
  assert.equal(remote.status, 200, "Public status for " + file);
  assert.equal(sha256(remote.bytes), local, "Public bytes differ from the deployed artifact: " + file);
  files.push({ path: file, sha256: local });
}

const unpacked = fs.mkdtempSync(path.join(os.tmpdir(), "acme-browser-0.3.3-"));
Bun.spawnSync(["tar", "-xzf", browserArchive, "-C", unpacked]);
const cdnFiles = [];
for (const file of ["styles/tokens.css", "dist/define/button.js", "dist/define/badge.js", "dist/standalone.js"]) {
  const remote = await fetchBytes(cdn + file);
  assert.equal(remote.status, 200, "CDN status for " + file);
  const local = sha256(await Bun.file(path.join(unpacked, "package", file)).arrayBuffer());
  assert.equal(sha256(remote.bytes), local, "CDN bytes differ from the published browser archive: " + file);
  cdnFiles.push({ path: file, sha256: local });
}
fs.rmSync(unpacked, { recursive: true, force: true });

const runtime = "/Users/peterkloss/Library/Caches/acme-design-system/browser-checks";
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const pw = await import(runtime + "/node_modules/playwright/index.mjs");
const titles: Record<string, string> = { "": "ACME Design System", "components/button": "Button", "components/flow-diagram": "Flow Diagram", "recipes/experimental-worker-table": "Experimental Table workers" };
const results = [];
for (const engine of ["chromium", "firefox", "webkit"]) {
  const browser = await pw[engine].launch({ headless: true });
  try {
    for (const route of Object.keys(titles)) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
      const errors: string[] = [], badAssets: string[] = [], warnings: string[] = [];
      page.on("pageerror", (error: Error) => errors.push(String(error)));
      page.on("console", (message: { type(): string; text(): string }) => {
        if (message.type() === "warning") warnings.push(message.text());
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("response", (response: { status(): number; url(): string; request(): { resourceType(): string } }) => {
        if (response.status() >= 400 && response.request().resourceType() !== "document") badAssets.push(`${response.status()} ${response.url()}`);
      });
      try {
        const response = await page.goto(new URL(route, origin).href, { waitUntil: "load" });
        assert.equal(response.status(), route ? 404 : 200, "GitHub Pages deep-link shell status");
        await page.locator("main h1").filter({ hasText: new RegExp("^" + titles[route] + "$") }).waitFor();
        await page.waitForFunction(() => [...document.querySelectorAll("main .preview *")]
          .filter((element) => element.namespaceURI === "http://www.w3.org/1999/xhtml" && element.localName.includes("-"))
          .every((element) => element.matches(":defined")));
        assert.deepEqual(await page.locator("[data-example-error]:not([hidden])").allTextContents(), []);
        if (!route) {
          await page.locator(".docs-side").getByRole("link", { name: "Button", exact: true }).click();
          await page.waitForURL(origin + "components/button");
          await page.locator("main h1").filter({ hasText: /^Button$/ }).waitFor();
        }
        if (route === "components/flow-diagram") {
          await page.waitForFunction(() => {
            const flows = [...document.querySelectorAll("main .preview acme-flow-diagram")] as (HTMLElement & { edges: { id: string }[]; nodes: unknown[] })[];
            return flows.length === 4 && flows.every((flow) => {
              const rendered = new Set([...(flow.shadowRoot?.querySelectorAll("[part=edge]") ?? [])].map((edge) => edge.getAttribute("data-edge")));
              return flow.shadowRoot?.querySelector("[part=viewport]")?.getAttribute("aria-busy") === "false" && flow.edges.every((edge) => rendered.has(edge.id));
            });
          });
        }
        // A deep link loads the 404 shell by design; the browser logs that document status once.
        const shellStatus = "Failed to load resource: the server responded with a status of 404 ()";
        const unexpected = route && badAssets.length === 0 ? errors.filter((error, index) => !(error === shellStatus && errors.indexOf(shellStatus) === index)) : errors;
        assert.deepEqual(unexpected, [], `${engine} ${route || "index"} errors`);
        assert.deepEqual(badAssets, [], `${engine} ${route || "index"} failed assets`);
        assert.deepEqual(warnings, [], `${engine} ${route || "index"} warnings`);
        results.push({ engine, browser: browser.version(), route: route || "index", pass: true });
        console.log(`${engine}: ${route || "index"} passes.`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

const result = {
  checkedAt: new Date().toISOString(),
  origin,
  playwrightVersion: (await Bun.file(runtime + "/node_modules/playwright/package.json").json()).version,
  files,
  cdn,
  cdnFiles,
  results,
  limits: ["Entry files only; not a crawl of all 25,120 site files", "Three Playwright engines; not actual Safari"],
};
await Bun.write(path.join(output, "pages-verification.json"), JSON.stringify(result, null, 2) + "\n");
console.log(`Pages: ${files.length} entry files and ${cdnFiles.length} CDN files match; ${results.length} route checks pass.`);
