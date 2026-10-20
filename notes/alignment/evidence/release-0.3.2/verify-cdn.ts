import assert from "node:assert/strict";
const base = "https://cdn.jsdelivr.net/npm/@acmelabs/design-system-browser@0.3.2/";
const files = ["styles/tokens.css", "dist/define/button.js", "dist/define/badge.js", "dist/define/flow-diagram.js"];
for (const file of files) {
  const response = await fetch(base + file, { redirect: "error", signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, file);
  const packed = Bun.spawnSync(["tar", "-xOf", ".artifacts/publication-release-0.3.2/archives/acmelabs-design-system-browser-0.3.2.tgz", "package/" + file], { stdout: "pipe", stderr: "pipe" });
  assert.equal(packed.exitCode, 0, packed.stderr.toString());
  assert.equal(new Bun.CryptoHasher("sha256").update(await response.arrayBuffer()).digest("hex"), new Bun.CryptoHasher("sha256").update(packed.stdout).digest("hex"), file);
}
const runtime = "/Users/peterkloss/Library/Caches/acme-design-system/browser-checks";
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const pw = await import(runtime + "/node_modules/playwright/index.mjs");
const results = [];
const server = Bun.serve({
  port: 0,
  hostname: "127.0.0.1",
  fetch: () => new Response("<!doctype html><body></body>", { headers: { "Content-Type": "text/html" } }),
});
try {
for (const engine of ["chromium", "firefox", "webkit"]) {
  const browser = await pw[engine].launch({ headless: true, ...(engine === "chromium" ? { executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" } : {}) });
  const errors: string[] = [];
  const warnings: string[] = [];
  const badAssets: string[] = [];
  const requests: string[] = [];
  const pending = new Set<string>();
  const responses: { url: string; status: number }[] = [];
  const failedRequests: { url: string; failure: unknown }[] = [];
  const started = performance.now();
  let phase = "navigation";
  try {
    const page = await browser.newPage();
    page.on("pageerror", (error: Error) => errors.push(String(error)));
    page.on("console", (message: {type(): string; text(): string}) => { if (message.type() === "warning") warnings.push(message.text()); });
    page.on("request", (request: { url(): string }) => { requests.push(request.url()); pending.add(request.url()); });
    page.on("requestfinished", (request: { url(): string }) => pending.delete(request.url()));
    page.on("requestfailed", (request: { url(): string; failure(): unknown }) => {
      pending.delete(request.url());
      failedRequests.push({ url: request.url(), failure: request.failure() });
    });
    page.on("response", (response: { status(): number; url(): string }) => {
      responses.push({ url: response.url(), status: response.status() });
      if (response.status() >= 400) badAssets.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(server.url.href);
    phase = "initial component loading";
    await page.setContent(`<!doctype html>
<link rel="stylesheet" href="${base}styles/tokens.css">
<script type="module">import "${base}dist/define/button.js"; import "${base}dist/define/badge.js";</script>
<acme-button>Deploy</acme-button><acme-badge>Ready</acme-badge>`);
    assert.equal(await page.evaluate(() => document.compatMode), "CSS1Compat", "CDN probe uses standards mode");
    await page.waitForFunction(() => !!document.querySelector("acme-button")?.shadowRoot && !!document.querySelector("acme-badge")?.shadowRoot, null, { timeout: 30000 });
    await page.getByRole("button", { name: "Deploy", exact: true }).click();
    phase = "Flow import";
    await page.evaluate((url: string) => import(url), base + "dist/define/flow-diagram.js");
    assert.equal(requests.filter((url) => /elk-worker/.test(url)).length, 0);
    phase = "Flow layout";
    await page.evaluate(() => {
      const flow = document.createElement("acme-flow-diagram");
      flow.id = "flow";
      flow.nodes = [{ id: "a", label: "Start" }, { id: "b", label: "Finish" }];
      flow.edges = [{ id: "edge", source: "a", target: "b", label: "Next" }];
      document.body.append(flow);
    });
    await page.waitForFunction(() => document.querySelector("#flow")?.shadowRoot?.querySelector("[part=edge]"));
    const workers = page.workers();
    assert.equal(workers.length, 1);
    phase = "worker cleanup";
    const closed = Promise.all(workers.map((worker: { waitForEvent(event: string, options: { timeout: number }): Promise<unknown> }) => worker.waitForEvent("close", { timeout: 10000 })));
    await page.evaluate(() => document.querySelector("#flow")!.remove());
    await closed;
    assert.equal(page.workers().length, 0);
    assert.deepEqual(errors, []);
    assert.deepEqual(warnings, []);
    assert.deepEqual(badAssets, []);
    results.push({ engine, browser: browser.version(), pass: true, elapsedMs: performance.now() - started, flowWorker: requests.find((url) => /elk-worker/.test(url)), workerReleased: true, warnings, requests, responses, failedRequests });
  } catch (error) {
    results.push({ engine, browser: browser.version(), pass: false, elapsedMs: performance.now() - started, phase, error: String(error), errors, warnings, badAssets, pending: [...pending], requests, responses, failedRequests });
  } finally {
    await browser.close();
  }
}
} finally {
  server.stop(true);
}
await Bun.write(".artifacts/release-cdn-0.3.2-verification.json", JSON.stringify({ checkedAt: new Date().toISOString(), version: "0.3.2", filesVerifiedAgainstSignedArchive: files, browsers: results }, null, 2) + "\n");
console.log(JSON.stringify({ verifiedFiles: files.length, browsers: results }));
assert.ok(results.every((result) => result.pass), "Public CDN acceptance failed");
