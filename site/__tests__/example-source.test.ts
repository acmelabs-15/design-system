import {expect,test} from "bun:test";
import {exampleSources} from "../example-source";
test("copied lazy content imports every nested template element",async()=>{
 const [source]=await exampleSources({h:"Lazy",html:'<acme-show when><template><acme-badge>Ready</acme-badge><template><acme-status>Nested</acme-status></template></template></acme-show>'},"lazy");
 expect(source.code).toContain('/cdn/define/show.js');
 expect(source.code).toContain('/cdn/define/badge.js');
 expect(source.code).toContain('/cdn/define/status.js');
});
