import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root = ".artifacts/pages-release-0.3.2/site";
const origin = "https://acmelabs-15.github.io/design-system/";
const output = ".artifacts/pages-release-0.3.2";
const checkpoint = await Bun.file(output + "/file-verification.json").json();
assert.equal(checkpoint.commit, process.env.ACME_RELEASE_COMMIT);
assert.equal(checkpoint.artifactRun, Number(process.env.ACME_PAGES_RUN));
assert.equal(checkpoint.artifactId, Number(process.env.ACME_PAGES_ARTIFACT));
assert.equal(checkpoint.url, origin);
const hashes = checkpoint.hashes;
const transientResponses = checkpoint.transientResponses;
const files = fs.readdirSync(root, {recursive:true, withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>path.relative(root,path.join(entry.parentPath,entry.name))).sort();
assert.deepEqual(hashes.map(row=>row.path).sort(), files);
const expected = new Map(hashes.map(row=>[row.path,row.sha256]));
for (const file of files) assert.equal(new Bun.CryptoHasher("sha256").update(await Bun.file(path.join(root,file)).arrayBuffer()).digest("hex"), expected.get(file), "Reviewed artifact changed: " + file);
console.log("Preserved public byte verification for " + files.length + " unchanged reviewed files.");
const runtime = "/Users/peterkloss/Library/Caches/acme-design-system/browser-checks";
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const pw = await import(runtime + "/node_modules/playwright/index.mjs");
const results: unknown[] = [];
for (const engine of ["chromium", "firefox", "webkit"]) {
  const browser = await pw[engine].launch({ headless: true, ...(engine === "chromium" && process.env.ACME_TEST_CHROME ? { executablePath: process.env.ACME_TEST_CHROME } : {}) });
  try {
    for (const route of ["", "components/button", "components/flow-diagram", "recipes/experimental-worker-table"]) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
      const errors: string[] = [], badAssets: string[] = [], warnings: string[] = [];
      const pending = new Map<string, {url:string; type:string}>();
      const failedRequests: unknown[] = [];
      const requests: unknown[] = [], responses: unknown[] = [], navigations: string[] = [];
      page.on("request", r => requests.push({url:r.url(),type:r.resourceType()}));
      page.on("response", r => responses.push({url:r.url(),status:r.status()}));
      page.on("framenavigated", f => navigations.push(f.url()));
      page.on("request", (request) => pending.set(request.url(), {url:request.url(),type:request.resourceType()}));
      page.on("requestfinished", (request) => pending.delete(request.url()));
      page.on("requestfailed", (request) => { failedRequests.push({url:request.url(),failure:request.failure()}); pending.delete(request.url()); });
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
        assert.deepEqual(errors, []);
        assert.deepEqual(badAssets, []);
        assert.deepEqual(warnings, []);
        results.push({ engine, browser: browser.version(), route: route || "index", title, pass: true, errors:[...errors], badAssets:[...badAssets], warnings:[...warnings] });
        console.log(`${engine}: ${route || "index"} passes.`);
      } catch (error) {
        await Bun.write(output + "/browser-failure.json", JSON.stringify({checkedAt:new Date().toISOString(),engine,route,error:String(error),errors,badAssets,warnings,pending:[...pending.values()],failedRequests,
        requests,responses,navigations,url:page.url(),state:await Promise.race([
          page.evaluate(()=>({url:location.href,title:document.title,ready:document.readyState,body:document.body?.innerText.slice(0,2000)})),
          new Promise(resolve=>setTimeout(()=>resolve("renderer inspection timed out"),3000))
        ])},null,2)+"\n");
        await page.screenshot({path:output + "/browser-failure.png"});
        throw error;
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
  filesCheckedAt: checkpoint.checkedAt,
  playwrightVersion: (await Bun.file(runtime + "/node_modules/playwright/package.json").json()).version,
  chromiumSource: process.env.ACME_TEST_CHROME || "Playwright bundled chromium-headless-shell",
  fileCheckReusedAfterUnchangedArtifactVerification: true,
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
