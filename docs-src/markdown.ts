// One docs page as Markdown: the sections, every example's markup and each element's API.
// Serves two readers: the `.md` twin of every page on the docs site (append .md to a URL) and
// the skill's element reference.
import type { ElementApi } from "./api";
import { formatHtml } from "./format";
import type { Doc } from "./site";

const strip = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Sections written as raw HTML (foundations pages) become headings plus their text, one row per line. */
const bodyToMarkdown = (body: string) => {
  const out: string[] = [];
  for (const m of body.matchAll(/<div class="doc-sec"[^>]*><h2>(.*?)<a [\s\S]*?<\/h2>([\s\S]*?)<\/div><\/div>/g)) {
    out.push(`## ${strip(m[1])}`, "");
    const rows = m[2]
      .replace(/<pre[\s\S]*?<\/pre>/g, " ")
      .replace(/<\/(td|th|b|small)>/g, (t) => `${t} · `)
      .replace(/<\/(p|tr|li|div)>/g, (t) => `${t}\n`)
      .split("\n")
      .map((l) =>
        strip(l)
          .replace(/(\s*·\s*)+$/g, "")
          .replace(/\s*·\s*/g, " · "),
      )
      .filter(Boolean);
    if (rows.length) out.push(...rows, "");
  }
  return out;
};

export function docToMarkdown(d: Doc, api: Map<string, ElementApi>, opts: { level?: number } = {}): string[] {
  const h = "#".repeat(opts.level ?? 1);
  const lines: string[] = [`${h} ${d.title}`, "", `${strip(d.lede)}${d.house ? " House component; Geist has no page for it." : ""}`, ""];
  for (const e of d.examples) {
    lines.push(`${h}# ${e.h}`, "");
    if (e.p) lines.push(strip(e.p), "");
    lines.push("```html", formatHtml((e.code ?? e.html) + (e.script ? `\n<script>\n${e.script.trim()}\n</script>` : "")), "```", "");
  }
  if (d.body) lines.push(...bodyToMarkdown(d.body));
  for (const t of d.tags ?? []) {
    const el = api.get(t);
    if (!el) continue;
    lines.push(`${h}# \`<${t}>\``, "");
    if (el.doc) lines.push(el.doc, "");
    if (el.props.length) {
      lines.push("| Attribute | Property | Type | Default | Description |", "|---|---|---|---|---|");
      for (const p of el.props)
        lines.push(
          `| ${p.attribute === false ? "—" : `\`${p.attribute}\``} | \`${p.name}\` | \`${p.type.replace(/\|/g, "\\|")}\` | ${p.default ? `\`${p.default.replace(/\|/g, "\\|")}\`` : "—"} | ${p.doc.replace(/\|/g, "\\|")} |`,
        );
      lines.push("");
    }
    if (el.slots.length) lines.push(`Slots: ${el.slots.map((s) => `\`${s}\``).join(", ")}`, "");
    if (el.events.length) lines.push(`Events: ${el.events.map((s) => `\`${s}\``).join(", ")}`, "");
  }
  if (d.practices) {
    lines.push(`${h}# Best Practices`, "");
    for (const [k, v] of Object.entries(d.practices)) {
      if (k !== "Best Practices") lines.push(`**${k}**`, "");
      lines.push(...v.map((x) => `- ${strip(x)}`), "");
    }
  }
  return lines;
}
