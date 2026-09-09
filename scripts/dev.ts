/// <reference types="bun" />
// Dev server, pure Bun: serves /docs on :4180, rebuilds the library and the docs when src/ or docs-src/ changes.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const build = async () => {
  const t = Date.now();
  const r = Bun.spawnSync(["bun", "scripts/build.ts"], { cwd: ROOT, stdout: "inherit", stderr: "inherit" });
  if (r.exitCode === 0) Bun.spawnSync(["bun", "docs-src/build.ts"], { cwd: ROOT, stdout: "inherit", stderr: "inherit" });
  console.log(`rebuilt in ${Date.now() - t} ms`);
};
await build();
let timer: ReturnType<typeof setTimeout> | undefined;
for (const d of ["src", "docs-src"])
  fs.watch(path.join(ROOT, d), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 200);
  });
Bun.serve({
  port: 4180,
  fetch(req) {
    const u = new URL(req.url);
    let p = decodeURIComponent(u.pathname);
    if (p.endsWith("/")) p += "index.html";
    const f = Bun.file(path.join(ROOT, /^\/(dist|tokens.css|dashboard.css)/.test(p) ? "" : "docs", p));
    return f.size ? new Response(f, { headers: { "cache-control": "no-store" } }) : new Response("not found", { status: 404 });
  },
});
console.log("docs at http://localhost:4180/  (watching src/ and docs-src/)");
