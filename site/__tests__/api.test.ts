import { expect, test } from 'bun:test';
import type { Package } from 'custom-elements-manifest/schema';
import { apiFromManifest, apiSections } from '../api';
import { docApi } from '../site';
import { docToMarkdown } from '../markdown';
const fixture={schemaVersion:'1.0.0','x-acme-version':'1.2.3',modules:[{kind:'javascript-module',path:'dist/probe.js','x-acme-source':'src/probe.ts',declarations:[{kind:'class',name:'AcmeProbe',tagName:'acme-probe',customElement:true,members:[{kind:'field',name:'value',type:{text:'string'},inheritedFrom:{name:'Base',module:'dist/base.js'}},{kind:'field',name:'valid',type:{text:'boolean'},readonly:true},{kind:'field',name:'query',privacy:'private'},{kind:'method',name:'focus',parameters:[{name:'options',optional:true,type:{text:'FocusOptions'}}],return:{type:{text:'void'}}}],attributes:[{name:'value',fieldName:'value',type:{text:'string'}},{name:'form',type:{text:'string'},description:'Associated form ID'}],slots:[{name:'',description:'Primary content'}],events:[{name:'acme-change',description:'A committed value',type:{text:'CustomEvent<{value:string}>'},'x-acme-options':{bubbles:true,composed:true,cancelable:false}}],cssParts:[{name:'control',description:'Native control'}],cssProperties:[{name:'--control-size',default:'1rem',description:'Control size'}]}]}]} as unknown as Package;
test('one API model preserves complete manifest categories and source ownership',()=>{
 const [api]=apiFromManifest(fixture);expect(api.version).toBe('1.2.3');expect(api.props.map(p=>p.name)).toEqual(['value','valid']);expect(api.props[0].inherited).toBe('Base');expect(api.props[1].readonly).toBe(true);expect(api.attributes[0].name).toBe('form');expect(api.methods[0].signature).toBe('focus(options?: FocusOptions): void');expect(api.events[0]).toMatchObject({name:'acme-change',type:'CustomEvent<{value:string}>',bubbles:true,composed:true,cancelable:false});expect(api.parts[0].doc).toBe('Native control');expect(api.cssProperties[0].default).toBe('1rem');
});
test('HTML and Markdown consume the same complete API sections',()=>{
 const sections=apiSections(apiFromManifest(fixture)[0]);expect(sections.map(s=>s.heading)).toEqual(['Attributes and properties','Additional attributes','Methods','Slots','Events','CSS parts','CSS custom properties']);const cells=sections.flatMap(s=>s.rows.flat());for(const text of ['Associated form ID','focus(options?: FocusOptions): void','Primary content','CustomEvent<{value:string}>','Native control','--control-size'])expect(cells).toContain(text);
});
test('rendered references retain methods, event payloads and styling hooks in both formats',async()=>{
 const [api]=apiFromManifest(fixture),html=docApi([api]);
 const markdown=(await docToMarkdown({id:'probe',title:'Probe',lede:'Probe',tags:['acme-probe'],examples:[]},new Map([[api.tag,api]]))).join('\n');
 for(const value of ['focus(options?: FocusOptions): void','CSS parts','CSS custom properties','--control-size','Read only','Base','1.2.3']){expect(html).toContain(value);expect(markdown).toContain(value)}
 expect(html).toContain('CustomEvent&lt;{value:string}&gt;');expect(markdown).toContain('CustomEvent<{value:string}>');
});
