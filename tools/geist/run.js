// Runs a recorded census configuration in the page, one side and one theme per call.
//
// The recorded config in census/<page>.config.json is what makes a run repeatable, and it is the piece
// most often skipped. This turns it into the actual driver: the page fetches the config from the
// collector and runs every root in it, rather than a person pasting a hand-assembled call and hoping
// the fields match what was recorded.
//
// The judgement stays in the config. This file only executes it.
//
// Load it after census.js and call:
//   await window.__run("relative-time-card", "geist", "light")

(() => {
  const COLLECTOR = "http://localhost:4183";

  /** The roots a config names, in the order it lists them. */
  const rootsOf = (cfg) => Object.keys(cfg).filter((k) => !["note", "themes", "viewport", "width"].includes(k));

  /**
   * Runs every root of one config for one side and one theme. Returns a short report per root so a
   * caller can see what was measured without reading the whole payload back.
   *
   * A root the config does not describe for this side is skipped rather than guessed at: some roots
   * exist on one side only (a wrapper of ours that the reference has no counterpart for).
   */
  window.__run = async (page, side, theme) => {
    const res = await fetch(`${COLLECTOR}/config/${page}`);
    if (!res.ok) return { error: `no saved config for ${page}` };
    const cfg = await res.json();
    const out = [];
    for (const root of rootsOf(cfg)) {
      const entry = cfg[root]?.[side];
      if (!entry) {
        out.push({ root, skipped: `config names no ${side} side` });
        continue;
      }
      try {
        // The census returns counts, not the payload: { previews, roots }. It POSTs the readings to
        // the collector itself, so a zero here means nothing was found, not that nothing was saved.
        const r = await window.__census({ ...entry, theme });
        out.push({ root, previews: r?.previews ?? 0, roots: r?.roots ?? 0 });
      } catch (e) {
        out.push({ root, error: String(e && e.message ? e.message : e) });
      }
    }
    return { page, side, theme, themesInConfig: cfg.themes ?? null, results: out };
  };

  /** The themes a config asks for, so a caller knows how many passes to make. */
  window.__runThemes = async (page) => {
    const res = await fetch(`${COLLECTOR}/config/${page}`);
    return res.ok ? ((await res.json()).themes ?? ["light"]) : null;
  };
})();
