import path from "node:path";
const runtime=process.env.ACME_BROWSER_RUNTIME??"/Users/peterkloss/Library/Caches/acme-design-system/browser-checks";
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(runtime,"browsers");
const engines=await import(path.join(runtime,"node_modules/playwright/index.mjs"));
const base=process.env.ACME_DOCS_URL??"http://127.0.0.1:4180";
const output=process.env.ACME_APPEARANCE_OUTPUT??import.meta.dir;
const report:any={date:new Date().toISOString(),runtime:Bun.version,base,fontSource:"notes/decisions/parity-scope.md",expectedFonts:["Google Sans Flex","Google Sans Code"],engines:[]};
for(const name of ["chromium","firefox","webkit"]){
 const browser=await engines[name].launch({headless:true,...(name==="chromium"&&process.env.ACME_CHROMIUM_PATH?{executablePath:process.env.ACME_CHROMIUM_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:"reduce"});
 page.setDefaultTimeout(15000);const errors:string[]=[];const requests:any[]=[];const matrix:any[]=[];
 page.on("pageerror",error=>errors.push(String(error)));
 page.on("response",response=>{if(/fonts\.(googleapis|gstatic)\.com/.test(response.url()))requests.push({url:response.url(),status:response.status()});});
 page.on("requestfailed",request=>{if(/fonts\.(googleapis|gstatic)\.com/.test(request.url()))requests.push({url:request.url(),failure:request.failure()?.errorText});});
 try{
  for(const route of ["forms","tabs","table","group"]){
   await page.goto(base+"/components/"+route,{waitUntil:"domcontentloaded"});await page.locator("main h1").waitFor();await page.locator(".showcase .preview").first().waitFor();
   const fontLoad=await page.evaluate(async()=>{
    const load=Promise.all([document.fonts.load('400 16px "Google Sans Flex"',"Heading Sample 0123"),document.fonts.load('400 16px "Google Sans Code"',"const value = 123")]).then(results=>({complete:true,counts:results.map(result=>result.length),faces:results.flat().map(face=>({family:face.family,status:face.status,weight:face.weight,style:face.style}))})).catch(error=>({complete:false,error:String(error)}));
    return await Promise.race([load,new Promise(resolve=>setTimeout(()=>resolve({complete:false,error:"Font loading exceeded20seconds"}),20000))]);
   });
   for(const appearance of ["light","dark"]){
    await page.emulateMedia({colorScheme:appearance});
    for(const width of [1280,768,320]){
     await page.setViewportSize({width,height:1000});await page.evaluate(()=>window.scrollTo(0,0));
     await page.waitForTimeout(150);
     const observation=await page.evaluate(()=>{
      const rect=(e:Element|null)=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
      const heading=document.querySelector("main h1"),nav=document.querySelector(".docs-page-navigation"),header=document.querySelector(".docs-header"),main=document.querySelector("main")!;
      return{heading:heading?.textContent,headingRect:rect(heading),nav:rect(nav),header:rect(header),main:rect(main),scrollWidth:document.documentElement.scrollWidth,innerWidth,background:getComputedStyle(document.body).backgroundColor,foreground:getComputedStyle(document.body).color,headingFont:getComputedStyle(heading!).fontFamily,headingWeight:getComputedStyle(heading!).fontWeight,monoToken:getComputedStyle(main).getPropertyValue("--acme-font-mono"),codeTransform:document.querySelector("main code")?getComputedStyle(document.querySelector("main code")!).textTransform:null,monoFont:document.querySelector("main code")?getComputedStyle(document.querySelector("main code")!).fontFamily:null,theme:document.querySelector("acme-theme")?.getAttribute("data-dark"),fonts:[...document.fonts].filter(f=>f.status==="loaded").map(f=>({family:f.family,status:f.status,weight:f.weight,style:f.style})),examples:[...document.querySelectorAll(".showcase .preview")].map(e=>({rect:rect(e),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth})),visibleExampleErrors:[...document.querySelectorAll("[data-example-error]:not([hidden])")].map(e=>e.textContent)};
     });
     let platformFonts:any;
     if(name==="chromium"){
      const cdp=await page.context().newCDPSession(page);await cdp.send("DOM.enable");await cdp.send("CSS.enable");const doc=await cdp.send("DOM.getDocument");
      platformFonts={};for(const selector of ["main h1",".docs-brand strong","main code"]){const{nodeId}=await cdp.send("DOM.querySelector",{nodeId:doc.root.nodeId,selector});if(nodeId)platformFonts[selector]=(await cdp.send("CSS.getPlatformFontsForNode",{nodeId})).fonts;}
      await cdp.detach();
     }
     const screenshot=`${name}-${route}-${appearance}-${width}.png`;await page.screenshot({path:path.join(output,screenshot)});
     await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"}));await page.waitForTimeout(80);
     const bottom=await page.evaluate(()=>{const nav=document.querySelector(".docs-page-navigation")!.getBoundingClientRect(),article=document.querySelector("main article")!.getBoundingClientRect();return{navTop:nav.top,articleBottom:article.bottom,navHeight:nav.height,padding:parseFloat(getComputedStyle(document.querySelector("main")!).paddingBottom)};});
     const fontFamilies=new Set((fontLoad as any).faces?.filter(f=>f.status==="loaded").map(f=>f.family.replaceAll('"',""))??[]);
     const checks={codeCase:observation.codeTransform===null||observation.codeTransform==="none",bottomClearance:bottom.articleBottom<=bottom.navTop+1&&bottom.padding>=bottom.navHeight,fontsLoaded:fontFamilies.has("Google Sans Flex")&&fontFamilies.has("Google Sans Code")&&observation.fonts.some(f=>f.family.replaceAll('"',"")==="Google Sans Flex"),noPageOverflow:observation.scrollWidth<=width,noExampleOverflow:observation.examples.every(e=>e.scrollWidth<=e.clientWidth+1),navigationFits:observation.nav!==null&&observation.nav.right<=width+1&&observation.nav.x>=-1&&observation.nav.bottom<=1001,headingVisible:observation.headingRect!==null&&observation.headingRect.width>0&&observation.headingRect.right<=width+1,noExampleErrors:observation.visibleExampleErrors.length===0,themeMatches:appearance==="dark"?observation.theme!==null:observation.theme===null,actualMonoFont:name!=="chromium"||!platformFonts?.["main code"]||platformFonts["main code"].some(f=>f.glyphCount>0&&((f.isCustomFont&&f.familyName.startsWith("Google Sans Code"))||(!f.isCustomFont&&f.familyName.startsWith("GoogleSansCode NFM")&&observation.monoToken.includes("GoogleSansCode Nerd Font Mono")))),actualHeadingFont:name!=="chromium"||platformFonts?.["main h1"]?.some(f=>f.isCustomFont&&f.glyphCount>0&&f.familyName.startsWith("Google Sans Flex"))};
     matrix.push({route,appearance,width,fontLoad,checks,pass:Object.values(checks).every(Boolean),observation,bottom,platformFonts,screenshot});
    }
   }
  }
 }catch(error){errors.push(String(error));}finally{await browser.close();}
 report.engines.push({name,version:browser.version(),errors,requests,matrix});
 await Bun.write(path.join(output,"results.json"),JSON.stringify(report,null,2));
 console.log(name,JSON.stringify({pass:matrix.filter(r=>r.pass).length,total:matrix.length,errors,failed:matrix.filter(r=>!r.pass).map(r=>({route:r.route,appearance:r.appearance,width:r.width,checks:r.checks,fontLoad:r.fontLoad}))}));
}
if(report.engines.some(e=>e.errors.length||e.matrix.length!==24||e.matrix.some(r=>!r.pass)))process.exitCode=1;
