import { addDecimal, multiplyDecimal, snapDecimal } from "../../shared/decimal-step";
export type SliderConfiguration = Readonly<{ min: number; max: number; step: number; minStepsBetweenValues: number }>;
export function sliderSnapshot(value: readonly number[]): readonly number[] {
  if (!Array.isArray(value) || !value.length || Array.from(value).some((item, index) => !Number.isFinite(item) || (index > 0 && item < value[index - 1]!)))
    throw new TypeError("Slider value must be a nonempty ordered array of finite numbers");
  return Object.freeze([...value]);
}
export function sliderConfigurationValid(config: SliderConfiguration, count: number): boolean {
  const { min, max, step, minStepsBetweenValues } = config;
  if (
    ![min, max, step, minStepsBetweenValues].every(Number.isFinite) ||
    max <= min ||
    !Number.isFinite(max - min) ||
    step <= 0 ||
    !Number.isInteger(minStepsBetweenValues) ||
    minStepsBetweenValues < 0
  )
    return false;
  const gap = multiplyDecimal(step, minStepsBetweenValues),
    last = snapDecimal(max, step, min, "floor");
  if (!Number.isFinite(gap)) return false;
  const extent = multiplyDecimal(gap, count - 1);
  return Number.isFinite(gap) && Number.isFinite(extent) && addDecimal(min, extent) <= last;
}
export function sliderNormalize(value: readonly number[], config: SliderConfiguration): readonly number[] {
  const copied = sliderSnapshot(value);
  if (!sliderConfigurationValid(config, copied.length)) return copied;
  const { min, max, step, minStepsBetweenValues } = config,
    gap = multiplyDecimal(step, minStepsBetweenValues),
    last = snapDecimal(max, step, min, "floor");
  const out: number[] = [];
  for (const [index, current] of copied.entries()) {
    const low = index ? addDecimal(out[index - 1]!, gap) : min,
      high = addDecimal(last, -multiplyDecimal(gap, copied.length - index - 1));
    out.push(Math.max(low, Math.min(high, snapDecimal(Math.max(min, Math.min(max, current)), step, min))));
  }
  return Object.freeze(out);
}
export function sliderBounds(values: readonly number[], index: number, config: SliderConfiguration): readonly [number, number] {
  const gap = multiplyDecimal(config.step, config.minStepsBetweenValues);
  return [index ? addDecimal(values[index - 1]!, gap) : config.min, index < values.length - 1 ? addDecimal(values[index + 1]!, -gap) : snapDecimal(config.max, config.step, config.min, "floor")];
}
export function sliderMove(values: readonly number[], index: number, candidate: number, config: SliderConfiguration): readonly number[] {
  if (!Number.isInteger(index) || index < 0 || index >= values.length || !Number.isFinite(candidate) || !sliderConfigurationValid(config, values.length)) return values;
  const [low, high] = sliderBounds(values, index, config),
    next = Math.max(low, Math.min(high, snapDecimal(candidate, config.step, config.min)));
  if (next === values[index]) return values;
  const out = [...values];
  out[index] = next;
  return Object.freeze(out);
}
export const sameSliderValues = (a: readonly number[], b: readonly number[]): boolean => a.length === b.length && a.every((value, index) => value === b[index]);
