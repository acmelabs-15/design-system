import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Browser, Page, BrowserContextOptions } from "playwright";
import type { BunPlugin } from "bun";
import { browserAssetPlugin } from "./browser-assets";
import { repositoryRoot } from "./core-package";

interface ComponentSuite {
  name: string;
  fixture: string;
  source: string;
  sha256: string;
  caseCount: number;
  options: string;
  setup: string;
  body: string;
}
interface Result {
  name: string;
  pass: boolean;
  error?: string;
}
interface ControlDriver {
  name: string;
  fixture: string;
  body: string;
  minimumResults: number;
}
const dataPath = "notes/alignment/evidence/m26-audit/component-browser/cases.json";
const controlPath = "notes/alignment/evidence/m26-audit/component-browser/controls.json";
const specialNames = ["combobox", "number-input", "pin-input", "slider"] as const;
const readSuites = (root: string): ComponentSuite[] => JSON.parse(fs.readFileSync(path.join(root, dataPath), "utf8"));
const readControls = (root: string): ControlDriver[] => JSON.parse(fs.readFileSync(path.join(root, controlPath), "utf8"));

/** Preserve the original fixture markup while selecting the installed compiled runtime. */
export function componentFixtureSource(source: string, fixture: string, root: string, core: string): string {
  const compiled = source
    .replace(/((?:from|import)\s*["'])(\.[^"']+)(["'])/g, (_, before: string, specifier: string, after: string) => {
      const target = path.resolve(path.dirname(fixture), specifier).replace(/\.tsx?$/, "");
      const relative = path.relative(path.join(root, "src"), target);
      if (relative.startsWith("..")) {
        throw new Error("Fixture import leaves src: " + specifier);
      }
      return before + path.join(core, "dist", relative).replace(/\.js$/, "") + ".js" + after;
    })
    .replaceAll("customElements.define(", "registerFixtureElement(customElements, ");
  return `import ${JSON.stringify(path.join(core, "dist/all.js"))};\nimport {registerElement as registerFixtureElement} from ${JSON.stringify(path.join(core, "dist/shared/registration.js"))};\n${compiled}`;
}

/** Missing or newly added fixtures fail the gate rather than silently reducing coverage. */
export function validateComponentSuites(root = repositoryRoot): void {
  const suites = readSuites(root);
  const supplied = [...suites.map((suite) => suite.name), ...specialNames, "tabs"].sort();
  const fixtures = [...new Bun.Glob("src/components/*/__tests__/*.browser.ts").scanSync(root)].map((file) => path.basename(file, ".browser.ts")).sort();
  assert.deepEqual(supplied, fixtures, "Every browser fixture needs a named durable gate");
  for (const suite of suites) {
    assert.equal(suite.fixture, `src/components/${suite.name}/__tests__/${suite.name}.browser.ts`);
    assert.ok(suite.caseCount > 0);
    assert.equal((suite.body.match(/await check\(/g) ?? []).length, suite.caseCount);
    assert.ok(suite.setup.includes("page.goto(server.url.href"));
  }
  assert.deepEqual(
    readControls(root).map((control) => [control.name, control.minimumResults]),
    [
      ["number-input", 45],
      ["pin-input", 33],
      ["slider", 44],
    ],
  );
}

const specialTail = (name: string): string => {
  if (name === "slider") {
    return "";
  }
  if (name === "number-input" || name === "pin-input") {
    const operation = name === "number-input" ? "numberInputSlotRegression" : "pinInputSlotRegression";
    return `\nconst baseline=window.__results;await ${operation}();window.__results={results:[...(baseline?.results??baseline??[]),{name:${JSON.stringify(operation)},ok:true}],error:baseline?.error};`;
  }
  return `
import {html,render} from "lit";
import {repeat} from "lit/directives/repeat.js";
const container=document.createElement("div");document.body.append(container);
const labels={a:"Apple",b:"Banana",c:"Application"};
const paint=(values)=>render(html\`<acme-combobox aria-label="Fruit">\${repeat(values,value=>value,value=>html\`<acme-option value=\${value}>\${labels[value]}</acme-option>\`)}</acme-combobox>\`,container);
paint(["a","b","c"]);await rankedOptionIdentity(container.querySelector("acme-combobox"),paint);
window.__results=[{name:"ranked option identity and keyed removal",ok:true}];`;
};

async function tabKeys(page: Page) {
  await page.setContent('<button id="before">Before</button><button id="after">After</button>');
  await page.locator("#before").focus();
  await page.keyboard.press("Tab");
  if (await page.locator("#after").evaluate((element) => element === document.activeElement)) {
    return { tabKey: "Tab", backTabKey: "Shift+Tab" };
  }
  await page.locator("#before").focus();
  await page.keyboard.press("Alt+Tab");
  assert.equal(await page.locator("#after").evaluate((element) => element === document.activeElement), true, "Native keyboard preference control");
  return { tabKey: "Alt+Tab", backTabKey: "Alt+Shift+Tab" };
}

export async function componentBrowserChecks(root = repositoryRoot): Promise<void> {
  validateComponentSuites(root);
  const runtime = process.env.ACME_BROWSER_RUNTIME;
  if (!runtime) {
    throw new Error("Set ACME_BROWSER_RUNTIME to the Playwright runtime directory");
  }
  const core = process.env.ACME_RELEASE_CONSUMER ? path.join(process.env.ACME_RELEASE_CONSUMER, "node_modules/@acmelabs/design-system") : path.join(root, "packages/core");
  const output = path.join(root, ".artifacts/checks/components");
  const generated = path.join(output, "generated");
  fs.mkdirSync(generated, { recursive: true });
  const all = readSuites(root);
  const controls = readControls(root);
  const filter = process.env.ACME_COMPONENT_SUITES?.split(",");
  for (const name of filter ?? []) {
    if (![...all.map((suite) => suite.name), ...specialNames].includes(name)) {
      throw new Error("Unknown component browser suite: " + name);
    }
  }
  const suites = all.filter((suite) => !filter || filter.includes(suite.name));
  const special = specialNames.filter((name) => !filter || filter.includes(name));
  const entries = [...suites.map((suite) => suite.fixture), ...special.map((name) => `src/components/${name}/__tests__/${name}.browser.ts`)];
  const fixtures = new Map(entries.map((file) => [path.join(root, file), path.basename(file, ".browser.ts")]));
  const plugin: BunPlugin = {
    name: "compiled-component-fixtures",
    setup(build) {
      build.onLoad({ filter: /\.browser\.ts$/ }, async (args) => {
        const name = fixtures.get(args.path);
        if (!name) {
          throw new Error("Unexpected component fixture: " + args.path);
        }
        const original = await Bun.file(args.path).text();
        const extra = controls.find((control) => control.name === name)?.fixture ?? "";
        const text =
          componentFixtureSource(original + "\n" + extra, args.path, root, core) +
          (specialNames.includes(name as (typeof specialNames)[number]) ? specialTail(name) : "") +
          "\nwindow.__fixtureReady=true;";
        return { contents: text, loader: "ts", resolveDir: core };
      });
    },
  };
  if (entries.length) {
    const built = await Bun.build({
      entrypoints: entries.map((file) => path.join(root, file)),
      outdir: path.join(output, "modules"),
      naming: "[name].js",
      target: "browser",
      format: "esm",
      splitting: true,
      plugins: [plugin, browserAssetPlugin(path.join(core, "dist"))],
    });
    if (!built.success) {
      throw new AggregateError(built.logs, "Component browser fixture build failed");
    }
  }
  for (const suite of suites) {
    const destructure = "const {page,p,engine,browser,server,dir,root,checks,check,tabKey,backTabKey}=context;";
    const module = `import assert from "node:assert/strict";\nexport const options=${suite.options};\nexport async function setup(context){${destructure}\n${suite.setup}\n}\nexport async function run(context){${destructure}\n${suite.body}\n}\n`;
    await Bun.write(path.join(generated, suite.name + ".ts"), module);
  }
  for (const control of controls) {
    await Bun.write(
      path.join(generated, control.name + "-driver.ts"),
      `export async function run(context){const {page,p,engine,browser,root,dir,data}=context;const results=data.results;const check=(name,ok)=>results.push({name,ok});\n${control.body}\n}`,
    );
  }
  process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(runtime, "browsers");
  const playwright = await import(path.join(runtime, "node_modules/playwright/index.mjs"));
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      const match = /^\/suite\/([a-z-]+)\/$/.exec(url.pathname);
      if (match && [...suites.map((suite) => suite.name), ...special].includes(match[1])) {
        return new Response(`<!doctype html><link rel="stylesheet" href="/tokens.css"><script type="module" src="/modules/${match[1]}.browser.js"></script>`, {
          headers: { "Content-Type": "text/html" },
        });
      }
      const filePath =
        url.pathname === "/tokens.css"
          ? path.join(core, "dist/styles/tokens.css")
          : url.pathname === "/elk-worker.js"
            ? path.join(core, "dist/shared/elk-worker.js")
            : path.resolve(output, "." + url.pathname);
      if (!filePath.startsWith(output + path.sep) && ![path.join(core, "dist/styles/tokens.css"), path.join(core, "dist/shared/elk-worker.js")].includes(filePath)) {
        return new Response("Invalid path", { status: 400 });
      }
      const file = Bun.file(filePath);
      return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
    },
  });
  const reports: { engine: string; suite: string; results: Result[]; errors: string[] }[] = [];
  try {
    for (const engine of process.env.ACME_COMPONENT_ENGINES?.split(",") ?? ["chromium", "firefox", "webkit"]) {
      const launch = (): Promise<Browser> =>
        playwright[engine].launch({ headless: true, ...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH ? { executablePath: process.env.ACME_CHROMIUM_PATH } : {}) });
      let browser = await launch();
      try {
        for (const name of [...suites.map((suite) => suite.name), ...special]) {
          const suite = suites.find((candidate) => candidate.name === name);
          const module = suite ? await import(pathToFileURL(path.join(generated, name + ".ts")).href) : undefined;
          const results: Result[] = [],
            errors: string[] = [];
          const options: BrowserContextOptions = module?.options ?? { reducedMotion: "reduce", viewport: { width: 1280, height: 900 } };
          let page = await browser.newPage(options);
          page.setDefaultTimeout(12000);
          page.on("pageerror", (error) => errors.push(String(error)));
          const keys = await tabKeys(page);
          const context = {
            page,
            p: page,
            engine,
            browser,
            server: { url: new URL(`suite/${name}/`, server.url) },
            dir: path.join(output, name),
            root,
            checks: results,
            ...keys,
            check: async (_name: string, _run: () => Promise<void>): Promise<void> => {
              throw new Error("Case runner has not been initialized");
            },
          };
          fs.mkdirSync(context.dir, { recursive: true });
          const execute = async (only?: number) => {
            let ordinal = 0;
            context.check = async (label, run) => {
              const index = ordinal++;
              if (only !== undefined && index !== only) {
                return;
              }
              try {
                await module.setup(context);
                await run();
                results.push({ name: label, pass: true });
              } catch (error) {
                results.push({ name: label, pass: false, error: String(error) });
              }
            };
            await module.run(context);
          };
          try {
            if (name === "flow-diagram") {
              // Preserve independent-case evidence for the older patched Firefox runtime.
              for (let index = 0; index < suite!.caseCount; index++) {
                await page.close();
                await browser.close();
                browser = await launch();
                page = await browser.newPage(options);
                page.setDefaultTimeout(12000);
                page.on("pageerror", (error) => errors.push(String(error)));
                Object.assign(context, { page, p: page, browser });
                await execute(index);
              }
            } else if (module) {
              await execute();
            } else {
              await page.goto(context.server.url.href);
              await page.waitForFunction(() => {
                const fixture = window as Window & { __results?: unknown; __fixtureReady?: boolean };
                return fixture.__fixtureReady && fixture.__results !== undefined;
              });
              const initial = await page.evaluate(() => (window as Window & { __results?: { name: string; ok: boolean }[] | { results: { name: string; ok: boolean }[]; error?: string } }).__results!);
              const data = Array.isArray(initial) ? { results: initial, error: undefined } : initial;
              if (data.error) {
                throw new Error(data.error);
              }
              if (controls.some((control) => control.name === name)) {
                const driver = await import(pathToFileURL(path.join(generated, name + "-driver.ts")).href);
                try {
                  await driver.run({ ...context, data });
                  assert.ok(data.results.length >= controls.find((control) => control.name === name)!.minimumResults, "Complete preserved control result count");
                } finally {
                  results.push(...data.results.map((check) => ({ name: check.name, pass: check.ok })));
                }
              } else {
                results.push(...data.results.map((check) => ({ name: check.name, pass: check.ok })));
              }
            }
            if (suite && results.length < suite.caseCount) {
              results.push({ name: "complete named-case coverage", pass: false, error: `Expected at least ${suite.caseCount} cases; received ${results.length}` });
            }
          } catch (error) {
            results.push({ name: "fixture completes", pass: false, error: String(error) });
          } finally {
            await page.close();
          }
          reports.push({ engine, suite: name, results, errors });
          console.log(engine, name, `${results.filter((result) => result.pass).length}/${results.length}`, errors.length ? "page errors" : "");
          await Bun.write(path.join(output, "results.json"), JSON.stringify(reports, null, 2) + "\n");
        }
      } finally {
        await browser.close();
      }
    }
  } finally {
    server.stop(true);
  }
  if (reports.some((report) => report.errors.length || !report.results.length || report.results.some((result) => !result.pass))) {
    throw new Error("Component browser acceptance failed; see .artifacts/checks/components/results.json");
  }
}

if (import.meta.main) {
  await componentBrowserChecks();
}
