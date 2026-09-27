import { expect, test } from "bun:test";
import { springConfig } from "../motion-spring";
import { motionRoles, motionTokenDefinitions } from "../motion-tokens";

test("all documented spring roles preserve their physical damping ratio", () => {
  for (const channels of Object.values(motionRoles)) {
    for (const speeds of Object.values(channels)) {
      for (const role of Object.values(speeds)) {
        const config = springConfig(role.stiffness, role.dampingRatio);
        expect(config.mass).toBe(1);
        expect(config.damping! / (2 * Math.sqrt(config.stiffness!))).toBeCloseTo(role.dampingRatio, 12);
        expect(config.allowsOverdamping).toBe(true);
      }
    }
  }
  expect(motionTokenDefinitions).toHaveLength(24);
  expect(new Set(motionTokenDefinitions.map((d) => d.key)).size).toBe(24);
});
test("invalid spring parameters fail before creating an animation", () => {
  for (const bad of [0, -1, NaN, Infinity]) {
    expect(() => springConfig(bad, 1)).toThrow();
    expect(() => springConfig(700, bad)).toThrow();
  }
});
