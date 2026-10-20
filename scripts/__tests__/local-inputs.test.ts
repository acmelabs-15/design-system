import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { localInputs } from "../local-inputs";
import { verifyStyleManifest, writeStyle } from "../styles";

test("map fingerprints include imported helpers, re-exports and literal dynamic imports once", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-inputs-"));
  try {
    fs.writeFileSync(
      path.join(root, "map.ts"),
      'import { CLOSED } from "./helper"; import fs from "node:fs"; import external from "not-installed"; export const map={skip:CLOSED}; export { other } from "./reexport"; import("./lazy"); import("./" + name);',
    );
    fs.writeFileSync(path.join(root, "helper.ts"), 'import "./map"; export const CLOSED="old";');
    fs.writeFileSync(path.join(root, "reexport.ts"), 'export { CLOSED as other } from "./helper";');
    fs.writeFileSync(path.join(root, "lazy.ts"), 'import values from "./values.json"; export default values;');
    fs.writeFileSync(path.join(root, "values.json"), '{"name":"test"}');
    const inputs = localInputs(root, ["map.ts", "values.json"]);
    expect(inputs).toEqual(["helper.ts", "lazy.ts", "map.ts", "reexport.ts", "values.json"]);
    const fingerprint = () => Object.fromEntries(inputs.map((file) => [file, Bun.hash(fs.readFileSync(path.join(root, file))).toString()]));
    const before = fingerprint();
    fs.writeFileSync(path.join(root, "helper.ts"), 'import "./map"; export const CLOSED="new";');
    expect(fingerprint()["helper.ts"]).not.toBe(before["helper.ts"]);
    expect(fingerprint()["map.ts"]).toBe(before["map.ts"]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("missing local imports fail instead of producing an incomplete fingerprint", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-inputs-missing-"));
  try {
    fs.writeFileSync(path.join(root, "map.ts"), 'import "./missing";');
    expect(() => localInputs(root, ["map.ts"])).toThrow("./missing");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("a generated map becomes stale when only its imported helper changes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-map-stale-"));
  try {
    for (const input of ["scripts/styles.ts", "scripts/theme-tokens.ts", "src/shared/theme-tokens.ts", "src/shared/numeric-tokens.ts", "src/shared/motion-tokens.ts"]) {
      fs.mkdirSync(path.dirname(path.join(root, input)), { recursive: true });
      fs.copyFileSync(path.resolve(import.meta.dir, "../..", input), path.join(root, input));
    }
    fs.writeFileSync(path.join(root, "map.ts"), 'import { color } from "./helper"; export const map={color};');
    fs.writeFileSync(path.join(root, "helper.ts"), 'export const color="red";');
    writeStyle("components/probe/probe", ".probe{color:red}", { root, producer: "mapped", inputs: localInputs(root, ["map.ts"]) });
    expect(() => verifyStyleManifest(root)).not.toThrow();
    fs.writeFileSync(path.join(root, "helper.ts"), 'export const color="blue";');
    expect(() => verifyStyleManifest(root)).toThrow("helper.ts");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
