// Loads every component docs page in this directory: one file per page, each exporting `doc`.
// Geist pages mirror https://vercel.com/geist/<id>; house pages carry `house: true`.
import fs from "node:fs";
import path from "node:path";
import type { Doc } from "../../site";

export async function loadDocs(): Promise<Doc[]> {
  const docs: Doc[] = [];
  for (const f of fs.readdirSync(import.meta.dir).sort()) {
    if (!f.endsWith(".ts") || f === "index.ts") continue;
    const m = (await import(path.join(import.meta.dir, f))) as { doc: Doc };
    if (!m.doc) throw new Error(`${f} exports no doc`);
    if (m.doc.id !== f.replace(/\.ts$/, "")) throw new Error(`${f}: id "${m.doc.id}" must equal the file name`);
    docs.push(m.doc);
  }
  return docs;
}
