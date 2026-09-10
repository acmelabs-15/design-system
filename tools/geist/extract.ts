// Geist spec extractor. For one page: the server-rendered example DOM (every node with its
// role, ARIA, data attributes and text) with every Tailwind class resolved to the declarations
// the site's CSS gives it, grouped by the selector suffix (state) and at-rule it applies under.
// Output: spec/<page>.json. Run: bun extract.ts <page> | bun extract.ts all
import fs from "node:fs";
import path from "node:path";
import { Window } from "happy-dom";
import { settleStreamed } from "./stream";
import { resolve } from "./tw";

const DIR = import.meta.dir;
const OUT = path.join(DIR, "spec");
fs.mkdirSync(OUT, { recursive: true });

type StyleRule = { cls: string; state: string; at: string; decl: string };
type Node = { tag: string; attrs: Record<string, string>; text?: string; styles: StyleRule[]; unresolved: string[]; children: Node[] };
type Example = { heading: string; description: string; code: string; dom: Node[] };
type Spec = { page: string; title: string; lede: string; primitives: string[]; examples: Example[] };

/** Splits a class attribute into classes, keeping spaces inside [...] and (...) arbitrary values. */
function splitClasses(s: string): string[] {
  const out: string[] = [];
  let cur = "";
  let depth = 0;
  for (const ch of s.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<")) {
    if (ch === "[" || ch === "(") depth++;
    if (ch === "]" || ch === ")") depth--;
    if (/\s/.test(ch) && depth <= 0) {
      if (cur) out.push(cur);
      cur = "";
      depth = 0;
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

const escapeForSel = (c: string) => c.replace(/([^A-Za-z0-9_-])/g, "\\$1");

/** Resolves one class to its rules; the state is the selector text after the class token. */
function stylesFor(cls: string): StyleRule[] {
  const rs = resolve(cls);
  const esc = `.${escapeForSel(cls)}`;
  return rs.map((r) => {
    const idx = r.sel.indexOf(esc);
    const state = idx >= 0 ? r.sel.slice(idx + esc.length).trim() : r.sel;
    return { cls, state, at: r.at, decl: r.decl };
  });
}

const KEEP_ATTRS = /^(role|type|tabindex|disabled|aria-.*|data-.*|href|target|rel|for|id|name|value|placeholder|checked|readonly|required|min|max|step|open|hidden|style|src|alt|title|autocomplete|inputmode|dir)$/;
function walk(el: Element, depth = 0): Node {
  const attrs: Record<string, string> = {};
  for (const a of Array.from(el.attributes)) if (KEEP_ATTRS.test(a.name)) attrs[a.name] = a.name === "id" || a.name.startsWith("aria-") && /radix/.test(a.value) ? a.value.replace(/radix-[A-Za-z0-9_]+/g, "radix-*") : a.value;
  const classes = splitClasses(el.getAttribute("class") ?? "");
  const styles = classes.flatMap(stylesFor);
  const unresolved = classes.filter((c) => resolve(c).length === 0);
  const children = Array.from(el.children).map((c) => walk(c, depth + 1));
  const own = Array.from(el.childNodes)
    .filter((n) => n.nodeType === 3)
    .map((n) => (n.textContent ?? "").trim())
    .filter(Boolean)
    .join(" ");
  const node: Node = { tag: el.tagName.toLowerCase(), attrs, styles, unresolved, children };
  if (own) node.text = own;
  return node;
}

export function extract(page: string): Spec {
  // A streamed boundary's content is put where it renders (see stream.ts) before the DOM is read.
  const html = settleStreamed(fs.readFileSync(path.join(DIR, "corpus/html", `${page}.html`), "utf8"));
  const md = fs.existsSync(path.join(DIR, "corpus/md", `${page}.md`)) ? fs.readFileSync(path.join(DIR, "corpus/md", `${page}.md`), "utf8") : "";
  const w = new Window();
  const doc = w.document;
  doc.write(html);
  const main = doc.querySelector("main") ?? doc.body;
  const title = main.querySelector("h1")?.textContent?.trim() ?? page;
  const lede = main.querySelector("h1 + p, h1 ~ p")?.textContent?.trim() ?? "";
  const primitives = Array.from(new Set([...html.matchAll(/data-(radix|react-aria|cmdk|geist|sonner|vaul|headlessui)[a-z-]*/g)].map((m) => m[0]))).sort();
  // A showcase ends with the "Show code" bar: a radix collapsible trigger inside a rounded-b bar.
  const bars = Array.from(main.querySelectorAll('button[aria-controls^="radix-"][data-state]')).map((b) => b.closest("div.bg-background-200")).filter(Boolean) as Element[];
  const codes = Array.from(md.matchAll(/^## (.+)\n([\s\S]*?)```tsx\n([\s\S]*?)```/gm)).map((m) => ({ heading: m[1].trim(), description: m[2].replace(/\s+/g, " ").trim(), code: m[3] }));
  const examples: Example[] = [];
  for (const bar of bars) {
    const preview = bar.previousElementSibling;
    if (!preview) continue;
    // Nearest preceding h2 in document order.
    let h: Element | null = bar.closest("section, div")?.parentElement ?? null;
    let heading = "";
    let node: Element | null = bar.parentElement;
    while (node && !heading) {
      let sib: Element | null = node.previousElementSibling;
      while (sib) {
        const h2 = sib.tagName === "H2" ? sib : sib.querySelector("h2:last-of-type");
        if (h2) {
          heading = h2.textContent?.trim() ?? "";
          break;
        }
        sib = sib.previousElementSibling;
      }
      node = node.parentElement;
    }
    h = null;
    const code = codes[examples.length];
    examples.push({ heading: heading || code?.heading || `example ${examples.length + 1}`, description: code?.description ?? "", code: code?.code ?? "", dom: Array.from(preview.children).map((c) => walk(c)) });
  }
  return { page, title, lede, primitives, examples };
}

if (import.meta.main && process.argv[2] !== "synth") {
  const arg = process.argv[2] ?? "button";
  const pages = arg === "all" ? fs.readdirSync(path.join(DIR, "corpus/html")).map((f) => f.replace(/\.html$/, "")) : [arg];
  for (const p of pages) {
    const spec = extract(p);
    fs.writeFileSync(path.join(OUT, `${p}.json`), JSON.stringify(spec, null, 1));
    const nodes = (ns: Node[]): number => ns.reduce((n, x) => n + 1 + nodes(x.children), 0);
    const un = new Set<string>();
    const collect = (ns: Node[]) => {
      for (const n of ns) {
        for (const u of n.unresolved) un.add(u);
        collect(n.children);
      }
    };
    for (const e of spec.examples) collect(e.dom);
    console.log(`${p}: ${spec.examples.length} examples, ${spec.examples.reduce((n, e) => n + nodes(e.dom), 0)} nodes, primitives ${spec.primitives.join(",") || "-"}, unresolved ${[...un].join(" ") || "-"}`);
  }
}

/**
 * A sketch is a DOM tree written by hand from a client-rendered state the server HTML lacks (an
 * open menu, a tooltip, a toast): each node carries its tag, class string, attributes, text and
 * children. It becomes a spec example with the same resolved styles as an extracted one.
 * Run: bun extract.ts synth <page> <sketch.json>   (sketch: { heading, code, dom: [Sketch] })
 */
export type Sketch = { tag: string; class?: string; attrs?: Record<string, string>; text?: string; children?: Sketch[] };
export function fromSketch(s: Sketch): Node {
  const classes = splitClasses(s.class ?? "");
  const node: Node = { tag: s.tag, attrs: s.attrs ?? {}, styles: classes.flatMap(stylesFor), unresolved: classes.filter((c) => resolve(c).length === 0), children: (s.children ?? []).map(fromSketch) };
  if (s.text) node.text = s.text;
  return node;
}
if (import.meta.main && process.argv[2] === "synth") {
  const [page, file] = process.argv.slice(3);
  const sketch = JSON.parse(fs.readFileSync(file, "utf8")) as { heading: string; code: string; description?: string; dom: Sketch[] };
  const specFile = path.join(OUT, `${page}.json`);
  const spec = JSON.parse(fs.readFileSync(specFile, "utf8")) as Spec;
  const example: Example = { heading: sketch.heading, description: sketch.description ?? "", code: sketch.code, dom: sketch.dom.map(fromSketch) };
  const i = spec.examples.findIndex((e) => e.heading === example.heading);
  if (i >= 0) spec.examples[i] = example;
  else spec.examples.push(example);
  fs.writeFileSync(specFile, JSON.stringify(spec, null, 1));
  console.log(`${page}: example "${example.heading}" ${i >= 0 ? "replaced" : "added"} (${spec.examples.length} examples)`);
}
