import { afterEach, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { transform } from "lightningcss";
import { documentThemeSelector, generateThemeStyles } from "../theme-tokens";

const roots: string[] = [];
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-theme-source-"));
  roots.push(root);
  fs.mkdirSync(path.join(root, "styles"));
  fs.mkdirSync(path.join(root, "src/generated"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "styles/house.css"),
    `
    :root { color-scheme: light; --accent: var(--ds-blue-700); --bg: var(--ds-background-100); --sans: sans-serif; --gap: 24px; --chart-1: red; }
    :root[data-theme="dark"] { color-scheme: dark; }
    :root:has(.subbar) { --bar-h: 103px; }
    .not-a-theme { --accent: orange; padding: 10px; }
  `,
  );
  fs.writeFileSync(
    path.join(root, "src/generated/theme.css"),
    `
    :root { --ds-blue-700: blue; --ds-background-100: white; --acme-form-font: 1rem; }
    :root:where([data-theme="dark"]) { --ds-blue-700: cyan; --ds-background-100: black; --acme-form-font: 1rem; }
    @supports (color: oklch(50% .1 200)) {
      :root { --ds-blue-700: oklch(50% .1 200); }
      :root:where([data-theme="dark"]) { --ds-blue-700: oklch(80% .1 200); }
    }
    @media (color-gamut: p3) {
      @supports (color: oklch(50% .1 200)) { :root:where([data-theme="dark"]) { --ds-blue-700: oklch(85% .2 200); } }
    }
    @media (prefers-color-scheme: dark) { :root:where(:not([data-theme="light"])) { --ds-blue-700: yellow; } }
  `,
  );
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

test("document selector normalization preserves automatic appearance guards and unrelated attributes", () => {
  const normalize = (css: string) => transform({ filename: "document.css", code: Buffer.from(css), visitor: { Selector: documentThemeSelector } }).code.toString();
  const css = normalize(`
    :root[data-theme="dark"] { --a: 1; }
    :root:where([data-theme="light"]) { --a: 2; }
    @media (prefers-color-scheme: dark) { :root:where(:not([data-theme="light"])) { --a: 3; } }
    .application[data-theme="custom"] { --b: 4; }
  `);
  expect(css).toContain(':root[data-acme-appearance="dark"]');
  expect(css).toContain(':root:where([data-acme-appearance="light"])');
  expect(css).toContain(':root:where(:not([data-acme-appearance="light"]))');
  expect(css).toContain("@media (prefers-color-scheme: dark)");
  expect(css).toContain('.application[data-theme="custom"]');
  expect(normalize(css)).toBe(css);
});

test("scope output accepts the normalized internal document appearance selectors", () => {
  const root = fixture();
  const before = generateThemeStyles(root);
  for (const file of ["styles/house.css", "src/generated/theme.css"]) {
    const location = path.join(root, file);
    fs.writeFileSync(location, fs.readFileSync(location, "utf8").replaceAll("data-theme", "data-acme-appearance"));
  }
  expect(generateThemeStyles(root)).toEqual(before);
});

test("appearance output includes changed values and dependent aliases, not invariant inheritance", () => {
  const output = generateThemeStyles(fixture());
  expect(output.appearanceProperties).toEqual(["--accent", "--bg", "--ds-background-100", "--ds-blue-700"]);
  expect(output.appearanceCss).toContain("--accent: var(--ds-blue-700)");
  expect(output.appearanceCss).toContain("color-scheme: dark");
  for (const property of ["--sans", "--gap", "--chart-1", "--acme-form-font", "--acme-spacing-2", "--acme-font-weight-400"]) expect(output.appearanceCss).not.toContain(`${property}:`);
});

test("full reset includes invariant and canonical defaults while ambient document rules stay outside", () => {
  const output = generateThemeStyles(fixture());
  expect(output.fullResetCss).toContain("--sans: sans-serif");
  expect(output.fullResetCss).toContain("--chart-1: red");
  expect(output.fullResetCss).toContain("--acme-spacing-2: .5rem");
  expect(output.fullResetCss).toContain("--acme-size-2: .5rem");
  expect(output.fullResetCss).toContain("--acme-font-weight-550: 550");
  expect(output.css).not.toContain(".not-a-theme");
  expect(output.css).not.toContain(":has(.subbar)");
  expect(output.fullResetCss).not.toContain("--bar-h: 103px");
  expect(output.css).not.toContain("prefers-color-scheme");
  expect(output.css).not.toContain("yellow");
});

test("conditional source order is preserved rather than flattened", () => {
  const output = generateThemeStyles(fixture());
  const css = output.appearanceCss;
  expect(css.indexOf("--ds-blue-700: blue")).toBeLessThan(css.indexOf("--ds-blue-700: cyan"));
  expect(css.indexOf("--ds-blue-700: cyan")).toBeLessThan(css.indexOf("@supports"));
  expect(css.indexOf("@supports")).toBeLessThan(css.indexOf("@media (color-gamut: p3)"));
  expect(css).toContain('data-acme-appearance="dark"');
  expect(css).toContain(":host");
});

test("compact density emits only four role overrides with a normal reset path", () => {
  const output = generateThemeStyles(fixture());
  expect(output.compactCss).toContain('data-acme-density="normal"');
  expect(output.compactCss).toContain('data-acme-density="compact"');
  for (const value of ["--acme-layout-gap-2: .375rem", "--acme-layout-gap-4: .75rem", "--acme-table-padding-block: .3125rem", "--acme-table-padding-inline: .5rem"])
    expect(output.compactCss).toContain(value);
  expect(output.compactCss).not.toContain("--acme-spacing-");
  expect(output.compactCss).not.toContain("font-size");
  expect(output.hooks.compactTargetMinimumPx).toBe(24);
  expect(output.hooks.normalDensitySurfaces).toEqual(["menu", "dialog", "toast"]);
});

test("root output contains the observed weight and density defaults once", () => {
  const output = generateThemeStyles(fixture());
  expect(output.rootCss.match(/--acme-font-weight-\d+:/g)).toHaveLength(6);
  expect(output.rootCss.match(/--acme-(?:layout-gap|table-padding)-[\w]+:/g)).toHaveLength(4);
  expect(output.rootCss).not.toContain("--acme-spacing-");
});

test("generation is deterministic and has no file-writing side effects", () => {
  const root = fixture();
  const before = fs.readFileSync(path.join(root, "src/generated/theme.css"), "utf8");
  expect(generateThemeStyles(root)).toEqual(generateThemeStyles(root));
  expect(fs.readFileSync(path.join(root, "src/generated/theme.css"), "utf8")).toBe(before);
  expect(fs.existsSync(path.join(root, "src/generated/shared"))).toBe(false);
});
