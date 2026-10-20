import fs from "node:fs";
import path from "node:path";

export function browserModuleFiles(dist: string): string[] {
  return ["generated/icons/{artwork,families}/**/*.js", "register/**/*.js", "internal/register/**/*.js"].flatMap((pattern) => [...new Bun.Glob(pattern).scanSync({ cwd: dist })]).sort();
}

/** Generated modules already contain browser JavaScript; only URL extensions differ. */
export function browserModuleSource(source: string): string {
  return source.replace(/((?:from|import)\s*["'])(\.[^"']+)(["'])/g, (_, before, specifier: string, after) => before + (specifier.endsWith(".js") ? specifier : specifier + ".js") + after);
}

/** Copy inert generated ESM while retaining references to the one bundled class/runtime graph. */
export function writeBrowserModules(dist: string, files: readonly string[]): number {
  const available = new Set(files);
  const scanner = new Bun.Transpiler({ loader: "js" });
  for (const file of files) {
    const output = path.join(dist, "cdn", file);
    const source = browserModuleSource(fs.readFileSync(path.join(dist, file), "utf8"));
    for (const imported of scanner.scanImports(source)) {
      if (!imported.path.startsWith(".") || !imported.path.endsWith(".js")) {
        throw new Error("Non-browser generated import: " + imported.path);
      }
      const target = path.resolve(path.dirname(output), imported.path);
      const relative = path.relative(path.join(dist, "cdn"), target).split(path.sep).join("/");
      if (!available.has(relative) && !fs.existsSync(target)) {
        throw new Error("Missing browser generated module: " + target);
      }
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, source);
  }
  return files.length;
}
