import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const trees = ["src", "scripts", "site", "examples", "packages", "styles", "tools/geist"];
const outputDirectories = new Set(["generated", "dist", ".build-src", "node_modules", "corpus"]);
export function authoredLintFile(relative: string): boolean {
  const file = relative.split(path.sep).join("/");
  return !file.split("/").some((part) => outputDirectories.has(part)) && !/^src\/(?:internal\/)?(?:define|register)\//.test(file) && file !== "src/all.ts" && /\.(?:[cm]?[jt]sx?|css)$/.test(file);
}
export function lintFiles(root: string): string[] {
  const files: string[] = [];
  const visit = (relative: string) => {
    for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
      const file = path.join(relative, entry.name);
      if (entry.isDirectory() && !outputDirectories.has(entry.name)) {
        visit(file);
      } else if (entry.isFile() && authoredLintFile(file)) {
        files.push(file.split(path.sep).join("/"));
      }
    }
  };
  for (const tree of trees) {
    if (fs.existsSync(path.join(root, tree))) {
      visit(tree);
    }
  }
  for (const name of ["oxlint.config.ts", "oxfmt.config.ts", "stylelint.config.ts"]) {
    if (fs.existsSync(path.join(root, name))) {
      files.push(name);
    }
  }
  return files.sort();
}

export function hasLitCss(source: string, filename = "input.ts"): boolean {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let found = false;
  const visit = (node: ts.Node) => {
    if (ts.isTaggedTemplateExpression(node) && ts.isIdentifier(node.tag) && node.tag.text === "css") {
      found = true;
    }
    if (!found) {
      ts.forEachChild(node, visit);
    }
  };
  visit(file);
  return found;
}
