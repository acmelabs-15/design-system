import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeSnippet } from "../snippet";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeSnippet;
  await el.updateComplete;
  return el;
};
const root = (el: AcmeSnippet) => el.shadowRoot!.querySelector(".snippet") as HTMLElement;

describe("acme-snippet", () => {
  test("renders the command in a pre, the width and height on the root, and the copy button in its wrapper", async () => {
    const el = await mount(`<acme-snippet text="npm init next-app" width="300px"></acme-snippet>`);
    const s = root(el);
    expect(s.className.trim()).toBe("snippet");
    expect(s.getAttribute("style")).toBe("width:300px;height:auto");
    expect(s.querySelector("pre")!.textContent).toBe("npm init next-app");
    // The button is acme-copy-button, composed rather than rebuilt: this asserts what the snippet
    // asks of it, and the button's own tests assert the icon stack and the clipboard behaviour.
    const b = s.querySelector(".action > acme-copy-button")!;
    expect(b.getAttribute("variant")).toBe("secondary");
    expect(b.getAttribute("shape")).toBe("square");
    expect(b.getAttribute("size")).toBe("small");
    expect(b.getAttribute("label")).toBe("Copy to clipboard");
    expect(b.getAttribute("text-to-copy")).toBe("npm init next-app");
    expect(b.hasAttribute("copied")).toBe(false);
  });

  test("prompt=false, dark, type, fill and an empty text with a placeholder map to modifier classes", async () => {
    const el = await mount(`<acme-snippet prompt="false" dark variant="success" fill text="x"></acme-snippet>`);
    for (const k of ["no-prompt", "dark", "success", "fill"]) expect(root(el).classList.contains(k)).toBe(true);
    const empty = await mount(`<acme-snippet placeholder="Run acme link to fetch env vars" text=""></acme-snippet>`);
    expect(root(empty).classList.contains("placeholder")).toBe(true);
    expect(root(empty).querySelector("pre")!.textContent).toBe("Run acme link to fetch env vars");
  });

  test("a JSON array in text renders one pre per line; compact fixes the height", async () => {
    const el = await mount(`<acme-snippet text='["cd project", "now"]'></acme-snippet>`);
    const pres = root(el).querySelectorAll("pre");
    expect(pres.length).toBe(2);
    expect(pres[1].textContent).toBe("now");
    const compact = await mount(`<acme-snippet compact text="acme deploy"></acme-snippet>`);
    expect(root(compact).getAttribute("style")).toBe("height:36px");
    expect(root(compact).querySelector("pre")!.getAttribute("style")).toBe("height:36px;line-height:1");
  });

  test("icon=false drops the button; not-focusable disables it", async () => {
    const none = await mount(`<acme-snippet icon="false" text="x"></acme-snippet>`);
    expect(root(none).querySelector(".action")).toBeNull();
    const off = await mount(`<acme-snippet not-focusable text="x"></acme-snippet>`);
    expect(root(off).querySelector("acme-copy-button")!.hasAttribute("disabled")).toBe(true);
  });

  test("copied passes through to the button, which shows the check", async () => {
    const el = await mount(`<acme-snippet text="Copy install prompt" prompt="false"></acme-snippet>`);
    const b = root(el).querySelector("acme-copy-button")!;
    expect(b.hasAttribute("copied")).toBe(false);
    el.copied = true;
    await el.updateComplete;
    expect(b.hasAttribute("copied")).toBe(true);
  });

  test("copy-text wins over text, and copy() delegates to the button", async () => {
    const written: string[] = [];
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t: string) => void written.push(t) }, configurable: true });
    const el = await mount(`<acme-snippet text='["a", "b"]' copy-text="c"></acme-snippet>`);
    expect(root(el).querySelector("acme-copy-button")!.getAttribute("text-to-copy")).toBe("c");
    // acme-copy is composed, so the button's event bubbles through the snippet.
    const events: string[] = [];
    el.addEventListener("acme-copy", (e) => events.push((e as CustomEvent).detail.text));
    el.copy();
    await new Promise((r) => setTimeout(r, 0));
    expect(written).toEqual(["c"]);
    expect(events).toEqual(["c"]);
  });

  test("without copy-text the lines are joined for the clipboard", async () => {
    const el = await mount(`<acme-snippet text='["cd project", "now"]'></acme-snippet>`);
    expect(root(el).querySelector("acme-copy-button")!.getAttribute("text-to-copy")).toBe("cd project\nnow");
  });
});
