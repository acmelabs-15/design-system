import assert from "node:assert/strict";
import { registryVersionState, type ArchiveRecord } from "./release-policy";

type RegistryVersion = { status: number; metadata?: unknown };
type ConfirmationOptions = {
  attempts?: number;
  wait?: () => Promise<void>;
  read?: (archive: ArchiveRecord) => Promise<RegistryVersion>;
};

function object(value: unknown): Record<string, unknown> {
  assert.ok(value && typeof value === "object" && !Array.isArray(value), "Invalid public package metadata");
  return value as Record<string, unknown>;
}

async function readRegistryVersion(archive: ArchiveRecord): Promise<RegistryVersion> {
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(archive.name)}/${archive.version}`, {
    headers: { "Cache-Control": "no-cache" },
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  return { status: response.status, metadata: response.status === 200 ? await response.json() : undefined };
}

export async function waitForPublishedArchive(archive: ArchiveRecord, options: ConfirmationOptions = {}): Promise<void> {
  const { attempts = 30, wait = () => Bun.sleep(2000), read = readRegistryVersion } = options;
  assert.ok(Number.isInteger(attempts) && attempts > 0 && attempts <= 30, "Publication confirmation requires between 1 and 30 attempts");
  for (let attempt = 0; attempt < attempts; attempt++) {
    const response = await read(archive);
    if (response.status === 200) {
      const metadata = object(response.metadata);
      assert.equal(metadata.name, archive.name, "Published package name differs");
      assert.equal(metadata.version, archive.version, "Published version differs");
      const dist = object(metadata.dist);
      registryVersionState(response.status, dist.integrity, archive.sha512);
      if (dist.attestations !== undefined) {
        const attestations = object(dist.attestations);
        if (attestations.url !== undefined) {
          assert.equal(typeof attestations.url, "string", "Invalid public provenance URL");
          const url = new URL(attestations.url as string);
          assert.equal(url.origin, "https://registry.npmjs.org", "Unexpected public provenance origin");
          assert.equal(decodeURIComponent(url.pathname), `/-/npm/v1/attestations/${archive.name}@${archive.version}`, "Provenance link names another package or version");
          assert.equal(url.username + url.password + url.search + url.hash, "", "Unexpected public provenance URL fields");
          return;
        }
      }
    } else {
      registryVersionState(response.status, undefined, archive.sha512);
    }
    if (attempt + 1 < attempts) {
      await wait();
    }
  }
  throw new Error(
    `${archive.name}@${archive.version} is not yet publicly available with matching integrity and provenance. npm may still be validating the upload; inspect its status before retrying.`,
  );
}
