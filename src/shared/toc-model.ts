import { isPlainRecord } from "./plain-record";

export type TocItem = Readonly<{ id: string; href: string; label: string; level: number }>;
export function copyTocItems(value: readonly TocItem[] | undefined): readonly TocItem[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new TypeError("TOC items require an array");
  }
  const ids = new Set<string>();
  const items = value.map((item) => {
    if (!isPlainRecord(item)) {
      throw new TypeError("TOC entries require plain records");
    }
    for (const key of ["id", "href", "label", "level"]) {
      const descriptor = Object.getOwnPropertyDescriptor(item, key);
      if (!descriptor || !("value" in descriptor)) {
        throw new TypeError("TOC entries require data properties");
      }
    }
    if (
      typeof item.id !== "string" ||
      !item.id.trim() ||
      ids.has(item.id) ||
      typeof item.href !== "string" ||
      !item.href ||
      typeof item.label !== "string" ||
      !item.label.trim() ||
      typeof item.level !== "number" ||
      !Number.isInteger(item.level) ||
      item.level < 1 ||
      item.level > 6
    ) {
      throw new TypeError("TOC entries require unique IDs, links, labels and heading levels");
    }
    ids.add(item.id);
    return Object.freeze({ id: item.id, href: item.href, label: item.label, level: item.level });
  });
  return Object.freeze(items);
}
export function selectTocCurrent(entries: readonly { id: string; top: number }[], offset: number, atEnd: boolean): string | undefined {
  if (!entries.length) {
    return undefined;
  }
  if (atEnd) {
    return entries.at(-1)!.id;
  }
  let current = entries[0].id;
  for (const entry of entries) {
    if (entry.top > offset) {
      break;
    }
    current = entry.id;
  }
  return current;
}
