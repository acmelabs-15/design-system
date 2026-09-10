import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeCode } from "../code";
import { tokenLines } from "../code";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeCode;
  await el.updateComplete;
  return el;
};

describe("acme-code", () => {
  test("renders the source in a pre with a code body, tokens as token spans", async () => {
    const el = await mount(`<acme-code syntax="javascript">const a = 1; // one</acme-code>`);
    const pre = el.shadowRoot!.querySelector("pre.code")!;
    const body = pre.querySelector("code.body")!;
    expect(body.getAttribute("style")).toContain("liga");
    expect(body.textContent).toBe("const a = 1; // one");
    expect(body.querySelector(".token.keyword")!.textContent).toBe("const");
    expect(body.querySelector(".token.comment")!.textContent).toBe("// one");
  });

  test("lines split at newlines and keep their order; unknown languages stay plain", async () => {
    const el = await mount(`<acme-code syntax="nope">
a
  b</acme-code>`);
    const body = el.shadowRoot!.querySelector("code.body")!;
    expect(body.textContent).toBe("a\n  b");
    expect(body.querySelector(".token")).toBeNull();
  });

  test("tokenLines maps the highlighter's kinds to the styled names", () => {
    const lines = tokenLines("<div class='x'></div>", "html");
    const html = lines
      .flat()
      .map((p) => (typeof p === "string" ? p : p.strings.join("") + p.values.join("")))
      .join("");
    expect(html).toContain("token tag");
    expect(html).toContain("token attr-name");
  });

  test("a change of the text re-renders", async () => {
    const el = await mount(`<acme-code syntax="js">let x</acme-code>`);
    el.textContent = "let y";
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("code.body")!.textContent).toBe("let y");
  });
});
