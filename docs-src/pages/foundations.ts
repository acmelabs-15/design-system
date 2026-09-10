// Foundations and assets, in the section structure of the reference's docs (vercel.com/geist):
// Introduction, Colors, Typography, Materials (Grid is a component page listed under Foundations),
// Icons, Typeface. The house Tokens page holds what the reference has no section for. Prose is
// ours; structure, section names, class lists and values follow the reference pages read in full
// (Markdown and rendered HTML) on Sep 9 2026. The type families are the one sanctioned difference.
import { paths } from "../../src/base";
import { highlightHtml } from "../format";
import type { Doc } from "../site";
import { esc, ic, REPO, section, VERSION } from "../site";

const code = (src: string) => `<div class="showcase"><div class="code" style="display:block;border-top:0">${highlightHtml(src)}</div></div>`;
const cdn = `https://cdn.jsdelivr.net/npm/@acmelabs/design-system@${VERSION}`;
const tile = (href: string, title: string, desc: string, prev: string) =>
  `<a class="link-tile" href="${href}"><span class="prev">${prev}</span><span class="t text-heading-16">${title}</span><span class="d text-copy-16">${desc}</span></a>`;
const hue = (name: string, step: number, inner: string) => `<span style="color:var(--ds-${name}-${step})">${inner}</span>`;

/* ---------- Introduction ---------- */
// The reference's page is a grid of six tiles, one per area, and no sections; its Markdown twin
// adds the sections (Foundations, Assets, Components, Markdown for agents). Ours does the same.
const iconRows = [
  ["check", "search", "alert", "copy", "globe", "gear", "bell", "user"],
  ["rocket", "branch", "cpu", "mem", "wifi", "clock", "cal", "file"],
  ["shield", "lock", "github", "folder", "play", "image", "filter", "trophy"],
];
const install = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">
<link rel="stylesheet" href="${cdn}/tokens.css">
<script type="module" src="${cdn}/dist/bundle/design-system.min.js"></script>

<acme-button>Deploy</acme-button>
<acme-badge variant="green" contrast="low">Ready</acme-badge>`;
export const intro: Doc = {
  id: "index",
  title: "ACME Design System",
  lede: "The house design system for building consistent web experiences.",
  examples: [],
  body: `<div class="link-grid">${tile("/icons", "Icons", "An icon set for developer tools.", `<span class="tile-icons">${iconRows.map((r) => `<span>${r.map((n) => ic(n)).join("")}</span>`).join("")}</span>`)}${tile(
    "/components/avatar",
    "Components",
    "Building blocks for any page.",
    `<span class="tile-comps"><acme-snippet text="bun add @acmelabs/design-system" width="100%"></acme-snippet><acme-button>${ic("users", ' slot="prefix"')}Collaborate</acme-button><acme-button aria-label="Shield" shape="square" svg-only>${ic("shield")}</acme-button><acme-theme-switcher small></acme-theme-switcher><acme-input label="Label" placeholder="Label" aria-label="Not a real input"></acme-input></span>`,
  )}${tile(
    "/colors",
    "Colors",
    "A high contrast, accessible color system.",
    `<span class="tile-dots">${["gray-800", "blue-800", "purple-700", "pink-800", "red-800", "amber-800", "green-800", "teal-800"].map((c) => `<span style="--c:var(--ds-${c})"></span>`).join("")}</span>`,
  )}${tile(
    "/components/grid",
    "Grid",
    "A core part of the house aesthetic.",
    `<acme-grid-system guide-width="1" use-container min-width="200" style="width:100%"><acme-grid columns="6" rows="3" height="preserve-aspect-ratio"><acme-grid-cross column="2" row="1"></acme-grid-cross><acme-grid-cross column="5" row="3"></acme-grid-cross></acme-grid></acme-grid-system>`,
  )}${tile(
    "/typeface",
    "Typeface",
    "Google Sans Flex and Google Sans Code.",
    `<span class="tile-type"><span class="text-heading-24">Google Sans Flex</span><span class="text-heading-24 mono">Google Sans Code</span></span>`,
  )}</div>`,
  md: [
    "## Foundations",
    "",
    "- **Colors** — A high contrast, accessible color system. See `/colors`.",
    "- **Typography** — Typeset with Google Sans Flex and Google Sans Code. See `/typography`.",
    "- **Materials** — Presets for radii, fills, strokes, and shadows. See `/materials`.",
    "- **Grid** — A core part of the house aesthetic. See `/components/grid`.",
    "",
    "## Assets",
    "",
    "- **Icons** — An icon set for developer tools. See `/icons`.",
    "- **Typeface** — Google Sans Flex and Google Sans Code. See `/typeface`.",
    "",
    "## Components",
    "",
    "Building blocks for any page, available as web components from a CDN with no build step, or from npm as `@acmelabs/design-system`. Every element is `acme-*` and registers on import.",
    "",
    "```html",
    install,
    "```",
    "",
    "A host that admits a script from a CDN but no stylesheet from one takes the standalone bundle, which installs `tokens.css` on import:",
    "",
    "```html",
    `<script type="module" src="${cdn}/dist/bundle/design-system.standalone.min.js"></script>`,
    "```",
    "",
    "From npm, one import registers every element; single elements import from `dist/components/<name>/<name>.js`.",
    "",
    "```ts",
    'import "@acmelabs/design-system";',
    'import "@acmelabs/design-system/tokens.css";',
    "```",
    "",
    `Browse individual components under \`/components/<component>\` (for example \`/components/button\`). Source: ${REPO}.`,
    "",
    "## Markdown for agents",
    "",
    "Every docs page is available as Markdown: append `.md` to any URL (for example `/colors.md` or `/components/button.md`). The Markdown carries the same sections, the example markup and each element's API.",
  ],
};

/* ---------- Colors ---------- */
const scales: [string, string, number][] = [
  ["Backgrounds", "background", 2],
  ["Gray", "gray", 10],
  ["Gray alpha", "gray-alpha", 10],
  ["Blue", "blue", 10],
  ["Red", "red", 10],
  ["Amber", "amber", 10],
  ["Green", "green", 10],
  ["Teal", "teal", 10],
  ["Purple", "purple", 10],
  ["Pink", "pink", 10],
];
const swatchRow = ([name, id, n]: [string, string, number]) =>
  `<div class="swatch-row"><span class="n">${name}</span>${Array.from({ length: n }, (_, i) => `<docs-swatch token="--ds-${id}-${(i + 1) * 100}"></docs-swatch>`).join("")}</div>`;
const def = (rows: [string, string, string][]) =>
  rows
    .map(
      ([n, v, d]) =>
        `<div class="def-row"><span class="d" style="background:var(${v})"></span><b>${n}</b><span class="mono" style="font-size:12px;margin-right:12px">var(${v})</span><span>${d}</span></div>`,
    )
    .join("");
const logRow = (warn = false) =>
  `<li${warn ? ' class="warn"' : ""}>${ic(warn ? "warn-tri" : "info")}<span class="text-copy-13-mono">APR 26 15:54:21.12</span><span class="vr"></span><span class="text-copy-13-mono">/dashboard/overview</span></li>`;
// The custom colors travel as JSON in single-quoted attributes, as on the Button page.
const custom = (fg: string, bg: string, border: string) => JSON.stringify({ foreground: fg, background: bg, border });
export const colors: Doc = {
  id: "colors",
  title: "Colors",
  lede: "How the color system works. Right click a swatch to copy its raw value.",
  examples: [],
  body: `${section("Scales", scales.map(swatchRow).join(""), "There are 10 color scales in the system. P3 colors are used on supported browsers and displays.")}${section(
    "Backgrounds",
    `${def([
      ["Background 1", "--ds-background-100", "Default element background"],
      ["Background 2", "--ds-background-200", "Secondary background"],
    ])}<div class="ex-split" style="margin-top:40px"><div style="background:var(--ds-background-100)"><span class="ex-cell"><span>1</span><span>2</span></span></div><div style="background:var(--ds-background-200)"><span class="ex-cell"><span>1</span><span>2</span></span></div></div>`,
    "Two background colors serve pages and components. Background 1 is the usual choice, and always when color sits on top of the background. Background 2 is for a subtle difference, used sparingly.",
  )}${section(
    "Colors 1–3: Component Backgrounds",
    `${def([
      ["Color 1", "--ds-gray-100", "Default background"],
      ["Color 2", "--ds-gray-200", "Hover background"],
      ["Color 3", "--ds-gray-300", "Active background"],
    ])}<p class="text-copy-16" style="color:var(--text-2);margin-top:16px;max-width:72ch">When a component's default background is Background 1, Color 1 is its hover background and Color 2 its active background. A small element such as a badge can take Color 2 or Color 3 as its background.</p><div class="ex-logs" style="margin-top:40px"><ul>${logRow()}${logRow(true)}${logRow()}${logRow()}</ul><div class="foot"><acme-pill>Hobby</acme-pill><acme-pill>Pro</acme-pill><acme-pill>Enterprise</acme-pill></div></div>`,
    "Three colors for component backgrounds.",
  )}${section(
    "Colors 4-6: Borders",
    `${def([
      ["Color 4", "--ds-gray-400", "Default border"],
      ["Color 5", "--ds-gray-500", "Hover border"],
      ["Color 6", "--ds-gray-600", "Active border"],
    ])}<div class="ex-box" style="margin-top:40px"><acme-button>New Project</acme-button></div>`,
    "Three colors for component borders.",
  )}${section(
    "Colors 7-8: High Contrast Backgrounds",
    `${def([
      ["Color 7", "--ds-gray-700", "High contrast background"],
      ["Color 8", "--ds-gray-800", "Hover high contrast background"],
    ])}<div class="ex-box" style="margin-top:40px;gap:48px"><span class="row" style="gap:20px"><acme-gauge size="medium" value="90" show-value></acme-gauge><acme-gauge size="medium" value="55" show-value></acme-gauge><acme-gauge size="medium" value="20" show-value></acme-gauge></span><acme-button variant="custom" normal='${custom("#fff", "var(--ds-blue-700)", "var(--ds-blue-700)")}' hover='${custom("#fff", "#0B7BFE", "var(--ds-blue-700)")}' active='${custom("#fff", "var(--ds-blue-700)", "var(--ds-blue-700)")}' width="160">Upgrade to Pro</acme-button></div>`,
    "Two colors for high contrast component backgrounds.",
  )}${section(
    "Colors 9-10: Text and Icons",
    `${def([
      ["Color 9", "--ds-gray-900", "Secondary text and icons"],
      ["Color 10", "--ds-gray-1000", "Primary text and icons"],
    ])}<div class="ex-box col" style="margin-top:40px"><div class="vstack" style="gap:4px;max-width:420px;padding:48px 24px"><span class="text-heading-16">The house design system</span><span class="text-copy-14" style="color:var(--ds-gray-900)">Build consistent pages with one set of elements, tokens and rules.</span><a class="text-copy-14" href="/" style="display:inline-flex;align-items:center;gap:2px;margin-top:8px;color:var(--ds-blue-900);text-decoration:none">Learn More ${ic("chevron-down", ' style="transform:rotate(-90deg)"')}</a></div><div class="icons">${hue("blue", 900, ic("globe"))}${hue("red", 900, ic("alert"))}${hue("amber", 900, ic("warn-tri"))}${hue("green", 900, ic("check-circle"))}${hue("pink", 900, ic("bell"))}${hue("teal", 900, ic("check-circle-fill"))}</div></div>`,
    "Two colors for accessible text and icons.",
  )}`,
};

/* ---------- Typography ---------- */
// Three columns as the reference's tables: the example set in the class, the class name, the usage.
const trow = (ex: string, cls: string, use: string) => `<tr><td class="ex">${ex}</td><td class="cls">${cls}</td><td>${use || "—"}</td></tr>`;
const ttable = (rows: string) =>
  `<div class="table-scroll"><table class="doc-table type-table"><thead><tr><th>Example</th><th>Class name</th><th>Usage</th></tr></thead><tbody>${rows}</tbody></table></div>`;
const typeRow = (c: string, label: string, mod: string, use: string) => trow(`<span class="${c}">${label}${mod}</span>`, c, use);
const sizeOf = (c: string) => c.replace(/^text-[a-z]+-/, "").replace("-mono", " Mono");
export const typography: Doc = {
  id: "typography",
  title: "Typography",
  lede: "Rules of typesetting throughout the system.",
  examples: [],
  body: `${section(
    "Usage",
    `<p>The type styles are classes in <code>tokens.css</code>. Each class presets a combination of <code>font-size</code>, <code>line-height</code>, <code>letter-spacing</code> and <code>font-weight</code>. The families are Google Sans Flex for text and Google Sans Code for labels, numbers and code; the scale, the weights and the line heights are the system's.</p><p style="margin-top:16px">For the <strong>Subtle</strong> and <strong>Strong</strong> modifiers, nest a <code>&lt;strong&gt;</code> element inside the element that carries the class:</p><acme-code-block language="html" aria-label="Copy 16 with Strong" style="display:block;margin-top:16px">${esc(`<p class="text-copy-16">
  Copy 16 <strong>with Strong</strong>
</p>`)}</acme-code-block>`,
  )}${section(
    "Headings",
    ttable(
      ["text-heading-72", "text-heading-64", "text-heading-56", "text-heading-48", "text-heading-40", "text-heading-32", "text-heading-24", "text-heading-20", "text-heading-16", "text-heading-14"]
        .map((c) => typeRow(c, `Heading ${sizeOf(c)}`, /(32|24|20|16)$/.test(c) ? " <strong>with Subtle</strong>" : "", ""))
        .join(""),
    ),
    "Used to introduce pages or sections.",
  )}${section(
    "Buttons",
    ttable(
      (
        [
          ["text-button-16", "Largest button."],
          ["text-button-14", "Default button."],
          ["text-button-12", "Only used when a tiny button is placed inside an input field."],
        ] as [string, string][]
      )
        .map(([c, u]) => typeRow(c, `Button ${sizeOf(c)}`, "", u))
        .join(""),
    ),
    "Only to be used within components that render buttons.",
  )}${section(
    "Label",
    ttable(
      (
        [
          ["text-label-20", "", ""],
          ["text-label-18", "", ""],
          ["text-label-16", " <strong>with Strong</strong>", "Used in titles to help differentiate from regular."],
          ["text-label-14", " <strong>with Strong</strong>", "Most common text style of all. Used in many menus."],
          ["text-label-14-mono", "", "Largest form of mono, to pair with larger (&gt;14) text."],
          ["text-label-13", " <strong>with Strong, and Tabular (123)</strong>", "Used as a secondary line next to other labels. Tabular is used when conveying numbers for consistent spacing."],
          ["text-label-13-mono", "", "Used to pair with Label 14, as the smaller mono size looks better in that pairing."],
          ["text-label-12", " <strong>with Strong</strong>, AND CAPS", "Used for tertiary level text in busy views, like Comments, Show More and the capitals in Calendars."],
          ["text-label-12-mono", "", ""],
        ] as [string, string, string][]
      )
        .map(([c, mod, u]) => typeRow(c, `Label ${sizeOf(c)}`, mod, u))
        .join(""),
    ),
    "Designed for single lines, with ample line height for highlighting and for sitting beside icons.",
  )}${section(
    "Copy",
    ttable(
      (
        [
          ["text-copy-24", " <strong>with Strong</strong>", "For hero areas on marketing pages."],
          ["text-copy-20", " <strong>with Strong</strong>", "For hero areas on marketing pages."],
          ["text-copy-18", " <strong>with Strong</strong>", "Mainly for marketing, big quotes."],
          ["text-copy-16", " <strong>with Strong</strong>", "Used in simpler, larger views like Modals where text can breathe."],
          ["text-copy-14", " <strong>with Strong</strong>", "Most commonly used text style."],
          ["text-copy-13", "", "For secondary text and views where space is a premium."],
          ["text-copy-13-mono", "", "Used for inline code mentions."],
        ] as [string, string, string][]
      )
        .map(([c, mod, u]) => typeRow(c, `Copy ${sizeOf(c)}`, mod, u))
        .join(""),
    ),
    "Designed for multiple lines of text, with a higher line height than Label.",
  )}`,
};

/* ---------- Materials ---------- */
// The same three columns; the example is a 240 by 100 box in the material's class.
const mrow = (cls: string, use: string) => trow(`<div class="mat-ex ${cls}">${cls}</div>`, cls, use);
export const materials: Doc = {
  id: "materials",
  title: "Materials",
  lede: "Presets for radii, fills, strokes, and shadows.",
  examples: [],
  body: `${section(
    "Surface",
    ttable(
      [
        mrow("material-base", "Everyday use. Radius 6px."),
        mrow("material-small", "Slightly raised. Radius 6px."),
        mrow("material-medium", "Further raised. Radius 12px."),
        mrow("material-large", "Further raised. Radius 12px."),
      ].join(""),
    ),
    "On the page.",
  )}${section(
    "Floating",
    ttable(
      [
        mrow("material-tooltip", "Lightest shadow. Corner 6px. The tooltip is the only floating element with a triangular stem."),
        mrow("material-menu", "Lift from page. Radius 12px."),
        mrow("material-modal", "Further lift. Radius 12px."),
        mrow("material-fullscreen", "Biggest lift. Radius 16px."),
      ].join(""),
    ),
    "Above the page.",
  )}`,
  practices: {
    "When to use": [
      "Use a material instead of hand-rolling radii, fills, strokes and shadows on a surface; the preset encodes the elevation role.",
      "Pick the preset from where the element sits in the layered hierarchy: <code>base</code> for resting cards, <code>small</code> to <code>large</code> for raised content, <code>tooltip</code> and <code>menu</code> for floating popovers, <code>modal</code> for dialogs, <code>fullscreen</code> for takeovers.",
      "Do not stack two materials on one element; when a child needs more elevation, lift it into its own material with a higher preset.",
    ],
    Behavior: [
      "Align the elevation with the element's <code>z-index</code> band, so a <code>tooltip</code> surface never sits visually below a <code>base</code> card.",
      "Favor the lowest elevation that still reads as raised against its background; over-elevating is a common source of visual noise.",
      "Let the preset drive the chrome and use layout spacing for layout, instead of overriding shadows on the same element.",
    ],
    Accessibility: [
      'A material is decorative chrome; semantics live on the role-bearing wrapper (<code>role="dialog"</code> on a modal, <code>role="tooltip"</code> on a tooltip).',
      "Do not rely on shadow alone to communicate elevation; pair it with the focus-visible ring on the focusable children inside.",
      "Test materials in both themes: shadow contrast on dark backgrounds is weaker than on light, so confirm the separation still reads.",
    ],
  },
};

/* ---------- Icons ---------- */
export const icons: Doc = {
  id: "icons",
  title: "Icons",
  lede: "The icons the elements draw themselves, and the sprite the docs examples use for prefix, suffix and icon slots.",
  examples: [],
  body: `${section(
    "Built-in glyphs",
    `<div class="row" style="gap:16px">${Object.keys(paths)
      .map(
        (n) =>
          `<span class="vstack" style="gap:6px;align-items:center;width:72px"><svg class="ic" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style="width:20px;height:20px"><path d="${paths[n]}"></path></svg><span class="text-label-12-mono" style="color:var(--text-2)">${n}</span></span>`,
      )
      .join("")}</div>`,
    "Elements render these from <code>glyph(name)</code> in <code>base.ts</code>, so a page needs no sprite for a component's own icons: the copy button's check, the menu's lock, the note's alert. 24-box strokes at 16px.",
  )}${section(
    "Slot icons",
    `<p>Example markup passes icons into slots as inline SVG. Any 24-box stroke icon works; the docs use a sprite of symbols with <code>#i-&lt;name&gt;</code> ids, referenced as <code>&lt;svg class="ic"&gt;&lt;use href="#i-check"/&gt;&lt;/svg&gt;</code>. In an artifact, inline the paths you use.</p>${code(`<acme-button>
  <svg class="ic" width="16" height="16" slot="prefix" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
  Save
</acme-button>`)}<div class="demo-box"><acme-button><svg class="ic" width="16" height="16" slot="prefix" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>Save</acme-button><acme-badge variant="blue">${ic("rocket", ' slot="icon"')}Production</acme-badge></div>`,
  )}`,
};

/* ---------- Typeface ---------- */
export const typeface: Doc = {
  id: "typeface",
  title: "Typeface",
  lede: "Google Sans Flex for text and Google Sans Code for labels, numbers and code. The families are settled; a Geist update never changes them.",
  examples: [],
  body: `${section(
    "Load the fonts",
    `${code(`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">`)}<p style="margin-top:24px">Text is Google Sans Flex, the variable family, at weights 400 to 700. Labels, numbers and code are Google Sans Code; on a machine with the Nerd Font build installed, the stack picks <code>GoogleSansCode Nerd Font Mono</code> first, which adds the icon glyphs. The fallback stacks are in <code>tokens.css</code>.</p>`,
    "One stylesheet link from Google Fonts.",
  )}${section(
    "Specimen",
    `<div class="vstack" style="gap:16px"><span class="text-heading-48">Google Sans Flex</span><span class="text-copy-16">The quick brown fox jumps over the lazy dog. 0123456789</span><span class="text-heading-24" style="font-family:var(--mono)">Google Sans Code</span><span class="text-copy-14-mono">const deploy = await vercel.deploy("acme"); // 0123456789</span></div>`,
  )}`,
};

/* ---------- Tokens (house) ---------- */
export const tokens: Doc = {
  id: "tokens",
  title: "Tokens",
  lede: "The semantic layer page rules use on top of Geist's scales, the deployment and chart colors, the radii and the focus ring. A house page; Geist has no section for these.",
  house: true,
  examples: [],
  body: `${section("Semantic tokens", `<docs-tokens tokens="--bg --surface --surface-2 --comp --comp-hover --comp-active --border --border-hover --border-active --hair --text --text-2 --accent --accent-ink --accent-weak --success --success-ink --success-weak --warn --warn-ink --warn-weak --caution --caution-bg --caution-weak --contrast --contrast-strong --on-contrast --track --ds-focus-color --highlight --scrim-dark"></docs-tokens>`, "What page rules use. Each maps onto a scale step, so the theme switch carries every rule.")}
${section("Status and chart series", `<docs-tokens tokens="--st-ready --st-error --st-building --st-queued --st-online --chart-1 --chart-2 --chart-3 --chart-4 --chart-5"></docs-tokens>`, "The deployment status colors and the chart series, as the Vercel dashboard draws them; the same in both themes.")}
${section(
  "Shadow tokens",
  `<table class="doc-table"><thead><tr><th>Example</th><th>Token</th><th>Usage</th></tr></thead><tbody>${(
    [
      ["--ds-shadow-border", "Cards, panels, pills, the kbd"],
      ["--ds-shadow-small", "A raised card without a border"],
      ["--ds-shadow-border-small", "Link cards, chart panels"],
      ["--ds-shadow-medium", "Hover on a link card"],
      ["--ds-shadow-border-medium", "Feature cards"],
      ["--ds-shadow-large", "Marketing cards"],
      ["--ds-shadow-border-large", "Marketing cards"],
      ["--ds-shadow-tooltip", "Chart tooltips"],
      ["--ds-shadow-menu", "Menus, toasts"],
      ["--ds-shadow-modal", "Modals"],
      ["--ds-shadow-fullscreen", "Sheets"],
      ["--ds-shadow-border-inset", "Pills, badges as links, swatches"],
    ] as [string, string][]
  )
    .map(
      ([t, u]) =>
        `<tr><td><span style="display:inline-block;width:96px;height:40px;border-radius:6px;background:var(--surface);box-shadow:var(${t})"></span></td><td class="cls">${t}</td><td>${u}</td></tr>`,
    )
    .join("")}</tbody></table>`,
  "The material presets as tokens.",
)}
${section("Radii", `<div class="demo-box" style="margin-top:0">${[4, 6, 8, 10, 12, 16].map((r) => `<span style="width:100px;height:56px;border-radius:${r}px;background:var(--comp);border:1px solid var(--border);display:grid;place-items:center;font-family:var(--mono);font-size:12px;color:var(--text-2)">${r}</span>`).join("")}<span style="width:100px;height:56px;border-radius:999px;background:var(--comp);border:1px solid var(--border);display:grid;place-items:center;font-family:var(--mono);font-size:12px;color:var(--text-2)">full</span></div>`, "4 for kbd and chips, 6 for controls and cards, 8 for large inputs, 10 for chart panels, 12 for menus and modals, 16 for sheets, full for pills.")}
${section("Focus", `<div class="demo-box" style="margin-top:0"><acme-button>Tab to me</acme-button><acme-input placeholder="Then to me" style="width:200px"></acme-input></div>`, "Two pixels of the ground, then four of the focus blue; on <code>:focus-visible</code> only. Press Tab to see it.")}
${section(
  "House type styles",
  ttable(
    trow(`<span class="eyebrow">Eyebrow label</span>`, ".eyebrow · 11 mono caps .09em", "Cell and card labels") +
      trow(`<span class="mono" style="font-size:24px;line-height:32px;font-weight:600;letter-spacing:-.96px">$62,450</span>`, "acme-stat value · 24/32 mono 600", "The one headline figure") +
      trow(`<span style="font-size:32px;line-height:40px;letter-spacing:-.79px;font-weight:600">2,847</span>`, "acme-strip-item value · 32/40 600", "The analytics strip figure"),
  ),
  "Styles Geist has no page for: the mono eyebrow label, the Stat value, and the analytics strip value from the dashboard.",
)}`,
};
