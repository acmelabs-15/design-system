import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import type { IconGeometry, IconFamily } from "../src/shared/icon-artwork";

const ROOT = path.resolve(import.meta.dir, "..");
export const symbolRevision = "27e9ef1dbeedc13d682fece4a58e1eda4cb0961a";
const families: readonly IconFamily[] = ["rounded", "outlined", "sharp"];
const sha256 = (data: string) => createHash("sha256").update(data).digest("hex");
const validName = (name: string) => {
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(name)) throw new TypeError("Invalid symbol name");
  return name;
};
export const symbolTag = (name: string) => `acme-${validName(name).replaceAll("_", "-")}-icon`;
export const symbolClassName = (name: string) =>
  "Acme" +
  validName(name)
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("") +
  "Icon";
function attributes(source: string, allowed: readonly string[]): Record<string, string> {
  const result: Record<string, string> = {};
  let rest = source;
  while (rest.trim()) {
    const match = /^\s+([a-zA-Z][a-zA-Z-]*)="([^"]*)"/.exec(rest);
    if (!match || !allowed.includes(match[1]) || Object.hasOwn(result, match[1])) throw new Error("Unrecognized or duplicate SVG attribute");
    result[match[1]] = match[2];
    rest = rest.slice(match[0].length);
  }
  return result;
}
/** Accept the audited upstream grammar, not arbitrary SVG markup or executable fragments. */
export function parseSymbolSvg(source: string): IconGeometry {
  const match = /^\s*<svg(\s[^<>]*?)>\s*<path(\s[^<>]*?)\s*\/>\s*<\/svg>\s*$/.exec(source);
  if (!match) throw new Error("Unrecognized symbol SVG structure");
  const root = attributes(match[1], ["xmlns", "height", "width", "viewBox"]),
    outline = attributes(match[2], ["d"]);
  if (root.xmlns !== undefined && root.xmlns !== "http://www.w3.org/2000/svg") throw new Error("Unexpected SVG namespace");
  const dimension = (text: string) => {
    if (!/^(?:\d+(?:\.\d+)?)(?:px)?$/.test(text)) throw new Error("Invalid SVG dimensions");
    return Number.parseFloat(text);
  };
  const width = dimension(root.width),
    height = dimension(root.height);
  if (width <= 0 || height <= 0) throw new Error("SVG dimensions must be positive");
  const viewBox = root.viewBox ?? `0 0 ${width} ${height}`,
    bounds = viewBox.trim().split(/\s+/).map(Number);
  if (bounds.length !== 4 || !bounds.every(Number.isFinite) || bounds[2] <= 0 || bounds[3] <= 0) throw new Error("Invalid SVG viewBox");
  if (!outline.d || !/^[MmZzLlHhVvCcSsQqTtAaEe0-9.,+\s-]+$/.test(outline.d)) throw new Error("Invalid SVG path data");
  return { viewBox, paths: [{ d: outline.d }] };
}
export type SymbolAsset = Readonly<{ family: IconFamily; filled: boolean; file: string; source: string; sha256: string; bytes: number }>;
export type SymbolRecord = Readonly<{ name: string; tag: string; className: string; assets: readonly SymbolAsset[] }>;
export type SymbolCatalog = Readonly<{ revision: string; license: "Apache-2.0"; baseline: { weight: 400; grade: 0; opticalSize: 24 }; symbols: readonly SymbolRecord[] }>;

/** Import the six verified baseline files for every upstream symbol at one exact revision. */
export async function importSymbols(upstream: string, root = ROOT): Promise<SymbolCatalog> {
  const revision = Bun.spawnSync(["git", "rev-parse", "HEAD"], { cwd: upstream, stdout: "pipe", stderr: "pipe" });
  if (revision.exitCode !== 0 || revision.stdout.toString().trim() !== symbolRevision) throw new Error("The artwork checkout must match the pinned revision");
  const directory = path.join(upstream, "symbols/web"),
    target = path.join(root, "assets/material-symbols");
  const names = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const symbols: SymbolRecord[] = [],
    tags = new Set<string>(),
    classes = new Set<string>();
  for (const name of names) {
    const tag = symbolTag(name),
      className = symbolClassName(name);
    if (tags.has(tag) || classes.has(className)) throw new Error("Conflicting generated symbol identity");
    tags.add(tag);
    classes.add(className);
    const assets: SymbolAsset[] = [];
    for (const family of families)
      for (const filled of [false, true]) {
        const source = `symbols/web/${name}/materialsymbols${family}/${name}${filled ? "_fill1" : ""}_24px.svg`,
          content = await Bun.file(path.join(upstream, source)).text();
        parseSymbolSvg(content);
        const file = `${name}/${family}-${filled ? "filled" : "unfilled"}.svg`;
        await Bun.write(path.join(target, file), content);
        assets.push({ family, filled, file, source, sha256: sha256(content), bytes: Buffer.byteLength(content) });
      }
    symbols.push({ name, tag, className, assets });
  }
  const catalog: SymbolCatalog = { revision: symbolRevision, license: "Apache-2.0", baseline: { weight: 400, grade: 0, opticalSize: 24 }, symbols };
  const license = await Bun.file(path.join(upstream, "LICENSE")).text();
  if (!license.includes("Apache License") || !license.includes("Version 2.0")) throw new Error("Unexpected artwork license");
  await Bun.write(path.join(root, "assets/licenses/material-symbols.txt"), license);
  await Bun.write(path.join(target, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
  return catalog;
}
export async function verifySymbols(root = ROOT): Promise<SymbolCatalog> {
  const directory = path.join(root, "assets/material-symbols"),
    catalog = (await Bun.file(path.join(directory, "catalog.json")).json()) as SymbolCatalog;
  if (catalog.revision !== symbolRevision || catalog.license !== "Apache-2.0") throw new Error("Stale symbol source revision");
  const actual = new Set([...new Bun.Glob("**/*.svg").scanSync({ cwd: directory })]);
  for (const symbol of catalog.symbols) {
    if (symbol.tag !== symbolTag(symbol.name) || symbol.className !== symbolClassName(symbol.name) || symbol.assets.length !== 6) throw new Error("Invalid symbol manifest");
    const variants = new Set<string>();
    for (const asset of symbol.assets) {
      const key = `${asset.family}:${asset.filled}`,
        file = `${symbol.name}/${asset.family}-${asset.filled ? "filled" : "unfilled"}.svg`;
      if (!families.includes(asset.family) || typeof asset.filled !== "boolean" || variants.has(key) || asset.file !== file || !actual.delete(file)) throw new Error("Invalid symbol asset identity");
      variants.add(key);
      const content = await Bun.file(path.join(directory, file)).text();
      parseSymbolSvg(content);
      if (sha256(content) !== asset.sha256 || Buffer.byteLength(content) !== asset.bytes) throw new Error(`Changed symbol source: ${file}`);
    }
  }
  if (actual.size) throw new Error("Uncatalogued symbol assets");
  return catalog;
}
if (import.meta.main) {
  const catalog = process.argv[2] === "import" ? await importSymbols(path.resolve(process.argv[3])) : await verifySymbols();
  console.log({ symbols: catalog.symbols.length, assets: catalog.symbols.reduce((sum, symbol) => sum + symbol.assets.length, 0), revision: catalog.revision });
}
