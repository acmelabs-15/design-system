/// <reference types="bun" />
// Reads every element's public API from its TypeScript source with the TS compiler API:
// tag, class, reactive properties (name, attribute, type, default, doc comment), slots
// and the acme-* events it dispatches. The docs site renders these as the API tables.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export type Prop = { name: string; attribute: string | false; type: string; default: string; doc: string };
export type ElementApi = { tag: string; className: string; file: string; doc: string; props: Prop[]; slots: string[]; events: string[]; parts: string[] };

const ROOT = path.resolve(import.meta.dir, "..");
const C = path.join(ROOT, "src/components");

const jsdoc = (n: ts.Node): string => {
  const j = (n as { jsDoc?: ts.JSDoc[] }).jsDoc;
  return j?.length ? String(j[j.length - 1].comment ?? "").trim() : "";
};

export function readApi(): ElementApi[] {
  const out: ElementApi[] = [];
  for (const d of fs.readdirSync(C).sort()) {
    const file = path.join(C, d, `${d}.ts`);
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
    for (const st of sf.statements) {
      if (!ts.isClassDeclaration(st)) continue;
      const deco = ts.getDecorators(st)?.find((x) => x.expression.getText().startsWith("customElement"));
      if (!deco) continue;
      const tag = (deco.expression as ts.CallExpression).arguments[0].getText().replace(/["']/g, "");
      const props: Prop[] = [];
      for (const m of st.members) {
        if (!ts.isPropertyDeclaration(m)) continue;
        const pd = ts.getDecorators(m)?.find((x) => /^property\b/.test(x.expression.getText()));
        if (!pd) continue;
        const opts = (pd.expression as ts.CallExpression).arguments[0]?.getText() ?? "";
        const attrM = opts.match(/attribute:\s*(false|"([^"]+)")/);
        const attribute = attrM
          ? attrM[1] === "false"
            ? false
            : attrM[2]
          : m.name
              .getText()
              .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
              .toLowerCase();
        const type = m.type
          ? m.type.getText()
          : opts.includes("Boolean")
            ? "boolean"
            : opts.includes("Number")
              ? "number"
              : m.initializer
                ? ts.isNumericLiteral(m.initializer)
                  ? "number"
                  : m.initializer.kind === ts.SyntaxKind.TrueKeyword || m.initializer.kind === ts.SyntaxKind.FalseKeyword
                    ? "boolean"
                    : ts.isStringLiteral(m.initializer)
                      ? "string"
                      : ""
                : "string";
        props.push({ name: m.name.getText(), attribute, type, default: m.initializer?.getText() ?? "", doc: jsdoc(m) });
      }
      const body = src.slice(st.getStart(), st.getEnd());
      const slots = Array.from(new Set(Array.from(body.matchAll(/<slot(?:\s+name="([^"]+)")?/g)).map((m) => m[1] ?? "(default)")));
      const events = Array.from(new Set(Array.from(body.matchAll(/new CustomEvent\("([^"]+)"/g)).map((m) => m[1])));
      const parts = Array.from(new Set(Array.from(body.matchAll(/\bpart="([^"]+)"/g)).map((m) => m[1])));
      out.push({ tag, className: st.name!.getText(), file: path.relative(ROOT, file), doc: jsdoc(st), props, slots, events, parts });
    }
  }
  return out;
}

if (import.meta.main) {
  for (const e of readApi()) {
    console.log(`<${e.tag}>  ${e.doc}`);
    for (const p of e.props)
      console.log(
        `  ${p.attribute === false ? `.${p.name}` : p.attribute}${p.attribute !== false && p.attribute !== p.name ? ` (.${p.name})` : ""}: ${p.type}${p.default ? ` = ${p.default}` : ""}${p.doc ? `  — ${p.doc}` : ""}`,
      );
    if (e.slots.length) console.log(`  slots: ${e.slots.join(", ")}`);
    if (e.events.length) console.log(`  events: ${e.events.join(", ")}`);
  }
}
