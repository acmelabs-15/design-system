import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { compileStyle, litStyleModule, partitionStyleSheet, validateRegistrations, verifyStyleManifest, writeStyle } from "../styles";

test("compiled CSS survives Lit template escaping exactly and maps to its CSS input", async () => {
  const text = '.probe::after { content: "tick: ' + String.fromCharCode(96) + " interpolation: $" + '{name} slash: \\\\ é"; }\n';
  const compiled = compileStyle(text, "components/probe.source.css");
  const code = litStyleModule("probeCss", compiled.css);
  const directory = await mkdtemp(path.join(tmpdir(), "acme-css-module-"));
  try {
    const file = path.join(directory, "style.mjs");
    await Bun.write(file, code.replace('"lit"', JSON.stringify(new URL("../../node_modules/lit/index.js", import.meta.url).href)));
    const module = await import(file);
    expect(module.probeCss.cssText).toBe(compiled.css);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
  expect(JSON.parse(compiled.map).sourcesContent).toEqual([text]);
  expect(JSON.parse(compiled.map).mappings.length).toBeGreaterThan(0);
  expect(compileStyle(text, "components/probe.source.css")).toEqual(compiled);
});

test("invalid CSS stops generation instead of producing a partial artifact", () => {
  expect(() => compileStyle(".x {color: rgb(;}", "invalid.css")).toThrow();
});

test("property definitions are parsed, deduplicated and rejected on conflict", () => {
  const css = '@property --probe { syntax: "<length>"; inherits: false; initial-value: 2px; }';
  const one = compileStyle(css, "one.css");
  const same = compileStyle(css, "two.css");
  const conflict = compileStyle(css.replace("2px", "3px"), "three.css");
  expect(validateRegistrations([one.registrations, same.registrations])).toHaveLength(1);
  expect(() => validateRegistrations([one.registrations, conflict.registrations])).toThrow("--probe");
  expect(one.css).toContain("@property --probe");
});

test("document styles keep their explicit scope", () => {
  const result = compileStyle("[data-scope] > ul { & > li { color: red; } }", "list.css");
  expect(result.css).toContain("[data-scope] > ul > li");
  expect(result.css).not.toContain(":host");
});

test("partitioning retains quoted braces, variables and conditional ownership", () => {
  const source = '.a { --color: var(--tone); content: "}{"; } @media (min-width: 10px) { .a { color: red; } .b { color: blue; } }';
  const parts = partitionStyleSheet(source, (selector) => (selector.startsWith(".a") ? "a" : selector.startsWith(".b") ? "b" : null));
  expect(parts.get("a")).toContain('content: "}{"');
  expect(parts.get("a")).toContain("var(--tone)");
  expect(parts.get("a")).toContain("@media");
  expect(parts.get("a")).not.toContain(".b");
  expect(parts.get("b")).toContain("color: #00f");
  expect(parts.get("b")).not.toContain(".a");
});

test("the manifest rejects changed inputs and tampered outputs, without requiring the external corpus", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "acme-style-manifest-"));
  try {
    await mkdir(path.join(root, "scripts"));
    await Bun.write(path.join(root, "scripts/styles.ts"), await Bun.file(path.join(import.meta.dir, "../styles.ts")).text());
    await Bun.write(path.join(root, "input.css"), ".x { color: red; }");
    await mkdir(path.join(root, "external"), { recursive: true });
    await Bun.write(path.join(root, "external/source.css"), "reference input");
    const options = { root, producer: "house" as const, inputs: ["input.css"], externalInputs: ["external/source.css"] };
    const key = "components/probe/probe";
    writeStyle(key, ".x { color: red; }", options);
    const original = await Bun.file(path.join(root, "src/generated/style-manifest.json")).text();
    writeStyle(key, ".x { color: red; }", options);
    expect(await Bun.file(path.join(root, "src/generated/style-manifest.json")).text()).toBe(original);
    expect(Object.keys(verifyStyleManifest(root).entries)).toEqual([key]);
    await Bun.write(path.join(root, "external/extra.css"), ".added {}");
    expect(() => verifyStyleManifest(root)).toThrow("Changed reference input set");
    await rm(path.join(root, "external/extra.css"));
    await rm(path.join(root, "external/source.css"));
    expect(() => verifyStyleManifest(root)).toThrow("Changed reference input set");
    await rm(path.join(root, "external"), { recursive: true });
    expect(() => verifyStyleManifest(root)).not.toThrow();
    await Bun.write(path.join(root, "src/generated/components/probe/probe.styles.ts"), "tampered");
    expect(() => verifyStyleManifest(root)).toThrow("Stale generated style");
    await mkdir(path.join(root, "external"), { recursive: true });
    await Bun.write(path.join(root, "external/source.css"), "reference input");
    writeStyle(key, ".x { color: red; }", options);
    await Bun.write(path.join(root, "input.css"), ".x { color: blue; }");
    expect(() => verifyStyleManifest(root)).toThrow("input.css");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("invalid CSS and registration conflicts leave previous generated artifacts intact", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "acme-style-atomic-"));
  try {
    await mkdir(path.join(root, "scripts"));
    await Bun.write(path.join(root, "scripts/styles.ts"), await Bun.file(path.join(import.meta.dir, "../styles.ts")).text());
    const options = { root, producer: "mapped" as const, inputs: [], properties: [{ name: "--probe", syntax: "<length>", inherits: false, initialValue: "2px" }] };
    writeStyle("components/first/first", ".x { width: var(--probe); }", options);
    const file = path.join(root, "src/generated/style-manifest.json"),
      before = await Bun.file(file).text();
    expect(() => writeStyle("components/first/first", ".x { color: rgb(; }", options)).toThrow();
    expect(await Bun.file(file).text()).toBe(before);
    expect(() => writeStyle("components/second/second", ".x {}", { ...options, properties: [{ ...options.properties[0], initialValue: "3px" }] })).toThrow("Conflicting CSS registration");
    expect(await Bun.file(path.join(root, "src/generated/components/second/second.styles.ts")).exists()).toBe(false);
    expect(await Bun.file(file).text()).toBe(before);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("family ownership is assigned before the compiler merges equal rules", () => {
  const parts = partitionStyleSheet(".a {color:red}.b {color:red}", (s) => (s.startsWith(".a") ? "a" : "b"));
  expect([...parts.keys()]).toEqual(["a", "b"]);
  expect(parts.get("a")).not.toContain(".b");
  expect(parts.get("b")).toContain(".b");
});

test("nested selectors inherit their outer component family", () => {
  const parts = partitionStyleSheet(".a { @media (min-width:1px) { &:hover {color:red} } } .b {color:blue}", (s) => (s.startsWith(".a") ? "a" : s.startsWith(".b") ? "b" : null));
  expect(parts.get("a")).toContain(".a:hover");
  expect(parts.get("b")).not.toContain(".a");
});

test("constant line-height ratios retain browser precision and original source maps", () => {
  const source = ".x {font-size:.875rem;line-height:calc(1.25 / .875)}";
  const result = compileStyle(source, "ratio.css");
  expect(result.css.replace(/\s/g, "")).toContain("line-height:calc(1.25/.875)");
  expect(JSON.parse(result.map).sourcesContent).toEqual([source]);
  expect(result.css).not.toContain("--acme00000");
});

test("line-height preservation respects nested rules and custom-property values", () => {
  const nested = compileStyle(".x{&:hover{color:red}line-height:calc(1.25/.875)}", "nested.css");
  expect(nested.css.replace(/\s/g, "")).toContain("line-height:calc(1.25/.875)");
  for (const value of ["foo(;line-height:calc(1/.75))", "{;line-height:calc(1/.75)}"]) {
    const result = compileStyle(".x{--x:" + value + ";}", "custom.css");
    expect(result.css).not.toContain("--acme00000");
    expect(result.css).toContain("line-height");
  }
  const variable = compileStyle(".x{line-height:calc(var(--x)/.875)}", "variable.css");
  expect(variable.css.replace(/\s/g, "")).toContain("line-height:calc(var(--x)/.875)");
});

test("an active output lock cannot overwrite the manifest", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "acme-style-lock-"));
  try {
    await mkdir(path.join(root, "scripts"));
    await Bun.write(path.join(root, "scripts/styles.ts"), await Bun.file(path.join(import.meta.dir, "../styles.ts")).text());
    const options = { root, producer: "house" as const, inputs: [] };
    writeStyle("shared/first", ".x{}", options);
    const manifest = path.join(root, "src/generated/style-manifest.json");
    const before = await Bun.file(manifest).text();
    await Bun.write(path.join(root, ".style-write.lock"), "fixture owner");
    expect(() => writeStyle("shared/second", ".y{}", options)).toThrow("Style output is locked");
    expect(await Bun.file(manifest).text()).toBe(before);
    expect(await Bun.file(path.join(root, "src/generated/shared/second.styles.ts")).exists()).toBe(false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
