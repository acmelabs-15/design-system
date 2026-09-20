// Docs page: Code Block — mirrors https://vercel.com/geist/code-block
import type { Doc } from "../../site";

const component = `function MyComponent(props) {
  return (
    &lt;div&gt;
      &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;
      &lt;p&gt;This is an example React component.&lt;/p&gt;
    &lt;/div&gt;
  );
}`;

const greeting = `function MyComponent(props) {
	return (
	  &lt;div&gt;
		&lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;
		&lt;p&gt;Good to see you&lt;/p&gt;
	  &lt;/div&gt;
	);
  }`;

const languages = `[{"label":"JavaScript","value":"js"},{"label":"TypeScript","value":"ts"},{"label":"Next.js","value":"next"},{"label":"Lua","value":"lua"}]`;

// The switcher script: the parent swaps the source, the filename and the language, as the React example re-renders the block.
const switcherScript = `const block = root.querySelector('acme-code-block');
const code = "function MyComponent(props) {\\n\\treturn (\\n\\t  <div>\\n\\t\\t<h1>Hello, {props.name}!</h1>\\n\\t\\t<p>Good to see you</p>\\n\\t  </div>\\n\\t);\\n  }";
const codeTs = "function MyComponent(props: Props) {\\n\\treturn (\\n\\t  <div>\\n\\t\\t<h1>Hello, {props.name}!</h1>\\n\\t\\t<p>Good to see you</p>\\n\\t  </div>\\n\\t);\\n  }";
const codeLua = "local b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'\\nlocal decode_table = ffi.new 'uint8_t[256]'\\nfor i = 1, #b64 do\\n  decode_table[str_byte(b64, i)] = i - 1 -- Base64 values start from 0\\nend\\n\\nfunction BloomFilter:has(key)\\n  local ptr = self.ptr -- uint8_t* pointer to start of base64 string\\n  for byte_offset, bit_offset in self:iterator(key) do\\n    local sextet = decode_table[ptr[byte_offset]]\\n    if band(sextet, lshift(1, bit_offset)) == 0 then\\n      return false\\n    end\\n  end\\n  return true\\nend";
const files = {
  js: ['language-switcher.jsx', 'jsx', code],
  ts: ['language-switcher.tsx', 'tsx', codeTs],
  next: ['language-switcher.tsx', 'next', codeTs],
  lua: ['bloom-filter.lua', 'lua', codeLua],
};
block.addEventListener('acme-change', (e) => {
  const [filename, language, source] = files[e.detail.value];
  block.filename = filename;
  block.language = language;
  block.code = source;
});`;

export const doc: Doc = {
  id: "code-block",
  title: "Code Block",
  lede: "The code block Vercel and Next.js use across their sites and docs.",
  tags: ["acme-code-block"],
  examples: [
    {
      h: "Default",
      html: `<acme-code-block aria-label="Hello world" filename="Table.jsx" language="jsx">// Usage:
//   enabled by \`--debug-prerender\`
//   route patterns: [id...] or [...id]
//   NODE_OPTIONS='--debug-prerender' node
${component}</acme-code-block>`,
    },
    {
      h: "No filename",
      html: `<acme-code-block aria-label="Hello world" language="jsx">${component}</acme-code-block>`,
    },
    {
      h: "Highlighted lines",
      html: `<acme-code-block aria-label="Hello world" filename="highlighted.jsx" highlighted-lines-numbers="[1, 4]" language="jsx">${component}</acme-code-block>`,
    },
    {
      h: "Added & removed lines",
      html: `<acme-code-block aria-label="Hello world" filename="next.config.js" added-lines-numbers="[5]" removed-lines-numbers="[2, 3, 4]" language="jsx">module.exports = {
  experimental: {
    appDir: true,
  },
  appDir: true,
}</acme-code-block>`,
    },
    {
      h: "Referenced lines",
      p: "A line number is a link to that line: press one and the line is marked.",
      html: `<acme-code-block aria-label="Hello world" language="jsx">function MyComponent(props) {
  return (
    &lt;div&gt;
      &lt;h1&gt;Count: {props.count}&lt;/h1&gt;
    &lt;/div&gt;
  );
}</acme-code-block>`,
    },
    {
      h: "Language switcher",
      html: `<acme-code-block aria-label="Hello world" filename="language-switcher.jsx" language="jsx" switcher='${languages}' switcher-value="js">${greeting}</acme-code-block>`,
      script: switcherScript,
    },
    {
      h: "Language switcher with tabs",
      p: "Set `tabs` instead of `switcher` for a tabbed language switcher in place of the select.",
      html: `<acme-code-block aria-label="Hello world" filename="language-switcher.jsx" language="jsx" tabs='${languages}' switcher-value="js">${greeting}</acme-code-block>`,
      script: switcherScript,
    },
    {
      h: "Hidden line numbers",
      html: `<acme-code-block aria-label="Hello world" filename="hidden-line-numbers.jsx" hide-line-numbers language="jsx">${greeting}</acme-code-block>`,
    },
    {
      h: "Open in v0",
      p: "Set `v0` to add an Open in v0 action to the toolbar.",
      html: `<div class="vstack" style="gap:16px"><acme-code-block aria-label="Hello world" filename="Table.jsx" language="jsx" v0="ask">${component}</acme-code-block><acme-code-block aria-label="Hello world" filename="Table.jsx" language="jsx" v0="build">${component}</acme-code-block></div>`,
    },
  ],
  practices: {
    "When to use": [
      "A code block is for multi-line source the reader scans or pastes, with highlighting.",
      "One inline token (an env var, a function name, a file path) is Inline Code.",
      "A shell command or a one-line key to copy is a Snippet: it brings the prompt glyph and the copy control.",
    ],
    Behavior: [
      "Always set the language (tsx, bash, json, diff); highlighting is the reason to pick a code block over a plain pre.",
      "Highlight only the lines the text talks about. When every line is highlighted, none is.",
      "Mark added and removed lines with the diff language or the added and removed props; a comment such as // added breaks copy and paste.",
      "Show the filename bar when the snippet has a paste destination (app/page.tsx, vercel.json); leave it off for a passing example.",
    ],
    Content: [
      "Snippets stay runnable: real code, never pseudo-syntax, and no $ before a shell command (Snippet draws the prompt, so a $ in the text doubles it).",
      "Prose around the block is sentence case, and a CLI flag in prose is inline code (--prebuilt).",
    ],
  },
};
