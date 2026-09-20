import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { packPackage, productionManifest } from "../package";

test("private workspaces resolve the one live core build", () => {
  const root = path.resolve(import.meta.dir, "../..");
  const core = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  for (const name of ["react", "devtools", "mcp"]) {
    const directory = path.join(root, "packages", name);
    const pkg = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
    expect(pkg.private).toBe(true);
    expect(pkg.peerDependencies[core.name]).toBe(core.version);
    expect(fs.realpathSync(Bun.resolveSync(core.name, directory))).toBe(path.join(root, "dist/index.js"));
  }
});

test("production metadata contains runtime contracts and resolves coordinated workspaces", () => {
  const manifest = productionManifest(
    {
      name: "@acme/react",
      version: "0.2.0",
      private: true,
      type: "module",
      exports: { ".": "./dist/index.js" },
      peerDependencies: { "@acme/core": "workspace:*" },
      devDependencies: { analyzer: "1" },
      patchedDependencies: { "analyzer@1": "patches/analyzer.patch" },
      scripts: { postinstall: "fail" },
      workspaces: ["packages/*"],
      overrides: { "@acme/core": "file:." },
    },
    new Map([["@acme/core", "0.2.0"]]),
  );
  expect(manifest.peerDependencies).toEqual({ "@acme/core": "0.2.0" });
  expect(manifest.exports).toEqual({ ".": "./dist/index.js" });
  expect(manifest.private).toBe(true);
  for (const key of ["devDependencies", "patchedDependencies", "scripts", "workspaces", "overrides"]) expect(manifest).not.toHaveProperty(key);
  expect(() => productionManifest({ name: "fixture", version: "0.2.0", dependencies: { missing: "workspace:*" } }, new Map())).toThrow("Unresolved workspace dependency");
});

test("packing preserves the authoring manifest and ships only staged production files", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-pack-test-"));
  try {
    fs.mkdirSync(path.join(root, "dist"));
    fs.writeFileSync(path.join(root, "dist/index.js"), "export const value=42;");
    fs.writeFileSync(path.join(root, "secret.txt"), "excluded fixture data");
    const source = JSON.stringify({
      name: "pack-fixture",
      version: "0.0.0",
      type: "module",
      files: ["dist"],
      exports: { ".": "./dist/index.js" },
      patchedDependencies: { "tool@1": "patches/missing.patch" },
      devDependencies: { tool: "1" },
      scripts: { prepack: "exit 42" },
    });
    fs.writeFileSync(path.join(root, "package.json"), source);
    const result = await packPackage(root, path.join(root, "artifacts"));
    expect(fs.existsSync(result.file)).toBe(true);
    expect(fs.readFileSync(path.join(root, "package.json"), "utf8")).toBe(source);
    expect(result.log).toContain("dist/index.js");
    expect(result.log).not.toContain("secret.txt");
    expect(result.manifest).not.toHaveProperty("patchedDependencies");
    expect(result.manifest).not.toHaveProperty("scripts");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
