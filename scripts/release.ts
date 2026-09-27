import fs from "node:fs";
import path from "node:path";
import { repositoryRoot, corePackageDirectory } from "./core-package";
import { packPackage } from "./package";
import {
  archiveFilename,
  publicationBlockers,
  publicationEnvironment,
  releaseBunVersion,
  registryVersionState,
  requireCommittedSource,
  requirePublishEnvironment,
  requireReleaseRuntime,
  validateArchiveRecord,
  validatePackageSet,
  validateReleaseTag,
  type ArchiveRecord,
  type ReleasePackage,
  type ReleaseRecord,
} from "./release-policy";
import { npmCommand, verifyNpmCli } from "./release-npm";

export async function archiveManifest(file: string): Promise<ReleasePackage> {
  const child = Bun.spawn(["tar", "-xOf", file, "package/package.json"], { stdout: "pipe", stderr: "pipe" });
  const [text, error, status] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
  if (status !== 0) {
    throw new Error("Cannot inspect archive metadata: " + error);
  }
  const value = JSON.parse(text);
  if (typeof value.name !== "string" || typeof value.version !== "string") {
    throw new Error("Archive metadata lacks name or version");
  }
  return value;
}
const digest = async (file: string) => new Bun.CryptoHasher("sha512").update(await Bun.file(file).arrayBuffer()).digest("hex");
export function releaseSource(root: string): Pick<ReleaseRecord, "commit" | "sourceTree"> {
  const git = Bun.spawnSync(["git", "rev-parse", "HEAD"], { cwd: root, stdout: "pipe", stderr: "pipe" });
  if (git.exitCode !== 0) {
    throw new Error("Release requires a Git commit");
  }
  const status = Bun.spawnSync(["git", "status", "--porcelain=v1", "--untracked-files=all"], { cwd: root, stdout: "pipe", stderr: "pipe" });
  if (status.exitCode !== 0) {
    throw new Error("Cannot verify release source tree: " + status.stderr.toString());
  }
  return { commit: git.stdout.toString().trim(), sourceTree: status.stdout.toString().trim() ? "dirty" : "clean" };
}
export async function prepareRelease(root = repositoryRoot): Promise<ReleaseRecord> {
  await verifyNpmCli(root);
  const dirs = [corePackageDirectory(root), ...["react", "devtools", "mcp"].map((name) => path.join(root, "packages", name))];
  const packages = dirs.map((dir) => JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")) as ReleasePackage);
  const version = validatePackageSet(packages),
    versions = new Map(packages.map((pkg) => [pkg.name, pkg.version]));
  const coreManifest = await Bun.file(path.join(root, "dist/custom-elements.json")).json();
  const documentation = await Bun.file(path.join(root, "packages/mcp/dist/documentation.json")).json();
  if (coreManifest["x-acme-version"] !== version || documentation.version !== version) {
    throw new Error("Rebuild runtime and documentation for the coordinated release version");
  }
  const source = releaseSource(root);
  const archives = path.join(root, ".artifacts/release/archives"),
    records: ArchiveRecord[] = [];
  for (let index = 0; index < dirs.length; index++) {
    const packed = await packPackage(dirs[index], archives, versions),
      metadata = await archiveManifest(packed.file);
    if (metadata.name !== packages[index].name || metadata.version !== version) {
      throw new Error("Packed identity does not match source");
    }
    records.push({ name: metadata.name, version, filename: archiveFilename(metadata), sha512: await digest(packed.file), blockers: publicationBlockers(metadata) });
  }
  const record: ReleaseRecord = { schemaVersion: 2, version, ...source, packages: records };
  await Bun.write(path.join(root, ".artifacts/release/release.json"), JSON.stringify(record, null, 2) + "\n");
  return record;
}
export async function validateRelease(directory: string, ref?: string): Promise<ReleaseRecord> {
  const record = JSON.parse(await Bun.file(path.join(directory, "release.json")).text()) as ReleaseRecord;
  if (record.schemaVersion !== 2 || !["clean", "dirty"].includes(record.sourceTree) || !/^([a-f0-9]{40}|[a-f0-9]{64})$/.test(record.commit) || !Array.isArray(record.packages)) {
    throw new Error("Invalid release record");
  }
  if (ref) {
    validateReleaseTag(ref, record.version);
  }
  const manifests: ReleasePackage[] = [];
  for (const archive of record.packages) {
    validateArchiveRecord(archive, record.version);
    const file = path.join(directory, "archives", archive.filename);
    if ((await digest(file)) !== archive.sha512) {
      throw new Error("Release archive digest mismatch: " + archive.name);
    }
    const manifest = await archiveManifest(file);
    if (manifest.name !== archive.name || manifest.version !== archive.version) {
      throw new Error("Release archive identity mismatch");
    }
    manifests.push(manifest);
  }
  validatePackageSet(manifests);
  return record;
}
export async function publishRelease(directory: string): Promise<void> {
  const record = await validateRelease(directory, process.env.GITHUB_REF);
  requirePublishEnvironment(process.env, process.platform, record.version);
  requireCommittedSource(record);
  if (Bun.version !== releaseBunVersion) {
    throw new Error("Publication requires the verified Bun " + releaseBunVersion);
  }
  if (process.env.GITHUB_SHA !== record.commit) {
    throw new Error("Reviewed release commit does not match this workflow");
  }
  await verifyNpmCli();
  for (const archive of record.packages) {
    const file = path.join(directory, "archives", archive.filename),
      manifest = await archiveManifest(file),
      blockers = publicationBlockers(manifest);
    if (blockers.length) {
      throw new Error(archive.name + ": " + blockers.join("; "));
    }
  }
  // Validate the whole set first. A retry may skip only byte-identical published archives.
  const pending: ArchiveRecord[] = [];
  for (const archive of record.packages) {
    const response = await fetch("https://registry.npmjs.org/" + encodeURIComponent(archive.name) + "/" + record.version, { redirect: "error" });
    const metadata = response.status === 200 ? await response.json() : undefined;
    if (registryVersionState(response.status, metadata?.dist?.integrity, archive.sha512) === "missing") {
      pending.push(archive);
    }
  }
  for (const archive of pending) {
    const result = await npmCommand(["publish", path.join(directory, "archives", archive.filename), "--access=public", "--provenance", "--ignore-scripts", "--registry=https://registry.npmjs.org"], {
      env: publicationEnvironment(process.env),
    });
    if (result.status !== 0) {
      throw new Error("Publication failed: " + result.stderr);
    }
    console.log(archive.name + "@" + record.version + " published");
  }
}
if (import.meta.main) {
  requireReleaseRuntime();
  const mode = process.argv[2] ?? "validate",
    directory = path.resolve(process.argv[3] ?? path.join(repositoryRoot, ".artifacts/release"));
  if (mode === "prepare") {
    console.log(JSON.stringify(await prepareRelease(), null, 2));
  } else if (mode === "validate") {
    console.log(JSON.stringify(await validateRelease(directory, process.env.GITHUB_REF?.startsWith("refs/tags/") ? process.env.GITHUB_REF : undefined), null, 2));
  } else if (mode === "publish") {
    await publishRelease(directory);
  } else {
    throw new Error("Unknown release command");
  }
}
