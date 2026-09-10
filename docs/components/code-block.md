# Code Block

The code block Vercel and Next.js use across their sites and docs.

## Default

```html
<acme-code-block aria-label="Hello world" filename="Table.jsx" language="jsx">// Usage: // enabled by `--debug-prerender` // route patterns: [id...] or [...id] // NODE_OPTIONS='--debug-prerender' node function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt; &lt;p&gt;This is an example React component.&lt;/p&gt; &lt;/div&gt; ); }</acme-code-block>
```

## No filename

```html
<acme-code-block aria-label="Hello world" language="jsx">function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt; &lt;p&gt;This is an example React component.&lt;/p&gt; &lt;/div&gt; ); }</acme-code-block>
```

## Highlighted lines

```html
<acme-code-block aria-label="Hello world" filename="highlighted.jsx" highlighted-lines-numbers="[1, 4]" language="jsx">function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt; &lt;p&gt;This is an example React component.&lt;/p&gt; &lt;/div&gt; ); }</acme-code-block>
```

## Added & removed lines

```html
<acme-code-block aria-label="Hello world" filename="next.config.js" added-lines-numbers="[5]" removed-lines-numbers="[2, 3, 4]" language="jsx">module.exports = { experimental: { appDir: true, }, appDir: true, }</acme-code-block>
```

## Referenced lines

A line number is a link to that line: press one and the line is marked.

```html
<acme-code-block aria-label="Hello world" language="jsx">function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Count: {props.count}&lt;/h1&gt; &lt;/div&gt; ); }</acme-code-block>
```

## Language switcher

```html
<acme-code-block aria-label="Hello world" filename="language-switcher.jsx" language="jsx" switcher='[{"label":"JavaScript","value":"js"},{"label":"TypeScript","value":"ts"},{"label":"Next.js","value":"next"},{"label":"Lua","value":"lua"}]' switcher-value="js">function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt; &lt;p&gt;Good to see you&lt;/p&gt; &lt;/div&gt; ); }</acme-code-block>
<script>
  const block = root.querySelector('acme-code-block'); const code = "function MyComponent(props) {\n\treturn (\n\t
  <div>
    \n\t\t
    <h1>Hello, {props.name}!</h1>
    \n\t\t
    <p>Good to see you</p>
    \n\t
  </div>
  \n\t);\n }"; const codeTs = "function MyComponent(props: Props) {\n\treturn (\n\t
  <div>
    \n\t\t
    <h1>Hello, {props.name}!</h1>
    \n\t\t
    <p>Good to see you</p>
    \n\t
  </div>
  \n\t);\n }"; const codeLua = "local b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'\nlocal decode_table = ffi.new 'uint8_t[256]'\nfor i = 1, #b64 do\n decode_table[str_byte(b64, i)] = i - 1 -- Base64 values start from 0\nend\n\nfunction BloomFilter:has(key)\n local ptr = self.ptr -- uint8_t* pointer to start of base64 string\n for byte_offset, bit_offset in self:iterator(key) do\n local sextet = decode_table[ptr[byte_offset]]\n if band(sextet, lshift(1, bit_offset)) == 0 then\n return false\n end\n end\n return true\nend"; const files = { js: ['language-switcher.jsx', 'jsx', code], ts: ['language-switcher.tsx', 'tsx', codeTs], next: ['language-switcher.tsx', 'next', codeTs], lua: ['bloom-filter.lua', 'lua', codeLua], }; block.addEventListener('acme-change', (e) => { const [filename, language, source] = files[e.detail.value]; block.filename = filename; block.language = language; block.code = source; });
</script>
```

## Language switcher with tabs

Set `tabs` instead of `switcher` for a tabbed language switcher in place of the select.

```html
<acme-code-block aria-label="Hello world" filename="language-switcher.jsx" language="jsx" tabs='[{"label":"JavaScript","value":"js"},{"label":"TypeScript","value":"ts"},{"label":"Next.js","value":"next"},{"label":"Lua","value":"lua"}]' switcher-value="js">function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt; &lt;p&gt;Good to see you&lt;/p&gt; &lt;/div&gt; ); }</acme-code-block>
<script>
  const block = root.querySelector('acme-code-block'); const code = "function MyComponent(props) {\n\treturn (\n\t
  <div>
    \n\t\t
    <h1>Hello, {props.name}!</h1>
    \n\t\t
    <p>Good to see you</p>
    \n\t
  </div>
  \n\t);\n }"; const codeTs = "function MyComponent(props: Props) {\n\treturn (\n\t
  <div>
    \n\t\t
    <h1>Hello, {props.name}!</h1>
    \n\t\t
    <p>Good to see you</p>
    \n\t
  </div>
  \n\t);\n }"; const codeLua = "local b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'\nlocal decode_table = ffi.new 'uint8_t[256]'\nfor i = 1, #b64 do\n decode_table[str_byte(b64, i)] = i - 1 -- Base64 values start from 0\nend\n\nfunction BloomFilter:has(key)\n local ptr = self.ptr -- uint8_t* pointer to start of base64 string\n for byte_offset, bit_offset in self:iterator(key) do\n local sextet = decode_table[ptr[byte_offset]]\n if band(sextet, lshift(1, bit_offset)) == 0 then\n return false\n end\n end\n return true\nend"; const files = { js: ['language-switcher.jsx', 'jsx', code], ts: ['language-switcher.tsx', 'tsx', codeTs], next: ['language-switcher.tsx', 'next', codeTs], lua: ['bloom-filter.lua', 'lua', codeLua], }; block.addEventListener('acme-change', (e) => { const [filename, language, source] = files[e.detail.value]; block.filename = filename; block.language = language; block.code = source; });
</script>
```

## Hidden line numbers

```html
<acme-code-block aria-label="Hello world" filename="hidden-line-numbers.jsx" hide-line-numbers language="jsx">function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt; &lt;p&gt;Good to see you&lt;/p&gt; &lt;/div&gt; ); }</acme-code-block>
```

## Open in v0

Set `v0` to add an Open in v0 action to the toolbar.

```html
<div class="vstack" style="gap:16px">
  <acme-code-block aria-label="Hello world" filename="Table.jsx" language="jsx" v0="ask">function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt; &lt;p&gt;This is an example React component.&lt;/p&gt; &lt;/div&gt; ); }</acme-code-block>
  <acme-code-block aria-label="Hello world" filename="Table.jsx" language="jsx" v0="build">function MyComponent(props) { return ( &lt;div&gt; &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt; &lt;p&gt;This is an example React component.&lt;/p&gt; &lt;/div&gt; ); }</acme-code-block>
</div>
```

## `<acme-code-block>`

Code block: multi-line source with highlighting in a rounded frame. A filename bar (file icon,
name, the actions: an optional language select and the copy button) sits on top; without a
filename the copy button floats over the code and shows on the block's hover. The content is a
grid of lines, each with a line-number button that marks the line as referenced (amber);
`highlighted-lines-numbers` marks lines blue, `added-lines-numbers` green with a `+`,
`removed-lines-numbers` red with a `-`; `hide-line-numbers` hides the numbers. `switcher`
renders a language select, `tabs` a tab strip above the bar (`switcher-value` is the current
language; a change fires `acme-change`). `v0="ask"` adds an Open in v0 link in a foot,
`v0="build"` a split button. Copies fire `acme-copy`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `filename` | `filename` | `string` | `""` | The paste destination shown in the bar; empty hides the bar. |
| `language` | `language` | `string` | `""` | The language for highlighting (`jsx`, `tsx`, `json`, `bash`, `diff`, …). |
| `hide-line-numbers` | `hideLineNumbers` | `boolean` | `false` |  |
| `highlighted-lines-numbers` | `highlightedLinesNumbers` | `number[]` | `[]` | One-based lines under discussion. |
| `added-lines-numbers` | `addedLinesNumbers` | `number[]` | `[]` | One-based added lines. |
| `removed-lines-numbers` | `removedLinesNumbers` | `number[]` | `[]` | One-based removed lines. |
| `switcher` | `switcher` | `Switch` | `[]` | Language options for a select in the bar: `[{ "label", "value" }]` or `{ "options": [...], "value": "js" }`. |
| `tabs` | `tabs` | `Switch` | `[]` | Language options as tabs above the bar instead of the select. |
| `switcher-value` | `switcherValue` | `string` | `""` | The current language of the switcher or the tabs. |
| `v0` | `v0` | `"" \| "ask" \| "build"` | `""` | Adds an Open in v0 action in a foot: `ask` is a link, `build` a split button. |
| `code` | `code` | `string` | `""` | The source; when empty the element's text content is the source. |
| `referenced-line` | `referencedLine` | `number` | `0` | The one-based line a reader referenced by pressing its number. |
| `aria-label` | `label` | `string` | `""` |  |

Slots: `icon`

Events: `acme-reference`, `acme-change`

## Best Practices

**When to use**

- A code block is for multi-line source the reader scans or pastes, with highlighting.
- One inline token (an env var, a function name, a file path) is Inline Code.
- A shell command or a one-line key to copy is a Snippet: it brings the prompt glyph and the copy control.

**Behavior**

- Always set the language (tsx, bash, json, diff); highlighting is the reason to pick a code block over a plain pre.
- Highlight only the lines the text talks about. When every line is highlighted, none is.
- Mark added and removed lines with the diff language or the added and removed props; a comment such as // added breaks copy and paste.
- Show the filename bar when the snippet has a paste destination (app/page.tsx, vercel.json); leave it off for a passing example.

**Content**

- Snippets stay runnable: real code, never pseudo-syntax, and no $ before a shell command (Snippet draws the prompt, so a $ in the text doubles it).
- Prose around the block is sentence case, and a CLI flag in prose is inline code (--prebuilt).

