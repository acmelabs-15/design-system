import { realpathSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const here = import.meta.dir;
const work = process.env.ACME_SCOPED_WORK ?? "/tmp/acme-m26-scoped";
const packageRoot = process.env.ACME_SCOPED_PACKAGE;
if (!packageRoot) throw new Error("ACME_SCOPED_PACKAGE must name a stable extracted package with dist/.");
const runtime = process.env.ACME_BROWSER_RUNTIME ?? "/Users/peterkloss/Library/Caches/acme-design-system/browser-checks";
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(runtime, "browsers");
const { chromium, firefox, webkit } = await import(path.join(runtime, "node_modules/playwright/index.mjs"));
const manifest = await Bun.file(path.join(packageRoot, "package.json")).json();
const source = process.env.ACME_SCOPED_SOURCE === "1";
const cdn = process.env.ACME_SCOPED_CDN === "1";
const imperativeRed = process.env.ACME_SCOPED_RED_IMPERATIVE === "1";
if (cdn && source) throw new Error("Choose source or CDN delivery, not both.");
const fixtureFile = path.join(here, "fixture.ts");
const fixtureOutput = path.join(work, "bundle/fixture.js");
if (cdn) {
  const input = (await Bun.file(fixtureFile).text()).replace(
    /@acmelabs\/design-system\/(components|register)\/([a-z0-9-]+)/g,
    (_, kind, name) => kind === "register" ? `/cdn/register/${name}.js` : `/cdn/components/${name}/${name}.js`,
  );
  await Bun.write(fixtureOutput, ts.transpileModule(input, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText);
} else {
  const build = await Bun.build({
    entrypoints: [fixtureFile], outdir: path.join(work, "bundle"), target: "browser", format: "esm",
    plugins: [{ name: "installed-core", setup(builder) {
      if (source) builder.onLoad({ filter: /\.ts$/ }, async (args) => {
        let input = await Bun.file(args.path).text();
        if (imperativeRed && /\/(markdown|json-view)\.ts$/.test(args.path)) {
          input = input.replace(/createScopedElement\(this, ("acme-[^"]+")\)/g, "this.ownerDocument.createElement($1)");
        }
        return { contents: ts.transpileModule(input, { compilerOptions: {
          target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, experimentalDecorators: true, useDefineForClassFields: false,
        } }).outputText, loader: "js", resolveDir: path.dirname(args.path) };
      });
      builder.onResolve({ filter: /^@acmelabs\/design-system\/(components|register)\// }, (args) => {
        const name = args.path.split("/").at(-1)!;
        if (args.path.includes("/register/")) return { path: realpathSync(path.join(packageRoot, source ? "src/register" : "dist/register", name + (source ? ".ts" : ".js"))) };
        return { path: realpathSync(path.join(packageRoot, source ? "src/components" : "dist/components", name, name + (source ? ".ts" : ".js"))) };
      });
    } }],
  });
  if (!build.success) throw new Error(String(build.logs));
}
const prior = await Bun.file(path.join(here, "../m05-explicit-style-helper-2026-09-21.json")).json();
const polyfill = prior.browser.reproduction["polyfill.js"];
const bootstrap = prior.browser.reproduction["bootstrap-source.js"].replace("await import('/suite-style.js');", "await import('/fixture.js');");
const server = Bun.serve({ hostname: "127.0.0.1", port: 0, async fetch(req) {
  const route = new URL(req.url).pathname;
  if (route === "/polyfill.js") return new Response(polyfill, { headers: { "content-type": "text/javascript" } });
  if (route === "/bootstrap.js") return new Response(bootstrap, { headers: { "content-type": "text/javascript" } });
  if (route === "/fixture.js") return new Response(Bun.file(fixtureOutput), { headers: { "content-type": "text/javascript" } });
  if (route.startsWith("/cdn/")) {
    const root = path.join(packageRoot, "dist/cdn");
    const file = path.resolve(root, route.slice(5));
    if (!file.startsWith(root + path.sep) || !(await Bun.file(file).exists())) return new Response("Missing browser module", { status: 404 });
    return new Response(Bun.file(file), { headers: { "content-type": "text/javascript" } });
  }
  return new Response('<!doctype html><body><script type="module" src="/bootstrap.js"></script>', { headers: { "content-type": "text/html" } });
} });
const report: any = {
  date: new Date().toISOString(), runtime: Bun.version,
  package: { name: manifest.name, version: manifest.version, path: packageRoot, source, cdn, imperativeRed },
  polyfill: { version: "0.0.10", source: "m05-explicit-style-helper-2026-09-21.json#/browser/reproduction/polyfill.js", sha256: new Bun.CryptoHasher("sha256").update(polyfill).digest("hex") },
  engines: [],
};
try {
  for (const [name, engine] of [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]] as const) {
    const browser = await engine.launch({ headless: true, ...(name === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
    try {
      const page = await browser.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error) => { errors.push(String(error)); console.error(name, String(error)); });
      await page.goto(server.url.href);
      try {
        await page.waitForFunction(() => window.output !== undefined, undefined, { timeout: 30000 });
        report.engines.push({ name, version: browser.version(), errors, ...await page.evaluate(() => window.output) });
      } catch (error) {
        report.engines.push({ name, version: browser.version(), errors, error: String(error), progress: await page.evaluate(() => (window as any).progress) });
      }
    } finally { await browser.close(); }
  }
} finally { server.stop(true); }
const resultName = imperativeRed ? "imperative-red.json" : source ? "source-results.json" : cdn ? "cdn-results.json" : "results.json";
await Bun.write(process.env.ACME_SCOPED_RESULTS ?? path.join(here, resultName), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (report.engines.length !== 3 || report.engines.some((engine: any) => engine.error || engine.errors.length || !Array.isArray(engine.results) || !engine.results.length || engine.results.some((result: any) => result.pass !== true))) {
  process.exitCode = 1;
}
