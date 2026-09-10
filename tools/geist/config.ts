// Derives the mechanical half of a census configuration from an element's map, and says plainly what
// a person still has to decide. The runbook requires a saved config per measured root so a run is
// repeatable; 67 of 125 roots have none, and reconstructing each by hand is slow and inconsistent.
//
// What is mechanical: the page label, the reference marker, our host and root selector, the part
// name, and the child selector pairs. All of that is in the map already.
//
// What is NOT mechanical, and is therefore left blank with a prompt rather than guessed:
//   - `prepare`  — the script that opens an overlay or sets a scroll position before reading.
//   - `viewport` — the size a root must be measured at, and why.
//   - `width`    — one outer width for every preview, so a container-decided value reads once.
//   - `textParts`/`textProps` — which parts are sized by their text, so the diff reads them as soft.
//   - `each`/hops — how to reach a repeated or composed root.
//
// Those five carry the measurement's meaning. A config that guesses them looks finished and measures
// the wrong thing, which is worse than no config: 25 of the 26 saved configs carry at least one, so
// they are the norm, not the exception. This tool refuses to invent them.
import fs from "node:fs";
import path from "node:path";
import type { ChildMap, GeistMap } from "./gen";

const DIR = import.meta.dir;

/** The `ours|theirs` selector pair for each mapped child, which is what the census `children` wants. */
function childPairs(children: ChildMap[] | undefined, into: Record<string, string> = {}): Record<string, string> {
  for (const c of children ?? []) {
    if (c.ours) {
      // The name is the child's own selector without its leading dot: the part name the diff prints.
      const name = c.ours.replace(/^\./, "").replace(/[^\w-]/g, "") || c.ours;
      // The reference side cannot be derived: `pick` is a predicate over the spec, not a selector.
      into[name] = `${c.ours}|TODO-reference-selector`;
    }
    childPairs(c.children, into);
  }
  return into;
}

export type Derived = { config: Record<string, unknown>; todo: string[] };

/** The mechanical skeleton for one element, plus the list of decisions a person owes it. */
export async function derive(name: string): Promise<Derived> {
  const mod = (await import(path.join(DIR, "maps", `${name}.ts`))) as { geist: GeistMap };
  const m = mod.geist;
  const marker = typeof m.root === "string" ? m.root : undefined;
  const children = childPairs(m.children);

  const geistSide: Record<string, unknown> = { side: "geist", page: m.page };
  if (marker) geistSide.marker = marker;
  else geistSide.marker = "TODO: the map picks the root with a predicate, so name the reference marker attribute here";
  if (Object.keys(children).length) geistSide.children = children;

  const oursSide: Record<string, unknown> = { side: "ours", page: m.page, host: `acme-${name}`, ours: m.ours };
  if (m.part) oursSide.part = m.part;
  if (Object.keys(children).length) oursSide.children = children;

  const todo: string[] = [];
  if (!marker) todo.push("marker: the map uses a predicate for the root, so the reference marker attribute must be named by hand");
  for (const [k, v] of Object.entries(children)) if (v.includes("TODO")) todo.push(`children.${k}: the reference-side selector (the map picks it with a predicate, not a selector)`);
  todo.push("prepare: the script that opens an overlay or sets a scroll position before reading, if this root needs one");
  todo.push("viewport: the size this root must be measured at, if not the default, and why");
  todo.push("width: one outer width for every preview, if a container decides any value here");
  todo.push("textParts / textProps: the parts whose size follows their text, so the diff reads them as soft");
  todo.push("each / hops: how to reach a repeated or composed root, if it is not a direct query");

  return { config: { geist: geistSide, ours: oursSide, themes: ["light", "dark"] }, todo };
}

if (import.meta.main) {
  const name = process.argv[2];
  if (!name) {
    // Which maps have no config naming their page.
    const cd = path.join(DIR, "census");
    const named = new Set<string>();
    for (const f of fs.readdirSync(cd).filter((x) => x.endsWith(".config.json"))) {
      for (const m of fs.readFileSync(path.join(cd, f), "utf8").matchAll(/"page"\s*:\s*"([^"]+)"/g)) named.add(m[1]);
    }
    const measured = new Set(
      fs
        .readdirSync(cd)
        .filter((x) => x.endsWith(".geist.json"))
        .map((x) => x.replace(/\.geist\.json$/, "").replace(/\.dark$/, "")),
    );
    const missing = [...measured].filter((p) => !named.has(p)).sort();
    console.log(`${measured.size} measured roots, ${[...measured].filter((p) => named.has(p)).length} named by a saved config, ${missing.length} with none:\n`);
    console.log(missing.join(" "));
    console.log("\nDerive one:  bun tools/geist/config.ts <map-name>");
    process.exit(0);
  }
  const { config, todo } = await derive(name);
  console.log(JSON.stringify(config, null, 1));
  console.log("\n// A person still owes this config:");
  for (const t of todo) console.log(`//   - ${t}`);
  console.log("//");
  console.log("// Read the element's spec and its docs page before filling these in. A guessed value");
  console.log("// measures the wrong thing while looking finished.");
}
