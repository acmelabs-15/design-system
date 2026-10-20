import { expect, test } from "bun:test";
import { browserModuleFiles, browserModuleSource } from "../browser-modules";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

test("browser copy discovers public and private registrations alongside artwork", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-browser-modules-"));
  const files = ["register/button.js", "internal/register/indicator.js", "generated/icons/artwork/filled/home.js", "generated/icons/families/filled.js"];
  try {
    for (const file of files) {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), "export {};");
    }
    expect(browserModuleFiles(root)).toEqual(files.sort());
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("generated artwork and family imports use browser URLs without changing geometry", () => {
  const input = 'import { artwork } from "../../../records/home";\nartwork.add("outlined", true, { paths: [{d:"M160-120v-480"}] });\nexport { artwork };\nimport "../../artwork/outlined/filled/home";';
  expect(browserModuleSource(input)).toBe(input.replace('records/home"', 'records/home.js"').replace('filled/home"', 'filled/home.js"'));
  expect(browserModuleSource(browserModuleSource(input))).toBe(browserModuleSource(input));
});
