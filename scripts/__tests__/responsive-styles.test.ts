import { afterEach, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type StyleInputKey, styleInputSchema } from "../../src/shared/style-input-schema";
import { responsiveStyleDelivery, verifyResponsiveStyleDelivery, writeResponsiveStyleDelivery } from "../responsive-styles";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

test("the generated delivery owns every common CSS declaration and target", () => {
  const delivery = responsiveStyleDelivery();
  expect(delivery.version).toBe(1);
  expect(Object.keys(delivery.rules)).toEqual(Object.keys(styleInputSchema));
  for (const [key, metadata] of Object.entries(styleInputSchema)) {
    expect(delivery.rules[key as StyleInputKey]).toEqual({
      property: metadata.cssProperty,
      target: metadata.target,
      selector: ":host",
      template: `:host{${metadata.cssProperty}:initial;}`,
    });
  }
  expect(Object.isFrozen(delivery)).toBe(true);
  expect(Object.isFrozen(delivery.rules)).toBe(true);
  expect(Object.values(delivery.rules).every(Object.isFrozen)).toBe(true);
});

test("the producer writes stable source and verification rejects stale delivery", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-responsive-style-delivery-"));
  roots.push(root);
  fs.mkdirSync(path.join(root, "src/shared"), { recursive: true });
  fs.writeFileSync(path.join(root, "src/shared/style-renderer.ts"), "export type ResponsiveStyleDelivery = unknown;\n");
  const file = writeResponsiveStyleDelivery(root);
  const source = fs.readFileSync(file, "utf8");
  expect(source).toContain("Generated from the common style input schema");
  expect(source).toContain('property: "padding-inline"');
  expect(source).toContain("rootDisplay:");
  expect(writeResponsiveStyleDelivery(root)).toBe(file);
  expect(fs.readFileSync(file, "utf8")).toBe(source);
  expect(verifyResponsiveStyleDelivery(root)).toBe(file);
  fs.writeFileSync(file, source.replace('property: "padding"', 'property: "wrong"'));
  expect(() => verifyResponsiveStyleDelivery(root)).toThrow(/responsive style delivery/i);
});
