// Settles a server-rendered page that streams part of its tree: a Suspense boundary renders as an
// empty `<template id="B:x">` where the content belongs, the content itself arrives later as a hidden
// `<div hidden id="S:x">` at the end of the body, and an inline script (`$RC("B:x","S:x")`) moves it
// into place on the client. The corpus keeps the page as served and the mirror strips its scripts, so
// the move is made here, statically: every template takes the children of its segment, and the
// segment goes. A page with no boundaries is returned as it is.
export function settleStreamed(html: string): string {
  const segments = new Map<string, string>();
  let out = "";
  let i = 0;
  const open = /<div hidden id="(S:[0-9a-z]+)">/g;
  let m: RegExpExecArray | null = open.exec(html);
  while (m) {
    // The segment ends at the `</div>` that closes its own `<div>`: nested divs are counted.
    let depth = 1;
    let j = m.index + m[0].length;
    const tag = /<\/?div\b/g;
    tag.lastIndex = j;
    let t: RegExpExecArray | null = tag.exec(html);
    while (t && depth > 0) {
      depth += t[0] === "</div" ? -1 : 1;
      j = t.index + (t[0] === "</div" ? "</div>".length : 0);
      if (depth > 0) t = tag.exec(html);
    }
    segments.set(m[1], html.slice(m.index + m[0].length, j - "</div>".length));
    out += html.slice(i, m.index);
    i = j;
    open.lastIndex = j;
    m = open.exec(html);
  }
  out += html.slice(i);
  if (!segments.size) return html;
  return out.replace(/<template id="(B:[0-9a-z]+)"><\/template>/g, (whole, id: string) => segments.get(id.replace(/^B/, "S")) ?? whole);
}
