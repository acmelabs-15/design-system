import { expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { verifyBytePrefixes } from "../byte-prefixes";
import { binaryPrefixLocales, binaryPrefixPatterns } from "../../src/generated/byte-prefixes";

test("generated binary prefix data covers every locale in the pinned source", () => {
  const root = path.resolve(import.meta.dir, "../..");
  verifyBytePrefixes(root);
  const locales = fs.readdirSync(path.join(root, "node_modules/cldr-units-full/main"));
  expect(Object.keys(binaryPrefixLocales).sort()).toEqual(locales.map((locale) => locale.toLowerCase()).sort());
  for (const locale of locales) {
    const data = JSON.parse(fs.readFileSync(path.join(root, "node_modules/cldr-units-full/main", locale, "units.json"), "utf8"));
    expect(binaryPrefixPatterns[binaryPrefixLocales[locale.toLowerCase()]]).toEqual(Array.from({ length: 5 }, (_, i) => data.main[locale].units.long[`1024p${i + 1}`].unitPrefixPattern));
  }
  expect(binaryPrefixPatterns.length).toBeLessThan(locales.length);
});
