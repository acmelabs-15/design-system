import { expect, test, spyOn } from "bun:test";
import "../../../all";
import { highlighter } from "../../../shared/highlight";
async function mount(code: string) {
  const element = document.createElement("acme-code-block");
  element.code = code;
  document.body.replaceChildren(element);
  await element.updateComplete;
  return element;
}
test("Code Block preserves all source whitespace and exposes one code source", async () => {
  const code = "\n  const answer = 42;  \n";
  const element = await mount(code);
  element.textContent = "not a second source";
  await element.updateComplete;
  expect(element.shadowRoot!.querySelector("acme-copy-button")!.value).toBe(code);
  expect(element.shadowRoot!.querySelectorAll("[part=line]").length).toBe(3);
  expect(element.shadowRoot!.textContent).not.toContain("not a second source");
});
test("line activation requests application state without changing the URL", async () => {
  const element = await mount("one\ntwo\nthree");
  const before = location.href,
    requests: unknown[] = [];
  element.addEventListener("acme-request", (event) => requests.push((event as CustomEvent).detail));
  (element.shadowRoot!.querySelectorAll("[part=line-number]")[1] as HTMLButtonElement).click();
  expect(requests).toEqual([{ action: "reference-line", line: 2 }]);
  expect(element.referencedLine).toBeUndefined();
  expect(location.href).toBe(before);
  element.referencedLine = 2;
  await element.updateComplete;
  expect(element.shadowRoot!.querySelectorAll("[part=line]")[1].hasAttribute("data-active")).toBe(true);
});
test("line decorations are snapshotted and never create phantom lines", async () => {
  const element = await mount("one\ntwo"),
    values = [1, 9];
  element.highlightedLines = values;
  values.push(2);
  element.addedLines = [2];
  element.removedLines = [2];
  await element.updateComplete;
  expect(element.highlightedLines).toEqual([1, 9]);
  expect(element.shadowRoot!.querySelectorAll("[part=line]").length).toBe(2);
  expect(() => {
    element.addedLines = [0];
  }).toThrow();
});
test("a failed highlighter keeps escaped source and reports failure once", async () => {
  const mock = spyOn(highlighter, "tokenize").mockImplementation(() => {
    throw Error("highlight failed");
  });
  try {
    const element = document.createElement("acme-code-block");
    element.code = "<script>bad()</script>";
    element.language = "html";
    const errors: unknown[] = [];
    element.addEventListener("acme-error", (event) => errors.push((event as CustomEvent).detail));
    document.body.replaceChildren(element);
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector("script")).toBeNull();
    expect(element.shadowRoot!.querySelector("[part=code]")!.textContent).toContain("<script>bad()</script>");
    expect(errors).toHaveLength(1);
    expect((errors[0] as { code: string }).code).toBe("highlight");
  } finally {
    mock.mockRestore();
  }
});
