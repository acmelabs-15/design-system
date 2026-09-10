// Browser census: computed styles of the example roots of one component, per interaction state.
// Runs on the live Geist page and on our docs page; the collector on :4183 stores the result.
// Usage in a page: window.__census({ side: "geist"|"ours", marker: "data-geist-button", host: "acme-button", ours: ".btn", props: [...], children: { label: ".label|.truncate" } })
const PSEUDO = { hover: "data-hover", "focus-visible": "data-focus", focus: "data-focus", active: "data-active" };
// An escaped colon belongs to a utility class name (`.has-\[\:focus\]\:...`), not to a pseudo-class: left alone, or the selector breaks and the rule stays unrewritten.
//
// The descendant clause (`[data-focus] *`) carries a state down to the parts inside the element
// that holds it, which is what a rule like `.btn:hover .label` needs. A compound that is the
// pseudo-class alone (`:focus-visible { ... }`, with no tag, class or attribute beside it) must
// not take it: with the clause it matches every descendant of the focused element, so a global
// focus ring lands on each icon and span inside. Such a compound keeps the element clause only.
const bare = (sel, at) => {
  const before = sel[at - 1];
  return before === undefined || before === " " || before === ">" || before === "+" || before === "~" || before === "," || before === "(";
};
const attr = (sel) =>
  sel.replace(/(?<!\\):(focus-visible|focus|hover|active)(?![a-z-])/g, (m, p, at) =>
    bare(sel, at) ? `:is(${m},[${PSEUDO[p]}])` : `:is(${m},[${PSEUDO[p]}],[${PSEUDO[p]}] *)`,
  );
// The rewrite is the harness's one piece of real selector logic, and a mistake in it reports a
// difference the element does not have. It is exposed so a test can drive the same function the
// census runs, rather than a copy of it that can drift.

window.__census = async (cfg) => {
  const PROPS = cfg.props ?? [
    "display", "height", "width", "min-width", "max-width", "padding-left", "padding-right", "padding-top", "padding-bottom",
    "margin-left", "margin-right", "border-radius", "border-top-width", "box-shadow", "background-color", "color", "opacity",
    "font-family", "font-size", "line-height", "font-weight", "letter-spacing", "text-transform", "cursor", "gap", "align-items",
    "justify-content", "transition-duration", "transition-property", "translate", "transform", "outline-style", "user-select",
    "overflow", "text-overflow", "white-space", "flex-shrink", "position",
  ];
  const STATES = cfg.states ?? ["", "data-hover", "data-focus", "data-active"];
  // Force one theme on both sides: Geist themes by the dark-theme class, ours by data-theme on the root.
  const theme = cfg.theme ?? "light";
  document.documentElement.classList.toggle("dark-theme", theme === "dark");
  document.documentElement.dataset.theme = theme;
  // `prepare`: script text (or a function) that puts the page into the states to read, such as opening
  // overlays, run once before anything is frozen. The docs pages pin nothing; the census page and this step do.
  if (cfg.prepare) await (typeof cfg.prepare === "function" ? cfg.prepare : new Function(cfg.prepare))();
  // No transitions or animations while reading: every state is read at rest. No timer wait: a
  // hidden pane never fires timers, and style recalculation is forced synchronously below.
  const still = new CSSStyleSheet();
  still.replaceSync("*, *::before, *::after, *::backdrop { transition: none !important; animation: none !important; }");
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, still];
  // Every shadow root, nested ones included (an element that composes another keeps its own transitions otherwise).
  const calm = (root) => {
    for (const h of root.querySelectorAll("*"))
      if (h.shadowRoot) {
        h.shadowRoot.adoptedStyleSheets = [...h.shadowRoot.adoptedStyleSheets, still];
        calm(h.shadowRoot);
      }
  };
  calm(document);
  // A page that keys hover, focus and active off pseudo-classes (a script cannot set those) gets
  // each rewritten, once per sheet, to "the pseudo-class, or its state attribute on the element or
  // an ancestor" (`:hover` -> `:is(:hover,[data-hover],[data-hover] *)`), so the state attributes
  // set on a root below reach the same rules, a peer input's states included.
  //
  // Both sides are rewritten. Most of our generated sheets key their states off the attributes
  // already, and a rewrite leaves those untouched, but not all of them do: a rule the reference
  // wrote as a real `:hover` or `:focus-visible` comes through the generator as one. Rewriting the
  // reference alone leaves such a rule of ours unreachable, so the state reads as its resting value
  // and the diff reports a difference that the element does not have.
  window.__rewritten ??= new WeakSet();
  const rewrite = (rules) => {
    for (const r of rules) {
      if (r.selectorText && /:(hover|focus|active)/.test(r.selectorText)) try { r.selectorText = attr(r.selectorText); } catch {}
      if (r.cssRules?.length) rewrite(r.cssRules);
    }
  };
  const rewriteAll = (root) => {
    for (const s of [...(root.styleSheets ?? []), ...(root.adoptedStyleSheets ?? [])]) {
      if (window.__rewritten.has(s)) continue;
      // A sheet still loading (a census run right after navigation) has no rules yet: it stays unmarked, so a later run rewrites it.
      let rules;
      try { rules = s.cssRules; } catch { continue; }
      if (!rules?.length) continue;
      window.__rewritten.add(s);
      rewrite(rules);
    }
    for (const h of root.querySelectorAll("*")) if (h.shadowRoot) rewriteAll(h.shadowRoot);
  };
  rewriteAll(document);
  // The page reacts to the theme change through observers and element updates, which are microtasks: yield to them.
  for (let i = 0; i < 8; i++) await Promise.resolve();
  // A child of ours may be slotted light DOM, or sit inside a slotted subtree: look through the root's slots after the shadow tree.
  // Our root may sit behind nested shadow roots when the element composes another: "acme-button >> .btn" hops host by host.
  // `diveAll` keeps the elements passed on the way: a host on the way to a root inside a composed element mirrors the root's
  // state attributes (an attribute state on a part lands on the part's host, and the element keeps the two in step).
  // A path of ":host" is the host itself (a root that is our element's own box).
  const diveAll = (host, path) => {
    const hops = [];
    let el = host;
    for (const s of path.split(">>")) {
      el = s.trim() === ":host" ? el : (el?.shadowRoot?.querySelector(s.trim()) ?? null);
      if (!el) return null;
      hops.push(el);
    }
    return hops;
  };
  const dive = (host, path) => diveAll(host, path)?.at(-1) ?? null;
  // `each`: one host holds several roots (the options of a radio group in one shadow tree; the toasts of a viewport, each a
  // composed element with the root in its own tree): every match of every hop is followed, so one chain per root comes back.
  // A hop reads the shadow tree flattened: a slot stands for the light DOM assigned to it (the consumer's rows after the element's own), in tree order.
  const flat = (root, sel, out = []) => {
    for (const el of root.children) {
      if (el.localName === "slot") for (const a of el.assignedElements({ flatten: true })) (a.matches(sel) && out.push(a), flat(a, sel, out));
      else (el.matches(sel) && out.push(el), flat(el, sel, out));
    }
    return out;
  };
  const diveEach = (host, path) => {
    let chains = [[host]];
    for (const s of path.split(">>").map((s) => s.trim())) chains = chains.flatMap((c) => (c.at(-1)?.shadowRoot ? flat(c.at(-1).shadowRoot, s) : []).map((el) => [...c, el]));
    return chains.map((c) => c.slice(1));
  };
  // A child selector may hop into a composed element's shadow root the same way ("acme-button >> .label").
  // A selector starting with "^" is searched from the preview instead of the root: a box beside the root (the reference's backdrop, a sibling of its overlay).
  const find = (root, sel, preview) => {
    const [head, ...hops] = sel.split(">>").map((s) => s.trim());
    const base = head.startsWith("^")
      ? preview.querySelector(head.slice(1))
      : (root.querySelector(head) ?? [...root.querySelectorAll("slot")].flatMap((s) => s.assignedElements({ flatten: true })).map((el) => (el.matches(head) ? el : el.querySelector(head))).find(Boolean) ?? null);
    return hops.length ? dive(base, hops.join(">>")) : base;
  };
  // A pseudo-element (a child selector of "::after", or "::backdrop" alone for a dialog's) is read on the root; it has no box to
  // measure, so its rect is its computed width and height where those resolve to lengths (a backdrop's 100% of the viewport).
  const read = (el, pseudo) => {
    const s = getComputedStyle(el, pseudo);
    const o = {};
    for (const p of PROPS) o[p] = s.getPropertyValue(p);
    const r = pseudo ? { width: parseFloat(s.width) || 0, height: parseFloat(s.height) || 0 } : el.getBoundingClientRect();
    o.__rect = [Math.round(r.width), Math.round(r.height)];
    return o;
  };
  // Example previews on Geist: the element before each "Show code" bar. Ours: .showcase .preview.
  const all = cfg.side === "geist"
    ? [...document.querySelectorAll('button[aria-controls^="radix-"][data-state]')].map((b) => b.closest("div.bg-background-200")?.previousElementSibling).filter(Boolean)
    : [...document.querySelectorAll(".showcase .preview")];
  // `previews`: read only these indices. The corpus is a snapshot, so a page can carry a section the
  // live reference has since removed — collapse's "Standalone" is one, present on the mirror and gone
  // from the live site. Reading it makes the root counts diverge, and roots pair by order, so every
  // comparison after the extra one is wrong. Naming the shared previews keeps the two sides aligned.
  const previews = Array.isArray(cfg.previews) ? cfg.previews.map((i) => all[i]).filter(Boolean) : all;
  // `width`: one outer width for every preview on both sides, so a value the container decides (a
  // centred box's auto margins, a padding in percent) is read in the same context on each side.
  if (cfg.width) for (const p of previews) p.style.width = cfg.width;
  // Every preview is laid out afresh (display none and back): a box the engine re-lays by a simplified
  // pass (a size change above it, a media element loading inside it) can keep a stale used margin in
  // its layout cache, and the computed style then reports that (0px for a centred box) instead of the
  // margin the box is drawn with.
  for (const p of previews) {
    const display = p.style.display;
    p.style.display = "none";
    void p.offsetWidth;
    p.style.display = display;
  }
  const out = [];
  for (const [pi, preview] of previews.entries()) {
    // The marker is an attribute name, or a selector for a root that carries no marker.
    // `ours` may list alternative paths, for a page whose hosts compose the root at different depths
    // (an acme-input beside an acme-search: [".wrap", "acme-input >> .wrap"]); the first hit wins.
    const chains = cfg.side === "geist"
      ? [...preview.querySelectorAll(/^[\w-]+$/.test(cfg.marker) ? `[${cfg.marker}]` : cfg.marker)].map((el) => [el])
      : cfg.each
        ? [...preview.querySelectorAll(cfg.host)].flatMap((h) => diveEach(h, cfg.ours))
        : [...preview.querySelectorAll(cfg.host)].map((h) => [cfg.ours].flat().map((p) => diveAll(h, p)).find(Boolean)).filter(Boolean);
    for (const [ri, chain] of chains.entries()) {
      const root = chain[chain.length - 1];
      const mirrors = chain.slice(0, -1);
      const entry = { example: pi, index: ri, tag: root.tagName.toLowerCase(), attrs: {}, states: {} };
      for (const a of root.attributes) if (/^(class|disabled|aria-|data-|type|role|tabindex|href)/.test(a.name)) entry.attrs[a.name] = a.value;
      // The reference's rewritten rules reach every descendant of a marked root (`[data-hover] *`), and the
      // attribute is set on every descendant on both sides (shadow trees and slotted children included on ours), so
      // a child that carries its own state attribute (a table row under the pointer, a composed button whose
      // reference keys hover and focus off `data-hover` and `data-focus` itself) reads the same on both sides.
      const deep = (el, acc = []) => {
        for (const d of el.querySelectorAll("*")) {
          acc.push(d);
          if (d.shadowRoot) deep(d.shadowRoot, acc);
        }
        return acc;
      };
      for (const st of STATES) {
        const marked = st ? [root, ...mirrors, ...deep(root)] : [];
        // A state attribute a node already carries as its sketched state (the hover on a toast area) stays after the pass.
        const kept = new Set(marked.filter((el) => el.hasAttribute(st)));
        for (const el of marked) el.setAttribute(st, "true");
        void root.offsetHeight; // synchronous style recalculation; no frame needed (the pane may be hidden)
        entry.states[st || "base"] = { root: read(root) };
        for (const [name, sels] of Object.entries(cfg.children ?? {})) {
          const sel = cfg.side === "geist" ? sels.split("|")[1] : sels.split("|")[0];
          // A pseudo-element of the root ("::after") or of a child (".cover::after"): read on that element.
          const pseudo = sel.match(/::(before|after|backdrop)$/)?.[0];
          const base = pseudo ? sel.slice(0, -pseudo.length) : sel;
          const c = base ? find(root, base, preview) : root;
          if (!c) continue;
          if (st && cfg.side === "ours" && !marked.includes(c)) for (const el of [c, ...deep(c)]) marked.push(el), el.setAttribute(st, "true");
          entry.states[st || "base"][name] = read(c, pseudo);
        }
        for (const el of marked) if (!kept.has(el)) el.removeAttribute(st);
      }
      out.push(entry);
    }
  }
  // `textParts`: parts whose width follows the root's (a full-width container) or the text; the diff reads them as soft like the root.
  // `textProps`: part -> properties whose used value follows the text (an auto margin resolved against the space a text box leaves); the diff reads those as soft.
  const body = JSON.stringify({ side: cfg.side, page: cfg.page + (theme === "dark" ? ".dark" : ""), theme, url: location.href, textParts: cfg.textParts ?? [], textProps: cfg.textProps ?? {}, roots: out });
  await fetch("http://localhost:4183/census", { method: "POST", mode: "cors", headers: { "content-type": "application/json" }, body });
  return { previews: previews.length, roots: out.length };
};

// Exported for the harness test; a browser ignores this, and the census reads `attr` directly.
if (typeof module !== "undefined") module.exports = { attr };
