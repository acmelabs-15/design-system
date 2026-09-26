import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { corePackageDirectory, corePackageLinks } from "./core-package";

const ROOT = path.resolve(import.meta.dir, "..");
const FIELDS = [
  "name",
  "version",
  "private",
  "description",
  "license",
  "homepage",
  "type",
  "repository",
  "bugs",
  "keywords",
  "author",
  "contributors",
  "main",
  "module",
  "types",
  "typings",
  "browser",
  "exports",
  "imports",
  "sideEffects",
  "customElements",
  "bin",
  "engines",
  "os",
  "cpu",
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
  "peerDependenciesMeta",
  "publishConfig",
  "files",
];

export function productionManifest(source: Record<string, unknown>, workspaceVersions = new Map<string, string>()): Record<string, unknown> {
  if (typeof source.name !== "string" || typeof source.version !== "string") {
    throw new Error("Package name and version are required");
  }
  const manifest = Object.fromEntries(FIELDS.filter((key) => source[key] !== undefined).map((key) => [key, structuredClone(source[key])]));
  for (const field of ["dependencies", "optionalDependencies", "peerDependencies"]) {
    const dependencies = manifest[field] as Record<string, string> | undefined;
    for (const [name, range] of Object.entries(dependencies ?? {})) {
      if (!range.startsWith("workspace:")) {
        continue;
      }
      const version = workspaceVersions.get(name);
      if (!version || range !== "workspace:*") {
        throw new Error("Unresolved workspace dependency: " + name + " (" + range + ")");
      }
      dependencies![name] = version;
    }
  }
  return manifest;
}

function packageInput(sourceRoot: string, relative: string): string {
  const repository = path.resolve(sourceRoot, "../..");
  const isCore = sourceRoot === corePackageDirectory(repository);
  let input = sourceRoot;
  for (const part of relative.split(/[\\/]/)) {
    if (!part || part === "." || part === "..") {
      throw new Error("Invalid package input: " + relative);
    }
    input = path.join(input, part);
    if (!fs.lstatSync(input).isSymbolicLink()) {
      continue;
    }
    const approved = isCore && path.dirname(input) === sourceRoot ? corePackageLinks[part as keyof typeof corePackageLinks] : undefined;
    const target = path.resolve(path.dirname(input), fs.readlinkSync(input));
    if (!approved || target !== path.join(repository, approved) || fs.lstatSync(target).isSymbolicLink()) {
      throw new Error("Unapproved package symlink: " + input);
    }
    input = target;
  }
  return input;
}

function verifyPackageTree(input: string): void {
  const info = fs.lstatSync(input);
  if (info.isSymbolicLink()) {
    throw new Error("Unapproved package symlink: " + input);
  }
  if (info.isDirectory()) {
    for (const entry of fs.readdirSync(input)) {
      verifyPackageTree(path.join(input, entry));
    }
  }
}

export async function packPackage(sourceRoot = corePackageDirectory(ROOT), destination = path.join(ROOT, ".artifacts/packages"), workspaceVersions = new Map<string, string>()) {
  sourceRoot = path.resolve(sourceRoot);
  destination = path.resolve(destination);
  const source = JSON.parse(fs.readFileSync(path.join(sourceRoot, "package.json"), "utf8"));
  const manifest = productionManifest(source, workspaceVersions);
  if (!Array.isArray(source.files) || !source.files.length) {
    throw new Error("Declare the exact production files before packing");
  }
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), "acme-package-"));
  try {
    for (const file of source.files) {
      if (typeof file !== "string" || /[*?!\[\]{}]/.test(file)) {
        throw new Error("Package staging requires explicit file or directory paths");
      }
      if (path.isAbsolute(file) || file === "package.json") {
        throw new Error("Invalid package input: " + file);
      }
      const input = packageInput(sourceRoot, file === "skills" ? "dist/skills" : file);
      if (file === "skills") {
        const release = JSON.parse(fs.readFileSync(path.join(input, "references/release.json"), "utf8"));
        if (release.version !== source.version) {
          throw new Error("Rebuild consumer skills for the package version before packing");
        }
      }
      verifyPackageTree(input);
      fs.cpSync(input, path.join(stage, file), { recursive: true });
    }
    if (source.files.includes("skills")) {
      fs.rmSync(path.join(stage, "dist/skills"), { recursive: true, force: true });
    }
    fs.writeFileSync(path.join(stage, "package.json"), JSON.stringify(manifest, null, 2) + "\n");
    fs.mkdirSync(destination, { recursive: true });
    const child = Bun.spawn([process.execPath, "pm", "pack", "--ignore-scripts", "--destination", destination], { cwd: stage, stdout: "pipe", stderr: "pipe" });
    const [stdout, stderr, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
    if (code !== 0) {
      throw new Error("Package creation failed:\n" + stdout + stderr);
    }
    const filename = String(manifest.name).replace(/^@/, "").replaceAll("/", "-") + "-" + manifest.version + ".tgz";
    const file = path.join(destination, filename);
    if (!fs.existsSync(file)) {
      throw new Error("Package output is missing: " + file);
    }
    return { file, manifest, log: stdout + stderr };
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}

if (import.meta.main) {
  const versions = new Map<string, string>();
  for (const file of new Bun.Glob("packages/*/package.json").scanSync(ROOT)) {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
    versions.set(manifest.name, manifest.version);
  }
  const result = await packPackage(process.argv[2] ?? corePackageDirectory(ROOT), process.argv[3], versions);
  console.log(result.file);
}
