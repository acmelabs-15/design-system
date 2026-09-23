type Decimal = Readonly<{ coefficient: bigint; scale: number }>;
function decimal(value: number): Decimal {
  if (!Number.isFinite(value)) throw new RangeError("Decimal operands must be finite");
  const [mantissa, exponent = "0"] = value.toString().toLowerCase().split("e");
  const negative = mantissa!.startsWith("-"),
    unsigned = negative ? mantissa!.slice(1) : mantissa!;
  const [whole, fraction = ""] = unsigned.split(".");
  return { coefficient: BigInt(whole + fraction) * (negative ? -1n : 1n), scale: fraction.length - Number(exponent) };
}
function number(coefficient: bigint, scale: number): number {
  const negative = coefficient < 0n;
  let digits = (negative ? -coefficient : coefficient).toString();
  if (scale > 0) {
    digits = digits.padStart(scale + 1, "0");
    digits = digits.slice(0, -scale) + "." + digits.slice(-scale);
  }
  if (scale < 0) digits += "0".repeat(-scale);
  return Number((negative ? "-" : "") + digits);
}
/** Adds decimal representations without a precision-count loop or binary addition drift. */
export function addDecimal(value: number, step: number): number {
  const a = decimal(value),
    b = decimal(step),
    scale = Math.max(0, a.scale, b.scale);
  return number(a.coefficient * 10n ** BigInt(scale - a.scale) + b.coefficient * 10n ** BigInt(scale - b.scale), scale);
}

/** Scales a decimal by a power of ten without a binary intermediate. */
export function scaleDecimal(value: number, power: number): number {
  if (!Number.isInteger(power) || Math.abs(power) > 324) throw new RangeError("Decimal scale must be an integer within the finite number range");
  const parts = decimal(value);
  return number(parts.coefficient, parts.scale - power);
}

/** Multiplies decimal representations without a binary intermediate. */
export function multiplyDecimal(value: number, factor: number): number {
  const a = decimal(value),
    b = decimal(factor);
  return number(a.coefficient * b.coefficient, a.scale + b.scale);
}
/** Rounds to the decimal step grid anchored at minimum; ties round upward. */
export function snapDecimal(value: number, step: number, minimum = 0, mode: "nearest" | "floor" | "ceil" = "nearest"): number {
  if (!(step > 0)) throw new RangeError("Decimal step must be positive");
  const a = decimal(value),
    b = decimal(step),
    c = decimal(minimum);
  const scale = Math.max(0, a.scale, b.scale, c.scale);
  const unit = b.coefficient * 10n ** BigInt(scale - b.scale),
    origin = c.coefficient * 10n ** BigInt(scale - c.scale);
  const offset = a.coefficient * 10n ** BigInt(scale - a.scale) - origin;
  let quotient = offset / unit,
    remainder = offset % unit;
  if (remainder < 0n) {
    quotient--;
    remainder += unit;
  }
  if ((mode === "nearest" && remainder * 2n >= unit) || (mode === "ceil" && remainder > 0n)) quotient++;
  return number(origin + quotient * unit, scale);
}
