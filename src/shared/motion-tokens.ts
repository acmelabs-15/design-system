export type MotionScheme = "standard" | "expressive";
export type MotionChannel = "spatial" | "effects";
export type MotionSpeed = "fast" | "default" | "slow";
export type SpringRole = Readonly<{ stiffness: number; dampingRatio: number }>;
const role = (stiffness: number, dampingRatio: number): SpringRole => Object.freeze({ stiffness, dampingRatio });
export const motionRoles = Object.freeze({
  standard: Object.freeze({
    spatial: Object.freeze({ fast: role(1400, 0.9), default: role(700, 0.9), slow: role(300, 0.9) }),
    effects: Object.freeze({ fast: role(3800, 1), default: role(1600, 1), slow: role(800, 1) }),
  }),
  expressive: Object.freeze({
    spatial: Object.freeze({ fast: role(800, 0.6), default: role(380, 0.8), slow: role(200, 0.8) }),
    effects: Object.freeze({ fast: role(3800, 1), default: role(1600, 1), slow: role(800, 1) }),
  }),
});
export type MotionTokenKey = `acme-motion-${MotionScheme}-${MotionChannel}-${MotionSpeed}-${"stiffness" | "damping-ratio"}`;
export const motionTokenDefinitions = Object.freeze(
  (["standard", "expressive"] as const).flatMap((scheme) =>
    (["spatial", "effects"] as const).flatMap((channel) =>
      (["fast", "default", "slow"] as const).flatMap((speed) =>
        (["stiffness", "damping-ratio"] as const).map((parameter) => {
          const key: MotionTokenKey = `acme-motion-${scheme}-${channel}-${speed}-${parameter}`;
          return Object.freeze({
            category: "motion" as const,
            key,
            cssProperty: `--${key}` as const,
            syntax: "positive-number" as const,
            role: `${scheme} ${channel} ${speed} spring ${parameter}`,
            defaultValue: String(parameter === "stiffness" ? motionRoles[scheme][channel][speed].stiffness : motionRoles[scheme][channel][speed].dampingRatio),
          });
        }),
      ),
    ),
  ),
);
