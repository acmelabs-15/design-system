// Foundations and assets, in the section structure of vercel.com/geist: Introduction, Colors,
// Typography, Materials (Grid is a component page listed under Foundations), Icons, Typeface.
// The house Tokens page holds what Geist has no section for. Prose is ours; structure, section
// names, class lists and values follow Geist's pages read as Markdown on Sep 9 2026.
import { paths } from "../../src/base";
import { highlightHtml } from "../format";
import type { Doc } from "../site";
import { ic, REPO, section, VERSION } from "../site";

const code = (src: string) => `<div class="showcase"><div class="code" style="display:block;border-top:0">${highlightHtml(src)}</div></div>`;
const cdn = `https://cdn.jsdelivr.net/npm/@acmelabs/design-system@${VERSION}`;
const tile = (href: string, title: string, desc: string, prev: string) =>
  `<a class="link-tile" href="${href}"><span class="prev">${prev}</span><span class="t">${title}</span><span class="d">${desc}</span></a>`;
const sw = (bg: string) => `<span style="width:40px;height:40px;border-radius:6px;background:${bg}"></span>`;

/* ---------- Introduction ---------- */
export const intro: Doc = {
  id: "index",
  title: "Introduction",
  lede: "The house design system for building consistent web experiences: the colors, typography, materials, layout and web components behind ACME's pages. Components are published as <code>@acmelabs/design-system</code>.",
  examples: [],
  body: `${section(
    "Foundations",
    `<div class="link-grid">${tile("/colors", "Colors", "A high contrast, accessible color system.", sw("var(--ds-blue-700)") + sw("var(--ds-red-700)") + sw("var(--ds-amber-700)") + sw("var(--ds-green-700)"))}${tile("/typography", "Typography", "Typeset with Google Sans Flex and Google Sans Code.", `<span class="text-heading-32">Aa</span><span class="text-copy-16 mono">0123</span>`)}${tile("/materials", "Materials", "Presets for radii, fills, strokes and shadows.", `<span style="width:96px;height:64px;border-radius:12px;background:var(--surface);box-shadow:var(--ds-shadow-menu)"></span>`)}${tile("/components/grid", "Grid", "Guide lines and cells, a core part of the aesthetic.", `<acme-grid columns="3" style="width:200px"><acme-grid-cell></acme-grid-cell><acme-grid-cell solid>2</acme-grid-cell><acme-grid-cell></acme-grid-cell></acme-grid>`)}</div>`,
  )}${section(
    "Assets",
    `<div class="link-grid">${tile("/icons", "Icons", "The icon set the elements draw, and the docs sprite.", `<span class="row" style="gap:16px">${["check", "search", "alert", "copy", "globe"].map((n) => ic(n)).join("")}</span>`)}${tile("/typeface", "Typeface", "Google Sans Flex and Google Sans Code.", `<span class="text-heading-24">Flex</span><span class="text-copy-16 mono">Code</span>`)}</div>`,
  )}${section(
    "Components",
    `<p>Building blocks for any page, available as web components from a CDN with no build step, or from npm. Every element is <code>acme-*</code> and registers on import.</p>${code(`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">
<link rel="stylesheet" href="${cdn}/tokens.css">
<script type="module" src="${cdn}/dist/bundle/design-system.min.js"></script>

<acme-button variant="primary">Deploy</acme-button>
<acme-badge hue="green" subtle>Ready</acme-badge>`)}<p style="margin-top:24px">A host that admits a script from a CDN but no stylesheet from one (the Claude artifact CSP is one) takes the standalone bundle, which installs <code>tokens.css</code> on import:</p>${code(`<script type="module" src="${cdn}/dist/bundle/design-system.standalone.min.js"></script>`)}<p style="margin-top:24px">From npm, one import registers every element; single elements import from <code>dist/components/&lt;name&gt;/&lt;name&gt;.js</code>.</p>${code(`bun add @acmelabs/design-system`)}${code(`import "@acmelabs/design-system";
import "@acmelabs/design-system/tokens.css";`)}<p style="margin-top:24px">Browse individual components under <code>/components/&lt;component&gt;</code>, for example <a href="/components/button">/components/button</a>. Source: <a href="${REPO}">${REPO.replace("https://", "")}</a>.</p>`,
  )}${section(
    "Markdown for agents",
    `<p>Every docs page is available as Markdown: append <code>.md</code> to any URL, for example <a href="/colors.md">/colors.md</a> or <a href="/components/button.md">/components/button.md</a>. The Markdown carries the same sections, the example markup and each element's API.</p>`,
  )}`,
};

/* ---------- Colors ---------- */
const scales = ["gray", "gray-alpha", "blue", "red", "amber", "green", "teal", "purple", "pink"];
const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const stepUse = [
  "Default background",
  "Hover background",
  "Active background",
  "Default border",
  "Hover border",
  "Active border",
  "High contrast background",
  "Hover high contrast background",
  "Secondary text and icons",
  "Primary text and icons",
];
const def = (rows: [string, string, string][]) =>
  rows
    .map(
      ([n, v, d]) =>
        `<div class="def-row"><span class="d" style="background:var(${v})"></span><b>${n}</b><span class="mono" style="font-size:12px;margin-right:12px">var(${v})</span><span>${d}</span></div>`,
    )
    .join("");
const box = (bg: string, label: string, extra = "") =>
  `<span style="width:140px;height:64px;border-radius:6px;background:${bg};${extra}display:grid;place-items:center;font-size:12px;color:var(--text-2)">${label}</span>`;
export const colors: Doc = {
  id: "colors",
  title: "Colors",
  lede: "How the color system works. Right click a swatch to copy its raw value.",
  examples: [],
  body: `${section(
    "Scales",
    `<div class="swatch-steps">${steps.map((s) => `<span>${s}</span>`).join("")}</div><div class="swatch-row"><span class="n">Backgrounds</span><span class="sw" style="background:var(--ds-background-100)" title="--ds-background-100"></span><span class="sw" style="background:var(--ds-background-200)" title="--ds-background-200"></span></div>${scales
      .map(
        (sc) =>
          `<div class="swatch-row"><span class="n">${sc.replace("-", " ")}</span>${steps.map((s) => `<span class="sw" style="background:var(--ds-${sc}-${s})" title="--ds-${sc}-${s}"></span>`).join("")}</div>`,
      )
      .join(
        "",
      )}<p class="text-copy-14" style="margin-top:8px">Each scale except the backgrounds has ten steps, and each step has one job:</p><table class="doc-table" style="margin-top:12px"><thead><tr><th>Step</th><th>Usage</th></tr></thead><tbody>${steps.map((s, i) => `<tr><td class="mono">${s}</td><td>${stepUse[i]}</td></tr>`).join("")}</tbody></table><p class="text-copy-14" style="margin-top:16px">The backgrounds scale has two values: Background 1 (<code>--ds-background-100</code>), the default element background, and Background 2 (<code>--ds-background-200</code>), the secondary background.</p>`,
    "There are 10 color scales in the system. P3 colors are used on supported browsers and displays.",
  )}${section(
    "Backgrounds",
    `${def([
      ["Background 1", "--ds-background-100", "Default element background"],
      ["Background 2", "--ds-background-200", "Secondary background"],
    ])}<div class="demo-box">${box("var(--ds-background-100)", "background-100", "box-shadow:var(--ds-shadow-border);")}${box("var(--ds-background-200)", "background-200", "box-shadow:var(--ds-shadow-border);")}</div>`,
    "Two background colors serve pages and components. Background 1 is the usual choice, and always when color sits on top of it. Background 2 is for a subtle difference, used sparingly.",
  )}${section(
    "Colors 1–3: Component Backgrounds",
    `${def([
      ["Color 1", "--ds-gray-100", "Default background"],
      ["Color 2", "--ds-gray-200", "Hover background"],
      ["Color 3", "--ds-gray-300", "Active background"],
    ])}<div class="demo-box"><acme-button>Secondary</acme-button><acme-badge subtle>Badge</acme-badge><acme-kbd meta>K</acme-kbd></div>`,
    "Three colors for component backgrounds. When a component's default background is Background 1, Color 1 is its hover and Color 2 its active background. Small elements such as badges can use Color 2 or Color 3.",
  )}${section(
    "Colors 4–6: Borders",
    `${def([
      ["Color 4", "--ds-gray-400", "Default border"],
      ["Color 5", "--ds-gray-500", "Hover border"],
      ["Color 6", "--ds-gray-600", "Active border"],
    ])}<div class="demo-box">${box("transparent", "400", "border:1px solid var(--ds-gray-400);")}${box("transparent", "500", "border:1px solid var(--ds-gray-500);")}${box("transparent", "600", "border:1px solid var(--ds-gray-600);")}</div>`,
    "Three colors for component borders.",
  )}${section(
    "Colors 7–8: High Contrast Backgrounds",
    `${def([
      ["Color 7", "--ds-gray-700", "High contrast background"],
      ["Color 8", "--ds-gray-800", "Hover high contrast background"],
    ])}<div class="demo-box">${box("var(--ds-gray-700)", "", "")}${box("var(--ds-gray-800)", "", "")}<acme-button variant="primary">Primary</acme-button></div>`,
    "Two colors for high contrast component backgrounds.",
  )}${section(
    "Colors 9–10: Text and Icons",
    `${def([
      ["Color 9", "--ds-gray-900", "Secondary text and icons"],
      ["Color 10", "--ds-gray-1000", "Primary text and icons"],
    ])}<div class="demo-box"><span class="text-copy-16" style="color:var(--ds-gray-900)">Secondary text</span><span class="text-copy-16" style="color:var(--ds-gray-1000)">Primary text</span>${ic("gear")}</div>`,
    "Two colors for accessible text and icons.",
  )}`,
};

/* ---------- Typography ---------- */
const trow = (ex: string, cls: string, use: string) => `<tr><td class="ex">${ex}</td><td class="cls">${cls}</td><td>${use}</td></tr>`;
const ttable = (rows: string) => `<table class="doc-table type-table"><thead><tr><th>Example</th><th>Class name</th><th>Usage</th></tr></thead><tbody>${rows}</tbody></table>`;
const heading = (c: string, subtle: boolean, use = "") => {
  const big = /(72|64|56|48)$/.test(c);
  const style = big ? ' style="font-size:40px;line-height:48px;letter-spacing:-2.4px"' : "";
  return trow(`<span class="${c}"${style}>Heading${subtle ? ' <strong style="font-weight:500;color:var(--text-2)">Subtle</strong>' : ""}</span>`, `.${c}${subtle ? " (Subtle)" : ""}`, use);
};
export const typography: Doc = {
  id: "typography",
  title: "Typography",
  lede: "Rules of typesetting throughout the system.",
  examples: [],
  body: `${section(
    "Usage",
    `<p>The type styles are classes in <code>tokens.css</code>. Each class presets a combination of font size, line height, letter spacing and weight. The families are Google Sans Flex for text and Google Sans Code for labels, numbers and code; a Geist update never changes them.</p><p style="margin-top:16px">For the Subtle and Strong modifiers, nest a <code>&lt;strong&gt;</code> element inside the class:</p>${code(`<p class="text-copy-16">
  Copy 16 <strong>with Strong</strong>
</p>`)}<div class="demo-box"><p class="text-copy-16">Copy 16 <strong>with Strong</strong></p></div>`,
  )}${section(
    "Headings",
    ttable(
      [
        heading("text-heading-72", false),
        heading("text-heading-64", false),
        heading("text-heading-56", false),
        heading("text-heading-48", false),
        heading("text-heading-40", false),
        heading("text-heading-32", true),
        heading("text-heading-24", true),
        heading("text-heading-20", true),
        heading("text-heading-16", true),
        heading("text-heading-14", false),
      ].join(""),
    ),
    "Used to introduce pages or sections.",
  )}${section(
    "Buttons",
    ttable(
      [
        ["text-button-16", "Largest button."],
        ["text-button-14", "Default button."],
        ["text-button-12", "Only used when a tiny button is placed inside an input field."],
      ]
        .map(([c, u]) => trow(`<span class="${c}">Button</span>`, `.${c}`, u))
        .join(""),
    ),
    "Only to be used within components that render buttons.",
  )}${section(
    "Label",
    ttable(
      (
        [
          ["text-label-20", false, ""],
          ["text-label-18", false, ""],
          ["text-label-16", true, "Used in titles to help differentiate from regular."],
          ["text-label-14", true, "Most common text style of all. Used in many menus."],
          ["text-label-14-mono", false, "Largest form of mono, to pair with larger (>14) text."],
          ["text-label-13", false, "Used as a secondary line next to other labels. Tabular is used when conveying numbers for consistent spacing."],
          ["text-label-13-mono", false, "Used to pair with Label 14, as the smaller mono size looks better in that pairing."],
          ["text-label-12", false, "Used for tertiary level text in busy views, like Comments, Show More and the capitals in Calendars."],
          ["text-label-12-mono", false, ""],
        ] as [string, boolean, string][]
      )
        .map(([c, strong, u]) => trow(`<span class="${c}">Label${strong ? ' <strong style="font-weight:500;color:var(--text)">Strong</strong>' : ""}</span>`, `.${c}${strong ? " (Strong)" : ""}`, u))
        .join(""),
    ),
    "Designed for single lines, with ample line height for highlighting and for sitting beside icons.",
  )}${section(
    "Copy",
    ttable(
      (
        [
          ["text-copy-24", true, "For hero areas on marketing pages."],
          ["text-copy-20", true, "For hero areas on marketing pages."],
          ["text-copy-18", true, "Mainly for marketing, big quotes."],
          ["text-copy-16", true, "Used in simpler, larger views like Modals where text can breathe."],
          ["text-copy-14", true, "Most commonly used text style."],
          ["text-copy-13", false, "For secondary text and views where space is a premium."],
          ["text-copy-13-mono", false, "Used for inline code mentions."],
        ] as [string, boolean, string][]
      )
        .map(([c, strong, u]) => trow(`<span class="${c}">Copy${strong ? ' <strong style="font-weight:550">Strong</strong>' : ""}</span>`, `.${c}${strong ? " (Strong)" : ""}`, u))
        .join(""),
    ),
    "Designed for multiple lines of text, with a higher line height than Label.",
  )}`,
};

/* ---------- Materials ---------- */
const mat = (name: string, cls: string, sh: string, note: string) => `<div class="box ${cls}" style="box-shadow:var(${sh})"><span>${name}</span><small>${sh}</small><small>${note}</small></div>`;
export const materials: Doc = {
  id: "materials",
  title: "Materials",
  lede: "Presets for radii, fills, strokes, and shadows.",
  examples: [],
  body: `${section("Surface", `<div class="mat-ground"><div class="mat-grid">${mat("material-base", "", "--ds-shadow-border", "Everyday use. Radius 6px.")}${mat("material-small", "", "--ds-shadow-border-small", "Slightly raised. Radius 6px.")}${mat("material-medium", "r12", "--ds-shadow-border-medium", "Further raised. Radius 12px.")}${mat("material-large", "r12", "--ds-shadow-border-large", "Further raised. Radius 12px.")}</div></div>`, "On the page.")}${section(
    "Floating",
    `<div class="mat-ground"><div class="mat-grid">${mat("material-tooltip", "", "--ds-shadow-tooltip", "Lightest shadow. Corner 6px. The only floating element with a triangular stem.")}${mat("material-menu", "r12", "--ds-shadow-menu", "Lift from page. Radius 12px.")}${mat("material-modal", "r12", "--ds-shadow-modal", "Further lift. Radius 12px.")}${mat("material-fullscreen", "r16", "--ds-shadow-fullscreen", "Biggest lift. Radius 16px.")}</div></div>`,
    "Above the page.",
  )}`,
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
          `<span class="vstack" style="gap:6px;align-items:center;width:72px"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true" style="width:20px;height:20px"><path d="${paths[n]}"></path></svg><span class="text-label-12-mono" style="color:var(--text-2)">${n}</span></span>`,
      )
      .join("")}</div>`,
    "Elements render these from <code>glyph(name)</code> in <code>base.ts</code>, so a page needs no sprite for a component's own icons: the copy button's check, the menu's lock, the note's alert. 24-box strokes at 16px.",
  )}${section(
    "Slot icons",
    `<p>Example markup passes icons into slots as inline SVG. Any 24-box stroke icon works; the docs use a sprite of symbols with <code>#i-&lt;name&gt;</code> ids, referenced as <code>&lt;svg class="ic"&gt;&lt;use href="#i-check"/&gt;&lt;/svg&gt;</code>. In an artifact, inline the paths you use.</p>${code(`<acme-button>
  <svg class="ic" slot="prefix" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
  Save
</acme-button>`)}<div class="demo-box"><acme-button><svg class="ic" slot="prefix" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>Save</acme-button><acme-badge hue="blue">${ic("rocket", ' slot="icon"')}Production</acme-badge></div>`,
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
