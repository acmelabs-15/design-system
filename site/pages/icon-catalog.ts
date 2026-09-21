import fs from "node:fs";
import path from "node:path";
import type { Doc } from "../site";
import { esc, section, VERSION } from "../site";
import catalog from "../../assets/material-symbols/catalog.json";
const source = path.resolve(import.meta.dir, "../../assets/material-symbols");
const groups = new Map<string, typeof catalog.symbols>();
for (const symbol of catalog.symbols) {
  const key = /^\d/.test(symbol.name) ? "0–9" : symbol.name[0].toUpperCase();
  const group = groups.get(key) ?? [];
  group.push(symbol);
  groups.set(key, group);
}
const rows = (symbols: typeof catalog.symbols) =>
  symbols
    .map((symbol) => {
      const preview = fs.readFileSync(path.join(source, symbol.assets[0].file), "utf8").replace("<svg ", '<svg aria-hidden="true" fill="currentColor" ');
      return `<tr id="${esc(symbol.tag)}"><td>${preview}</td><td><code>${esc(symbol.tag)}</code></td><td><code>icons/${esc(symbol.name.replaceAll("_", "-"))}</code></td><td>${symbol.assets.map((asset) => `<a href="https://raw.githubusercontent.com/google/material-design-icons/${catalog.revision}/${asset.source}">${asset.family} ${asset.filled ? "filled" : "unfilled"}</a>`).join(" · ")}</td></tr>`;
    })
    .join("");
export const icons: Doc = {
  id: "icons",
  title: "Icons",
  lede: "Material Symbols as individual SVG elements. Load the icons and artwork styles that your page uses.",
  tags: ["acme-home-icon"],
  catalogTags: catalog.symbols.map((symbol) => symbol.tag),
  examples: [{ h: "Decorative and named artwork", html: '<acme-home-icon></acme-home-icon> <acme-home-icon label="Home" size="24px"></acme-home-icon>' }],
  body:
    section(
      "Imports",
      `<p>For static HTML, import <code>https://cdn.jsdelivr.net/npm/@acmelabs/design-system@${VERSION}/dist/cdn/define/home-icon.js</code>. For a package consumer, import <code>@acmelabs/design-system/define/home-icon</code>. A class-only import is available from <code>@acmelabs/design-system/icons/home</code>.</p><p>Rounded and unfilled are the defaults. To use another style, first import its artwork, for example <code>@acmelabs/design-system/icons/artwork/sharp/filled/home</code>, then set <code>family="sharp" filled</code>. In static HTML the matching browser entry is <code>dist/cdn/generated/icons/artwork/sharp/filled/home.js</code>.</p><p><code>configureIcons({ family: "rounded", filled: false })</code> supplies library defaults. Explicit element properties override them. An unloaded style displays an explicit missing-artwork marker; the component never fetches an icon on its own.</p>`,
    ) +
    section(
      "Complete catalog",
      `<p>${catalog.symbols.length.toLocaleString("en-US")} symbols. Each has three families and two fill states at the 24px, weight-400 baseline. Expand a letter to inspect names and source artwork. Each name uses the same API shown below.</p>${[...groups].map(([letter, symbols]) => `<details><summary>${esc(letter)} (${symbols.length})</summary><table class="doc-table"><thead><tr><th>Preview</th><th>Element</th><th>Class import</th><th>Artwork</th></tr></thead><tbody>${rows(symbols)}</tbody></table></details>`).join("")}`,
    ),
  practices: {
    Accessibility: [
      "Omit label for artwork inside a named control. Supply label when the icon itself conveys an image name.",
      "An icon adds no button or keyboard behavior. Put action artwork inside Icon Button or Button.",
    ],
    Loading: [
      "Import only the icons and artwork your page needs. The main component entry includes icons required by its components; it does not register the complete optional catalog.",
      "An entire family/fill catalog can be installed explicitly from icons/families/rounded/filled. icons/all explicitly registers every icon with default artwork. These imports are intentionally larger.",
    ],
  },
};
