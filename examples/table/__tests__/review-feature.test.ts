import {expect,test} from 'bun:test';
import path from 'node:path';
const root=path.resolve(import.meta.dir,'../../..');
test('custom Table features and experimental worker declarations compile together',async()=>{
 const child=Bun.spawn([process.execPath,path.join(root,'node_modules/typescript/bin/tsc'),'--noEmit','--strict','--skipLibCheck','--target','es2022','--module','esnext','--moduleResolution','bundler','--experimentalDecorators','--useDefineForClassFields','false','examples/table/lit.ts','examples/table/react.ts','examples/table/virtual-lit.ts','examples/table/virtual-react.ts','examples/table/worker-lit.ts','examples/table/worker-react.ts'],{cwd:root,stdout:'pipe',stderr:'pipe'});
 const [stdout,stderr,code]=await Promise.all([new Response(child.stdout).text(),new Response(child.stderr).text(),child.exited]);
 if(code!==0)throw new Error(stdout+stderr);expect(code).toBe(0);
},30000);
