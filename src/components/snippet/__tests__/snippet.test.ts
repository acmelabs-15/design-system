import { expect, test } from "bun:test";
import "../../../all";

async function mount(text: string | readonly string[]) {
  const el = document.createElement("acme-snippet");
  el.text = text;
  document.body.replaceChildren(el);
  await el.updateComplete;
  await el.shadowRoot!.querySelector("acme-copy-button")?.updateComplete;
  return el;
}
test("Snippet owns immutable plain text and copies exactly the source without its prompt", async () => {
  const lines = ["cd project", "bun run build"];
  const el = await mount(lines);
  lines.push("changed");
  expect(el.text).toEqual(["cd project", "bun run build"]);
  const button = el.shadowRoot!.querySelector("acme-copy-button")!;
  expect(button.value).toBe("cd project\nbun run build");
  el.copyText = "";
  await el.updateComplete;
  expect(button.value).toBe("");
});
test("Snippet escapes text and exposes the selected copy and size contract", async () => {
  const el = await mount("<script>bad()</script>");
  expect(el.shadowRoot!.querySelector("script")).toBeNull();
  expect(el.shadowRoot!.querySelector("acme-code")!.textContent).toBe("<script>bad()</script>");
  el.copyable = false;
  el.size = "small";
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector("acme-copy-button")).toBeNull();
  expect(el.shadowRoot!.querySelector("[part=root]")!.getAttribute("data-size")).toBe("small");
});
test("copy result bubbles once from Copy Button and invalid arrays are rejected", async () => {
  const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  const writes: string[] = [];
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (value: string) => {
        writes.push(value);
      },
    },
  });
  try {
    const el = await mount(["a", "b"]);
    let copied = 0;
    el.addEventListener("acme-copy", () => copied++);
    await el.shadowRoot!.querySelector("acme-copy-button")!.copy();
    expect(writes).toEqual(["a\nb"]);
    expect(copied).toBe(1);
    expect(() => {
      el.text = [4] as unknown as string[];
    }).toThrow();
  } finally {
    if (original) {
      Object.defineProperty(navigator, "clipboard", original);
    } else {
      delete (navigator as any).clipboard;
    }
  }
});
