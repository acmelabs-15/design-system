import type { Doc } from "../../site";
import { esc } from "../../site";

const attribute = (value: string) => esc(value).replaceAll('"', "&quot;");
const source = "export function greet(name: string) {\n  return `Hello, ${name}!`;\n}\n";
const block = (attributes = "") => `<acme-code-block language="ts" filename="greet.ts" code="${attribute(source)}" ${attributes}></acme-code-block>`;
export const doc: Doc = {
  id: "code-block",
  title: "Code Block",
  lede: "Highlighted source with exact copying, line references and composable controls.",
  tags: ["acme-code-block"],
  examples: [
    { h: "Source file", html: block() },
    { h: "Highlighted lines", html: block('highlighted-lines="[2]"') },
    {
      h: "Added and removed lines",
      html: '<acme-code-block filename="config.ts" language="ts" code="const oldValue = false;&#10;const newValue = true;&#10;" removed-lines="[1]" added-lines="[2]"></acme-code-block>',
    },
    {
      h: "Line references",
      p: "A line button requests a reference. The application decides how to store or link it.",
      html: block() + '<output aria-live="polite"></output>',
      script:
        'const block=root.querySelector("acme-code-block");block.addEventListener("acme-request",event=>{if(event.detail.action==="reference-line"){block.referencedLine=event.detail.line;root.querySelector("output").textContent="Referenced line "+event.detail.line;}});',
    },
    {
      h: "Application language selector",
      html: '<acme-code-block filename="greet.ts" language="ts"><acme-select slot="end" size="small" value="ts" aria-label="Language"><acme-option value="ts">TypeScript</acme-option><acme-option value="js">JavaScript</acme-option></acme-select></acme-code-block>',
      script: `const block=root.querySelector('acme-code-block');const files={ts:${JSON.stringify(source)},js:${JSON.stringify(source.replace(": string", ""))}};block.code=files.ts;root.querySelector('acme-select').addEventListener('acme-change',event=>{const language=event.detail.value;block.language=language;block.filename='greet.'+language;block.code=files[language];});`,
    },
    { h: "Wrapping", html: '<acme-code-block wrap line-numbers="false" code="' + attribute('const message = "' + "A long source line. ".repeat(12) + '";') + '" language="js"></acme-code-block>' },
    {
      h: "Header and footer content",
      html: `<acme-code-block filename="greet.ts" code="${attribute(source)}" language="ts"><acme-text slot="header">A reusable greeting function</acme-text><acme-text slot="footer">The caller supplies the name.</acme-text></acme-code-block>`,
    },
    { h: "Read without copying", html: block('copyable="false"') },
    { h: "Empty", html: '<acme-code-block filename="empty.ts"><span slot="empty">This file has no source yet.</span></acme-code-block>' },
  ],
  practices: {
    Source: [
      "The code property or attribute is the only source. Source text is escaped and copied exactly, including leading and trailing whitespace.",
      "Registered languages include TypeScript, TSX, JavaScript, JSX, HTML, CSS, JSON, shell, diff and plain text. Unknown languages render as plain text.",
      "Highlighting failure leaves safe plain source visible and emits acme-error.",
    ],
    Composition: [
      "Use the end slot for Select or other file controls. The application owns file and language selection.",
      "Use the header and footer slots for supporting content. Layout components own outside spacing.",
      "Set --acme-code-block-max-height when a tall block needs an internal scroll viewport.",
    ],
    Accessibility: [
      "One line-number button is in the tab sequence. Arrow keys, Home and End move between line references; Enter or Space requests the focused line.",
      "Line-number actions do not change the page URL. The application can set referencedLine after accepting a request.",
      "Overlapping line treatments keep all supplied flags. The visible background priority is referenced, removed, added, then highlighted.",
      "Use copyable=false when the source has no useful copy action; reading and scrolling remain available.",
    ],
  },
};
