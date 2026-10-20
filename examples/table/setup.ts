import fs from "node:fs";
import path from "node:path";

const packageName = "@tanstack/table-core";
const version = "9.2.4";
const publishedHash = "42662c71ed5cd276aa23f767af840304429e1cd24ec32674b7dd708297e44493";
const correctedHash = "3df9e64e85699f87eb4efaea2e7f949f9cf751f5e8af0bcf740626084e6e3a33";
const hash = (source: string) => new Bun.CryptoHasher("sha256").update(source).digest("hex");

/** Exact declaration-only correction for custom features combined with experimental workers. */
export function tableWorkerDeclaration(installedVersion: string, source: string): string {
  if (installedVersion !== version) {
    throw new Error(`Table example setup requires ${packageName}@${version}; found ${installedVersion}`);
  }
  const digest = hash(source);
  if (digest === correctedHash) {
    return source;
  }
  if (digest !== publishedHash) {
    throw new Error("Table worker declaration SHA-256 does not match the verified published or corrected source");
  }
  return source.replace("declare module '../types/TableFeatures'", "declare module '../index.js'").replace("declare module '../types/TableState'", "declare module '../index.js'");
}

/** Run once in the consuming Bun project; retain the generated patch, package.json and bun.lock. */
export function prepareTableExample(directory = process.cwd()): "configured" | "already-configured" {
  const root = fs.realpathSync(directory);
  const manifestFile = path.join(root, "package.json");
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  if ((manifest.dependencies?.[packageName] ?? manifest.devDependencies?.[packageName]) !== version) {
    throw new Error(`Pin ${packageName} to exactly ${version} in this application's package.json before setup`);
  }
  const packageFile = Bun.resolveSync(packageName + "/package.json", root);
  const dependency = JSON.parse(fs.readFileSync(packageFile, "utf8"));
  const declarationFile = path.join(path.dirname(packageFile), "dist/worker/createTableWorker.d.ts");
  const source = fs.readFileSync(declarationFile, "utf8");
  const corrected = tableWorkerDeclaration(dependency.version, source);
  const key = packageName + "@" + version;
  if (source === corrected) {
    const patchFile = manifest.patchedDependencies?.[key];
    if (typeof patchFile !== "string" || !fs.existsSync(path.resolve(root, patchFile))) {
      throw new Error("The declaration is modified without a persistent application patch. Reinstall the clean dependency, then run setup again.");
    }
    return "already-configured";
  }
  const run = (args: string[]) => {
    const result = Bun.spawnSync([process.execPath, "patch", ...args, "--ignore-scripts"], { cwd: root, stdout: "pipe", stderr: "pipe" });
    if (result.exitCode !== 0) {
      throw new Error(result.stdout.toString() + result.stderr.toString());
    }
  };
  // Bun first detaches the package from its cache; editing a cache-linked install is unsafe.
  run([key]);
  const prepared = path.join(path.dirname(Bun.resolveSync(packageName + "/package.json", root)), "dist/worker/createTableWorker.d.ts");
  fs.writeFileSync(prepared, tableWorkerDeclaration(version, fs.readFileSync(prepared, "utf8")));
  run(["--commit", key]);
  const saved = JSON.parse(fs.readFileSync(manifestFile, "utf8")).patchedDependencies?.[key];
  if (typeof saved !== "string" || !fs.existsSync(path.resolve(root, saved)) || hash(fs.readFileSync(prepared, "utf8")) !== correctedHash) {
    throw new Error("Bun did not persist the verified Table declaration patch");
  }
  return "configured";
}

if (import.meta.main) {
  console.log(`Table experimental-worker setup: ${prepareTableExample()}. Keep the application patch, package.json and bun.lock together.`);
}
