import { expect, spyOn, test } from "bun:test";
import { Window as HappyWindow } from "happy-dom";
import { css } from "lit";
import { applyStaticStyles } from "../static-styles";

const createDocument = () => {
  const view = new HappyWindow();
  const Sheet = view.CSSStyleSheet;
  // happy-dom exposes media as a string; model the native MediaList for sheet metadata checks.
  Object.defineProperty(view, "CSSStyleSheet", {
    value: class extends Sheet {
      constructor() {
        super();
        Object.defineProperty(this, "media", { value: { mediaText: "" } });
      }
    },
  });
  return view.document as unknown as Document;
};
type StyleView = Window & typeof globalThis & { ShadyCSS?: { nativeShadow: boolean }; litNonce?: string };
const rootFor = (document: Document) => document.createElement("div").attachShadow({ mode: "open" });
const sheetFor = (document: Document) => new (document.defaultView as Window & typeof globalThis).CSSStyleSheet();
const first = css`
  :host {
    padding: 4px;
  }
`;
const second = css`
  :host {
    color: blue;
  }
`;

test("shares each generated source within a document and creates destination-owned sheets", () => {
  const a = createDocument();
  const b = createDocument();
  const firstRoot = rootFor(a);
  const secondRoot = rootFor(a);
  const foreignRoot = rootFor(b);
  const Sheet = (a.defaultView as Window & typeof globalThis).CSSStyleSheet;
  const writes = spyOn(Sheet.prototype, "replaceSync");
  try {
    const boundary = applyStaticStyles(firstRoot, [first]);
    const sheets = [...firstRoot.adoptedStyleSheets];
    expect(applyStaticStyles(firstRoot, [first])).toBe(boundary);
    expect(firstRoot.adoptedStyleSheets).toEqual(sheets);
    applyStaticStyles(secondRoot, [first, second]);
    expect(secondRoot.adoptedStyleSheets[0]).toBe(sheets[0]);
    expect(writes.mock.calls).toEqual([[first.cssText], [second.cssText]]);
    applyStaticStyles(foreignRoot, [first]);
    expect(foreignRoot.adoptedStyleSheets[0]).not.toBe(sheets[0]);
    expect(foreignRoot.adoptedStyleSheets[0]).toBeInstanceOf((b.defaultView as Window & typeof globalThis).CSSStyleSheet);
  } finally {
    writes.mockRestore();
  }
});

test("replaces only owned sheets while preserving unrelated sheets and author nodes", () => {
  const document = createDocument();
  const root = rootFor(document);
  const author = document.createElement("span");
  root.append(author);
  const external = sheetFor(document);
  root.adoptedStyleSheets = [external];
  const boundary = applyStaticStyles(root, [first, second]);
  const owned = [...root.adoptedStyleSheets].filter((sheet) => sheet !== external);
  expect(root.adoptedStyleSheets).toEqual([...owned, external]);
  expect(author.parentNode).toBe(root);
  root.adoptedStyleSheets = [owned[0], external, owned[1]];
  applyStaticStyles(root, [first, second]);
  expect(root.adoptedStyleSheets).toEqual([owned[0], external, owned[1]]);
  applyStaticStyles(root, [second]);
  expect(root.adoptedStyleSheets).toEqual([owned[1], external]);
  applyStaticStyles(root, []);
  expect(root.adoptedStyleSheets).toEqual([external]);
  expect(author.parentNode).toBe(root);
  expect(boundary.parentNode).toBe(root);
});

test("retains same-document raw sheets so later native changes remain live", () => {
  const document = createDocument();
  const root = rootFor(document);
  const source = sheetFor(document);
  source.replaceSync("button { color: red; }");
  applyStaticStyles(root, [source]);
  expect(root.adoptedStyleSheets[0]).toBe(source);
  source.replaceSync("button { color: blue; }");
  expect(root.adoptedStyleSheets[0].cssRules[0].cssText).toContain("blue");
  applyStaticStyles(root, [source]);
  expect(root.adoptedStyleSheets[0]).toBe(source);
});

test("refreshes a cached foreign raw stylesheet snapshot on application", () => {
  const a = createDocument();
  const b = createDocument();
  const root = rootFor(b);
  const source = sheetFor(a);
  source.replaceSync("button { color: red; }");
  applyStaticStyles(root, [source]);
  const snapshot = root.adoptedStyleSheets[0];
  expect(snapshot).not.toBe(source);
  expect(snapshot).toBeInstanceOf((b.defaultView as Window & typeof globalThis).CSSStyleSheet);
  source.replaceSync("button { color: blue; }");
  applyStaticStyles(root, [source]);
  expect(root.adoptedStyleSheets[0]).toBe(snapshot);
  expect(snapshot.cssRules[0].cssText).toContain("blue");
});

test("updates foreign raw sheet media and disabled state even when its rules stay unchanged", () => {
  const a = createDocument();
  const b = createDocument();
  const root = rootFor(b);
  const source = sheetFor(a);
  source.replaceSync("button { color: red; }");
  source.media.mediaText = "(min-width: 40rem)";
  source.disabled = true;
  applyStaticStyles(root, [source]);
  const snapshot = root.adoptedStyleSheets[0];
  expect(snapshot.media.mediaText).toBe("(min-width: 40rem)");
  expect(snapshot.disabled).toBe(true);
  source.media.mediaText = "print";
  source.disabled = false;
  applyStaticStyles(root, [source]);
  expect(root.adoptedStyleSheets[0]).toBe(snapshot);
  expect(snapshot.media.mediaText).toBe("print");
  expect(snapshot.disabled).toBe(false);
  expect(source.cssRules[0].cssText).toBe(snapshot.cssRules[0].cssText);
});

test("uses literal styles when the owner view reports non-native ShadyCSS", () => {
  const document = createDocument();
  const view = document.defaultView as StyleView;
  view.ShadyCSS = { nativeShadow: false };
  const root = rootFor(document);
  const boundary = applyStaticStyles(root, [first]);
  expect(root.adoptedStyleSheets).toHaveLength(0);
  expect(root.querySelector("style")?.textContent).toBe(first.cssText);
  view.ShadyCSS.nativeShadow = true;
  expect(applyStaticStyles(root, [first])).toBe(boundary);
  expect(root.adoptedStyleSheets).toHaveLength(1);
  expect(root.querySelector("style")).toBeNull();
});

test("preserves raw sheet metadata in literal nodes and clears it when a generated source replaces them", () => {
  const a = createDocument();
  const b = createDocument();
  (b.defaultView as StyleView).ShadyCSS = { nativeShadow: false };
  const root = rootFor(b);
  const source = sheetFor(a);
  source.replaceSync("button { color: red; }");
  source.media.mediaText = "print";
  source.disabled = true;
  applyStaticStyles(root, [source]);
  const node = root.querySelector("style")!;
  expect(node.media).toBe("print");
  expect(node.disabled).toBe(true);
  source.media.mediaText = "screen";
  source.disabled = false;
  applyStaticStyles(root, [source]);
  expect(root.querySelector("style")).toBe(node);
  expect(node.media).toBe("screen");
  expect(node.disabled).toBe(false);
  applyStaticStyles(root, [first]);
  expect(node.media).toBe("");
  expect(node.disabled).toBe(false);
});

test("refreshes only owned fallback nonces when the root moves to another fallback view", () => {
  const a = createDocument();
  const b = createDocument();
  const firstView = a.defaultView as StyleView;
  const secondView = b.defaultView as StyleView;
  firstView.ShadyCSS = secondView.ShadyCSS = { nativeShadow: false };
  firstView.litNonce = "first";
  secondView.litNonce = "second";
  const root = rootFor(a);
  const author = a.createElement("style");
  author.nonce = "author";
  root.append(author);
  const boundary = applyStaticStyles(root, [first]);
  const owned = [...root.querySelectorAll("style")].find((node) => node !== author)!;
  expect(owned.nonce).toBe("first");
  // Model the document change that happy-dom's adoptNode does not propagate into shadow roots.
  Object.defineProperty(root, "ownerDocument", { value: b, configurable: true });
  expect(applyStaticStyles(root, [first])).toBe(boundary);
  expect(owned.nonce).toBe("second");
  expect(author.nonce).toBe("author");
  delete secondView.litNonce;
  applyStaticStyles(root, [first]);
  expect(owned.hasAttribute("nonce")).toBe(false);
  expect(author.nonce).toBe("author");
});

test("uses owned literal styles without a window and keeps their cleanup boundary stable", () => {
  const document = createDocument().implementation.createHTMLDocument("Detached");
  expect(document.defaultView).toBeNull();
  const root = rootFor(document);
  const author = document.createElement("style");
  author.textContent = "span { color: red; }";
  root.append(author);
  const boundary = applyStaticStyles(root, [first, second]);
  const owned = [...root.querySelectorAll("style")].filter((node) => node !== author);
  expect(owned.map((node) => node.textContent)).toEqual([first.cssText, second.cssText]);
  expect(root.adoptedStyleSheets).toEqual([]);
  expect(applyStaticStyles(root, [first, second])).toBe(boundary);
  expect([...root.querySelectorAll("style")]).toEqual([author, ...owned]);
  applyStaticStyles(root, [second]);
  expect(root.querySelectorAll("style")).toHaveLength(2);
  expect(root.querySelectorAll("style")[1].textContent).toBe(second.cssText);
  applyStaticStyles(root, []);
  expect([...root.querySelectorAll("style")]).toEqual([author]);
  expect(boundary.parentNode).toBe(root);
});
