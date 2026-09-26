import type { CSSResultOrNative } from "lit";

type CachedSheet = { sheet: CSSStyleSheet; text?: string };
type AppliedStyles = { boundary: Comment; sheets: readonly CSSStyleSheet[]; nodes: HTMLStyleElement[] };
const documents = new WeakMap<Document, WeakMap<CSSResultOrNative, CachedSheet>>();
const roots = new WeakMap<ShadowRoot, AppliedStyles>();

const styleText = (style: CSSResultOrNative): string => ("cssText" in style ? style.cssText : Array.from(style.cssRules, (rule) => rule.cssText).join("\n"));

function documentSheet(document: Document, Sheet: typeof CSSStyleSheet, source: CSSResultOrNative): CSSStyleSheet {
  let cache = documents.get(document);
  if (!cache) {
    cache = new WeakMap();
    documents.set(document, cache);
  }
  let cached = cache.get(source);
  if (!cached && !("cssText" in source) && source instanceof Sheet) {
    // The platform checks the constructor document, including documents from the same realm.
    const probe = document.createElement("div").attachShadow({ mode: "open" });
    try {
      probe.adoptedStyleSheets = [source];
      cached = { sheet: source };
    } catch (error) {
      if (!error || typeof error !== "object" || !("name" in error) || error.name !== "NotAllowedError") {
        throw error;
      }
    }
  }
  if (cached?.sheet === source) {
    cache.set(source, cached);
    return source;
  }
  const text = styleText(source);
  if (!cached) {
    cached = { sheet: new Sheet() };
  }
  if (cached.text !== text) {
    cached.sheet.replaceSync(text);
    cached.text = text;
  }
  if (!("cssText" in source)) {
    if (cached.sheet.media.mediaText !== source.media.mediaText) {
      cached.sheet.media.mediaText = source.media.mediaText;
    }
    if (cached.sheet.disabled !== source.disabled) {
      cached.sheet.disabled = source.disabled;
    }
  }
  cache.set(source, cached);
  return cached.sheet;
}

function replaceOwnedSheets(root: ShadowRoot, previous: readonly CSSStyleSheet[], next: readonly CSSStyleSheet[]): void {
  if (!("adoptedStyleSheets" in root)) {
    return;
  }
  const owned = new Set(previous);
  const current = [...root.adoptedStyleSheets];
  const present = current.filter((sheet) => owned.has(sheet));
  if (present.length === next.length && present.every((sheet, index) => sheet === next[index])) {
    return;
  }
  const firstOwned = current.findIndex((sheet) => owned.has(sheet));
  const retained = current.filter((sheet) => !owned.has(sheet));
  retained.splice(firstOwned < 0 ? 0 : firstOwned, 0, ...next);
  if (current.length !== retained.length || current.some((sheet, index) => sheet !== retained[index])) {
    root.adoptedStyleSheets = retained;
  }
}

/** Applies finalized generated styles in the root's document, returning a stable Lit boundary. */
export function applyStaticStyles(root: ShadowRoot, styles: readonly CSSResultOrNative[]): Comment {
  const document = root.ownerDocument;
  let applied = roots.get(root);
  if (!applied) {
    const boundary = document.createComment("acme-static-styles");
    root.insertBefore(boundary, root.firstChild);
    applied = { boundary, sheets: [], nodes: [] };
    roots.set(root, applied);
  }
  const view = document.defaultView as (Window & { CSSStyleSheet?: typeof CSSStyleSheet; ShadyCSS?: { nativeShadow?: boolean }; litNonce?: string }) | null;
  const Sheet = view?.CSSStyleSheet;
  const nativeShadow = view?.ShadyCSS === undefined || view.ShadyCSS.nativeShadow;
  if (nativeShadow && Sheet && typeof Sheet.prototype.replaceSync === "function" && "adoptedStyleSheets" in root) {
    const sheets = styles.map((style) => documentSheet(document, Sheet, style));
    replaceOwnedSheets(root, applied.sheets, sheets);
    for (const node of applied.nodes) {
      node.remove();
    }
    applied.nodes = [];
    applied.sheets = sheets;
  } else {
    const texts = styles.map(styleText);
    replaceOwnedSheets(root, applied.sheets, []);
    applied.sheets = [];
    for (const [index, text] of texts.entries()) {
      let node = applied.nodes[index];
      if (!node) {
        node = document.createElement("style");
        applied.nodes.push(node);
        root.append(node);
      }
      if (view?.litNonce !== undefined) {
        if (node.nonce !== view.litNonce) {
          node.nonce = view.litNonce;
        }
      } else {
        node.removeAttribute("nonce");
      }
      if (node.textContent !== text) {
        node.textContent = text;
      }
      const source = styles[index];
      const media = "cssText" in source ? "" : source.media.mediaText;
      const disabled = "cssText" in source ? false : source.disabled;
      if (node.media !== media) {
        node.media = media;
      }
      if (node.disabled !== disabled) {
        node.disabled = disabled;
      }
    }
    for (const node of applied.nodes.splice(texts.length)) {
      node.remove();
    }
  }
  return applied.boundary;
}

/** Returns a constructed sheet in the target document when that platform supports it. */
export function constructedStyleSheet(document: Document, style: CSSResultOrNative): CSSStyleSheet | undefined {
  const Sheet = document.defaultView?.CSSStyleSheet;
  return Sheet && typeof Sheet.prototype.replaceSync === "function" ? documentSheet(document, Sheet, style) : undefined;
}
