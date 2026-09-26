import { expect, test } from "bun:test";
import { correctDevtoolsTree } from "../devtools-runtime";
import path from "node:path";

test("the JsonTree correction is restricted to the inspected version and exact source", async () => {
  const source = await Bun.file(path.resolve(import.meta.dir, "../../node_modules/@tanstack/devtools-ui/dist/esm/components/tree.js")).text();
  expect(correctDevtoolsTree(source, "0.7.1")).toContain('props.keyName && (props.value === null || typeof props.value !== "object")');
  expect(() => correctDevtoolsTree(source, "0.7.2")).toThrow("Revalidate");
  expect(() => correctDevtoolsTree(source + "\n", "0.7.1")).toThrow("Revalidate");
});
