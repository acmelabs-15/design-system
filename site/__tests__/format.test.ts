import { expect, test } from 'bun:test';
import { formatHtml } from '../format';
test('example formatting preserves executable comparisons and string contents',async()=>{
 const formatted=await formatHtml('<script>const values=[];for(let i=0;i<2;i++)values.push("two  spaces");</script>');
 const script=/<script>([\s\S]*)<\/script>/.exec(formatted)![1];
 expect(new Function(script+';return values;')()).toEqual(['two  spaces','two  spaces']);
});
test('example formatting preserves quoted attributes and significant inline text',async()=>{
 const source='<div data-rule="a > b" title="two  spaces"><span>A</span><span>B</span><pre> a\n  b </pre><code> x  y </code></div>';
 const before=document.createElement('template'),after=document.createElement('template');before.innerHTML=source;after.innerHTML=await formatHtml(source);
 expect(after.content.firstElementChild!.getAttribute('data-rule')).toBe('a > b');expect(after.content.firstElementChild!.getAttribute('title')).toBe('two  spaces');expect(after.content.textContent).toBe(before.content.textContent);
});
test('nested lazy templates retain significant author text',async()=>{
 const source='<template><acme-text><span>A</span><span>B</span></acme-text><acme-text> line\n  next </acme-text></template>';
 const before=document.createElement('template'),after=document.createElement('template');before.innerHTML=source;after.innerHTML=await formatHtml(source);
 expect((after.content.firstElementChild as HTMLTemplateElement).content.textContent).toBe((before.content.firstElementChild as HTMLTemplateElement).content.textContent);
});
