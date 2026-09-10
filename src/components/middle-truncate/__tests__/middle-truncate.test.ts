import { describe, expect, test } from "bun:test";
import "../../../index";
import { type AcmeMiddleTruncate, cut, expandSelection, fitCut } from "../middle-truncate";

const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeMiddleTruncate;
  await el.updateComplete;
  return el;
};
const VALUE = "feature/redesign-dashboard-navigation-with-sidebar-improvements";
const g = Array.from(VALUE);
/** Seven units per character, so a width of 100 holds fourteen. */
const width = (s: string) => Array.from(s).length * 7;
/** Forces a width on the root and a text-length width on the probe, then re-measures. */
const narrow = async (el: AcmeMiddleTruncate, px: number) => {
  const root = el.shadowRoot!.querySelector(".truncate") as HTMLElement;
  const probe = el.shadowRoot!.querySelector(".measure") as HTMLElement;
  Object.defineProperty(root, "clientWidth", { value: px, configurable: true });
  Object.defineProperty(probe, "scrollWidth", { get: () => width(probe.textContent ?? ""), configurable: true });
  el.refit();
  await el.updateComplete;
};

describe("acme-middle-truncate", () => {
  test("whole: the root is an inline grid of sizer, text and measure; no title, no hidden copy", async () => {
    const el = await mount(`<acme-middle-truncate value="${VALUE}"></acme-middle-truncate>`);
    const root = el.shadowRoot!.querySelector(".truncate")!;
    expect(root.hasAttribute("title")).toBe(false);
    expect(root.querySelector(".full")).toBeNull();
    expect(root.querySelector(".sizer")!.textContent).toBe(VALUE);
    expect(root.querySelector(".sizer")!.getAttribute("aria-hidden")).toBe("true");
    expect(root.querySelector(".text")!.textContent).toBe(VALUE);
    expect(root.querySelector(".text")!.hasAttribute("aria-hidden")).toBe(false);
    expect(root.querySelector(".measure")).not.toBeNull();
  });

  test("cut: the visible text is head, one ellipsis glyph and tail in three spans; the full value stays as title and hidden copy", async () => {
    const el = await mount(`<acme-middle-truncate value="${VALUE}"></acme-middle-truncate>`);
    await narrow(el, 100);
    const root = el.shadowRoot!.querySelector(".truncate")!;
    expect(root.getAttribute("title")).toBe(VALUE);
    expect(root.querySelector(".full")!.textContent).toBe(VALUE);
    const text = root.querySelector(".text")!;
    expect(text.getAttribute("aria-hidden")).toBe("true");
    const parts = [...text.children].map((c) => c.textContent);
    expect(parts.length).toBe(3);
    expect(parts[1]).toBe("…");
    expect(VALUE.startsWith(parts[0]!)).toBe(true);
    expect(VALUE.endsWith(parts[2]!)).toBe(true);
    // Fourteen units fit: thirteen graphemes around the glyph.
    expect(parts.join("")).toBe(cut(g, 13).text);
    await narrow(el, 10000);
    expect(root.hasAttribute("title")).toBe(false);
    expect(root.querySelector(".text")!.textContent).toBe(VALUE);
  });

  test("cut splits the kept graphemes: below six an even split with the head longer, from six up at least three in the tail", () => {
    expect(cut(g, 5).text).toBe("fea…ts");
    expect(cut(g, 6).text).toBe("fea…nts");
    expect(cut(g, 7).text).toBe("feat…nts");
    expect(cut(g, 0).text).toBe("…");
    const c = cut(g, 13);
    expect(c.prefixCount + c.suffixCount).toBe(13);
    expect(c.suffixCount).toBe(6);
  });

  test("fitCut keeps the whole value when it fits and returns the widest cut otherwise; nothing fits below one glyph", () => {
    expect(fitCut(g, 10000, width).truncated).toBe(false);
    expect(fitCut(g, 100, width)).toEqual(cut(g, 13));
    expect(fitCut(g, 3, width)).toEqual({ prefix: "", prefixCount: 0, suffix: "", suffixCount: 0, text: "", truncated: true });
    expect(fitCut(g, 0, width).truncated).toBe(false);
  });

  test("a selection across the ellipsis expands to the matching part of the value", () => {
    const c = cut(g, 13);
    const shown = c.text;
    expect(expandSelection(c.prefix, c.suffix, VALUE, 0, shown.length)).toBe(VALUE);
    expect(expandSelection(c.prefix, c.suffix, VALUE, 2, shown.length - 2)).toBe(VALUE.slice(2, -2));
    expect(expandSelection(c.prefix, c.suffix, VALUE, 0, 3)).toBeNull();
  });

  test("a copy of the cut text yields the full value (a selection wider than the text span takes the text route)", async () => {
    const el = await mount(`<acme-middle-truncate value="${VALUE}"></acme-middle-truncate>`);
    await narrow(el, 100);
    const root = el.shadowRoot!.querySelector(".truncate") as HTMLElement;
    const text = root.querySelector(".text")!;
    (el.shadowRoot as unknown as { getSelection: () => unknown }).getSelection = () => ({
      rangeCount: 1,
      toString: () => text.textContent,
      getRangeAt: () => ({ startContainer: root, endContainer: root, startOffset: 0, endOffset: 4 }),
    });
    let copied = "";
    const e = new Event("copy", { cancelable: true }) as ClipboardEvent;
    Object.defineProperty(e, "clipboardData", { value: { setData: (_t: string, v: string) => (copied = v) } });
    root.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(copied).toBe(VALUE);
  });
});
