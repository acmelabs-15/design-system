import assert from "node:assert/strict";
import path from "node:path";
import { npmDirectory, verifyNpmCli } from "./release-npm";
import { validateRelease } from "./release";
import { releaseRepository, requireCommittedSource, requireReleaseEnvironment, requireReleaseRuntime, type ArchiveRecord, type ReleaseRecord } from "./release-policy";

const repository = `https://github.com/${releaseRepository}`;
const workflowPath = ".github/workflows/publish-package.yml";
const tag = (record: ReleaseRecord) => `refs/tags/v${record.version}`;
const identity = (record: ReleaseRecord) => `${repository}/${workflowPath}@${tag(record)}`;

export const provenanceSubject = (archive: ArchiveRecord) => ({
  name: `pkg:npm/${archive.name.replace("@", "%40")}@${archive.version}`,
  digest: { sha512: archive.sha512 },
});

type Statement = {
  _type?: string;
  subject?: unknown;
  predicateType?: string;
  predicate?: {
    buildDefinition?: { buildType?: string; externalParameters?: { workflow?: unknown }; resolvedDependencies?: unknown };
    runDetails?: { builder?: { id?: string } };
  };
};

export function validateProvenanceStatement(statement: Statement, record: ReleaseRecord, archive: ArchiveRecord): void {
  assert.equal(statement._type, "https://in-toto.io/Statement/v1");
  assert.equal(statement.predicateType, "https://slsa.dev/provenance/v1");
  assert.deepEqual(statement.subject, [provenanceSubject(archive)]);
  assert.equal(statement.predicate?.buildDefinition?.buildType, "https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1");
  assert.deepEqual(statement.predicate?.buildDefinition?.externalParameters?.workflow, { ref: tag(record), repository, path: workflowPath });
  assert.deepEqual(statement.predicate?.buildDefinition?.resolvedDependencies, [{ uri: `git+${repository}@${tag(record)}`, digest: { gitCommit: record.commit } }]);
  assert.equal(statement.predicate?.runDetails?.builder?.id, "https://github.com/actions/runner/github-hosted");
}

export async function verifyReleaseProvenance(directory: string): Promise<ReleaseRecord> {
  requireReleaseRuntime();
  await verifyNpmCli();
  const record = await validateRelease(directory);
  requireCommittedSource(record);
  const sigstore = await import(Bun.resolveSync("sigstore", npmDirectory()));
  const verifier = await sigstore.createVerifier({
    certificateIdentityURI: identity(record),
    certificateIssuer: "https://token.actions.githubusercontent.com",
    tufCachePath: path.join(directory, "trust-cache"),
    timeout: 20000,
    retry: 1,
  });
  for (const archive of record.packages) {
    const bundle = await Bun.file(path.join(directory, "provenance", archive.filename + ".sigstore.json")).json();
    await verifier.verify(bundle);
    validateProvenanceStatement(JSON.parse(Buffer.from(bundle.dsseEnvelope.payload, "base64").toString("utf8")), record, archive);
  }
  return record;
}

export async function signReleaseProvenance(directory: string): Promise<void> {
  requireReleaseRuntime();
  await verifyNpmCli();
  const record = await validateRelease(directory, process.env.GITHUB_REF);
  requireCommittedSource(record);
  requireReleaseEnvironment(process.env, process.platform, record.version);
  assert.equal(process.env.GITHUB_SHA, record.commit);
  assert.equal(process.env.GITHUB_WORKFLOW_REF, `${releaseRepository}/${workflowPath}@${tag(record)}`);
  const { generateProvenance } = await import(path.join(npmDirectory(), "node_modules/libnpmpublish/lib/provenance.js"));
  for (const archive of record.packages) {
    const bundle = await generateProvenance([provenanceSubject(archive)], { timeout: 20000, retry: 1 });
    await Bun.write(path.join(directory, "provenance", archive.filename + ".sigstore.json"), JSON.stringify(bundle, null, 2) + "\n");
  }
  await verifyReleaseProvenance(directory);
  console.log("All four reviewed archives have verified GitHub provenance.");
}

if (import.meta.main) {
  const mode = process.argv[2];
  const directory = path.resolve(process.argv[3] ?? ".artifacts/release");
  if (mode === "sign") {
    await signReleaseProvenance(directory);
  } else if (mode === "verify") {
    const record = await verifyReleaseProvenance(directory);
    console.log(`Verified ${record.packages.length} archives for ${record.version} at ${record.commit}.`);
  } else {
    throw new Error("Expected sign or verify");
  }
}
