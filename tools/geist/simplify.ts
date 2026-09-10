// Turns declarations derived from Tailwind output into plain CSS: Tailwind's `--tw-*` composition
// variables are evaluated (shadow and ring stacks, transform and translate stacks, border style,
// leading, weight, duration) with the defaults the sheet registers via @property, theme constants
// (`--text-base`, `--font-weight-medium`, `--spacing` math) are inlined, and later declarations of
// the same property replace earlier ones. Design tokens (`--ds-*`, `--geist-*`, `--themed-*`,
// `--font-geist-*`) stay as variables: they are the theme, and our tokens.css supplies them.
import fs from "node:fs";
import path from "node:path";
import { rootVars } from "./tw";

const cssDir = path.join(import.meta.dir, "corpus/css");

/** `@property --tw-x { initial-value: ... }` for every registered Tailwind variable. */
export const twDefaults: Record<string, string> = {};
/** The registration text of every Tailwind variable, for the ones a module keeps as variables. */
export const twProperty: Record<string, string> = {};

/**
 * Reads the reference sheets on first use, never at import. The corpus is the reference site's own
 * output and is not in the repository, so importing this module must not touch the disk: a test
 * that wants one pure function from here would otherwise fail wherever the corpus is absent.
 * The exported records are filled in place, so an importer that holds a reference still sees them.
 */
let loaded = false;
let themes: { light: Record<string, string>; dark: Record<string, string> } = { light: {}, dark: {} };
function load() {
  if (loaded) return;
  loaded = true;
  const cssText = fs.readdirSync(cssDir).map((f) => fs.readFileSync(path.join(cssDir, f), "utf8")).join("\n");
  for (const m of cssText.matchAll(/@property (--tw-[a-z0-9-]+)\{([^}]*)\}/g)) {
    twProperty[m[1]] = `@property ${m[1]} { ${m[2].trim().replace(/;\s*/g, "; ").replace(/;\s*$/, "")}; }`;
    const iv = m[2].match(/initial-value:([^;]*)/);
    // A registered <length> resolves a bare `0` to `0px`; written out into a calc() operand, the unit has to be there.
    const lengthSyntax = /syntax:\s*"<length(?:-percentage)?>"/.test(m[2]);
    twDefaults[m[1]] = iv ? (lengthSyntax && iv[1].trim() === "0" ? "0px" : iv[1].trim()) : "";
  }
  themes = rootVars();
}
/** The light theme's custom properties, loaded on demand. */
const themeOf = () => (load(), themes.light);
/** Fills twDefaults and twProperty. Call before reading them directly; simplify() does it itself. */
export const loadReference = load;
/** Theme constants worth inlining: plain values under Tailwind's theme namespaces. */
const INLINE = /^--(text-|font-weight-|radius-|spacing$|default-|tracking-|leading-|blur-|ease-|animate-|shadow-|inset-shadow-|drop-shadow-|container-|breakpoint-|aspect-|perspective-)/;
/**
 * A constant the dark theme redefines (`--shadow-smallest`: a hairline in dark) is a token, not a constant: it stays a variable.
 * A constant that names other variables (`--animate-cmdkScaleIn: cmdkScaleIn var(--ds-motion-overlay-duration) …`) is inlined with
 * every inner constant inlined in turn; a runtime token it names (a `--ds-` variable the theme ships) stays a variable in the value.
 */
const constant = (name: string, seen: Set<string> = new Set()): string | undefined => {
  const v = themeOf()[name];
  const dark = (load(), themes.dark[name]);
  if (v === undefined || (dark !== undefined && dark !== v) || seen.has(name)) return undefined;
  let ok = true;
  const out = v.replace(/var\((--[\w-]+)\)/g, (m, inner: string) => {
    if (!INLINE.test(inner)) return m;
    const c = constant(inner, new Set([...seen, name]));
    if (c === undefined) ok = false;
    return c ?? m;
  });
  return ok ? out : undefined;
};

export type Decl = { prop: string; value: string; important: boolean; order?: number };
export const parseDecls = (s: string): Decl[] =>
  s
    .split(/;(?![^(]*\))/)
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const i = d.indexOf(":");
      const prop = d.slice(0, i).trim();
      let value = d.slice(i + 1).trim();
      const important = /!important$/.test(value);
      if (important) value = value.replace(/\s*!important$/, "");
      return { prop, value, important };
    });

/** Splits at top-level commas. */
const splitTop = (v: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of v) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

/** Replaces every var(--name[, fallback]) whose name the resolver answers; fallbacks are used when it returns undefined. */
function substitute(value: string, lookup: (name: string) => string | undefined): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    const at = value.indexOf("var(", i);
    if (at < 0) {
      out += value.slice(i);
      break;
    }
    out += value.slice(i, at);
    let depth = 1;
    let j = at + 4;
    while (j < value.length && depth) {
      if (value[j] === "(") depth++;
      else if (value[j] === ")") depth--;
      j++;
    }
    const inner = value.slice(at + 4, j - 1);
    const comma = inner.indexOf(",");
    const name = (comma < 0 ? inner : inner.slice(0, comma)).trim();
    const fallback = comma < 0 ? undefined : inner.slice(comma + 1).trim();
    const v = lookup(name);
    if (v === "unset") out += fallback !== undefined ? substitute(fallback, lookup) : ""; // a registered --tw-* with no value: the fallback applies
    else if (v !== undefined) out += substitute(v, lookup);
    else out += fallback !== undefined ? `var(${name}, ${substitute(fallback, lookup)})` : `var(${name})`; // a design token stays a token
    i = j;
  }
  return out;
}

// A division that does not terminate within four decimals (`calc(1 / .75)`, a line-height ratio) stays a calc: the browser evaluates it exactly, where a rounded ratio lands a hair off (15.9996px for 16px).
const calcSimple = (v: string) => v.replace(/calc\(\s*(-?[\d.]+)\s*\/\s*(-?[\d.]+)\s*\)/g, (m, a, b) => {
    const q = parseFloat((Number(a) / Number(b)).toFixed(4));
    return Math.abs(q * Number(b) - Number(a)) < 1e-9 ? String(q) : m;
  }).replace(/calc\(\s*([\d.]+)(rem|px|%)\s*\*\s*(-?[\d.]+)\s*\)/g, (_, n, u, k) => `${parseFloat((Number(n) * Number(k)).toFixed(4))}${u}`).replace(/calc\(\s*(-?[\d.]+(?:rem|px|%))\s*\)/g, "$1");

/**
 * Simplifies one selector's declarations given the `--tw-*` environment inherited from the rules
 * that also match the element (base and modifier rules), returning plain declarations.
 */
export function simplify(decls: Decl[], inherited: Decl[], keep: Set<string> = new Set()): Decl[] {
  const env: Record<string, string> = { ...twDefaults };
  for (const d of [...inherited, ...decls]) if (d.prop.startsWith("--tw-")) env[d.prop] = d.value;
  const lookup = (name: string): string | undefined => {
    if (keep.has(name)) return undefined; // stays a variable: the module registers it and its rules set it
    if (name.startsWith("--tw-")) return name in env && env[name] !== "" ? env[name] : "unset";
    if (INLINE.test(name)) return constant(name);
    return undefined;
  };
  const out: Decl[] = [];
  for (const d of decls) {
    if (d.prop.startsWith("--tw-") && !keep.has(d.prop)) continue;
    // A zero length drops its unit, except as a calc() operand: `calc(2px + 0px)` needs the unit to stay a length.
    // A custom property keeps it too: its value is substituted later, into a calc() as often as not.
    let value = calcSimple(substitute(d.value, lookup).replace(/\s+/g, " ").trim());
    if (!d.prop.startsWith("--")) value = value.replace(/(^|(?<![-+*/])\s)0(?:rem|px|em)(?=\s|$|,)/g, "$10");
    if (d.prop === "box-shadow") {
      const parts = splitTop(value).filter((p) => p && p !== "0 0 #0000");
      // All layers transparent (`shadow-none`): a valid declaration that still overrides in the cascade, so it stays as `none`.
      value = parts.length ? parts.join(", ") : "none";
    }
    if ((d.prop === "transform" || d.prop === "filter" || d.prop === "backdrop-filter") && !value.trim()) continue;
    if (d.prop === "transform") value = value.trim().replace(/\s{2,}/g, " ");
    if (!value.trim()) continue;
    out.push({ ...d, value });
  }
  // Later declarations replace earlier ones of the same property, and a later shorthand replaces every
  // earlier longhand it resets (`border: none` after `border-top-width`, an unlayered rule's shorthand
  // over a utility's longhand); an important one survives a later plain one.
  // The replacement takes the place of the first declaration it replaces, so the block's order is stable.
  const merged: Decl[] = [];
  for (const d of out) {
    if (merged.some((m) => m.prop === d.prop && m.important && !d.important)) continue;
    let at = merged.length;
    for (let j = merged.length - 1; j >= 0; j--)
      if (covers(d.prop, merged[j].prop) && !(merged[j].important && !d.important)) {
        merged.splice(j, 1);
        at = j;
      }
    merged.splice(at, 0, d);
  }
  return merged;
}

/** The longhands a property sets, so that two declarations of overlapping properties are ordered and merged like the reference. */
export function atoms(p: string): string[] {
  const sides = ["top", "right", "bottom", "left"];
  const expand = (list: string[], from: RegExp, to: string[]) => list.flatMap((x) => (from.test(x) ? to.map((t) => x.replace(from, t)) : [x]));
  let props = [p];
  props = expand(props, /-inline-start(?=-|$)/, ["-left"]);
  props = expand(props, /-inline-end(?=-|$)/, ["-right"]);
  props = expand(props, /-block-start(?=-|$)/, ["-top"]);
  props = expand(props, /-block-end(?=-|$)/, ["-bottom"]);
  props = expand(props, /-inline(?=-|$)/, ["-left", "-right"]);
  props = expand(props, /-block(?=-|$)/, ["-top", "-bottom"]);
  return props.flatMap((x) => {
    if (/^(padding|margin|scroll-margin|scroll-padding)$/.test(x)) return sides.map((s) => `${x}-${s}`);
    if (x === "inset") return sides;
    if (x === "border-radius") return ["top-left", "top-right", "bottom-right", "bottom-left"].map((c) => `border-${c}-radius`);
    if (/^border-(width|style|color)$/.test(x)) return sides.map((s) => x.replace("border-", `border-${s}-`));
    if (x === "border") return sides.flatMap((s) => ["width", "style", "color"].map((k) => `border-${s}-${k}`));
    if (/^border-(top|right|bottom|left)$/.test(x)) return ["width", "style", "color"].map((k) => `${x}-${k}`);
    if (x === "gap") return ["row-gap", "column-gap"];
    if (x === "flex") return ["flex-grow", "flex-shrink", "flex-basis"];
    if (/^place-(items|content|self)$/.test(x)) return [x.replace("place-", "align-"), x.replace("place-", "justify-")];
    return [x];
  });
}
/**
 * Longhands a same-prefixed shorthand does NOT reset, so the name prefix alone cannot decide.
 * `outline` sets outline-style, outline-width and outline-color only: "outline-offset is not part
 * of the outline shorthand" (CSS UI). Treating the prefix as authority drops a declaration the
 * cascade keeps, and the element then ships without it.
 */
const NOT_RESET: Record<string, string[]> = {
  outline: ["outline-offset"],
  // `transform` is a list of transform functions; transform-style, transform-origin and
  // transform-box are separate properties (CSS Transforms 2 gives each its own section).
  transform: ["transform-style", "transform-origin", "transform-box"],
  text: ["text-align", "text-indent", "text-transform", "text-shadow", "text-overflow", "text-wrap"],
  background: ["background-blend-mode"],
  border: ["border-collapse", "border-spacing", "border-image"],
  overflow: ["overflow-anchor", "overflow-wrap", "overflow-clip-margin"],
  flex: ["flex-flow", "flex-direction", "flex-wrap"],
  grid: ["grid-column-gap", "grid-row-gap", "grid-gap"],
  mask: ["mask-border", "mask-type"],
  animation: ["animation-timeline", "animation-range"],
  page: ["page-break-after", "page-break-before", "page-break-inside"],
  column: ["column-gap", "column-fill", "column-span"],
  font: [
    "font-optical-sizing",
    "font-palette",
    "font-kerning",
    "font-synthesis",
    "font-variant-alternates",
    "font-variant-east-asian",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-feature-settings",
    "font-language-override",
    "font-size-adjust",
    "font-smooth",
  ],
};
/** Whether a declaration of `x` resets one of `y`: the same property, or a shorthand over that longhand. */
const resets = (x: string, y: string) => {
  if (x === y) return true;
  if (!y.startsWith(`${x}-`)) return false;
  return !NOT_RESET[x]?.includes(y);
};
/** Whether a declaration of `p` resets everything a declaration of `q` sets: the same property, or a shorthand over each of its longhands. */
const covers = (p: string, q: string) => {
  const a = atoms(p);
  return atoms(q).every((y) => a.some((x) => resets(x, y)));
};

export const serialize = (decls: Decl[]) => decls.map((d) => `${d.prop}:${d.value}${d.important ? " !important" : ""}`).join(";");
