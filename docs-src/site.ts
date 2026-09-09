// The docs site shell in the vercel.com/geist docs anatomy: an app bar, a sidebar of pages, a
// content column with a hero, hairline-guided sections, showcases with "Show code", API tables
// and Best Practices. The chrome is the design system's own elements; every page rule uses tokens.
import fs from "node:fs";
import path from "node:path";
import type { ElementApi } from "./api";
import { formatHtml, highlightHtml } from "./format";

export type Example = { h: string; p?: string; html: string; code?: string };
export type Doc = {
  id: string;
  title: string;
  lede: string;
  /** Elements the page documents; the API tables come from their source. */
  tags?: string[];
  house?: boolean;
  examples: Example[];
  practices?: Record<string, string[]>;
  /** Raw sections rendered after the examples (foundations pages). */
  body?: string;
};
export type Nav = { group: string; items: { title: string; href: string; house?: boolean }[] }[];

const ROOT = path.resolve(import.meta.dir, "..");
export const OUT = path.join(ROOT, "docs");
const symbols = fs.readFileSync(path.join(import.meta.dir, "symbols.html"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")) as { version: string; repository: { url: string } };
export const VERSION = pkg.version;
export const REPO = pkg.repository.url.replace(/^git\+/, "").replace(/\.git$/, "");

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const ic = (n: string, extra = "") => `<svg class="ic"${extra} aria-hidden="true"><use href="#i-${n}"/></svg>`;

/* ---------- page rules (tokens only) ---------- */
export const pageCss = `
.docs{display:grid;grid-template-columns:260px minmax(0,1fr);min-height:100vh}
.docs-side{position:sticky;top:var(--bar-h);height:calc(100vh - var(--bar-h));overflow:auto;border-right:1px solid var(--border);padding:24px 16px 48px;scrollbar-width:thin}
.docs-side .grp{font-size:14px;line-height:20px;font-weight:500;padding:8px 8px;margin-top:8px;color:var(--text)}
.docs-side a{display:flex;align-items:center;height:36px;padding:0 8px;border-radius:var(--r-sm);font-size:14px;line-height:20px;color:var(--text-2);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.docs-side a:hover{color:var(--text);background:var(--comp);text-decoration:none}
.docs-side a[aria-current="page"]{color:var(--text);background:var(--ds-gray-200)}
.docs-side a .house{margin-left:auto;font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ds-gray-700)}
.docs-main{min-width:0;padding:0 48px 96px}
.doc{max-width:960px;margin:0 auto}
.doc-hero{padding:48px 0 32px}
.doc-hero h1{font-size:40px;line-height:48px;letter-spacing:-2.4px;font-weight:600}
.doc-hero p{font-size:20px;line-height:36px;color:var(--text-2);margin-top:4px}
.doc-hero .tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.doc-sec{padding:40px 0;border-top:1px solid var(--border);scroll-margin-top:calc(var(--bar-h) + 16px)}
.doc-sec h2{font-size:24px;line-height:32px;letter-spacing:-.96px;font-weight:600;display:flex;align-items:center;gap:8px}
.doc-sec h2 a{color:var(--text-2);opacity:0;text-decoration:none;font-weight:400}
.doc-sec h2:hover a{opacity:1}
.doc-sec h3{font-size:16px;line-height:24px;font-weight:600;margin-top:32px}
.doc-sec h3:first-child{margin-top:0}
.doc-sec h3 code{font-family:var(--mono);font-size:14px;font-weight:500}
.doc-sec > p{font-size:16px;line-height:24px;color:var(--text-2);margin-top:16px;max-width:72ch}
.doc-sec > p code,.doc-sec td code{font-family:var(--mono);font-size:13px;background:var(--ds-gray-100);border:1px solid var(--ds-gray-alpha-400);border-radius:4px;padding:1px 4px}
.doc-sec > .doc-body{margin-top:40px}
.doc-sec > p + .doc-body{margin-top:24px}
.showcase{border:1px solid var(--ds-gray-alpha-400);background:var(--ds-background-100);border-radius:var(--r);overflow:hidden}
.showcase + .showcase{margin-top:24px}
.showcase .preview{padding:24px;overflow-x:auto}
.showcase .showbar{height:48px;display:flex;align-items:center;gap:8px;padding:0 16px;background:var(--ds-background-200);border:0;border-top:1px solid var(--ds-gray-alpha-400);width:100%;text-align:left;font:inherit;font-size:14px;line-height:20px;color:var(--text-2);cursor:pointer}
.showcase .showbar:hover{color:var(--text)}
.showcase .showbar .ic{transition:transform var(--dur) var(--ease)}
.showcase[data-open="true"] .showbar .ic{transform:rotate(90deg)}
.showcase .code{display:none;position:relative;border-top:1px solid var(--ds-gray-alpha-400);background:var(--surface)}
.showcase[data-open="true"] .code{display:block}
.showcase .code acme-copy-button{position:absolute;right:12px;top:12px;z-index:1}
.th-code{margin:0;padding:16px 64px 16px 0;font-family:var(--mono);font-size:13px;line-height:20px;color:var(--text);overflow-x:auto;tab-size:2;white-space:normal}
.th-code code{display:block;font:inherit;white-space:normal}
.th-line{display:block;height:20px;white-space:pre;padding-right:16px}
.th-code--line-numbers .th-line::before{content:attr(data-line);display:inline-block;width:32px;padding-right:16px;box-sizing:content-box;text-align:right;color:var(--ds-gray-600);user-select:none}
.th-tag{color:var(--ds-green-900)} .th-attr{color:var(--ds-purple-900)} .th-string{color:var(--ds-blue-900)} .th-keyword{color:var(--ds-pink-900)}
.th-comment{color:var(--text-2)} .th-number{color:var(--ds-blue-900)} .th-literal{color:var(--ds-amber-900)} .th-function,.th-type{color:var(--ds-green-900)} .th-property,.th-variable{color:var(--ds-purple-900)}
.doc-table{width:100%;border-collapse:collapse;font-size:14px;line-height:20px}
.doc-table th{text-align:left;height:36px;padding:0 8px;font-weight:500;color:var(--text-2);border-bottom:1px solid var(--border);white-space:nowrap}
.doc-table td{padding:10px 8px;border-bottom:1px solid var(--ds-gray-200);vertical-align:top;color:var(--text-2)}
.doc-table td:first-child{color:var(--text)}
.doc-table td.cls,.doc-table td.mono{font-family:var(--mono);font-size:13px;white-space:nowrap}
.doc-table td.type{font-family:var(--mono);font-size:12px;color:var(--ds-purple-900);white-space:normal;max-width:280px}
.api-el + .api-el{margin-top:40px}
.api-el h3{display:flex;align-items:center;gap:12px}
.api-el h3 small{font-family:var(--mono);font-size:12px;font-weight:400;color:var(--text-2)}
.api-el p{font-size:14px;line-height:20px;color:var(--text-2);margin:8px 0 16px;max-width:72ch}
.api-el h4{font-size:13px;line-height:16px;font-weight:500;text-transform:uppercase;letter-spacing:.04em;color:var(--text-2);margin:24px 0 8px}
.practices h3{font-size:20px;line-height:26px;letter-spacing:-.4px;font-weight:600;margin-top:24px}
.practices h3:first-child{margin-top:0}
.practices ul{margin:12px 0 0;padding-left:20px;font-size:16px;line-height:24px;color:var(--text-2)}
.practices li + li{margin-top:8px}
.link-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.link-tile{display:flex;flex-direction:column;gap:16px;padding:32px;border:1px solid var(--border);border-radius:var(--r);text-decoration:none;color:var(--text);background:var(--surface);transition:border-color var(--dur) var(--ease)}
.link-tile:hover{border-color:var(--accent);text-decoration:none}
.link-tile .prev{height:140px;display:flex;align-items:center;justify-content:center;gap:12px;background:var(--surface-2);border-radius:var(--r-sm);overflow:hidden;padding:16px}
.link-tile .t{font-size:16px;line-height:24px;font-weight:600}
.link-tile .d{font-size:14px;line-height:20px;color:var(--text-2)}
.swatch-row{display:flex;align-items:center;gap:8px;margin-bottom:24px}
.swatch-row .n{width:100px;flex:none;font-size:14px;line-height:20px;font-weight:500;text-transform:capitalize}
.swatch-row .sw{width:68px;height:40px;border-radius:4px;box-shadow:var(--ds-shadow-border-inset);flex:1 1 0;min-width:0}
.swatch-steps{display:flex;gap:8px;margin-bottom:8px;padding-left:108px;font-family:var(--mono);font-size:11px;color:var(--text-2)}
.swatch-steps span{flex:1 1 0;text-align:center}
.def-row{display:flex;align-items:center;gap:12px;height:40px;border-bottom:1px solid var(--border);font-size:14px;line-height:20px}
.def-row .d{width:16px;height:16px;border-radius:50%;flex:none;box-shadow:var(--ds-shadow-border-inset)}
.def-row b{font-weight:500;min-width:140px}
.def-row span{color:var(--text-2)}
.demo-box{margin-top:16px;padding:24px;border:1px solid var(--border);border-radius:var(--r);background:var(--surface);display:flex;gap:16px;flex-wrap:wrap;align-items:center}
.mat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:24px}
.mat-grid .box{height:120px;border-radius:6px;background:var(--surface);display:flex;flex-direction:column;justify-content:flex-end;padding:12px;font-size:14px;line-height:20px}
.mat-grid .box small{font-family:var(--mono);font-size:12px;color:var(--text-2)}
.mat-grid .box.r12{border-radius:12px} .mat-grid .box.r16{border-radius:16px}
.mat-ground{padding:32px;background:var(--surface-2);border-radius:var(--r)}
.type-table td.ex{color:var(--text);width:50%}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.vstack{display:flex;flex-direction:column;gap:12px}
.pager{display:flex;justify-content:space-between;gap:16px;margin-top:48px;padding-top:24px;border-top:1px solid var(--border)}
.foot{margin-top:48px;color:var(--text-2);font-size:12px;font-family:var(--mono);line-height:1.7}
@media (max-width:900px){.docs{grid-template-columns:minmax(0,1fr)}.docs-side{display:none}.docs-main{padding:0 16px 64px}.doc-hero h1{font-size:24px;line-height:32px;letter-spacing:-.96px}.doc-hero p{font-size:16px;line-height:24px}.link-grid{grid-template-columns:1fr}.swatch-row .n{width:64px}.swatch-steps{padding-left:72px}}
`;

/* ---------- renderers ---------- */
const slug = (h: string) =>
  h
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
export const section = (h: string, inner: string, p?: string, id = slug(h)) =>
  `<div class="doc-sec" id="${id}"><h2>${h}<a href="#${id}" aria-label="Link to ${h}">#</a></h2>${p ? `<p>${p}</p>` : ""}<div class="doc-body">${inner}</div></div>`;

export const showcase = (e: Example) => {
  const code = e.code ?? e.html;
  const plain = formatHtml(code);
  return `<div class="showcase"><div class="preview">${e.html}</div><button class="showbar" aria-expanded="false">${ic("chev")}Show code</button><div class="code"><acme-copy-button label="Copy code" text="${esc(plain).replace(/"/g, "&quot;")}"></acme-copy-button>${highlightHtml(code)}</div></div>`;
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

const apiTables = (els: ElementApi[]) =>
  els.length
    ? section(
        "API",
        els
          .map(
            (e) =>
              `<div class="api-el" id="api-${e.tag}"><h3><code>&lt;${e.tag}&gt;</code><small>${e.className}</small></h3>${e.doc ? `<p>${esc(e.doc)}</p>` : ""}${
                e.props.length
                  ? `<h4>Attributes and properties</h4><table class="doc-table"><thead><tr><th>Attribute</th><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>${e.props
                      .map(
                        (p) =>
                          `<tr><td class="mono">${p.attribute === false ? "—" : p.attribute}</td><td class="mono">${p.name}</td><td class="type">${esc(p.type)}</td><td class="mono">${esc(p.default) || "—"}</td><td>${esc(p.doc)}</td></tr>`,
                      )
                      .join("")}</tbody></table>`
                  : ""
              }${e.slots.length ? `<h4>Slots</h4><table class="doc-table"><tbody>${e.slots.map((s) => `<tr><td class="mono">${s}</td></tr>`).join("")}</tbody></table>` : ""}${
                e.events.length ? `<h4>Events</h4><table class="doc-table"><tbody>${e.events.map((s) => `<tr><td class="mono">${s}</td></tr>`).join("")}</tbody></table>` : ""
              }</div>`,
          )
          .join(""),
        "Every reactive property reflects from its attribute; array and object values take JSON in the attribute. Events bubble and are composed.",
      )
    : "";

export const docPage = (d: Doc, api: ElementApi[]) =>
  `<article class="doc" id="${d.id}"><div class="doc-hero"><h1>${d.title}</h1><p>${d.lede}</p>${
    d.tags?.length ? `<div class="tags">${d.tags.map((t) => `<acme-badge hue="${d.house ? "purple" : "gray"}" subtle><code>&lt;${t}&gt;</code></acme-badge>`).join("")}</div>` : ""
  }</div>${d.examples.map((e) => section(e.h, showcase(e), e.p)).join("")}${d.body ?? ""}${apiTables(api)}${practices(d.practices)}</article>`;

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
(() => { const p = location.hostname.endsWith("github.io") ? "/" + location.pathname.split("/")[1] : ""; window.__docsPrefix = p; document.write('<link rel="stylesheet" href="' + p + '/tokens.css"><link rel="stylesheet" href="' + p + '/dashboard.css">'); })();
</script>
<style>${pageCss}</style>
<script>window.__docsNav = ${JSON.stringify(nav)};</script>
</head>
<body>
${symbols}
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
