import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import ts from "typescript";
import { emitPackageDeclarations } from "../declarations";
import { writeEntries, writePackageExports } from "../entries";

test("packed declaration interfaces preserve native tags and valid artwork while rejecting unknown exports", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-declarations-"));
  const write = (file: string, text: string) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  };
  try {
    write("src/index.ts", 'export { AcmeButton } from "./components/button/button";');
    write("src/components/button/button.ts", 'export class AcmeButton extends HTMLElement { loading=false; } declare global { interface HTMLElementTagNameMap { "acme-button": AcmeButton; } }');
    write("src/shared/registration.ts", "export function registerElement(registry: CustomElementRegistry, name: string, element: CustomElementConstructor): void { registry.define(name,element); }");
    write("src/shared/icon-artwork.ts", "export class IconArtwork { readonly name: string; constructor(name:string){this.name=name;} }");
    write("src/generated/icons/records/home.ts", 'import { IconArtwork } from "../../../shared/icon-artwork"; export const artwork=new IconArtwork("home");');
    write(
      "src/generated/icons/classes/home-icon.ts",
      'export class AcmeHomeIcon extends HTMLElement { filled=false; } declare global { interface HTMLElementTagNameMap { "acme-home-icon": AcmeHomeIcon; } }',
    );
    write("src/generated/icons/index.ts", 'export { AcmeHomeIcon } from "./classes/home-icon";');
    write("src/generated/icons/all.ts", 'import "../../define/home-icon";');
    for (const family of ["rounded", "outlined", "sharp"]) {
      for (const fill of ["filled", "unfilled"]) {
        write(`src/generated/icons/artwork/${family}/${fill}/home.ts`, 'export { artwork } from "../../../records/home";');
        write(`src/generated/icons/families/${family}/${fill}.ts`, `import "../../artwork/${family}/${fill}/home";`);
      }
    }
    write(
      "packages/core/package.json",
      JSON.stringify({ name: "@acmelabs/design-system", version: "0.3.1", type: "module", exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" } } }),
    );
    const entries = writeEntries(root);
    writePackageExports(entries, root);
    const files = [...new Bun.Glob("**/*.ts").scanSync({ cwd: path.join(root, "src") })].map((file) => path.join(root, "src", file));
    const options: ts.CompilerOptions = {
      strict: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      skipLibCheck: true,
      types: [],
      lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
    };
    const diagnostics = emitPackageDeclarations(files, path.join(root, "src"), path.join(root, "packages/core/dist"), options);
    expect(diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))).toEqual([]);
    expect([...new Bun.Glob("**/*.d.ts.map").scanSync({ cwd: path.join(root, "packages/core/dist") })]).toEqual([]);
    expect(fs.existsSync(path.join(root, "packages/core/dist/generated/icons/artwork/outlined/filled/home.d.ts"))).toBe(false);
    expect(fs.existsSync(path.join(root, "packages/core/dist/generated/icons/records/home.d.ts"))).toBe(true);
    fs.mkdirSync(path.join(root, "node_modules/@acmelabs"), { recursive: true });
    fs.symlinkSync(path.join(root, "packages/core"), path.join(root, "node_modules/@acmelabs/design-system"));
    write(
      "consumer.ts",
      `
import "@acmelabs/design-system/define/button";
import "@acmelabs/design-system/define/home-icon";
import "@acmelabs/design-system/all";
import "@acmelabs/design-system/icons/all";
import "@acmelabs/design-system/icons/families/sharp/filled";
import { register } from "@acmelabs/design-system/register/home-icon";
import { artwork } from "@acmelabs/design-system/icons/artwork/outlined/filled/home";
register(customElements);
document.createElement("acme-button").loading = true;
document.createElement("acme-home-icon").filled = true;
const name: string = artwork.name;
// @ts-expect-error Native tag inference retains the real property type.
document.createElement("acme-home-icon").filled = "yes";
// @ts-expect-error A nonexistent definition must not resolve to a common type file.
import "@acmelabs/design-system/define/absent";
// @ts-expect-error A nonexistent registration must not resolve.
import { register as missing } from "@acmelabs/design-system/register/absent";
// @ts-expect-error Unknown artwork symbols must not resolve.
import { artwork as absent } from "@acmelabs/design-system/icons/artwork/outlined/filled/absent";
// @ts-expect-error Unknown artwork styles must not resolve.
import { artwork as wrongStyle } from "@acmelabs/design-system/icons/artwork/unknown/filled/home";
`,
    );
    const consumer = ts.createProgram([path.join(root, "consumer.ts")], { ...options, noEmit: true, noUncheckedSideEffectImports: true });
    expect(ts.getPreEmitDiagnostics(consumer).map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))).toEqual([]);
    for (const [name, imports, assertion] of [
      [
        "definitions",
        'import "@acmelabs/design-system/define/button"; import "@acmelabs/design-system/define/home-icon";',
        'document.createElement("acme-button").loading = true; document.createElement("acme-home-icon").filled = true;',
      ],
      ["registrations", 'import { register } from "@acmelabs/design-system/register/home-icon"; register(customElements);', 'document.createElement("acme-home-icon").filled = true;'],
      ["all", 'import "@acmelabs/design-system/all";', 'document.createElement("acme-button").loading = true;'],
      ["all-icons", 'import "@acmelabs/design-system/icons/all";', 'document.createElement("acme-home-icon").filled = true;'],
    ]) {
      write(`${name}.ts`, `${imports}\n${assertion}\n// @ts-expect-error The native tag retains its real property type.\n${assertion.replaceAll("= true", '= "wrong"')}\n`);
      const isolated = ts.createProgram([path.join(root, `${name}.ts`)], { ...options, noEmit: true, noUncheckedSideEffectImports: true });
      expect(ts.getPreEmitDiagnostics(isolated).map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))).toEqual([]);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
