import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { browserCheckPlan, CheckCommandError, checkEnvironment, executeBrowserChecks, generatedChanges } from "../check";
import { archiveFilename, releasePackageNames, type ReleaseRecord } from "../release-policy";
import { releaseSource } from "../release";

test("every browser gate runs and records failure before the aggregate verdict", async () => {
  const plan = ["first.ts", "second.ts", "third.ts"].map((file) => ({ file, args: [], environment: {} }));
  const ran: string[] = [];
  const writes: { complete: boolean; results: { file: string; passed: boolean; exitCode: number | null }[] }[] = [];
  await expect(
    executeBrowserChecks(
      plan,
      async (check) => {
        ran.push(check.file);
        if (check.file === "first.ts") {
          throw new CheckCommandError([check.file], 7);
        }
        if (check.file === "third.ts") {
          throw new Error("Browser setup failed");
        }
      },
      async (results, complete) => {
        writes.push({ complete, results: structuredClone([...results]) });
      },
    ),
  ).rejects.toThrow("2/3 browser checks failed");
  expect(ran).toEqual(["first.ts", "second.ts", "third.ts"]);
  expect(writes.map((write) => write.complete)).toEqual([false, false, false, true]);
  expect(writes.at(-1)?.results.map((result) => [result.passed, result.exitCode])).toEqual([
    [false, 7],
    [true, 0],
    [false, null],
  ]);
  await expect(
    executeBrowserChecks(
      [],
      async () => {},
      async () => {},
    ),
  ).rejects.toThrow("No browser checks configured");
});

test("package scripts use the verified parent Bun executable", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "acme-check-runtime-"));
  try {
    fs.writeFileSync(path.join(directory, "package.json"), JSON.stringify({ private: true, scripts: { probe: "bun -e 'console.log(Bun.version)'" } }));
    const child = Bun.spawnSync([process.execPath, "run", "probe"], { cwd: directory, env: checkEnvironment(), stdout: "pipe", stderr: "pipe" });
    expect(child.exitCode).toBe(0);
    expect(child.stdout.toString().trim()).toBe(Bun.version);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("generated verification rejects tracked, staged and untracked output changes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-generated-status-"));
  const git = (...args: string[]) => {
    const result = Bun.spawnSync(["git", "-c", "core.hooksPath=/dev/null", "-c", "commit.gpgSign=false", "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", ...args], {
      cwd: root,
      stdout: "pipe",
      stderr: "pipe",
      env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" },
    });
    expect(result.exitCode).toBe(0);
  };
  try {
    git("init");
    fs.mkdirSync(path.join(root, "src/generated"), { recursive: true });
    fs.mkdirSync(path.join(root, "src/register"), { recursive: true });
    const tracked = path.join(root, "src/generated/existing.ts");
    fs.writeFileSync(tracked, "export const value=1;\n");
    git("add", "src/generated/existing.ts");
    git("commit", "-m", "Fixture baseline");
    expect(generatedChanges(root)).toEqual([]);
    expect(releaseSource(root).sourceTree).toBe("clean");
    fs.writeFileSync(tracked, "export const value=2;\n");
    expect(releaseSource(root).sourceTree).toBe("dirty");
    expect(generatedChanges(root).some((line) => line.includes("src/generated/existing.ts"))).toBe(true);
    fs.writeFileSync(tracked, "export const value=1;\n");
    fs.writeFileSync(path.join(root, "src/register/new.ts"), "export function register() {}\n");
    expect(generatedChanges(root)).toEqual(["?? src/register/new.ts"]);
    expect(releaseSource(root).sourceTree).toBe("dirty");
    git("add", "src/register/new.ts");
    expect(generatedChanges(root)).toEqual(["A  src/register/new.ts"]);
    fs.writeFileSync(path.join(root, "unrelated.md"), "Authored file\n");
    expect(generatedChanges(root)).toHaveLength(1);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("browser gates consume the reviewed package set and both scoped delivery paths", () => {
  const release: ReleaseRecord = {
    schemaVersion: 2,
    version: "0.3.0",
    commit: "a".repeat(40),
    sourceTree: "clean",
    packages: releasePackageNames.map((name) => ({ name, version: "0.3.0", filename: archiveFilename({ name, version: "0.3.0" }), sha512: "a".repeat(128), blockers: [] })),
  };
  const root = path.join(os.tmpdir(), "check-plan-root"),
    consumer = path.join(root, "consumer"),
    runtime = path.join(root, "runtime");
  const plan = browserCheckPlan(release, consumer, runtime, root);
  const scoped = plan.filter((check) => check.file.endsWith("m26-scoped/run.ts"));
  expect(scoped.map((check) => check.environment.ACME_SCOPED_CDN)).toEqual(["0", "1"]);
  expect(scoped.every((check) => check.environment.ACME_SCOPED_PACKAGE === path.join(consumer, "node_modules/@acmelabs/design-system"))).toBe(true);
  expect(new Set(scoped.map((check) => check.environment.ACME_SCOPED_RESULTS)).size).toBe(2);
  const worker = plan.find((check) => check.file.endsWith("worker-consumer-run.ts"))!;
  expect(worker.args).toEqual(release.packages.slice(0, 2).map((pkg) => path.join(root, ".artifacts/release/archives", pkg.filename)));
  const bundle = plan.find((check) => check.file.endsWith("m26-bundle/run.ts"))!;
  expect(bundle.args).toEqual([]);
  expect(bundle.environment.ACME_CORE_ARCHIVE).toBe(worker.args[0]);
  expect(bundle.environment.ACME_BUNDLE_CONSUMER).toBeUndefined();
  for (const check of plan) {
    expect(check.environment.ACME_BROWSER_RUNTIME).toBe(runtime);
    expect(check.environment.ACME_AUDIT_SOURCE).toBe("0");
    expect(check.environment.ACME_SCOPED_SOURCE).toBe("0");
  }
  expect(() => browserCheckPlan({ ...release, packages: [] }, consumer, runtime, root)).toThrow("Missing reviewed archive");
});

test("browser overrides cannot replace the pinned Bun executable search path", () => {
  const environment = checkEnvironment({ PATH: "/untrusted/old-runtime", ACME_BUNDLE_CONSUMER: undefined });
  expect(environment.PATH.split(path.delimiter)[0]).toBe(path.dirname(process.execPath));
  expect(environment.ACME_BUNDLE_CONSUMER).toBeUndefined();
  const child = Bun.spawnSync([process.execPath, "-e", "console.log(JSON.stringify({path:process.env.PATH,consumer:process.env.ACME_BUNDLE_CONSUMER}))"], {
    env: environment,
    stdout: "pipe",
    stderr: "pipe",
  });
  expect(child.exitCode).toBe(0);
  const received = JSON.parse(child.stdout.toString());
  expect(received.path.split(path.delimiter)[0]).toBe(path.dirname(process.execPath));
  expect(received).not.toHaveProperty("consumer");
});
