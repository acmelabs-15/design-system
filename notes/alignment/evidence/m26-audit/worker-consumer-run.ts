import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { recipes } from "../../../../site/recipes";
import { exampleSources } from "../../../../site/example-source";
const root = path.resolve(import.meta.dir, "../../../..");
const bun = process.env.ACME_BUN ?? process.execPath;
const core = path.resolve(process.argv[2]);
const react = path.resolve(process.argv[3]);
const cache = process.env.ACME_BROWSER_RUNTIME ?? process.env.ACME_BROWSER_CACHE;
if (!cache) throw new Error("Set ACME_BROWSER_RUNTIME to the Playwright runtime directory");
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(cache, "browsers");
const pw = await import(path.join(cache, "node_modules/playwright/index.mjs"));
const record = recipes.find((recipe) => recipe.id === "experimental-worker-table")!;
const reports = [];
const run = (cwd: string, args: string[], expected = 0) => {
  const result = Bun.spawnSync([bun, ...args], { cwd, stdout: "pipe", stderr: "pipe" });
  const output = result.stdout.toString() + result.stderr.toString();
  assert.equal(result.exitCode, expected, output);
  return output;
};
for (const example of record.examples) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "acme-worker-consumer-"));
  const files = await exampleSources(example.example, example.exampleId);
  for (const file of files) {
    const target = path.join(directory, file.path ?? file.label);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.code);
  }
  // Combine the separately delivered custom-feature source with the worker application.
  for (const file of ["data.ts", "review-feature.ts"]) fs.copyFileSync(path.join(root, "examples/table", file), path.join(directory, "examples/table", file));
  const dependencies: Record<string, string> = { "@acmelabs/design-system": "file:" + core, "@tanstack/table-core": "9.2.4", "@tanstack/store": "0.11.1" };
  if (example.framework === "lit") Object.assign(dependencies, { lit: "3.3.3", "@tanstack/lit-table": "9.2.4", "@tanstack/lit-store": "0.13.2" });
  else Object.assign(dependencies, { "@acmelabs/design-system-react": "file:" + react, react: "19.3.0", "react-dom": "19.3.0", "@tanstack/react-table": "9.2.4", "@tanstack/react-store": "0.11.1" });
  fs.writeFileSync(
    path.join(directory, "package.json"),
    JSON.stringify(
      { name: "worker-recipe-consumer", private: true, type: "module", dependencies, devDependencies: { typescript: "5.9.3", "@types/react": "19.3.0", "@types/react-dom": "19.3.0" } },
      null,
      2,
    ),
  );
  run(directory, ["install", "--ignore-scripts"]);
  const typeArgs = [
    "node_modules/typescript/bin/tsc",
    "--noEmit",
    "--allowImportingTsExtensions",
    "--strict",
    "--skipLibCheck",
    "--target",
    "es2022",
    "--module",
    "esnext",
    "--moduleResolution",
    "bundler",
    "--experimentalDecorators",
    "--useDefineForClassFields",
    "false",
    "examples/table/data.ts",
    "main.ts",
  ];
  const red = run(directory, typeArgs, 2);
  assert.match(red, /reviewFeature/);
  run(directory, ["examples/table/setup.ts"]);
  run(directory, typeArgs);
  assert.match(run(directory, ["examples/table/setup.ts"]), /already-configured/);
  run(directory, ["examples/table/build-worker.ts"]);
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
  const patchFile = manifest.patchedDependencies["@tanstack/table-core@9.2.4"];
  const patch = fs.readFileSync(path.join(directory, patchFile), "utf8");
  assert.equal(patch.split("\n").filter((line) => line.startsWith("+declare module")).length, 2);
  fs.rmSync(path.join(directory, "node_modules"), { recursive: true, force: true });
  run(directory, ["install", "--ignore-scripts", "--frozen-lockfile"]);
  run(directory, typeArgs);
  assert.match(run(directory, ["examples/table/setup.ts"]), /already-configured/);
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      const url = new URL(req.url);
      const file = Bun.file(path.join(directory, "dist", url.pathname === "/" ? "index.html" : url.pathname));
      return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
    },
  });
  const engines = [];
  try {
    for (const engine of ["chromium", "firefox", "webkit"] as const) {
      const browser = await pw[engine].launch(
        engine === "chromium" ? { ...(process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}), headless: true } : { headless: true },
      );
      try {
        const page = await browser.newPage();
        page.setDefaultTimeout(15000);
        await page.addInitScript(() => {
          const Base = Worker;
          const live = new Set<Worker>();
          (window as any).workerAudit = { live, created: 0 };
          window.Worker = class extends Base {
            constructor(url: string | URL, options?: WorkerOptions) {
              super(url, options);
              live.add(this);
              (window as any).workerAudit.created++;
            }
            terminate() {
              live.delete(this);
              super.terminate();
            }
          };
        });
        const errors: string[] = [];
        page.on("pageerror", (error: Error) => errors.push(String(error)));
        await page.goto(server.url.href);
        const host = `docs-table-worker-${example.framework}`;
        await page.getByRole("status").filter({ hasText: "Worker ready" }).waitFor();
        await page.waitForFunction((tag: string) => {
          const element = document.querySelector(tag)!;
          const scope = element.shadowRoot ?? element;
          return scope.querySelector("[data-count]")?.textContent === "500";
        }, host);
        await page.getByRole("textbox", { name: "Filter worker rows" }).fill("Record 499");
        await page.waitForFunction((tag: string) => {
          const element = document.querySelector(tag)!;
          return (element.shadowRoot ?? element).querySelector("[data-count]")?.textContent === "1";
        }, host);
        await page.getByRole("button", { name: "Fail worker", exact: true }).click();
        await page.getByRole("status").filter({ hasText: "Worker failed" }).waitFor();
        await page.waitForFunction(() => (window as any).workerAudit.live.size === 0);
        await page.getByRole("button", { name: "Retry worker", exact: true }).click();
        await page.getByRole("status").filter({ hasText: "Worker ready" }).waitFor();
        await page.waitForFunction(() => (window as any).workerAudit.live.size === 1);
        await page.getByRole("button", { name: "Use server results", exact: true }).click();
        await page.getByRole("rowheader", { name: "Server result", exact: true }).waitFor();
        assert.equal(await page.evaluate(() => (window as any).workerAudit.live.size), 0);
        await page.locator(host).evaluate((element: Element) => element.remove());
        await page.evaluate((tag: string) => document.body.append(document.createElement(tag)), host);
        await page.waitForFunction((tag: string) => {
          const element = document.querySelector(tag)!;
          return (element.shadowRoot ?? element).querySelector("[data-count]")?.textContent === "500";
        }, host);
        await page.getByRole("textbox", { name: "Filter worker rows" }).fill("Record 1");
        await page.locator(host).evaluate((element: Element) => element.remove());
        await page.waitForFunction(() => (window as any).workerAudit.live.size === 0);
        assert.deepEqual(errors, []);
        engines.push({
          engine,
          version: browser.version(),
          checks: [
            "real worker loads 500 rows",
            "filter returns one row",
            "failure releases worker",
            "retry starts working worker",
            "server data terminates worker",
            "remount starts clean session",
            "removal during filtering releases worker",
            "no page errors",
          ],
          pass: true,
        });
        console.log(example.framework, engine, "pass");
      } finally {
        await browser.close();
      }
    }
  } finally {
    server.stop(true);
  }
  reports.push({ framework: example.framework, directory, sourceFiles: files.map((file) => file.path ?? file.label), red, patch, strictTypesAfterSetup: true, cleanReinstallPasses: true, engines });
}
await Bun.write(process.env.ACME_WORKER_RESULTS ?? path.join(import.meta.dir, "worker-consumer-results.json"), JSON.stringify({ date: new Date().toISOString(), core, react, bun, reports }, null, 2) + "\n");
if (reports.length !== 2 || new Set(reports.map(report => report.framework)).size !== 2 || reports.some(report => report.engines.length !== 3 || report.engines.some(engine => !engine.pass || engine.checks.length !== 8))) process.exitCode = 1;
