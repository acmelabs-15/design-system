import { motionRoles, type MotionScheme, type MotionChannel, type MotionSpeed } from "./motion-tokens";
import type { SpringConfig } from "@lit-labs/motion/spring.js";
/** Maps a dimensionless damping ratio to the unit-mass spring used by Lit Motion. */
export function springConfig(stiffness: number, dampingRatio: number): SpringConfig {
  if (!Number.isFinite(stiffness) || stiffness <= 0 || !Number.isFinite(dampingRatio) || dampingRatio <= 0) throw new RangeError("Spring parameters must be positive finite numbers");
  return { stiffness, damping: 2 * dampingRatio * Math.sqrt(stiffness), mass: 1, allowsOverdamping: true, restVelocityThreshold: 0.001, restDisplacementThreshold: 0.001 };
}
const diagnostics = new WeakMap<Element, Set<string>>();
/** Reads validated numeric theme parameters in the animated element's document. */
export function readMotionSpring(element: Element, scheme: MotionScheme, channel: MotionChannel, speed: MotionSpeed): SpringConfig {
  const fallback = motionRoles[scheme][channel][speed],
    style = element.ownerDocument.defaultView!.getComputedStyle(element);
  const read = (parameter: "stiffness" | "damping-ratio", defaultValue: number) => {
    const property = `--acme-motion-${scheme}-${channel}-${speed}-${parameter}`,
      raw = style.getPropertyValue(property).trim();
    if (!raw) return defaultValue;
    const value = Number(raw);
    if (Number.isFinite(value) && value > 0) return value;
    let seen = diagnostics.get(element);
    if (!seen) {
      seen = new Set();
      diagnostics.set(element, seen);
    }
    if (!seen.has(property)) {
      seen.add(property);
      console.warn(element.localName, { code: "invalid-motion-parameter", property });
    }
    return defaultValue;
  };
  return springConfig(read("stiffness", fallback.stiffness), read("damping-ratio", fallback.dampingRatio));
}
