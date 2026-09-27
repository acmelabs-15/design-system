import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const root=new URL("../../../../",import.meta.url).pathname;
const runtime=process.env.ACME_BROWSER_RUNTIME;if(!runtime)throw new Error("Set ACME_BROWSER_RUNTIME");
const archive=path.resolve(process.env.ACME_CORE_ARCHIVE??path.join(root,".artifacts/m26-bundle/packages/acmelabs-design-system-0.3.0.tgz"));
const supplied=process.env.ACME_BUNDLE_CONSUMER;
const consumer=supplied??fs.mkdtempSync(path.join(os.tmpdir(),"acme-m26-bundle-"));
if(supplied&&JSON.parse(fs.readFileSync(path.join(consumer,"package.json"),"utf8")).name!=="bundle-consumer")throw Error("Not an owned bundle consumer");
const output=process.env.ACME_BUNDLE_RESULTS??path.join(root,".artifacts/m26-bundle/results.json");
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(runtime,"browsers");const pw=await import(path.join(runtime,"node_modules/playwright/index.mjs"));
const reports=[];
try{
 if(!supplied){
 await Bun.write(path.join(consumer,"package.json"),JSON.stringify({name:"bundle-consumer",private:true,type:"module",dependencies:{"@acmelabs/design-system":"file:"+archive}}));
 const install=Bun.spawn([process.execPath,"install","--ignore-scripts"],{cwd:consumer,stdout:"pipe",stderr:"pipe"});const [installOut,installError,status]=await Promise.all([new Response(install.stdout).text(),new Response(install.stderr).text(),install.exited]);assert.equal(status,0,installOut+installError);
 }
 const probe=await Bun.file(new URL("./consumer-probe.ts",import.meta.url)).text();await Bun.write(path.join(consumer,"probe.ts"),probe);
 for(const splitting of (process.argv.includes("--supported")?[true]:[false,true])){
  const directory=path.join(consumer,splitting?"split":"single");
  const build=await Bun.build({entrypoints:[path.join(consumer,"probe.ts")],outdir:directory,target:"browser",format:"esm",splitting,sourcemap:"linked",metafile:true});if(!build.success)throw new AggregateError(build.logs,"Consumer build failed");
  const server=Bun.serve({hostname:"127.0.0.1",port:0,async fetch(request){const url=new URL(request.url);if(url.pathname==="/")return new Response('<!doctype html><link rel="stylesheet" href="/tokens.css"><script type="module" src="/probe.js"></script>',{headers:{"Content-Type":"text/html"}});const file=Bun.file(url.pathname==="/tokens.css"?path.join(consumer,"node_modules/@acmelabs/design-system/dist/styles/tokens.css"):path.join(directory,url.pathname));return await file.exists()?new Response(file):new Response("Missing",{status:404});}});
  try{for(const engine of ["chromium","firefox","webkit"]){
   const browser=await pw[engine].launch({headless:true,...(engine==="chromium"&&process.env.ACME_CHROMIUM_PATH?{executablePath:process.env.ACME_CHROMIUM_PATH}:{})});
   try{const page=await browser.newPage(),errors:string[]=[];page.on("pageerror",(error:Error)=>errors.push(String(error)));await page.goto(server.url.href);await page.waitForFunction(()=>Object.hasOwn(window,"__results"),null,{timeout:20000});const result=await page.evaluate(()=>Reflect.get(window,"__results"));const passed=!result.error&&errors.length===0&&result.results.length===4&&result.results.every((check:{ok:boolean})=>check.ok);reports.push({engine,browser:browser.version(),splitting,outputs:build.outputs.length,passed,...result,errors});console.log(engine,splitting?"split":"single",passed?"PASS":"FAIL",result.error??"");}finally{await browser.close();}
  }}finally{server.stop(true);}
 }
 const metadata=await Bun.file(path.join(consumer,"node_modules/@acmelabs/design-system/package.json")).json();
 const report={capturedAt:new Date().toISOString(),bun:Bun.version,archiveVersion:metadata.version,archiveSha256:new Bun.CryptoHasher("sha256").update(await Bun.file(archive).arrayBuffer()).digest("hex"),barrelVariant:process.env.ACME_BUNDLE_VARIANT??"archive",barrelSha256:new Bun.CryptoHasher("sha256").update(await Bun.file(path.join(consumer,"node_modules/@acmelabs/design-system/dist/index.js")).arrayBuffer()).digest("hex"),probeSha256:new Bun.CryptoHasher("sha256").update(probe).digest("hex"),consumer,notes:"This invocation verifies the supplied archive and records its immutable hash",reports};
 await Bun.write(output,JSON.stringify(report,null,2)+"\n");
 if(reports.some(report=>!report.passed))process.exitCode=1;
}finally{if(!supplied&&process.env.ACME_KEEP_BUNDLE_CONSUMER!=="1")fs.rmSync(consumer,{recursive:true,force:true});else console.log("consumer",consumer);}
