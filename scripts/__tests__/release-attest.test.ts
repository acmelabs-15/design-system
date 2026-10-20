import { expect, test } from "bun:test";
import { provenanceSubject, validateProvenanceStatement } from "../release-attest";
import type { ArchiveRecord, ReleaseRecord } from "../release-policy";

const archive: ArchiveRecord = { name: "@acmelabs/design-system-react", version: "0.3.0", filename: "acmelabs-design-system-react-0.3.0.tgz", sha512: "a".repeat(128), blockers: [] };
const record: ReleaseRecord = { schemaVersion: 2, version: "0.3.0", commit: "b".repeat(40), sourceTree: "clean", packages: [archive] };
const statement = () => ({
  _type: "https://in-toto.io/Statement/v1",
  subject: [{ name: "pkg:npm/%40acmelabs/design-system-react@0.3.0", digest: { sha512: archive.sha512 } }],
  predicateType: "https://slsa.dev/provenance/v1",
  predicate: {
    buildDefinition: {
      buildType: "https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1",
      externalParameters: { workflow: { ref: "refs/tags/v0.3.0", repository: "https://github.com/acmelabs-15/design-system", path: ".github/workflows/publish-package.yml" } },
      resolvedDependencies: [{ uri: "git+https://github.com/acmelabs-15/design-system@refs/tags/v0.3.0", digest: { gitCommit: record.commit } }],
    },
    runDetails: { builder: { id: "https://github.com/actions/runner/github-hosted" } },
  },
});

test("release provenance binds the archive bytes, commit, tag, workflow and hosted runner", () => {
  expect(provenanceSubject(archive)).toEqual(statement().subject[0]);
  expect(() => validateProvenanceStatement(statement(), record, archive)).not.toThrow();
  const mutations = [
    (value: ReturnType<typeof statement>) => {
      value.subject[0].digest.sha512 = "c".repeat(128);
    },
    (value: ReturnType<typeof statement>) => {
      value.subject[0].name = "pkg:npm/other@0.3.0";
    },
    (value: ReturnType<typeof statement>) => {
      value.subject.push(value.subject[0]);
    },
    (value: ReturnType<typeof statement>) => {
      value.predicate.buildDefinition.resolvedDependencies[0].digest.gitCommit = "c".repeat(40);
    },
    (value: ReturnType<typeof statement>) => {
      value.predicate.buildDefinition.externalParameters.workflow.ref = "refs/heads/main";
    },
    (value: ReturnType<typeof statement>) => {
      value.predicate.buildDefinition.externalParameters.workflow.path = ".github/workflows/other.yml";
    },
    (value: ReturnType<typeof statement>) => {
      value.predicate.buildDefinition.externalParameters.workflow.repository = "https://github.com/other/repo";
    },
    (value: ReturnType<typeof statement>) => {
      value.predicate.runDetails.builder.id = "https://github.com/actions/runner/self-hosted";
    },
    (value: ReturnType<typeof statement>) => {
      value.predicateType = "https://example.invalid";
    },
  ];
  for (const mutate of mutations) {
    const value = statement();
    mutate(value);
    expect(() => validateProvenanceStatement(value, record, archive)).toThrow();
  }
});
