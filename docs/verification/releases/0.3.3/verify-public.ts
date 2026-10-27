// Read-only check of the public 0.3.3 packages against the publish run's archive record.
// Usage: bun docs/verification/releases/0.3.3/verify-public.ts <release.json> <output.json>
import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { npmDirectory, verifyNpmCli } from "../../../../scripts/release-npm";
import { repositoryRoot } from "../../../../scripts/core-package";

type ArchiveRecord = { name: string; version: string; filename: string; sha512: string };
const [releaseFile, output] = process.argv.slice(2);
assert.ok(releaseFile && output, "Pass the release record and an output path");
const release: { version: string; commit: string; packages: ArchiveRecord[] } = await Bun.file(releaseFile).json();
const registry = "https://registry.npmjs.org";
const identity = `https://github.com/acmelabs-15/design-system/.github/workflows/publish-package.yml@refs/tags/v${release.version}`;
const issuer = "https://token.actions.githubusercontent.com";

const get = async (url: string) => {
  const response = await fetch(url, { redirect: "error" });
  assert.ok(response.ok, `Read-only request failed: ${response.status} ${url}`);
  return response;
};

await verifyNpmCli();
const sigstore = await import(Bun.resolveSync("sigstore", npmDirectory()));
const verifier = await sigstore.createVerifier({
  certificateIdentityURI: identity,
  certificateIssuer: issuer,
  tufCachePath: path.join(repositoryRoot, ".artifacts/release/trust-cache"),
  timeout: 20000,
  retry: 1,
});

const verified = [];
for (const archive of release.packages) {
  assert.equal(archive.version, release.version);
  const metadata = await (await get(`${registry}/${encodeURIComponent(archive.name)}/${archive.version}`)).json();
  assert.equal(metadata.name, archive.name);
  assert.equal(new URL(metadata.dist.tarball).origin, registry);
  const tarball = Buffer.from(await (await get(metadata.dist.tarball)).arrayBuffer());
  const digest = createHash("sha512").update(tarball).digest("hex");
  assert.equal(digest, archive.sha512, `${archive.name}: public tarball differs from the reviewed archive`);
  assert.equal(metadata.dist.integrity, "sha512-" + Buffer.from(digest, "hex").toString("base64"));

  const attestationUrl = new URL(metadata.dist.attestations.url);
  assert.equal(attestationUrl.origin, registry);
  assert.equal(decodeURIComponent(attestationUrl.pathname), `/-/npm/v1/attestations/${archive.name}@${archive.version}`);
  const attestations = await (await get(attestationUrl.href)).json();
  const attestation = attestations.attestations.find((item: { predicateType: string }) => item.predicateType === "https://slsa.dev/provenance/v1");
  assert.ok(attestation, `${archive.name}: no SLSA provenance`);
  const statement = JSON.parse(Buffer.from(attestation.bundle.dsseEnvelope.payload, "base64").toString());
  assert.deepEqual(statement.subject, [{ name: `pkg:npm/${encodeURIComponent(archive.name).replace("%2F", "/")}@${archive.version}`, digest: { sha512: digest } }]);
  await verifier.verify(attestation.bundle);
  const tampered = structuredClone(attestation.bundle);
  tampered.dsseEnvelope.payload = Buffer.from("tampered provenance").toString("base64");
  await assert.rejects(async () => verifier.verify(tampered));

  const tags = await (await get(`${registry}/-/package/${encodeURIComponent(archive.name)}/dist-tags`)).json();
  assert.equal(tags.latest, archive.version, `${archive.name}: latest is ${tags.latest}`);
  verified.push({ name: archive.name, version: archive.version, sha512: digest, publicTarballVerified: true, publicProvenanceVerified: true, latestTagVerified: true });
}

const mcp = await (await get(`${registry}/${encodeURIComponent("@acmelabs/design-system-mcp")}/${release.version}`)).json();
const result = {
  checkedAt: new Date().toISOString(),
  bun: Bun.version,
  commit: release.commit,
  identity,
  issuer,
  verified,
  mcpDependencies: mcp.dependencies,
  tamperedPayloadRejected: true,
  limits: ["Read-only registry and transparency-log checks at the recorded time", "Does not verify the CDN or Pages delivery"],
};
await Bun.write(output, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
