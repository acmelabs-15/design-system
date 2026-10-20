import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { browserDistribution } from "../browser-distribution";

const root = path.resolve(import.meta.dir, "../../../..");
const output = process.env.ACME_FLOW_DISTRIBUTIONS_RESULTS ?? path.join(root, ".artifacts/m20-flow/distribution-results.json");
const distribution = browserDistribution(root, process.env.ACME_BROWSER_PACKAGE, process.env.ACME_RELEASE_CONSUMER);
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME");
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(runtime, "browsers");
const pw = await import(path.join(runtime, "node_modules/playwright/index.mjs"));
const serve = async (request: Request) => {
  const route = new URL(request.url).pathname;
  if (route === "/") return new Response("<!doctype html><body></body>", { headers: { "Content-Type": "text/html" } });
  const filename = distribution.file(route);
  if (!filename) return new Response("Not found", { status: 404 });
  const file = Bun.file(filename);
  return (await file.exists())
    ? new Response(file, {
        headers: { "Content-Type": route.endsWith(".js") ? "text/javascript" : route.endsWith(".css") ? "text/css" : "application/octet-stream", "Access-Control-Allow-Origin": "*" },
      })
    : new Response("Not found", { status: 404 });
};
const server = Bun.serve({ port: 0, fetch: serve });
const remote = Bun.serve({ port: 0, fetch: serve });
type Result = { entry: string; cross: boolean; pass: boolean; workerAsset?: string; error?: string; errors: string[]; warnings: string[] };
const reports: { engine: string; checks: Result[] }[] = [];
try {
  for (const engine of ["chromium", "firefox", "webkit"]) {
    const browser = await pw[engine].launch({ headless: true, ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
    const checks: Result[] = [];
    reports.push({ engine, checks });
    try {
      for (const entry of [
        "/dist/define/flow-diagram.js",
        "/dist/all.js",
        "/dist/standalone.js",
        "/bundle/design-system.js",
        "/bundle/design-system.min.js",
        "/bundle/design-system.standalone.min.js",
      ]) {
        for (const cross of [false, true]) {
          const page = await browser.newPage({ reducedMotion: "reduce" });
          const errors: string[] = [],
            warnings: string[] = [],
            requests: string[] = [];
          page.on("pageerror", (error: Error) => errors.push(String(error)));
          page.on("console", (message: { type(): string; text(): string }) => {
            if (message.type() === "warning") warnings.push(message.text());
          });
          page.on("request", (request: { url(): string }) => requests.push(request.url()));
          try {
            await page.goto(server.url.href);
            await page.evaluate((url: string) => import(url), new URL(entry, cross ? remote.url : server.url).href);
            assert.equal(requests.filter((url) => /elk-worker/.test(url)).length, 0);
            await page.evaluate(() => {
              const flow = document.createElement("acme-flow-diagram");
              flow.id = "flow";
              flow.nodes = [
                { id: "a", label: "Start" },
                { id: "b", label: "Finish" },
              ];
              flow.edges = [{ id: "edge", source: "a", target: "b", label: "Next" }];
              document.body.append(flow);
            });
            await page.waitForFunction(() => document.querySelector("#flow")?.shadowRoot?.querySelector("[part=edge]"));
            const workers = page.workers();
            assert.equal(workers.length, 1);
            assert.deepEqual(errors, []);
            const closed = Promise.all(workers.map((worker: { waitForEvent(event: string, options: { timeout: number }): Promise<unknown> }) => worker.waitForEvent("close", { timeout: 10000 })));
            await page.evaluate(() => document.querySelector("#flow")!.remove());
            await closed;
            assert.equal(page.workers().length, 0);
            assert.deepEqual(errors, []);
            assert.deepEqual(warnings, [], "shipped browser distributions must not emit development or lifecycle warnings");
            checks.push({ entry, cross, pass: true, workerAsset: requests.find((url) => /elk-worker/.test(url)), errors, warnings });
            console.log(engine, "PASS", entry, cross ? "cross-origin" : "same-origin");
          } catch (error) {
            checks.push({ entry, cross, pass: false, error: String(error), errors, warnings });
          } finally {
            await page.close();
          }
        }
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  server.stop(true);
  remote.stop(true);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  await Bun.write(output, JSON.stringify(reports, null, 2) + "\n");
}
assert.equal(reports.flatMap((report) => report.checks).filter((check) => !check.pass).length, 0, "Shipped browser distribution checks failed");
