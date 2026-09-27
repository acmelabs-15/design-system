import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { packPackage } from "../package";
import { validateRelease } from "../release";
import { archiveFilename, releasePackageNames, type ReleaseRecord } from "../release-policy";
import { verifyNpmCli } from "../release-npm";

test("release validation verifies actual archive identity, tags and immutable bytes", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-release-validation-"));
  try {
    const record: ReleaseRecord = { schemaVersion: 2, version: "0.3.0", commit: "a".repeat(40), sourceTree: "clean", packages: [] };
    for (const name of releasePackageNames) {
      const dir = path.join(root, name.split("/")[1]);
      fs.mkdirSync(dir);
      const pkg = { name, version: "0.3.0", files: ["index.js"], peerDependencies: name === releasePackageNames[0] ? {} : { [releasePackageNames[0]]: "0.3.0" } };
      fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));
      fs.writeFileSync(path.join(dir, "index.js"), "export const fixture=true;");
      const packed = await packPackage(dir, path.join(root, "archives"));
      record.packages.push({
        name,
        version: "0.3.0",
        filename: archiveFilename(pkg),
        sha512: new Bun.CryptoHasher("sha512").update(await Bun.file(packed.file).arrayBuffer()).digest("hex"),
        blockers: [],
      });
    }
    await Bun.write(path.join(root, "release.json"), JSON.stringify(record));
    expect((await validateRelease(root, "refs/tags/v0.3.0")).version).toBe("0.3.0");
    await Bun.write(path.join(root, "release.json"), JSON.stringify({ ...record, sourceTree: "dirty" }));
    expect((await validateRelease(root)).sourceTree).toBe("dirty");
    await Bun.write(path.join(root, "release.json"), JSON.stringify({ ...record, sourceTree: undefined }));
    await expect(validateRelease(root)).rejects.toThrow("Invalid release record");
    await Bun.write(path.join(root, "release.json"), JSON.stringify(record));
    await expect(validateRelease(root, "refs/tags/v0.2.0")).rejects.toThrow();
    fs.appendFileSync(path.join(root, "archives", record.packages[0].filename), "changed");
    await expect(validateRelease(root)).rejects.toThrow("digest mismatch");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
test("the pinned npm CLI executes under the verified Bun runtime", async () => {
  await verifyNpmCli();
});
