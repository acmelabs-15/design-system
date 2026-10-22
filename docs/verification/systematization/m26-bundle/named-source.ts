import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';import assert from 'node:assert/strict';
const root=new URL('../../../../',import.meta.url).pathname,file=path.join(root,'src/index.ts');
const options:ts.CompilerOptions={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,strict:true,skipLibCheck:true,experimentalDecorators:true,useDefineForClassFields:false};
const before=ts.createProgram([file],options),checker=before.getTypeChecker(),source=before.getSourceFile(file)!;
const removed=new Set(['assetsBase','setAssetsBase']);
const resolved=(checker:ts.TypeChecker,symbol:ts.Symbol)=>symbol.flags&ts.SymbolFlags.Alias?checker.getAliasedSymbol(symbol):symbol;
const profile=(program:ts.Program)=>{const checker=program.getTypeChecker(),fileSource=program.getSourceFile(file)!;return checker.getExportsOfModule(checker.getSymbolAtLocation(fileSource)!).filter(symbol=>!removed.has(symbol.name)).map(symbol=>{const target=resolved(checker,symbol);return{name:symbol.name,flags:target.flags,value:!!(target.flags&ts.SymbolFlags.Value),origins:(target.declarations??[]).map(node=>path.relative(root,node.getSourceFile().fileName)+'#'+(node.name&&ts.isIdentifier(node.name)?node.name.text:target.name)).sort()};}).sort((a,b)=>a.name.localeCompare(b.name));};
const explicit=new Set<string>();for(const statement of source.statements)if(ts.isExportDeclaration(statement)&&statement.exportClause&&ts.isNamedExports(statement.exportClause))for(const name of statement.exportClause.elements)explicit.add(name.name.text);
const emitted=new Set(explicit),replacements:{start:number;end:number;text:string}[]=[];
for(const statement of source.statements){
 if(!ts.isExportDeclaration(statement)||statement.exportClause||!statement.moduleSpecifier||!ts.isStringLiteral(statement.moduleSpecifier))continue;
 const module=checker.getSymbolAtLocation(statement.moduleSpecifier);if(!module)throw Error('Missing source module '+statement.moduleSpecifier.text);
 const names=checker.getExportsOfModule(module).filter(symbol=>symbol.name!=='default'&&!emitted.has(symbol.name)&&!removed.has(symbol.name)).sort((a,b)=>a.name.localeCompare(b.name));
 for(const symbol of names)emitted.add(symbol.name);
 const valueNames=names.filter(symbol=>resolved(checker,symbol).flags&ts.SymbolFlags.Value).map(symbol=>symbol.name),typeNames=names.filter(symbol=>!(resolved(checker,symbol).flags&ts.SymbolFlags.Value)).map(symbol=>symbol.name);
 const declaration=[valueNames.length?'export { '+valueNames.join(', ')+' } from '+JSON.stringify(statement.moduleSpecifier.text)+';':'',typeNames.length?'export type { '+typeNames.join(', ')+' } from '+JSON.stringify(statement.moduleSpecifier.text)+';':''].filter(Boolean).join('\n');
 replacements.push({start:statement.getStart(source),end:statement.end,text:declaration});
}
let candidate=source.text;for(const replacement of replacements.reverse())candidate=candidate.slice(0,replacement.start)+replacement.text+candidate.slice(replacement.end);
const snapshots=new Map(before.getSourceFiles().map(source=>[source.fileName,source.text]));snapshots.set(file,candidate);
const host=ts.createCompilerHost(options),read=host.readFile.bind(host);host.readFile=name=>snapshots.get(name)??read(name);
const after=ts.createProgram([file],options,host);
const previous=profile(before),next=profile(after);assert.deepEqual(next,previous);
const diagnostics=ts.getPreEmitDiagnostics(after).filter(d=>d.category===ts.DiagnosticCategory.Error);if(diagnostics.length)throw Error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>root,getNewLine:()=>"\n"}));
await Bun.write(path.join(import.meta.dir,'candidate-index.ts'),candidate);await Bun.write(path.join(import.meta.dir,'symbol-preservation.json'),JSON.stringify({symbols:next.length,values:next.filter(x=>x.value).length,typesOnly:next.filter(x=>!x.value).length,allowedSeparateRemovals:[...removed],equal:true,profile:next},null,2)+'\n');
if(process.argv.includes('--apply'))await Bun.write(file,candidate);
console.log(JSON.stringify({symbols:next.length,values:next.filter(x=>x.value).length,typesOnly:next.filter(x=>!x.value).length,equal:true,applied:process.argv.includes('--apply')}));
