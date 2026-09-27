import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { npmDirectory, verifyNpmCli } from "./release-npm";
import { repositoryRoot } from "./core-package";

/** Read-only verification of an existing public attestation; no identity or signing request. */
export async function verifyPublishedProvenance() {
  await verifyNpmCli();
  const version = "0.2.0",
    name = "@acmelabs/design-system";
  const metadataUrl = `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`;
  const attestationUrl = `https://registry.npmjs.org/-/npm/v1/attestations/@acmelabs%2fdesign-system@${version}`;
  const get = async (url: string) => {
    const response = await fetch(url, { redirect: "error" });
    if (!response.ok) {
      throw new Error("Read-only provenance request failed: " + response.status);
    }
    return response;
  };
  const metadata = await (await get(metadataUrl)).json();
  assert.equal(metadata.name, name);
  assert.equal(metadata.version, version);
  const tarballUrl = `https://registry.npmjs.org/@acmelabs/design-system/-/design-system-${version}.tgz`;
  assert.equal(metadata.dist.tarball, tarballUrl);
  const archive = Buffer.from(await (await get(tarballUrl)).arrayBuffer());
  assert.equal("sha512-" + createHash("sha512").update(archive).digest("base64"), metadata.dist.integrity);
  const attestations = await (await get(attestationUrl)).json();
  const attestation = attestations.attestations.find((item: { predicateType: string }) => item.predicateType === "https://slsa.dev/provenance/v1");
  assert.ok(attestation);
  const statement = JSON.parse(Buffer.from(attestation.bundle.dsseEnvelope.payload, "base64").toString());
  assert.deepEqual(statement.subject, [{ name: "pkg:npm/%40acmelabs/design-system@0.2.0", digest: { sha512: createHash("sha512").update(archive).digest("hex") } }]);
  const identity = "https://github.com/acmelabs-15/design-system/.github/workflows/publish-package.yml@refs/tags/v0.2.0";
  const module = await import(Bun.resolveSync("sigstore", npmDirectory()));
  const verifier = await module.createVerifier({
    certificateIdentityURI: identity,
    certificateIssuer: "https://token.actions.githubusercontent.com",
    tufCachePath: path.join(repositoryRoot, ".artifacts/release/trust-cache"),
    timeout: 20000,
    retry: 1,
  });
  await verifier.verify(attestation.bundle);
  const tampered = structuredClone(attestation.bundle);
  tampered.dsseEnvelope.payload = Buffer.from("tampered provenance").toString("base64");
  let rejected = false;
  try {
    await verifier.verify(tampered);
  } catch {
    rejected = true;
  }
  assert.equal(rejected, true);
  const result = {
    bun: Bun.version,
    npm: "12.0.2",
    package: name,
    version,
    metadataUrl,
    attestationUrl,
    tarballUrl,
    identity,
    issuer: "https://token.actions.githubusercontent.com",
    registryIntegrityMatches: true,
    statementDigestMatches: true,
    trustAndTransparencyVerified: true,
    tamperedPayloadRejected: true,
    limits: ["Read-only verification of existing0.2.0 provenance", "Does not verify future publication permissions, live OIDC exchange, new signing or Linux CI"],
  };
  await Bun.write(path.join(repositoryRoot, ".artifacts/release/published-trust.json"), JSON.stringify(result, null, 2) + "\n");
  return result;
}
if (import.meta.main) {
  console.log(JSON.stringify(await verifyPublishedProvenance(), null, 2));
}
