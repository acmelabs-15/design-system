import fs from "node:fs";
import path from "node:path";
import { repositoryRoot } from "./core-package";
import { PackageLicenseMissingError, packageLicense } from "./devtools-runtime";

export const browserPackageDirectory = (root = repositoryRoot) => path.join(root, "packages/browser");
export type BrowserPackageManifest = Record<string, unknown> & { name: string; version: string };

export function readBrowserPackage(root = repositoryRoot): BrowserPackageManifest {
  const file = checkedFile(root, "packages/browser/package.json");
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  if (typeof pkg.name !== "string" || !pkg.name || typeof pkg.version !== "string" || !pkg.version) {
    throw new Error("Browser package name and version are required");
  }
  return pkg;
}

/** Browser delivery shares the existing generated graph and its exact notice sources. */
export const browserPackageLinks = Object.freeze({
  dist: "dist/cdn",
  styles: "dist/styles",
  bundle: "dist/bundle",
  "licenses/assets": "assets/licenses",
  "licenses/runtime": "dist/licenses",
  "licenses/packages": "dist/browser-licenses",
} as const);

function info(file: string): fs.Stats | undefined {
  try {
    return fs.lstatSync(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    return undefined;
  }
}

/** Check each ancestor so a valid final path cannot hide a substituted parent. */
function checkedDirectory(root: string, relative: string, create = false): string {
  let directory = root;
  for (const part of relative.split(path.sep)) {
    if (!part || part === ".") {
      continue;
    }
    if (part === "..") {
      throw new Error("Invalid browser package path: " + relative);
    }
    directory = path.join(directory, part);
    const existing = info(directory);
    if (!existing && create) {
      fs.mkdirSync(directory);
    } else if (!existing?.isDirectory() || existing.isSymbolicLink()) {
      throw new Error("Unexpected browser package directory: " + directory);
    }
  }
  return directory;
}

function checkedFile(root: string, relative: string): string {
  checkedDirectory(root, path.dirname(relative));
  const file = path.join(root, relative);
  if (!info(file)?.isFile()) {
    throw new Error("Expected browser package source file: " + file);
  }
  return file;
}

export function ensureBrowserPackageLinks(root = repositoryRoot): void {
  for (const target of Object.values(browserPackageLinks)) {
    checkedDirectory(root, target);
  }
  const directory = checkedDirectory(root, "packages/browser", true);
  checkedDirectory(root, "packages/browser/licenses", true);
  for (const [name, target] of Object.entries(browserPackageLinks)) {
    const link = path.join(directory, name);
    const relative = path.relative(path.dirname(link), path.join(root, target));
    const existing = info(link);
    if (existing && (!existing.isSymbolicLink() || fs.readlinkSync(link) !== relative)) {
      throw new Error("Unexpected browser delivery path: " + link);
    }
  }
  for (const [name, target] of Object.entries(browserPackageLinks)) {
    const link = path.join(directory, name);
    if (!info(link)) {
      fs.symlinkSync(path.relative(path.dirname(link), path.join(root, target)), link);
    }
  }
}

type LicenseEvidence =
  | { kind: "license-text"; noticeTextAvailable: true }
  | { kind: "package-license-metadata"; noticeTextAvailable: false; sourceHistoryUrl: string; sourceCommitBinding: "unverified" };

type PackageNotice = LicenseEvidence & {
  name: string;
  version: string;
  license: string;
  licenseFile: string;
  source: string;
  file: string;
  sha256: string;
};

/** The reviewed release omits a notice; retain its exact SPDX-bearing manifest. */
async function bundledLicense(directory: string, name: string, version: string, license: string, manifest: string): Promise<LicenseEvidence & { file: string; text: string }> {
  try {
    return { ...(await packageLicense(directory)), kind: "license-text", noticeTextAvailable: true };
  } catch (error) {
    if (
      !(error instanceof PackageLicenseMissingError) ||
      name !== "@tanstack/markdown" ||
      version !== "0.0.13" ||
      license !== "MIT" ||
      new Bun.CryptoHasher("sha256").update(manifest).digest("hex") !== "2885c8a041b10b4746cdc54d366937315311c0472ee8e3cd1c704fd9f2df500e"
    ) {
      throw error;
    }
    return {
      file: "package.json",
      text: manifest,
      kind: "package-license-metadata",
      noticeTextAvailable: false,
      sourceHistoryUrl: "https://github.com/TanStack/markdown/commits/b54cce0943009ff76063b7656f99c2139823835f/package.json",
      sourceCommitBinding: "unverified",
    };
  }
}

function packageSource(root: string, input: string): { name: string; directory: string } | undefined {
  const relative = path.relative(path.resolve(root), path.resolve(root, input));
  if (relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) {
    throw new Error("Browser build input escapes the repository: " + input);
  }
  const parts = relative.split(path.sep);
  const index = parts.lastIndexOf("node_modules");
  if (index < 0) {
    return;
  }
  const name = parts.slice(index + 1, index + (parts[index + 1]?.startsWith("@") ? 3 : 2)).join("/");
  if (!/^(?:@[^/]+\/)?[^/]+$/.test(name)) {
    throw new Error("Invalid bundled package input: " + input);
  }
  const directory = parts.slice(0, index + 1 + name.split("/").length).join(path.sep);
  checkedFile(root, relative);
  return { name, directory };
}

function checkOutputTree(directory: string): void {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      checkOutputTree(file);
    } else if (!entry.isFile()) {
      throw new Error("Unexpected browser notice output: " + file);
    }
  }
}

/** Retain exact upstream notices for dependencies actually present in the browser graph. */
export async function buildBrowserPackageNotices(root = repositoryRoot): Promise<{ packages: PackageNotice[] }> {
  const metafile = JSON.parse(fs.readFileSync(checkedFile(root, ".artifacts/cdn-metafile.json"), "utf8"));
  if (!metafile.inputs || typeof metafile.inputs !== "object" || Array.isArray(metafile.inputs)) {
    throw new Error("Browser build metafile inputs are required");
  }
  const sources = new Map<string, string>();
  for (const input of Object.keys(metafile.inputs)) {
    const source = packageSource(root, input);
    if (source) {
      sources.set(source.directory, source.name);
    }
  }
  const packages: PackageNotice[] = [];
  const notices = new Map<string, string>();
  for (const [source, name] of [...sources].sort(([a], [b]) => a.localeCompare(b))) {
    const directory = checkedDirectory(root, source);
    const manifest = fs.readFileSync(checkedFile(root, path.join(source, "package.json")), "utf8");
    const pkg = JSON.parse(manifest);
    if (pkg.name !== name || typeof pkg.version !== "string" || !pkg.version || typeof pkg.license !== "string" || !pkg.license) {
      throw new Error("Bundled package identity or license is missing: " + source);
    }
    const { file: licenseFile, text, ...evidence } = await bundledLicense(directory, name, pkg.version, pkg.license, manifest);
    const file = encodeURIComponent(name) + "@" + encodeURIComponent(pkg.version) + (evidence.kind === "license-text" ? ".txt" : ".json");
    if (notices.has(file) && notices.get(file) !== text) {
      throw new Error("Conflicting bundled package licenses: " + name + "@" + pkg.version);
    }
    notices.set(file, text);
    packages.push({
      ...evidence,
      name,
      version: pkg.version,
      license: pkg.license,
      licenseFile,
      source,
      file,
      sha256: new Bun.CryptoHasher("sha256").update(text).digest("hex"),
    });
  }
  packages.sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version) || a.source.localeCompare(b.source));
  const output = checkedDirectory(root, "dist/browser-licenses", true);
  checkOutputTree(output);
  for (const entry of fs.readdirSync(output)) {
    fs.rmSync(path.join(output, entry), { recursive: true });
  }
  for (const [file, text] of notices) {
    fs.writeFileSync(path.join(output, file), text);
  }
  const provenance = { packages };
  fs.writeFileSync(path.join(output, "provenance.json"), JSON.stringify(provenance, null, 2) + "\n");
  return provenance;
}

if (import.meta.main) {
  await buildBrowserPackageNotices();
  ensureBrowserPackageLinks();
}
