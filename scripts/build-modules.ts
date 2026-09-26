import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { compileLitTemplates } from "@lit-labs/compiler";
import { writeManifest } from "./manifest";
const ROOT = path.resolve(import.meta.dir, "..");
const SRC = path.join(ROOT, "src"), DIST = path.join(ROOT, "dist");

const walk = (d: string): string[] =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? (e.name === "__tests__" ? [] : walk(path.join(d, e.name))) : e.name.endsWith(".ts") && !e.name.endsWith(".d.ts") && !e.name.endsWith(".geist.ts") ? [path.join(d, e.name)] : [],
    ); // .geist.ts mappings feed tools/geist/gen.ts, not the package
const files = walk(SRC);
const compilerOptions: ts.CompilerOptions = {
  strict: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  experimentalDecorators: true,
  useDefineForClassFields: false,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
};

// 1. Unbundled modules, templates precompiled.
let compiled = 0;
for (const f of files) {
  const out = ts.transpileModule(fs.readFileSync(f, "utf8"), { compilerOptions, fileName: f, transformers: { before: [compileLitTemplates()] } });
  const rel = path.relative(SRC, f).replace(/\.ts$/, ".js");
  fs.mkdirSync(path.dirname(path.join(DIST, rel)), { recursive: true });
  fs.writeFileSync(path.join(DIST, rel), out.outputText);
  if (out.outputText.includes('["_$litType$"]')) compiled++;
}
console.log(`modules: ${files.length} files, ${compiled} with compiled templates`);

// 2. Declarations with maps.
const program = ts.createProgram(files, {
  ...compilerOptions,
  declaration: true,
  declarationMap: true,
  emitDeclarationOnly: true,
  outDir: DIST,
  rootDir: SRC,
  skipLibCheck: true,
  lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
});
const emit = program.emit();
const diags = ts
  .getPreEmitDiagnostics(program)
  .concat(emit.diagnostics)
  .filter((d) => d.category === ts.DiagnosticCategory.Error);
for (const d of diags.slice(0, 30))
  console.error(ts.flattenDiagnosticMessageText(d.messageText, "\n"), d.file ? `${path.relative(ROOT, d.file.fileName)}:${d.file.getLineAndCharacterOfPosition(d.start ?? 0).line + 1}` : "");
if (diags.length) {
  console.error(`${diags.length} type errors`);
  process.exit(1);
}

await writeManifest();
