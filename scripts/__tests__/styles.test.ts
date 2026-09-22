import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { compileStyle, loadStyleManifest, removeStyle, litStyleModule, partitionStyleSheet, validateRegistrations, verifyStyleManifest, writeStyle } from "../styles";
import { registerStyleProperties } from "../../src/shared/style-properties";

test("channel consumers use full colors and fixed alpha without making palette definitions circular", () => {
  const css = compileStyle(
    ":root{--ds-red-900:hsl(var(--ds-red-900-value));--ring:0 0 1px hsla(var(--ds-red-900-value),.16)}.a{background:hsla(var(--ds-gray-1000-value),.84);color:hsl(var(--ds-red-900-value))}",
    "color-roles.css",
  ).css;
  expect(css).toContain("--ds-red-900: hsl(var(--ds-red-900-value))");
  expect(css).toContain("rgb(from var(--ds-red-900) r g b / .16)");
  expect(css).toContain("rgb(from var(--ds-gray-1000) r g b / .84)");
  expect(css).toContain("color: var(--ds-red-900)");
});

test("font consumers use canonical families and numeric weight tokens without family-as-weight declarations", () => {
  const css = compileStyle(":root{--sans:serif;--mono:monospace}.a{font-family:var(--sans);font-weight:500}.b{font-family:var(--font-mono);font-weight:var(--font-sans)}", "fonts.css").css;
  expect(css).toContain("font-family: var(--acme-font-sans)");
  expect(css).toContain("font-family: var(--acme-font-mono)");
  expect(css).toContain("font-weight: var(--acme-font-weight-500)");
  expect(css).not.toContain("--sans:");
  expect(css).not.toContain("--mono:");
  expect(css).not.toContain("font-weight: var(--acme-font-sans)");
});

test("generated Lit styles attach defaults without registering them during import", async () => {
  const properties = [{ name: "--acme-module-test", syntax: "<length>", inherits: false, initialValue: "2px" }];
  const compiled = compileStyle(":host {width:var(--acme-module-test)}", "probe.css");
  const code = litStyleModule("probeCss", compiled.css, properties, new URL("../../src/shared/style-properties.ts", import.meta.url).href);
  const directory = await mkdtemp(path.join(tmpdir(), "acme-registered-css-"));
  try {
    const file = path.join(directory, "style.mjs");
    await Bun.write(file, code.replace('"lit"', JSON.stringify(new URL("../../node_modules/lit/index.js", import.meta.url).href)));
    const module = await import(file);
    expect(module.probeCss.cssText).toBe(compiled.css);
    const calls: unknown[] = [];
    registerStyleProperties(module.probeCss, {
      registerProperty(property) {
        calls.push(property);
      },
    });
    expect(calls).toEqual(properties);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

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
    for (const input of ["scripts/theme-tokens.ts", "src/shared/theme-tokens.ts", "src/shared/numeric-tokens.ts"])
      await Bun.write(path.join(root, input), await Bun.file(path.join(import.meta.dir, "../..", input)).text());
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
    for (const input of ["scripts/theme-tokens.ts", "src/shared/theme-tokens.ts", "src/shared/numeric-tokens.ts"])
      await Bun.write(path.join(root, input), await Bun.file(path.join(import.meta.dir, "../..", input)).text());
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
    for (const input of ["scripts/theme-tokens.ts", "src/shared/theme-tokens.ts", "src/shared/numeric-tokens.ts"])
      await Bun.write(path.join(root, input), await Bun.file(path.join(import.meta.dir, "../..", input)).text());
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

test("retiring a style removes only its recorded files and protects unrecorded changes", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "acme-retired-style-"));
  try {
    for (const input of ["scripts/styles.ts", "scripts/theme-tokens.ts", "src/shared/theme-tokens.ts", "src/shared/numeric-tokens.ts"])
      await Bun.write(path.join(root, input), await Bun.file(path.join(import.meta.dir, "../..", input)).text());
    const options = { root, producer: "mapped" as const, inputs: [] };
    const retired = writeStyle("shared/retired", ".old{color:red}", options);
    const retained = writeStyle("shared/retained", ".new{color:blue}", options);
    const module = path.join(root, "src/generated/shared/retired.styles.ts");
    const original = await Bun.file(module).text();
    await Bun.write(module, "unrecorded content");
    expect(() => removeStyle("shared/retired", root)).toThrow("unrecorded changes");
    expect(loadStyleManifest(root).entries["shared/retired"]).toBeDefined();
    await Bun.write(module, original);
    removeStyle("shared/retired", root);
    for (const file of Object.keys(retired.files)) expect(await Bun.file(path.join(root, file)).exists()).toBe(false);
    for (const file of Object.keys(retained.files)) expect(await Bun.file(path.join(root, file)).exists()).toBe(true);
    expect(Object.keys(verifyStyleManifest(root).entries)).toEqual(["shared/retained"]);
    expect(() => removeStyle("shared/retired", root)).not.toThrow();
    expect(() => removeStyle("../outside", root)).toThrow("Invalid generated style key");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
