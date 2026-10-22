const build=await Bun.build({entrypoints:['main.ts'],outdir:'dist',target:'browser'});if(!build.success){console.error(build.logs);process.exit(1)}
Bun.serve({port:4318,hostname:'127.0.0.1',fetch(req){const p=new URL(req.url).pathname;return new Response(Bun.file(p==='/'?'index.html':'dist'+p));}});console.log('http://127.0.0.1:4318');
