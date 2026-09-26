import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { corePackageDirectory, ensureCorePackageLinks, readCorePackage } from "../core-package";

test("core metadata and generated delivery links have one explicit owner", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-core-paths-"));
  try {
    const core = corePackageDirectory(root);
    fs.mkdirSync(core, { recursive: true });
    fs.writeFileSync(path.join(core, "package.json"), JSON.stringify({ name: "core-fixture", version: "1.0.0" }));
    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "build-fixture", private: true }));
    expect(readCorePackage(root).name).toBe("core-fixture");
    ensureCorePackageLinks(root);
    expect(fs.readlinkSync(path.join(core, "dist"))).toBe("../../dist");
    expect(fs.readlinkSync(path.join(core, "assets"))).toBe("../../assets");
    expect(fs.readlinkSync(path.join(core, "skills"))).toBe("../../dist/skills");
    ensureCorePackageLinks(root);
    fs.unlinkSync(path.join(core, "dist"));
    fs.mkdirSync(path.join(core, "dist"));
    expect(() => ensureCorePackageLinks(root)).toThrow("Unexpected core delivery path");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
