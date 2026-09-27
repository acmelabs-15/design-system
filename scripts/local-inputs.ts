import fs from "node:fs";
import path from "node:path";

/** Add statically named local runtime imports to a producer's explicit input seeds. */
export function localInputs(root: string, seeds: readonly string[]): string[] {
  const directory = fs.realpathSync(root);
  const visited = new Set<string>();
  const scanners = { ts: new Bun.Transpiler({ loader: "ts" }), tsx: new Bun.Transpiler({ loader: "tsx" }) };
  const visit = (file: string) => {
    const absolute = path.resolve(directory, file);
    const relative = path.relative(directory, absolute).split(path.sep).join("/");
    if (relative === ".." || relative.startsWith("../")) {
      throw new Error("Style input is outside the repository: " + absolute);
    }
    if (visited.has(relative)) {
      return;
    }
    const source = fs.readFileSync(absolute, "utf8");
    visited.add(relative);
    if (!/\.[cm]?[jt]sx?$/.test(absolute)) {
      return;
    }
    const scanner = scanners[/\.[jt]sx$/.test(absolute) ? "tsx" : "ts"];
    for (const imported of scanner.scanImports(source)) {
      if (!imported.path.startsWith(".")) {
        continue;
      }
      visit(Bun.resolveSync(imported.path, path.dirname(absolute)));
    }
  };
  for (const seed of seeds) {
    visit(seed);
  }
  return [...visited].sort();
}
