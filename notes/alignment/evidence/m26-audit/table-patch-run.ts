import ts from "typescript";
import path from "node:path";
const root = path.resolve(import.meta.dir, "../../../.."),
  target = path.join(root, "node_modules/@tanstack/table-core/dist/worker/createTableWorker.d.ts");
const source = await Bun.file(target).text();
const original = source.replace("declare module '../index.js'", "declare module '../types/TableFeatures'").replace("declare module '../index.js'", "declare module '../types/TableState'");
const result = [];
for (const mode of ["patched", "published"]) {
  const options = { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true, strict: true, noEmit: true };
  const host = ts.createCompilerHost(options),
    read = host.readFile.bind(host);
  host.readFile = (file) => (file === target ? (mode === "patched" ? source : original) : read(file));
  const program = ts.createProgram([path.join(root, "examples/table/data.ts"), path.join(root, "examples/table/worker-session.ts")], options, host);
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .map((d) => ({
      file: d.file?.fileName.replace(root + "/", ""),
      line: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : null,
      code: d.code,
      message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
    }));
  result.push({ mode, diagnostics });
  console.log(mode, diagnostics);
}
await Bun.write(
  process.env.ACME_AUDIT_RESULTS ?? path.join(import.meta.dir, "table-patch-results.json"),
  JSON.stringify(
    { date: new Date().toISOString(), package: "@tanstack/table-core@9.2.4", method: "TypeScript CompilerHost substitutes published declaration text without changing the installed dependency", result },
    null,
    2,
  ) + "\n",
);
if (result.find(entry => entry.mode === "patched")?.diagnostics.length !== 0 || !result.find(entry => entry.mode === "published")?.diagnostics.some(diagnostic => diagnostic.message.includes("reviewFeature"))) process.exitCode = 1;
