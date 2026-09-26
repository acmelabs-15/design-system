import { buildConsumerSkills } from "../scripts/consumer-skills";
import { documentationRelease } from "./release";
import { recipeDocs, recipes, docStates, docCensus } from "./recipes";
import { compileStyle } from "../scripts/styles";
import { browserAssetPlugin } from "../scripts/browser-assets";
// Builds the docs site into /_site: the app shell (index.html and its 404.html twin for deep
// links on GitHub Pages), one prebuilt HTML fragment per page under /pages, the docs app bundle
// (the design system plus the router app) and the two stylesheets.
// Run: bun site/build.ts   (bun run docs). Needs a prior `bun run build` for dist/.
import fs from "node:fs";
import path from "node:path";
import { readApi } from "./api";
import { docToMarkdown } from "./markdown";
import { loadDocs } from "./pages/components/index";
import { colors, icons, intro, materials, tokens, typeface, typography } from "./pages/foundations";
import { censusPage, type Doc, docPage, type Nav, OUT, shell, writeFragment } from "./site";
import { writeDocumentationIconEntry } from "../scripts/docs-icons";

const ROOT = path.resolve(import.meta.dir, "..");
if (!fs.existsSync(path.join(ROOT, "dist/index.js"))) {
  throw new Error("dist/ is missing: run `bun run build` first");
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(ROOT, "dist/styles"), path.join(OUT, "styles"), { recursive: true });
const pageStyle = compileStyle(fs.readFileSync(path.join(ROOT, "site/docs.css"), "utf8"), "site/docs.css");
fs.writeFileSync(path.join(OUT, "styles/docs.css"), pageStyle.css + "\n/*# sourceMappingURL=docs.css.map */\n");
fs.writeFileSync(path.join(OUT, "styles/docs.css.map"), pageStyle.map);
fs.cpSync(path.join(ROOT, "assets"), path.join(OUT, "assets"), { recursive: true });
fs.cpSync(path.join(ROOT, "site/assets"), path.join(OUT, "assets"), { recursive: true });
fs.cpSync(path.join(ROOT, "examples"), path.join(OUT, "examples"), { recursive: true });
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const recipePages = recipeDocs();
const api = readApi();
const byTag = new Map(api.map((e) => [e.tag, e]));
const components: Doc[] = (await loadDocs()).sort((a, b) => a.title.localeCompare(b.title));

const documented = new Set([...components, icons].flatMap((d) => [...(d.tags ?? []), ...(d.catalogTags ?? [])]));
for (const t of documented) {
  if (!byTag.has(t)) {
    throw new Error(`docs name an unknown element: ${t}`);
  }
}
const undocumented = api.map((e) => e.tag).filter((t) => !documented.has(t));
if (undocumented.length) {
  console.warn("elements without a docs page:", undocumented.join(", "));
}

const nav: Nav = [
  {
    group: "Foundations",
    items: [
      { title: "Introduction", href: "index" },
      { title: "Colors", href: "colors" },
      { title: "Typography", href: "typography" },
      { title: "Materials", href: "materials" },
      { title: "Tokens", href: "tokens" },
    ],
  },
  {
    group: "Assets",
    items: [
      { title: "Icons", href: "icons" },
      { title: "Typeface", href: "typeface" },
    ],
  },
  { group: "Components", items: components.map((d) => ({ title: d.title, href: `components/${d.id}` })) },
  { group: "Recipes", items: recipePages.map((d) => ({ title: d.title, href: `recipes/${d.id}` })) },
];

const foundations: [Doc, string][] = [
  [intro, "index"],
  [colors, "colors"],
  [typography, "typography"],
  [materials, "materials"],
  [icons, "icons"],
  [typeface, "typeface"],
  [tokens, "tokens"],
];
// Every page has a Markdown twin at the page URL plus .md (Geist does the same).
const md = async (route: string, d: Doc) => {
  const p = path.join(OUT, `${route}.md`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${(await docToMarkdown(d, byTag)).join("\n")}\n`);
};
for (const [d, file] of foundations) {
  writeFragment(
    `${file}.html`,
    await docPage(
      d,
      (d.tags ?? []).map((tag) => byTag.get(tag)!),
    ),
  );
  await md(file, d);
}
for (const d of components) {
  writeFragment(
    `components/${d.id}.html`,
    await docPage(
      d,
      (d.tags ?? []).map((t) => byTag.get(t)!),
    ),
  );
  await md(`components/${d.id}`, d);
  // The census page carries the census-only examples too; it is not linked from the navigation.
  if (d.examples.some((e) => e.census)) {
    writeFragment(
      `census/${d.id}.html`,
      await censusPage(
        d,
        docCensus.filter((record) => record.fixtureId === d.id),
      ),
    );
  }
}

for (const doc of recipePages) {
  writeFragment(`recipes/${doc.id}.html`, await docPage(doc, []));
  await md(`recipes/${doc.id}`, doc);
}
fs.writeFileSync(path.join(OUT, "recipes.json"), JSON.stringify({ version: api[0].version, recipes, states: docStates, census: docCensus }, null, 2) + "\n");

const release = await documentationRelease(
  JSON.parse(fs.readFileSync(path.join(ROOT, "dist/custom-elements.json"), "utf8")),
  api,
  [...components, ...foundations.map(([doc]) => doc)],
  foundations.map(([doc]) => doc),
  recipes,
);
fs.mkdirSync(path.join(ROOT, ".artifacts"), { recursive: true });
fs.writeFileSync(path.join(ROOT, ".artifacts/documentation.json"), JSON.stringify(release));
fs.mkdirSync(path.join(ROOT, "packages/mcp/dist"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "packages/mcp/dist/documentation.json"), JSON.stringify(release));

await buildConsumerSkills(release);

const html = shell(nav);
fs.writeFileSync(path.join(OUT, "index.html"), html);
fs.writeFileSync(path.join(OUT, "404.html"), html);
for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  new Function(m[1]);
} // every inline script parses

const appEntry = writeDocumentationIconEntry(
  ROOT,
  OUT,
  [...components, ...recipePages, ...foundations.map(([doc]) => doc)].flatMap((doc) => doc.examples.map((example) => example.script ?? "")),
);
const r = await Bun.build({
  entrypoints: [appEntry],
  outdir: OUT,
  naming: { entry: "app.js", chunk: "chunks/[name]-[hash].[ext]", asset: "assets/[name]-[hash].[ext]" },
  splitting: true,
  plugins: [browserAssetPlugin(path.join(ROOT, "dist"))],
  target: "browser",
  format: "esm",
  minify: true,
  sourcemap: "linked",
});
fs.unlinkSync(appEntry);
if (!r.success) {
  for (const l of r.logs) {
    console.error(l);
  }
  process.exit(1);
}
const kb = (p: string) => `${(fs.statSync(p).size / 1024).toFixed(0)} KB`;
console.log(`docs: ${foundations.length + components.length + recipePages.length} pages, ${api.length} elements (${undocumented.length} undocumented), app.js ${kb(path.join(OUT, "app.js"))}`);
