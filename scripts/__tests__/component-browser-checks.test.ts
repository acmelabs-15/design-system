import { expect, test } from "bun:test";
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
