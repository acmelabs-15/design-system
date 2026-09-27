import { createAtom } from "@tanstack/lit-store";
import { isPlainRecord } from "./plain-record";

export type Messages = Readonly<Record<string, string>>;
const catalogs = createAtom<ReadonlyMap<string, Messages>>(new Map<string, Messages>());
export const messageCatalogs = createAtom(() => catalogs.get());

/** Replaces one locale's application-supplied built-in labels. */
export function configureMessages(locale: string, messages: Messages): void {
  const name = Intl.getCanonicalLocales(locale)[0];
  if (!name) {
    throw new TypeError("A message locale is required");
  }
  if (!isPlainRecord(messages)) {
    throw new TypeError("Messages must be a plain string record");
  }
  const entries: [string, string][] = [];
  for (const key of Reflect.ownKeys(messages)) {
    const descriptor = Object.getOwnPropertyDescriptor(messages, key)!;
    if (typeof key !== "string" || !descriptor.enumerable || !("value" in descriptor) || typeof descriptor.value !== "string") {
      throw new TypeError("Messages require string data properties");
    }
    entries.push([key, descriptor.value]);
  }
  const next = new Map(catalogs.get());
  next.set(name.toLowerCase(), Object.freeze(Object.fromEntries(entries)));
  catalogs.set(next);
}

/** Looks up an authored label in locale order; the component supplies its documented fallback. */
export function message(locale: string | undefined, key: string, fallback: string): string {
  let name: string;
  try {
    name = new Intl.Locale(locale ?? new Intl.NumberFormat().resolvedOptions().locale).baseName.toLowerCase();
  } catch {
    return fallback;
  }
  while (name) {
    const catalog = catalogs.get().get(name);
    if (catalog && Object.hasOwn(catalog, key)) {
      return catalog[key];
    }
    const at = name.lastIndexOf("-");
    name = at < 0 ? "" : name.slice(0, at);
  }
  return fallback;
}
