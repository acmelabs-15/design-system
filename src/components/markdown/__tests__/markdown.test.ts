import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeMarkdown } from "../markdown";

const mount = async (html: string) => {
  document.body.innerHTML = html;
  const el = document.body.firstElementChild as AcmeMarkdown;
  await el.updateComplete;
  return el;
};

describe("acme-markdown", () => {
  test("renders headings, emphasis and lists in the Geist scale", async () => {
    const el = await mount(`<acme-markdown>
      ## Title

      Some **bold** copy.

      - one
      - two
    </acme-markdown>`);
    const root = el.shadowRoot!.querySelector(".markdown")!;
    expect(root.querySelector("h2")?.textContent).toBe("Title");
    expect(root.querySelector("strong")?.textContent).toBe("bold");
    expect(root.querySelectorAll("li").length).toBe(2);
  });

  test("highlights code fences and escapes raw HTML by default", async () => {
    const el = await mount(`<acme-markdown>
      \`\`\`ts
      const a = 1;
      \`\`\`
    </acme-markdown>`);
    const root = el.shadowRoot!.querySelector(".markdown")!;
    expect(root.querySelector("pre code .th-keyword")?.textContent).toBe("const");
    // Raw HTML in the source (set as text, so the DOM parser does not consume it) is escaped.
    el.text = "Hello <b>raw</b>";
    await el.updateComplete;
    expect(root.querySelector("b")).toBeNull();
    expect(root.textContent).toContain("<b>raw</b>");
  });

  test("text property overrides the content", async () => {
    const el = await mount(`<acme-markdown text="# From a property">ignored</acme-markdown>`);
    expect(el.shadowRoot!.querySelector("h1")?.textContent).toBe("From a property");
  });
});
