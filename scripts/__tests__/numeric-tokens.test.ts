import { afterEach, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { numericTokenCss, verifyTokenManifest, writeTokenManifest } from "../numeric-tokens";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("numeric CSS declares independent spacing and size defaults with no negative aliases", () => {
  const css = numericTokenCss();
  expect(css).toContain("--acme-spacing-0-5: 0.125rem;");
  expect(css).toContain("--acme-size-0-5: 0.125rem;");
  expect(css).toContain("--acme-spacing-2: 0.5rem;");
  expect(css).toContain("--acme-size-96: 24rem;");
  expect(css.match(/--acme-(?:spacing|size)-[\d-]+:/g)).toHaveLength(70);
  expect(css).not.toContain("var(");
  expect(css).not.toContain("negative");
  expect(numericTokenCss()).toBe(css);
});

test("the generated manifest links every public key to its one property, default and source", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-token-manifest-"));
  roots.push(root);
  const file = writeTokenManifest(root);
  const text = fs.readFileSync(file, "utf8");
  const manifest = JSON.parse(text);
  expect(manifest.schemaVersion).toBe(1);
  expect(manifest.tokens).toHaveLength(447);
  expect(new Set(manifest.tokens.map((token: { cssProperty: string }) => token.cssProperty)).size).toBe(447);
  expect(manifest.tokens.find((token: { key: string }) => token.key === "acme-drawer-size")).toMatchObject({
    category: "sizes",
    cssProperty: "--acme-drawer-size",
    source: "src/shared/theme-tokens.ts",
  });
  for (const tier of [4, 5, 6]) {
    expect(manifest.tokens.find((token: { key: string }) => token.key === `acme-shadow-${tier}`)).toMatchObject({ category: "shadows", cssProperty: `--acme-shadow-${tier}` });
  }
  expect(new Set(manifest.tokens.map((token: { category: string }) => token.category)).size).toBe(10);
  expect(manifest.tokens.find((token: { category: string; key: number }) => token.category === "spacing" && token.key === 2)).toMatchObject({
    category: "spacing",
    key: 2,
    cssProperty: "--acme-spacing-2",
    defaultValue: "0.5rem",
    source: "src/shared/numeric-tokens.ts",
  });
  const modified = fs.statSync(file).mtimeMs;
  expect(writeTokenManifest(root)).toBe(file);
  expect(fs.readFileSync(file, "utf8")).toBe(text);
  expect(fs.statSync(file).mtimeMs).toBe(modified);
  expect(verifyTokenManifest(root)).toBe(file);
  fs.writeFileSync(file, JSON.stringify({ ...manifest, tokens: [] }));
  expect(() => verifyTokenManifest(root)).toThrow(/token manifest/);
});
