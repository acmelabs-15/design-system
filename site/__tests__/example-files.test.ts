import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { exampleFiles } from "../example-files";

test("copy includes transitive files, cycles once and rejects missing dependencies", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-example-files-"));
  fs.mkdirSync(path.join(root, "examples"));
  const write = (name: string, text: string) => fs.writeFileSync(path.join(root, "examples", name), text);
  try {
    write("entry.ts", 'import "./view"; import "lit";');
    write("view.ts", 'export { value } from "./data.js";');
    write("data.ts", 'import "./entry"; export const value = 1;');
    expect(exampleFiles(["examples/entry.ts"], root)).toEqual(["examples/entry.ts", "examples/view.ts", "examples/data.ts"]);
    write("data.ts", 'import "./missing";');
    expect(() => exampleFiles(["examples/entry.ts"], root)).toThrow("Missing example dependency");
  } finally { fs.rmSync(root, {recursive:true, force:true}); }
});
