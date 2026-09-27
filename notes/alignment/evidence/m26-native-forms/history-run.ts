import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve(import.meta.dir, "../../../..");
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME");
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(runtime, "browsers");
const pw = await import(path.join(runtime, "node_modules/playwright/index.mjs"));
type Snapshot = { instance: string; pageshow: boolean[]; navigation: string; native: string; custom: string; inner: string; form: [string, string][] };
type HistoryWindow = Window & { historyProbe: { instance: string; pageshow: boolean[]; ready?: boolean } };
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Form history restoration</title>
<script>window.historyProbe={instance:crypto.randomUUID(),pageshow:[]};addEventListener('pageshow',e=>historyProbe.pageshow.push(e.persisted));</script>
<script type="module">import '/cdn/define/input.js';await customElements.whenDefined('acme-input');await document.querySelector('acme-input').updateComplete;historyProbe.ready=true;</script></head>
<body><form id="form"><label>Native<input id="native" name="native" value="initial-native"></label><label for="custom">Custom</label><acme-input id="custom" name="custom" value="initial-custom"></acme-input></form><a id="away" href="/away">Leave this document</a></body></html>`;
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 0,
  async fetch(request) {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/") return new Response(html, { headers: { "Content-Type": "text/html" } });
    if (pathname === "/away") return new Response("<!doctype html><title>Away</title><h1>Other document</h1>", { headers: { "Content-Type": "text/html" } });
    const file = Bun.file(path.join(root, "dist", pathname));
    return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
  },
});
const results = [];
try {
  for (const engine of ["chromium", "firefox", "webkit"] as const) {
    const browser = await pw[engine].launch({ headless: true, ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
    try {
      const page = await browser.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error: Error) => errors.push(String(error)));
      await page.goto(server.url.href, { waitUntil: "load" });
      await page.waitForFunction(() => (window as HistoryWindow).historyProbe.ready);
      await page.locator("#native").fill("native-typed-history");
      await page.locator("acme-input input").fill("custom-typed-history");
      await page.locator("#native").focus();
      const read = (): Promise<Snapshot> =>
        page.evaluate(() => {
          const probe = (window as HistoryWindow).historyProbe;
          const custom = document.querySelector("acme-input")!;
          return {
            instance: probe.instance,
            pageshow: probe.pageshow,
            navigation: (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type,
            native: document.querySelector<HTMLInputElement>("#native")!.value,
            custom: custom.value,
            inner: custom.shadowRoot!.querySelector("input")!.value,
            form: [...new FormData(document.querySelector("form")!)].map(([name, value]) => [name, String(value)] as [string, string]),
          };
        });
      const before = await read();
      await page.locator("#away").click();
      await page.locator("h1").waitFor();
      await page.goBack({ waitUntil: "load" });
      await page.waitForFunction(() => (window as HistoryWindow).historyProbe.ready && (window as HistoryWindow).historyProbe.pageshow.length > 0);
      const after = await read();
      const retained = before.instance === after.instance;
      const nativeRestored = after.native === before.native;
      const customRestored = after.custom === before.custom && after.inner === before.custom && after.form.some(([name, value]) => name === "custom" && value === before.custom);
      const pass = before.native === "native-typed-history" && before.custom === "custom-typed-history" && nativeRestored && customRestored && errors.length === 0;
      results.push({ engine, version: browser.version(), mode: retained ? "retained-document" : "fresh-document-history-restoration", before, after, nativeRestored, customRestored, errors, pass });
      console.log(engine, JSON.stringify(results.at(-1)));
    } catch (error) {
      results.push({ engine, version: browser.version(), pass: false, error: String(error) });
    } finally {
      await browser.close();
    }
  }
} finally {
  server.stop(true);
}
const entry = Bun.file(path.join(root, "dist/cdn/define/input.js"));
await Bun.write(
  process.env.ACME_HISTORY_RESULTS ?? path.join(import.meta.dir, "history-results.json"),
  JSON.stringify(
    {
      date: new Date().toISOString(),
      bun: Bun.version,
      version: (await Bun.file(path.join(root, "packages/core/package.json")).json()).version,
      entrySha256: createHash("sha256")
        .update(await entry.bytes())
        .digest("hex"),
      method: "Real typed edits, link navigation to another document, then browser history back. No restore callback is invoked by the test.",
      results,
    },
    null,
    2,
  ) + "\n",
);
if (results.length !== 3 || results.some((result) => !result.pass)) process.exitCode = 1;
