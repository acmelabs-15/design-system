import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

test("accepted icon differences cannot hide a non-icon layout defect", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "acme-diff-scope-"));
  try {
    fs.mkdirSync(path.join(directory, "census"));
    fs.copyFileSync(path.resolve(import.meta.dir, "../diff.ts"), path.join(directory, "diff.ts"));
    const record = (part: string, height: string) => ({ roots: [{ example: 0, index: 0, tag: "div", attrs: {}, states: { default: { [part]: { height } } } }] });
    for (const [part, expected] of [
      ["icon", 0],
      ["frame", 1],
    ] as const) {
      fs.writeFileSync(path.join(directory, "census/probe.geist.json"), JSON.stringify(record(part, "auto")));
      fs.writeFileSync(path.join(directory, "census/probe.ours.json"), JSON.stringify(record(part, "16px")));
      const result = Bun.spawnSync([process.execPath, path.join(directory, "diff.ts"), "probe"], { stdout: "pipe", stderr: "pipe" });
      expect(result.exitCode).toBe(expected);
      expect(result.stdout.toString()).toContain(part === "icon" ? "0 hard, 1 accepted" : "1 hard, 0 accepted");
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
