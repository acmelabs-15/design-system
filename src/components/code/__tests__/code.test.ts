import { afterEach, expect, test } from "bun:test";
import "../../../all";
import type { AcmeCode } from "../code";
import { tokenLines } from "../../../shared/highlight";
afterEach(() => document.body.replaceChildren());
const mount = async (source: string, syntax = "") => {
  const code = document.createElement("acme-code") as AcmeCode;
  code.textContent = source;
  code.syntax = syntax;
  document.body.append(code);
  await code.updateComplete;
  return code;
};
test("Code is native inline code and preserves source whitespace", async () => {
  const code = await mount("  let x = 1;\n ");
  const root = code.shadowRoot!.querySelector("code")!;
  expect(root.getAttribute("part")).toBe("root");
  expect(root.textContent).toBe("  let x = 1;\n ");
  expect(code.shadowRoot!.querySelector("pre")).toBeNull();
});
test("highlighting uses escaped token text and reacts to language/text changes", async () => {
  const code = await mount("const value = 1; // note", "js");
  expect(code.shadowRoot!.querySelector(".token.keyword")?.textContent).toBe("const");
  code.textContent = '<img src=x onerror="bad()">';
  code.syntax = "html";
  await new Promise((resolve) => setTimeout(resolve, 0));
  await code.updateComplete;
  expect(code.shadowRoot!.querySelector("img")).toBeNull();
  expect(code.shadowRoot!.querySelector("code")!.textContent).toBe('<img src=x onerror="bad()">');
  code.syntax = "unknown";
  await code.updateComplete;
  expect(code.shadowRoot!.querySelector(".token")).toBeNull();
});
test("block consumers retain the shared token rendering helper", () => {
  const lines = tokenLines("<div class='x'></div>", "html");
  expect(lines.flat().some((part) => typeof part !== "string")).toBe(true);
});
test("Code refreshes text changed while disconnected", async () => {
  const code = await mount("before");
  code.remove();
  code.textContent = "after";
  document.body.append(code);
  await code.updateComplete;
  expect(code.shadowRoot!.querySelector("code")!.textContent).toBe("after");
});
