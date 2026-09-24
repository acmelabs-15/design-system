import fs from "node:fs";
import path from "node:path";
import type { BunPlugin } from "bun";
/** Preserves the unmodified separately served ELK kernel and its notices. */
export function writeFlowAssets(root: string, dist: string) {
  const source = path.join(root, "node_modules/elkjs");
  const manifest = JSON.parse(fs.readFileSync(path.join(source, "package.json"), "utf8"));
  if (manifest.version !== "0.12.0") throw new Error("Revalidate Flow worker delivery before changing ELK");
  fs.mkdirSync(path.join(dist, "shared"), { recursive: true });
  fs.copyFileSync(path.join(source, "lib/elk-worker.min.js"), path.join(dist, "shared/elk-worker.js"));
  fs.mkdirSync(path.join(dist, "licenses"), { recursive: true });
  fs.copyFileSync(path.join(source, "LICENSE.md"), path.join(dist, "licenses/elkjs.txt"));
  fs.writeFileSync(
    path.join(dist, "licenses/elkjs.json"),
    JSON.stringify(
      { package: "elkjs", version: manifest.version, license: "EPL-2.0", source: "https://github.com/kieler/elkjs/tree/v0.12.0", worker: "../shared/elk-worker.js", modified: false },
      null,
      2,
    ) + "\n",
  );
}
/** The file loader preserves asset URLs when browser code moves into shared chunks. */
export function browserAssetPlugin(dist: string): BunPlugin {
  const assets = [
    { suffix: "/shared/flow-engine", expression: 'new URL("./elk-worker.js", import.meta.url)', file: path.join(dist, "shared/elk-worker.js") },
    { suffix: "/components/book/book", expression: 'new URL("../../../assets/book-texture.avif", import.meta.url)', file: path.join(dist, "../assets/book-texture.avif") },
  ];
  return {
    name: "browser-module-assets",
    setup(build) {
      build.onLoad({ filter: /[/\\](?:shared[/\\]flow-engine|components[/\\]book[/\\]book)\.(?:js|ts)$/ }, async (args) => {
        const normalized = args.path.replaceAll("\\", "/").replace(/\.(?:js|ts)$/, "");
        const asset = assets.find((asset) => normalized.endsWith(asset.suffix))!;
        const source = await Bun.file(args.path).text();
        if (!source.includes(asset.expression)) throw new Error("Browser asset expression changed: " + asset.suffix);
        return {
          contents: `import acmeAssetUrl from ${JSON.stringify(asset.file)} with {type:"file"};\n` + source.replace(asset.expression, "new URL(acmeAssetUrl, import.meta.url)"),
          loader: args.path.endsWith(".ts") ? "ts" : "js",
          resolveDir: path.dirname(args.path),
        };
      });
    },
  };
}
