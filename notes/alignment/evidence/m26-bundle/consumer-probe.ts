import * as library from '@acmelabs/design-system';
const results:any[]=[];const check=(name:string,ok:boolean)=>results.push({name,ok});
try{
check('class-only package import stays inert',customElements.get('acme-text')===undefined&&typeof library.AcmeHeading==='function');
await import('@acmelabs/design-system/define/text');await import('@acmelabs/design-system/define/heading');await import('@acmelabs/design-system/define/kbd');await import('@acmelabs/design-system/define/code');await import('@acmelabs/design-system/define/relative-time');
document.body.innerHTML='<acme-text size="18px">Text</acme-text><acme-heading as="h3" id="target">Heading</acme-heading><acme-kbd keys=\'["Control","K"]\'></acme-kbd><acme-code>const value = 1;</acme-code><acme-relative-time date="0" auto-update="false"></acme-relative-time>';
for(const el of document.body.children)if('updateComplete' in el)await el.updateComplete;
check('packed text styles and heading semantics are present',getComputedStyle(document.querySelector('acme-text')!).fontSize==='18px'&&(document.querySelector('acme-heading') as library.AcmeHeading).getHeadingElement().localName==='h3');
check('packed inline code and keyboard labels render',!!document.querySelector('acme-code')!.shadowRoot!.querySelector('code')&&document.querySelector('acme-kbd')!.shadowRoot!.textContent!.includes('K'));
check('packed relative time retains epoch zero',document.querySelector('acme-relative-time')!.shadowRoot!.querySelector('time')!.dateTime==='1970-01-01T00:00:00.000Z');
(window as any).__results={results};
}catch(error){(window as any).__results={results,error:String(error)}}
