import { chromium } from '/Users/peterkloss/Library/Caches/acme-design-system/browser-checks/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto('http://localhost:4311');await page.waitForTimeout(1000);
console.log(JSON.stringify({errors,html:await page.locator('consumer-table').evaluate(e=>e.shadowRoot.innerHTML),state:await page.locator('consumer-table').evaluate(e=>({rows:e.rows?.length,items:e.virtual.getVirtualizer().getVirtualItems(),count:e.renderCount}))},null,2));
await browser.close();
