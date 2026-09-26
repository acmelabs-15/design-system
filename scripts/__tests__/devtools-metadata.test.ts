import { expect, test } from "bun:test";
import { diagnosticMetadata } from "../devtools-metadata";
import type { Package } from "custom-elements-manifest/schema";
test("inspector metadata keeps public facts and deduplicates equivalent contracts", () => {
  const declaration = {
    kind: "class",
    name: "Input",
    members: [
      { kind: "field", name: "value" },
      { kind: "field", name: "secret", privacy: "private" },
      { kind: "field", name: "internal", privacy: "protected" },
      { kind: "field", name: "configuration", static: true },
      { kind: "method", name: "focus" },
    ],
    attributes: [{ name: "name" }],
    events: [{ name: "acme-change" }],
    "x-acme-states": [{ name: "invalid" }],
    cssProperties: [{ name: "--height" }],
  };
  const manifest = {
    schemaVersion: "1.0.0",
    "x-acme-version": "0.2.0",
    modules: [
      {
        kind: "javascript-module",
        path: "input.js",
        declarations: [
          { ...declaration, tagName: "acme-input" },
          { ...declaration, tagName: "acme-other" },
        ],
      },
    ],
  } as unknown as Package;
  const result = diagnosticMetadata(manifest, ["--accent", "--accent"]);
  expect(result.version).toBe("0.2.0");
  expect(result.contracts).toEqual([
    {
      properties: ["value"],
      attributes: ["name"],
      events: ["acme-change"],
      states: ["invalid"],
      cssProperties: ["--height"],
    },
  ]);
  expect(result.tags).toEqual({ "acme-input": 0, "acme-other": 0 });
  expect(result.tokens).toEqual(["--accent"]);
  expect(() => diagnosticMetadata({ schemaVersion: "1.0.0", modules: [] }, [])).toThrow("release-versioned");
});
