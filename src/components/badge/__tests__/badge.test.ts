import { afterEach, expect, test } from "bun:test";
import "../../../all";
afterEach(() => document.body.replaceChildren());
async function mount(tag: "acme-badge" | "acme-pill" | "acme-tag") {
  const el = document.createElement(tag);
  document.body.append(el);
  await el.updateComplete;
  return el;
}
test("Badge keeps every source variant with canonical sizes and affixes", async () => {
  const badge = (await mount("acme-badge")) as HTMLElementTagNameMap["acme-badge"];
  expect(badge.size).toBe("medium");
  for (const variant of ["gray", "blue", "purple", "amber", "red", "pink", "green", "teal", "inverted", "trial", "turbo"] as const) {
    badge.variant = variant;
    badge.contrast = "low";
    badge.size = "small";
    await badge.updateComplete;
    const root = badge.shadowRoot!.querySelector("[part=root]")!;
    expect(root.classList.contains("subtle")).toBe(true);
    expect(root.classList.contains("sm")).toBe(true);
    if (variant !== "gray") expect(root.classList.contains(variant)).toBe(true);
    expect(root.querySelector("slot[name=start]")).not.toBeNull();
    expect(root.querySelector("slot[name=end]")).not.toBeNull();
  }
  badge.size = "large";
  await badge.updateComplete;
  expect(badge.shadowRoot!.querySelector("[part=root]")!.classList.contains("lg")).toBe(true);
});
test("Pill switches between passive content and a real named link", async () => {
  const pill = (await mount("acme-pill")) as HTMLElementTagNameMap["acme-pill"];
  expect(pill.shadowRoot!.querySelector("[part=root]")!.localName).toBe("span");
  expect("solid" in pill).toBe(false);
  pill.href = "#target";
  pill.target = "_blank";
  pill.rel = "noreferrer";
  pill.variant = "solid";
  pill.ariaLabel = "Open category";
  await pill.updateComplete;
  const link = pill.shadowRoot!.querySelector("a")!;
  expect(link.getAttribute("href")).toBe("#target");
  expect(link.getAttribute("rel")).toBe("noreferrer");
  expect(link.getAttribute("target")).toBe("_blank");
  expect(link.getAttribute("aria-label")).toBe("Open category");
  expect(link.classList.contains("solid")).toBe(true);
  pill.href = "";
  await pill.updateComplete;
  expect(pill.shadowRoot!.querySelector("a")).toBeNull();
});
test("Tag remains passive at every named size and preserves start/end composition", async () => {
  const tag = (await mount("acme-tag")) as HTMLElementTagNameMap["acme-tag"];
  for (const size of ["small", "medium", "large"] as const) {
    tag.size = size;
    await tag.updateComplete;
    const root = tag.shadowRoot!.querySelector("[part=root]")!;
    expect(root.localName).toBe("span");
    expect(root.getAttribute("tabindex")).toBeNull();
    expect(root.querySelector("slot[name=start]")).not.toBeNull();
    expect(root.querySelector("slot[name=end]")).not.toBeNull();
  }
});
