import path from "node:path";
import fs from "node:fs";
import os from "node:os";
const root = path.resolve(import.meta.dir, "../../../..");
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME");
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(runtime, "browsers");
const pw = await import(path.join(runtime, "node_modules/playwright/index.mjs"));
const manifest = await Bun.file(path.join(root, "dist/custom-elements.json")).json();
const declarations = manifest.modules.flatMap((m: any) => m.declarations ?? []).filter((d: any) => d.tagName && !d.tagName.endsWith("-icon"));
const source = process.env.ACME_AUDIT_SOURCE === "1";
const selected = ["select", "combobox", "multi-select", "menu", "context-menu", "menu-item", "split-button-item", "menu-section", "option", "split-button", "tree-item", "hover-card", "tooltip", "dialog", "alert-dialog", "drawer"];
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "acme-default-audit-"));
if (source) {
  const entry = path.join(scratch, "entry.ts");
  await Bun.write(entry, selected.map((name) => `import ${JSON.stringify(path.join(root, "src/define", name + ".ts"))};`).join("\n") + "\nwindow.ready=true;\n");
  const result = await Bun.build({ entrypoints: [entry], outdir: path.join(scratch, "bundle"), target: "browser", format: "esm", splitting: true });
  if (!result.success) throw new AggregateError(result.logs);
}
const server = Bun.serve({
  port: 0,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/")
      return new Response(source ? '<!doctype html><script type="module" src="/entry.js"></script>' : '<!doctype html><script type="module">import "/cdn/all.js";window.ready=true;</script>', {
        headers: { "Content-Type": "text/html" },
      });
    const file = Bun.file(path.join(source ? path.join(scratch, "bundle") : path.join(root, "dist"), url.pathname));
    return (await file.exists()) ? new Response(file, { headers: { "Content-Type": "text/javascript" } }) : new Response("Not found", { status: 404 });
  },
});
const reports = [];
try {
  for (const engine of ["chromium", "firefox", "webkit"] as const) {
    const browser = await pw[engine].launch(engine === "chromium" ? { ...(process.env.ACME_CHROMIUM_PATH ? {executablePath:process.env.ACME_CHROMIUM_PATH} : {}), headless: true } : { headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(server.url.href);
      await page.waitForFunction(() => (window as any).ready, { timeout: 60000 });
      const results = await page.evaluate(
        async (ds: any[]) => {
          const defaults = [],
            aria = [];
          for (const d of ds) {
            for (const m of d.members ?? []) {
              if (m.kind !== "field" || !m.attribute || m.readonly || m.default === undefined || /undefined|null/.test(m.type?.text ?? "")) continue;
              const el: any = document.createElement(d.tagName);
              const before = el[m.name];
              if (!["string", "number", "boolean"].includes(typeof before)) continue;
              document.body.append(el);
              await el.updateComplete;
              try {
                el.setAttribute(m.attribute, typeof before === "boolean" ? "" : String(before));
                await el.updateComplete;
                el.removeAttribute(m.attribute);
                await el.updateComplete;
                defaults.push({ tag: d.tagName, property: m.name, attribute: m.attribute, before, after: el[m.name], pass: Object.is(before, el[m.name]) });
              } catch (error) {
                defaults.push({ tag: d.tagName, property: m.name, before, pass: false, error: String(error) });
              }
              el.remove();
            }
            const el: any = document.createElement(d.tagName);
            for (const property of ["ariaLabel", "ariaExpanded", "ariaHasPopup", "ariaAutoComplete"]) {
              el[property] = "test";
              el[property] = null;
              aria.push({ tag: d.tagName, property, after: el[property], pass: el[property] === null });
            }
          }
          return { defaults, aria };
        },
        source ? declarations.filter((d: any) => selected.includes(d.tagName.slice(5))) : declarations,
      );
      reports.push({ engine, version: browser.version(), ...results });
      console.log(engine, {
        defaults: results.defaults.length,
        defaultFailures: results.defaults.filter((r: any) => !r.pass),
        aria: results.aria.length,
        ariaFailures: results.aria.filter((r: any) => !r.pass),
      });
    } finally {
      await browser.close();
    }
  }
} finally {
  server.stop(true);
  fs.rmSync(scratch, { recursive: true, force: true });
}
await Bun.write(
  process.env.ACME_AUDIT_RESULTS ?? path.join(import.meta.dir, source ? "defaults-source-results.json" : "defaults-results.json"),
  JSON.stringify({ date: new Date().toISOString(), version: (await Bun.file(path.join(root, "packages/core/package.json")).json()).version, source, reports }, null, 2) + "\n",
);
if (reports.length !== 3 || reports.some((report) => !report.defaults.length || !report.aria.length || [...report.defaults, ...report.aria].some((check) => !check.pass))) process.exitCode = 1;
