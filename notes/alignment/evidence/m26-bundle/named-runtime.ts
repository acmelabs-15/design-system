import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';
const consumer=process.env.ACME_BUNDLE_CONSUMER;if(!consumer)throw Error('Set ACME_BUNDLE_CONSUMER to the retained archived consumer');
const file=path.join(consumer,'node_modules/@acmelabs/design-system/dist/index.js'),source=fs.readFileSync(file,'utf8');
const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),scan=new Bun.Transpiler({loader:'js'});
const explicit=new Set<string>();for(const statement of ast.statements)if(ts.isExportDeclaration(statement)&&statement.exportClause&&ts.isNamedExports(statement.exportClause))for(const name of statement.exportClause.elements)explicit.add(name.name.text);
const replacements:{start:number;end:number;text:string}[]=[],names=new Set(explicit);
for(const statement of ast.statements){
 if(!ts.isExportDeclaration(statement)||statement.exportClause||!statement.moduleSpecifier||!ts.isStringLiteral(statement.moduleSpecifier))continue;
 const specifier=statement.moduleSpecifier.text,base=path.resolve(path.dirname(file),specifier),target=fs.existsSync(base)?base:base+'.js';
 const code=fs.readFileSync(target,'utf8');if(/export\s*\*/.test(code))throw Error('Nested star export requires explicit analysis: '+target);
 const exported=scan.scan(code).exports.filter(name=>name!=='default'&&!names.has(name)).sort();for(const name of exported)names.add(name);
 replacements.push({start:statement.getStart(ast),end:statement.end,text:exported.length?'export { '+exported.join(', ')+' } from '+JSON.stringify(specifier)+';':''});
}
let result=source;for(const replacement of replacements.reverse())result=result.slice(0,replacement.start)+replacement.text+result.slice(replacement.end);
await Bun.write(path.join(import.meta.dir,'archived-index-original.js'),source);await Bun.write(path.join(import.meta.dir,'archived-index-named.js'),result);
fs.writeFileSync(file,result);console.log(JSON.stringify({file,starStatements:replacements.length,namedExports:names.size}));
