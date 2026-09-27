import assert from "node:assert/strict";
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME");
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const pw = await import(runtime + "/node_modules/playwright/index.mjs");
type NavigationWindow = Window & { __docsNav: { items: { href: string }[] }[] };
const results = [];
for (const engine of ["chromium", "firefox", "webkit"]) {
  const launch = () => pw[engine].launch({ headless: true, ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
  const isolated = engine === "firefox";
  let browser = await launch();
  let page = await browser.newPage({ reducedMotion: "reduce" });
  const errors: string[] = [];
  const prepare = async () => {
    await page.route("https://fonts.googleapis.com/**", (route: { abort(): Promise<void> }) => route.abort());
    await page.route("https://fonts.gstatic.com/**", (route: { abort(): Promise<void> }) => route.abort());
    page.on("pageerror", (error: Error) => errors.push(String(error)));
  };
  await prepare();
  await page.goto("http://localhost:4180/", { waitUntil: "domcontentloaded" });
  await page.locator("main h1").waitFor();
  const routes = await page.evaluate(() => (window as NavigationWindow).__docsNav.flatMap((group) => group.items).map((item) => item.href));
  assert.ok(routes.length > 0);
  if (isolated) await browser.close();
  for (const route of routes) {
    errors.length = 0;
    if (isolated) {
      browser = await launch();
      page = await browser.newPage({ reducedMotion: "reduce" });
      await prepare();
    }
    try {
      await page.goto("http://localhost:4180/" + (route === "index" ? "" : route), { waitUntil: "domcontentloaded" });
      await page.locator("main h1").waitFor();
      await page.waitForFunction(() => [...document.querySelectorAll(".showcase .preview acme-button")].every((element) => element.shadowRoot));
      const failures = await page.locator("[data-example-error]:not([hidden])").allTextContents();
      const unknown = await page.evaluate(() => [
        ...new Set(
          [...document.querySelectorAll("main .preview *")]
            .filter((element) => element.namespaceURI === "http://www.w3.org/1999/xhtml" && element.localName.includes("-") && !element.matches(":defined"))
            .map((element) => element.localName),
        ),
      ]);
      assert.deepEqual(failures, []);
      assert.deepEqual(unknown, []);
      assert.deepEqual(errors, []);
      results.push({ engine, browser: browser.version(), mode: isolated ? "isolated-render" : "sequential-navigation", route, pass: true });
    } catch (error) {
      results.push({ engine, browser: browser.version(), mode: isolated ? "isolated-render" : "sequential-navigation", route, pass: false, error: String(error), errors: [...errors] });
      console.log(engine, "FAIL", route, String(error));
    } finally {
      if (isolated) await browser.close();
    }
  }
  console.log(engine, isolated ? "isolated render" : "sequential navigation", "checked", routes.length, "pages");
  if (!isolated) await browser.close();
}
await Bun.write(".artifacts/m23-docs/fullsite-results.json", JSON.stringify(results, null, 2));
if (results.some((result) => !result.pass)) process.exitCode = 1;
