import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { componentFixtureSource, validateComponentSuites } from "../component-browser-checks";

test("component browser fixture imports use one compiled runtime and repeatable definitions", () => {
  const source = 'import { AcmeButton } from "../button"; customElements.define("acme-button", AcmeButton);';
  const output = componentFixtureSource(source, "/repo/src/components/button/__tests__/button.browser.ts", "/repo", "/consumer/core");
  expect(output).toContain('from "/consumer/core/dist/components/button/button.js"');
  expect(output).toContain('registerFixtureElement(customElements, "acme-button", AcmeButton)');
  expect(output).toContain("/consumer/core/dist/all.js");
  expect(output).not.toContain("customElements.define(");
});

test("every colocated browser fixture has one registered suite or the dedicated Tabs gate", () => {
  const root = path.resolve(import.meta.dir, "../..");
  expect(() => validateComponentSuites(root)).not.toThrow();
});

test("component suite validation uses migrated case inputs without the old evidence tree", () => {
  const repository = path.resolve(import.meta.dir, "../..");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-component-suite-paths-"));
  try {
    const fixtures = [...new Bun.Glob("src/components/*/__tests__/*.browser.ts").scanSync(repository)];
    for (const file of ["scripts/verification/component-browser/cases.json", "scripts/verification/component-browser/controls.json", ...fixtures]) {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.copyFileSync(path.join(repository, file), path.join(root, file));
    }
    expect(() => validateComponentSuites(root)).not.toThrow();
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
