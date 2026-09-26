import type { Doc } from "../../site";
import { esc } from "../../site";

const attribute = (value: string) => esc(value).replaceAll('"', "&quot;");
const prose =
  "## Overview\n\nRead **structured prose** with `inline()` code, lists and links.\n\n- Keep source text in the text property.\n- Use [the details](#details) to continue.\n\n## Details\n\n| Feature | Status |\n| :--- | ---: |\n| Native headings | Ready |\n| Scoped styles | Ready |";
const source =
  'Install the package and register the notification viewport:\n\n```shell\nbun add @acmelabs/design-system\n```\n\n```ts\nimport "@acmelabs/design-system/define/toast-viewport";\nimport { createToastStore } from "@acmelabs/design-system";\n\nconst notifications = createToastStore();\nviewport.store = notifications;\nnotifications.add({ description: "Domain added", variant: "success" });\n```';
export const doc: Doc = {
  id: "markdown",
  title: "Markdown",
  lede: "Native prose, headings and links from a single Markdown source, with shared syntax highlighting.",
  tags: ["acme-markdown"],
  examples: [
    { h: "Native prose and TOC", html: `<acme-toc source="#markdown-guide"></acme-toc><acme-markdown id="markdown-guide" text="${attribute(prose)}"></acme-markdown>` },
    { h: "Code fences", html: `<acme-markdown id="markdown-code" line-numbers text="${attribute(source)}"></acme-markdown>` },
    {
      h: "Application source",
      html: '<acme-markdown id="markdown-release"></acme-markdown>',
      script: 'root.querySelector("acme-markdown").text="## Release notes\\n\\nThe current release adds **native prose** and stable fragment targets.";',
    },
    {
      h: "Footnotes",
      html: `<acme-markdown id="markdown-notes" text="${attribute("## Notes\n\nAn explanation[^details] and the same note again[^details].\n\n[^details]: Supporting detail with a [relative link](./markdown).")}"></acme-markdown>`,
    },
    { h: "HTML shown as text", html: `<acme-markdown id="markdown-escaped" text="${attribute("This HTML is source text: <b>not an element</b>.")}"></acme-markdown>` },
    {
      h: "Trusted HTML",
      p: "Only enable allow-html for content whose HTML behavior the application trusts. This option does not sanitize HTML.",
      html: `<acme-markdown id="markdown-trusted" allow-html text="${attribute("<p>A trusted <strong>HTML paragraph</strong>.</p>")}"></acme-markdown>`,
    },
  ],
  practices: {
    Source: [
      "The text property or attribute is the only Markdown source. The component owns its generated prose.",
      "Use the documented TanStack Markdown syntax profile. This component does not promise complete CommonMark, GFM or arbitrary plugin support.",
      "Unknown code languages use plain text. Parse or highlighting failures emit acme-error and keep safe source visible.",
    ],
    Navigation: [
      "Give the component a stable id when its fragment links must persist across page loads. Output IDs are prefixed with that id; otherwise an instance prefix is used.",
      "Local fragment links and ID references are rewritten to the scoped targets. Native headings are available to TOC discovery and document queries.",
      "Relative links and images resolve against the consuming document’s base URL. The component does not fetch Markdown or change the base URL.",
    ],
    Trust: [
      "Raw HTML is escaped by default. Normal Markdown links and images use the parser’s protocol filtering.",
      "allowHtml is an explicit trusted-content option, not a sanitizer. The application owns any additional link, image or HTML policy.",
      "Code fences are displayed and highlighted, never evaluated.",
    ],
    Appearance: [
      "Generated prose styles are scoped to the native output in its actual document or shadow root.",
      "Code fences use Scroll Area for pointer and keyboard scrolling. lineNumbers enables their number gutter.",
      "Use --acme-markdown-scroll-offset for clearance above generated heading targets.",
      "Message keys markdown.code, markdown.footnotes and markdown.backToReference supply the built-in labels.",
    ],
  },
};
