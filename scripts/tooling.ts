import {buildDevtoolsRuntime} from "./devtools-runtime";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import {writeDevtoolsMetadata} from "./devtools-metadata";
const root = path.resolve(import.meta.dir,"..");

/** Compile optional packages separately from normal browser entry points. */
export function buildToolPackage(name: "mcp" | "devtools", projectRoot = root) {
  const directory=path.join(projectRoot,"packages",name);
  const source=path.join(directory,"src");
  const out=path.join(directory,"dist");
  const files=[path.join(source,"index.ts"),...(name==="mcp"?[path.join(source,"cli.ts")]:[])];
  const program=ts.createProgram(files,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,strict:true,skipLibCheck:true,declaration:true,emitDeclarationOnly:name==="devtools",rootDir:source,outDir:out,lib:["lib.esnext.d.ts","lib.dom.d.ts","lib.dom.iterable.d.ts"],types:["bun"]});
  const diagnostics=ts.getPreEmitDiagnostics(program).filter(diagnostic=>diagnostic.category===ts.DiagnosticCategory.Error);
  if(diagnostics.length)throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:file=>file,getCurrentDirectory:()=>projectRoot,getNewLine:()=>"\n"}));
  // The docs build owns documentation.json; replace only this compiler's JS and declaration outputs.
  if(fs.existsSync(out))for(const file of new Bun.Glob("**/*.{js,d.ts}").scanSync({cwd:out}))fs.rmSync(path.join(out,file));
  const result=program.emit();if(result.emitSkipped)throw new Error("Optional package emit failed: "+name);
  if(name==="mcp")fs.chmodSync(path.join(out,"cli.js"),0o755);
  console.log(`Optional package: ${name}`);
}
if(import.meta.main){await writeDevtoolsMetadata(root);buildToolPackage("mcp");buildToolPackage("devtools");await buildDevtoolsRuntime(root);}
