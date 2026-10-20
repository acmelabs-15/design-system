import assert from "node:assert/strict";
import { mkdir, readFile, rm, symlink } from "node:fs/promises";
import path from "node:path";
import { doc as table } from "../../../../site/pages/components/table";
import { recipes } from "../../../../site/recipes";
import { exampleSources } from "../../../../site/example-source";
const root = path.resolve(import.meta.dir, "../../../.."),
  output = path.join(root, ".artifacts/m24-table-source-isolation");
await mkdir(output, { recursive: true });
const cases = [
  ...table.examples
    .filter((example) => example.code !== undefined)
    .map((example, index) => ({
      name: ["lit", "react", "virtual-lit"][index]!,
      framework: example.h.includes("React") ? "react" : "lit",
      example,
      tag: ["docs-table-lit", "docs-table-react", "docs-table-virtual"][index]!,
    })),
  ...recipes
    .find((recipe) => recipe.id === "virtualized-table")!
    .examples.filter((example) => example.framework === "react")
    .map(({ example }) => ({ name: "virtual-react", framework: "react", example, tag: "docs-table-virtual-react" })),
];
const builds = [];
for (const entry of cases) {
  const directory = path.join(output, entry.name),
    source = path.join(directory, "source"),
    dist = path.join(directory, "dist");
  await rm(directory, { recursive: true, force: true });
  await mkdir(source, { recursive: true });
  try {
    await symlink(path.join(root, "node_modules"), path.join(source, "node_modules"), "dir");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
  const files = await exampleSources(entry.example, entry.name);
  for (const file of files) await Bun.write(path.join(source, file.label), file.code);
  const built = await Bun.build({ entrypoints: [path.join(source, "main.ts")], outdir: dist, target: "browser", format: "esm", splitting: true, metafile: true, naming: { entry: "main.[ext]" } });
  if (!built.success) throw new AggregateError(built.logs);
  const inputs = Object.keys(built.metafile!.inputs);
  const react = inputs.filter((input) => /(?:^|[/\\])(?:react|react-dom|react-reconciler)(?:[/\\]|$)|@tanstack[/\\]react-|design-system-react/.test(input));
  const litAdapters = inputs.filter((input) => /@tanstack[/\\]lit-(?:table|virtual)/.test(input));
  if (entry.framework === "lit") assert.deepEqual(react, []);
  else assert.deepEqual(litAdapters, []);
  assert(!files.some((file) => file.path === "examples/table/docs-entry.ts"));
  const index = (await readFile(path.join(source, "index.html"), "utf8")).replace('src="./main.ts"', 'src="./main.js"');
  await Bun.write(path.join(dist, "index.html"), '<!doctype html><link rel="stylesheet" href="./main.css">' + index);
  builds.push({
    name: entry.name,
    framework: entry.framework,
    tag: entry.tag,
    sourceFiles: files.filter((file) => file.path).map((file) => file.path),
    inputs: inputs.length,
    reactInputs: react.length,
    litAdapterInputs: litAdapters.length,
    sourceIdentity: entry.example.code === (await readFile(path.join(root, entry.example.sourcePath!), "utf8")),
  });
}
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime) throw new Error("Set ACME_BROWSER_RUNTIME");
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const playwright = await import(runtime + "/node_modules/playwright/index.mjs");
const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const url = new URL(request.url),
      [name, ...rest] = url.pathname.slice(1).split("/");
    const file = Bun.file(path.join(output, name!, "dist", rest.join("/") || "index.html"));
    return (await file.exists()) ? new Response(file) : new Response("Missing", { status: 404 });
  },
});
const browsers = [];
try {
  for (const engine of ["chromium", "firefox", "webkit"]) {
    const browser = await playwright[engine].launch({ headless: true, ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
    const checks = [];
    try {
      for (const entry of cases) {
        const page = await browser.newPage(),
          errors: string[] = [];
        page.on("pageerror", (error: Error) => errors.push(String(error)));
        await page.goto(server.url.href + entry.name + "/index.html");
        await page.waitForFunction((tag: string) => {
          const host = document.querySelector(tag);
          const table = host?.shadowRoot?.querySelector("table") ?? host?.querySelector("table");
          return (table?.querySelectorAll("tbody tr").length ?? 0) > 0;
        }, entry.tag);
        const observation = await page.evaluate((tag: string) => {
          const host = document.querySelector(tag)!;
          const table = host.shadowRoot?.querySelector("table") ?? host.querySelector("table");
          return {
            rows: table!.querySelectorAll("tbody tr").length,
            caption: table!.querySelector("caption")?.textContent,
            unknown: [...document.querySelectorAll("acme-h-stack,acme-button")].filter((element) => !customElements.get(element.localName)).map((element) => element.localName),
          };
        }, entry.tag);
        assert(observation.rows > 0);
        assert(observation.caption);
        assert.deepEqual(observation.unknown, []);
        assert.deepEqual(errors, []);
        await page.evaluate((tag: string) => document.querySelector(tag)?.remove(), entry.tag);
        checks.push({ name: entry.name, pass: true, ...observation });
        await page.close();
      }
    } finally {
      await browser.close();
    }
    browsers.push({ engine, checks });
    console.log(engine, "four isolated table examples passed");
  }
} finally {
  server.stop(true);
}
await Bun.write(path.join(output, "results.json"), JSON.stringify({ date: "2026-09-26", builds, browsers }, null, 2));
