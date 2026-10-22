import { chromium } from '/Users/peterkloss/Library/Caches/acme-design-system/browser-checks/node_modules/playwright/index.mjs';
const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page = await browser.newPage(); page.on('pageerror',error => console.log('PAGEERROR',error.message));
await page.goto('http://localhost:4317'); await page.waitForTimeout(500);
console.log(await page.locator('body').innerText());
console.log(await page.locator('acme-tab,acme-radio-card').evaluateAll(elements => elements.map(el=>({tag:el.tagName, html:el.shadowRoot?.innerHTML}))));
const cdp = await page.context().newCDPSession(page); console.log(JSON.stringify((await cdp.send('Accessibility.getFullAXTree')).nodes.filter(n=>['tab','tablist','radio','radiogroup','tabpanel'].includes(n.role?.value)).map(n=>({role:n.role?.value,name:n.name?.value,properties:n.properties})),null,2));
await page.screenshot({path:'initial.png',fullPage:true});
await browser.close();
