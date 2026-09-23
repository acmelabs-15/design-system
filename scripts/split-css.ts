import { motionTokenDefinitions } from "../src/shared/motion-tokens";
// Splits the audited house sheet (the single source of every Geist value) into
//   tokens.css              the global layer a page loads once: scales, semantic tokens, reset,
//                           type classes, layout utilities, hue and series classes
//   src/generated/components/<name>/<name>.styles.ts  one Lit css`` module per element
//   src/generated/shared/<name>.styles.ts  families with no element of their own (field and recipes)
//                           the class-based sheet carried, so shadow styles keep Geist's values
// Run: bun scripts/split-css.ts [path-to-house.css]
import fs from "node:fs";
import path from "node:path";
import { partitionStyleSheet, writeStyle } from "./styles";
import { numericTokenCss, writeTokenManifest } from "./numeric-tokens";
import { generateThemeStyles, writeThemeStyleMetadata } from "./theme-tokens";
import { writeResponsiveStyleDelivery } from "./responsive-styles";

const ROOT = path.resolve(import.meta.dir, "..");
const SRC = process.argv[2] ?? path.join(ROOT, "styles/house.css"); // the audited house sheet, the source of every element style
const css = fs.readFileSync(SRC, "utf8");

/* ---------- which module a rule belongs to ---------- */
// Order matters: the first matching entry wins. Each regex runs against every selector in the list.
const MAP: [string, RegExp][] = [
  ["button", /^(\.btn\b|\.iconbtn)/],
  ["split-button", /^\.split-menu/],
  ["split-button-item", /^\.split-item/],
  ["checkbox", /^\.checkbox/],
  ["radio", /^\.radio/],
  ["badge", /^\.badge/],
  ["pill", /^\.pill/],
  ["tag", /^\.tag\b/],
  ["table", /^(table\.table|\.table\b|\.table-wrap|\.cellbar|\.cellspark|\.table-foot|\.matrix)/],
  ["field", /^(\.field|\.flabel|\.form-label|\.grid2)/],
  ["menu", /^\.menu/],
  ["video", /^\.progress/], // Video scrubber rules; Progress owns a separate stylesheet.
  ["avatar", /^\.avatar/],
  ["toast", /^\.toast/],
  ["legend", /^(\.legend|\.stat-legend|\.series-|\.chart-head)/],
  ["chart", /^\.chart\b/],
  ["rail", /^(\.with-rail|\.rail)/],
  ["search", /^\.search/],
  ["info-ic", /^(\.info-ic|\.check-circle)/],
  ["code", /^(\.step-n|\.codeblock|\.code\b|\.hide-ln|\.th-|code\.inline|\.snippet)/],
  ["markdown", /^\.markdown/],
  ["usage-sum", /^\.usage-sum/],
  ["classes", /^\.classes/],
  ["severity", /^(\.severity|\.issue)/],
  ["option", /^\.options?\b/],
  ["plan", /^(\.plan-head|\.icon-rows?|\.section-title)/],
  ["deploy", /^(\.deploy-|\.project-row|\.bar-list)/],
  ["error", /^\.error-text/],
  ["pagination", /^\.pagination/],
  ["middle-truncate", /^\.truncate-mid/],
  ["book", /^\.book/],
  ["browser", /^\.browser/],
  ["clearable-input", /^\.clearable/],
  ["feedback", /^\.feedback/],
  ["json-view", /^\.json/],
  ["video", /^\.video/],
];
const moduleOf = (sel: string): string | null => {
  const parts = sel.split(",").map((s) => s.trim());
  for (const [name, re] of MAP) if (parts.some((p) => re.test(p))) return name;
  return null;
};

/* ---------- write ---------- */
const groups = partitionStyleSheet(css, moduleOf);
const global = groups.get(null) ?? "";
const modules = new Map([...groups].filter(([name]) => name !== null)) as Map<string, string>;
const theme = path.join(ROOT, "src/generated/theme.css");
const themeCss = fs.readFileSync(theme, "utf8");
const inputs = ["styles/house.css", "src/generated/theme.css", "scripts/split-css.ts"];
writeTokenManifest(ROOT);
writeStyle("shared/motion", "", {
  producer: "authored",
  inputs: ["src/shared/motion-tokens.ts", "scripts/split-css.ts"],
  properties: motionTokenDefinitions.map((token) => ({ name: token.cssProperty, syntax: "<number>", inherits: true, initialValue: token.defaultValue })),
});
writeResponsiveStyleDelivery(ROOT);
const scopedTheme = generateThemeStyles(ROOT);
writeThemeStyleMetadata(ROOT);
writeStyle("shared/theme", scopedTheme.css, { producer: "authored", inputs: scopedTheme.inputs });
writeStyle("document/tokens", global + "\n" + themeCss + "\n" + numericTokenCss() + "\n" + scopedTheme.rootCss, {
  producer: "document",
  inputs: [...inputs, "scripts/numeric-tokens.ts", "src/shared/numeric-tokens.ts", "scripts/theme-tokens.ts", "src/shared/theme-tokens.ts"],
  module: false,
});
// Families that are not an element: the shared field rules and the dashboard recipe layer.
const SHARED = new Set(["field", "classes", "deploy", "info-ic", "option", "plan", "rail", "severity", "usage-sum"]);
fs.mkdirSync(path.join(ROOT, "src/generated/shared"), { recursive: true });
// A family with a mapping under tools/geist/maps is derived by the style generator, not from the sheet: the
// mapping named after it, or one whose `element` names it (a second mapping of one element, e.g. search-input → search).
const mapsDir = path.join(ROOT, "tools/geist/maps");
const generated = new Set(
  fs.readdirSync(mapsDir).flatMap((f) => {
    const element = fs.readFileSync(path.join(mapsDir, f), "utf8").match(/^\s*element:\s*"([^"]+)"/m)?.[1];
    return [f.replace(/\.ts$/, ""), ...(element ? [element] : [])];
  }),
);
for (const [name, rules] of modules) {
  if (generated.has(name)) continue;
  const key = SHARED.has(name) ? "shared/" + name : "components/" + name + "/" + name;
  writeStyle(key, rules, { producer: "house", inputs });
}
console.log("styles: " + modules.size + " base style families and document tokens");

for (const file of new Bun.Glob("styles/{components,shared}/**/*.css").scanSync(ROOT)) {
  const key = file.slice("styles/".length, -".css".length);
  writeStyle(key, fs.readFileSync(path.join(ROOT, file), "utf8"), { producer: "authored", inputs: [file, "scripts/split-css.ts"] });
}
