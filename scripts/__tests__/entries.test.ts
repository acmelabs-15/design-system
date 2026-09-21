import { afterEach, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { collectComponents, writeEntries, writePackageExports } from "../entries";

const roots: string[] = [];
const fixture = (files: Record<string, string>) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-entries-"));
  roots.push(root);
  for (const [name, source] of Object.entries(files)) {
    const file = path.join(root, "src", name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, source);
  }
  return root;
};
const component = (name: string, body = "", imports = "") =>
  `${imports}\nexport class ${name} extends HTMLElement { ${body} }\ndeclare global { interface HTMLElementTagNameMap { "acme-${name.toLowerCase()}": ${name}; } }`;

test("the entries command updates definitions and exports together", () => {
  const root = fixture({ "one.ts": component("One") });
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "fixture", exports: { "./components/stale": "./dist/stale.js" } }));
  const result = Bun.spawnSync([process.execPath, path.resolve(import.meta.dir, "../entries.ts"), root], { stdout: "pipe", stderr: "pipe" });
  expect(result.stderr.toString()).toBe("");
  expect(result.exitCode).toBe(0);
  expect(fs.existsSync(path.join(root, "src/define/one.ts"))).toBe(true);
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  expect(pkg.exports["./components/one"]).toBeDefined();
  expect(pkg.exports["./components/stale"]).toBeUndefined();
});
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

test("records use tag declarations and owned markup, not component imports or text", () => {
  const root = fixture({
    "child.ts": component("Child"),
    "unused.ts": component("Unused"),
    "owner.ts": component(
      "Owner",
      'render(){return html`<!-- <acme-unknown> --><div title="<acme-missing>"><acme-child></acme-child></div>`;} text="<acme-absent>";',
      'import {html} from "lit"; import {Unused} from "./unused";',
    ),
  });
  expect(collectComponents(root)).toEqual([
    { name: "child", tag: "acme-child", className: "Child", file: "src/child.ts", dependencies: [] },
    { name: "owner", tag: "acme-owner", className: "Owner", file: "src/owner.ts", dependencies: ["child"] },
    { name: "unused", tag: "acme-unused", className: "Unused", file: "src/unused.ts", dependencies: [] },
  ]);
});

test("inherits owned rendering and resolves aliased templates, helpers and literal creation", () => {
  const root = fixture({
    "child.ts": component("Child"),
    "other.ts": component("Other"),
    "base.ts": 'import {html as h} from "lit"; const content=h`<acme-child></acme-child>`; export class Base extends HTMLElement { render(){return content;} }',
    "owner.ts":
      'import {Base as Parent} from "./base"; import * as Lit from "lit"; export class Owner extends Parent { extra(){document.createElement("acme-other"); return Lit.svg`<g/>`;} } declare global { interface HTMLElementTagNameMap { "acme-owner": Owner; } }',
  });
  expect(collectComponents(root).find((record) => record.name === "owner")?.dependencies).toEqual(["child", "other"]);
});

test("tag maps resolve imported class aliases without retaining a second tag catalog", () => {
  const root = fixture({
    "classes.ts": "export class Actual extends HTMLElement {}",
    "tags.ts": 'import {Actual as Local} from "./classes"; declare global {interface HTMLElementTagNameMap {"acme-actual": Local;}}',
  });
  expect(collectComponents(root)).toEqual([{ name: "actual", tag: "acme-actual", className: "Actual", file: "src/classes.ts", dependencies: [] }]);
});

test.each([
  ["duplicate", { "one.ts": component("One"), "two.ts": component("Two").replace("acme-two", "acme-one") }, /Duplicate component tag/],
  ["missing class", { "one.ts": 'export {}; declare global {interface HTMLElementTagNameMap {"acme-one": Missing;}}' }, /Missing class/],
  ["unknown child", { "one.ts": component("One", "render(){return html`<acme-missing/>`;}", 'import {html} from "lit";') }, /Unknown component tag/],
  [
    "cycle",
    { "one.ts": component("One", "render(){return html`<acme-two/>`;}", 'import {html} from "lit";'), "two.ts": component("Two", "render(){return html`<acme-one/>`;}", 'import {html} from "lit";') },
    /Component dependency cycle/,
  ],
  ["self cycle", { "one.ts": component("One", "render(){return html`<acme-one/>`;}", 'import {html} from "lit";') }, /Component dependency cycle/],
] as const)("rejects %s before writing", (_, files, error) => {
  const root = fixture(files);
  expect(() => writeEntries(root)).toThrow(error);
  expect(fs.existsSync(path.join(root, "src/define"))).toBe(false);
});

test("writes deterministic definitions, preserves authored files and removes only stale generated files", () => {
  const root = fixture({
    "components/child/child.ts": component("Child"),
    "components/owner/owner.ts": component("Owner", "render(){return html`<acme-child/>`;}", 'import {html} from "lit";'),
  });
  writeEntries(root);
  const owner = path.join(root, "src/define/owner.ts");
  const first = fs.readFileSync(owner, "utf8");
  const modified = fs.statSync(owner).mtimeMs;
  expect(first).toContain('import "./child";');
  expect(first).toContain('import { Owner } from "../components/owner/owner";');
  expect(first).toContain('customElements.define("acme-owner", Owner);');
  expect(first).not.toContain("customElements.get");
  fs.writeFileSync(path.join(root, "src/define/stale.ts"), first);
  fs.writeFileSync(path.join(root, "src/define/authored.ts"), "// authored\n");
  writeEntries(root);
  expect(fs.readFileSync(owner, "utf8")).toBe(first);
  expect(fs.statSync(owner).mtimeMs).toBe(modified);
  expect(fs.existsSync(path.join(root, "src/define/stale.ts"))).toBe(false);
  expect(fs.readFileSync(path.join(root, "src/define/authored.ts"), "utf8")).toBe("// authored\n");
  expect(fs.readFileSync(path.join(root, "src/all.ts"), "utf8")).toContain('import "./define/owner";');
});

test("package exports track the source records and retain unrelated authored exports", () => {
  const root = fixture({ "one.ts": component("One") });
  const file = path.join(root, "package.json");
  fs.writeFileSync(file, JSON.stringify({ name: "fixture", exports: { ".": "./dist/index.js", "./styles/*": "./dist/styles/*", "./components/stale": "./dist/stale.js", "./dist/*": "./dist/*" } }));
  writePackageExports(collectComponents(root), root);
  const first = fs.readFileSync(file, "utf8"),
    pkg = JSON.parse(first);
  expect(pkg.exports["./components/one"]).toEqual({ types: "./dist/one.d.ts", import: "./dist/one.js", default: "./dist/one.js" });
  expect(pkg.exports["./components/stale"]).toBeUndefined();
  expect(pkg.exports["./dist/*"]).toBeUndefined();
  expect(pkg.exports["./styles/*"]).toBe("./dist/styles/*");
  expect(pkg.sideEffects).toContain("./dist/define/*.js");
  const modified = fs.statSync(file).mtimeMs;
  writePackageExports(collectComponents(root), root);
  expect(fs.readFileSync(file, "utf8")).toBe(first);
  expect(fs.statSync(file).mtimeMs).toBe(modified);
});

test("refuses to overwrite authored entries", () => {
  const root = fixture({ "one.ts": component("One"), "define/one.ts": "// authored\n" });
  expect(() => writeEntries(root)).toThrow("Refusing to overwrite authored entry");
  expect(fs.readFileSync(path.join(root, "src/define/one.ts"), "utf8")).toBe("// authored\n");
});

test("an authored all entry blocks every output write", () => {
  const root = fixture({ "one.ts": component("One"), "all.ts": "// authored\n" });
  expect(() => writeEntries(root)).toThrow("Refusing to overwrite authored entry");
  expect(fs.existsSync(path.join(root, "src/define"))).toBe(false);
});

test.each(["render(){return html`<${this.tag}></${this.tag}>`;}", "render(){return html`<acme-${this.tag}/>`;}", "render(){return html`<div></${this.tag}>`;}"] as const)(
  "rejects unresolved Lit tag expressions: %s",
  (body) => {
    const root = fixture({ "one.ts": component("One", `tag="one"; ${body}`, 'import {html} from "lit";') });
    expect(() => writeEntries(root)).toThrow(/Unresolved dynamic tag.*src\/one.ts:\d+/);
    expect(fs.existsSync(path.join(root, "src/define"))).toBe(false);
  },
);

test("dynamic attributes, content and comment expressions do not become tag names", () => {
  const root = fixture({
    "one.ts": component("One", 'tag="one"; render(){return html`<!-- <${this.tag}> --><div title="<${this.tag}>" ${this.tag}>${this.tag}</div>`;}', 'import {html} from "lit";'),
  });
  expect(collectComponents(root)[0].dependencies).toEqual([]);
});

test("enumerates finite createElement tags and ignores known native names", () => {
  const root = fixture({
    "child.ts": component("Child"),
    "one.ts": component(
      "One",
      'create(name:"acme-child"|"span"){return document.createElement(name);} native(name:"div"|"button"){return this.ownerDocument.createElement(name);} literal(){return document.createElement("section");}',
    ),
  });
  expect(collectComponents(root).find((entry) => entry.name === "one")?.dependencies).toEqual(["child"]);
});

test("rejects an unbounded createElement name with its source location", () => {
  const root = fixture({ "one.ts": component("One", "create(name:string){return document.createElement(name);}") });
  expect(() => writeEntries(root)).toThrow(/Unresolved dynamic tag.*src\/one.ts:\d+/);
  expect(fs.existsSync(path.join(root, "src/define"))).toBe(false);
});

test("rejects an unknown acme tag in a finite createElement union", () => {
  const root = fixture({ "one.ts": component("One", 'create(name:"acme-missing"|"span"){return document.createElement(name);}') });
  expect(() => collectComponents(root)).toThrow(/Unknown component tag acme-missing/);
});

test("a known non-acme prefix does not need a component definition", () => {
  const root = fixture({ "one.ts": component("One", "create(name:`other-${string}`){return document.createElement(name);}") });
  expect(collectComponents(root)[0].dependencies).toEqual([]);
});

test("an unbounded acme prefix still requires explicit dependencies", () => {
  const root = fixture({ "one.ts": component("One", "create(name:`acme-${string}`){return document.createElement(name);}") });
  expect(() => collectComponents(root)).toThrow(/Unresolved dynamic tag.*src\/one.ts:\d+/);
});

test("optional icon definitions stay selective while owned icon dependencies load", () => {
  const root = fixture({
    "generated/icons/classes/sample-icon.ts": component("SampleIcon").replaceAll("acme-sampleicon", "acme-sample-icon"),
    "owner.ts": component("Owner", "render(){return html`<acme-sample-icon></acme-sample-icon>`;}", 'import {html} from "lit";'),
  });
  writeEntries(root);
  expect(fs.readFileSync(path.join(root, "src/all.ts"), "utf8")).toContain('import "./define/owner";');
  expect(fs.readFileSync(path.join(root, "src/all.ts"), "utf8")).not.toContain('import "./define/sample-icon";');
  expect(fs.readFileSync(path.join(root, "src/define/owner.ts"), "utf8")).toContain('import "./sample-icon";');
  expect(fs.readFileSync(path.join(root, "src/define/sample-icon.ts"), "utf8")).toContain('customElements.define("acme-sample-icon", SampleIcon);');
  expect(fs.readFileSync(path.join(root, "src/define/sample-icon.ts"), "utf8")).toContain('import "../generated/icons/classes/sample-icon";');
});
