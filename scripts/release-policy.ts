import path from "node:path";

export const releasePackageNames = ["@acmelabs/design-system", "@acmelabs/design-system-react", "@acmelabs/design-system-devtools", "@acmelabs/design-system-mcp"] as const;
export const releaseRepository = "acmelabs-15/design-system";
export const npmVersion = "12.0.2";
export const releaseBunVersion = "1.4.2";
export function requireReleaseRuntime(version = Bun.version): void {
  if (version !== releaseBunVersion) {
    throw new Error("Release verification requires Bun " + releaseBunVersion);
  }
}
export type ReleasePackage = { name: string; version: string; private?: boolean; repository?: { url?: string }; peerDependencies?: Record<string, string> };
export type ArchiveRecord = { name: string; version: string; filename: string; sha512: string; blockers: string[] };
export type ReleaseRecord = { schemaVersion: 2; version: string; commit: string; sourceTree: "clean" | "dirty"; packages: ArchiveRecord[] };
export function requireCommittedSource(record: ReleaseRecord): void {
  if (record.sourceTree !== "clean") {
    throw new Error("Publication requires archives prepared from a clean committed source tree");
  }
}

export function validateVersion(version: string): void {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?$/.test(version)) {
    throw new Error("Invalid release version");
  }
}
export function validateReleaseTag(ref: string, version: string): void {
  validateVersion(version);
  if (ref !== `refs/tags/v${version}`) {
    throw new Error("Release tag must exactly match v" + version);
  }
}
export function publicationBlockers(pkg: ReleasePackage): string[] {
  const blockers: string[] = [];
  if (pkg.private) {
    blockers.push("Package remains private");
  }
  if (pkg.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, "") !== `https://github.com/${releaseRepository}`) {
    blockers.push("Repository URL does not match the trusted-publisher repository");
  }
  return blockers;
}
export function validatePackageSet(packages: readonly ReleasePackage[]): string {
  if (
    packages.length !== releasePackageNames.length ||
    new Set(packages.map((pkg) => pkg.name)).size !== packages.length ||
    releasePackageNames.some((name) => !packages.some((pkg) => pkg.name === name))
  ) {
    throw new Error("Release requires exactly the four coordinated packages");
  }
  const version = packages[0].version;
  validateVersion(version);
  for (const pkg of packages) {
    if (pkg.version !== version) {
      throw new Error("Package versions must match");
    }
    if (pkg.name !== releasePackageNames[0] && pkg.peerDependencies?.[releasePackageNames[0]] !== version) {
      throw new Error("Core peer dependency must match the release version");
    }
  }
  return version;
}
export function archiveFilename(pkg: Pick<ReleasePackage, "name" | "version">): string {
  validateVersion(pkg.version);
  if (!(releasePackageNames as readonly string[]).includes(pkg.name)) {
    throw new Error("Unknown release package");
  }
  return pkg.name.replace(/^@/, "").replace("/", "-") + "-" + pkg.version + ".tgz";
}
export function validateArchiveRecord(record: ArchiveRecord, version: string): void {
  if (
    record.version !== version ||
    record.filename !== archiveFilename(record) ||
    path.basename(record.filename) !== record.filename ||
    !/^[a-f0-9]{128}$/.test(record.sha512) ||
    !Array.isArray(record.blockers) ||
    record.blockers.some((value) => typeof value !== "string")
  ) {
    throw new Error("Invalid release archive record");
  }
}
export function registryVersionState(status: number, integrity: unknown, sha512: string): "missing" | "identical" {
  if (status === 404) {
    return "missing";
  }
  if (status !== 200) {
    throw new Error("Registry version check failed: HTTP " + status);
  }
  const expected = "sha512-" + Buffer.from(sha512, "hex").toString("base64");
  if (integrity !== expected) {
    throw new Error("Published version differs from the reviewed archive");
  }
  return "identical";
}
export function requirePublishEnvironment(environment: Record<string, string | undefined>, platform: string, version: string): void {
  if (environment.ACME_RELEASE_ENABLED !== "true") {
    throw new Error("Publication remains disabled pending external verification");
  }
  if (environment.GITHUB_ACTIONS !== "true" || environment.RUNNER_ENVIRONMENT !== "github-hosted" || platform !== "linux") {
    throw new Error("Publication requires the verified GitHub-hosted Linux runner");
  }
  if (environment.GITHUB_REPOSITORY !== releaseRepository) {
    throw new Error("Unexpected publication repository");
  }
  validateReleaseTag(environment.GITHUB_REF ?? "", version);
}

/** Only the CI identity context reaches npm; local token/config environment does not. */
export function publicationEnvironment(environment: Record<string, string | undefined>): Record<string, string | undefined> {
  const keys = [
    "PATH",
    "TMPDIR",
    "TMP",
    "TEMP",
    "CI",
    "GITHUB_ACTIONS",
    "GITHUB_REPOSITORY",
    "GITHUB_WORKFLOW_REF",
    "GITHUB_SERVER_URL",
    "GITHUB_EVENT_NAME",
    "GITHUB_REPOSITORY_ID",
    "GITHUB_REPOSITORY_OWNER_ID",
    "GITHUB_REF",
    "GITHUB_SHA",
    "GITHUB_RUN_ID",
    "GITHUB_RUN_ATTEMPT",
    "RUNNER_ENVIRONMENT",
    "ACTIONS_ID_TOKEN_REQUEST_URL",
    "ACTIONS_ID_TOKEN_REQUEST_TOKEN",
  ];
  return Object.fromEntries(keys.filter((key) => environment[key] !== undefined).map((key) => [key, environment[key]]));
}
