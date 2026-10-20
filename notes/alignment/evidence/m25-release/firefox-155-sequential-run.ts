import path from "node:path";
import assert from 'node:assert/strict';
const runtime=process.env.ACME_BROWSER_RUNTIME;if(!runtime)throw new Error("Set ACME_BROWSER_RUNTIME");process.env.PLAYWRIGHT_BROWSERS_PATH=runtime+"/browsers";
const pw=await import(runtime+"/node_modules/playwright/index.mjs");
const results=[];
for (const engine of ['chromium','firefox','webkit']) {
 const browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.ACME_CHROMIUM_PATH}:{})});
 const page=await browser.newPage({reducedMotion:'reduce'});await page.route("https://fonts.googleapis.com/**",route=>route.abort());await page.route("https://fonts.gstatic.com/**",route=>route.abort());let errors:string[]=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://localhost:4180/',{waitUntil:'domcontentloaded'});await page.locator('main h1').waitFor();
 const routes=await page.evaluate(()=>window.__docsNav.flatMap(g=>g.items).map(i=>i.href));
 for(const route of routes) {
  errors=[];
  try {
   await page.goto('http://localhost:4180/'+(route==='index'?'':route),{waitUntil:'domcontentloaded'});await page.locator('main h1').waitFor();
   await page.waitForFunction(()=>[...document.querySelectorAll('.showcase .preview acme-button')].every(e=>e.shadowRoot));
   const failures=await page.locator('[data-example-error]:not([hidden])').allTextContents();
   const unknown=await page.evaluate(()=>[...new Set([...document.querySelectorAll('main .preview *')].filter(e=>e.localName.startsWith('acme-')&&!customElements.get(e.localName)).map(e=>e.localName))]);
   assert.deepEqual(failures,[]);assert.deepEqual(unknown,[]);assert.deepEqual(errors,[]);
   results.push({engine,route,pass:true});
  } catch(e) {results.push({engine,route,pass:false,error:String(e),errors}); console.log(engine,'FAIL',route,String(e));}
 }
 console.log(engine,'checked',routes.length,'pages');await browser.close();
}
await Bun.write(".artifacts/m23-docs/fullsite-results.json",JSON.stringify(results,null,2));
if(results.some(r=>!r.pass))process.exitCode=1;
