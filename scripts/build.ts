/// <reference types="bun" />
// Builds dist/ two ways, following lit.dev/docs/tools/publishing:
//   dist/*.js (+ .d.ts, .d.ts.map)  unbundled ES2022 modules with Lit templates precompiled by @lit-labs/compiler;
//                                    the npm entry, for consumers with a bundler
//   dist/bundle/design-system(.min).js  one self-contained ES module with Lit and the labs packages inside,
//                                    for a static page that loads it from jsdelivr with no build step
//   dist/styles/                  compiled CSS, document layers and source maps
// Pure Bun: no Node runtime, no Python.

import fs from "node:fs";
import path from "node:path";
import { compileLitTemplates } from "@lit-labs/compiler";
import ts from "typescript";
import { litStyleModule, verifyStyleManifest, writeStyle } from "./styles";
import { writeManifest } from "./manifest";
import { writeEntries, writePackageExports } from "./entries";
import { verifyTokenManifest } from "./numeric-tokens";
import { verifyResponsiveStyleDelivery } from "./responsive-styles";
import { verifyThemeStyleMetadata } from "./theme-tokens";
import { verifyBytePrefixes } from "./byte-prefixes";

const ROOT = path.resolve(import.meta.dir, "..");
const SRC = path.join(ROOT, "src"),
  DIST = path.join(ROOT, "dist");
const components = writeEntries(ROOT);
writePackageExports(components, ROOT);
const styles = verifyStyleManifest(ROOT, ["document/dashboard"]);
const tokenManifest = verifyTokenManifest(ROOT);
verifyResponsiveStyleDelivery(ROOT);
verifyBytePrefixes(ROOT);
verifyThemeStyleMetadata(ROOT);
const recipes = ["deploy", "plan", "usage-sum", "classes", "severity", "option", "info-ic", "rail", "code"];
const recipeFiles = recipes.map((name) => {
  const key = styles.entries["shared/" + name] ? "shared/" + name : "components/" + name + "/" + name;
  return "src/generated/css/" + key + ".css";
});
writeStyle("document/dashboard", recipeFiles.map((file) => fs.readFileSync(path.join(ROOT, file), "utf8")).join("\n"), {
  producer: "document",
  inputs: ["scripts/build.ts", ...recipeFiles],
  module: false,
});
const manifest = verifyStyleManifest(ROOT);
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, "bundle"), { recursive: true });
fs.copyFileSync(tokenManifest, path.join(DIST, "tokens.json"));
for (const entry of Object.values(manifest.entries)) {
  if (entry.producer !== "document") continue;
  const target = entry.key.replace(/^document\//, "");
  for (const suffix of [".css", ".css.map"]) {
    const output = path.join(DIST, "styles", target + suffix);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    let content = fs.readFileSync(path.join(ROOT, "src/generated/css", entry.key + suffix), "utf8");
    if (suffix === ".css") content += "\n/*# sourceMappingURL=" + path.basename(target) + ".css.map */\n";
    fs.writeFileSync(output, content);
  }
}

const walk = (d: string): string[] =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? (e.name === "__tests__" ? [] : walk(path.join(d, e.name))) : e.name.endsWith(".ts") && !e.name.endsWith(".d.ts") && !e.name.endsWith(".geist.ts") ? [path.join(d, e.name)] : [],
    ); // .geist.ts mappings feed tools/geist/gen.ts, not the package
const files = walk(SRC);
const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  experimentalDecorators: true,
  useDefineForClassFields: false,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
};

// 1. Unbundled modules, templates precompiled.
let compiled = 0;
for (const f of files) {
  const out = ts.transpileModule(fs.readFileSync(f, "utf8"), { compilerOptions, fileName: f, transformers: { before: [compileLitTemplates()] } });
  const rel = path.relative(SRC, f).replace(/\.ts$/, ".js");
  fs.mkdirSync(path.dirname(path.join(DIST, rel)), { recursive: true });
  fs.writeFileSync(path.join(DIST, rel), out.outputText);
  if (out.outputText.includes('["_$litType$"]')) compiled++;
}
console.log(`modules: ${files.length} files, ${compiled} with compiled templates`);

// 2. Declarations with maps.
const program = ts.createProgram(files, {
  ...compilerOptions,
  declaration: true,
  declarationMap: true,
  emitDeclarationOnly: true,
  outDir: DIST,
  rootDir: SRC,
  skipLibCheck: true,
  lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
});
const emit = program.emit();
const diags = ts
  .getPreEmitDiagnostics(program)
  .concat(emit.diagnostics)
  .filter((d) => d.category === ts.DiagnosticCategory.Error);
for (const d of diags.slice(0, 30))
  console.error(ts.flattenDiagnosticMessageText(d.messageText, "\n"), d.file ? `${path.relative(ROOT, d.file.fileName)}:${d.file.getLineAndCharacterOfPosition(d.start ?? 0).line + 1}` : "");
if (diags.length) {
  console.error(`${diags.length} type errors`);
  process.exit(1);
}

await writeManifest();

// Selective browser entries share one runtime graph, including the explicit all entry.
{
  const result = await Bun.build({
    entrypoints: [path.join(DIST, "all.js"), ...components.map((component) => path.join(DIST, "define", component.name + ".js"))],
    root: DIST,
    outdir: path.join(DIST, "cdn"),
    target: "browser",
    format: "esm",
    splitting: true,
    minify: true,
    sourcemap: "none",
    naming: { entry: "[dir]/[name].[ext]", chunk: "chunks/[name]-[hash].[ext]", asset: "assets/[name]-[hash].[ext]" },
    metafile: true,
  });
  if (!result.success) throw new AggregateError(result.logs, "Selective browser build failed");
  fs.mkdirSync(path.join(ROOT, ".artifacts"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, ".artifacts/cdn-metafile.json"), JSON.stringify(result.metafile, null, 2) + "\n");
}

// 3. The self-contained browser bundle.
for (const [name, minify] of [
  ["design-system.js", false],
  ["design-system.min.js", true],
] as const) {
  const r = await Bun.build({
    entrypoints: [path.join(DIST, "all.js")],
    outdir: path.join(DIST, "bundle"),
    naming: name,
    target: "browser",
    format: "esm",
    minify,
    sourcemap: minify ? "none" : "linked",
    plugins: minify
      ? []
      : [
          {
            name: "compiled-css-debug-maps",
            setup(build) {
              build.onLoad({ filter: /\.styles\.js$/ }, (args) => {
                const key = path
                  .relative(DIST, args.path)
                  .split(path.sep)
                  .join("/")
                  .replace(/^generated\//, "")
                  .replace(/\.styles\.js$/, "");
                const entry = manifest.entries[key];
                if (!entry?.exportName) return;
                const css = fs.readFileSync(path.join(ROOT, "src/generated/css", key + ".css"), "utf8");
                const map = fs.readFileSync(path.join(ROOT, "src/generated/css", key + ".css.map"), "utf8");
                const debugCss = css + "\n/*# sourceURL=acme-styles://" + key + ".css */\n/*# sourceMappingURL=data:application/json;base64," + Buffer.from(map).toString("base64") + " */";
                return {
                  contents: litStyleModule(
                    entry.exportName,
                    debugCss,
                    entry.properties,
                    path.relative(path.dirname(args.path), path.join(DIST, "shared/style-properties.js")).split(path.sep).join("/"),
                  ),
                  loader: "js",
                  resolveDir: path.dirname(args.path),
                };
              });
            },
          },
        ],
  });
  if (!r.success) {
    for (const l of r.logs) console.error(l);
    process.exit(1);
  }
}

// 3b. The standalone bundle: the same, plus tokens.css installed into the document on import.
// For hosts that allow a script from a CDN but no stylesheet from one (the artifact CSP), one tag.
{
  const tokens = fs.readFileSync(path.join(ROOT, "src/generated/css/document/tokens.css"), "utf8");
  const entry = path.join(DIST, `standalone-entry-${process.pid}.js`); // per process: builds may run concurrently
  fs.writeFileSync(
    entry,
    `import "./all";\nconst css = ${JSON.stringify(tokens)};\nif (!document.querySelector("style[data-acme-tokens]")) { const s = document.createElement("style"); s.dataset.acmeTokens = ""; s.textContent = css; document.head.prepend(s); }\n`,
  );
  const r = await Bun.build({ entrypoints: [entry], outdir: path.join(DIST, "bundle"), naming: "design-system.standalone.min.js", target: "browser", format: "esm", minify: true, sourcemap: "none" });
  fs.rmSync(entry, { force: true });
  if (!r.success) {
    for (const l of r.logs) console.error(l);
    process.exit(1);
  }
}

const size = (p: string) => `${(fs.statSync(p).size / 1024).toFixed(1)} KB`;
console.log(
  "bundle",
  size(path.join(DIST, "bundle/design-system.js")),
  "min",
  size(path.join(DIST, "bundle/design-system.min.js")),
  "tokens.css",
  size(path.join(DIST, "styles/tokens.css")),
  "dashboard.css",
  size(path.join(DIST, "styles/dashboard.css")),
);
