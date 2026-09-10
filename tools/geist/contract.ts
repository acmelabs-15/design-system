// Extracts the reference's own written behaviour statements from the saved markdown pages, so a
// port can be checked against what the reference team said it should do — not only against what its
// computed styles measure. The census reads styles and is blind to behaviour: a control with perfect
// styles that does nothing measures clean. This is the other half of the proof.
//
// The extraction is deterministic. The judgement is not, and is deliberately left to a person:
// this tool sorts each statement by whether a test could assert it, and never decides whether our
// element satisfies it. Marking a statement satisfied is a reader's job, recorded in
// `contract/<page>.md` beside the checklist.
import fs from "node:fs";
import path from "node:path";

const DIR = import.meta.dir;
const mdDir = path.join(DIR, "corpus/md");

/** Headings whose bullets describe behaviour, not prose about when to reach for the component. */
const BEHAVIOUR_HEADINGS = /^(best practices|behavior|behaviour|accessibility|content|states?|keyboard)/i;

/**
 * A statement a test could assert names a platform observable: an ARIA attribute, a role, a key, a
 * focus move, an element type. One that only guides a designer does not.
 */
const OBSERVABLE = /\b(aria-[a-z]+|role=|<button>|<a>|<input>|tabindex|Enter|Space|Escape|Esc\b|Arrow(?:\s|Up|Down|Left|Right)|Tab\b|focus(?:able|ed)?|hidden|disabled|autocomplete|type=|id\b|announce[sd]?|screen reader)\b/i;
/** Wording that marks a statement as guidance about wording, tone or choice rather than behaviour. */
const GUIDANCE = /\b(don't|do not|never|avoid|prefer|title case|sentence case|copy|wording|reads?\b|use .{0,20}when|pick\b|switch to)\b/i;

export type Statement = { page: string; section: string; text: string; kind: "assert" | "review" | "guidance" };

/**
 * Every callback the reference's own examples wire up on a component of that page, with how many
 * examples wire it. This is the strongest deterministic behaviour signal available: a callback in
 * the reference's example is a capability that page demonstrates, so ours needs an equivalent — an
 * event, a property, or a documented reason it does not apply. The virtualized table's broken Show
 * More was exactly this shape: the reference wired an onClick that drove expansion, and our page had
 * no counterpart. The prose never mentioned it, so only the example code carries the signal.
 *
 * A callback is not proof of a defect. It says "look here", and a person decides.
 */
export function handlersFor(page: string): { name: string; count: number }[] {
  const file = path.join(mdDir, `${page}.md`);
  if (!fs.existsSync(file)) return [];
  const txt = fs.readFileSync(file, "utf8");
  const counts = new Map<string, number>();
  // A JSX prop whose name is on-something, and the state hooks that tell us the example holds state.
  for (const m of txt.matchAll(/\bon[A-Z][a-zA-Z]+(?==)/g)) counts.set(m[0], (counts.get(m[0]) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Whether the reference's examples for this page hold state, which implies an interactive demo. */
export const statefulExamples = (page: string): number => {
  const file = path.join(mdDir, `${page}.md`);
  if (!fs.existsSync(file)) return 0;
  return [...fs.readFileSync(file, "utf8").matchAll(/\buseState\b/g)].length;
};

/** Every behaviour statement on one reference page, classified. */
export function statementsFor(page: string): Statement[] {
  const file = path.join(mdDir, `${page}.md`);
  if (!fs.existsSync(file)) return [];
  const txt = fs.readFileSync(file, "utf8");
  const out: Statement[] = [];
  for (const chunk of txt.split(/\n#{2,}\s+/)) {
    const section = chunk.split("\n")[0].trim();
    if (!BEHAVIOUR_HEADINGS.test(section)) continue;
    for (const line of chunk.split("\n")) {
      const m = line.match(/^\s*[*-]\s+(.*)$/);
      if (!m) continue;
      const text = m[1].trim();
      if (text.length < 12) continue;
      const observable = OBSERVABLE.test(text);
      const guidance = GUIDANCE.test(text);
      const kind = observable && !guidance ? "assert" : observable ? "review" : "guidance";
      out.push({ page, section, text, kind });
    }
  }
  return out;
}

/** Every page that has behaviour statements. */
export const pages = () =>
  fs
    .readdirSync(mdDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter((p) => statementsFor(p).length > 0 || handlersFor(p).length > 0)
    .sort();

/** The checklist for one page, as Markdown a reader fills in. */
export function checklist(page: string): string {
  const all = statementsFor(page);
  const order: Statement["kind"][] = ["assert", "review", "guidance"];
  const label: Record<Statement["kind"], string> = {
    assert: "Assert in a test — names something a test can observe",
    review: "Read and judge — names an observable, but also carries guidance",
    guidance: "Guidance — read it, apply judgement, no test",
  };
  const head = [
    `# ${page}: behaviour contract`,
    "",
    "Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction",
    "is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you",
    "check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.",
    "",
  ];
  const body: string[] = [];
  const handlers = handlersFor(page);
  const stateful = statefulExamples(page);
  if (handlers.length || stateful) {
    body.push("## Capabilities the reference's own examples demonstrate", "");
    body.push("Each callback below is wired in an example on the reference page. Ours needs an equivalent —");
    body.push("an event, a property, or a written reason it does not apply. This is where a control wired to");
    body.push("nothing shows up, which prose alone does not catch.", "");
    if (stateful) body.push(`The reference's examples hold state ${stateful} time(s), so at least one demo here is interactive.`, "");
    for (const h of handlers) body.push(`- [ ] ${h.name} — wired in ${h.count} example${h.count > 1 ? "s" : ""}. Our equivalent: `);
    body.push("");
  }
  for (const kind of order) {
    const rows = all.filter((s) => s.kind === kind);
    if (!rows.length) continue;
    body.push(`## ${label[kind]}`, "");
    for (const r of rows) body.push(`- [ ] (${r.section}) ${r.text}`);
    body.push("");
  }
  return [...head, ...body].join("\n");
}

if (import.meta.main) {
  const arg = process.argv[2];
  if (arg === "--summary" || !arg) {
    const rows = pages().map((p) => {
      const s = statementsFor(p);
      return { p, assert: s.filter((x) => x.kind === "assert").length, review: s.filter((x) => x.kind === "review").length, guidance: s.filter((x) => x.kind === "guidance").length, handlers: handlersFor(p).length, total: s.length };
    });
    const tot = rows.reduce((a, r) => ({ assert: a.assert + r.assert, review: a.review + r.review, guidance: a.guidance + r.guidance, handlers: a.handlers + r.handlers, total: a.total + r.total }), { assert: 0, review: 0, guidance: 0, handlers: 0, total: 0 });
    console.log(`${rows.length} reference pages carry behaviour statements\n`);
    console.log("page                        assert  review  guidance  handlers  total");
    for (const r of rows.sort((a, b) => b.assert + b.handlers - (a.assert + a.handlers))) console.log(`${r.p.padEnd(28)}${String(r.assert).padStart(6)}${String(r.review).padStart(8)}${String(r.guidance).padStart(10)}${String(r.handlers).padStart(10)}${String(r.total).padStart(7)}`);
    console.log(`${"TOTAL".padEnd(28)}${String(tot.assert).padStart(6)}${String(tot.review).padStart(8)}${String(tot.guidance).padStart(10)}${String(tot.handlers).padStart(10)}${String(tot.total).padStart(7)}`);
    console.log("\nWrite a page's checklist:  bun tools/geist/contract.ts <page>");
    console.log("Write every checklist:     bun tools/geist/contract.ts --write");
  } else if (arg === "--write") {
    const dir = path.join(DIR, "contract");
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    for (const p of pages()) {
      const f = path.join(dir, `${p}.md`);
      // Never overwrite a checklist a reader has filled in.
      if (fs.existsSync(f)) continue;
      fs.writeFileSync(f, checklist(p));
      n++;
    }
    console.log(`wrote ${n} checklists to tools/geist/contract/ (existing files left alone)`);
  } else {
    console.log(checklist(arg));
  }
}
