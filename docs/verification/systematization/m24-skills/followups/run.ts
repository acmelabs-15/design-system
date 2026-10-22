import assert from "node:assert/strict";
import path from "node:path";
process.env.PLAYWRIGHT_BROWSERS_PATH="/Users/peterkloss/Library/Caches/acme-design-system/browser-checks/browsers";
const {chromium}=await import("/Users/peterkloss/Library/Caches/acme-design-system/browser-checks/node_modules/playwright/index.mjs");
const browser=await chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
const reports=[];
for(const [variant,directory] of Object.entries({"react-baseline":"/tmp/acme-m24-evals/react-baseline","react-skilled":"/tmp/acme-m24-evals/react-skilled","table-baseline":"/tmp/acme-m24-table-evals/baseline","table-skilled":"/tmp/acme-m24-table-evals/skilled"})){
 const server=Bun.serve({port:0,async fetch(request){const pathname=new URL(request.url).pathname;if(pathname==="/favicon.ico")return new Response(null,{status:204});let file=Bun.file(path.join(directory,pathname==="/"?"index.html":pathname));if(!(await file.exists())) file=Bun.file(path.join(directory,"dist",pathname));return await file.exists()?new Response(file):new Response("Missing",{status:404});}});
 const page=await browser.newPage();
 await page.addInitScript(()=>{
  const add=EventTarget.prototype.addEventListener, remove=EventTarget.prototype.removeEventListener;
  const targets=new WeakMap(); window.pageRequests=0;
  EventTarget.prototype.addEventListener=function(type,listener,options){
   if(this.localName!=="acme-pagination"||type!=="acme-request"||!listener)return add.call(this,type,listener,options);
   let listeners=targets.get(this);if(!listeners){listeners=new Map();targets.set(this,listeners)}
   const capture=typeof options==="boolean"?options:!!options?.capture;
   let variants=listeners.get(listener);if(!variants){variants=new Map();listeners.set(listener,variants)}
   let wrapped=variants.get(capture);if(!wrapped){wrapped=function(event){if(event.detail?.action==="page")window.pageRequests++;return typeof listener==="function"?listener.call(this,event):listener.handleEvent(event)};variants.set(capture,wrapped)}
   return add.call(this,type,wrapped,options);
  };
  EventTarget.prototype.removeEventListener=function(type,listener,options){const capture=typeof options==="boolean"?options:!!options?.capture;const wrapped=type==="acme-request"?targets.get(this)?.get(listener)?.get(capture):undefined;return remove.call(this,type,wrapped??listener,options)};
 });
 try{
  await page.route("https://fonts.googleapis.com/**",r=>r.abort());await page.goto(server.url.href,{waitUntil:"domcontentloaded"});
  if(variant.startsWith("react")){
   await page.locator("acme-radio-group").waitFor();
   const original=await page.locator("acme-radio-group").evaluate(group=>({name:group.name,form:!!group.form}));
   const formData=await page.locator("acme-radio-group").evaluate(async group=>{const form=document.createElement("form");form.id="followup-form";group.parentNode.insertBefore(form,group);form.append(group);group.name="plan";await group.updateComplete;return {owner:group.form?.id,value:group.value,entries:[...new FormData(form)]};});
   assert.equal(formData.owner,"followup-form");assert.deepEqual(formData.entries,[["plan",formData.value]]);
   reports.push({variant,check:"native FormData after application supplies form/name",pass:true,original,formData,scope:"Supplemental named-form integration, not an assertion that the original artifact authored a form/name"});
   if(variant==="react-baseline"){
    await page.reload({waitUntil:"domcontentloaded"});await page.locator("acme-tabs").waitFor();
    await page.evaluate(()=>{window.detachedTabs=document.querySelector("acme-tabs");window.beforeEvents=window.evidence.events.length;});
    await page.locator('[data-testid="mount"]').click();await page.waitForFunction(()=>!document.querySelector("acme-tabs"));
    const evidence=await page.evaluate(()=>{window.detachedTabs.dispatchEvent(new CustomEvent("acme-change",{bubbles:true,composed:true,detail:{value:"output"}}));return {before:window.beforeEvents,after:window.evidence.events.length};});
    assert.equal(evidence.before,evidence.after);reports.push({variant,check:"detached wrapper callback removed",pass:true,evidence});
   }
  }else{
   const tag=variant==="table-baseline"?"consumer-table":"delivery-app";await page.locator(tag+" acme-pagination-next button:not([hidden])").waitFor();
   await page.locator(tag).evaluate(async host=>{host.remove();await Promise.resolve();document.body.append(host);await host.updateComplete;host.model.setPageSize(1000);host.model.setPageIndex(0);await host.updateComplete;window.pageRequests=0;});
   await page.locator(tag+" acme-pagination-next button:not([hidden])").click();
   await page.waitForFunction(tag=>document.querySelector(tag).model.state.pagination.pageIndex===1,tag);
   const evidence=await page.locator(tag).evaluate(host=>({calls:window.pageRequests,pageIndex:host.model.state.pagination.pageIndex}));
   assert.equal(evidence.calls,1);reports.push({variant,check:"one application page change after same-element remount",pass:true,evidence});
  }
 }catch(error){reports.push({variant,pass:false,error:String(error)});}finally{await page.close();server.stop(true);}
}
await browser.close();await Bun.write("/tmp/acme-m24-followups/results.json",JSON.stringify(reports,null,2));console.log(reports);if(reports.some(r=>!r.pass))process.exitCode=1;
