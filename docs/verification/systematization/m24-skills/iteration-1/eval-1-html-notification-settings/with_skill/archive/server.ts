const root = import.meta.dir;
const prefix = '/npm/@acmelabs/design-system@0.2.0/';
Bun.serve({port: 43127, async fetch(request) {
  const path = new URL(request.url).pathname;
  const filePath = path.startsWith(prefix) ? root + '/node_modules/@acmelabs/design-system/' + path.slice(prefix.length) : root + (path === '/' ? '/index.html' : path);
  const file = Bun.file(filePath);
  if (!(await file.exists())) return new Response('Not found', {status: 404});
  return new Response(file, {headers: {'Access-Control-Allow-Origin': '*'}});
}});
console.log('Serving http://localhost:43127');
