import { isPlainRecord } from "./plain-record";

export function numberOptionsSnapshot(value: Intl.NumberFormatOptions | undefined): Readonly<Intl.NumberFormatOptions> {
  if (value === undefined) {
    return Object.freeze({});
  }
  if (!isPlainRecord(value)) {
    throw new TypeError("Number options must be a plain data record");
  }
  const entries: [string, unknown][] = [];
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (typeof key !== "string" || !descriptor.enumerable || !("value" in descriptor) || (descriptor.value !== undefined && !["string", "number", "boolean"].includes(typeof descriptor.value))) {
      throw new TypeError("Number options require scalar data properties");
    }
    entries.push([key, descriptor.value]);
  }
  return Object.freeze(Object.fromEntries(entries)) as Readonly<Intl.NumberFormatOptions>;
}
