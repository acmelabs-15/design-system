import fs from "node:fs";
import path from "node:path";

export const repositoryRoot = path.resolve(import.meta.dir, "..");
export const corePackageDirectory = (root = repositoryRoot) => path.join(root, "packages/core");
export const corePackageManifestPath = (root = repositoryRoot) => path.join(corePackageDirectory(root), "package.json");
export type CorePackageManifest = Record<string, unknown> & { name: string; version: string };

/** The public package owns consumer metadata; the repository root owns build tools. */
export function readCorePackage(root = repositoryRoot): CorePackageManifest {
  const pkg = JSON.parse(fs.readFileSync(corePackageManifestPath(root), "utf8"));
  if (typeof pkg.name !== "string" || typeof pkg.version !== "string") throw new Error("Core package name and version are required");
  return pkg;
}

/** Explicit delivery paths share authored assets and the single generated runtime. */
export const corePackageLinks = { dist: "dist", assets: "assets", "README.md": "README.md", skills: "dist/skills" } as const;
export function ensureCorePackageLinks(root = repositoryRoot): void {
  const directory = corePackageDirectory(root);
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, target] of Object.entries(corePackageLinks)) {
    const link = path.join(directory, name);
    const relative = path.relative(directory, path.join(root, target));
    let existing: fs.Stats | undefined;
    try { existing = fs.lstatSync(link); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    if (existing) {
      if (!existing.isSymbolicLink() || fs.readlinkSync(link) !== relative) throw new Error("Unexpected core delivery path: " + link);
    } else fs.symlinkSync(relative, link);
  }
}
if (import.meta.main) ensureCorePackageLinks();
