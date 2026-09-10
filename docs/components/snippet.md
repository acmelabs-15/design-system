# Snippet

A copyable snippet of code for the command line.

## Default

```html
<acme-snippet text="npm init next-app" width="300px"></acme-snippet>
```

## Inverted

```html
<acme-snippet dark text="npm init next-app" width="300px"></acme-snippet>
```

## Multi line

```html
<acme-snippet text='["cd project", "now"]' width="100%"></acme-snippet>
```

## No prompt

```html
<acme-snippet prompt="false" text="npm init next-app" width="300px"></acme-snippet>
```

## Callback

```html
<acme-snippet text="npm init next-app" width="300px"></acme-snippet>
<script>root.querySelector('acme-snippet').addEventListener('acme-copy', () => alert('You copied the text!'))</script>
```

## Variants

```html
<div class="vstack" style="align-items:stretch">
  <acme-snippet text="npm init next-app" variant="success" width="300px"></acme-snippet>
  <acme-snippet text="npm init next-app" variant="error" width="300px"></acme-snippet>
  <acme-snippet text="npm init next-app" variant="warning" width="300px"></acme-snippet>
</div>
```

## Controlled Copied State

The copied attribute drives the checkmark from outside. A parent surface can copy other text, here from a context card, and reuse the snippet's feedback.

```html
<acme-context-card>
  <div slot="content" class="text-copy-13-mono" style="width:384px;white-space:pre-line"># About Template for a full-featured Next.js AI chatbot # Requirements This template uses the Vercel AI Gateway to access multiple AI models through a unified interface. The default model is OpenAI GPT-4.1 Mini, with support for Anthropic, Google, and xAI models.</div>
  <div role="button" tabindex="0" aria-label="copy content" style="cursor:pointer">
    <acme-snippet text="Copy install prompt" prompt="false" width="300px"></acme-snippet>
  </div>
</acme-context-card>
<script>const copyText = root.querySelector('[slot=content]').textContent; const trigger = root.querySelector('[role=button]'); const snippet = root.querySelector('acme-snippet'); let timer; const copy = () => { navigator.clipboard.writeText(copyText); snippet.copied = true; clearTimeout(timer); timer = setTimeout(() => { snippet.copied = false }, 1000); }; trigger.addEventListener('click', copy); trigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy() } })</script>
```

## `<acme-snippet>`

Snippet: one copyable command in 13/20 mono inside a 6px-radius bordered box, with a `$ `
prompt before each line and a 32px square copy button at the right, whose icon stack swaps to
a check for one second after a copy (or while `copied` is set). `text` takes a string or a
JSON array of lines; `copy-text` is copied instead when set. `dark` inverts the box; `variant`
tints it success, error or warning, `fill` fills it; `placeholder` shows in an empty snippet at
half opacity; `compact` is the 36px one-line box; `icon="false"` drops the button and
`not-focusable` disables it. Fires `acme-copy` after a copy; a failed copy raises an error toast.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `text` | `text` | `string \| string[]` | `""` |  |
| `copy-text` | `copyText` | `string` | `""` | Goes to the clipboard instead of `text`. |
| `prompt` | `prompt` | `boolean` | `true` | `prompt="false"` for URLs, JSON and verbatim output. |
| `icon` | `icon` | `boolean` | `true` | `icon="false"` drops the copy button. |
| `dark` | `dark` | `boolean` | `false` |  |
| `variant` | `variant` | `"" \| "success" \| "error" \| "warning"` | `""` |  |
| `fill` | `fill` | `boolean` | `false` | Fills the box with the type's color. |
| `placeholder` | `placeholder` | `string` | `""` | Shown in an empty snippet, not copied. |
| `compact` | `compact` | `boolean` | `false` | The 36px one-line box. |
| `not-focusable` | `notFocusable` | `boolean` | `false` | Disables the copy button. |
| `width` | `width` | `string` | `""` | CSS width of the box, e.g. `300px` or `100%`. |
| `copied` | `copied` | `boolean` | `false` | Shows the check whatever the button did (controlled). |

Slots: `icon`

Events: `acme-copy`

## Best Practices

- Use Snippet for one shell command the user should copy. Use inline code for tokens (env var names, paths) and Code Block for multi-line source.
- Pass the command in text without a leading $. The component draws the prompt, so text="$ vercel deploy" shows $ $ vercel deploy.
- Set prompt="false" for content that is not a shell command (URLs, JSON, output copied as is) so what is shown matches what is copied.
- Pair placeholder with an empty text for an empty state. Sentence case, no trailing period, no Please: Run vercel link to fetch env vars. The placeholder is information, not copied.
- Keep one command per Snippet. Pass a JSON array to text for a short multi-line block; for longer scripts switch to Code Block so users read before they copy.
- Use copied with the acme-copy event when a parent surface (a card, a tooltip) shows the same checkmark while it copies different text.

