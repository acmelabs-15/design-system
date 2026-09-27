import { expect, test } from "bun:test";
import { sliderNormalize, sliderMove, sliderConfigurationValid } from "../slider-values";

const config = { min: 0, max: 100, step: 1, minStepsBetweenValues: 5 };
test("ordered thumbs stay on the step grid and keep gaps without pushing neighbors", () => {
  expect(sliderMove([20, 50, 80], 1, 99, config)).toEqual([20, 75, 80]);
  expect(sliderMove([20, 50, 80], 1, -20, config)).toEqual([20, 25, 80]);
  expect(sliderNormalize([-5, 1, 120], config)).toEqual([0, 5, 100]);
});
test("fractional origins, tiny steps and nonaligned maxima remain decimal values", () => {
  const c = { min: 0.05, max: 0.4, step: 0.1, minStepsBetweenValues: 0 };
  expect(sliderNormalize([0.2, 0.4], c)).toEqual([0.25, 0.35]);
  expect(sliderMove([0.15], 0, 0.25, c)).toEqual([0.25]);
  const tiny = { min: 0, max: 1e-6, step: 1e-7, minStepsBetweenValues: 0 };
  expect(sliderMove([2e-7], 0, 3e-7, tiny)).toEqual([3e-7]);
});
test("impossible configurations cannot start interaction", () => {
  expect(sliderConfigurationValid({ ...config, min: 100 }, 1)).toBe(false);
  expect(sliderConfigurationValid({ ...config, minStepsBetweenValues: 60 }, 3)).toBe(false);
  expect(sliderConfigurationValid(config, 3)).toBe(true);
});

test("overflowing gap constraints remain invalid instead of throwing during synchronization", () => {
  expect(sliderConfigurationValid({ min: 0, max: 100, step: Number.MAX_VALUE, minStepsBetweenValues: 2 }, 2)).toBe(false);
  expect(() => sliderNormalize(new Array(2), config)).toThrow();
});
