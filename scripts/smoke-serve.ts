import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
Bun.serve({
  port: 4180,
  fetch(req) {
    let p = decodeURIComponent(new URL(req.url).pathname);
    if (p.endsWith("/")) p += "index.html";
    const f = Bun.file(path.join(ROOT, /^\/(dist|tokens\.css|dashboard\.css)/.test(p) ? "" : "docs", p));
    return f.size ? new Response(f, { headers: { "cache-control": "no-store" } }) : new Response("not found", { status: 404 });
  },
});
