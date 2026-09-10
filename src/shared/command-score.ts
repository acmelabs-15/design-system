// Vendored from the cmdk project (command-score.ts), which adapts Superhuman's command-score.
//
// MIT License
//
// Copyright (c) 2022 Paco Coursey
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// The scores are arranged so that a continuous match of characters will result in a total score of 1.
// The best case, this character is a match, and either this is the start of the string, or the previous character was also a match.
const SCORE_CONTINUE_MATCH = 1;
// A new match at the start of a word scores better than a new match elsewhere as it's more likely that the user will type the starts
// of fragments. Word jumps between spaces score slightly higher than slashes, brackets, hyphens, etc.
const SCORE_SPACE_WORD_JUMP = 0.9;
const SCORE_NON_SPACE_WORD_JUMP = 0.8;
// Any other match isn't ideal, but we include it for completeness.
const SCORE_CHARACTER_JUMP = 0.17;
// If the user transposed two letters, it should be significantly penalized. i.e. "ouch" is more likely than "curtain" when "uc" is typed.
const SCORE_TRANSPOSITION = 0.1;
// The goodness of a match should decay slightly with each missing character. i.e. "bad" is more likely than "bard" when "bd" is typed.
// This will not change the order of suggestions based on SCORE_* until 100 characters are inserted between matches.
const PENALTY_SKIPPED = 0.999;
// The goodness of an exact-case match should be higher than a case-insensitive match by a small amount.
// i.e. "HTML" is more likely than "haml" when "HM" is typed.
const PENALTY_CASE_MISMATCH = 0.9999;
// If the word has more characters than the user typed, it should be penalised slightly. i.e. "html" is more likely than "html5" if I type "html".
const PENALTY_NOT_COMPLETE = 0.99;

const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
const IS_SPACE_REGEXP = /[\s-]/;
const COUNT_SPACE_REGEXP = /[\s-]/g;

function commandScoreInner(
  string: string,
  abbreviation: string,
  lowerString: string,
  lowerAbbreviation: string,
  stringIndex: number,
  abbreviationIndex: number,
  memoizedResults: Record<string, number>,
): number {
  if (abbreviationIndex === abbreviation.length) {
    if (stringIndex === string.length) return SCORE_CONTINUE_MATCH;
    return PENALTY_NOT_COMPLETE;
  }
  const memoizeKey = `${stringIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== undefined) return memoizedResults[memoizeKey];
  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerString.indexOf(abbreviationChar, stringIndex);
  let highScore = 0;
  let score: number;
  let transposedScore: number;
  let wordBreaks: RegExpMatchArray | null;
  let spaceBreaks: RegExpMatchArray | null;
  while (index >= 0) {
    score = commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memoizedResults);
    if (score > highScore) {
      if (index === stringIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
        if (wordBreaks && stringIndex > 0) score *= PENALTY_SKIPPED ** wordBreaks.length;
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && stringIndex > 0) score *= PENALTY_SKIPPED ** spaceBreaks.length;
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (stringIndex > 0) score *= PENALTY_SKIPPED ** (index - stringIndex);
      }
      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) score *= PENALTY_CASE_MISMATCH;
    }
    if (
      (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1)) ||
      // allow duplicate letters
      (lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex))
    ) {
      transposedScore = commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 2, memoizedResults);
      if (transposedScore * SCORE_TRANSPOSITION > score) score = transposedScore * SCORE_TRANSPOSITION;
    }
    if (score > highScore) highScore = score;
    index = lowerString.indexOf(abbreviationChar, index + 1);
  }
  memoizedResults[memoizeKey] = highScore;
  return highScore;
}

/** Every valid space character becomes a space, so they match each other. */
const formatInput = (string: string) => string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");

/** How well `abbreviation` (what the user typed) matches `string` (a row's value): 1 for a whole match, 0 for none. */
export function commandScore(string: string, abbreviation: string): number {
  return commandScoreInner(string, abbreviation, formatInput(string), formatInput(abbreviation), 0, 0, {});
}
