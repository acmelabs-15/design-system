import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const repository = new URL("../../../../",import.meta.url).pathname;
const archive = process.env.ACME_CORE_ARCHIVE ?? path.join(repository,".artifacts/packages/acmelabs-design-system-0.2.0.tgz");
const output = process.env.ACME_CONSUMER_RESULTS ?? path.join(repository,".artifacts/m25-workspace/consumer.json");
const root=fs.mkdtempSync(path.join(os.tmpdir(),"acme-core-packed-consumer-"));
try {
  await Bun.write(path.join(root,"package.json"),JSON.stringify({name:"core-workspace-consumer",private:true,type:"module",dependencies:{"@acmelabs/design-system":"file:"+archive}}));
  await Bun.write(path.join(root,"entry.ts"),Bun.file(new URL("./consumer-entry.ts",import.meta.url)));
  const child=Bun.spawn([process.execPath,"install","--ignore-scripts"],{cwd:root,stdout:"pipe",stderr:"pipe"});
  const [status,stdout,stderr]=await Promise.all([child.exited,new Response(child.stdout).text(),new Response(child.stderr).text()]);
  assert.equal(status,0,stdout+stderr);
  const manifest=await Bun.file(path.join(root,"node_modules/@acmelabs/design-system/package.json")).json();
  assert.equal(manifest.name,"@acmelabs/design-system");
  const excluded=["devDependencies","workspaces","overrides","patchedDependencies","scripts"].filter(key=>key in manifest);
  assert.deepEqual(excluded,[]);
  for(const file of ["dist/index.js","dist/custom-elements.json","dist/tokens.json","assets/book-texture.avif","README.md","skills/references/release.json"]){
    assert.equal(await Bun.file(path.join(root,"node_modules/@acmelabs/design-system",file)).exists(),true,file);
  }
  const result=await Bun.build({entrypoints:[path.join(root,"entry.ts")],outdir:path.join(root,"out"),target:"browser",format:"esm",splitting:true});
  assert.equal(result.success,true,result.logs.join("\n"));
  const report={runtime:Bun.version,archiveSha256:new Bun.CryptoHasher("sha256").update(await Bun.file(archive).arrayBuffer()).digest("hex"),name:manifest.name,version:manifest.version,componentExports:Object.keys(manifest.exports).filter(key=>key.startsWith("./components/")).length,runtimeDependencies:Object.keys(manifest.dependencies).length,excluded,outputs:result.outputs.length,bundleBytes:result.outputs.reduce((sum,file)=>sum+file.size,0),passed:true};
  await Bun.write(output,JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify(report));
} finally {fs.rmSync(root,{recursive:true,force:true});}
