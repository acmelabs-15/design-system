import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

/** Resolve the complete local source graph that a consumer must copy together. */
export function exampleFiles(entries: readonly string[], root: string): string[] {
  const result = new Set<string>();
  const visit = (relative: string) => {
    if (result.has(relative)) {
      return;
    }
    if (!relative.startsWith("examples/") || relative.split("/").includes("..")) {
      throw new Error("Example source leaves examples/: " + relative);
    }
    const file = path.join(root, relative);
    const source = fs.readFileSync(file, "utf8");
    result.add(relative);
    for (const imported of ts.preProcessFile(source).importedFiles) {
      if (!imported.fileName.startsWith(".")) {
        continue;
      }
      const base = path.resolve(path.dirname(file), imported.fileName);
      const candidates = [base, base.replace(/\.js$/, ".ts"), base + ".ts", base + ".tsx", path.join(base, "index.ts")];
      const found = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (!found) {
        throw new Error("Missing example dependency: " + relative + " → " + imported.fileName);
      }
      visit(path.relative(root, found).split(path.sep).join("/"));
    }
  };
  for (const entry of entries) {
    visit(entry);
  }
  return [...result];
}
