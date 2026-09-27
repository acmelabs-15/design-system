import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { packPackage, productionManifest } from "../package";
import { corePackageDirectory, ensureCorePackageLinks, readCorePackage } from "../core-package";

test("consumer workspaces resolve one live core with coordinated release metadata", () => {
  const root = path.resolve(import.meta.dir, "../..");
  const core = readCorePackage(root);
  const workspace = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  expect(workspace.private).toBe(true);
  expect(workspace.name).not.toBe(core.name);
  expect(workspace.overrides?.[core.name]).toBeUndefined();
  for (const name of ["react", "devtools", "mcp"]) {
    const directory = path.join(root, "packages", name);
    const pkg = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
    expect(pkg.private).not.toBe(true);
    expect(pkg.version).toBe(core.version);
    expect(pkg.repository).toEqual(core.repository);
    expect(pkg.peerDependencies[core.name]).toBe(core.version);
    const probe = Bun.spawnSync([process.execPath, "-e", "console.log(Bun.resolveSync(process.argv[1],process.argv[2]))", core.name, directory], { stdout: "pipe", stderr: "pipe" });
    expect(probe.exitCode).toBe(0);
    expect(fs.realpathSync(probe.stdout.toString().trim())).toBe(path.join(root, "dist/index.js"));
  }
});

test("core staging dereferences only its explicit delivery links", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-core-pack-"));
  try {
    const core = corePackageDirectory(root);
    fs.mkdirSync(core, { recursive: true });
    fs.mkdirSync(path.join(root, "dist"));
    fs.mkdirSync(path.join(root, "assets/licenses"), { recursive: true });
    fs.writeFileSync(path.join(root, "dist/index.js"), "export const identity = {};\n");
    fs.writeFileSync(path.join(root, "README.md"), "Consumer instructions");
    fs.writeFileSync(path.join(root, "assets/book-texture.avif"), "fixture texture");
    fs.writeFileSync(path.join(root, "assets/private.txt"), "not distributed");
    fs.writeFileSync(path.join(core, "package.json"), JSON.stringify({ name: "core-pack-fixture", version: "0.0.0", files: ["dist", "assets/book-texture.avif", "assets/licenses", "README.md"] }));
    ensureCorePackageLinks(root);
    const result = await packPackage(core, path.join(root, "artifacts"));
    expect(result.log).toContain("dist/index.js");
    expect(result.log).toContain("assets/book-texture.avif");
    expect(result.log).not.toContain("private.txt");
    const archive = Bun.spawnSync(["tar", "-tvf", result.file], { stdout: "pipe", stderr: "pipe" });
    expect(archive.exitCode).toBe(0);
    expect(
      archive.stdout
        .toString()
        .split("\n")
        .some((line) => line.startsWith("l")),
    ).toBe(false);
    fs.symlinkSync(path.join(root, "assets/private.txt"), path.join(root, "dist/escape.txt"));
    await expect(packPackage(core, path.join(root, "artifacts"))).rejects.toThrow("Unapproved package symlink");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
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
  for (const key of ["devDependencies", "patchedDependencies", "scripts", "workspaces", "overrides"]) {
    expect(manifest).not.toHaveProperty(key);
  }
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

test("packing skills publishes generated references once and excludes authoring evals", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-pack-skills-"));
  try {
    fs.mkdirSync(path.join(root, "dist/skills/references"), { recursive: true });
    fs.mkdirSync(path.join(root, "skills/evals"), { recursive: true });
    fs.writeFileSync(path.join(root, "skills/evals/private.json"), "{}");
    fs.writeFileSync(path.join(root, "dist/skills/references/release.json"), JSON.stringify({ version: "0.0.0" }));
    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "skills-pack-fixture", version: "0.0.0", files: ["dist", "skills"] }));
    const packed = await packPackage(root, path.join(root, "artifacts"));
    expect(packed.log).toContain("skills/references/release.json");
    expect(packed.log).not.toContain("dist/skills/");
    expect(packed.log).not.toContain("evals/private.json");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
