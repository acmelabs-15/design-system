import {readCorePackage} from "../scripts/core-package";
import type {DocCensusRecord} from "./recipes";
// The docs site shell in the vercel.com/geist docs anatomy: an app bar, a sidebar of pages, a
// content column with a hero, hairline-guided sections, showcases with "Show code", API tables
// and Best Practices. The chrome is the design system's own elements; every page rule uses tokens.
import fs from "node:fs";
import path from "node:path";
import { apiSections, type ElementApi } from "./api";
import { exampleId, exampleSources } from "./example-source";

/** `script` runs after the example mounts, as `(root) => {...}` with the preview element; it is shown under the markup in the code panel. */
/** `census`: the example exists for the parity census only (a state the reference page does not show); it renders on the element's census page, never on its docs page or its Markdown twin. */
export type Example = { h: string; p?: string; html: string; code?: string; language?: "html" | "typescript"; sourcePath?: string; entryPath?: string; registerFunction?: string; sourceFiles?: readonly string[]; script?: string; census?: boolean };
export type Doc = {
  id: string;
  title: string;
  lede: string;
  /** Elements the page documents; the API tables come from their source. */
  tags?: string[];
  /** Catalogued elements that share the displayed API and have individual catalog entries. */
  catalogTags?: string[];
  examples: Example[];
  practices?: Record<string, string[]>;
  /** Raw sections rendered after the examples (foundations pages). */
  body?: string;
  /** Markdown lines appended to the page's .md twin only: sections the reference's Markdown carries that its page does not render. */
  md?: string[];
};
export type Nav = { group: string; items: { title: string; href: string }[] }[];

const ROOT = path.resolve(import.meta.dir, "..");
export const OUT = path.join(ROOT, "_site");
const brandMarks = fs.readFileSync(path.join(import.meta.dir, "brand-marks.html"), "utf8");
const pkg = readCorePackage(ROOT);
const repository = pkg.repository;
if (!repository || typeof repository !== "object" || !("url" in repository) || typeof repository.url !== "string") throw new Error("Core package repository URL is required");
export const VERSION = pkg.version;
export const REPO = repository.url.replace(/^git\+/, "").replace(/\.git$/, "");

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export { iconMarkup as ic } from "./icon-markup";
import { iconMarkup as ic } from "./icon-markup";

/* ---------- renderers ---------- */
const slug = (h: string) =>
  h
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
export const section = (h: string, inner: string, p?: string, id = slug(h)) =>
  `<div class="doc-sec" id="${id}"><h2>${h}<a href="#${id}" aria-label="Link to ${h}">#</a></h2>${p ? `<p>${p}</p>` : ""}<div class="doc-body">${inner}</div></div>`;

export const showcase = async (e: Example, id = exampleId("example", e.h)) => {
  const sources = await exampleSources(e, id);
  const attr = e.script ? ` data-script="${esc(e.script).replace(/"/g, "&quot;")}"` : "";
  return `<div class="showcase" data-example="${id}"${attr}><template data-example-markup>${e.html}</template><div class="preview">${e.html}</div><p class="example-error" data-example-error role="alert" hidden></p><acme-collapsible class="example-source" lazy-mount><acme-h-stack justify-content="space-between" flex-wrap="wrap" gap="2"><acme-collapsible-trigger>Source code</acme-collapsible-trigger><acme-button data-example-reset variant="tertiary" size="small">Reset example</acme-button></acme-h-stack><acme-collapsible-content><template>${sources.map(source => `<acme-code-block language="${source.language === "typescript" ? "ts" : "html"}" code="${esc(source.code).replace(/"/g, "&quot;")}" filename="${esc(source.label)}" copyable wrap></acme-code-block>`).join("")}</template></acme-collapsible-content></acme-collapsible></div>`;
};

const practices = (p?: Record<string, string[]>) =>
  p
    ? section(
        "Best Practices",
        `<div class="practices">${Object.entries(p)
          .map(([k, v]) => `<h3>${k}</h3><ul>${v.map((x) => `<li>${x}</li>`).join("")}</ul>`)
          .join("")}</div>`,
      )
    : "";

export const docApi = (elements: ElementApi[]) => elements.length ? section("API", elements.map(element => `<div class="api-el" id="api-${esc(element.tag)}"><h3><code>&lt;${esc(element.tag)}&gt;</code><small>${esc(element.className)}</small></h3>${element.doc ? `<p>${esc(element.doc)}</p>` : ""}<p>Version ${esc(element.version)} · <a href="${REPO}/blob/main/${element.file}">Source</a></p>${apiSections(element).map(table => `<h4>${table.heading}</h4><acme-table class="doc-table-scroll" size="small" aria-label="${esc(element.tag)} ${table.heading}"><table class="doc-table"><thead><tr>${table.headings.map(heading => `<th scope="col">${heading}</th>`).join("")}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map((cell,index) => `<td class="${table.codeColumns.includes(index) ? "type" : ""}">${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></acme-table>`).join("")}</div>`).join(""), "Generated from the package manifest. Additional attributes are separate from read-only DOM properties. Set or omit returns an input to its inherited or default behavior.") : "";

export const docPage = async (d: Doc, api: ElementApi[]) =>
  `<article class="doc" id="${d.id}"><div class="doc-hero"><h1>${d.title}</h1><p>${d.lede}</p>${
    d.tags?.length ? `<div class="tags">${d.tags.map((t) => `<acme-badge variant="gray" contrast="low"><code>&lt;${t}&gt;</code></acme-badge>`).join("")}</div>` : ""
  }</div>${(await Promise.all(d.examples
    .filter((e) => !e.census)
    .map(async (e) => section(e.h, await showcase(e, exampleId(d.id, e.h)), e.p))))
    .join("")}${d.body ?? ""}${docApi(api)}${practices(d.practices)}</article>`;

/** The census page of an element: every example, the docs page's and the census-only ones, in the order the mirror renders them (page examples first, then sketches). */
export const censusPage = async (d: Doc, records: readonly DocCensusRecord[] = []) =>
  `<article class="doc census" id="census-${d.id}"><div class="doc-hero"><h1>${d.title} (census)</h1><p>Executable comparison fixtures. This page does not claim a new measurement.</p></div>${records.map(record => `<section class="doc-sec"><h2>Saved comparison · ${esc(record.recordedOn)}</h2><p>${esc(record.limitations)}</p><p>Fixture: ${esc(record.fixtureId)} · <a href="${REPO}/blob/${record.referenceRevision}/${record.configId}">Configuration</a></p><ul>${[...record.resultFiles,...record.acceptedDifferences].map(file=>`<li><a href="${REPO}/blob/${record.referenceRevision}/${file}">${esc(file)}</a></li>`).join("")}</ul></section>`).join("")}${(await Promise.all(d.examples.map(async (e) => section(e.h, await showcase(e, exampleId(d.id, e.h)), e.p)))).join("")}</article>`;

/* ---------- the shell and the fragments ---------- */
// index.html is the app shell; 404.html is the same file, so a deep link on GitHub Pages
// (which has no server) still loads the app, and the router reads the pathname.
export const shell = (nav: Nav) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ACME Design System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">
<script>
// Project sites on GitHub Pages live under /<repo>/; the stylesheets and the app resolve against it.
// The links are written here, after the prefix is known, so the preload scanner never fetches them from the root.
(() => { const p = location.hostname.endsWith("github.io") ? "/" + location.pathname.split("/")[1] : ""; window.__docsPrefix = p; document.write('<link rel="stylesheet" href="' + p + '/styles/tokens.css"><link rel="stylesheet" href="' + p + '/styles/dashboard.css"><link rel="stylesheet" href="' + p + '/styles/docs.css">'); })();
</script>
<script>window.__docsNav = ${JSON.stringify(nav)};</script>
</head>
<body>
${brandMarks}
<acme-docs-app></acme-docs-app>
<noscript><p style="padding:24px;font-family:sans-serif">The docs need JavaScript: every page is rendered by the design system's own components.</p></noscript>
<script>document.write('<script type="module" src="' + window.__docsPrefix + '/app.js"><\\/script>');</script>
</body>
</html>
`;

export function writeFragment(file: string, html: string) {
  const p = path.join(OUT, "pages", file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
}
