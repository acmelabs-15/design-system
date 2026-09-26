import assert from "node:assert/strict";
import path from "node:path";
import { mkdir } from "node:fs/promises";
const root = path.resolve(import.meta.dir, "../../../.."),
  out = path.join(root, ".artifacts/m24-devtools");
await mkdir(out, { recursive: true });
const built = await Bun.build({
  entrypoints: [path.join(import.meta.dir, "browser-entry.ts")],
  outdir: out,
  target: "browser",
  conditions: ["browser", "development"],
  format: "esm",
  splitting: true,
  naming: { entry: "entry.js", asset: "assets/[name]-[hash].[ext]" },
});
if (!built.success) throw new AggregateError(built.logs);
const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/")
      return new Response(
        '<!doctype html><html><head><link rel="stylesheet" href="/tokens.css"></head><body><script type="module" src="/entry.js"></script></body></html>',
        { headers: { "Content-Type": "text/html" } },
      );
    const file = Bun.file(pathname === "/tokens.css" ? root + "/dist/styles/tokens.css" : out + pathname);
    return (await file.exists()) ? new Response(file) : new Response("Missing", { status: 404 });
  },
});
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME to the installed Playwright runtime");
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const playwright = await import(runtime + "/node_modules/playwright/index.mjs");
const results = [];
try {
  for (const engine of ["chromium", "firefox", "webkit"]) {
    const browser = await playwright[engine].launch({
      headless: true,
      ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH
        ? { executablePath: process.env.ACME_CHROMIUM_PATH }
        : {}),
    });
    const page = await browser.newPage(),
      errors: string[] = [],
      failedRequests: string[] = [],
      outbound: string[] = [],
      checks: string[] = [];
    page.on("pageerror", (error: Error) => (errors.push(String(error)), console.error(engine, String(error))));
    page.on("response", (response: any) => {
      if (response.status() >= 400) failedRequests.push(String(response.status()) + " " + response.url());
    });
    page.on("requestfailed", (request: any) => failedRequests.push(request.url()));
    page.on("request", (request: any) => {
      if (!request.url().startsWith(server.url.origin)) outbound.push(request.url());
    });
    await page.goto(server.url.href, { waitUntil: "domcontentloaded" });
    console.log(engine, "dom ready");
    await page.waitForFunction(() => (window as any).inspection?.snapshot().components.length === 3);
    await page.waitForFunction(() =>
      document.querySelector("[data-acme-inspector]")?.textContent?.includes("Components"),
    );
    assert.equal(await page.evaluate(() => localStorage.length), 0);
    checks.push("root-scoped Lit and React components with no persisted settings");
    const expander = page.locator("[data-acme-inspector] [role=button][aria-expanded]").first();
    const expanded = await expander.getAttribute("aria-expanded");
    await expander.focus();
    await expander.press("Enter");
    assert.notEqual(await expander.getAttribute("aria-expanded"), expanded);
    await expander.press("Enter");
    checks.push("JSON inspection can expand and collapse with the keyboard");
    await page.screenshot({ path: out + "/" + engine + "-desktop.png", fullPage: true });
    await page.setViewportSize({ width: 320, height: 720 });
    await page.screenshot({ path: out + "/" + engine + "-narrow.png", fullPage: true });
    assert(await page.locator("[data-acme-inspector]").isVisible());
    await page.setViewportSize({ width: 1280, height: 720 });
    checks.push("visible desktop and narrow inspector surface");
    const initial = await page.evaluate(() => (window as any).inspection.snapshot());
    assert(!JSON.stringify(initial).includes("outside-secret"));
    assert(!JSON.stringify(initial).includes("hidden-password"));
    assert(
      !(await page
        .locator("[data-acme-inspector]")
        .textContent()
        .then((text: string) => text.includes("hidden-password"))),
    );
    checks.push("secret redaction before snapshots and visible UI");
    assert.match((await page.locator("[data-acme-inspector]").textContent())!, /"form":\s*null/);
    await page.evaluate(() => document.fonts.ready);

    const fonts = await page.evaluate(() =>
      [...document.fonts]
        .filter((font) =>
          ["Inter", "Bricolage Grotesque"].includes(font.family.replaceAll(String.fromCharCode(34), "")),
        )
        .map((font) => ({ family: font.family, status: font.status })),
    );
    assert.equal(fonts.length, 2);
    assert(fonts.every((font: any) => font.status === "loaded"));
    checks.push("packaged runtime preserves null field labels and fonts through rebundling");
    await page.evaluate(() => {
      (window as any).inspection.lit("Lit changed");
      (window as any).inspection.react("React changed");
    });
    await page.waitForFunction(() => {
      const values = (window as any).inspection.snapshot().components.map((entry: any) => entry.inputs.value);
      return values.includes("Lit changed") && values.includes("React changed");
    });
    checks.push("property-only updates in both frameworks");
    await page.evaluate(() => {
      const host = document.querySelector("#lit-input")!;
      for (let index = 0; index < 5; index++)
        host.dispatchEvent(
          new CustomEvent("acme-change", {
            detail: { value: index, token: "hidden-token" },
            bubbles: true,
            composed: true,
          }),
        );
    });
    await page.waitForFunction(() => (window as any).inspection.snapshot().events.length === 3);
    const events = await page.evaluate(() => (window as any).inspection.snapshot().events);
    assert.deepEqual(
      events.map((event: any) => event.detail.value),
      [2, 3, 4],
    );
    assert(events.every((event: any) => event.detail.token === "[redacted]"));
    checks.push("bounded public events retain component identity and redact nested secrets");
    await page.evaluate(() => (window as any).inspection.changeTheme());
    await page.waitForFunction(() =>
      (window as any).inspection
        .snapshot()
        .components.every(
          (entry: any) => entry.theme.appearance === "dark" && /204|cc2200/.test(entry.theme.values["--accent"]),
        ),
    );
    checks.push("external ancestor theme updates effective appearance and token values");
    await page.evaluate(() => (window as any).inspection.removeLit());
    await page.waitForFunction(() => (window as any).inspection.snapshot().components.length === 2);
    await page.evaluate(() => (window as any).inspection.restoreLit());
    await page.waitForFunction(() => (window as any).inspection.snapshot().components.length === 3);
    checks.push("detach and reconnect reattach scoped observation");
    await page.evaluate(() => (window as any).inspection.unmount());
    assert.equal(await page.locator("[data-acme-inspector]").count(), 0);
    await page.evaluate(() => (window as any).inspection.mount());
    await page.waitForFunction(() =>
      document.querySelector("[data-acme-inspector]")?.textContent?.includes("Components"),
    );
    checks.push("UI unmount and remount");
    await page.evaluate(() => (window as any).inspection.dispose());
    assert.equal(await page.locator("[data-acme-inspector]").count(), 0);
    assert.equal(await page.evaluate(() => (window as any).inspection.snapshot().events.length), 0);
    checks.push("dispose removes surface and retained observations");
    const closed = await page.evaluate(() => {
      const tool = (window as any).inspection;
      tool.dispose();
      try {
        tool.mount();
        return false;
      } catch {
        return true;
      }
    });
    assert.equal(closed, true);
    checks.push("disposed inspector rejects remount");
    assert.deepEqual(outbound, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(failedRequests, []);
    checks.push("no outbound requests or browser errors");
    results.push({ engine, checks, errors, failedRequests, outbound });
    console.log(engine, checks.length, "passed");
    await browser.close();
  }
} finally {
  server.stop(true);
  await Bun.write(out + "/results.json", JSON.stringify(results, null, 2));
}
const production = await Bun.build({
  entrypoints: [path.join(import.meta.dir, "production-entry.ts")],
  outdir: path.join(out, "production"),
  target: "browser",
  conditions: ["browser", "production"],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  format: "esm",
  splitting: true,
  minify: true,
  metafile: true,
});
if (!production.success) throw new AggregateError(production.logs);
const productionInputs = Object.keys(production.metafile!.inputs);
const forbidden = productionInputs.filter((input) =>
  /devtools-ui|solid-js|packages\/devtools\/src\/(?:index|inspector|diagnostics|generated)/.test(input),
);
assert.deepEqual(forbidden, []);
assert(!production.outputs.some((output) => /\.(ttf|woff2?)$/.test(output.path)));
await Bun.write(
  path.join(out, "production-result.json"),
  JSON.stringify(
    {
      passed: true,
      inputs: productionInputs.length,
      outputs: production.outputs.length,
      devtoolsOrSolidInputs: forbidden,
      fonts: 0,
    },
    null,
    2,
  ),
);
console.log("production exclusion passed");
