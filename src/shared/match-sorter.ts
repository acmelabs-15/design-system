// Ranked filtering of a list by a query: the match-sorter algorithm (Kent C. Dodds), vendored so the
// combobox filters its options exactly as its reference does. Every item is ranked against the
// query on each of its keys; an item keeps its best rank, items below the threshold drop out, and
// the rest sort by rank (then by the ranked text, then by key order).
//
// The MIT License (MIT)
// Copyright (c) 2020 Kent C. Dodds
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software
// and associated documentation files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or
// substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/** How well a text matches the query, best first. */
export const rankings = {
  CASE_SENSITIVE_EQUAL: 7,
  EQUAL: 6,
  STARTS_WITH: 5,
  WORD_STARTS_WITH: 4,
  CONTAINS: 3,
  ACRONYM: 2,
  MATCHES: 1,
  NO_MATCH: 0,
} as const;

export type MatchSorterOptions<T> = {
  /** The item fields ranked against the query; without keys the item itself is the text. */
  keys?: ((item: T) => string | null | undefined)[] | (keyof T)[];
  /** The least rank an item keeps (`rankings.MATCHES`: a loose in-order match). */
  threshold?: number;
  /** Diacritics stay on the compared text. */
  keepDiacritics?: boolean;
};

type Ranked<T> = { item: T; rank: number; rankedValue: string; keyIndex: number; index: number };

const prepare = (text: string, keepDiacritics?: boolean) => (keepDiacritics ? text : text.normalize("NFD").replace(/\p{Diacritic}/gu, ""));

/** The rank of one text against the query. */
export const getMatchRanking = (text: string, query: string, keepDiacritics?: boolean): number => {
  const t = prepare(text, keepDiacritics);
  const q = prepare(query, keepDiacritics);
  if (q.length > t.length) return rankings.NO_MATCH;
  if (t === q) return rankings.CASE_SENSITIVE_EQUAL;
  const tl = t.toLowerCase();
  const ql = q.toLowerCase();
  if (tl === ql) return rankings.EQUAL;
  if (tl.startsWith(ql)) return rankings.STARTS_WITH;
  if (tl.includes(` ${ql}`)) return rankings.WORD_STARTS_WITH;
  if (tl.includes(ql)) return rankings.CONTAINS;
  if (ql.length === 1) return rankings.NO_MATCH;
  const acronym = tl
    .split(" ")
    .flatMap((w) => w.split("-"))
    .map((w) => w.charAt(0))
    .join("");
  if (acronym.includes(ql)) return rankings.ACRONYM;
  return closeness(tl, ql);
};

/** A loose match: every query character in order; closer together ranks higher, above MATCHES. */
const closeness = (text: string, query: string): number => {
  let matching = 0;
  const find = (ch: string, from: number) => {
    for (let i = from; i < text.length; i++)
      if (text[i] === ch) {
        matching++;
        return i + 1;
      }
    return -1;
  };
  const first = find(query[0], 0);
  if (first < 0) return rankings.NO_MATCH;
  let at = first;
  for (let i = 1; i < query.length; i++) {
    at = find(query[i], at);
    if (at < 0) return rankings.NO_MATCH;
  }
  const spread = at - first;
  return rankings.MATCHES + (1 / spread) * (matching / query.length);
};

/** The items that match the query, best first. */
export function matchSorter<T>(items: readonly T[], query: string, options: MatchSorterOptions<T> = {}): T[] {
  const { keys, threshold = rankings.MATCHES, keepDiacritics } = options;
  const ranked: Ranked<T>[] = [];
  items.forEach((item, index) => {
    let best: Ranked<T> = { item, rank: rankings.NO_MATCH, rankedValue: String(item), keyIndex: -1, index };
    if (keys) {
      keys.forEach((key, keyIndex) => {
        const raw = typeof key === "function" ? key(item) : (item as Record<PropertyKey, unknown>)[key as keyof T];
        if (raw == null) return;
        const value = String(raw);
        const rank = getMatchRanking(value, query, keepDiacritics);
        if (rank > best.rank) best = { item, rank, rankedValue: value, keyIndex, index };
      });
    } else best.rank = getMatchRanking(String(item), query, keepDiacritics);
    if (best.rank >= threshold) ranked.push(best);
  });
  return ranked
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank > b.rank ? -1 : 1;
      if (a.keyIndex !== b.keyIndex) return a.keyIndex < b.keyIndex ? -1 : 1;
      return a.rankedValue.localeCompare(b.rankedValue);
    })
    .map((r) => r.item);
}
