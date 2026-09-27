import fs from "node:fs";
import path from "node:path";
import type { BunPlugin } from "bun";

export async function buildTableWorker(root: string, outdir: string): Promise<string> {
  const result = await Bun.build({ entrypoints: [path.join(root, "examples/table/table-worker.ts")], outdir, target: "browser", format: "esm", naming: "table-worker.js" });
  if (!result.success) {
    throw new AggregateError(result.logs, "Table example worker build failed");
  }
  return path.join(outdir, "table-worker.js");
}

/** Let the file loader preserve the worker URL when the application uses shared chunks. */
export function tableWorkerPlugin(workerFile: string): BunPlugin {
  return {
    name: "table-example-worker",
    setup(build) {
      build.onLoad({ filter: /[/\\]examples[/\\]table[/\\]worker-session\.ts$/ }, async (args) => {
        const source = await Bun.file(args.path).text();
        const expression = 'new URL("./table-worker.js", import.meta.url)';
        if (!source.includes(expression)) {
          throw new Error("Table worker URL expression changed");
        }
        return {
          contents: `import tableWorkerUrl from ${JSON.stringify(workerFile)} with {type:"file"};\n` + source.replace(expression, "new URL(tableWorkerUrl, import.meta.url)"),
          loader: "ts",
          resolveDir: path.dirname(args.path),
        };
      });
    },
  };
}

/** Build the copied main.ts/index.html and its independently loaded browser worker. */
export async function buildWorkerExample(directory = process.cwd()): Promise<void> {
  const root = path.resolve(directory);
  const outdir = path.join(root, "dist");
  const workerFile = await buildTableWorker(root, outdir);
  const main = await Bun.build({ entrypoints: [path.join(root, "main.ts")], outdir, target: "browser", format: "esm", splitting: true, plugins: [tableWorkerPlugin(workerFile)] });
  if (!main.success) {
    throw new AggregateError(main.logs, "Table example application build failed");
  }
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  if (!html.includes('src="./main.ts"')) {
    throw new Error('Expected copied index.html with src="./main.ts"');
  }
  const css = main.outputs
    .filter((output) => output.path.endsWith(".css"))
    .map((output) => `<link rel="stylesheet" href="./${path.basename(output.path)}">`)
    .join("\n");
  fs.writeFileSync(path.join(outdir, "index.html"), css + "\n" + html.replace('src="./main.ts"', 'src="./main.js"'));
}

if (import.meta.main) {
  await buildWorkerExample();
  console.log("Built dist/index.html, the application modules and table-worker.js. Serve dist over HTTP.");
}
