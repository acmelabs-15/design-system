import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { transformTokenDeclaration } from "../token-declarations";

test("removes only imported numeric spacing declarations", () => {
  for (const declaration of ["--geist-space: 4px", "--geist-space-2x: 8px", "--geist-space-0\\.5x: 2px", "--geist-space-negative: -4px", "--geist-space-64x-negative: -256px"]) {
    expect(transformTokenDeclaration(declaration)).toBeUndefined();
  }
  for (const declaration of [
    "--geist-space-small: 32px",
    "--geist-space-small-negative: -32px",
    "--geist-space-gap: 24px",
    "--geist-gap: var(--geist-space-gap)",
    "--geist-form-small-height: var(--geist-space-small)",
    "--geist-space-2xl: 8px",
    "--ds-blue-700: #0070f3",
  ]) {
    expect(transformTokenDeclaration(declaration)).toBe(declaration);
  }
});

test("rewrites positive and signed references into the canonical spacing category", () => {
  expect(transformTokenDeclaration("--quarter: var(--geist-space-2x)")).toBe("--quarter: var(--acme-spacing-2)");
  expect(transformTokenDeclaration("--half-step: var(--geist-space-0\\.5x)")).toBe("--half-step: var(--acme-spacing-0-5)");
  expect(transformTokenDeclaration("--base: var(--geist-space)")).toBe("--base: var(--acme-spacing-1)");
  expect(transformTokenDeclaration("--quarter-negative: var(--geist-space-2x-negative)")).toBe("--quarter-negative: calc(var(--acme-spacing-2) * -1)");
});

test("preserves positive fallbacks and does not rewrite quoted text", () => {
  expect(transformTokenDeclaration("--quarter: var(--geist-space-2x, var(--geist-space))")).toBe("--quarter: var(--acme-spacing-2, var(--acme-spacing-1))");
  const quoted = '--label: "var(--geist-space-2x)"';
  expect(transformTokenDeclaration(quoted)).toBe(quoted);
});

test("rejects unsupported numeric references instead of emitting missing variables", () => {
  expect(() => transformTokenDeclaration("--quarter: var(--geist-space-18x)")).toThrow();
  expect(() => transformTokenDeclaration("--quarter: var(--geist-space-18x-negative)")).toThrow();
  expect(() => transformTokenDeclaration("--quarter: var(--geist-space-2x-negative, inherit)")).toThrow(/negative.*fallback/i);
});

test("the actual token generator retires aliases and emits stable bytes across clock dates", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-token-declarations-"));
  try {
    const tools = path.join(root, "tools/geist");
    fs.mkdirSync(path.join(tools, "corpus/css"), { recursive: true });
    const helper = pathToFileURL(path.resolve(import.meta.dir, "../token-declarations.ts")).href;
    const generator = fs.readFileSync(path.resolve(import.meta.dir, "../vars.ts"), "utf8").replace('"./token-declarations"', JSON.stringify(helper));
    fs.writeFileSync(path.join(tools, "vars.ts"), generator);
    fs.writeFileSync(
      path.join(tools, "tw.ts"),
      'export const sheetOrder=()=>["fixture.css"]; export const allRules=()=>[{at:"",sel:":root",decl:"--geist-space-2x:8px;--geist-space-gap-quarter:var(--geist-space-2x);--geist-space-gap-quarter-negative:var(--geist-space-2x-negative);--geist-space-small:32px;--geist-form-small-height:var(--geist-space-small);--ds-blue-700:#0070f3"}];',
    );
    fs.writeFileSync(path.join(tools, "corpus/css/fixture.css"), "");
    const generate = (date: string) => {
      const script = `const ActualDate=Date;globalThis.Date=class extends ActualDate{constructor(){super(${JSON.stringify(date)});}};await import("./tools/geist/vars.ts");`;
      const child = Bun.spawnSync([process.execPath, "-e", script], { cwd: root });
      expect(child.exitCode).toBe(0);
      expect(child.stderr.toString()).toBe("");
      return fs.readFileSync(path.join(root, "src/generated/theme.css"), "utf8");
    };
    const first = generate("2026-09-20T00:00:00Z");
    expect(generate("2027-01-01T00:00:00Z")).toBe(first);
    expect(first).not.toContain("--acme-space-2x");
    expect(first).toContain("--acme-space-gap-quarter: var(--acme-spacing-2)");
    expect(first).toContain("--acme-space-gap-quarter-negative: calc(var(--acme-spacing-2) * -1)");
    expect(first).toContain("--acme-space-small:32px");
    expect(first).toContain("--acme-form-small-height:var(--acme-space-small)");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
