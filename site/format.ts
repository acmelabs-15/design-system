// Pretty-prints an example's markup for the "Show code" panel: one element per line, two-space
// indent, an element whose content is only text stays on one line. Then highlights it with
// TanStack Highlight (html grammar) and returns the <pre> markup with line numbers.
import { createHighlighter } from "@tanstack/highlight/core";
import { html as htmlLang } from "@tanstack/highlight/languages/html";

const VOID = new Set(["br", "hr", "img", "input", "use", "path", "circle", "rect", "line", "meta", "link", "source", "track", "wbr", "col"]);
const highlighter = createHighlighter({ languages: [htmlLang], fallbackLanguage: "html" });

type Node = { type: "el"; tag: string; open: string; close: string; kids: Node[]; self: boolean } | { type: "text"; value: string };

function parse(src: string): Node[] {
  const root: Node[] = [];
  const stack: { node: Extract<Node, { type: "el" }>; kids: Node[] }[] = [];
  const re = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g;
  const push = (n: Node) => (stack.length ? stack[stack.length - 1].kids : root).push(n);
  for (const m of src.matchAll(re)) {
    const t = m[0];
    if (t.startsWith("<!--")) {
      push({ type: "text", value: t });
      continue;
    }
    if (t.startsWith("</")) {
      const tag = t.slice(2, -1).trim().toLowerCase();
      for (let i = stack.length - 1; i >= 0; i--)
        if (stack[i].node.tag === tag) {
          stack.length = i;
          break;
        }
      continue;
    }
    if (t.startsWith("<")) {
      const tag = (t.match(/^<([a-zA-Z][\w-]*)/) || [])[1].toLowerCase();
      const self = t.endsWith("/>") || VOID.has(tag);
      const node: Extract<Node, { type: "el" }> = { type: "el", tag, open: t, close: self ? "" : `</${tag}>`, kids: [], self };
      push(node);
      if (!self) stack.push({ node, kids: node.kids });
      continue;
    }
    const value = t.replace(/\s+/g, " ");
    if (value.trim() || (stack.length && stack[stack.length - 1].kids.length)) push({ type: "text", value });
  }
  return root;
}

function print(nodes: Node[], depth: number, out: string[]) {
  const pad = "  ".repeat(depth);
  for (const n of nodes) {
    if (n.type === "text") {
      const v = n.value.trim();
      if (v) out.push(pad + v);
      continue;
    }
    if (n.self || n.kids.length === 0) {
      out.push(pad + n.open + n.close);
      continue;
    }
    const inlineOnly = n.kids.every(
      (k) =>
        k.type === "text" ||
        (k.type === "el" && k.kids.length === 0 && (k.tag === "svg" || k.tag === "b" || k.tag === "i" || k.tag === "small" || k.tag === "code" || (k.tag === "span" && !k.open.includes("class")))),
    );
    const textOnly = n.kids.every((k) => k.type === "text");
    if (textOnly || (inlineOnly && flat(n).length < 90)) {
      out.push(pad + flat(n));
      continue;
    }
    out.push(pad + n.open);
    print(n.kids, depth + 1, out);
    out.push(pad + n.close);
  }
}

function flat(n: Node): string {
  if (n.type === "text") return n.value;
  return n.open + n.kids.map(flat).join("").replace(/\s+/g, " ").trim() + n.close;
}

export function formatHtml(src: string): string {
  const out: string[] = [];
  print(parse(src.trim()), 0, out);
  return out.join("\n");
}

export function highlightHtml(src: string): string {
  return highlighter.highlightToHtml(formatHtml(src), { lang: "html", lineNumbers: true });
}
