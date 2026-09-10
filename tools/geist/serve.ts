// Serves the Geist corpus as a local mirror: /geist/<page> is the server-rendered page with its
// stylesheets rewritten to /css/* and every script removed, so the static example DOM renders
// with Geist's CSS exactly as on vercel.com, offline and repeatable. Port 4184.
import fs from "node:fs";
import path from "node:path";
import { settleStreamed } from "./stream";

const DIR = path.join(import.meta.dir, "corpus");
type SpecNode = { tag: string; attrs: Record<string, string>; text?: string; styles: { cls: string }[]; unresolved: string[]; children: SpecNode[] };
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
/**
 * The spec's sketched examples (client-only states the server HTML lacks) follow the page's own
 * showcases, in the spec's order, each on a 600px stage (552px inside the showcase padding, so a
 * full-width part has a known width): the DOM is rebuilt from the spec nodes (class list,
 * attributes, text) and styled by the page's sheets, and a census reads it as one more preview.
 */
const sketches = (name: string, html: string) => {
  const f = path.join(import.meta.dir, "spec", `${name}.json`);
  if (!fs.existsSync(f)) return "";
  const spec = JSON.parse(fs.readFileSync(f, "utf8")) as { examples: { heading: string; dom: SpecNode[] }[] };
  const render = (n: SpecNode): string => {
    const cls = [...new Set([...n.styles.map((s) => s.cls), ...n.unresolved])].join(" ");
    const attrs = Object.entries(n.attrs)
      .map(([k, v]) => ` ${k}="${esc(v)}"`)
      .join("");
    return `<${n.tag}${cls ? ` class="${esc(cls)}"` : ""}${attrs}>${n.children.map(render).join("")}${esc(n.text ?? "")}</${n.tag}>`;
  };
  return spec.examples
    // A sketch stands in for a showcase the page lacks: its heading is matched whole (`>Controls</h2>`), so "Controls" is not read as the tail of "No Controls".
    .filter((e) => !html.includes(`>${e.heading}</h2>`))
    .map(
      (e) =>
        `<section data-sketch style="width:600px;margin:48px auto"><h2 class="text-heading-24">${esc(e.heading)}</h2><div class="w-full p-6">${e.dom.map(render).join("")}</div><div class="bg-background-200"><button type="button" aria-controls="radix-sketch" data-state="closed"></button></div></section>`,
    )
    .join("");
};
const page = (name: string) => {
  const f = path.join(DIR, "html", `${name}.html`);
  if (!fs.existsSync(f)) return null;
  // A streamed boundary's content is put where it renders (see stream.ts): the script that would move it is stripped below.
  const html = settleStreamed(fs.readFileSync(f, "utf8"))
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<link([^>]*)href="\/vc-ap-[^/]+\/_next\/static\/immutable\/chunks\/([^"]+\.css)"/g, '<link$1href="/css/$2"')
    .replace(/<link[^>]*rel="preload"[^>]*>/g, "");
  return html.replace(/<\/main>/, (m) => sketches(name, html) + m).concat('<script src="http://localhost:4183/census.js"></script>');
};

// PORT overrides the port (a second instance beside the running mirror).
Bun.serve({
  port: Number(process.env.PORT) || 4184,
  fetch(req) {
    const p = decodeURIComponent(new URL(req.url).pathname);
    if (p.startsWith("/css/")) return new Response(Bun.file(path.join(DIR, "css", p.slice(5))), { headers: { "content-type": "text/css" } });
    // Static media the pages reference (logos, textures), fetched into corpus/media with the owner's approval.
    const media = p.match(/^\/vc-ap-[a-z0-9]+\/_next\/static\/immutable\/media\/([^/]+)$/);
    if (media) {
      const file = Bun.file(path.join(DIR, "media", media[1]));
      return file.size ? new Response(file) : new Response("not found", { status: 404 });
    }
    const m = p.match(/^\/geist\/([a-z0-9-]+)$/);
    const html = m ? page(m[1]) : null;
    return html ? new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }) : new Response("not found", { status: 404 });
  },
});
console.log("Geist mirror on http://localhost:4184/geist/<page>");
