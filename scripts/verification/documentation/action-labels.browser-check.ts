import type * as Playwright from "playwright";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const output = path.resolve(import.meta.dir, "../../../.artifacts/checks/documentation-action-labels");
await mkdir(output, { recursive: true });
const runtime = process.env.ACME_BROWSER_RUNTIME ?? "/Users/peterkloss/Library/Caches/acme-design-system/browser-checks";
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const engines: typeof Playwright = await import(runtime + "/node_modules/playwright/index.mjs");
const results = [];
for (const name of ["chromium", "firefox", "webkit"] as const) {
  const browser = await engines[name].launch({ headless: true, ...(name === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 1000 }, reducedMotion: "reduce" });
    await page.goto((process.env.ACME_DOCS_URL ?? "http://127.0.0.1:4180") + "/components/forms");
    await page.getByRole("button", { name: "Remove contact 1", exact: true }).first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const appearance of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: appearance });
      await page.waitForTimeout(100);
      const labels = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("main .preview acme-button")]
          .filter((button) => button.textContent?.trim() === "Remove")
          .map((button) => {
            const label = button.shadowRoot!.querySelector<HTMLElement>("[part~=label]")!;
            return {
              owner: button.closest("docs-form-react") ? "react" : "lit",
              text: button.textContent?.trim(),
              clientWidth: label.clientWidth,
              scrollWidth: label.scrollWidth,
              buttonWidth: button.getBoundingClientRect().width,
              labelWidth: label.getBoundingClientRect().width,
            };
          }),
      );
      await page.screenshot({ path: output + "/" + name + "-forms-" + appearance + "-320.png" });
      results.push({ engine: name, appearance, labels, pass: labels.length >= 2 && labels.every((l) => l.clientWidth > 0 && l.scrollWidth <= l.clientWidth + 1) });
    }
  } finally {
    await browser.close();
  }
}
await Bun.write(process.env.ACME_ACTION_LABEL_RESULTS ?? output + "/action-labels.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.some((r) => !r.pass)) {
  process.exitCode = 1;
}
