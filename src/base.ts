// Shared base for every acme-* element: the shadow-root reset, the icon and screen-reader helpers,
// and small helpers for class lists and icons.
import { type CSSResultGroup, css, html, LitElement, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";

/** Rules every shadow root needs: the reset the global sheet gives the page, plus .ic and .sr. The host takes the reset too: an element of ours slotted into another (a grid cell) then reads as a reset page element. */
export const sharedCss = css`
  :host,
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    border: 0 solid;
    border-color: var(--color-gray-200, currentcolor);
    margin: 0;
    padding: 0;
  }
  :host {
    display: block;
    tab-size: 4;
  }
  :host([hidden]) {
    display: none !important;
  }
  /* A slot has no box: a slotted element that inherits its background reaches through it to the slot's parent, as it would with no slot between them. */
  slot {
    background-color: inherit;
  }
  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    vertical-align: middle;
    display: block;
  }
  img,
  video {
    max-width: 100%;
    height: auto;
  }
  /* Slotted media takes the same reset: the page sheet gives it none, and a slotted icon in a plain wrapper is otherwise laid out inline, on a line box. */
  ::slotted(img),
  ::slotted(svg),
  ::slotted(video),
  ::slotted(canvas),
  ::slotted(audio),
  ::slotted(iframe),
  ::slotted(embed),
  ::slotted(object) {
    vertical-align: middle;
    display: block;
  }
  ::slotted(img),
  ::slotted(video) {
    max-width: 100%;
    height: auto;
  }
  button,
  input,
  select,
  optgroup,
  textarea {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    opacity: 1;
    background-color: #0000;
    border-radius: 0;
    padding: 0;
  }
  button {
    cursor: pointer;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  h1,
  h2,
  h3,
  h4,
  p,
  dl,
  dd {
    margin: 0;
  }
  /* A heading takes the text's size and weight, as the reference's base reset gives it: an element's heading is sized by its own derived rules. */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: var(--accent-ink);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  .ic {
    width: 16px;
    height: 16px;
    flex: none;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.85;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .mono {
    font-family: var(--mono);
  }
`;

/**
 * Registers composition variables document-wide, once each: a generated module's variables that
 * compose a property at runtime (the layers of a box-shadow) need their defaults registered, and an
 * `@property` rule inside a shadow tree's sheet registers nothing. A name already registered, or a
 * runtime without the registry, is passed over.
 */
export const registerProperties = (props: { name: string; syntax: string; inherits: boolean; initialValue?: string }[]) => {
  if (typeof CSS === "undefined" || typeof CSS.registerProperty !== "function") return;
  for (const p of props) {
    try {
      CSS.registerProperty(p);
    } catch {
      // Already registered by another module.
    }
  }
};

/**
 * Where the package's asset files (logos, textures) load from. The default is the published
 * package on the CDN; a page that serves the `assets/` directory itself sets its own base before
 * the elements render.
 */
export let assetsBase = "https://cdn.jsdelivr.net/npm/@acmelabs/design-system/assets/";
export const setAssetsBase = (url: string) => {
  assetsBase = url.endsWith("/") ? url : `${url}/`;
};

/** Converter for a boolean that defaults to true: `loop="false"` turns it off (the React convention `loop={false}`); a bare or any other attribute value keeps it on. */
export const boolish = {
  fromAttribute: (v: string | null) => v === null || v !== "false",
  toAttribute: (v: boolean) => String(v),
};

/**
 * The effective theme as a host attribute, so shadow styles keyed to the dark theme
 * rules can key off `:host([data-dark])`: dark when the root carries data-theme="dark", or when
 * it carries no explicit theme and the system prefers dark.
 */
const darkHosts = new Set<HTMLElement>();
let darkWatch: (() => void) | undefined;
const isDark = () => {
  const t = document.documentElement.dataset.theme;
  if (t === "dark") return true;
  if (t === "light") return false;
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches;
};
const paintDark = () => {
  const dark = isDark();
  for (const h of darkHosts) h.toggleAttribute("data-dark", dark);
};
const watchDark = (host: HTMLElement) => {
  darkHosts.add(host);
  host.toggleAttribute("data-dark", isDark());
  if (darkWatch || typeof MutationObserver === "undefined") return;
  const mo = new MutationObserver(paintDark);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = typeof matchMedia !== "undefined" ? matchMedia("(prefers-color-scheme: dark)") : undefined;
  mq?.addEventListener("change", paintDark);
  darkWatch = () => {
    mo.disconnect();
    mq?.removeEventListener("change", paintDark);
  };
};

export class AcmeElement extends LitElement {
  static styles: CSSResultGroup = sharedCss;
  connectedCallback() {
    super.connectedCallback();
    watchDark(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    darkHosts.delete(this);
  }
  /** Reflects a boolean/enum attribute into a class list on the inner element. */
  protected cls(base: string, extra: Record<string, boolean | undefined | null | string> = {}) {
    const map: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(extra)) if (v) map[k] = true;
    return classMap({ [base]: true, ...map });
  }
}

/** Inline icon from the page's symbol sprite (`<svg><symbol id="i-…">`), or a raw path set. */
export const icon = (name: string, cls = "ic"): TemplateResult => html`<svg class=${cls} width="16" height="16" aria-hidden="true"><use href=${`#i-${name}`}></use></svg>`;

/** Icons the components draw themselves, so a page needs no sprite for them. 24-box strokes. */
export const paths: Record<string, string> = {
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  chev: "m9 18 6-6-6-6",
  "chev-d": "m6 9 6 6 6-6",
  "chev-l": "m15 18-6-6 6-6",
  "chev-u": "m18 15-6-6-6 6",
  "arrow-u": "M12 19V5M5 12l7-7 7 7",
  "arrow-d": "M12 5v14M5 12l7 7 7-7",
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
  bolt: "M13 2 3 14h9l-1 8 10-12h-9z",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5",
  v0: "M2.5 8l4.5 8 4.5-8M13 10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM14 8.5l6 7",
};
export const glyph = (name: string, cls = "ic"): TemplateResult => html`<svg class=${cls} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d=${paths[name] ?? ""}></path></svg>`;
/** A glyph sized by its width/height attributes alone, no class: for an element whose own rules size or align its icon. */
export const glyphSized = (name: string, size = 16): TemplateResult =>
  html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${paths[name] ?? ""}></path></svg>`;
