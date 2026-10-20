import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, verify, X509Certificate } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { npmDirectory } from "./release-npm";

type SigningRequest = { credentials: { oidcIdentityToken: string }; publicKeyRequest: { publicKey: { content: string }; proofOfPossession: string } };
type Publication = { _attachments: Record<string, { data: string }> };
/** Isolated child process: all identity, issuer, witness and registry services are loopback mocks. */
export async function loopbackCrypto(archiveFile: string) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "acme-release-crypto-"));
  const ca = generateKeyPairSync("ec", { namedCurve: "prime256v1", privateKeyEncoding: { type: "pkcs8", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });
  fs.writeFileSync(path.join(temporary, "issuer.pem"), ca.privateKey, { mode: 0o600 });
  const subject = "repo:local/release:ref:refs/heads/test";
  const jwt = "local." + Buffer.from(JSON.stringify({ sub: subject, iss: "https://token.actions.githubusercontent.com", repository_visibility: "public" })).toString("base64url") + ".fixture";
  let certificate = "",
    publication: Publication | undefined;
  const calls: { method: string; path: string; audience: string | null }[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      const url = new URL(request.url),
        route = url.pathname.replace(/\/+/g, "/");
      calls.push({ method: request.method, path: route, audience: url.searchParams.get("audience") });
      if (route === "/oidc") {
        return Response.json({ value: jwt });
      }
      if (route === "/-/npm/v1/oidc/token/exchange/package/acme-release-probe") {
        return Response.json({ token: "local-registry-fixture" });
      }
      if (route === "/-/package/acme-release-probe/visibility") {
        return Response.json({ public: true });
      }
      if (route === "/api/v2/signingCert") {
        const body = (await request.json()) as SigningRequest;
        assert.equal(body.credentials.oidcIdentityToken, jwt);
        assert.equal(verify("sha256", Buffer.from(subject), body.publicKeyRequest.publicKey.content, Buffer.from(body.publicKeyRequest.proofOfPossession, "base64")), true);
        fs.writeFileSync(path.join(temporary, "public.pem"), body.publicKeyRequest.publicKey.content);
        const child = Bun.spawn(
          [
            "openssl",
            "x509",
            "-new",
            "-force_pubkey",
            path.join(temporary, "public.pem"),
            "-subj",
            "/CN=Local release fixture",
            "-key",
            path.join(temporary, "issuer.pem"),
            "-days",
            "1",
            "-out",
            path.join(temporary, "certificate.pem"),
          ],
          { stdout: "pipe", stderr: "pipe" },
        );
        const error = await new Response(child.stderr).text();
        assert.equal(await child.exited, 0, error);
        certificate = fs.readFileSync(path.join(temporary, "certificate.pem"), "utf8");
        return Response.json({ signedCertificateEmbeddedSct: { chain: { certificates: [certificate] } } });
      }
      if (route === "/api/v1/log/entries") {
        return Response.json({
          fixture: {
            body: Buffer.from(JSON.stringify(await request.json())).toString("base64"),
            integratedTime: Math.floor(Date.now() / 1000),
            logID: "01".repeat(32),
            logIndex: 1,
            verification: { signedEntryTimestamp: Buffer.from("LOCAL MOCK WITNESS").toString("base64") },
          },
        });
      }
      if (route === "/acme-release-probe" && request.method === "PUT") {
        publication = (await request.json()) as Publication;
        return Response.json({ ok: true }, { status: 201 });
      }
      return new Response("Unexpected loopback route", { status: 404 });
    },
  });
  Object.assign(process.env, {
    CI: "true",
    GITHUB_ACTIONS: "true",
    GITHUB_REPOSITORY: "local/release",
    GITHUB_WORKFLOW_REF: "local/release/.github/workflows/test.yml@refs/heads/test",
    GITHUB_SERVER_URL: "https://github.com",
    GITHUB_EVENT_NAME: "workflow_dispatch",
    GITHUB_REPOSITORY_ID: "0",
    GITHUB_REPOSITORY_OWNER_ID: "0",
    GITHUB_REF: "refs/heads/test",
    GITHUB_SHA: "0".repeat(40),
    GITHUB_RUN_ID: "0",
    GITHUB_RUN_ATTEMPT: "1",
    RUNNER_ENVIRONMENT: "github-hosted",
    ACTIONS_ID_TOKEN_REQUEST_URL: server.url.href + "oidc",
    ACTIONS_ID_TOKEN_REQUEST_TOKEN: "local-actions-fixture",
  });
  try {
    const opts: Record<string, unknown> = { registry: server.url.href, retry: 0, timeout: 5000 };
    const writes: { key: string; value: unknown; where: string }[] = [];
    const { oidc } = await import(path.join(npmDirectory(), "lib/utils/oidc.js"));
    await oidc({
      packageName: "acme-release-probe",
      registry: server.url.href,
      opts,
      config: {
        isDefault: (key: string) => key === "provenance",
        set: (key: string, value: unknown, where: string) => writes.push({ key, value: key.endsWith(":_authToken") ? "[LOCAL FIXTURE]" : value, where }),
      },
    });
    assert.equal(opts.provenance, true);
    assert.ok(Object.keys(opts).some((key) => key.endsWith(":_authToken")));
    assert.equal(calls[0].audience, "npm:127.0.0.1");
    const { default: publish } = await import(path.join(npmDirectory(), "node_modules/libnpmpublish/lib/publish.js"));
    const archive = Buffer.from(await Bun.file(archiveFile).arrayBuffer());
    await publish({ name: "acme-release-probe", version: "0.0.0" }, archive, {
      ...opts,
      access: "public",
      provenance: true,
      fulcioURL: server.url.href,
      rekorURL: server.url.href,
      identityToken: jwt,
      npmVersion: "12.0.2",
    });
    assert.ok(publication);
    const bundle = JSON.parse(publication._attachments["acme-release-probe-0.0.0.sigstore"].data),
      envelope = bundle.dsseEnvelope,
      payload = Buffer.from(envelope.payload, "base64"),
      statement = JSON.parse(payload.toString());
    const pae = Buffer.concat([Buffer.from(`DSSEv1 ${Buffer.byteLength(envelope.payloadType)} ${envelope.payloadType} ${payload.length} `), payload]);
    const publicKey = new X509Certificate(certificate).publicKey,
      signature = Buffer.from(envelope.signatures[0].sig, "base64");
    assert.equal(verify("sha256", pae, publicKey, signature), true);
    const changed = Buffer.from(pae);
    changed[changed.length - 1] ^= 1;
    assert.equal(verify("sha256", changed, publicKey, signature), false);
    assert.equal(statement.subject[0].digest.sha512, createHash("sha512").update(archive).digest("hex"));
    assert.equal(statement.predicate.buildDefinition.externalParameters.workflow.path, ".github/workflows/test.yml");
    assert.equal(statement.predicate.runDetails.builder.id, "https://github.com/actions/runner/github-hosted");
    assert.equal(bundle.verificationMaterial.tlogEntries.length, 1);
    assert.equal(Buffer.from(publication._attachments["acme-release-probe-0.0.0.tgz"].data, "base64").equals(archive), true);
    return {
      bun: Bun.version,
      npm: "12.0.2",
      calls,
      writes,
      proofOfPossession: true,
      signatureVerified: true,
      tamperingRejected: true,
      tarballDigestMatches: true,
      workflowClaimsMatch: true,
      attachmentsMatch: true,
      limits: ["Only loopback identity/issuer/registry/witness services", "Mock witness is not a trusted transparency proof", "No external identity request, publication or signing"],
    };
  } finally {
    server.stop(true);
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
if (import.meta.main) {
  const result = await loopbackCrypto(process.argv[2]);
  await Bun.write(process.argv[3], JSON.stringify(result, null, 2) + "\n");
}
