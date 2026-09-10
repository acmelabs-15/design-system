# Markdown

Renders Markdown with TanStack Markdown in the Geist type scale; code fences are highlighted by TanStack Highlight. A house component; Geist has no page for it. House component; Geist has no page for it.

## Default

The element's own text is the source; the common indent is removed.

```html
<acme-markdown>## Deploy Hooks A deploy hook is a URL that starts a build when it receives a **POST**. Create one per branch. - Name the hook after the branch: `main`, `staging`. - Keep the URL out of client code. > A hook without a branch deploys the production branch.</acme-markdown>
```

## Code fences

Fences name their language; a line-numbers attribute adds the gutter.

```html
<acme-markdown line-numbers>Install the package, then import it once: ```bash bun add @acmelabs/design-system ``` ```ts import "@acmelabs/design-system"; import { toasts } from "@acmelabs/design-system"; toasts.success("Domain added"); ```</acme-markdown>
```

## From a property

Set text from script when the source is data.

```html
<acme-markdown id="md-prop"></acme-markdown>
<script>root.querySelector("#md-prop").text = "### Release notes\n\n| Version | Change |\n|---|---|\n| 0.1.1 | Homepage points at the docs |\n| 0.1.0 | First release |";</script>
```

## `<acme-markdown>`

House Markdown: renders Markdown (the element's text, or `text`) with TanStack Markdown, code
fences highlighted by TanStack Highlight, set in the Geist type scale. Raw HTML in the source
is escaped unless `allow-html` is set, which is a trusted-content decision.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `text` | `text` | `string` | `""` | The Markdown source; when empty, the element's own text content is used. |
| `allow-html` | `allowHtml` | `boolean` | `false` | Keep raw HTML in the source. Only for content you wrote. |
| `line-numbers` | `lineNumbers` | `boolean` | `false` | Line numbers on code fences. |

## Best Practices

**When to use**

- Authored prose: release notes, help text, a changelog. Not for user-generated content unless the source is trusted; raw HTML stays escaped unless allow-html is set.

