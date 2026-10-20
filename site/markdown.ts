import { bodyToMarkdown } from "./markdown-body";
// One docs page as Markdown: the sections, every example's markup and each element's API.
// Serves two readers: the `.md` twin of every page on the docs site (append .md to a URL) and
// the skill's element reference.
import { apiSections, type ElementApi } from "./api";
import { exampleId, exampleSources } from "./example-source";
import type { Doc } from "./site";

const strip = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export async function docToMarkdown(d: Doc, api: Map<string, ElementApi>, opts: { level?: number } = {}): Promise<string[]> {
  const h = "#".repeat(opts.level ?? 1);
  const lines: string[] = [`${h} ${d.title}`, "", strip(d.lede), ""];
  for (const e of d.examples) {
    if (e.census) {
      continue;
    }
    lines.push(`${h}# ${e.h}`, "");
    if (e.p) {
      lines.push(strip(e.p), "");
    }
    for (const source of await exampleSources(e, exampleId(d.id, e.h))) {
      const fence = "`".repeat(Math.max(3, ...[...source.code.matchAll(/`+/g)].map((match) => match[0].length + 1)));
      lines.push(`**${source.label}**`, "", fence + source.language, source.code, fence, "");
    }
  }
  if (d.body) {
    lines.push(...bodyToMarkdown(d.body));
  }
  if (d.md?.length) {
    lines.push(...d.md, "");
  }
  for (const t of d.tags ?? []) {
    const el = api.get(t);
    if (!el) {
      continue;
    }
    lines.push(`${h}# \`<${t}>\``, "");
    if (el.doc) {
      lines.push(el.doc, "");
    }
    lines.push(`Version: ${el.version}`, `Source: ${el.file}`, "");
    const cell = (value: string, code: boolean) => {
      const text = value.replace(/\r?\n/g, " ").replace(/\|/g, "\\|");
      if (!code) {
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      const fence = "`".repeat(Math.max(1, ...[...text.matchAll(/`+/g)].map((match) => match[0].length + 1)));
      return fence + " " + text + " " + fence;
    };
    for (const section of apiSections(el)) {
      lines.push(`${h}## ${section.heading}`, "", "| " + section.headings.join(" | ") + " |", "|" + section.headings.map(() => "---").join("|") + "|");
      for (const row of section.rows) {
        lines.push("| " + row.map((value, index) => cell(value, section.codeColumns.includes(index))).join(" | ") + " |");
      }
      lines.push("");
    }
  }
  if (d.practices) {
    lines.push(`${h}# Best Practices`, "");
    for (const [k, v] of Object.entries(d.practices)) {
      if (k !== "Best Practices") {
        lines.push(`**${k}**`, "");
      }
      lines.push(...v.map((x) => `- ${strip(x)}`), "");
    }
  }
  return lines;
}
