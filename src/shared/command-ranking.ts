import { commandScore } from "./command-score";
export type CommandMenuFilter = (value: string, query: string, keywords: readonly string[]) => number;
export type SearchableCommand = Readonly<{ value: string; label: string; keywords: readonly string[]; disabled: boolean; group?: object }>;
const defaultFilter: CommandMenuFilter = (value, query, keywords) => commandScore([value, ...keywords].join(" ").normalize("NFC"), query.normalize("NFC"));
/** Ranks whole groups, then their members, without moving author-owned nodes. */
export function rankCommands<T extends SearchableCommand>(items: readonly T[], query: string, filter?: CommandMenuFilter): T[] {
  if (!query && !filter) return [...items];
  const groups = new Map<object | T, { score: number; order: number; items: { item: T; score: number; order: number }[] }>();
  for (const [order, item] of items.entries()) {
    const score = (filter ?? defaultFilter)(item.value, query, Object.freeze([item.label, ...item.keywords]));
    if (!Number.isFinite(score) || score < 0) throw new TypeError("Command filter scores must be finite nonnegative numbers");
    if (score === 0) continue;
    const key = item.group ?? item;
    let group = groups.get(key);
    if (!group) {
      group = { score, order, items: [] };
      groups.set(key, group);
    }
    group.score = Math.max(group.score, score);
    group.items.push({ item, score, order });
  }
  return [...groups.values()].sort((a, b) => b.score - a.score || a.order - b.order).flatMap((group) => group.items.sort((a, b) => b.score - a.score || a.order - b.order).map(({ item }) => item));
}
