// Parses the Geist site's Tailwind CSS into a class -> rules map and resolves the classes of the
// server-rendered examples on one page. Proof that the static spec is complete.
import fs from "node:fs";
import path from "node:path";

const DIR = import.meta.dir;
/** The stylesheets in the order the reference pages link them: the cascade depends on it. */
export function sheetOrder(): string[] {
  const orders = new Set<string>();
  for (const f of fs.readdirSync(path.join(DIR, "corpus/html")).filter((f) => f.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(DIR, "corpus/html", f), "utf8");
    const seen: string[] = [];
    for (const m of html.matchAll(/<link[^>]*href="[^"]*\/([a-z0-9_-]+\.css)"/gi)) if (!seen.includes(m[1])) seen.push(m[1]);
    orders.add(seen.join(" "));
  }
  if (orders.size !== 1) throw new Error(`reference pages link stylesheets in different orders: ${[...orders].join(" | ")}`);
  return [...orders][0].split(" ");
}
const css = sheetOrder().map((f) => fs.readFileSync(path.join(DIR, "corpus/css", f), "utf8")).join("\n");

/** Splits a selector list at commas outside parentheses and not escaped. */
function splitSelectors(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < list.length; i++) {
    const ch = list[i];
    if (ch === "\\") {
      cur += ch + (list[i + 1] ?? "");
      i++;
      continue;
    }
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

// Flatten @media/@supports/@layer blocks: keep the wrapper as a prefix on each rule.
type Rule = { sel: string; decl: string; at: string; order: number };
const rules: Rule[] = [];
/** `@keyframes <name> { ... }` bodies by name, so an element's module can carry the animations its rules reference. */
const keyframes = new Map<string, string>();
function walk(src: string, at: string) {
  let i = 0;
  while (i < src.length) {
    const open = src.indexOf("{", i);
    if (open < 0) break;
    const head = src.slice(i, open).trim();
    let depth = 1;
    let j = open + 1;
    while (j < src.length && depth) {
      if (src[j] === "{") depth++;
      else if (src[j] === "}") depth--;
      j++;
    }
    const body = src.slice(open + 1, j - 1);
    // Conditional group rules keep their wrapper as a prefix; @starting-style is one (the `starting:` variant's entry state).
    if (head.startsWith("@media") || head.startsWith("@supports") || head.startsWith("@layer") || head.startsWith("@container") || head.startsWith("@starting-style")) walk(body, at ? `${at} ${head}` : head);
    else if (head.startsWith("@keyframes")) keyframes.set(head.replace(/^@keyframes\s+/, "").trim(), body.trim());
    else if (!head.startsWith("@")) for (const s of splitSelectors(head)) rules.push({ sel: s.trim(), decl: body.trim(), at, order: rules.length });
    i = j;
  }
}
walk(css, "");

// Index rules by the escaped class token they start with (".hover\:bg-x:hover" -> "hover:bg-x").
const unesc = (s: string) => s.replace(/\\(.)/g, "$1");
const byClass = new Map<string, Rule[]>();
// Every class token in a selector indexes the rule, so compound selectors (".a.b", ".a .b") resolve from either class.
// A bare attribute token (`[data-grid]`, a component's marker) indexes it too, so a rule that names an element by its marker resolves from the marker.
for (const r of rules) {
  const seen = new Set<string>();
  for (const m of r.sel.matchAll(/\.((?:\\.|[^\s.:>~+\[\]()])+)|(\[[\w-]+\])/g)) {
    const cls = m[1] === undefined ? m[2] : unesc(m[1]);
    if (seen.has(cls)) continue;
    seen.add(cls);
    (byClass.get(cls) ?? byClass.set(cls, []).get(cls)!).push(r);
  }
}
export const resolve = (cls: string) => byClass.get(cls) ?? [];
export const allRules = () => rules;
export const keyframesOf = (name: string) => keyframes.get(name);
/**
 * The custom properties Geist declares on the root, light and dark, in source order with later
 * declarations winning, including the @supports (lab / oklch / P3) overrides a modern browser
 * applies. Dark values come from selectors that name only the dark-theme class.
 */
export function rootVars(): { light: Record<string, string>; dark: Record<string, string> } {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};
  const isRoot = (s: string) => /^(:root|html|:host)$/.test(s.trim());
  const isDark = (s: string) => /^(:root|html)?\.dark-theme$/.test(s.trim()) || /^:root\s*\.dark-theme$/.test(s.trim());
  for (const r of rules) {
    if (/@media/.test(r.at)) continue; // media-conditioned blocks are not the resting value
    const target = isRoot(r.sel) ? light : isDark(r.sel) ? dark : null;
    if (!target) continue;
    for (const d of r.decl.split(/;(?![^(]*\))/)) {
      const i = d.indexOf(":");
      if (i < 0) continue;
      const k = d.slice(0, i).trim();
      if (k.startsWith("--")) target[k] = d.slice(i + 1).trim();
    }
  }
  return { light, dark };
}


if (import.meta.main) {
  const page = process.argv[2] ?? "button";
  const html = fs.readFileSync(path.join(DIR, "corpus/html", `${page}.html`), "utf8");
  const classes = new Set<string>();
  for (const m of html.matchAll(/class="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (c) classes.add(c.replace(/&amp;/g, "&"));
  const missing = [...classes].filter((c) => !byClass.has(c));
  console.log(`${page}: ${rules.length} rules, ${byClass.size} classes indexed; page uses ${classes.size} classes, ${missing.length} unresolved`);
  console.log("unresolved sample:", missing.slice(0, 25).join("  "));
  for (const c of ["h-8", "hover:bg-background-200", "data-[focus]:shadow-[var(--ds-focus-ring)]", "duration-[time:150ms]", "rounded-md", "text-copy-14", "disabled:bg-[var(--ds-gray-100)]", "shadow-focus-ring", "!px-(--geist-gap-half)"])
    console.log(`  ${c} -> ${resolve(c).map((r) => `${r.at ? `[${r.at}] ` : ""}${r.sel}{${r.decl}}`).join(" || ") || "(none)"}`);
}
