import { expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { format } from "oxfmt";
import formatter from "../../oxfmt.config";
import { runLintCommand } from "../lint-command";

const root = path.resolve(import.meta.dir, "../..");
test("Bun runs the actual Oxlint preset and returns complete parseable diagnostics", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "acme-lint-"));
  try {
    const fixture = path.join(dir, "invalid.ts");
    await Bun.write(fixture, "export const example = (value: boolean) => { if (value) return 1; else if (value) return 2; return 0; };\n");
    const resultFile = path.join(dir, "report.json");
    await Bun.write(resultFile, "x".repeat(100000));
    const exitCode = await runLintCommand(path.join(root, "node_modules/oxlint/bin/oxlint"), ["--config", path.join(root, "oxlint.config.ts"), "--format", "json", fixture], resultFile, root);
    expect(exitCode).toBe(1);
    const report = await Bun.file(resultFile).json();
    expect(report.number_of_files).toBe(1);
    expect(report.diagnostics.some((diagnostic: { code: string }) => diagnostic.code === "eslint(no-dupe-else-if)")).toBe(true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("the selected formatter preserves Lit text and project conventions", async () => {
  expect(formatter.printWidth).toBe(200);
  expect(formatter.trailingComma).toBe("all");
  expect(formatter.sortImports).toBe(false);
  const source = "const markup=html`<span>two  spaces</span>`;const sheet=css`.a { color: red; }`;";
  const result = await format("fixture.ts", source, formatter);
  expect(result.errors).toEqual([]);
  expect(result.code).toContain("html`<span>two  spaces</span>`");
  expect(result.code).toContain("css`.a { color: red; }`");
  expect((await format("fixture.ts", result.code, formatter)).code).toBe(result.code);
});
