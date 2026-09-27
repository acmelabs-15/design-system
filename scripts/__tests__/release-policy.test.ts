import { expect, test } from "bun:test";
import {
  archiveFilename,
  publicationBlockers,
  publicationEnvironment,
  registryVersionState,
  releasePackageNames,
  requirePublishEnvironment,
  requireCommittedSource,
  requireReleaseRuntime,
  validateArchiveRecord,
  validatePackageSet,
  validateReleaseTag,
} from "../release-policy";

const packages = releasePackageNames.map((name) => ({
  name,
  version: "0.3.0",
  repository: { url: "git+https://github.com/acmelabs-15/design-system.git" },
  ...(name === releasePackageNames[0] ? {} : { peerDependencies: { [releasePackageNames[0]]: "0.3.0" } }),
}));
test("dirty local candidates cannot be published as committed source", () => {
  const clean = { schemaVersion: 2 as const, version: "0.3.0", commit: "a".repeat(40), sourceTree: "clean" as const, packages: [] };
  expect(() => requireCommittedSource(clean)).not.toThrow();
  expect(() => requireCommittedSource({ ...clean, sourceTree: "dirty" })).toThrow("clean committed source");
});
test("publication retry skips only byte-identical existing versions", () => {
  const digest = "a".repeat(128);
  const integrity = "sha512-" + Buffer.from(digest, "hex").toString("base64");
  expect(registryVersionState(404, undefined, digest)).toBe("missing");
  expect(registryVersionState(200, integrity, digest)).toBe("identical");
  expect(() => registryVersionState(200, "sha512-other", digest)).toThrow("differs");
  expect(() => registryVersionState(200, undefined, digest)).toThrow("differs");
  expect(() => registryVersionState(503, undefined, digest)).toThrow("check failed");
});
test("release identity requires coordinated packages, peers and exact tag", () => {
  expect(validatePackageSet(packages)).toBe("0.3.0");
  expect(() => validatePackageSet(packages.slice(1))).toThrow();
  expect(() => validatePackageSet([...packages.slice(0, 3), packages[0]])).toThrow();
  expect(() => validatePackageSet(packages.map((p, i) => (i ? { ...p, version: "0.2.0" } : p)))).toThrow();
  expect(() => validatePackageSet(packages.map((p, i) => (i ? { ...p, peerDependencies: { [releasePackageNames[0]]: "^0.3.0" } } : p)))).toThrow();
  expect(() => validateReleaseTag("refs/tags/v0.3.0", "0.3.0")).not.toThrow();
  for (const ref of ["refs/heads/main", "refs/tags/v0.2.0", "refs/tags/v0.3.0;echo unsafe"]) {
    expect(() => validateReleaseTag(ref, "0.3.0")).toThrow();
  }
});
test("archive names and digest records cannot escape release artifacts", () => {
  const record = { name: releasePackageNames[0], version: "0.3.0", filename: archiveFilename(packages[0]), sha512: "a".repeat(128), blockers: [] };
  expect(() => validateArchiveRecord(record, "0.3.0")).not.toThrow();
  expect(() => validateArchiveRecord({ ...record, filename: "../outside.tgz" }, "0.3.0")).toThrow();
  expect(() => validateArchiveRecord({ ...record, sha512: "bad" }, "0.3.0")).toThrow();
});
test("publishing stays disabled outside explicit verified release context", () => {
  const env = { ACME_RELEASE_ENABLED: "true", GITHUB_ACTIONS: "true", RUNNER_ENVIRONMENT: "github-hosted", GITHUB_REPOSITORY: "acmelabs-15/design-system", GITHUB_REF: "refs/tags/v0.3.0" };
  expect(() => requirePublishEnvironment(env, "linux", "0.3.0")).not.toThrow();
  expect(() => requirePublishEnvironment({ ...env, ACME_RELEASE_ENABLED: undefined }, "linux", "0.3.0")).toThrow("disabled");
  expect(() => requirePublishEnvironment(env, "darwin", "0.3.0")).toThrow();
  expect(() => requirePublishEnvironment({ ...env, GITHUB_REPOSITORY: "other/repo" }, "linux", "0.3.0")).toThrow();
  expect(() => requireReleaseRuntime("1.4.0")).toThrow();
  expect(() => requireReleaseRuntime("1.4.2")).not.toThrow();
});
test("private packages and mismatched repository metadata block actual publication", () => {
  expect(publicationBlockers(packages[0])).toEqual([]);
  expect(publicationBlockers({ ...packages[0], private: true })).toContain("Package remains private");
  expect(publicationBlockers({ ...packages[0], repository: { url: "https://github.com/other/repo" } })).toHaveLength(1);
});
test("npm receives only CI identity context, never inherited local token configuration", () => {
  expect(
    publicationEnvironment({
      GITHUB_ACTIONS: "true",
      ACTIONS_ID_TOKEN_REQUEST_TOKEN: "local-fixture",
      NPM_TOKEN: "forbidden-fixture",
      NPM_ID_TOKEN: "forbidden-fixture",
      NPM_CONFIG_REGISTRY: "https://other.invalid",
      NODE_AUTH_TOKEN: "forbidden-fixture",
    }),
  ).toEqual({ GITHUB_ACTIONS: "true", ACTIONS_ID_TOKEN_REQUEST_TOKEN: "local-fixture" });
});
