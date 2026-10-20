import { expect, test } from "bun:test";
import { authoredLintFile, lintFiles } from "../lint-files";
import path from "node:path";

test("source selection excludes generated output but includes its producers and tests", () => {
  for (const file of [
    "src/generated/components/button/button.styles.ts",
    "src/define/button.ts",
    "src/register/button.ts",
    "src/internal/register/example.ts",
    "src/internal/define/example.ts",
    "src/all.ts",
    "packages/react/.build-src/button.ts",
    "packages/react/dist/button.js",
    "tools/geist/corpus/button.ts",
  ]) {
    expect(authoredLintFile(file)).toBe(false);
  }
  for (const file of [
    "src/components/button/button.ts",
    "src/components/button/__tests__/button.test.ts",
    "scripts/styles.ts",
    "styles/components/button/button.css",
    "tools/geist/maps/button.ts",
    "packages/react/src/create-component.ts",
  ]) {
    expect(authoredLintFile(file)).toBe(true);
  }
  const files = lintFiles(path.resolve(import.meta.dir, "../.."));
  expect(files.length).toBeGreaterThan(700);
  expect(files).toContain("scripts/lint.ts");
  expect(files).toContain("site/docs.css");
  expect(files.some((file) => file.startsWith("src/generated/"))).toBe(false);
});

test("CSS template discovery ignores source strings and finds actual tagged templates", async () => {
  const { hasLitCss } = await import("../lint-files");
  expect(hasLitCss('const example = "css`.a { color: red; }`";')).toBe(false);
  expect(hasLitCss("const example = css`.a { color: red; }`;")).toBe(true);
  expect(hasLitCss("const example = html`<style>.a { color: red; }</style>`;")).toBe(false);
});
