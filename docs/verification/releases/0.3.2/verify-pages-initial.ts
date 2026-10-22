import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

assert.ok(process.env.ACME_RELEASE_COMMIT && process.env.ACME_PAGES_RUN && process.env.ACME_PAGES_ARTIFACT, "Reviewed source and artifact identity are required");
const root = ".artifacts/pages-release-0.3.2/site";
const origin = "https://acmelabs-15.github.io/design-system/";
const output = ".artifacts/pages-release-0.3.2";
const files = fs.readdirSync(root, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => path.relative(root, path.join(entry.parentPath, entry.name)))
  .sort();
const hashes: { path: string; sha256: string }[] = [];
const transientResponses: { path: string; status: number; attempt: number; observedAt: string }[] = [];
async function publicBytes(file: string): Promise<ArrayBuffer> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(new URL(file, origin), { redirect: "error", signal: AbortSignal.timeout(30000) });
    if (response.status === 200) return response.arrayBuffer();
    if (attempt < 3 && [429, 500, 502, 503, 504].includes(response.status)) {
      transientResponses.push({ path: file, status: response.status, attempt: attempt + 1, observedAt: new Date().toISOString() });
      const retryAfter = response.headers.get("retry-after");
      const retryAfterMs = retryAfter ? (/^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.max(0, Date.parse(retryAfter) - Date.now())) : 0;
      assert.ok(!Number.isFinite(retryAfterMs) || retryAfterMs <= 60000, "Server requests a longer backoff; stop and resume later");
      await response.body?.cancel();
      console.log(`Retrying ${file} after HTTP ${response.status}.`);
      await Bun.sleep(Math.max(1000 * 2 ** attempt, Number.isFinite(retryAfterMs) ? retryAfterMs : 0));
      continue;
    }
    assert.equal(response.status, 200, file);
  }
  throw new Error("Public file remains unavailable: " + file);
}
const queue = [...files];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const file = queue.shift()!;
    const actual = new Bun.CryptoHasher("sha256").update(await publicBytes(file)).digest("hex");
    const expected = new Bun.CryptoHasher("sha256").update(await Bun.file(path.join(root, file)).arrayBuffer()).digest("hex");
    assert.equal(actual, expected, `Deployed bytes differ: ${file}`);
    hashes.push({ path: file, sha256: actual });
    if (hashes.length % 1000 === 0) console.log(`Verified ${hashes.length} of ${files.length} deployed files.`);
  }
}));
console.log(`Verified ${hashes.length} deployed files against the reviewed artifact.`);
await Bun.write(output + "/file-verification.json", JSON.stringify({checkedAt:new Date().toISOString(),commit:process.env.ACME_RELEASE_COMMIT,artifactRun:Number(process.env.ACME_PAGES_RUN),artifactId:Number(process.env.ACME_PAGES_ARTIFACT),url:origin,hashes:hashes.sort((a,b)=>a.path.localeCompare(b.path)),transientResponses},null,2)+"\n");

const runtime = "/Users/peterkloss/Library/Caches/acme-design-system/browser-checks";
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const pw = await import(runtime + "/node_modules/playwright/index.mjs");
const results: unknown[] = [];
for (const engine of ["chromium", "firefox", "webkit"]) {
  const browser = await pw[engine].launch({ headless: true, ...(engine === "chromium" ? { executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" } : {}) });
  try {
    for (const route of ["", "components/button", "components/flow-diagram", "recipes/experimental-worker-table"]) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
      const errors: string[] = [], badAssets: string[] = [], warnings: string[] = [];
      page.on("pageerror", (error: Error) => errors.push(String(error)));
      page.on("console", (message: { type(): string; text(): string }) => {
        if (message.type() === "warning") warnings.push(message.text());
      });
      page.on("response", (response: { status(): number; url(): string; request(): { resourceType(): string } }) => {
        if (response.status() >= 400 && response.request().resourceType() !== "document") badAssets.push(`${response.status()} ${response.url()}`);
      });
      try {
        const response = await page.goto(new URL(route, origin).href, { waitUntil: "networkidle" });
        assert.equal(response.status(), route ? 404 : 200, "GitHub Pages deep-link shell status");
        await page.locator("main h1").waitFor();
        const title = await page.locator("main h1").innerText();
        assert.ok(title && title !== "Not found" && title !== "Page unavailable");
        await page.waitForFunction(() => [...document.querySelectorAll("main .preview *")]
          .filter((element) => element.namespaceURI === "http://www.w3.org/1999/xhtml" && element.localName.includes("-"))
          .every((element) => element.matches(":defined")));
        assert.deepEqual(await page.locator("[data-example-error]:not([hidden])").allTextContents(), []);
        assert.deepEqual(errors, []);
        assert.deepEqual(badAssets, []);
        assert.deepEqual(warnings, []);
        if (!route) {
          await page.locator(".docs-side").getByRole("link", { name: "Button", exact: true }).click();
          await page.waitForURL(origin + "components/button");
          await page.locator("main h1").filter({ hasText: /^Button$/ }).waitFor();
          await page.setViewportSize({ width: 390, height: 844 });
          await page.getByRole("button", { name: "Open page navigation", exact: true }).click();
          await page.getByRole("dialog").waitFor({ state: "visible" });
          await page.locator(".docs-menu-links").getByRole("link", { name: "Checkbox", exact: true }).click();
          await page.locator("main h1").filter({ hasText: /^Checkbox$/ }).waitFor();
          await page.getByRole("dialog").waitFor({ state: "hidden" });
          assert.deepEqual(errors, []);
          assert.deepEqual(badAssets, []);
          if (engine === "chromium") await page.screenshot({ path: output + "/mobile.png" });
        }
        if (engine === "chromium" && route === "components/button") await page.screenshot({ path: output + "/button.png" });
        results.push({ engine, browser: browser.version(), route: route || "index", title, pass: true });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  console.log(`${engine}: direct routes, loaded assets and desktop/mobile navigation pass.`);
}
await Bun.write(output + "/public-verification.json", JSON.stringify({
  checkedAt: new Date().toISOString(),
  url: origin,
  commit: process.env.ACME_RELEASE_COMMIT,
  artifactRun: Number(process.env.ACME_PAGES_RUN),
  artifactId: Number(process.env.ACME_PAGES_ARTIFACT),
  hashes: hashes.sort((a, b) => a.path.localeCompare(b.path)),
  transientResponses,
  browsers: results,
  deepLinkHTTPStatus: 404,
  deepLinkExplanation: "GitHub Pages serves the verified 404 shell; the client router renders the requested page.",
}, null, 2) + "\n");
