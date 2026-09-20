const objectConstructor = Function.prototype.toString.call(Object);

/** Recognizes plain data records, including ones supplied by another document. */
export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null) return true;
  if (Object.getPrototypeOf(prototype) !== null) return false;
  const constructor = Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
  return typeof constructor === "function" && Function.prototype.toString.call(constructor) === objectConstructor;
}
