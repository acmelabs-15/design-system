import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { browserDistribution } from "../browser-distribution";

test("public browser routes resolve to local output or the installed browser package", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-browser-delivery-"));
  const installed = path.join(root, "consumer/node_modules/@acmelabs/design-system-browser");
  try {
    for (const directory of [path.join(root, "packages/browser"), installed]) {
      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(path.join(directory, "package.json"), JSON.stringify({ name: "@acmelabs/design-system-browser", version: "7.8.9" }));
    }
    const local = browserDistribution(root, undefined);
    const packed = browserDistribution(root, installed);
    expect(local.version).toBe("7.8.9");
    expect(local.file("/dist/define/input.js")).toBe(path.join(root, "dist/cdn/define/input.js"));
    expect(local.file("/bundle/design-system.min.js")).toBe(path.join(root, "dist/bundle/design-system.min.js"));
    expect(local.file("/styles/tokens.css")).toBe(path.join(root, "dist/styles/tokens.css"));
    expect(packed.file("/dist/generated/icons/artwork/sharp/filled/home.js")).toBe(path.join(installed, "dist/generated/icons/artwork/sharp/filled/home.js"));
    expect(packed.file("/bundle/design-system.min.js")).toBe(path.join(installed, "bundle/design-system.min.js"));
    expect(packed.file("/styles/tokens.css")).toBe(path.join(installed, "styles/tokens.css"));
    const consumer = browserDistribution(root, undefined, path.join(root, "consumer"));
    expect(consumer.file("/dist/define/input.js")).toBe(path.join(installed, "dist/define/input.js"));
    expect(packed.file("/unrelated.js")).toBeUndefined();
    expect(packed.file("/dist/../../package.json")).toBeUndefined();
    expect(packed.file("/dist/%2e%2e/package.json")).toBeUndefined();
    expect(packed.file("/dist/%invalid")).toBeUndefined();
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("an explicit browser package cannot silently use the installed core", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-browser-identity-"));
  try {
    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "@acmelabs/design-system", version: "7.8.9" }));
    expect(() => browserDistribution("/unused", root)).toThrow("browser package");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
