// Reconstructs a census configuration from a saved result, for a page whose config was never written.
//
// The result echoes back the fields the run was given — the side, the page, the url, the textParts and
// textProps, the states it read, and the parts of every root. That is most of a config, and it is
// evidence rather than a guess: it is what the working run actually did.
//
// What it cannot recover is the selector each side used, because the result stores the readings rather
// than the selectors. Those are printed as TODO from the map, the same way `config.ts` does. The point
// is to stop a reconstruction inventing a state list or a text-part list that the working run never had:
// getting those wrong changes what is compared and quietly produces a different number.
import fs from "node:fs";
import path from "node:path";

const DIR = import.meta.dir;
const CENSUS = path.join(DIR, "census");

type Result = {
  side: string;
  page: string;
  theme?: string;
  url?: string;
  textParts?: string[];
  textProps?: Record<string, string[]>;
  roots: { example?: number; index?: number; states: Record<string, Record<string, unknown>> }[];
};

const read = (page: string, side: string): Result | null => {
  const f = path.join(CENSUS, `${page}.${side}.json`);
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")) as Result) : null;
};

/** What a saved run tells us about the configuration it was given. */
export function fromResult(page: string) {
  const g = read(page, "geist");
  const o = read(page, "ours");
  if (!g || !o) return null;
  const parts = Object.keys(g.roots[0]?.states?.base ?? {}).filter((p) => p !== "root");
  return {
    page,
    urls: { geist: g.url, ours: o.url },
    roots: { geist: g.roots.length, ours: o.roots.length },
    examples: [...new Set(g.roots.map((r) => r.example))].sort((a, b) => Number(a) - Number(b)),
    states: Object.keys(g.roots[0]?.states ?? {}),
    parts,
    textParts: g.textParts ?? [],
    textProps: g.textProps ?? {},
  };
}

if (import.meta.main) {
  const page = process.argv[2];
  if (!page) {
    // Every page with results but no config: the reconstruction backlog.
    const results = new Set(
      fs
        .readdirSync(CENSUS)
        .filter((f) => f.endsWith(".geist.json") && !f.includes(".dark."))
        .map((f) => f.replace(".geist.json", "")),
    );
    const configs = new Set<string>();
    for (const f of fs.readdirSync(CENSUS).filter((x) => x.endsWith(".config.json"))) {
      for (const m of fs.readFileSync(path.join(CENSUS, f), "utf8").matchAll(/"page"\s*:\s*"([^"]+)"/g)) configs.add(m[1]);
    }
    const missing = [...results].filter((p) => !configs.has(p)).sort();
    console.log(`${results.size} measured pages, ${missing.length} with no config naming them:\n`);
    console.log(missing.join(" "));
    console.log("\nInspect one:  bun tools/geist/reconstruct.ts <page>");
    process.exit(0);
  }
  const info = fromResult(page);
  if (!info) {
    console.log(`no saved result for ${page}`);
    process.exit(1);
  }
  console.log(JSON.stringify(info, null, 1));
  console.log("\n// The run's own record. Selectors are NOT here — the result stores readings, not");
  console.log("// selectors — so take those from the map with `bun tools/geist/config.ts <name>`.");
  console.log("// Everything above is what the working run was actually given: match it, do not invent it.");
}
