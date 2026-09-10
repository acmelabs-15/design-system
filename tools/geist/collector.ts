// Receives census results from the browser (any origin) and writes tools/geist/census/<page>.<side>.json.
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dir, "census");
fs.mkdirSync(OUT, { recursive: true });
const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type", "access-control-allow-methods": "POST, GET, OPTIONS" };

Bun.serve({
  port: 4183,
  async fetch(req) {
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(req.url);
    if (url.pathname === "/census.js") return new Response(Bun.file(path.join(import.meta.dir, "census.js")), { headers: { ...cors, "content-type": "text/javascript" } });
    if (req.method === "POST" && url.pathname === "/census") {
      const body = (await req.json()) as { side: string; page: string };
      const file = path.join(OUT, `${body.page}.${body.side}.json`);
      fs.writeFileSync(file, JSON.stringify(body, null, 1));
      console.log("saved", file);
      return new Response("ok", { headers: cors });
    }
    return new Response("not found", { status: 404, headers: cors });
  },
});
console.log("census collector on http://localhost:4183");
