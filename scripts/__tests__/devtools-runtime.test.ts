import { expect, test } from "bun:test";
import { correctDevtoolsTree, packageLicense } from "../devtools-runtime";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

test("package licenses preserve their actual filename case and reject missing or ambiguous notices", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-package-license-"));
  try {
    await expect(packageLicense(root)).rejects.toThrow("Expected one");
    fs.writeFileSync(path.join(root, "license"), "Exact upstream notice\n");
    expect(await packageLicense(root)).toEqual({ file: "license", text: "Exact upstream notice\n" });
    fs.rmSync(path.join(root, "license"));
    fs.writeFileSync(path.join(root, "License.md"), "Markdown notice");
    expect(await packageLicense(root)).toEqual({ file: "License.md", text: "Markdown notice" });
    fs.writeFileSync(path.join(root, "LICENSE.txt"), "Another notice");
    await expect(packageLicense(root)).rejects.toThrow("Expected one");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("the JsonTree correction is restricted to the inspected version and exact source", async () => {
  const source = await Bun.file(path.resolve(import.meta.dir, "../../node_modules/@tanstack/devtools-ui/dist/esm/components/tree.js")).text();
  expect(correctDevtoolsTree(source, "0.7.1")).toContain('props.keyName && (props.value === null || typeof props.value !== "object")');
  expect(() => correctDevtoolsTree(source, "0.7.2")).toThrow("Revalidate");
  expect(() => correctDevtoolsTree(source + "\n", "0.7.1")).toThrow("Revalidate");
});
