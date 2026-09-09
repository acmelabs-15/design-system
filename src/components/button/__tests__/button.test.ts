import { describe, expect, test } from "bun:test";
import "../../../index.js";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as any;
  await el.updateComplete;
  return el;
};

describe("acme-button", () => {
  test("renders a button with the Geist classes for its variant and size", async () => {
    const el = await mount(`<acme-button variant="primary" size="small">Deploy</acme-button>`);
    const b = el.shadowRoot.querySelector("button");
    expect(b.className).toContain("btn");
    expect(b.className).toContain("primary");
    expect(b.className).toContain("sm");
  });
  test("renders a link when href is set", async () => {
    const el = await mount(`<acme-button href="/x">Visit</acme-button>`);
    expect(el.shadowRoot.querySelector("a").getAttribute("href")).toBe("/x");
  });
  test("loading sets aria-busy and keeps the label", async () => {
    const el = await mount(`<acme-button loading>Saving</acme-button>`);
    expect(el.shadowRoot.querySelector("button").getAttribute("aria-busy")).toBe("true");
    expect(el.textContent).toBe("Saving");
  });
});

describe("acme-badge", () => {
  test("hue and subtle map to classes", async () => {
    const el = await mount(`<acme-badge hue="blue" subtle>Preview</acme-badge>`);
    const s = el.shadowRoot.querySelector("span.badge");
    expect(s.className).toContain("blue");
    expect(s.className).toContain("subtle");
  });
});

describe("acme-status-dot", () => {
  test("composes its aria-label from the prefix and the state", async () => {
    const el = await mount(`<acme-status-dot state="ready" title-prefix="vercel-site production"></acme-status-dot>`);
    expect(el.shadowRoot.querySelector("[role=img]").getAttribute("aria-label")).toBe("vercel-site production is ready");
  });
});
