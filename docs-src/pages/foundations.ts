// Foundations: Get Started, Colors, Typography, Materials. Geist's pages, with the demos built
// from the acme-* elements and the type classes tokens.css carries globally.
import { highlightHtml } from "../format";
import type { Doc } from "../site";
import { esc, ic, REPO, section, VERSION } from "../site";

const code = (src: string) => `<div class="showcase"><div class="code" style="display:block;border-top:0">${highlightHtml(src)}</div></div>`;

/* ---------- Get Started ---------- */
const cdn = `https://cdn.jsdelivr.net/npm/@acmelabs/design-system@${VERSION}`;
export const intro: Doc = {
  id: "index",
  title: "ACME Design System",
  lede: "The house system as web components: Geist foundations and every Geist component at Geist's values, set in Google Sans Flex and Google Sans Code, plus the house parts. Built with Lit, published to npm, usable from a CDN with no build step.",
  examples: [],
  body: `${section(
    "Use it from a CDN",
    `<p>Two tags. The stylesheet is the global layer: scales, semantic tokens, the reset, the type classes and the layout utilities. The script registers every <code>acme-*</code> element; each element carries its own styles in shadow DOM, so nothing else leaks.</p>${code(`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">
<link rel="stylesheet" href="${cdn}/tokens.css">
<script type="module" src="${cdn}/dist/bundle/design-system.min.js"></script>

<acme-button variant="primary">Deploy</acme-button>
<acme-badge hue="green" subtle>Ready</acme-badge>`)}<p style="margin-top:24px">The page-level recipes the Vercel dashboard composes in light DOM (deployment rows, plan heads, usage summaries) are in <code>${cdn}/dashboard.css</code>.</p>`,
    "The bundle is self-contained: Lit and the labs packages are inside it.",
  )}${section(
    "Install from npm",
    `${code(`bun add @acmelabs/design-system`)}<p style="margin-top:24px">Then import the package once; every element registers on import. The unbundled build keeps Lit as a peer, so one copy of Lit serves the whole app.</p>${code(`import "@acmelabs/design-system";
import "@acmelabs/design-system/tokens.css";`)}<p style="margin-top:24px">Single elements import from <code>dist</code>:</p>${code(`import "@acmelabs/design-system/dist/components/button/button.js";`)}`,
  )}${section(
    "Theme",
    `<p>Light is the default. The tokens follow <code>prefers-color-scheme</code>, and <code>data-theme="light"</code> or <code>data-theme="dark"</code> on the root element wins over it. <code>&lt;acme-theme-switcher&gt;</code> sets the attribute and persists the choice.</p><div class="demo-box" style="margin-top:24px"><acme-theme-switcher></acme-theme-switcher><acme-theme-switcher small></acme-theme-switcher></div>`,
  )}${section(
    "Foundations",
    `<div class="link-grid">
<a class="link-tile" href="/colors"><span class="prev"><span style="width:40px;height:40px;border-radius:6px;background:var(--ds-blue-700)"></span><span style="width:40px;height:40px;border-radius:6px;background:var(--ds-red-700)"></span><span style="width:40px;height:40px;border-radius:6px;background:var(--ds-amber-700)"></span><span style="width:40px;height:40px;border-radius:6px;background:var(--ds-green-700)"></span></span><span class="t">Colors</span><span class="d">Ten scales with a fixed role for every step, and the semantic tokens page rules use.</span></a>
<a class="link-tile" href="/typography"><span class="prev"><span class="text-heading-32">Aa</span><span class="text-copy-16 mono">0123</span></span><span class="t">Typography</span><span class="d">Geist's headings, copy, labels and buttons in Google Sans Flex and Google Sans Code.</span></a>
<a class="link-tile" href="/materials"><span class="prev"><span style="width:96px;height:64px;border-radius:12px;background:var(--surface);box-shadow:var(--ds-shadow-menu)"></span></span><span class="t">Materials</span><span class="d">Surface and floating shadows, radii and the focus ring.</span></a>
<a class="link-tile" href="/components/avatar"><span class="prev"><acme-button variant="primary">Deploy</acme-button><acme-badge hue="blue" subtle>Preview</acme-badge><acme-toggle checked></acme-toggle></span><span class="t">Components</span><span class="d">Every Geist component, in Geist's order, then the house parts.</span></a>
</div>`,
    "The tokens every page rule uses. Geist is the source of record; the type families are the house's.",
  )}${section(
    "Source priority",
    `<p>Where vercel.com/geist has the component, the color, the material or the type style, Geist's value is the value. The Vercel dashboard supplies only what Geist has no page for: the shell, page heads, folds, tables with bars, deployment and project rows, settings forms. Those are the house components, marked <acme-badge hue="purple" subtle size="small">house</acme-badge> in the sidebar.</p><p>Source: <a href="${REPO}">${REPO.replace("https://", "")}</a>.</p>`,
  )}`,
};

/* ---------- Colors ---------- */
const scales = ["gray", "gray-alpha", "blue", "red", "amber", "green", "teal", "purple", "pink"];
const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const usage = (title: string, lede: string, rows: [string, string, string][], demo: string) =>
  section(
    title,
    `${rows.map(([n, v, d]) => `<div class="def-row"><span class="d" style="background:var(${v})"></span><b>${n}</b><span>${d}</span></div>`).join("")}<div class="demo-box">${demo}</div>`,
    lede,
  );
export const colors: Doc = {
  id: "colors",
  title: "Colors",
  lede: "Ten scales with a fixed role for every step. The swatches read the live tokens, so they follow the theme.",
  examples: [],
  body: `${section(
    "Scales",
    `<div class="swatch-steps">${steps.map((s) => `<span>${s}</span>`).join("")}</div><div class="swatch-row"><span class="n">Backgrounds</span><span class="sw" style="background:var(--ds-background-100)" title="--ds-background-100"></span><span class="sw" style="background:var(--ds-background-200)" title="--ds-background-200"></span></div>${scales
      .map(
        (sc) =>
          `<div class="swatch-row"><span class="n">${sc.replace("-", " ")}</span>${steps.map((s) => `<span class="sw" style="background:var(--ds-${sc}-${s})" title="--ds-${sc}-${s}"></span>`).join("")}</div>`,
      )
      .join("")}`,
    "Steps 100 to 1000 run left to right. Hover a swatch for its token.",
  )}
${usage(
  "Backgrounds",
  "Two page grounds.",
  [
    ["Background 1", "--ds-background-100", "The default background of an element."],
    ["Background 2", "--ds-background-200", "Used sparingly for subtle differentiation."],
  ],
  `<span style="width:140px;height:64px;border-radius:6px;background:var(--ds-background-100);box-shadow:var(--ds-shadow-border);display:grid;place-items:center;font-size:12px;color:var(--text-2)">background-100</span><span style="width:140px;height:64px;border-radius:6px;background:var(--ds-background-200);box-shadow:var(--ds-shadow-border);display:grid;place-items:center;font-size:12px;color:var(--text-2)">background-200</span>`,
)}
${usage(
  "Component backgrounds",
  "Colors 1 to 3 are component backgrounds: default, hover, active. If a component's default is Background 1, use Color 1 for hover and Color 2 for active. Badges can use Color 2 or 3.",
  [
    ["Color 1", "--ds-gray-100", "Default"],
    ["Color 2", "--ds-gray-200", "Hover"],
    ["Color 3", "--ds-gray-300", "Active"],
  ],
  `<acme-button>Secondary</acme-button><acme-badge subtle>Badge</acme-badge><acme-kbd meta>K</acme-kbd>`,
)}
${usage(
  "Borders",
  "Colors 4 to 6 are borders: default, hover, active.",
  [
    ["Color 4", "--ds-gray-400", "Default"],
    ["Color 5", "--ds-gray-500", "Hover"],
    ["Color 6", "--ds-gray-600", "Active"],
  ],
  `<span style="width:140px;height:64px;border-radius:6px;border:1px solid var(--ds-gray-400)"></span><span style="width:140px;height:64px;border-radius:6px;border:1px solid var(--ds-gray-500)"></span><span style="width:140px;height:64px;border-radius:6px;border:1px solid var(--ds-gray-600)"></span>`,
)}
${usage(
  "High-contrast backgrounds",
  "Colors 7 and 8 are high-contrast backgrounds: default and hover.",
  [
    ["Color 7", "--ds-gray-700", "Default"],
    ["Color 8", "--ds-gray-800", "Hover"],
  ],
  `<span style="width:140px;height:64px;border-radius:6px;background:var(--ds-gray-700)"></span><span style="width:140px;height:64px;border-radius:6px;background:var(--ds-gray-800)"></span><acme-button variant="primary">Primary</acme-button>`,
)}
${usage(
  "Text and icons",
  "Colors 9 and 10 are text and icons: secondary and primary.",
  [
    ["Color 9", "--ds-gray-900", "Secondary"],
    ["Color 10", "--ds-gray-1000", "Primary"],
  ],
  `<span class="text-copy-16" style="color:var(--ds-gray-900)">Secondary text</span><span class="text-copy-16" style="color:var(--ds-gray-1000)">Primary text</span>${ic("gear")}`,
)}
${section("Semantic tokens", `<docs-tokens tokens="--bg --surface --surface-2 --comp --comp-hover --comp-active --border --border-hover --border-active --hair --text --text-2 --accent --accent-ink --accent-weak --success --success-ink --success-weak --warn --warn-ink --warn-weak --caution --caution-bg --caution-weak --contrast --contrast-strong --on-contrast --track --ds-focus-color --highlight --scrim-dark"></docs-tokens>`, "What page rules use. Each maps onto a scale step, so the theme switch carries every rule.")}
${section("Status and chart series", `<docs-tokens tokens="--st-ready --st-error --st-building --st-queued --st-online --chart-1 --chart-2 --chart-3 --chart-4 --chart-5"></docs-tokens>`, "The deployment status colors and the chart series, as the Vercel dashboard draws them; the same in both themes. Geist has no page for these.")}`,
};

/* ---------- Typography ---------- */
const trow = (ex: string, cls: string, use: string) => `<tr><td class="ex">${ex}</td><td class="cls">${cls}</td><td>${use}</td></tr>`;
const ttable = (rows: string) => `<table class="doc-table type-table"><thead><tr><th>Example</th><th>Class name</th><th>Usage</th></tr></thead><tbody>${rows}</tbody></table>`;
const headingRow = (c: string, m: string, u: string) => {
  const big = /(72|64|56|48)$/.test(c);
  const style = big ? ' style="font-size:40px;line-height:48px;letter-spacing:-2.4px"' : "";
  return trow(`<span class="${c}"${style}>Heading <strong style="font-weight:500;color:var(--text-2)">Subtle</strong></span>`, `.${c} · ${m}`, u);
};
export const typography: Doc = {
  id: "typography",
  title: "Typography",
  lede: "Geist's scale with Geist's metrics. Text is Google Sans Flex; numbers, labels and code are Google Sans Code. The families are settled and never follow a Geist update.",
  examples: [],
  body: `${section(
    "Headings",
    ttable(
      (
        [
          ["text-heading-72", "72/72 −4.32", "Hero titles on marketing pages"],
          ["text-heading-64", "64/64 −3.84", "Hero titles"],
          ["text-heading-56", "56/56 −3.36", "Section titles on marketing pages"],
          ["text-heading-48", "48/56 −2.88", "Page titles on marketing pages"],
          ["text-heading-40", "40/48 −2.4", "Docs page titles"],
          ["text-heading-32", "32/40 −1.28", "App page titles, .h1"],
          ["text-heading-24", "24/32 −0.96", "Section titles, .h2"],
          ["text-heading-20", "20/26 −0.4", "Settings card and modal titles, .h3"],
          ["text-heading-16", "16/24 −0.32", "Card and empty state titles, .h4"],
          ["text-heading-14", "14/20 −0.28", "Row titles, nav"],
        ] as [string, string, string][]
      )
        .map(([c, m, u]) => headingRow(c, m, u))
        .join(""),
    ),
    "Weight 600 with negative tracking. A nested <code>strong</code> at weight 500 in gray-900 is the Subtle modifier.",
  )}${section(
    "Buttons",
    ttable(
      (
        [
          ["text-button-16", "16/20", "Large buttons"],
          ["text-button-14", "14/20", "Default and small buttons"],
          ["text-button-12", "12/16", "A tiny button inside an input"],
        ] as [string, string, string][]
      )
        .map(([c, m, u]) => trow(`<span class="${c}">Button</span>`, `.${c} · ${m}`, u))
        .join(""),
    ),
    "Weight 500. The 12px style only inside an input.",
  )}${section(
    "Labels",
    ttable(
      (
        [
          ["text-label-20", "20/32", "Large labels"],
          ["text-label-18", "18/20", "Sheet titles"],
          ["text-label-16", "16/20", "Section labels"],
          ["text-label-14", "14/20", "The most common label; menus"],
          ["text-label-14-mono", "14/20 mono", "Identifiers beside a label"],
          ["text-label-13", "13/16", "Secondary line; tabular for numbers"],
          ["text-label-13-mono", "13/20 mono", "Pairs with label 14"],
          ["text-label-12", "12/16", "Tertiary; caps in calendars"],
          ["text-label-12-mono", "12/16 mono", "Tertiary identifiers"],
        ] as [string, string, string][]
      )
        .map(([c, m, u]) => trow(`<span class="${c}">Label <strong style="font-weight:500;color:var(--text)">Strong</strong></span>`, `.${c} · ${m}`, u))
        .join(""),
    ),
    "Weight 400. Strong is weight 500 in gray-1000; the base label reads gray-900 when it has a Strong.",
  )}${section(
    "Copy",
    ttable(
      (
        [
          ["text-copy-24", "24/36", "Large copy"],
          ["text-copy-20", "20/36", "Hero copy"],
          ["text-copy-18", "18/28", "Quotes"],
          ["text-copy-16", "16/24", "Modals and docs"],
          ["text-copy-16-mono", "16/24 mono", "Code in docs"],
          ["text-copy-14", "14/20", "The most common copy; body"],
          ["text-copy-14-mono", "14/20 mono", "Code beside body"],
          ["text-copy-13", "13/18", "Secondary copy where space is a premium"],
          ["text-copy-13-mono", "13/18 mono", "Inline code mentions"],
        ] as [string, string, string][]
      )
        .map(([c, m, u]) => trow(`<span class="${c}">Copy <strong style="font-weight:550">Strong</strong></span>`, `.${c} · ${m}`, u))
        .join(""),
    ),
    "Weight 400. Strong is weight 550.",
  )}${section(
    "House additions",
    ttable(
      trow(`<span class="eyebrow">Eyebrow label</span>`, ".eyebrow · 11 mono caps .09em", "Cell and card labels") +
        trow(`<span class="mono" style="font-size:24px;line-height:32px;font-weight:600;letter-spacing:-.96px">$62,450</span>`, "acme-stat value · 24/32 mono 600", "The one headline figure") +
        trow(`<span style="font-size:32px;line-height:40px;letter-spacing:-.79px;font-weight:600">2,847</span>`, "acme-strip-item value · 32/40 600", "The analytics strip figure"),
    ),
    "Styles Geist has no page for: the mono eyebrow label, the Stat value, and the analytics strip value from the dashboard.",
  )}`,
  practices: {
    Content: [
      "Headings and buttons in Title Case; sentence case everywhere else.",
      "Numerals for counts: 8 deployments. A non-breaking space between a number and its unit: 10&nbsp;MB.",
      "Curly quotes and the ellipsis character. Errors say how to fix it. “Save API Key”, not “Continue”.",
      "Numbers are mono and tabular so money and dates line up.",
    ],
  },
};

/* ---------- Materials ---------- */
const mat = (name: string, cls: string, sh: string, note: string) => `<div class="box ${cls}" style="box-shadow:var(${sh})"><span>${name}</span><small>${sh}</small><small>${note}</small></div>`;
export const materials: Doc = {
  id: "materials",
  title: "Materials",
  lede: "Shadows and radii that give a surface its place in the layered hierarchy. One material per element; the lowest elevation that still reads.",
  examples: [],
  body: `${section("Surface", `<div class="mat-ground"><div class="mat-grid">${mat("Base", "", "--ds-shadow-border", "radius 6 · everyday")}${mat("Small", "", "--ds-shadow-border-small", "radius 6 · slightly raised")}${mat("Medium", "r12", "--ds-shadow-border-medium", "radius 12")}${mat("Large", "r12", "--ds-shadow-border-large", "radius 12")}</div></div>`, "On the page.")}
${section("Floating", `<div class="mat-ground"><div class="mat-grid">${mat("Tooltip", "", "--ds-shadow-tooltip", "radius 6 · the only one with a stem")}${mat("Menu", "r12", "--ds-shadow-menu", "radius 12")}${mat("Modal", "r12", "--ds-shadow-modal", "radius 12")}${mat("Fullscreen", "r16", "--ds-shadow-fullscreen", "radius 16")}</div></div>`, "Above the page.")}
${section(
  "Tokens",
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
)}
${section("Radii", `<div class="demo-box" style="margin-top:0">${[4, 6, 8, 10, 12, 16].map((r) => `<span style="width:100px;height:56px;border-radius:${r}px;background:var(--comp);border:1px solid var(--border);display:grid;place-items:center;font-family:var(--mono);font-size:12px;color:var(--text-2)">${r}</span>`).join("")}<span style="width:100px;height:56px;border-radius:999px;background:var(--comp);border:1px solid var(--border);display:grid;place-items:center;font-family:var(--mono);font-size:12px;color:var(--text-2)">full</span></div>`, "4 for kbd and chips, 6 for controls and cards, 8 for large inputs, 10 for chart panels, 12 for menus and modals, 16 for sheets, full for pills.")}
${section("Focus", `<div class="demo-box" style="margin-top:0"><acme-button style="--ring-demo:1"><span style="display:contents">Tab to me</span></acme-button><acme-input placeholder="Then to me" style="width:200px"></acme-input></div>`, "Two pixels of the ground, then four of the focus blue; on <code>:focus-visible</code> only. Press Tab to see it.")}`,
  practices: {
    "When to use": [
      "One Material per element.",
      "Pick the type from where the element sits in the layered hierarchy.",
      "Prefer the lowest elevation that still reads.",
      "Semantics live on the role-bearing wrapper.",
      "Test both themes.",
    ],
  },
};

export const esc_ = esc;
