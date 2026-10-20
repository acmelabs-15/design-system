const root = import.meta.dir;
Bun.serve({port:4313,async fetch(request){const path=new URL(request.url).pathname;return new Response(Bun.file(root+(path==='/'?'/index.html':path)));}});
console.log('http://localhost:4313');
