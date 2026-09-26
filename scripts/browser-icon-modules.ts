import fs from "node:fs";
import path from "node:path";

/** Generated artwork modules already contain browser JavaScript; only URL extensions differ. */
export function browserIconModule(source: string): string {
  return source.replace(/((?:from|import)\s*["'])(\.[^"']+)(["'])/g, (_, before, specifier: string, after) => before + (specifier.endsWith(".js") ? specifier : specifier + ".js") + after);
}

/** Keep artwork imports outside the bundler's entry-point matrix, sharing its record entries. */
export function writeBrowserIconModules(dist: string): number {
  const files = [...new Bun.Glob("generated/icons/{artwork,families}/**/*.js").scanSync({ cwd: dist })];
  const available = new Set(files);
  const scanner = new Bun.Transpiler({ loader: "js" });
  for (const file of files) {
    const output = path.join(dist, "cdn", file);
    const source = browserIconModule(fs.readFileSync(path.join(dist, file), "utf8"));
    for (const imported of scanner.scanImports(source)) {
      if (!imported.path.startsWith(".") || !imported.path.endsWith(".js")) {
        throw new Error("Non-browser icon import: " + imported.path);
      }
      const target = path.resolve(path.dirname(output), imported.path);
      const relative = path.relative(path.join(dist, "cdn"), target).split(path.sep).join("/");
      if (!available.has(relative) && !fs.existsSync(target)) {
        throw new Error("Missing browser icon module: " + target);
      }
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, source);
  }
  return files.length;
}
