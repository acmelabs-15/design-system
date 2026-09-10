// Diffs two census files (Geist mirror vs ours) root by root, state by state, property by property.
// Font metrics differ by design (Google Sans vs Geist), so font-family and text-driven widths are
// reported separately, not as failures. Run: bun tools/geist/diff.ts <page>
import fs from "node:fs";
import path from "node:path";

const page = process.argv[2] ?? "button";
const dir = path.join(import.meta.dir, "census");
type Census = { roots: { example: number; index: number; tag: string; attrs: Record<string, string>; states: Record<string, Record<string, Record<string, string>>> }[] };
const g = JSON.parse(fs.readFileSync(path.join(dir, `${page}.geist.json`), "utf8")) as Census;
const o = JSON.parse(fs.readFileSync(path.join(dir, `${page}.ours.json`), "utf8")) as Census;

// Font metrics differ by design (Google Sans vs Geist): inherited text properties, and the width and line box
// of text-bearing parts, are reported separately. Icon and slot geometry, and every other property, are hard.
const INHERITED = new Set(["font-family", "line-height"]);
// A census may name more such parts (`textParts` in the census call): a full-width container follows the root's width,
// and a one-line text box's height follows the font's ascent and descent (the strut), like the label's.
const declared = (c: Census) => (c as Census & { textParts?: string[] }).textParts ?? [];
const DECLARED = new Set([...declared(g), ...declared(o)]);
const TEXT_PARTS = new Set(["root", "label", "text", "content", "link", "action", ...DECLARED]);
// A census may also name properties of a part whose used value follows the text (`textProps` in the census call: an auto
// margin resolved against the space a text box leaves in a flex row), read as soft on that part alone.
const declaredProps = (c: Census) => (c as Census & { textProps?: Record<string, string[]> }).textProps ?? {};
const TEXT_PROPS: Record<string, string[]> = { ...declaredProps(g), ...declaredProps(o) };
// transform-origin resolves to half the box, so on a text part it follows the text width.
const softFor = (part: string, prop: string) =>
  INHERITED.has(prop) ||
  (TEXT_PARTS.has(part) && (prop === "width" || prop === "max-width" || prop === "__rect" || prop === "transform-origin")) ||
  ((part === "label" || DECLARED.has(part)) && prop === "height") ||
  !!TEXT_PROPS[part]?.includes(prop);
// Colors compare as sRGB 8-bit tuples: the reference serializes oklch/lab/rgb per token tier and ours may differ in form only.
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const linToSrgb = (r: number, g: number, b: number) => [r, g, b].map((c) => Math.round(clamp(gam(c)) * 255));
const xyzToLin = (x: number, y: number, z: number) => [3.2404542 * x - 1.5371385 * y - 0.4985314 * z, -0.969266 * x + 1.8760108 * y + 0.041556 * z, 0.0556434 * x - 0.2040259 * y + 1.0572252 * z];
const oklabToSrgb = (L: number, a: number, b: number) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s2 = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return linToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s2);
};
const labToSrgb = (L: number, a: number, b: number) => {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const f = (t: number) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  // D50 white, then Bradford to D65
  const X = 0.96422 * f(fx), Y = 1.0 * f(fy), Z = 0.82521 * f(fz);
  const x = 0.9555766 * X - 0.0230393 * Y + 0.0631636 * Z, y = -0.0282895 * X + 1.0099416 * Y + 0.0210077 * Z, z = 0.0122982 * X - 0.020483 * Y + 1.3299098 * Z;
  return linToSrgb(...(xyzToLin(x, y, z) as [number, number, number]));
};
const num = (s: string) => (s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s));
const toRgb = (v: string): number[] | null => {
  let m = v.match(/^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/);
  if (m) return [Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3]), m[4] === undefined ? 1 : +m[4]];
  m = v.match(/^oklch\(([\d.%]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.%]+))?\)$/);
  if (m) { const L = num(m[1]), C = +m[2], h = (+m[3] * Math.PI) / 180; return [...oklabToSrgb(L, C * Math.cos(h), C * Math.sin(h)), m[4] ? num(m[4]) : 1]; }
  m = v.match(/^oklab\(([\d.%]+) (-?[\d.]+) (-?[\d.]+)(?: \/ ([\d.%]+))?\)$/);
  if (m) return [...oklabToSrgb(num(m[1]), +m[2], +m[3]), m[4] ? num(m[4]) : 1];
  m = v.match(/^lab\(([\d.]+)%? (-?[\d.]+) (-?[\d.]+)(?: \/ ([\d.%]+))?\)$/);
  if (m) return [...labToSrgb(+m[1], +m[2], +m[3]), m[4] ? num(m[4]) : 1];
  return null;
};
const normColors = (s: string) => s.replace(/(rgba?|oklch|oklab|lab)\([^()]*\)/g, (c) => { const t = toRgb(c); return t ? `rgb(${t[0]},${t[1]},${t[2]}${t[3] < 1 ? `,${t[3].toFixed(2)}` : ""})` : c; });
const norm = (p: string, v: string) => {
  let s = normColors((v ?? "").trim().replace(/\s+/g, " "));
  if (p === "transition-property" && s === "all") s = "all";
  // colors: rgb(a) with identical channels; drop trailing zeros
  s = s.replace(/(\d+\.\d*?)0+(?=px|,|\)|\s|$)/g, "$1").replace(/\.(?=px|,|\)|\s|$)/g, "");
  if (p === "box-shadow") { const parts = s.split(/,(?![^(]*\))/).map((x) => x.trim()).filter((x) => !/^rgb\(0,0,0(,0(\.00)?)?\) 0px 0px 0px 0px$/.test(x)); s = parts.length ? parts.join(", ") : "none"; }
  return s;
};

/**
 * Differences the runbook accepts, with the reason. Each rule is exact: it names the property and
 * the pair of values, so a real defect on the same property is never absorbed. Anything not matched
 * here stays hard. Keeping this in the tool rather than in a reader's head means the classification
 * is the same on every run, by every agent, and the count is trustworthy without re-sifting by hand.
 */
const ACCEPTED: { why: string; test: (part: string, prop: string, geist: string, ours: string) => boolean }[] = [
  {
    // The book's icon: the reference passes an <img> logo pair, ours an inline <svg>, and these four
    // properties are what separates the two element types rather than anything either book styles.
    // Verified 2026-09-10 against bare elements in the browser: `overflow` clip-vs-hidden is the UA
    // default for img against svg. `color: transparent` and `max-width: 100%` are their page's own
    // image handling (hiding a logo's alt text, and a Tailwind image reset). `flex-shrink: 0` is
    // OUR docs page: its example writes class="ic" on the icon it passes in, and tokens.css carries
    // `.ic { flex: none }`. Demo markup on both sides, like the badge case. Every geometry reading
    // on this page matches exactly — 162 of 162 — so the books themselves agree.
    why: "book icon element type: theirs is an <img> logo, ours an inline <svg>; these four are UA defaults and each page's own demo styling, not the element",
    test: (part, prop, gv, ov) =>
      part === "icon" &&
      // An SVG element returns an empty string from getComputedStyle for a layout property it does
      // not apply, where their <img> returns a real value. Root 10's icon is our slotted
      // illustration in a `simple` book, hidden with zero height on both sides, so all 38 of its
      // properties read this way.
      // In DARK their custom icon is a light/dark IMAGE PAIR: the light file is display:none and
      // querySelector returns it, so the census reads a 0x0 hidden twin while the visible dark file
      // reads 16x16 exactly like ours. No selector fixes that in both themes at once, because the
      // hidden twin swaps sides. Verified in the browser, both themes.
      (gv === "none" && ov === "block") ||
        (prop === "height" && gv === "auto" && ov === "16px") ||
        (prop === "__rect" && String(gv) === "0,0" && /^1[56],1[67]$/.test(String(ov))) ||
      // Its rect follows: a box with no layout reports 0x0 on ours, 156x0 on theirs. Zero height on
      // both sides, so neither renders anything.
      ((prop === "__rect" && /^\d+,[01]$/.test(String(gv)) && String(ov) === "0,0") ||
        (ov === "" && gv !== "") ||
        (prop === "overflow" && gv === "clip" && ov === "hidden") ||
        (prop === "color" && /^rgba?\(0, ?0, ?0, ?0\)$/.test(gv)) ||
        (prop === "max-width" && gv === "100%" && ov === "none") ||
        (prop === "flex-shrink" && gv === "1" && ov === "0")),
  },
  {
    // Accepted by Peter 2026-09-10 rather than fixed. The reference has exactly one elementChild
    // example and it is size="small", so the generator has no evidence that an element-child
    // button's radius follows its size, and emits `.el { border-radius: .375rem }` with no `:not(.lg)`
    // guard — which then beats `.lg`'s 8px on a large split button's trigger. Reading the wider spec
    // by height shows 3 large element-child buttons at 8px and none at 6px, so the fact is real and
    // the spec cannot express it. Full write-up: notes/analysis/element-child-radius.md.
    why: "element-child radius at large: the reference's one elementChild example is small, so the generator's .el group carries no size guard (notes/analysis/element-child-radius.md)",
    test: (part, prop, gv, ov) => part === "trigger" && prop === "border-radius" && gv === "0px 8px 8px 0px" && ov === "0px 6px 6px 0px",
  },
  {
    // Verified on the live page and in the mirror snapshot: every svg icon in the reference's badge
    // demos carries class="relative" in the DEMO MARKUP, and their 6 image icons do not, which is
    // why 51 of 57 read relative. Their badge's own utilities set display, flex-shrink and an
    // identity transform on a slotted icon — never position — and ours reproduces all three. The
    // captured spec has zero icons carrying the class, so their demo markup changed after it was
    // taken. This is the reference's page styling its own demo content, like the my-4 case.
    why: "slotted icon position: the reference's badge demos author class=\"relative\" on the icon they pass in; neither badge sets position",
    test: (part, prop, gv, ov) => part === "icon" && prop === "position" && gv === "relative" && ov === "static",
  },
  {
    why: "wrapper-box context: our root is a flex item of the wrapper, theirs a block child; auto resolves like 0 in a column's cross axis",
    test: (_part, prop, gv, ov) => prop === "min-width" && ((gv === "auto" && ov === "0px") || (gv === "0px" && ov === "auto")),
  },
  {
    why: "blockified display: a flex item blockifies, so inline-flex reads flex and inline-block reads block",
    test: (_part, prop, gv, ov) =>
      prop === "display" &&
      [
        ["inline-flex", "flex"],
        ["flex", "inline-flex"],
        ["inline-block", "block"],
        ["block", "inline-block"],
      ].some(([a, b]) => gv === a && ov === b),
  },
  {
    why: "top layer: the containing block is the viewport, so a floating box must be fixed where the reference popper is absolute",
    test: (_part, prop, gv, ov) => prop === "position" && gv === "absolute" && ov === "fixed",
  },
];
const acceptedFor = (part: string, prop: string, gv: string, ov: string) => ACCEPTED.find((a) => a.test(part, prop, gv, ov));

let hard = 0;
let soft = 0;
let accepted = 0;
const acceptedWhy = new Map<string, number>();
const lines: string[] = [];
const n = Math.min(g.roots.length, o.roots.length);
if (g.roots.length !== o.roots.length) lines.push(`root count differs: geist ${g.roots.length}, ours ${o.roots.length}`);
for (let i = 0; i < n; i++) {
  const a = g.roots[i];
  const b = o.roots[i];
  const head = `#${i} (geist ex${a.example}.${a.index} <${a.tag}> | ours ex${b.example}.${b.index} <${b.tag}>)`;
  const diffs: string[] = [];
  for (const state of Object.keys(a.states)) {
    const sa = a.states[state];
    const sb = b.states[state] ?? {};
    for (const part of Object.keys(sa)) {
      const pa = sa[part];
      const pb = sb[part];
      if (!pb) {
        diffs.push(`  [${state}] ${part}: missing on ours`);
        hard++;
        continue;
      }
      // A centred text part's auto margins absorb its text width (the census fixes one container width on both
      // sides): a margin pair whose sum changes by what the width changes keeps the outer width, so it is the font's.
      const px = (v: unknown) => parseFloat(String(v));
      const outer = (p: Record<string, string>) => px(p["margin-left"]) + px(p["margin-right"]) + px(p.width);
      const centred = TEXT_PARTS.has(part) && Math.abs(outer(pa) - outer(pb)) < 0.5;
      for (const prop of Object.keys(pa)) {
        const va = norm(prop, String(pa[prop]));
        const vb = norm(prop, String(pb[prop]));
        if (va === vb) continue;
        if (softFor(part, prop) || (centred && (prop === "margin-left" || prop === "margin-right"))) {
          soft++;
          diffs.push(`  [${state}] ${part}.${prop}: ${va} | ${vb}   (soft)`);
        } else {
          const ok = acceptedFor(part, prop, va, vb);
          if (ok) {
            accepted++;
            acceptedWhy.set(ok.why, (acceptedWhy.get(ok.why) ?? 0) + 1);
            diffs.push(`  [${state}] ${part}.${prop}: ${va} | ${vb}   (accepted)`);
          } else {
            hard++;
            diffs.push(`  [${state}] ${part}.${prop}: geist ${va} | ours ${vb}`);
          }
        }
      }
    }
  }
  if (diffs.length) lines.push(head, ...diffs);
}
console.log(lines.join("\n"));
console.log(`\n${page}: ${n} roots compared, ${hard} hard, ${accepted} accepted, ${soft} soft (font-driven)`);
for (const [why, count] of [...acceptedWhy].sort((a, b) => b[1] - a[1])) console.log(`  accepted x${count}: ${why}`);
// Zero roots compared is never a pass: it reads as clean while measuring nothing. The usual cause is a
// selector in the config that matches nothing on one side. Fail loudly rather than report success.
if (n === 0) {
  console.log(`\n${page}: NOT A PASS — 0 roots were compared. Nothing was measured. Fix the selectors in census/${page.replace(/\.dark$/, "")}.config.json.`);
  process.exit(2);
}
// A root-count mismatch makes every later comparison meaningless, because roots pair by order.
if (g.roots.length !== o.roots.length) {
  console.log(`\n${page}: NOT A PASS — root counts differ (geist ${g.roots.length}, ours ${o.roots.length}). Roots pair by order, so every difference above is suspect.`);
  process.exit(2);
}
process.exit(hard ? 1 : 0);
