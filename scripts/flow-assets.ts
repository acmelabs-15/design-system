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
/** Bun does not transform Worker URL assets; its file loader supplies correct per-chunk URLs. */
export function flowAssetPlugin(dist: string): BunPlugin {
  return {
    name: "flow-worker-asset",
    setup(build) {
      build.onLoad({ filter: /[/\\]shared[/\\]flow-engine\.js$/ }, async (args) => {
        const source = await Bun.file(args.path).text();
        const expression = 'new URL("./elk-worker.js", import.meta.url)';
        if (!source.includes(expression)) throw new Error("Flow worker asset expression changed");
        return {
          contents:
            `import elkWorkerAsset from ${JSON.stringify(path.join(dist, "shared/elk-worker.js"))} with {type:"file"};\n` + source.replace(expression, "new URL(elkWorkerAsset, import.meta.url)"),
          loader: "js",
          resolveDir: path.dirname(args.path),
        };
      });
    },
  };
}
