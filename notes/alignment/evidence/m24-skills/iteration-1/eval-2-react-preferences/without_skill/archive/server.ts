const root = import.meta.dir;
Bun.serve({port: 4317, fetch(request) { const path = new URL(request.url).pathname; if (path === "/favicon.ico") return new Response(null,{status:204}); return new Response(Bun.file(root + (path === '/' ? '/index.html' : path))); }});
