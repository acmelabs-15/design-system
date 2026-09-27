import { expect, test } from "bun:test";
import { assertLintSourcePreserved } from "../lint-source-guard";

test("braces and import spacing retain syntax meaning", () => {
  const before = 'import {x} from "./x";\nexport function example(value:boolean){if(value)return x;else return "two  spaces";}';
  const after = "import { x } from \"./x\";\n\nexport function example(value: boolean) { if (value) { return x; } else { return 'two  spaces'; } }";
  expect(() => assertLintSourcePreserved(before, after, "example.ts")).not.toThrow();
});

test("guard rejects order, dependency-read, literal, annotation and sparse-array changes", () => {
  for (const [before, after] of [
    ["const rules={padding:4,paddingInline:2};", "const rules={paddingInline:2,padding:4};"],
    ["function read(){ this.value; return 1; }", "function read(){ return 1; }"],
    ['const value="two  spaces";', 'const value="two spaces";'],
    ["/** @default 2 */\nexport const value=2;", "/** @default 3 */\nexport const value=2;"],
    ["const values=[0,,4];", "const values=[0,undefined,4];"],
  ]) {
    expect(() => assertLintSourcePreserved(before, after, "example.ts")).toThrow("syntax contract");
  }
});

test("logical regrouping preserves operand order while mixed operators remain distinct", () => {
  expect(() => assertLintSourcePreserved("const value=a && (b && c);", "const value=(a && b) && c;", "example.ts")).not.toThrow();
  expect(() => assertLintSourcePreserved("const value=a || (b || c);", "const value=(a || b) || c;", "example.ts")).not.toThrow();
  expect(() => assertLintSourcePreserved("const value=(a && b) || c;", "const value=a && (b || c);", "example.ts")).toThrow("syntax contract");
});

test("guard rejects changes to declaration lifetime and optional-chain boundaries", () => {
  for (const [before, after] of [
    ["const value=1;", "let value=1;"],
    ["let value=1;", "var value=1;"],
    ["using value=resource();", "const value=resource();"],
    ["const value=(obj?.x).y;", "const value=obj?.x.y;"],
    ["const value=(obj?.method)();", "const value=obj?.method();"],
  ]) {
    expect(() => assertLintSourcePreserved(before, after, "example.ts")).toThrow("syntax contract");
  }
});

test("guard preserves the raw text observed by tagged templates", () => {
  expect(() => assertLintSourcePreserved("const text=String.raw`\\u0061`;", "const text=String.raw`a`;", "example.ts")).toThrow("syntax contract");
});
