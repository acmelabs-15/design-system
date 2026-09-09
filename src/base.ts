// Shared base for every acme-* element: the shadow-root reset, the icon and screen-reader helpers,
// the Geist focus ring, and small helpers for class lists and icons.
import { type CSSResultGroup, css, html, LitElement, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";

/** Rules every shadow root needs: the reset the global sheet gives the page, plus .ic and .sr. */
export const sharedCss = css`
  *,*::before,*::after{box-sizing:border-box}
  :host{display:block}
  :host([hidden]){display:none !important}
  button,input,select,textarea{font-family:inherit;font-size:inherit;color:inherit}
  button{cursor:pointer}
  h1,h2,h3,h4,p{margin:0}
  a{color:var(--accent-ink);text-decoration:none}
  a:hover{text-decoration:underline}
  :focus{outline:none}
  :focus-visible{outline:none;box-shadow:var(--ring);border-radius:var(--r-sm)}
  .sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
  .ic{width:16px;height:16px;flex:none;stroke:currentColor;fill:none;stroke-width:1.85;stroke-linecap:round;stroke-linejoin:round}
  .mono{font-family:var(--mono)}
`;

export class AcmeElement extends LitElement {
  static styles: CSSResultGroup = sharedCss;
  /** Reflects a boolean/enum attribute into a class list on the inner element. */
  protected cls(base: string, extra: Record<string, boolean | undefined | null | string> = {}) {
    const map: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(extra)) if (v) map[k] = true;
    return classMap({ [base]: true, ...map });
  }
}

/** Inline icon from the page's symbol sprite (`<svg><symbol id="i-…">`), or a raw path set. */
export const icon = (name: string, cls = "ic"): TemplateResult => html`<svg class=${cls} aria-hidden="true"><use href=${`#i-${name}`}></use></svg>`;

/** Icons the components draw themselves, so a page needs no sprite for them. 24-box strokes. */
export const paths: Record<string, string> = {
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  chev: "m9 18 6-6-6-6",
  "chev-d": "m6 9 6 6 6-6",
  copy: "M8 8h12v12H8zM16 8V4H4v12h4",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8h.01M11 12h1v4h1",
  alert: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v4M12 16h.01",
  warn: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  arrow: "M5 12h14M12 5l7 7-7 7",
  back: "M19 12H5M12 19l-7-7 7-7",
  up: "M7 17 17 7M7 7h10v10",
  down: "M7 7l10 10M17 7v10H7",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  play: "M7 5v14l11-7z",
  pause: "M8 5h3v14H8zM13 5h3v14h-3z",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  file: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6",
  calendar: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  ext: "M14 4h6v6M20 4l-9 9M18 13v6H5V6h6",
};
export const glyph = (name: string, cls = "ic"): TemplateResult => html`<svg class=${cls} viewBox="0 0 24 24" aria-hidden="true"><path d=${paths[name] ?? ""}></path></svg>`;
