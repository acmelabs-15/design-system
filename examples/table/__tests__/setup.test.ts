import { expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { tableWorkerDeclaration } from "../setup";

const installed = fs.readFileSync(path.resolve(import.meta.dir, "../../../node_modules/@tanstack/table-core/dist/worker/createTableWorker.d.ts"), "utf8");
const published = installed.replace("declare module '../index.js'", "declare module '../types/TableFeatures'").replace("declare module '../index.js'", "declare module '../types/TableState'");

test("Table worker setup changes only the two verified declaration module targets", () => {
  expect(tableWorkerDeclaration("9.2.4", published)).toBe(installed);
  expect(tableWorkerDeclaration("9.2.4", installed)).toBe(installed);
});

test("Table worker setup rejects another version or changed source before patching", () => {
  expect(() => tableWorkerDeclaration("9.2.5", published)).toThrow("9.2.4");
  expect(() => tableWorkerDeclaration("9.2.4", published + "\n")).toThrow("SHA-256");
});
