import { corePackageDirectory, corePackageManifestPath } from "../core-package";
import "../../src/all";
import "../../src/generated/icons/all";
import { expect, test } from "bun:test";
import { create, ts } from "@custom-elements-manifest/analyzer";
import type { ClassDeclaration, CustomElement } from "custom-elements-manifest/schema";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { writeEntries } from "../entries";
import { apiFromManifest } from "../../site/api";
import { analyzeManifest, normalizeManifest } from "../manifest";
import { LitElement } from "lit";
import * as classes from "../../src/index";
import * as iconClasses from "../../src/generated/icons/index";
import { commonStyleInputSchema } from "../../src/shared/style-input-schema";

test("store-backed public properties retain manifest defaults and inherited attribute metadata", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-public-state-manifest-"));
  const repository = path.resolve(import.meta.dir, "../..");
  try {
    fs.mkdirSync(path.join(root, "src/shared"), { recursive: true });
    fs.symlinkSync(path.join(repository, "node_modules"), path.join(root, "node_modules"), "dir");
    fs.mkdirSync(corePackageDirectory(root), { recursive: true });
    fs.writeFileSync(corePackageManifestPath(root), '{"name":"fixture","version":"0.0.0"}');
    for (const name of ["atom-state", "store-connection"]) {
      fs.copyFileSync(path.join(repository, "src/shared", name + ".ts"), path.join(root, "src/shared", name + ".ts"));
    }
    let source = fs
      .readFileSync(path.join(repository, "src/shared/__tests__/fixtures/atom-state-public.ts"), "utf8")
      .replaceAll('"../../atom-state"', '"./shared/atom-state"')
      .replaceAll('"../../store-connection"', '"./shared/store-connection"');
    source +=
      '\ncustomElements.define("acme-public-probe",PublicAtomProbe);\nexport class Converted extends PublicAtomProbe { static properties={count:{attribute:"amount",noAccessor:true,reflect:true,useDefault:true,converter:{fromAttribute:(value:string|null)=>value===null?null:Number(value.slice(1)),toAttribute:(value:number)=>"#"+value}}}; }\ncustomElements.define("acme-converted-probe",Converted);\n';
    fs.writeFileSync(path.join(root, "src/probe.ts"), source);
    const { manifest, issues } = await analyzeManifest(root);
    expect(issues).toEqual([]);
    const elements = manifest.modules
      .flatMap((module) => module.declarations ?? [])
      .filter((declaration): declaration is ClassDeclaration & CustomElement => declaration.kind === "class" && "tagName" in declaration && !!declaration.tagName);
    expect(elements).toHaveLength(2);
    for (const [tag, attribute] of [
      ["acme-public-probe", "count"],
      ["acme-converted-probe", "amount"],
    ]) {
      const element = elements.find((element) => element.tagName === tag)!;
      expect(element.members?.find((member) => member.name === "count")).toMatchObject({ kind: "field", type: { text: "number" }, default: "0", attribute, reflects: true });
      expect(element.attributes?.find((member) => member.fieldName === "count")).toMatchObject({ name: attribute, type: { text: "number" }, default: "0" });
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("the manifest matches every registered Lit class and its runtime property attributes", async () => {
  const { manifest, issues } = await analyzeManifest();
  expect(issues).toEqual([]);
  const elements = manifest.modules
    .flatMap((module) => module.declarations ?? [])
    .filter((declaration): declaration is ClassDeclaration & CustomElement => declaration.kind === "class" && "tagName" in declaration && !!declaration.tagName);
  const registered = ([...Object.values(classes), ...Object.values(iconClasses)] as unknown[]).filter(
    (value): value is typeof LitElement => typeof value === "function" && value.prototype instanceof LitElement && !!customElements.getName(value as CustomElementConstructor),
  );
  expect(registered.length).toBeGreaterThan(0);
  expect(elements.map((element) => element.tagName!).sort()).toEqual(registered.map((ctor) => customElements.getName(ctor)!).sort());
  const theme = elements.find((element) => element.tagName === "acme-theme")!;
  const appearance = theme.members!.find((member) => member.name === "appearance") as { type: { text: string }; default: string };
  const density = theme.members!.find((member) => member.name === "density") as { type: { text: string }; default: string };
  expect(new Set(appearance.type.text.match(/"[^"]+"/g))).toEqual(new Set(['"auto"', '"light"', '"dark"']));
  expect(new Set(density.type.text.match(/"[^"]+"/g))).toEqual(new Set(['"normal"', '"compact"']));
  expect(appearance.default).toBe('"auto"');
  expect(density.default).toBe('"normal"');
  const box = elements.find((element) => element.tagName === "acme-box")!;
  const video = elements.find((element) => element.tagName === "acme-video")!;
  const preload = video.members?.find((member) => member.name === "preload") as { default: string; type: { text: string } };
  expect(preload.default).toBe('"auto"');
  expect(new Set(preload.type.text.match(/"[^"]+"/g))).toEqual(new Set(['"none"', '"metadata"', '"auto"']));
  const trigger = elements.find((element) => element.tagName === "acme-dialog-trigger")!;
  expect(trigger.members?.find((member) => member.name === "variant")).toMatchObject({ default: '"secondary"', "x-acme-reset": "undefined" });
  const showMore = elements.find((element) => element.tagName === "acme-show-more")!;
  expect(showMore.members?.find((member) => member.name === "size")).toMatchObject({ default: '"small"', "x-acme-reset": "undefined" });
  const pagination = elements.find((element) => element.tagName === "acme-pagination")!;
  const request = pagination.events?.find((event) => event.name === "acme-request")?.type?.text;
  expect(request).toContain('action: "page"');
  expect(request).toContain('action: "page-size"');
  const input = elements.find((element) => element.tagName === "acme-input")!;
  expect(input.attributes?.find((attribute) => attribute.name === "form")).toMatchObject({ type: { text: "string" } });
  expect(input.attributes?.find((attribute) => attribute.name === "form")?.fieldName).toBeUndefined();
  for (const [name, schema] of Object.entries(commonStyleInputSchema)) {
    expect(box.attributes?.find((attribute) => attribute.name === schema.attribute)?.fieldName).toBe(name);
    expect(box.members?.find((member) => member.name === name && member.kind === "field")).toMatchObject({ attribute: schema.attribute });
  }
  for (const element of elements) {
    expect(element.events?.some((event) => event.name === "type") ?? false).toBe(false);
    for (const member of element.members ?? []) {
      if (member.static || member.privacy === "private" || member.privacy === "protected") {
        continue;
      }
      if (member.kind === "field") {
        expect(member.type?.text).toBeTruthy();
      }
      if (member.kind === "method") {
        expect(member.return?.type?.text).toBeTruthy();
      }
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
      let prototype = ctor.prototype;
      while (prototype && !Object.getOwnPropertyDescriptor(prototype, name)) {
        prototype = Object.getPrototypeOf(prototype);
      }
      if (prototype && Object.getOwnPropertyDescriptor(prototype, name)?.set) {
        expect((element.members?.find((member) => member.name === name) as { readonly?: boolean }).readonly ?? false).toBe(false);
      }
    }
  }
  for (const tag of ["acme-input", "acme-search", "acme-textarea"]) {
    expect(
      elements
        .find((element) => element.tagName === tag)!
        .events!.map((event) => event.name)
        .sort(),
    ).toEqual(["acme-change", "acme-input"]);
  }
}, 30000);

test("manifest facts cover conditional events, event variables, slots and forwarded parts", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-manifest-"));
  try {
    fs.mkdirSync(path.join(root, "src"));
    fs.mkdirSync(corePackageDirectory(root), { recursive: true });
    fs.writeFileSync(corePackageManifestPath(root), '{"name":"fixture","version":"0.0.0"}');
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

test("partitioned icon analysis preserves real ancestry and authored descendants", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-icon-manifest-"));
  const write = (file: string, source: string) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, source);
  };
  try {
    fs.symlinkSync(path.resolve(import.meta.dir, "../../node_modules"), path.join(root, "node_modules"), "dir");
    write("packages/core/package.json", '{"name":"fixture","version":"0.0.0"}');
    write(
      "src/shared/icon-element.ts",
      'import {LitElement} from "lit"; import {property} from "lit/decorators.js"; export class AcmeIconElement extends LitElement { @property() label=""; private secret="hidden"; }',
    );
    for (const name of ["A", "B"]) {
      write(`src/generated/icons/classes/${name.toLowerCase()}-icon.ts`, `import {AcmeIconElement} from "../../../shared/icon-element"; export class ${name}Icon extends AcmeIconElement {}`);
      write(
        `src/define/${name.toLowerCase()}-icon.ts`,
        `import {${name}Icon} from "../generated/icons/classes/${name.toLowerCase()}-icon"; customElements.define("acme-${name.toLowerCase()}-icon",${name}Icon);`,
      );
    }
    write("src/derived.ts", 'import {AIcon} from "./generated/icons/classes/a-icon";export class Derived extends AIcon {} customElements.define("acme-derived",Derived);');
    const { manifest, issues } = await analyzeManifest(root);
    expect(issues).toEqual([]);
    const elements = manifest.modules.flatMap((module) => module.declarations ?? []).filter((declaration) => "tagName" in declaration) as (ClassDeclaration & CustomElement)[];
    expect(elements.map((element) => element.tagName).sort()).toEqual(["acme-a-icon", "acme-b-icon", "acme-derived"]);
    for (const element of elements) {
      expect(element.attributes?.find((attribute) => attribute.name === "label")).toMatchObject({ fieldName: "label", default: '""' });
      expect(element.members?.some((member) => member.name === "secret")).toBe(false);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("internal definitions stay out of consumer metadata and API pages", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-internal-manifest-"));
  try {
    fs.mkdirSync(path.join(root, "src/internal"), { recursive: true });
    fs.symlinkSync(path.resolve(import.meta.dir, "../../node_modules"), path.join(root, "node_modules"), "dir");
    fs.mkdirSync(corePackageDirectory(root), { recursive: true });
    fs.writeFileSync(corePackageManifestPath(root), '{"name":"fixture","version":"0.0.0"}');
    fs.writeFileSync(
      path.join(root, "src/internal/inner.ts"),
      'import {LitElement,html} from "lit";\n/** @internal */\nexport class Inner extends LitElement {render(){return html`<span></span>`;}}declare global{interface HTMLElementTagNameMap{"acme-inner":Inner;}}',
    );
    fs.writeFileSync(
      path.join(root, "src/owner.ts"),
      'import {LitElement,html} from "lit";export class Owner extends LitElement {render(){return html`<acme-inner></acme-inner>`;}}declare global{interface HTMLElementTagNameMap{"acme-owner":Owner;}}',
    );
    writeEntries(root);
    const { manifest, issues } = await analyzeManifest(root);
    expect(issues).toEqual([]);
    expect(manifest.modules.some((module) => module.path.startsWith("dist/internal/"))).toBe(false);
    expect(apiFromManifest(manifest).map((element) => element.tag)).toEqual(["acme-owner"]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("assignments to owned native elements do not become host properties", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-nested-assignment-"));
  try {
    fs.mkdirSync(path.join(root, "src"), { recursive: true });
    fs.symlinkSync(path.resolve(import.meta.dir, "../../node_modules"), path.join(root, "node_modules"), "dir");
    fs.mkdirSync(corePackageDirectory(root), { recursive: true });
    fs.writeFileSync(corePackageManifestPath(root), '{"name":"fixture","version":"0.0.0"}');
    fs.writeFileSync(
      path.join(root, "src/probe.ts"),
      'import {LitElement} from "lit";export class Probe extends LitElement {private input=document.createElement("input");name="host";constructor(){super();this.input.className="native";this.input.name="child";} }customElements.define("acme-probe",Probe);',
    );
    const { manifest, issues } = await analyzeManifest(root);
    expect(issues).toEqual([]);
    const declaration = manifest.modules.flatMap((module) => module.declarations ?? []).find((declaration) => declaration.name === "Probe") as ClassDeclaration;
    expect(declaration.members?.some((member) => member.name === "className")).toBe(false);
    expect(declaration.members?.find((member) => member.name === "name")).toMatchObject({ default: '"host"' });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("native renderer-container metadata survives standard analysis", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-native-root-manifest-"));
  try {
    fs.mkdirSync(path.join(root, "src"), { recursive: true });
    fs.symlinkSync(path.resolve(import.meta.dir, "../../node_modules"), path.join(root, "node_modules"), "dir");
    fs.mkdirSync(corePackageDirectory(root), { recursive: true });
    fs.writeFileSync(corePackageManifestPath(root), '{"name":"fixture","version":"0.0.0"}');
    fs.writeFileSync(
      path.join(root, "src/probe.ts"),
      'import {LitElement} from "lit";\n/** @acmeNativeRoot fieldset */\nexport class Probe extends LitElement {} customElements.define("acme-probe",Probe);',
    );
    const { manifest, issues } = await analyzeManifest(root);
    expect(issues).toEqual([]);
    const declaration = manifest.modules.flatMap((module) => module.declarations ?? []).find((declaration) => declaration.name === "Probe") as ClassDeclaration & { "x-acme-native-root"?: string };
    expect(declaration["x-acme-native-root"]).toBe("fieldset");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("manifest normalization rewrites shared reference objects once", () => {
  const shared = { name: "AcmeReadOnlyFormElement", module: "src/shared/native-form-element.ts" };
  const source = {
    schemaVersion: "1.0.0",
    modules: [
      {
        kind: "javascript-module" as const,
        path: "src/components/pin-input/pin-input.ts",
        declarations: [{ kind: "class" as const, name: "First", superclass: shared, members: [{ kind: "field" as const, name: "value", inheritedFrom: shared }] }],
      },
      { kind: "javascript-module" as const, path: "src/components/input/input.ts", declarations: [{ kind: "class" as const, name: "Second", superclass: shared }] },
    ],
  };
  const result = normalizeManifest(source);
  const first = result.modules[0]!.declarations![0] as ClassDeclaration,
    second = result.modules[1]!.declarations![0] as ClassDeclaration;
  expect(first.superclass?.module).toBe("dist/shared/native-form-element.js");
  expect(first.members?.[0]?.inheritedFrom?.module).toBe("dist/shared/native-form-element.js");
  expect(second.superclass?.module).toBe("dist/shared/native-form-element.js");
  expect(shared.module).toBe("src/shared/native-form-element.ts");
});
