import { expect, test } from 'bun:test';
import { ExampleController } from '../example';
function fixture(script:string){const host=document.createElement('div');host.dataset.script=script;host.innerHTML='<template data-example-markup><button>Run</button><output></output></template><div class="preview"><button>Run</button><output></output></div><button data-example-reset>Reset</button><p data-example-error hidden></p>';document.body.append(host);return host;}
test('reset cleans the old mount before recreating its real author nodes',()=>{
 const host=fixture('root.dataset.started="yes";return ()=>{root.dataset.stopped="yes"};'),controller=new ExampleController(host,{}),old=host.querySelector('.preview') as HTMLElement;
 expect(old.dataset.started).toBe('yes');controller.reset();expect(old.dataset.stopped).toBe('yes');expect(host.querySelector('.preview')).not.toBe(old);controller.dispose();expect((host.querySelector('.preview') as HTMLElement).dataset.stopped).toBe('yes');host.remove();
});
test('setup errors are visible and emit the documented error event',()=>{
 const host=fixture('throw new Error("Example failed")');let detail:unknown;host.addEventListener('acme-error',event=>detail=(event as CustomEvent).detail);const controller=new ExampleController(host,{});expect((host.querySelector('[data-example-error]') as HTMLElement).hidden).toBe(false);expect(host.textContent).toContain('Example failed');expect(detail).toMatchObject({code:'example',message:'Example failed'});controller.dispose();host.remove();
});
test('disposed reset listeners cannot remount an example',()=>{
 const host=fixture('root.textContent="Mounted"'),controller=new ExampleController(host,{});controller.dispose();host.querySelector('.preview')!.textContent='Stopped';(host.querySelector('[data-example-reset]') as HTMLElement).click();expect(host.querySelector('.preview')!.textContent).toBe('Stopped');host.remove();
});
