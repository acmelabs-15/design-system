import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { repositoryRoot } from "./core-package";
import { prepareRelease, validateRelease } from "./release";
import { requireReleaseRuntime, type ReleaseRecord } from "./release-policy";

export const browserChecks = [
  "notes/alignment/evidence/m22-react/run.ts",
  "notes/alignment/evidence/m22-react/defaults-run.ts",
  "notes/alignment/evidence/m23-docs/pages-run.ts",
  "notes/alignment/evidence/m23-docs/navigation-run.ts",
  "notes/alignment/evidence/m23-docs/recipes-run.ts",
  "notes/alignment/evidence/m23-docs/recipe-accessibility-run.ts",
  "notes/alignment/evidence/m23-docs/video-run.ts",
  "notes/alignment/evidence/m23-docs/copied-run.ts",
  "notes/alignment/evidence/m23-docs/icons-run.ts",
  "src/components/tabs/__tests__/tabs.browser-check.ts",
  "notes/alignment/evidence/m24-consumers/packed-run.ts",
  "notes/alignment/evidence/m24-consumers/package-tools-run.ts",
  "examples/forms/__tests__/managed.browser-check.ts",
  "notes/alignment/evidence/m26-native-forms/history-run.ts",
  "notes/alignment/evidence/m26-audit/removals-run.ts",
  "notes/alignment/evidence/m26-audit/table-patch-run.ts",
  "notes/alignment/evidence/m26-audit/defaults-run.ts",
  "notes/alignment/evidence/m26-scoped/run.ts",
  "notes/alignment/evidence/m26-bundle/run.ts",
  "notes/alignment/evidence/m26-audit/worker-consumer-run.ts",
  "scripts/component-browser-checks.ts",
  "scripts/official-firefox-checks.ts",
] as const;
export type BrowserCheck = { file: string; args: string[]; environment: Record<string, string | undefined> };
export type BrowserCheckResult = { file: string; args: string[]; passed: boolean; exitCode: number | null; error?: string };
export class CheckCommandError extends Error {
  constructor(
    args: string[],
    readonly exitCode: number,
  ) {
    super("Check failed: bun " + args.join(" "));
    this.name = "CheckCommandError";
  }
}
export async function executeBrowserChecks(
  plan: readonly BrowserCheck[],
  execute: (check: BrowserCheck) => Promise<void>,
  save: (results: readonly BrowserCheckResult[], complete: boolean) => Promise<void>,
): Promise<void> {
  if (!plan.length) {
    throw new Error("No browser checks configured");
  }
  const results: BrowserCheckResult[] = [];
  for (const check of plan) {
    try {
      await execute(check);
      results.push({ file: check.file, args: check.args, passed: true, exitCode: 0 });
    } catch (error) {
      results.push({ file: check.file, args: check.args, passed: false, exitCode: error instanceof CheckCommandError ? error.exitCode : null, error: String(error) });
    }
    await save(results, false);
  }
  await save(results, true);
  const failures = results.filter((result) => !result.passed);
  if (failures.length) {
    throw new AggregateError(
      failures.map((result) => new Error(result.file + ": " + result.error)),
      `${failures.length}/${plan.length} browser checks failed`,
    );
  }
}
export function browserCheckPlan(release: ReleaseRecord, consumer: string, runtime: string, root = repositoryRoot): BrowserCheck[] {
  const archives = path.join(root, ".artifacts/release/archives");
  const archive = (name: string) => {
    const entry = release.packages.find((item) => item.name === name);
    if (!entry) {
      throw new Error("Missing reviewed archive: " + name);
    }
    return path.join(archives, entry.filename);
  };
  const core = archive("@acmelabs/design-system");
  const react = archive("@acmelabs/design-system-react");
  const results = path.join(root, ".artifacts/checks");
  const environment = {
    ACME_BROWSER_RUNTIME: runtime,
    ACME_RELEASE_CONSUMER: consumer,
    ACME_REACT_CONSUMER: consumer,
    ACME_AUDIT_SOURCE: "0",
    ACME_SCOPED_SOURCE: "0",
    ACME_SCOPED_RED_IMPERATIVE: "0",
    ACME_SCOPED_PACKAGE: path.join(consumer, "node_modules/@acmelabs/design-system"),
    ACME_SCOPED_WORK: path.join(results, "scoped"),
    ACME_SCOPED_CDN: "0",
    ACME_CORE_ARCHIVE: core,
    ACME_BUNDLE_CONSUMER: undefined,
    ACME_KEEP_BUNDLE_CONSUMER: "0",
    ACME_BUNDLE_VARIANT: "reviewed-release",
    ACME_BUNDLE_RESULTS: path.join(results, "bundle.json"),
    ACME_WORKER_RESULTS: path.join(results, "worker.json"),
    ACME_HISTORY_RESULTS: path.join(results, "history.json"),
    ACME_BUN: process.execPath,
  };
  return browserChecks.flatMap((file): BrowserCheck[] => {
    if (file === "notes/alignment/evidence/m26-scoped/run.ts") {
      return ["module", "cdn"].map((mode) => ({
        file,
        args: [],
        environment: { ...environment, ACME_SCOPED_CDN: mode === "cdn" ? "1" : "0", ACME_SCOPED_RESULTS: path.join(results, "scoped-" + mode + ".json") },
      }));
    }
    const audit = /m26-audit\/(defaults|removals|table-patch)-run\.ts$/.exec(file)?.[1];
    return [
      { file, args: file.endsWith("worker-consumer-run.ts") ? [core, react] : [], environment: { ...environment, ...(audit ? { ACME_AUDIT_RESULTS: path.join(results, audit + ".json") } : {}) } },
    ];
  });
}
export const checkStages = ["static", "build", "types", "unit", "audit", "packages", "install-browsers", "browser", "release"] as const;
export type CheckStage = (typeof checkStages)[number];
const generatedPaths = ["src/generated", "src/define", "src/internal/define", "src/register", "src/internal/register", "src/all.ts", "packages/core/package.json"];
export function generatedChanges(root = repositoryRoot): string[] {
  const result = Bun.spawnSync(["git", "status", "--porcelain=v1", "--untracked-files=all", "--", ...generatedPaths], { cwd: root, stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) {
    throw new Error("Cannot verify generated source: " + result.stderr.toString());
  }
  return result.stdout.toString().split(/\r?\n/).filter(Boolean);
}
export function checkEnvironment(overrides: Record<string, string | undefined> = {}): Record<string, string | undefined> & { PATH: string } {
  const environment = { ...process.env, ...overrides };
  return { ...environment, PATH: path.dirname(process.execPath) + path.delimiter + (environment.PATH ?? "") };
}
async function command(args: string[], cwd = repositoryRoot, env?: Record<string, string | undefined>) {
  const child = Bun.spawn([process.execPath, ...args], {
    cwd,
    env: checkEnvironment(env),
    stdout: "inherit",
    stderr: "inherit",
  });
  const status = await child.exited;
  if (status !== 0) {
    throw new CheckCommandError(args, status);
  }
}
function browserRuntime() {
  const runtime = path.join(repositoryRoot, ".artifacts/browser-runtime"),
    modules = path.join(runtime, "node_modules");
  fs.mkdirSync(runtime, { recursive: true });
  if (!fs.existsSync(modules)) {
    fs.symlinkSync(path.join(repositoryRoot, "node_modules"), modules, "dir");
  }
  if (fs.realpathSync(modules) !== fs.realpathSync(path.join(repositoryRoot, "node_modules"))) {
    throw new Error("Unexpected browser runtime dependency directory");
  }
  return runtime;
}
export async function checkStage(stage: CheckStage) {
  requireReleaseRuntime();
  if (stage === "static") {
    await command(["scripts/lint.ts", "check"]);
    await command(["scripts/lint.ts", "format"]);
  } else if (stage === "build") {
    for (const script of ["split", "build", "docs", "build:tooling"]) {
      await command(["run", script]);
    }
    const changes = generatedChanges();
    if (changes.length) {
      throw new Error("Generated source is stale; review and commit regenerated output:\n" + changes.join("\n"));
    }
  } else if (stage === "types") {
    await command(["node_modules/typescript/bin/tsc", "--noEmit"]);
    await command([
      "node_modules/typescript/bin/tsc",
      "--noEmit",
      "--strict",
      "--experimentalDecorators",
      "--useDefineForClassFields",
      "false",
      "--target",
      "ES2022",
      "--module",
      "ESNext",
      "--moduleResolution",
      "bundler",
      "--skipLibCheck",
      "--types",
      "bun,node",
      "scripts/check.ts",
      ...new Bun.Glob("scripts/release*.ts").scanSync(repositoryRoot),
    ]);
  } else if (stage === "unit") {
    await command(["test"]);
  } else if (stage === "audit") {
    await command(["audit", "--audit-level=high"]);
  } else if (stage === "packages") {
    await prepareRelease();
    await validateRelease(path.join(repositoryRoot, ".artifacts/release"));
  } else if (stage === "install-browsers") {
    const metadata = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "node_modules/playwright/package.json"), "utf8"));
    if (metadata.version !== "1.63.0") {
      throw new Error("Unexpected Playwright version");
    }
    await command(["node_modules/playwright/cli.js", "install", ...(process.platform === "linux" ? ["--with-deps"] : []), "chromium", "firefox", "webkit"], repositoryRoot, {
      PLAYWRIGHT_BROWSERS_PATH: path.join(browserRuntime(), "browsers"),
    });
    await command(["scripts/official-firefox-checks.ts", "install"], repositoryRoot, { ACME_BROWSER_RUNTIME: browserRuntime() });
  } else if (stage === "browser") {
    const release = await validateRelease(path.join(repositoryRoot, ".artifacts/release"));
    const consumer = fs.mkdtempSync(path.join(os.tmpdir(), "acme-ci-consumer-"));
    const runtime = process.env.ACME_BROWSER_RUNTIME ?? browserRuntime();
    const dependencies = Object.fromEntries(release.packages.map((pkg) => [pkg.name, "file:" + path.join(repositoryRoot, ".artifacts/release/archives", pkg.filename)]));
    await Bun.write(
      path.join(consumer, "package.json"),
      JSON.stringify({
        name: "release-acceptance",
        private: true,
        type: "module",
        dependencies: { ...dependencies, react: "19.3.0", "react-dom": "19.3.0", lit: "3.3.3" },
      }),
    );
    const site = path.join(repositoryRoot, "_site");
    let server: Bun.Server<undefined> | undefined;
    try {
      server = Bun.serve({
        hostname: "127.0.0.1",
        port: 4180,
        async fetch(request) {
          const url = new URL(request.url),
            relative = decodeURIComponent(url.pathname).replace(/^\//, "");
          const file = path.resolve(site, relative || "index.html");
          if (file !== site && !file.startsWith(site + path.sep)) {
            return new Response("Invalid path", { status: 400 });
          }
          const asset = Bun.file(file);
          if (await asset.exists()) {
            return new Response(asset);
          }
          if (path.extname(relative)) {
            return new Response("Not found", { status: 404 });
          }
          return new Response(Bun.file(path.join(site, "index.html")), {
            headers: { "Content-Type": "text/html" },
          });
        },
      });
      await command(["install", "--ignore-scripts"], consumer);
      const plan = browserCheckPlan(release, consumer, runtime);
      const report = path.join(repositoryRoot, ".artifacts/checks/browser.json");
      fs.mkdirSync(path.dirname(report), { recursive: true });
      await executeBrowserChecks(
        plan,
        (check) => command([check.file, ...check.args], repositoryRoot, check.environment),
        async (results, complete) => {
          await Bun.write(
            report + ".tmp",
            JSON.stringify({ date: new Date().toISOString(), version: release.version, planned: plan.length, completed: results.length, complete, results }, null, 2) + "\n",
          );
          fs.renameSync(report + ".tmp", report);
        },
      );
    } finally {
      server?.stop(true);
      const saved = path.join(repositoryRoot, ".artifacts/checks/consumer");
      fs.mkdirSync(saved, { recursive: true });
      for (const file of new Bun.Glob("*{results,result}.json").scanSync(consumer)) {
        fs.copyFileSync(path.join(consumer, file), path.join(saved, file));
      }
      fs.rmSync(consumer, { recursive: true, force: true });
    }
  } else if (stage === "release") {
    await command(["scripts/release-smoke.ts"]);
    await command(["scripts/release-trust.ts"]);
  }
}
if (import.meta.main) {
  const stage = process.argv[2];
  if (stage === "--list") {
    console.log(checkStages.join("\n"));
  } else if (stage === "all") {
    for (const item of checkStages) {
      await checkStage(item);
    }
  } else if ((checkStages as readonly string[]).includes(stage)) {
    await checkStage(stage as CheckStage);
  } else {
    throw new Error("Choose a check stage: " + checkStages.join(", "));
  }
}
