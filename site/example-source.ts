import { exampleFiles } from "./example-files";
import { Window } from "happy-dom";
import fs from "node:fs";
import path from "node:path";
import { formatSource } from "./format";
import type { Example } from "./site";

export type ExampleSource = Readonly<{ label: string; language: "html" | "typescript" | "tsx"; code: string; path?: string }>;
const root = path.resolve(import.meta.dir, "..");
const document = new Window().document;
const manifest = JSON.parse(fs.readFileSync(path.join(root, "dist/custom-elements.json"), "utf8"));
const elements = new Map<string, string>(
  manifest.modules.flatMap((module: { path: string; declarations?: { tagName?: string }[] }) =>
    (module.declarations ?? []).filter((declaration) => declaration.tagName).map((declaration) => [declaration.tagName!, module.path]),
  ),
);
const version = manifest["x-acme-version"] as string;
export const exampleId = (page: string, heading: string) =>
  `${page}-${heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

/** The same authored markup and setup body supply the preview and the complete copied example. */
export async function exampleSources(example: Example, id: string): Promise<readonly ExampleSource[]> {
  if (example.code !== undefined) {
    if (!example.sourcePath || fs.readFileSync(path.join(root, example.sourcePath), "utf8") !== example.code) {
      throw new Error("Example source must match its executed module: " + id);
    }
    const entry = example.entryPath ?? example.sourcePath;
    const main =
      'import "@acmelabs/design-system/styles/tokens.css";\n' +
      (example.registerFunction ? "import {" + example.registerFunction + '} from "./' + entry + '";\n' + example.registerFunction + "();\n" : 'import "./' + entry + '";\n') +
      (example.script
        ? "const root = document.getElementById(" +
          JSON.stringify("example-" + id) +
          ")!;\nconst dispose = mount(root);\nfunction mount(root: HTMLElement) {\n" +
          example.script +
          "\n}\n// Call dispose?.() before removing the example.\n"
        : "");
    const markup = '<div id="example-' + id + '">' + example.html + '</div>\n<script type="module" src="./main.ts"></script>';
    const sources: ExampleSource[] = [
      { label: "index.html", language: "html", code: await formatSource(markup) },
      { label: "main.ts", language: "typescript", code: await formatSource(main, "typescript") },
    ];
    for (const file of exampleFiles([example.sourcePath, entry, ...(example.sourceFiles ?? [])], root)) {
      const language = file.endsWith(".tsx") ? "tsx" : "typescript";
      sources.push({ label: file, language, code: await formatSource(fs.readFileSync(path.join(root, file), "utf8"), language), path: file });
    }
    return sources;
  }
  const template = document.createElement("template");
  template.innerHTML = example.html;
  const tags = new Set<string>();
  const collect = (parent: typeof template.content) => {
    for (const element of parent.querySelectorAll("*")) {
      if (elements.has(element.localName)) {
        tags.add(element.localName);
      }
      if (element.localName === "template") {
        collect((element as unknown as typeof template).content);
      }
    }
  };
  collect(template.content);
  for (const match of (example.script ?? "").matchAll(/(?:querySelector(?:All)?|createElement)\(\s*(["'])(.*?)\1/g)) {
    for (const tag of match[2].match(/acme-[a-z0-9-]+/g) ?? []) {
      if (elements.has(tag)) {
        tags.add(tag);
      }
    }
  }
  const cdn = `https://cdn.jsdelivr.net/npm/@acmelabs/design-system@${version}/dist`;
  const imports = [...tags].sort().map((tag) => `import "${cdn}/cdn/define/${tag.slice(5)}.js";`);
  if (/\bcreateToastStore\s*\(/.test(example.script ?? "")) {
    imports.push(`import {createToastStore} from "${cdn}/cdn/components/toast/toast.js";`);
  }
  if (/\bregisterTheme\s*\(/.test(example.script ?? "")) {
    imports.push(`import {registerTheme} from "${cdn}/cdn/configure.js";`);
  }
  const script = await formatSource(
    imports.join("\n") +
      (example.script
        ? `\nconst root = document.getElementById(${JSON.stringify("example-" + id)});\nconst dispose = mount(root);\nfunction mount(root) {\n${example.script}\n}\n// Call dispose?.() before removing a scripted example.\n`
        : ""),
    "typescript",
  );
  const code = `<link rel="stylesheet" href="${cdn}/styles/tokens.css">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">\n<div id="example-${id}">${example.html}</div>\n<script type="module">\n${script.replace(/<\/script/gi, "<\\/script")}\n</script>`;
  return [{ label: "HTML", language: "html", code: await formatSource(code) }];
}
