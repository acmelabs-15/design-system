// Splits the audited house sheet (the single source of every Geist value) into
//   tokens.css              the global layer a page loads once: scales, semantic tokens, reset,
//                           type classes, layout utilities, hue and series classes
//   src/components/<name>/<name>.styles.ts  one Lit css`` module per element, beside it, the exact rule blocks
//   src/shared/<name>.styles.ts  families with no element of their own (field, and the dashboard recipes)
//                           the class-based sheet carried, so shadow styles keep Geist's values
// Run: bun scripts/split-css.ts [path-to-geist.css]
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");
const SRC = process.argv[2] ?? path.join(process.env.HOME!, ".claude/skills/design-system/assets/geist.css");
const css = fs.readFileSync(SRC, "utf8");

/* ---------- parse into top-level blocks ---------- */
type Block = { sel: string; body: string; kind: "rule" | "at"; inner?: Block[] };
function parse(src: string): Block[] {
  const out: Block[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    // skip whitespace and comments
    if (/\s/.test(src[i])) {
      i++;
      continue;
    }
    if (src.startsWith("/*", i)) {
      i = src.indexOf("*/", i) + 2;
      continue;
    }
    const open = src.indexOf("{", i);
    if (open < 0) break;
    const sel = src.slice(i, open).trim();
    // find matching close
    let depth = 1,
      j = open + 1;
    while (j < n && depth > 0) {
      if (src[j] === "{") depth++;
      else if (src[j] === "}") depth--;
      j++;
    }
    const body = src.slice(open + 1, j - 1);
    if (sel.startsWith("@media") || sel.startsWith("@supports")) out.push({ sel, body, kind: "at", inner: parse(body) });
    else out.push({ sel, body: body.trim(), kind: sel.startsWith("@") ? "at" : "rule" });
    i = j;
  }
  return out;
}

/* ---------- which module a rule belongs to ---------- */
// Order matters: the first matching entry wins. Each regex runs against every selector in the list.
const MAP: [string, RegExp][] = [
  ["button", /^(\.btn\b|\.iconbtn|\.btn-group)/],
  ["switch", /^(\.switch|\.seg\b)/],
  ["tabs", /^\.tabs/],
  ["toggle", /^\.toggle/],
  ["checkbox", /^\.checkbox/],
  ["radio", /^\.radio/],
  ["check", /^\.check(?!box|-circle)/],
  ["badge", /^\.badge/],
  ["pill", /^\.pill/],
  ["chip", /^\.chip/],
  ["tag", /^\.tags?\b/],
  ["status-dot", /^(\.status-dot|\.dot\b|@keyframes pulse)/],
  ["card", /^(\.card\b|\.readout|\.card-foot)/],
  ["note", /^(\.note|\.banner\b|\.note-text)/],
  ["empty-state", /^\.empty-state/],
  ["kv", /^\.kv\b/],
  ["table", /^(table\.table|\.table\b|\.table-wrap|\.cellbar|\.cellspark|\.table-foot|\.matrix)/],
  ["field", /^(\.field|\.flabel|\.form-label|\.grid2)/],
  ["kbd", /^\.kbd/],
  ["modal", /^(dialog|\.modal)/],
  ["sheet", /^\.sheet/],
  ["menu", /^\.menu/],
  ["tooltip", /^(\[data-tooltip\]|\.tooltip)/],
  ["skeleton", /^(\.skeleton|@keyframes shimmer)/],
  ["spinner", /^(\.spinner|@keyframes spin)/],
  ["loading-dots", /^(\.dots|@keyframes dots)/],
  ["progress", /^\.progress/],
  ["gauge", /^(\.gauge|\.ring\b|\.score-ring)/],
  ["avatar", /^\.avatar/],
  ["collapse", /^details\.collapse/],
  ["toast", /^\.toast/],
  ["appbar", /^(\.appbar|\.subbar|:root:has\(\.subbar\))/],
  ["trend", /^\.trend/],
  ["panel-head", /^\.panel-head/],
  ["legend", /^(\.legend|\.stat-legend|\.series-|\.chart-head)/],
  ["bar-row", /^\.bar-rows?\b/],
  ["item", /^(\.items?\b|\.accordion|\.acc-bar|\.acc-body|\.kv-grid|\.select-list)/],
  ["chart", /^\.chart\b/],
  ["ricon", /^\.ricon/],
  ["tile", /^(\.tiles?\b)/],
  ["rail", /^(\.with-rail|\.rail)/],
  ["filter", /^(\.filters-row|\.filter\b|\.qrow|\.qseg)/],
  ["search", /^\.search/],
  ["page-head", /^(\.toolbar|\.page-head)/],
  ["panel", /^(\.panel|\.panels|\.fieldset|\.disabled-wall)/],
  ["fold", /^(\.fold|\.count-dot|\.expand)/],
  ["shell", /^(\.shell|\.side|\.topbar|\.content)/],
  ["task", /^(\.tasks?\b)/],
  ["info-ic", /^(\.info-ic|\.check-circle)/],
  ["code", /^(\.step-n|\.codeblock|\.code-tabs|code\.inline|\.code-frame|\.snippet)/],
  ["subnav", /^\.subnav/],
  ["logs", /^(\.logs|\.logrow)/],
  ["link-card", /^(\.link-cards?|\.rec-card)/],
  ["stat-strip", /^\.stat-strip/],
  ["metric-list", /^(\.metric-list|\.threshold)/],
  ["usage-sum", /^\.usage-sum/],
  ["classes", /^\.classes/],
  ["severity", /^(\.severity|\.issue)/],
  ["option", /^(\.options?\b|\.choicebox)/],
  ["setting-row", /^\.setting-rows?/],
  ["plan", /^(\.plan-head|\.icon-rows?|\.section-title)/],
  ["deploy", /^(\.deploy-|\.project-row|\.bar-list)/],
  ["stat", /^(\.stat\b|\.spark)/],
  ["description", /^\.description/],
  ["breadcrumbs", /^\.breadcrumbs/],
  ["banner", /^\.site-banner/],
  ["project-banner", /^\.project-banner/],
  ["error", /^(\.error-text|\.error-card)/],
  ["show-more", /^\.show-more/],
  ["pagination", /^\.pagination/],
  ["middle-truncate", /^\.truncate-mid/],
  ["scroller", /^\.scroller/],
  ["slider", /^\.slider/],
  ["theme-switcher", /^\.theme-switch/],
  ["text-copy", /^\.copy-text/],
  ["book", /^\.book/],
  ["browser", /^\.browser/],
  ["calendar", /^(\.calendar|\.cal-)/],
  ["combobox", /^\.combobox/],
  ["command-menu", /^\.cmdk/],
  ["context-card", /^(\.context-card|\.context-target)/],
  ["drawer", /^\.drawer/],
  ["feedback", /^\.feedback/],
  ["file-tree", /^\.tree/],
  ["grid", /^\.gs\b|^\.gs-/],
  ["json-view", /^\.json/],
  ["multi-select", /^(\.multi-select|\.ms-row)/],
  ["phone", /^\.phone/],
  ["relative-time", /^(\.time-card|\.reltime)/],
  ["video", /^\.video/],
];
const moduleOf = (sel: string): string | null => {
  const parts = sel.split(",").map((s) => s.trim());
  for (const [name, re] of MAP) if (parts.some((p) => re.test(p))) return name;
  return null;
};

/* ---------- distribute ---------- */
const modules = new Map<string, string[]>();
const global: string[] = [];
const add = (name: string | null, text: string) => {
  if (!name) global.push(text);
  else (modules.get(name) ?? modules.set(name, []).get(name)!).push(text);
};
const blocks = parse(css);
for (const b of blocks) {
  if (b.kind === "at" && b.inner) {
    // split a media block's inner rules the same way, re-wrapping each group
    const groups = new Map<string | null, string[]>();
    for (const r of b.inner) {
      const m = moduleOf(r.sel);
      (groups.get(m) ?? groups.set(m, []).get(m)!).push(`${r.sel}{${r.body}}`);
    }
    for (const [m, rules] of groups) add(m, `${b.sel}{\n  ${rules.join("\n  ")}\n}`);
    continue;
  }
  if (b.sel.startsWith("@keyframes")) {
    add(moduleOf(b.sel), `${b.sel}{${b.body}}`);
    continue;
  }
  add(moduleOf(b.sel), `${b.sel}{${b.body}}`);
}

/* ---------- write ---------- */
const header = `/* @acmelabs/design-system tokens.css — the global layer. Generated by scripts/split-css.ts from the audited house sheet; edit the sheet, not this file. */\n`;
fs.writeFileSync(path.join(ROOT, "tokens.css"), `${header + global.join("\n")}\n`);
// Families that are not an element: the shared field rules and the dashboard recipe layer.
const SHARED = new Set(["field", "classes", "deploy", "info-ic", "option", "plan", "rail", "severity", "usage-sum"]);
fs.mkdirSync(path.join(ROOT, "src/shared"), { recursive: true });
const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
for (const [name, rules] of modules) {
  const id = `${camel(name)}Css`;
  const file = SHARED.has(name) ? path.join(ROOT, "src/shared", `${name}.styles.ts`) : path.join(ROOT, "src/components", name, `${name}.styles.ts`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `// Generated by scripts/split-css.ts from the audited house sheet. Do not edit.\nimport { css } from "lit";\nexport const ${id} = css\`\n${esc(rules.join("\n"))}\n\`;\n`);
}
console.log(`tokens.css: ${global.length} blocks; modules: ${modules.size}`);
console.log(
  Array.from(modules.entries())
    .map(([n, r]) => `${n}:${r.length}`)
    .join(" "),
);
