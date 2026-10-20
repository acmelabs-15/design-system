import { Window } from "happy-dom";

const document = new Window().document;
const fence = (text: string, minimum: number) => "`".repeat(Math.max(minimum, ...[...text.matchAll(/`+/g)].map((match) => match[0].length + 1)));

/** Convert authored foundation sections without dropping nested content or escaped code. */
export function bodyToMarkdown(html: string): string[] {
  const template = document.createElement("template");
  template.innerHTML = html;
  const render = (node: Node): string => {
    if (node.nodeType === 3) {
      return (node.textContent ?? "").replace(/\s+/g, " ");
    }
    if (node.nodeType !== 1 && node.nodeType !== 11) {
      return "";
    }
    const element = node as Element;
    const tag = element.localName;
    const content = () => [...node.childNodes].map((child) => render(child as unknown as Node)).join("");
    if (["script", "style", "template"].includes(tag)) {
      return "";
    }
    if (tag === "a" && element.classList.contains("anchor")) {
      return "";
    }
    if (/^h[1-6]$/.test(tag)) {
      return "\n\n" + "#".repeat(Number(tag[1])) + " " + content().trim() + "\n\n";
    }
    if (tag === "pre") {
      const text = node.textContent ?? "";
      const mark = fence(text, 3);
      return "\n\n" + mark + "\n" + text + "\n" + mark + "\n\n";
    }
    if (tag === "code") {
      const text = node.textContent ?? "";
      const mark = fence(text, 1);
      return mark + text + mark;
    }
    if (tag === "a") {
      const href = element.getAttribute("href");
      return href ? "[" + content().trim() + "](" + href + ")" : content();
    }
    if (tag === "strong" || tag === "b") {
      return "**" + content().trim() + "**";
    }
    if (tag === "em" || tag === "i") {
      return "*" + content().trim() + "*";
    }
    if (tag === "br") {
      return "\n";
    }
    if (tag === "img") {
      return "![" + (element.getAttribute("alt") ?? "") + "](" + (element.getAttribute("src") ?? "") + ")";
    }
    if (tag === "table") {
      const rows = [...element.querySelectorAll("tr")].map((row) => [...row.children].map((cell) => render(cell).trim().replace(/\n+/g, " ").replace(/\|/g, "\\|")));
      if (!rows.length) {
        return "";
      }
      const width = Math.max(...rows.map((row) => row.length));
      const line = (row: string[]) => "| " + Array.from({ length: width }, (_, i) => row[i] ?? "").join(" | ") + " |";
      return "\n\n" + [line(rows[0]), line(Array(width).fill("---")), ...rows.slice(1).map(line)].join("\n") + "\n\n";
    }
    if (tag === "ul" || tag === "ol") {
      return "\n\n" + [...element.children].map((child, i) => (tag === "ol" ? `${i + 1}. ` : "- ") + render(child).trim().replace(/\n/g, "\n  ")).join("\n") + "\n\n";
    }
    if (["p", "div", "section", "article", "blockquote"].includes(tag)) {
      return "\n\n" + content().trim() + "\n\n";
    }
    return content();
  };
  return render(template.content as unknown as Node)
    .trim()
    .replace(/\n{3,}/g, "\n\n")
    .split("\n");
}
