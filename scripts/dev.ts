/// <reference types="bun" />
// Dev server, pure Bun: serves /_site on :4180 and rebuilds generated styles, the library and the
// docs when authored styles, src/ or site/ changes. A path with no file behind it (a deep
// link like /components/button) falls back to index.html, as GitHub Pages does through 404.html.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const DOCS = path.join(ROOT, "_site");
const build = async (regenerateStyles = false) => {
  const t = Date.now();
  const scripts = [...(regenerateStyles ? ["scripts/split-css.ts"] : []), "scripts/build.ts", "site/build.ts"];
  for (const script of scripts) {
    const result = Bun.spawnSync(["bun", script], { cwd: ROOT, stdout: "inherit", stderr: "inherit" });
    if (result.exitCode !== 0) return;
  }
  console.log(`rebuilt in ${Date.now() - t} ms`);
};
if (!process.argv.includes("--no-build")) await build(true);
let timer: ReturnType<typeof setTimeout> | undefined;
let regenerateStyles = false;
if (!process.argv.includes("--no-watch"))
  for (const d of ["styles", "src", "site"])
    fs.watch(path.join(ROOT, d), { recursive: true }, (_event, filename) => {
      const catalog = d === "src" && ["numeric-tokens.ts", "theme-tokens.ts", "style-input-schema.ts"].some((name) => path.normalize(filename?.toString() ?? "") === path.join("shared", name));
      regenerateStyles ||= d === "styles" || catalog;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const split = regenerateStyles;
        regenerateStyles = false;
        void build(split);
      }, 200);
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
console.log(`docs at http://localhost:4180/  (${process.argv.includes("--no-watch") ? "serving built output" : "watching styles/, src/ and site/"})`);
