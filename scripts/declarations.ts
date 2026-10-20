import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const printer = ts.createPrinter({ removeComments: true });
const normalize = (text: string) => printer.printFile(ts.createSourceFile("declaration.d.ts", text, ts.ScriptTarget.Latest, true)).trim();
const definition = 'import "../index";\nimport "../generated/icons/index";\nexport {};\n';
const registration = 'import "../index";\nimport "../generated/icons/index";\nexport declare function register(registry: CustomElementRegistry): void;\n';

function requireAggregation(text: string, file: string): void {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  if (
    !source.statements.every(
      (statement) =>
        (ts.isImportDeclaration(statement) && !statement.importClause) ||
        (ts.isExportDeclaration(statement) && !statement.moduleSpecifier && statement.exportClause && ts.isNamedExports(statement.exportClause) && statement.exportClause.elements.length === 0),
    )
  ) {
    throw new Error("Aggregation declaration has a new public interface: " + file);
  }
}

/** Share equivalent generated interfaces while retaining real class and artwork-record types. */
export function emitPackageDeclarations(files: string[], sourceRoot: string, dist: string, options: ts.CompilerOptions): readonly ts.Diagnostic[] {
  const program = ts.createProgram([...files].sort(), {
    ...options,
    declaration: true,
    declarationMap: false,
    emitDeclarationOnly: true,
    noEmit: false,
    outDir: dist,
    rootDir: sourceRoot,
  });
  const emit = program.emit(undefined, (file, text) => {
    const relative = path.relative(dist, file).split(path.sep).join("/");
    if (relative.startsWith("define/")) {
      if (normalize(text) !== "export {};") {
        throw new Error("Definition declaration has a new public interface: " + relative);
      }
      return;
    }
    if (relative.startsWith("register/")) {
      if (normalize(text) !== normalize("export declare function register(registry: CustomElementRegistry): void;")) {
        throw new Error("Registration declaration has a new public interface: " + relative);
      }
      return;
    }
    if (relative.startsWith("generated/icons/artwork/")) {
      const name = path.basename(relative, ".d.ts");
      const expected = [`import { artwork } from "../../../records/${name}";\nexport { artwork };`, `export { artwork } from "../../../records/${name}";`].map(normalize);
      if (!expected.includes(normalize(text))) {
        throw new Error("Artwork declaration has a new public interface: " + relative);
      }
      return;
    }
    if (relative.startsWith("generated/icons/families/")) {
      requireAggregation(text, relative);
      text = "export {};\n";
    } else if (relative === "all.d.ts" || relative === "generated/icons/all.d.ts") {
      requireAggregation(text, relative);
      text = `import "${relative === "all.d.ts" ? "./" : "../../"}types/definition";\nexport {};\n`;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  });
  fs.mkdirSync(path.join(dist, "types"), { recursive: true });
  fs.writeFileSync(path.join(dist, "types/definition.d.ts"), definition);
  fs.writeFileSync(path.join(dist, "types/registration.d.ts"), registration);
  return ts
    .getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
}
