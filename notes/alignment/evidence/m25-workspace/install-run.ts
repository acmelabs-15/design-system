import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureCorePackageLinks } from "../../../../scripts/core-package";

const repository = new URL("../../../../", import.meta.url).pathname;
const runtime = process.env.ACME_BUN_PATH ?? process.execPath;
const output = process.env.ACME_WORKSPACE_RESULTS ?? path.join(repository,".artifacts/m25-workspace/install.json");
const run = (args: string[], cwd: string) => {
  const result = Bun.spawnSync([runtime,...args], {cwd,stdout:"pipe",stderr:"pipe"});
  return {status:result.exitCode,stdout:result.stdout.toString(),stderr:result.stderr.toString()};
};
const version = run(["--version"], repository).stdout.trim();
const revision = run(["--revision"], repository).stdout.trim();
const sha256 = new Bun.CryptoHasher("sha256").update(await Bun.file(runtime).arrayBuffer()).digest("hex");
const cases = [];
for(const mode of ["file:.","link:.","workspace"] as const){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),"acme-workspace-evidence-"));
  const checks: {step:string;workspace:string;resolved?:string;target?:string;error?:string;pass:boolean}[]=[];
  let failure: string|undefined;
  try {
    const manifestFiles=[...new Bun.Glob("packages/*/package.json").scanSync(repository)].filter(file=>mode==="workspace"||file!=="packages/core/package.json");
    for(const file of ["package.json","bun.lock","bunfig.toml",...manifestFiles,...new Bun.Glob("patches/*").scanSync(repository)]){
      const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(repository,file),target);
    }
    const workspace=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
    if(mode!=="workspace"){
      const core=JSON.parse(fs.readFileSync(path.join(repository,"packages/core/package.json"),"utf8"));
      delete workspace.devDependencies[core.name];
      const former={...workspace,...core,overrides:{[core.name]:mode}};
      delete former.private;
      fs.writeFileSync(path.join(root,"package.json"),JSON.stringify(former,null,2));
      // The current lock names packages/core, which does not exist in this former layout.
      fs.unlinkSync(path.join(root,"bun.lock"));
    }else ensureCorePackageLinks(root);
    fs.mkdirSync(path.join(root,"dist"));
    fs.writeFileSync(path.join(root,"dist/index.js"),"export const identity = {};\n");
    const install=(cwd:string,args:string[])=>{const result=run([...args,"--ignore-scripts"],cwd);if(result.status!==0)throw new Error(result.stdout+result.stderr);};
    const verify=(step:string)=>{
      for(const file of manifestFiles){
        const location=path.dirname(file), cwd=path.join(root,location);
        // A new process avoids Bun's module-resolution cache concealing changed links.
        const result=run(["-e","console.log(Bun.resolveSync('@acmelabs/design-system',process.argv[1]))",cwd],root);
        const nested=path.join(cwd,"node_modules/@acmelabs/design-system");
        const target=fs.existsSync(nested)?path.relative(root,fs.realpathSync(nested)):undefined;
        const resolved=result.status===0?fs.realpathSync(result.stdout.trim()):undefined;
        const pass=resolved===fs.realpathSync(path.join(root,"dist/index.js"));
        checks.push({step,workspace:location,resolved:resolved?path.relative(root,resolved):undefined,target,error:result.status===0?undefined:result.stderr.trim(),pass});
        if(!pass)throw new Error(`${step}: ${location} does not resolve the live core`);
      }
    };
    install(root,["install"]);verify("fresh");
    install(root,["install","--frozen-lockfile"]);verify("repeat");
    install(path.join(root,"packages/react"),["add","@lit/react@1.0.8"]);verify("child-add");
    const file=path.join(root,"packages/mcp/package.json"), mcp=JSON.parse(fs.readFileSync(file,"utf8"));
    for(const zod of ["3.25.76","4.6.5"]){
      if(mcp.dependencies.zod===zod)continue;
      mcp.dependencies.zod=zod;fs.writeFileSync(file,JSON.stringify(mcp,null,2));
      install(root,["install"]);verify("changed-mcp-zod-"+zod);
    }
    install(root,["install","--frozen-lockfile"]);verify("final-frozen");
  }catch(error){failure=error instanceof Error?error.message:String(error);}
  finally{fs.rmSync(root,{recursive:true,force:true});}
  cases.push({mode,pass:!failure,failure,checks});
}
const report={version,revision,sha256,cases};
await Bun.write(output,JSON.stringify(report,null,2)+"\n");
for(const entry of cases)console.log(version,entry.mode,entry.pass?"PASS":"FAIL",entry.failure??"");
assert.equal(cases.find(entry=>entry.mode==="workspace")?.pass,true,"Supported workspace topology must pass");
