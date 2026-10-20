import { expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, realpath } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import config from "../../oxlint.config";
import { runLintCommand } from "../lint-command";

const root = path.resolve(import.meta.dir, "../..");
test("scoped framework exceptions preserve ordinary correctness and messaging checks", async () => {
  const directory = await realpath(await mkdtemp(path.join(os.tmpdir(), "acme-lint-policy-")));
  const fixtures = {
    "src/shared/theme-context.ts": "export function refresh(listeners: Set<() => void>) { for (const listener of [...listeners]) { listener(); } }",
    "src/shared/__tests__/responsive-input.test.ts": "export const positions = [0, , 4];",
    "examples/table/worker-session.ts": "export function send(worker: Worker) { worker.postMessage({value: 1}); }",
    "site/pages/components/code-block.ts": 'export const example = "Hello ${name}";',
    "src/shared/semantic-element.ts": "export class Owner { protected updated() {} }",
    "src/shared/bad-array.ts": "export const positions = [0, , 4];",
    "src/shared/bad-message.ts": "export function send(target: Window) { target.postMessage({value: 1}); }",
    "src/shared/bad-template.ts": 'export const message = "Hello ${name}";',
    "src/shared/incomplete.ts": "export function unfinished() {}",
    "src/shared/bad-branch.ts": "export function choose(value: boolean) { if (value) { return 1; } else if (value) { return 2; } return 3; }",
    "src/shared/bad-eval.ts": "export function execute(source: string) { return eval(source); }",
    "src/shared/bad-variable.ts": "export function choose() { const unused = 1; return 2; }",
  };
  try {
    const configFile = path.join(directory, "oxlint.json");
    await Bun.write(configFile, JSON.stringify(config));
    for (const [file, source] of Object.entries(fixtures)) {
      await mkdir(path.dirname(path.join(directory, file)), { recursive: true });
      await Bun.write(path.join(directory, file), source);
    }
    const resultFile = path.join(directory, "report.json");
    const code = await runLintCommand(path.join(root, "node_modules/oxlint/bin/oxlint"), ["--config", configFile, "--format", "json", ...Object.keys(fixtures)], resultFile, directory);
    expect(code).toBe(1);
    const report = await Bun.file(resultFile).json();
    const diagnostics = (file: string): string[] => report.diagnostics.filter((entry: { filename: string }) => entry.filename === file).map((entry: { code: string }) => entry.code);
    for (const file of Object.keys(fixtures).slice(0, 5)) {
      expect(diagnostics(file)).toEqual([]);
    }
    for (const [file, rule] of [
      ["src/shared/bad-array.ts", "eslint(no-sparse-arrays)"],
      ["src/shared/bad-message.ts", "unicorn(require-post-message-target-origin)"],
      ["src/shared/bad-template.ts", "eslint(no-template-curly-in-string)"],
      ["src/shared/incomplete.ts", "eslint(no-empty-function)"],
      ["src/shared/bad-branch.ts", "eslint(no-dupe-else-if)"],
      ["src/shared/bad-eval.ts", "eslint(no-eval)"],
      ["src/shared/bad-variable.ts", "eslint(no-unused-vars)"],
    ]) {
      expect(diagnostics(file)).toContain(rule);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
