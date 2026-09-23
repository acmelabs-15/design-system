import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { writeDateRuntime } from "../date-runtime";

test("the distributed date runtime works without the author's installed dependency", async () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "acme-date-runtime-"));
  try {
    await writeDateRuntime(path.resolve(import.meta.dir, "../.."), dist);
    const module = await import(path.join(dist, "shared/date.js"));
    expect(module.parseAbsolute("2026-09-22T00:30:00-00:30", "UTC").toDate().toISOString()).toBe("2026-09-22T01:00:00.000Z");
    expect(() => module.parseZonedDateTime("2026-09-00T12:00[UTC]")).toThrow();
    expect(fs.readFileSync(path.join(dist, "shared/date.js"), "utf8")).not.toMatch(/(?:from|import)\s*["']@internationalized\/date/);
    expect(JSON.parse(fs.readFileSync(path.join(dist, "licenses/date-runtime.json"), "utf8")).version).toBe("3.12.4");
    expect(fs.readFileSync(path.join(dist, "licenses/internationalized-date.txt"), "utf8")).toContain("Apache License");
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});
