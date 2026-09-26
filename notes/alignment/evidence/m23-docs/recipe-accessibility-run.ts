import assert from "node:assert/strict";

const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME to the Playwright runtime directory.");
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const { chromium } = await import(runtime + "/node_modules/playwright/index.mjs");
const base = process.env.ACME_DOCS_URL ?? "http://localhost:4180";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}),
});
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  await page.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//, route => route.abort());
  const cdp = await page.context().newCDPSession(page);
  const snapshot = async () => (await cdp.send("Accessibility.getFullAXTree")).nodes;
  const property = (node, name) => node.properties?.find(property => property.name === name)?.value?.value;
  await page.goto(base + "/recipes/settings-rows", { waitUntil: "domcontentloaded" });
  await page.locator("acme-switch input").first().waitFor();
  const switches = (await snapshot()).filter(node => node.role?.value === "switch");
  assert.deepEqual(switches.map(node => [node.name?.value, node.description?.value, property(node, "checked")]), [
    ["Email updates", "Receive product news by email.", "true"],
    ["Security alerts", "Receive account security notices.", "true"],
  ]);
  const settings = page.locator('[data-example="settings-rows-account-settings"] > .preview');
  await settings.locator("acme-switch input").first().click();
  await settings.getByRole("button", { name: "Save settings" }).click();
  assert.equal(await settings.locator("output").innerText(), "Saved locally: email off, security on");

  await page.goto(base + "/recipes/results-pagination", { waitUntil: "domcontentloaded" });
  const pagination = page.locator('[data-example="results-pagination-position-and-page-size"] > .preview');
  await pagination.getByRole("combobox").click();
  const nodes = await snapshot();
  const combobox = nodes.find(node => node.role?.value === "combobox");
  assert.equal(combobox.name?.value, "Show");
  assert.equal(combobox.value?.value, "10");
  assert.equal(property(combobox, "expanded"), true);
  const list = nodes.find(node => node.role?.value === "listbox");
  const options = nodes.filter(node => node.role?.value === "option" && node.parentId === list.nodeId);
  assert.deepEqual(options.map(node => [node.name?.value, property(node, "selected")]), [
    ["10", true], ["25", false], ["50", false],
  ]);
  // DOM locators address controls whose semantics are provided by ElementInternals;
  // the native accessibility tree above verifies their actual names and roles.
  await pagination.locator("acme-option").filter({ hasText: "25" }).click();
  await page.waitForFunction(() => {
    const pagination = document.querySelector('[data-example="results-pagination-position-and-page-size"] acme-pagination');
    return pagination?.pageSize === 25 && pagination.page === 1;
  });
  await pagination.getByRole("combobox").click();
  const changedOptions = (await snapshot()).filter(node => node.role?.value === "option");
  assert.equal(property(changedOptions.find(node => node.name?.value === "25"), "selected"), true);
  await page.keyboard.press("Escape");
  const result = { engine: "chromium", oracle: "native Accessibility.getFullAXTree", switches: switches.map(node => ({ name: node.name.value, description: node.description.value })), options: options.map(node => node.name.value), submittedSettings: true, changedPageSize: 25, passed: true };
  await Bun.write(new URL("../../../../.artifacts/m23-docs/recipe-accessibility.json", import.meta.url), JSON.stringify(result, null, 2));
  console.log("Recipe native accessibility and control outcomes PASS");
} finally {
  await browser.close();
}
