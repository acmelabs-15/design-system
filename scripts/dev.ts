/// <reference types="bun" />
// Dev server, pure Bun: serves /docs on :4180 and rebuilds the library and the docs when src/ or
// docs-src/ changes. The docs are a single-page app, so a path with no file behind it (a deep
// link like /components/button) falls back to index.html, as GitHub Pages does through 404.html.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const DOCS = path.join(ROOT, "docs");
const build = async () => {
  const t = Date.now();
  const r = Bun.spawnSync(["bun", "scripts/build.ts"], { cwd: ROOT, stdout: "inherit", stderr: "inherit" });
  if (r.exitCode === 0) Bun.spawnSync(["bun", "docs-src/build.ts"], { cwd: ROOT, stdout: "inherit", stderr: "inherit" });
  console.log(`rebuilt in ${Date.now() - t} ms`);
};
if (!process.argv.includes("--no-build")) await build();
let timer: ReturnType<typeof setTimeout> | undefined;
if (!process.argv.includes("--no-watch"))
  for (const d of ["src", "docs-src"])
    fs.watch(path.join(ROOT, d), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(build, 200);
    });
Bun.serve({
  port: 4180,
  async fetch(req) {
    const p = decodeURIComponent(new URL(req.url).pathname);
    let file = Bun.file(path.join(DOCS, p.endsWith("/") ? `${p}index.html` : p));
    if (!(await file.exists()) && !path.extname(p)) file = Bun.file(path.join(DOCS, "index.html"));
    return (await file.exists()) ? new Response(file, { headers: { "cache-control": "no-store" } }) : new Response("not found", { status: 404 });
  },
});
console.log("docs at http://localhost:4180/  (watching src/ and docs-src/)");
