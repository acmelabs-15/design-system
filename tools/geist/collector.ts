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
    // The motion reader, for a check that measures an animation rather than a resting style.
    if (url.pathname === "/run.js") return new Response(Bun.file(path.join(import.meta.dir, "run.js")), { headers: { ...cors, "content-type": "text/javascript" } });
    if (url.pathname === "/motion.js") return new Response(Bun.file(path.join(import.meta.dir, "motion.js")), { headers: { ...cors, "content-type": "text/javascript" } });
    // A saved census configuration, so a page can fetch the exact recorded run instead of having it
    // pasted in. The recorded config is what makes a run repeatable; reading it over HTTP keeps the
    // browser side of the loop a one-liner.
    if (url.pathname.startsWith("/config/")) {
      const name = url.pathname.slice("/config/".length).replace(/[^\w.-]/g, "");
      const file = path.join(OUT, `${name}.config.json`);
      if (!fs.existsSync(file)) return new Response(`no config for ${name}`, { status: 404, headers: cors });
      return new Response(Bun.file(file), { headers: { ...cors, "content-type": "application/json" } });
    }
    // A DOM capture from a live page, saved under capture/<name>.json. The reference renders some
    // elements only after an interaction — the calendar draws a skeleton until its trigger is clicked,
    // on the live site as well as the mirror — so their markup cannot be extracted from the served
    // HTML. Opening the state in a real browser and posting the tree here is the source a sketch is
    // then written from, and it beats reconstructing class strings out of the compiled chunks.
    if (req.method === "POST" && url.pathname.startsWith("/capture/")) {
      const name = url.pathname.slice("/capture/".length).replace(/[^\w.-]/g, "");
      const dir = path.join(import.meta.dir, "capture");
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${name}.json`);
      fs.writeFileSync(file, JSON.stringify(await req.json(), null, 1));
      console.log("captured", file);
      return new Response("ok", { headers: cors });
    }
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
