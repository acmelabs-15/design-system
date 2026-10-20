import { afterEach, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { browserPackageDirectory, browserPackageLinks, buildBrowserPackageNotices, ensureBrowserPackageLinks, readBrowserPackage } from "../browser-package";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function fixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-browser-package-"));
  roots.push(root);
  for (const directory of ["packages/browser", "dist/cdn", "dist/styles", "dist/bundle", "dist/licenses", "dist/browser-licenses", "assets/licenses", ".artifacts"]) {
    fs.mkdirSync(path.join(root, directory), { recursive: true });
  }
  fs.writeFileSync(path.join(root, "packages/browser/package.json"), JSON.stringify({ name: "@acmelabs/design-system-browser", version: "0.3.1" }));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "private-build", version: "0.0.0", private: true }));
  return root;
}

function dependency(root: string, directory: string, name: string, version = "1.2.3"): string {
  const absolute = path.join(root, directory);
  fs.mkdirSync(absolute, { recursive: true });
  fs.writeFileSync(path.join(absolute, "package.json"), JSON.stringify({ name, version, license: "MIT" }));
  fs.writeFileSync(path.join(absolute, "index.js"), "export const value = 1;\n");
  fs.writeFileSync(path.join(absolute, "License.md"), `Copyright ${name} ${version}\nExact license text.\n`);
  return directory + "/index.js";
}

function metafile(root: string, inputs: string[]): void {
  fs.writeFileSync(path.join(root, ".artifacts/cdn-metafile.json"), JSON.stringify({ inputs: Object.fromEntries(inputs.map((input) => [input, { bytes: 1, imports: [] }])), outputs: {} }));
}

function markdownFixture(root: string): { directory: string; manifest: string } {
  const relative = "node_modules/@tanstack/markdown";
  const input = dependency(root, relative, "@tanstack/markdown", "0.0.13");
  const directory = path.join(root, relative);
  fs.unlinkSync(path.join(directory, "License.md"));
  const manifest = fs.readFileSync(path.resolve(import.meta.dir, "../../node_modules/@tanstack/markdown/package.json"), "utf8");
  fs.writeFileSync(path.join(directory, "package.json"), manifest);
  metafile(root, [input]);
  return { directory, manifest };
}

test("browser metadata comes from its public package", () => {
  const root = fixture();
  expect(readBrowserPackage(root)).toEqual({ name: "@acmelabs/design-system-browser", version: "0.3.1" });
  fs.writeFileSync(path.join(browserPackageDirectory(root), "package.json"), "{}");
  expect(() => readBrowserPackage(root)).toThrow();
});

test("browser delivery links expose only the fixed shared outputs and notices", () => {
  const root = fixture();
  expect(browserPackageLinks).toEqual({
    dist: "dist/cdn",
    styles: "dist/styles",
    bundle: "dist/bundle",
    "licenses/assets": "assets/licenses",
    "licenses/runtime": "dist/licenses",
    "licenses/packages": "dist/browser-licenses",
  });
  fs.writeFileSync(path.join(root, "dist/cdn/standalone.js"), "export const browser = true;");
  fs.writeFileSync(path.join(root, "assets/licenses/art.txt"), "Artwork notice");
  fs.writeFileSync(path.join(root, "dist/licenses/runtime.txt"), "Runtime notice");
  ensureBrowserPackageLinks(root);
  ensureBrowserPackageLinks(root);
  for (const [name, target] of Object.entries(browserPackageLinks)) {
    const link = path.join(browserPackageDirectory(root), name);
    expect(fs.readlinkSync(link)).toBe(path.relative(path.dirname(link), path.join(root, target)));
    expect(fs.realpathSync(link)).toBe(fs.realpathSync(path.join(root, target)));
  }
  expect(fs.readFileSync(path.join(browserPackageDirectory(root), "dist/standalone.js"), "utf8")).toContain("browser = true");
  expect(fs.readFileSync(path.join(browserPackageDirectory(root), "licenses/assets/art.txt"), "utf8")).toBe("Artwork notice");
  expect(fs.readFileSync(path.join(browserPackageDirectory(root), "licenses/runtime/runtime.txt"), "utf8")).toBe("Runtime notice");
});

test.each(["directory", "wrong-link"])("browser delivery rejects an existing %s at a link path", (kind) => {
  const root = fixture();
  const destination = path.join(browserPackageDirectory(root), "dist");
  if (kind === "directory") {
    fs.mkdirSync(destination);
  } else {
    fs.symlinkSync("../../dist/bundle", destination);
  }
  expect(() => ensureBrowserPackageLinks(root)).toThrow();
});

test.each(["dist/cdn", "dist", "packages/browser", "packages/browser/licenses"])("browser delivery rejects a substituted directory at %s", (relative) => {
  const root = fixture();
  const destination = path.join(root, relative);
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(path.join(root, "substitute"));
  fs.symlinkSync(path.join(root, "substitute"), destination);
  expect(() => ensureBrowserPackageLinks(root)).toThrow();
  expect(fs.readdirSync(path.join(root, "substitute"))).toEqual([]);
});

test("browser delivery rejects missing source outputs", () => {
  const root = fixture();
  fs.rmSync(path.join(root, "dist/cdn"), { recursive: true });
  expect(() => ensureBrowserPackageLinks(root)).toThrow();
});

test("browser notices follow exact bundled package locations and preserve upstream text", async () => {
  const root = fixture();
  const first = dependency(root, "node_modules/@scope/widget", "@scope/widget");
  const nested = dependency(root, "node_modules/parent/node_modules/plain", "plain", "2.0.0");
  dependency(root, "node_modules/unused", "unused");
  metafile(root, [first, nested, "dist/all.js"]);
  fs.writeFileSync(path.join(root, "dist/browser-licenses/stale.txt"), "Old generated notice");

  const result = await buildBrowserPackageNotices(root);
  expect(result.packages.map(({ name, version }) => ({ name, version }))).toEqual([
    { name: "@scope/widget", version: "1.2.3" },
    { name: "plain", version: "2.0.0" },
  ]);
  for (const record of result.packages) {
    expect(fs.readFileSync(path.join(root, "dist/browser-licenses", record.file), "utf8")).toBe(`Copyright ${record.name} ${record.version}\nExact license text.\n`);
    expect(record.licenseFile).toBe("License.md");
    expect(record.kind).toBe("license-text");
    expect(record.noticeTextAvailable).toBe(true);
  }
  expect(fs.existsSync(path.join(root, "dist/browser-licenses/stale.txt"))).toBe(false);
  expect(JSON.parse(fs.readFileSync(path.join(root, "dist/browser-licenses/provenance.json"), "utf8"))).toEqual(result);
});

test.each(["missing", "ambiguous", "symlink"])("browser notices reject a %s package license before replacing output", async (kind) => {
  const root = fixture();
  const input = dependency(root, "node_modules/widget", "widget");
  const license = path.join(root, "node_modules/widget/License.md");
  if (kind === "ambiguous") {
    fs.writeFileSync(path.join(root, "node_modules/widget/LICENSE"), "Conflicting notice");
  } else {
    fs.unlinkSync(license);
    if (kind === "symlink") {
      fs.writeFileSync(path.join(root, "outside-license.txt"), "Substituted notice");
      fs.symlinkSync(path.join(root, "outside-license.txt"), license);
    }
  }
  metafile(root, [input]);
  fs.writeFileSync(path.join(root, "dist/browser-licenses/previous.txt"), "Previous valid notice");
  await expect(buildBrowserPackageNotices(root)).rejects.toThrow();
  expect(fs.readFileSync(path.join(root, "dist/browser-licenses/previous.txt"), "utf8")).toBe("Previous valid notice");
});

test("browser notices reject package identity substitution", async () => {
  const root = fixture();
  const input = dependency(root, "node_modules/widget", "other-package");
  metafile(root, [input]);
  await expect(buildBrowserPackageNotices(root)).rejects.toThrow();
});

test("browser notices reject a substituted output directory", async () => {
  const root = fixture();
  metafile(root, [dependency(root, "node_modules/widget", "widget")]);
  fs.rmSync(path.join(root, "dist/browser-licenses"), { recursive: true });
  fs.mkdirSync(path.join(root, "substitute"));
  fs.writeFileSync(path.join(root, "substitute/sentinel.txt"), "Keep");
  fs.symlinkSync(path.join(root, "substitute"), path.join(root, "dist/browser-licenses"));
  await expect(buildBrowserPackageNotices(root)).rejects.toThrow();
  expect(fs.readFileSync(path.join(root, "substitute/sentinel.txt"), "utf8")).toBe("Keep");
});

test("the pinned Markdown omission preserves exact package metadata without inventing notice text", async () => {
  const root = fixture();
  const { manifest } = markdownFixture(root);
  const result = await buildBrowserPackageNotices(root);
  expect(result.packages).toHaveLength(1);
  const record = result.packages[0];
  expect(record).toMatchObject({
    name: "@tanstack/markdown",
    version: "0.0.13",
    license: "MIT",
    kind: "package-license-metadata",
    noticeTextAvailable: false,
    licenseFile: "package.json",
    sha256: "2885c8a041b10b4746cdc54d366937315311c0472ee8e3cd1c704fd9f2df500e",
    sourceHistoryUrl: "https://github.com/TanStack/markdown/commits/b54cce0943009ff76063b7656f99c2139823835f/package.json",
    sourceCommitBinding: "unverified",
  });
  expect(record.file.endsWith(".json")).toBe(true);
  expect(fs.readFileSync(path.join(root, "dist/browser-licenses", record.file), "utf8")).toBe(manifest);
  expect(fs.readdirSync(path.join(root, "dist/browser-licenses")).filter((file) => file.endsWith(".txt"))).toEqual([]);
});

test.each(["version", "license", "name", "bytes"])("the pinned Markdown metadata record rejects changed %s", async (field) => {
  const root = fixture();
  const { directory, manifest } = markdownFixture(root);
  const changed = JSON.parse(manifest);
  if (field !== "bytes") {
    changed[field] = "changed";
  }
  fs.writeFileSync(path.join(directory, "package.json"), field === "bytes" ? manifest + "\n" : JSON.stringify(changed));
  await expect(buildBrowserPackageNotices(root)).rejects.toThrow();
});

test.each(["ambiguous", "symlink", "directory"])("the pinned Markdown metadata record rejects a %s license path", async (kind) => {
  const root = fixture();
  const { directory } = markdownFixture(root);
  if (kind === "ambiguous") {
    fs.writeFileSync(path.join(directory, "LICENSE"), "First notice");
    fs.writeFileSync(path.join(directory, "License.md"), "Second notice");
  } else if (kind === "directory") {
    fs.mkdirSync(path.join(directory, "LICENSE"));
  } else {
    fs.writeFileSync(path.join(root, "other-notice.txt"), "Substituted notice");
    fs.symlinkSync(path.join(root, "other-notice.txt"), path.join(directory, "LICENSE"));
  }
  await expect(buildBrowserPackageNotices(root)).rejects.toThrow();
});
