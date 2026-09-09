// Builds the docs site into /docs: the app shell (index.html and its 404.html twin for deep
// links on GitHub Pages), one prebuilt HTML fragment per page under /pages, the docs app bundle
// (the design system plus the router app) and the two stylesheets.
// Run: bun docs-src/build.ts   (bun run docs). Needs a prior `bun run build` for dist/.
import fs from "node:fs";
import path from "node:path";
import { readApi } from "./api";
import { loadDocs } from "./pages/components/index";
import { colors, intro, materials, typography } from "./pages/foundations";
import { type Doc, docPage, type Nav, OUT, shell, writeFragment } from "./site";

const ROOT = path.resolve(import.meta.dir, "..");
if (!fs.existsSync(path.join(ROOT, "dist/index.js"))) throw new Error("dist/ is missing: run `bun run build` first");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.copyFileSync(path.join(ROOT, "tokens.css"), path.join(OUT, "tokens.css"));
fs.copyFileSync(path.join(ROOT, "dashboard.css"), path.join(OUT, "dashboard.css"));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const api = readApi();
const byTag = new Map(api.map((e) => [e.tag, e]));
const components: Doc[] = (await loadDocs()).sort((a, b) => a.title.localeCompare(b.title));

const documented = new Set(components.flatMap((d) => d.tags ?? []));
for (const t of documented) if (!byTag.has(t)) throw new Error(`docs name an unknown element: ${t}`);
const undocumented = api.map((e) => e.tag).filter((t) => !documented.has(t));
if (undocumented.length) console.warn("elements without a docs page:", undocumented.join(", "));

const nav: Nav = [
  {
    group: "Foundations",
    items: [
      { title: "Get Started", href: "index" },
      { title: "Colors", href: "colors" },
      { title: "Typography", href: "typography" },
      { title: "Materials", href: "materials" },
    ],
  },
  { group: "Components", items: components.map((d) => ({ title: d.title, href: `components/${d.id}`, house: d.house })) },
];

const foundations: [Doc, string][] = [
  [intro, "index"],
  [colors, "colors"],
  [typography, "typography"],
  [materials, "materials"],
];
for (const [d, file] of foundations) writeFragment(`${file}.html`, docPage(d, []));
for (const d of components)
  writeFragment(
    `components/${d.id}.html`,
    docPage(
      d,
      (d.tags ?? []).map((t) => byTag.get(t)!),
    ),
  );

const html = shell(nav);
fs.writeFileSync(path.join(OUT, "index.html"), html);
fs.writeFileSync(path.join(OUT, "404.html"), html);
for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]); // every inline script parses

const r = await Bun.build({
  entrypoints: [path.join(import.meta.dir, "app/main.ts")],
  outdir: OUT,
  naming: "app.js",
  target: "browser",
  format: "esm",
  minify: true,
  sourcemap: "linked",
});
if (!r.success) {
  for (const l of r.logs) console.error(l);
  process.exit(1);
}
const kb = (p: string) => `${(fs.statSync(p).size / 1024).toFixed(0)} KB`;
console.log(`docs: ${foundations.length + components.length} pages, ${api.length} elements (${undocumented.length} undocumented), app.js ${kb(path.join(OUT, "app.js"))}`);
