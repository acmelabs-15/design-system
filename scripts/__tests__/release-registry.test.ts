import { expect, test } from "bun:test";
import { waitForPublishedArchive } from "../release-registry";
import type { ArchiveRecord } from "../release-policy";

const archive: ArchiveRecord = { name: "@acmelabs/design-system-react", version: "0.3.0", filename: "acmelabs-design-system-react-0.3.0.tgz", sha512: "a".repeat(128), blockers: [] };
const metadata = () => ({
  name: archive.name,
  version: archive.version,
  dist: {
    integrity: "sha512-" + Buffer.from(archive.sha512, "hex").toString("base64"),
    attestations: { url: "https://registry.npmjs.org/-/npm/v1/attestations/@acmelabs%2fdesign-system-react@0.3.0" },
  },
});
const noWait = async () => {};

test("accepted uploads wait for matching public metadata and provenance", async () => {
  const pending = metadata();
  delete (pending.dist as { attestations?: unknown }).attestations;
  const responses = [{ status: 404 }, { status: 200, metadata: pending }, { status: 200, metadata: metadata() }];
  let waits = 0;
  await expect(
    waitForPublishedArchive(archive, {
      attempts: 3,
      wait: async () => {
        waits++;
      },
      read: async () => responses.shift()!,
    }),
  ).resolves.toBeUndefined();
  expect(responses).toHaveLength(0);
  expect(waits).toBe(2);
});

test("an upload held in npm review cannot be reported as published", async () => {
  await expect(waitForPublishedArchive(archive, { attempts: 2, wait: noWait, read: async () => ({ status: 404 }) })).rejects.toThrow("not yet publicly available");
});

test("matching package metadata without provenance cannot be reported as published", async () => {
  for (const attestations of [undefined, {}]) {
    const pending = metadata();
    (pending.dist as { attestations?: unknown }).attestations = attestations;
    await expect(waitForPublishedArchive(archive, { attempts: 2, wait: noWait, read: async () => ({ status: 200, metadata: pending }) })).rejects.toThrow("not yet publicly available");
  }
});

test("publication confirmation rejects conflicting bytes, package identity and provenance links", async () => {
  for (const change of [
    (value: ReturnType<typeof metadata>) => {
      value.dist.integrity = "sha512-other";
    },
    (value: ReturnType<typeof metadata>) => {
      value.name = "@acmelabs/other";
    },
    (value: ReturnType<typeof metadata>) => {
      value.version = "0.4.0";
    },
    (value: ReturnType<typeof metadata>) => {
      value.dist.attestations.url = "https://other.invalid/attestation";
    },
    (value: ReturnType<typeof metadata>) => {
      value.dist.attestations.url = "https://registry.npmjs.org/-/npm/v1/attestations/other@0.3.0";
    },
  ]) {
    const value = metadata();
    change(value);
    await expect(waitForPublishedArchive(archive, { attempts: 1, wait: noWait, read: async () => ({ status: 200, metadata: value }) })).rejects.toThrow();
  }
});

test("registry errors and invalid retry bounds cannot pass publication confirmation", async () => {
  await expect(waitForPublishedArchive(archive, { attempts: 1, wait: noWait, read: async () => ({ status: 503 }) })).rejects.toThrow("HTTP 503");
  await expect(waitForPublishedArchive(archive, { attempts: 0, wait: noWait, read: async () => ({ status: 200, metadata: metadata() }) })).rejects.toThrow();
});
