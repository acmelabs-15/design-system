import assert from "node:assert/strict";
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME to the Playwright runtime directory.");
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const pw = await import(runtime + "/node_modules/playwright/index.mjs");
const base = process.env.ACME_DOCS_URL ?? "http://localhost:4180";
const output = new URL("../../../../.artifacts/m23-docs/navigation.json", import.meta.url).pathname;
const reports = [];
// Playwright's DOM-based role locator does not calculate ariaLabelledByElements.
// Chromium's native accessibility tree verifies the dialog name; every engine
// also verifies the live element relationship and keyboard/focus behavior.
for (const engine of ["chromium", "firefox", "webkit"]) {
  const browser = await pw[engine].launch({
    headless: true,
    ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH
      ? { executablePath: process.env.ACME_CHROMIUM_PATH }
      : {}),
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }),
      errors = [];
    page.setDefaultTimeout(10000);
    await page.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//, route => route.abort());
    page.on("pageerror", (error) => errors.push(String(error)));
    await page.goto(base + "/");
    await page.locator(".docs-page-navigation").waitFor();
    assert.equal(
      await page.locator(".docs-previous").count(),
      0,
      "first page has no previous link",
    );
    assert.equal(await page.locator(".docs-next").count(), 1);
    const last = await page.evaluate(() => window.__docsNav.flatMap((g) => g.items).at(-1).href);
    await page.goto(base + "/" + last);
    await page.locator(".docs-previous").waitFor();
    assert.equal(await page.locator(".docs-next").count(), 0, "last page has no next link");
    const recipe = await page.evaluate(() =>
      window.__docsNav
        .flatMap((group) => group.items)
        .find((item) => item.href.startsWith("recipes/")),
    );
    if (recipe) {
      await page.goto(base + "/" + recipe.href);
      await page.locator("main h1").waitFor();
      assert.equal(await page.locator("main h1").innerText(), recipe.title);
    }
    await page.goto(base + "/components/button");
    await page.locator(".docs-page-navigation").waitFor();
    for (const width of [1280, 768, 320]) {
      await page.setViewportSize({ width, height: 800 });
      await page.evaluate(() =>
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
      );
      await page.waitForTimeout(100);
      const sizes = await page.evaluate(() => {
        const nav = document.querySelector(".docs-page-navigation").getBoundingClientRect();
        const article = document.querySelector("main article").getBoundingClientRect();
        return {
          navBottom: nav.bottom,
          navTop: nav.top,
          articleBottom: article.bottom,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth,
          clearance: parseFloat(getComputedStyle(document.querySelector("main")).paddingBottom),
          navHeight: nav.height,
        };
      });
      assert.ok(Math.abs(sizes.navBottom - 800) < 2, JSON.stringify(sizes));
      assert.ok(
        sizes.articleBottom <= sizes.navTop,
        `content clearance ${width}: ${JSON.stringify(sizes)}`,
      );
      assert.ok(sizes.clearance >= sizes.navHeight, JSON.stringify(sizes));
      assert.ok(
        sizes.scrollWidth <= sizes.innerWidth,
        `horizontal overflow ${width}: ${JSON.stringify(sizes)}`,
      );
    }
    await page.getByRole("button", { name: "Open page navigation", exact: true }).click();
    const dialog = page.locator(".docs-menu").getByRole("dialog");
    await dialog.waitFor();
    const references = await dialog.evaluate((element) => element.ariaLabelledByElements?.length);
    assert.equal(references, 1);
    if (engine === "chromium") {
      const cdp = await page.context().newCDPSession(page);
      const ax = await cdp.send("Accessibility.getFullAXTree");
      assert.ok(
        ax.nodes.some(
          (node) => node.role?.value === "dialog" && node.name?.value === "Documentation pages",
        ),
      );
      await cdp.detach();
    }
    await page.locator(".docs-menu").getByRole("link", { name: "Colors", exact: true }).click();
    await page.waitForURL("**/colors");
    await page.waitForFunction(
      () =>
        document.activeElement?.tagName === "H1" && document.activeElement.textContent === "Colors",
    );
    assert.equal(await dialog.isVisible(), false);
    await page.getByRole("button", { name: "Open page navigation", exact: true }).click();
    await dialog.waitFor();
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector(".docs-menu")?.open);
    await page.waitForFunction(() => document.activeElement?.id === "docs-menu-button");
    await page.evaluate(() => (document.documentElement.style.fontSize = "32px"));
    await page.evaluate(() =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
    );
    await page.waitForTimeout(100);
    const zoom = await page.evaluate(() => ({
      height: document.querySelector(".docs-page-navigation").getBoundingClientRect().height,
      padding: parseFloat(getComputedStyle(document.querySelector("main")).paddingBottom),
      width: document.documentElement.scrollWidth,
      innerWidth,
    }));
    assert.ok(zoom.padding >= zoom.height, JSON.stringify(zoom));
    assert.ok(zoom.width <= zoom.innerWidth, JSON.stringify(zoom));
    assert.equal(errors.length, 0, errors.join("\n"));
    reports.push({ engine, passed: true, widths: [1280, 768, 320], textScale: 2, fonts: "fallback; Google font requests blocked", errors });
    console.log(engine, "navigation PASS");
  } finally {
    await browser.close();
  }
}
await Bun.write(output, JSON.stringify(reports, null, 2));
