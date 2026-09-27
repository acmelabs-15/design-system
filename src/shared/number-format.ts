import { binaryPrefixLocales, binaryPrefixParents, binaryPrefixPatterns } from "../generated/byte-prefixes";

export type ByteUnit = "byte" | "bit";
export type ByteUnitDisplay = "long" | "short" | "narrow";
export type ByteUnitSystem = "decimal" | "binary";
export type ByteFormatOptions = Readonly<{ unit?: ByteUnit; unitDisplay?: ByteUnitDisplay; unitSystem?: ByteUnitSystem }>;
const decimalPrefixes = ["", "kilo", "mega", "giga", "tera", "peta"] as const;
const binarySymbols = ["", "Ki", "Mi", "Gi", "Ti", "Pi"] as const;

function binaryPrefix(locale: string, index: number): string {
  let key = new Intl.Locale(locale).baseName.toLowerCase();
  const visited = new Set<string>();
  while (key && !visited.has(key)) {
    visited.add(key);
    const found = binaryPrefixLocales[key];
    if (found !== undefined) {
      return binaryPrefixPatterns[found][index - 1];
    }
    key = binaryPrefixParents[key] ?? key.slice(0, Math.max(0, key.lastIndexOf("-")));
  }
  return binaryPrefixPatterns[binaryPrefixLocales.en][index - 1];
}

/** Finite values only; callers own absent/invalid input presentation and diagnostics. */
export function formatByte(value: number, locale: string | undefined, options: ByteFormatOptions = {}): string {
  if (!Number.isFinite(value)) {
    throw new RangeError("Byte value must be finite");
  }
  const { unit = "byte", unitDisplay = "short", unitSystem = "decimal" } = options;
  if (!["byte", "bit"].includes(unit) || !["long", "short", "narrow"].includes(unitDisplay) || !["decimal", "binary"].includes(unitSystem)) {
    throw new RangeError("Invalid byte formatting options");
  }
  const factor = unitSystem === "binary" ? 1024 : 1000,
    limit = unit === "bit" ? 4 : 5;
  let scaled = Math.abs(value),
    index = 0;
  while (scaled >= factor && index < limit) {
    scaled /= factor;
    index++;
  }
  if (value < 0 || Object.is(value, -0)) {
    scaled = -scaled;
  }
  const formatter = new Intl.NumberFormat(locale, { style: "unit", unit: unitSystem === "decimal" ? decimalPrefixes[index] + unit : unit, unitDisplay, maximumSignificantDigits: 3 });
  if (unitSystem === "decimal" || index === 0) {
    return formatter.format(scaled);
  }
  const resolved = formatter.resolvedOptions().locale;
  const pattern = unitDisplay === "long" ? binaryPrefix(resolved, index) : undefined;
  return formatter
    .formatToParts(scaled)
    .map((part) => {
      if (part.type !== "unit") {
        return part.value;
      }
      if (!pattern) {
        return binarySymbols[index] + (unit === "byte" ? "B" : "bit");
      }
      const base = /\s/u.test(pattern) ? part.value : part.value.toLocaleLowerCase(resolved);
      return pattern.replace("{0}", base);
    })
    .join("");
}
