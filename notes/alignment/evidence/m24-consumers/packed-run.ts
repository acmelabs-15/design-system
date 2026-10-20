import assert from "node:assert/strict";
import path from "node:path";
import { mkdir } from "node:fs/promises";
const consumer = process.env.ACME_RELEASE_CONSUMER;
if (!consumer) throw new Error("Set ACME_RELEASE_CONSUMER to the installed archive consumer");
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME to the installed Playwright runtime");
const out = path.join(consumer, "browser");
await mkdir(out, { recursive: true });
await Bun.write(path.join(consumer, "inspector-fixture.ts"), Bun.file(path.join(import.meta.dir, "packed-entry.ts")));
const build = await Bun.build({
  entrypoints: [path.join(consumer, "inspector-fixture.ts")],
  outdir: out,
  target: "browser",
  conditions: ["browser", "development"],
  format: "esm",
  splitting: true,
  naming: { entry: "entry.js" },
  metafile: true,
});
if (!build.success) throw new AggregateError(build.logs);
assert(
  !Object.keys(build.metafile!.inputs).some(
    (file) => file.includes("/Dev/ACMElabs/design-system/src/") || file.includes("/packages/devtools/src/"),
  ),
);
const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/")
      return new Response(
        '<!doctype html><link rel="stylesheet" href="/tokens.css"><script type="module" src="/entry.js"></script>',
        { headers: { "Content-Type": "text/html" } },
      );
    const file = Bun.file(
      pathname === "/tokens.css"
        ? path.join(consumer, "node_modules/@acmelabs/design-system/dist/styles/tokens.css")
        : out + pathname,
    );
    return (await file.exists()) ? new Response(file) : new Response("Missing", { status: 404 });
  },
});
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const playwright = await import(runtime + "/node_modules/playwright/index.mjs");
const results: Record<string, unknown>[] = [];
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
      requests: string[] = [],
      checks: string[] = [];
    page.on("pageerror", (error: Error) => errors.push(String(error)));
    page.on("request", (request: any) => {
      if (!request.url().startsWith(server.url.origin) && !request.url().startsWith("data:"))
        requests.push(request.url());
    });
    page.on("response", (response: any) => {
      if (response.status() >= 400) errors.push(String(response.status()) + " " + response.url());
    });
    const components = page
      .locator("[data-acme-inspector] section")
      .filter({ has: page.getByRole("heading", { name: "Components", exact: true }) });
    const events = page
      .locator("[data-acme-inspector] section")
      .filter({ has: page.getByRole("heading", { name: "Recent public events", exact: true }) });
    const tagCount = async () => ((await components.textContent())?.match(/"tag":\s*"acme-input"/g) ?? []).length;
    const waitCount = async (count: number) => {
      await page.waitForFunction((count: number) => {
        const section = [...document.querySelectorAll("[data-acme-inspector] section")].find(
          (section) => section.querySelector("h3")?.textContent === "Components",
        );
        return (section?.textContent?.match(/"tag":\s*"acme-input"/g) ?? []).length === count;
      }, count);
    };
    try {
      await page.goto(server.url.href, { waitUntil: "domcontentloaded" });
      await waitCount(3);
      assert.equal(await tagCount(), 3);
      checks.push("actual package UI collects three scoped Lit/React/password controls");
      const initial = (await components.textContent())!;
      assert(!initial.includes("outside-secret"));
      assert(!initial.includes("hidden-password"));
      assert(initial.includes("[redacted]"));
      checks.push("outside-root data and password values are absent from UI");
      const expander = components.locator('[role="button"][aria-expanded]').first(),
        expanded = await expander.getAttribute("aria-expanded");
      await expander.focus();
      await expander.press("Enter");
      assert.notEqual(await expander.getAttribute("aria-expanded"), expanded);
      await expander.press("Enter");
      checks.push("keyboard expansion and collapse");
      assert.match((await components.textContent())!, /"form":\s*null/);
      await page.evaluate(() => document.fonts.ready);
      const fonts = await page.evaluate(() =>
        [...document.fonts]
          .filter((font) => ["Inter", "Bricolage Grotesque"].includes(font.family.replaceAll('"', "")))
          .map((font) => font.status),
      );
      assert.deepEqual(fonts, ["loaded", "loaded"]);
      checks.push("corrected null labels and embedded fonts survive downstream bundling");
      await page.screenshot({ path: path.join(out, engine + "-packed-desktop.png"), fullPage: true });
      await page.setViewportSize({ width: 320, height: 720 });
      assert(await components.isVisible());
      await page.screenshot({ path: path.join(out, engine + "-packed-narrow.png"), fullPage: true });
      await page.setViewportSize({ width: 1280, height: 720 });
      checks.push("desktop and narrow surface");
      await page.evaluate(() => {
        (window as any).inspection.lit("Lit changed");
        (window as any).inspection.react("React changed");
      });
      await page.waitForFunction(() => {
        const text = document.querySelector("[data-acme-inspector]")?.textContent;
        return text?.includes("Lit changed") && text.includes("React changed");
      });
      checks.push("actual inspector UI observes property-only updates in both frameworks");
      const firstId = /"id":\s*(\d+)/.exec((await components.textContent())!)![1];
      await page.evaluate(() => {
        for (let index = 0; index < 5; index++)
          document
            .querySelector("#lit-input")!
            .dispatchEvent(
              new CustomEvent("acme-change", {
                detail: { value: index, token: "hidden-token" },
                bubbles: true,
                composed: true,
              }),
            );
      });
      await page.waitForFunction(() =>
        document.querySelector("[data-acme-inspector]")?.textContent?.includes('"componentId"'),
      );
      const eventText = (await events.textContent())!;
      assert.deepEqual(
        [...eventText.matchAll(/"value":\s*(\d+)/g)].map((match) => Number(match[1])),
        [2, 3, 4],
      );
      assert(!eventText.includes("hidden-token"));
      assert([...eventText.matchAll(/"componentId":\s*(\d+)/g)].every((match) => match[1] === firstId));
      checks.push("UI retains exactly the last three public events with correlated identity and redaction");
      await page.evaluate(() => (window as any).inspection.changeTheme());
      await page.waitForFunction(() => {
        const section = [...document.querySelectorAll("[data-acme-inspector] section")].find(
          (section) => section.querySelector("h3")?.textContent === "Components",
        );
        return (section?.textContent?.match(/"appearance":\s*"dark"/g) ?? []).length === 3;
      });
      for (let attempt = 0; attempt < 4; attempt++) {
        const collapsed = components.locator('[role="button"][aria-expanded="false"]');
        const count = await collapsed.count();
        if (!count) break;
        for (let index = count - 1; index >= 0; index--) await collapsed.nth(index).click();
      }
      assert.match((await components.textContent())!, /"--accent":\s*"(?:rgb\(204,\s*34,\s*0\)|#cc2200)"/);
      checks.push("actual UI updates external ancestor theme appearance and computed accent");
      await page.evaluate(() => (window as any).inspection.removeLit());
      await waitCount(2);
      await page.evaluate(() => (window as any).inspection.restoreLit());
      await waitCount(3);
      checks.push("detach and reconnect update actual collected components");
      await page.evaluate(() => (window as any).inspection.unmount());
      assert.equal(await page.locator("[data-acme-inspector]").count(), 0);
      await page.evaluate(() => (window as any).inspection.mount());
      await waitCount(3);
      checks.push("public unmount and remount");
      await page.evaluate(() => (window as any).inspection.dispose());
      assert.equal(await page.locator("[data-acme-inspector]").count(), 0);
      assert(
        await page.evaluate(() => {
          try {
            (window as any).inspection.mount();
            return false;
          } catch {
            return true;
          }
        }),
      );
      checks.push("public dispose removes UI and rejects remount");
      assert.equal(await page.evaluate(() => localStorage.length), 0);
      checks.push("no persistent settings");
      assert.deepEqual(errors, []);
      assert.deepEqual(requests, []);
      checks.push("no browser errors, failed assets or outbound requests");
      results.push({ engine, pass: true, checks, errors, requests });
      console.log(engine, checks.length, "packed checks passed");
    } catch (error) {
      results.push({ engine, pass: false, checks, errors, requests, failure: String(error) });
      console.error(engine, String(error));
    } finally {
      await browser.close();
    }
  }
} finally {
  server.stop(true);
  await Bun.write(path.join(consumer, "inspector-results.json"), JSON.stringify(results, null, 2));
}
await Bun.write(
  path.join(consumer, "production.ts"),
  'import "@acmelabs/design-system/define/input"; if(process.env.NODE_ENV === "development") import("@acmelabs/design-system-devtools"); document.body.dataset.ready="yes";',
);
const production = await Bun.build({
  entrypoints: [path.join(consumer, "production.ts")],
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
const forbidden = Object.keys(production.metafile!.inputs).filter((file) =>
  /design-system-devtools|devtools-ui|solid-js/.test(file),
);
assert.deepEqual(forbidden, []);
assert(!production.outputs.some((output) => /\.(ttf|woff2?)$/.test(output.path)));
await Bun.write(
  path.join(consumer, "production-result.json"),
  JSON.stringify({ pass: true, inputs: Object.keys(production.metafile!.inputs).length, forbidden, fonts: 0 }, null, 2),
);
if (results.some((result) => !result.pass)) process.exitCode = 1;
