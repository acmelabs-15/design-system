import {ensureCorePackageLinks} from "./core-package";
import { writeBrowserIconModules } from "./browser-icon-modules";
import { writeFlowAssets, browserAssetPlugin } from "./browser-assets";
/// <reference types="bun" />
// Builds dist/ two ways, following lit.dev/docs/tools/publishing:
//   dist/*.js (+ .d.ts, .d.ts.map)  unbundled ES2022 modules with Lit templates precompiled by @lit-labs/compiler;
//                                    the npm entry, for consumers with a bundler
//   dist/bundle/design-system(.min).js  ES module entries with Lit, shared chunks and on-demand worker assets,
//                                    for a static page that loads it from jsdelivr with no build step
//   dist/styles/                  compiled CSS, document layers and source maps
// Pure Bun: no Node runtime, no Python.

import fs from "node:fs";
import { writeDateRuntime } from "./date-runtime";
import path from "node:path";
import { litStyleModule, verifyStyleManifest, writeStyle } from "./styles";
import { writeEntries, writePackageExports } from "./entries";
import { verifyTokenManifest } from "./numeric-tokens";
import { verifyResponsiveStyleDelivery } from "./responsive-styles";
import { verifyThemeStyleMetadata } from "./theme-tokens";
import { verifyBytePrefixes } from "./byte-prefixes";
import { writeIconEntries } from "./icon-entries";

const ROOT = path.resolve(import.meta.dir, "..");
const DIST = path.join(ROOT, "dist");
ensureCorePackageLinks(ROOT);
await writeIconEntries(ROOT);
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
fs.copyFileSync(path.join(ROOT, "assets/material-symbols/catalog.json"), path.join(DIST, "icons.json"));
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

// Compiler ASTs and analyzer projects live only for this stage.
async function runStage(script: string) {
  const child = Bun.spawn([process.execPath, path.join(ROOT, "scripts", script)], { cwd: ROOT, stdout: "inherit", stderr: "inherit" });
  const status = await child.exited;
  if (status !== 0) throw new Error(script + " failed with exit " + status);
}
await runStage("build-modules.ts");
await writeDateRuntime(ROOT, DIST);
writeFlowAssets(ROOT, DIST);

const standaloneEntry = path.join(DIST, "standalone.js");
const tokens = fs.readFileSync(path.join(ROOT, "src/generated/css/document/tokens.css"), "utf8");
fs.writeFileSync(
  standaloneEntry,
  `import "./all.js";\nexport * from "./configure.js";\nconst css = ${JSON.stringify(tokens)};\nif (!document.querySelector("style[data-acme-tokens]")) { const s = document.createElement("style"); s.dataset.acmeTokens = ""; s.textContent = css; document.head.prepend(s); }\n`,
);

// Selective browser entries share one runtime graph, including the explicit all entry.
{
  const result = await Bun.build({
    entrypoints: [
      path.join(DIST, "all.js"),
      path.join(DIST, "configure.js"),
      standaloneEntry,
      ...components.filter((component) => !component.internal).map((component) => path.join(DIST, "define", component.name + ".js")),
      ...components.filter((component) => !component.internal).map((component) => path.join(ROOT, component.file.replace(/^src\//, "dist/").replace(/\.ts$/, ".js"))),
      ...[...new Bun.Glob("generated/icons/records/*.js").scanSync({ cwd: DIST })].map((file) => path.join(DIST, file)),
      path.join(DIST, "generated/icons/all.js"),
    ],
    root: DIST,
    outdir: path.join(DIST, "cdn"),
    target: "browser",
    format: "esm",
    splitting: true,
    minify: true,
    sourcemap: "none",
    naming: { entry: "[dir]/[name].[ext]", chunk: "chunks/[name]-[hash].[ext]", asset: "assets/[name]-[hash].[ext]" },
    metafile: true,
    plugins: [browserAssetPlugin(DIST)],
  });
  if (!result.success) throw new AggregateError(result.logs, "Selective browser build failed");
  fs.mkdirSync(path.join(ROOT, ".artifacts"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, ".artifacts/cdn-metafile.json"), JSON.stringify(result.metafile, null, 2) + "\n");
}

console.log("browser icon modules:", writeBrowserIconModules(DIST));

// 3. The self-contained browser bundle.
for (const [name, minify] of [
  ["design-system.js", false],
  ["design-system.min.js", true],
] as const) {
  const r = await Bun.build({
    entrypoints: [path.join(DIST, "all.js")],
    outdir: path.join(DIST, "bundle"),
    naming: { entry: name, chunk: "chunks/[name]-[hash].[ext]", asset: "assets/[name]-[hash].[ext]" },
    splitting: true,
    target: "browser",
    format: "esm",
    minify,
    sourcemap: minify ? "none" : "linked",
    plugins: minify
      ? [browserAssetPlugin(DIST)]
      : [
          browserAssetPlugin(DIST),
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
  const r = await Bun.build({
    entrypoints: [standaloneEntry],
    outdir: path.join(DIST, "bundle"),
    naming: { entry: "design-system.standalone.min.js", chunk: "chunks/[name]-[hash].[ext]", asset: "assets/[name]-[hash].[ext]" },
    splitting: true,
    plugins: [browserAssetPlugin(DIST)],
    target: "browser",
    format: "esm",
    minify: true,
    sourcemap: "none",
  });
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
await runStage("react.ts");
