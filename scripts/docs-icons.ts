import fs from "node:fs";
import path from "node:path";
import { Window } from "happy-dom";
import catalog from "../assets/material-symbols/catalog.json";
const known = new Set(catalog.symbols.map((symbol) => symbol.tag));
export function documentationIconEntries(markup: readonly string[]): readonly string[] {
  const entries = new Set<string>();
  const window = new Window({ settings: { disableJavaScriptEvaluation: true, disableJavaScriptFileLoading: true, disableCSSFileLoading: true, disableIframePageLoading: true } });
  try {
    const template = window.document.createElement("template");
    for (const text of markup) {
      template.innerHTML = text;
      for (const element of template.content.querySelectorAll("*")) {
        const tag = element.localName;
        if (!/^acme-[a-z0-9-]+-icon$/.test(tag)) continue;
        if (!known.has(tag)) throw new Error("Unknown documentation icon: " + tag);
        const name = tag.slice(5, -5);
        entries.add("define/" + name + "-icon");
        const family = element.getAttribute("family") ?? "rounded";
        if (!["rounded", "outlined", "sharp"].includes(family)) throw new Error("Unknown documentation icon family: " + family);
        const filled = element.hasAttribute("filled") && element.getAttribute("filled") !== "false";
        if (family !== "rounded" || filled) entries.add(`generated/icons/artwork/${family}/${filled ? "filled" : "unfilled"}/${name}`);
      }
    }
  } finally {
    void window.happyDOM.abort();
  }
  return Object.freeze([...entries].sort());
}
export function writeDocumentationIconEntry(root: string, output: string, extra: readonly string[] = []): string {
  const pages = [...new Bun.Glob("**/*.html").scanSync({ cwd: output })].map((file) => fs.readFileSync(path.join(output, file), "utf8"));
  const entries = documentationIconEntries([...pages, ...extra]),
    entry = path.join(output, "app-entry.ts");
  const fromOutput = (file: string) => {
    const relative = path.relative(output, file).split(path.sep).join("/");
    return relative.startsWith(".") ? relative : "./" + relative;
  };
  fs.writeFileSync(
    entry,
    "import { startDocs } from " +
      JSON.stringify(fromOutput(path.join(root, "site/app/main.ts"))) +
      ";\n" +
      entries.map((name) => "import " + JSON.stringify(fromOutput(path.join(root, "dist", name + ".js"))) + ";\n").join("") +
      "startDocs();\n",
  );
  return entry;
}
