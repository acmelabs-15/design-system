import { chromium } from '/Users/peterkloss/Library/Caches/acme-design-system/browser-checks/node_modules/playwright/index.mjs';
const checks: object[] = [];
const failures: object[] = [
 {phase:"result reporting",error:"Pass threshold expected 15 checks but harness defines 14; all 14 passed.",repair:"Corrected check count to 14."},
 {phase: "browser harness", error: "Plan summary assertion ran after native value changed but before React committed the event update.", repair: "Wait for rendered summary as the end-to-end oracle; preserve first-browser-result.json."},
 {phase:'setup',error:'Evaluation directory did not exist; initial ls returned ENOENT.',repair:'Created assigned evaluation directory.'},
 {phase:'API discovery',error:'card-group.d.ts did not exist.',repair:'Read Group declarations; composed RadioGroup > Group attached > RadioCard.'},
 {phase:'typecheck',error:"TS5103: Invalid value for '--ignoreDeprecations' (6.0).",repair:'Removed unnecessary ignoreDeprecations setting; typecheck passes.'},
];
const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page = await browser.newPage(); const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
const assert = (name:string,pass:boolean,detail?:unknown) => { checks.push({name,pass,detail}); if (!pass) throw new Error(name+': '+JSON.stringify(detail)); };
try {
 await page.goto('http://localhost:4317'); await page.locator('[data-testid=editor]').waitFor();
 const session = await page.context().newCDPSession(page);
 const ax = (await session.send('Accessibility.getFullAXTree')).nodes.filter(n=>['tab','tablist','radio','radiogroup','tabpanel'].includes(n.role?.value)).map(n=>({role:n.role?.value,name:n.name?.value,properties:n.properties}));
 await Bun.write('ax-initial.json',JSON.stringify(ax,null,2));
 assert('Native AX names', ['tablist:Editor views','tab:Source','tab:Output','tabpanel:Source','radiogroup:Plan','radio:Starter','radio:Pro'].every(x=>ax.some(n=>`${n.role}:${n.name}`===x)),ax.map(n=>`${n.role}:${n.name}`));
 assert('Attached surfaces',await page.locator('acme-radio-card').evaluateAll(els=>els.every(el=>el.shadowRoot?.querySelector('[data-acme-group-surface]'))));
 await page.locator('[data-testid=editor]').fill('State survives both tab changes.');
 await page.locator('[data-testid=mount]').focus(); await page.keyboard.press('Tab');
 assert('Keyboard Tab enters selected Source tab',await page.locator('acme-tab').nth(0).locator('button').evaluate(el=>el===el.getRootNode().activeElement));
 await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('acme-tabs')?.value==='output');
 assert('ArrowRight activates Output',await page.locator('[data-testid=summary]').innerText()==='View: output; Plan: starter');
 await page.keyboard.press('ArrowLeft'); await page.locator('[data-testid=editor]').waitFor({state:'visible'});
 assert('Editor state preserved',await page.locator('[data-testid=editor]').inputValue()==='State survives both tab changes.');
 assert('Editor mounted once while switching',await page.evaluate(()=>window.evidence.mounts===1&&window.evidence.cleanups===0),await page.evaluate(()=>window.evidence));
 await page.locator('acme-radio-card').nth(0).locator('input').focus();await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('acme-radio-group')?.value==='pro');
 await page.waitForFunction(()=>document.querySelector('[data-testid=summary]')?.textContent==='View: source; Plan: pro');
 assert('Plan changes independently of tab',await page.locator('[data-testid=summary]').innerText()==='View: source; Plan: pro');
 assert('Exactly one radio selected',await page.locator('acme-radio-card').evaluateAll(els=>els.filter(el=>el.checked).length===1));
 assert('One typed callback per action',JSON.stringify(await page.evaluate(()=>window.evidence.events))===JSON.stringify([{kind:'tab',value:'output'},{kind:'tab',value:'source'},{kind:'plan',value:'pro'}]),await page.evaluate(()=>window.evidence.events));
 await page.locator('[data-testid=mount]').click(); await page.waitForFunction(()=>window.evidence.cleanups===1);
 assert('Unmount removes preferences and cleans editor',await page.locator('acme-tabs').count()===0);
 await page.locator('[data-testid=mount]').click();await page.locator('[data-testid=editor]').waitFor();
 assert('Remount has fresh editor state',await page.locator('[data-testid=editor]').inputValue()==='Hello from Source');
 await page.locator('[data-testid=mount]').focus();await page.keyboard.press('Tab');await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('acme-tabs')?.value==='output');
 await page.locator('acme-radio-card').nth(0).locator('input').focus();await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('acme-radio-group')?.value==='pro');
 assert('Remount callbacks are not duplicated',JSON.stringify(await page.evaluate(()=>window.evidence.events))===JSON.stringify([{kind:'tab',value:'output'},{kind:'tab',value:'source'},{kind:'plan',value:'pro'},{kind:'tab',value:'output'},{kind:'plan',value:'pro'}]),await page.evaluate(()=>window.evidence.events));
 assert('Remount lifecycle counts',await page.evaluate(()=>window.evidence.mounts===2&&window.evidence.cleanups===1),await page.evaluate(()=>window.evidence));
 assert('No page errors',errors.length===0,errors);
 await page.screenshot({path:'verified.png',fullPage:true});
} catch(error) { failures.push({phase:'browser',error:String(error)}); }
await Bun.write('result.json',JSON.stringify({evaluation:'react-baseline',packages:{core:'0.2.0',reactWrappers:'0.2.0',react:'19.3.0',reactDOM:'19.3.0'},build:'pass',typecheck:'pass',checks,firstFailuresAndRepairs:failures,pass:checks.length===14&&checks.every((c:any)=>c.pass),evidence:await page.evaluate(()=>window.evidence)},null,2));
await browser.close();console.log(await Bun.file('result.json').text());
