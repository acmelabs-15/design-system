import path from "node:path";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import type { BunPlugin } from "bun";
const uiVersion = "0.7.1";
const treeHash = "a7a7a305ff7256bc71e423fc6cefdf14726bc1d57dc19e1ab0ea0a49beaa06a3";
const original = 'props.keyName && typeof props.value !== "object"';
const corrected = 'props.keyName && (props.value === null || typeof props.value !== "object")';

/** Correct the null primitive's missing key in the pinned upstream renderer. */
export function correctDevtoolsTree(source: string, version: string): string {
  if (version !== uiVersion || new Bun.CryptoHasher("sha256").update(source).digest("hex") !== treeHash)
    throw new Error("Revalidate the Devtools JsonTree correction against the new upstream source");
  if (source.split(original).length !== 2) throw new Error("Devtools JsonTree key condition changed");
  return source.replace(original, corrected);
}
export function devtoolsRuntimePlugin(): BunPlugin {
  return {
    name: "devtools-runtime",
    setup(build) {
      build.onLoad({ filter: /[/\\]devtools-ui[/\\]dist[/\\]esm[/\\]components[/\\]tree\.js$/ }, async (args) => {
        const packageRoot = path.resolve(path.dirname(args.path), "../../..");
        const pkg = await Bun.file(path.join(packageRoot, "package.json")).json();
        return {
          contents: correctDevtoolsTree(await Bun.file(args.path).text(), pkg.version),
          loader: "js",
          resolveDir: path.dirname(args.path),
        };
      });
      build.onLoad({ filter: /devtools-ui.*[/\\]assets[/\\]fonts[/\\][^/\\]+\.js$/ }, async (args) => {
        const source = await Bun.file(args.path).text();
        const relative = /new URL\(["']([^"']+)["'],\s*import\.meta\.url\)/.exec(source)?.[1];
        if (!relative) throw new Error("Revalidate Devtools font delivery against the new upstream asset module");
        const file = path.resolve(path.dirname(args.path), relative),
          bytes = await Bun.file(file).arrayBuffer();
        const mime = file.endsWith(".woff2") ? "font/woff2" : "font/ttf";
        return {
          contents:
            "export default " +
            JSON.stringify("data:" + mime + ";base64," + Buffer.from(bytes).toString("base64")) +
            ";",
          loader: "js",
        };
      });
    },
  };
}

/** Emit the optional runtime with its correction, local fonts and third-party notices. */
export async function buildDevtoolsRuntime(root = path.resolve(import.meta.dir, "..")) {
  const outdir = path.join(root, "packages/devtools/dist");
  await mkdir(outdir, { recursive: true });
  await rm(path.join(outdir, "assets"), { recursive: true, force: true });
  await rm(path.join(outdir, "chunks"), { recursive: true, force: true });
  const result = await Bun.build({
    entrypoints: [path.join(root, "packages/devtools/src/index.ts")],
    outdir,
    target: "browser",
    conditions: ["browser", "production"],
    format: "esm",
    splitting: true,
    sourcemap: "external",
    naming: { entry: "index.js", chunk: "chunks/[name]-[hash].js", asset: "assets/[name]-[hash].[ext]" },
    metafile: true,
    plugins: [devtoolsRuntimePlugin()],
  });
  if (!result.success) throw new AggregateError(result.logs);
  const names = ["@tanstack/devtools-ui", "solid-js", "goober", "clsx", "dayjs"];
  await mkdir(path.join(outdir, "licenses"), { recursive: true });
  const packages = [];
  for (const name of names) {
    const directory = path.join(root, "node_modules", name),
      pkg = await Bun.file(path.join(directory, "package.json")).json();
    const license = await readFile(path.join(directory, "LICENSE"), "utf8");
    await writeFile(path.join(outdir, "licenses", name.replaceAll("/", "-").replace("@", "") + ".txt"), license);
    packages.push({ name, version: pkg.version, license: pkg.license });
  }
  const fontDirectory = path.join(root, "node_modules/@tanstack/devtools-ui/dist/assets");
  const fonts = [];
  for (const file of (await readdir(fontDirectory)).filter((file) => /\.(ttf|woff2)$/.test(file)).sort()) {
    const bytes = await readFile(path.join(fontDirectory, file));
    fonts.push({
      file,
      bytes: bytes.byteLength,
      sha256: new Bun.CryptoHasher("sha256").update(bytes).digest("hex"),
      delivery: "embedded data URL",
    });
  }
  for (const file of ["OFL-Inter.txt", "OFL-Bricolage-Grotesque.txt"])
    await writeFile(
      path.join(outdir, "licenses", file),
      await readFile(path.join(root, "node_modules/@tanstack/devtools-ui/src/assets/fonts", file)),
    );
  const provenance = {
    packages,
    fonts,
    correction: {
      package: "@tanstack/devtools-ui",
      version: uiVersion,
      file: "dist/esm/components/tree.js",
      originalSha256: treeHash,
      original,
      corrected,
      reason: "Null is a JSON primitive; its field name must remain visible",
    },
    assets: result.outputs
      .filter((output) => /\.(ttf|woff2?)$/.test(output.path))
      .map((output) => path.relative(outdir, output.path)),
    inputs: Object.keys(result.metafile!.inputs).length,
  };
  await Bun.write(path.join(outdir, "licenses/provenance.json"), JSON.stringify(provenance, null, 2) + "\n");
  return provenance;
}
if (import.meta.main) console.log(await buildDevtoolsRuntime());
