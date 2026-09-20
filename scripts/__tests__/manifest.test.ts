import { expect, test } from "bun:test";
import { create, ts } from "@custom-elements-manifest/analyzer";
import type { ClassDeclaration, CustomElement } from "custom-elements-manifest/schema";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { analyzeManifest, normalizeManifest } from "../manifest";
import { LitElement } from "lit";
import * as classes from "../../src/index";

test("the manifest matches every registered Lit class and its runtime property attributes", async () => {
  const { manifest, issues } = await analyzeManifest();
  expect(issues).toEqual([]);
  const elements = manifest.modules
    .flatMap((module) => module.declarations ?? [])
    .filter((declaration): declaration is ClassDeclaration & CustomElement => declaration.kind === "class" && "tagName" in declaration && !!declaration.tagName);
  const registered = (Object.values(classes) as unknown[]).filter(
    (value): value is typeof LitElement => typeof value === "function" && value.prototype instanceof LitElement && !!customElements.getName(value as CustomElementConstructor),
  );
  expect(registered.length).toBeGreaterThan(0);
  expect(elements.map((element) => element.tagName!).sort()).toEqual(registered.map((ctor) => customElements.getName(ctor)!).sort());
  for (const element of elements) {
    expect(element.events?.some((event) => event.name === "type") ?? false).toBe(false);
    for (const member of element.members ?? []) {
      if (member.static || member.privacy === "private" || member.privacy === "protected") continue;
      if (member.kind === "field") expect(member.type?.text).toBeTruthy();
      if (member.kind === "method") expect(member.return?.type?.text).toBeTruthy();
    }
    for (const attribute of element.attributes ?? []) {
      const member = element.members?.find((member) => member.name === attribute.fieldName);
      expect(attribute.type?.text).toBeTruthy();
      if (member?.kind === "field") {
        expect(attribute.type).toEqual(member.type);
        expect(attribute.default).toEqual(member.default);
      }
    }
    const ctor = customElements.get(element.tagName!) as typeof LitElement;
    void ctor.observedAttributes;
    for (const [name, options] of ctor.elementProperties) {
      expect(element.members?.some((member) => member.kind === "field" && member.name === name)).toBe(true);
      const expected = options.attribute === false ? false : typeof options.attribute === "string" ? options.attribute : String(name).toLowerCase();
      expect(element.attributes?.find((attribute) => attribute.fieldName === name)?.name ?? false).toBe(expected);
    }
  }
  for (const tag of ["acme-clearable-input", "acme-search"])
    expect(
      elements
        .find((element) => element.tagName === tag)!
        .events!.map((event) => event.name)
        .sort(),
    ).toEqual(["acme-change", "acme-clear", "acme-input"]);
}, 30000);

test("manifest facts cover conditional events, event variables, slots and forwarded parts", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-manifest-"));
  try {
    fs.mkdirSync(path.join(root, "src"));
    fs.writeFileSync(path.join(root, "package.json"), '{"version":"0.0.0"}');
    fs.writeFileSync(
      path.join(root, "src/probe.ts"),
      [
        'import {LitElement, html} from "lit"; import {customElement,property} from "lit/decorators.js";',
        '@customElement("probe-field") export class Probe extends LitElement {',
        "@property() open=false;",
        'render(){return html`<slot></slot><slot name="label"></slot><span part="content label"></span><child-part exportparts="inner:outer, panel"></child-part>`;}',
        'changed(){this.dispatchEvent(new CustomEvent(this.open ? "acme-open" : "acme-close", {bubbles:true, detail:{kind:"pointer"}}));}',
        'escape(){const event=new CustomEvent("acme-escape", {cancelable:true}); this.dispatchEvent(event);}',
        "}",
      ].join("\n"),
    );
    const { manifest, issues } = await analyzeManifest(root);
    expect(issues).toEqual([]);
    const module = manifest.modules[0];
    expect(module.path).toBe("dist/probe.js");
    const element = module.declarations!.find((d) => d.name === "Probe")! as ClassDeclaration & CustomElement;
    expect(element.slots!.map((s) => s.name).sort()).toEqual(["", "label"]);
    expect(element.cssParts!.map((p) => p.name).sort()).toEqual(["content", "label", "outer", "panel"]);
    expect(element.events!.map((e) => e.name).sort()).toEqual(["acme-close", "acme-escape", "acme-open"]);
    expect(element.events!.find((e) => e.name === "acme-escape")).toMatchObject({ "x-acme-options": { bubbles: false, composed: false, cancelable: true } });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("unresolved local paths fail manifest normalization", () => {
  expect(() =>
    normalizeManifest({
      schemaVersion: "1.0.0",
      modules: [{ kind: "javascript-module", path: "src/probe.ts", exports: [{ kind: "js", name: "Missing", declaration: { name: "Missing", module: "./missing.js" } }] }],
    }),
  ).toThrow("Unresolved local manifest reference");
});

test("the analyzer distinguishes package exports from relative exports with either quote style", () => {
  const code = 'export { LitElement } from "lit";\nexport { html } from \'lit\';\nexport { Local } from "./local.js";';
  const manifest = create({ modules: [ts.createSourceFile("src/exports.ts", code, ts.ScriptTarget.Latest, true)] });
  const exports = manifest.modules[0].exports!;
  expect(exports[0].declaration).toEqual({ name: "LitElement", package: "lit" });
  expect(exports[1].declaration).toEqual({ name: "html", package: "lit" });
  expect(exports[2].declaration).toEqual({ name: "Local", module: "./local.js" });
});

test("Lit default attributes use lowercase names while explicit names stay intact", async () => {
  const { litPlugin } = await import(new URL("../../node_modules/@custom-elements-manifest/analyzer/src/features/framework-plugins/lit/lit.js", import.meta.url).href);
  const code =
    'import {LitElement} from "lit"; import {customElement,property} from "lit/decorators.js"; @customElement("probe-field") export class Probe extends LitElement { static properties={secondaryLabel:{type:String}}; secondaryLabel=""; @property() meterLabel=""; @property({attribute:"explicit-name"}) named=""; }';
  const manifest = create({ modules: [ts.createSourceFile("probe.ts", code, ts.ScriptTarget.Latest, true)], plugins: litPlugin() });
  const declaration = manifest.modules[0].declarations!.find((d) => d.name === "Probe")! as ClassDeclaration & CustomElement;
  expect(declaration.attributes!.map((a) => a.name).sort()).toEqual(["explicit-name", "meterlabel", "secondarylabel"]);
});

test("events dispatched by field callbacks and constructors remain public events", () => {
  const code = 'export class Probe extends HTMLElement { constructor(){super(); this.dispatchEvent(new CustomEvent("ready"));} private changed=()=>this.dispatchEvent(new CustomEvent("change")); }';
  const manifest = create({ modules: [ts.createSourceFile("events.ts", code, ts.ScriptTarget.Latest, true)] });
  const declaration = manifest.modules[0].declarations!.find((d) => d.name === "Probe")! as ClassDeclaration & CustomElement;
  expect(declaration.events!.map((e) => e.name).sort()).toEqual(["change", "ready"]);
});
