// What ring does each focusable box draw, and does the other side draw the same?
//
// The reference draws every focus ring in the element that draws it, and has no page-wide rule; see
// notes/decisions/focus-ring-ownership.md. This reads the result on either side so the two can be
// compared.
//
// Reading it needs care. `el.focus()` from a script does not make `:focus-visible` match the way a
// Tab key does, and the reference's rings key off a `data-focus` attribute that react-aria sets on
// real keyboard focus rather than off the pseudo-class. A script focus therefore reads "no ring" on
// almost every box of the reference, which says nothing about the element. So the state is driven
// the way the census drives it: the attribute is set, and the sheets have already been rewritten so
// that a `:focus-visible` rule answers to it too.
//
// Load census.js first (it rewrites the sheets), then this, and call:
//   window.__ringReport("geist")   or   window.__ringReport("ours")

(() => {
  /** Every element under a node, shadow trees included. */
  const deep = (root, acc = []) => {
    for (const el of root.querySelectorAll("*")) {
      acc.push(el);
      if (el.shadowRoot) deep(el.shadowRoot, acc);
    }
    return acc;
  };

  /** A box a person can reach with the Tab key. `tabindex="-1"` is script-focusable only, so it
   *  never shows a focus-visible ring and needs none. */
  const focusable = (el) => {
    if (el.disabled || el.getAttribute("aria-disabled") === "true") return false;
    const t = el.localName;
    if (t === "button" || t === "input" || t === "textarea" || t === "select") return true;
    if (t === "a" && el.hasAttribute("href")) return true;
    const ti = el.getAttribute("tabindex");
    return ti !== null && ti !== "-1";
  };

  /** What a box shows: the shadow and outline values, kept whole. A category alone is not enough,
   *  because a secondary button carries a resting border shadow and its focus ring replaces that
   *  value while staying a shadow. Comparing categories would call such a ring "unchanged". */
  const shown = (el) => {
    const cs = getComputedStyle(el);
    return { shadow: cs.boxShadow, outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor };
  };
  const label = (v) => {
    if (v.shadow !== "none") return "own (shadow)";
    if (v.outlineStyle === "auto") return "browser";
    if (v.outlineStyle !== "none") return "own (outline)";
    return "none";
  };

  window.__rings = (side) => {
    const previews =
      side === "geist"
        ? [...document.querySelectorAll('button[aria-controls^="radix-"][data-state]')]
            .map((b) => b.closest("div.bg-background-200")?.previousElementSibling)
            .filter(Boolean)
        : [...document.querySelectorAll(".showcase .preview")];
    const out = [];
    for (const [pi, p] of previews.entries()) {
      for (const el of deep(p)) {
        if (!focusable(el)) continue;
        const rest = shown(el);
        // The census's own path: the attribute on the box and on everything under it, so a ring a
        // parent draws for a focused child is reached too.
        const marked = [el, ...deep(el)];
        const kept = marked.filter((n) => n.hasAttribute("data-focus"));
        for (const n of marked) n.setAttribute("data-focus", "true");
        void el.offsetHeight;
        const focused = shown(el);
        for (const n of marked) if (!kept.includes(n)) n.removeAttribute("data-focus");
        // A ring is what focus adds. Nothing changed means the box shows the same thing focused as
        // at rest, which is "browser only" where the user agent draws one and "none" where it does not.
        const changed = JSON.stringify(rest) !== JSON.stringify(focused);
        out.push({
          preview: pi,
          tag: el.localName,
          cls: (el.getAttribute("class") || "").trim().replace(/\s+/g, " ").slice(0, 30),
          inside: el.getRootNode().host?.localName ?? "(light dom)",
          rest: label(rest),
          focused: label(focused),
          ring: changed ? label(focused) : label(rest) === "browser" ? "browser only" : "none",
        });
      }
    }
    return out;
  };

  /** One report per side, for comparing the two. */
  window.__ringReport = (side) => {
    const rows = window.__rings(side);
    const tally = {};
    for (const r of rows) tally[r.ring] = (tally[r.ring] ?? 0) + 1;
    return {
      side,
      boxes: rows.length,
      tally,
      // The line that matters: a keyboard-reachable box that shows nothing at all when focused.
      silent: [...new Set(rows.filter((r) => r.ring === "none").map((r) => `${r.tag}.${r.cls} [${r.inside}]`))],
      rows: rows.map((r) => `${r.preview}:${r.tag}.${r.cls} [${r.inside}] ${r.rest} -> ${r.focused}`),
    };
  };
})();
