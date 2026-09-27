import { register as registerMarkdown } from "@acmelabs/design-system/register/markdown";
import { register as registerJsonView } from "@acmelabs/design-system/register/json-view";
import { register as registerTab } from "@acmelabs/design-system/register/tab";
import { register as registerTabPanel } from "@acmelabs/design-system/register/tab-panel";
import { register as registerButton } from "@acmelabs/design-system/register/button";
import { register as registerTabs } from "@acmelabs/design-system/register/tabs";
import { AcmeButton } from '@acmelabs/design-system/components/button';
import { AcmeSpinner } from '@acmelabs/design-system/components/spinner';
import { AcmeInput } from '@acmelabs/design-system/components/input';
import { AcmeBox } from '@acmelabs/design-system/components/box';

declare global {interface Window {bootstrap:any; output:any}}
const native=window.bootstrap.capability.supported;
const results:any[]=[]; (window as any).progress=results;
const record=(name:string,pass:boolean,observed:any)=>results.push({name,pass,observed});
const settle=async(el:any)=>{for(let i=0;i<3;i++){await el.updateComplete;await new Promise(r=>setTimeout(r,0));}};
const createRoot=(host:HTMLElement,registry:CustomElementRegistry)=>host.attachShadow({mode:'open',...(native?{customElementRegistry:registry}:{customElements:registry})} as ShadowRootInit);
record('class-only imports do not register global definitions',['acme-button','acme-spinner','acme-input','acme-box'].every(tag=>!customElements.get(tag)),{});
const registries=[new CustomElementRegistry(),new CustomElementRegistry()];
const classes=registries.map((registry,i)=>{
 class Button extends AcmeButton {marker=i;}
 class Spinner extends AcmeSpinner {}
 class Input extends AcmeInput {}
 class Box extends AcmeBox {}
 registry.define('acme-button',Button);registry.define('acme-spinner',Spinner);registerButton(registry);registerButton(registry);registerTabs(registry);registerTab(registry);registerTabPanel(registry);registerMarkdown(registry);registerJsonView(registry);registry.define('acme-input',Input);registry.define('acme-box',Box);
 return{Button,Spinner,Input,Box};
});
const hosts=registries.map((registry)=>{const host=document.createElement('div');document.body.append(host);const root=createRoot(host,registry);root.innerHTML='<form><acme-input name="value"></acme-input><acme-button loading>Save</acme-button><acme-box padding="12px">Body</acme-box><acme-tabs><acme-tab value="first">First</acme-tab><acme-tab value="second">Second</acme-tab><acme-tab-panel slot="panels" value="first">One</acme-tab-panel><acme-tab-panel slot="panels" value="second">Two</acme-tab-panel></acme-tabs><acme-markdown></acme-markdown><acme-json-view></acme-json-view></form>';return host;});
const roots=hosts.map(h=>h.shadowRoot!);
const inputs=roots.map(r=>r.querySelector('acme-input') as AcmeInput);
const buttons=roots.map(r=>r.querySelector('acme-button') as AcmeButton);
const boxes=roots.map(r=>r.querySelector('acme-box') as AcmeBox);
await Promise.all([...inputs,...buttons,...boxes].map(settle));
record('two registries resolve identical public names to independent classes',roots.every((r,i)=>r.querySelector('acme-button') instanceof classes[i].Button&&r.querySelector('acme-input') instanceof classes[i].Input),{global:customElements.get('acme-button')?.name??null,markers:buttons.map((b:any)=>b.marker)});
const spinners=buttons.map(b=>b.shadowRoot!.querySelector('acme-spinner'));
await Promise.all(spinners.filter(Boolean).map(settle));
record('owned loading indicator uses its enclosing registration scope',spinners.every((s,i)=>s instanceof classes[i].Spinner&&!!s.shadowRoot?.firstElementChild),spinners.map((s,i)=>({tag:s?.tagName,constructor:s?.constructor.name,rendered:!!s?.shadowRoot?.firstElementChild,registryNative:(s?.getRootNode() as any)?.customElementRegistry===registries[i]})));
const tabs=roots.map(r=>r.querySelector('acme-tabs') as any);await Promise.all(tabs.map(settle));
const indicators=tabs.map(t=>t.shadowRoot.querySelector('acme-selection-indicator'));await Promise.all(indicators.map(settle));
record('private owned dependency registers and renders in each local scope',indicators.every((e,i)=>e instanceof registries[i].get('acme-selection-indicator')!&&!!e.shadowRoot),indicators.map(e=>({constructor:e.constructor.name,rendered:!!e.shadowRoot})));
await Promise.all(tabs.flatMap(t=>Array.from(t.children)).map(settle));
const secondTab=tabs[0].querySelector('acme-tab[value=second]');secondTab.shadowRoot.querySelector('button').click();await settle(tabs[0]);await settle(secondTab);
record('scoped Tabs updates selection through its owned family',tabs[0].value==='second'&&secondTab.shadowRoot.querySelector('button').getAttribute('aria-selected')==='true',{value:tabs[0].value,selected:secondTab.shadowRoot.querySelector('button').getAttribute('aria-selected')});
const markdown=roots[0].querySelector('acme-markdown') as any,jsonView=roots[0].querySelector('acme-json-view') as any;markdown.text='```text\nalpha\n```';jsonView.value={nested:{value:1}};await Promise.all([settle(markdown),settle(jsonView)]);
const area=markdown.querySelector('acme-scroll-area'),viewport=markdown.querySelector('acme-scroll-viewport'),chevron=jsonView.shadowRoot.querySelector('acme-chevron-right-icon');await Promise.all([area,viewport,chevron].map(settle));
record('Markdown creates its Scroll Area and Viewport in the local registry',area instanceof registries[0].get('acme-scroll-area')!&&viewport instanceof registries[0].get('acme-scroll-viewport')!&&!!viewport.shadowRoot&&viewport.textContent.includes('alpha'),{area:area?.constructor.name,viewport:viewport?.constructor.name,rendered:!!viewport?.shadowRoot});
record('JSONView creates its disclosure icon in the local registry',chevron instanceof registries[0].get('acme-chevron-right-icon')!&&!!chevron.shadowRoot?.querySelector('svg'),{constructor:chevron?.constructor.name,rendered:!!chevron?.shadowRoot?.querySelector('svg')});
const conflict=new CustomElementRegistry();class Unrelated extends HTMLElement{}conflict.define('acme-button',Unrelated);let rejected=false;try{registerButton(conflict);}catch(e){rejected=e instanceof TypeError;}record('explicit registration rejects an unrelated constructor',rejected&&conflict.get('acme-button')===Unrelated,{rejected});
inputs[0].value='before';
record('scoped control submits its current value synchronously',new FormData(roots[0].querySelector('form')!).get('value')==='before',{entries:[...new FormData(roots[0].querySelector('form')!)]});
const sheets=boxes[0].shadowRoot!.adoptedStyleSheets.slice();
const padding=(box:AcmeBox)=>box.ownerDocument.defaultView!.getComputedStyle(box).paddingTop;
record('scoped Box applies its public style input',padding(boxes[0])==='12px',{padding:padding(boxes[0]),sheetCount:sheets.length});
hosts[0].remove();inputs[0].value='reconnected';document.body.append(hosts[0]);await settle(inputs[0]);
record('reconnect preserves identity and state',roots[0].querySelector('acme-input')===inputs[0]&&new FormData(roots[0].querySelector('form')!).get('value')==='reconnected',{value:inputs[0].shadowRoot!.querySelector('input')?.value});
const frame=document.createElement('iframe');frame.srcdoc='<!doctype html><body></body>';const loaded=new Promise(r=>frame.onload=r);document.body.append(frame);await loaded;
frame.contentDocument!.body.append(frame.contentDocument!.adoptNode(hosts[0]));inputs[0].value='adopted';boxes[0].padding='17px';await Promise.all([settle(inputs[0]),settle(boxes[0])]);
record('adoption preserves form, state and destination-owned styles',inputs[0].ownerDocument===frame.contentDocument&&new (frame.contentWindow as any).FormData(roots[0].querySelector('form')).get('value')==='adopted'&&padding(boxes[0])==='17px'&&boxes[0].shadowRoot!.adoptedStyleSheets.length>0,{value:inputs[0].shadowRoot!.querySelector('input')?.value,padding:padding(boxes[0]),sheets:boxes[0].shadowRoot!.adoptedStyleSheets.length,newSheets:boxes[0].shadowRoot!.adoptedStyleSheets.every(s=>!sheets.includes(s))});
markdown.text='```text\nbeta\n```';jsonView.value={later:{newItem:true}};await Promise.all([settle(markdown),settle(jsonView)]);
const movedArea=markdown.querySelector('acme-scroll-area'),movedViewport=markdown.querySelector('acme-scroll-viewport'),movedIcons=Array.from(jsonView.shadowRoot.querySelectorAll('acme-chevron-right-icon')) as HTMLElement[];await Promise.all([movedArea,movedViewport,...movedIcons].map(settle));
record('imperative owned elements created after adoption use local classes and destination document',movedArea!==area&&movedArea instanceof registries[0].get('acme-scroll-area')!&&movedViewport instanceof registries[0].get('acme-scroll-viewport')!&&movedArea.ownerDocument===frame.contentDocument&&movedViewport.textContent.includes('beta')&&movedIcons.length>0&&movedIcons.every(i=>i instanceof registries[0].get('acme-chevron-right-icon')!&&i.ownerDocument===frame.contentDocument),{newArea:movedArea!==area,area:movedArea?.constructor.name,viewport:movedViewport?.constructor.name,icons:movedIcons.map(i=>i.constructor.name)});
buttons[0].loading=false;await settle(buttons[0]);buttons[0].loading=true;await settle(buttons[0]);const newSpinner=buttons[0].shadowRoot!.querySelector('acme-spinner');await settle(newSpinner);record('new owned child after adoption retains local registry and destination document',newSpinner instanceof classes[0].Spinner&&newSpinner.ownerDocument===frame.contentDocument&&!!newSpinner.shadowRoot,{constructor:newSpinner?.constructor.name,rendered:!!newSpinner?.shadowRoot});
document.body.append(document.adoptNode(hosts[0]));inputs[0].value='returned';boxes[0].padding='19px';await Promise.all([settle(inputs[0]),settle(boxes[0])]);
record('return adoption restores styles and updates',padding(boxes[0])==='19px'&&new FormData(roots[0].querySelector('form')!).get('value')==='returned',{padding:padding(boxes[0]),sameSheets:boxes[0].shadowRoot!.adoptedStyleSheets.every(s=>sheets.includes(s))});
const lateHost=document.createElement('div'),lateRegistry=new CustomElementRegistry(),lateRoot=createRoot(lateHost,lateRegistry);document.body.append(lateHost);lateRoot.innerHTML='<scope-late-box></scope-late-box>';const late=lateRoot.firstElementChild;class LateBox extends AcmeBox{}lateRegistry.define('scope-late-box',LateBox);await settle(late);record('late definition before adoption upgrades core class',late instanceof LateBox,{constructor:late?.constructor.name});
const reduction=async(tag:string,Base:any)=>{const host=document.createElement('div'),registry=new CustomElementRegistry(),root=createRoot(host,registry);root.innerHTML=`<${tag}></${tag}>`;const child:any=root.firstElementChild;document.body.append(host);frame.contentDocument!.body.append(frame.contentDocument!.adoptNode(host));class Late extends Base{marker=true;}registry.define(tag,Late);await settle(child);const automatic=child instanceof Late;registry.upgrade(child);registry.upgrade(root);await settle(child);return{automatic,afterExplicitUpgrade:child instanceof Late,marker:child.marker??null,ownerDocument:child.ownerDocument===frame.contentDocument};};
const lateAfterAdoption={core:await reduction('scope-adopted-box',AcmeBox),plain:await reduction('scope-adopted-plain',HTMLElement)};
if(!native){await new Promise((resolve,reject)=>{const script=frame.contentDocument!.createElement('script');script.type='module';script.src='/polyfill.js';script.onload=resolve;script.onerror=reject;frame.contentDocument!.head.append(script);});Object.assign(lateAfterAdoption,{bothDocumentsPolyfilled:await reduction('scope-adopted-both',HTMLElement)});}
record('registration remains globally isolated',['acme-button','acme-spinner','acme-input','acme-box','scope-late-box'].every(tag=>!customElements.get(tag)),{});
window.output={mode:native?'native':'polyfill',results,lateAfterAdoption};
