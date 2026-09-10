# Code

A snippet of code with syntax highlighting.

## Default

```html
<acme-code syntax="javascript">import { Snippet } from '@vercel/geistcn/components'; import type { JSX } from 'react'; export function Component(): JSX.Element { return &lt;Snippet text="npm init next-app" width="300px" /&gt;; }</acme-code>
```

## `<acme-code>`

Code: a bordered block (radius 5, padding 24, 32px vertical margins) of source in 13/20 mono
with syntax highlighting. The default slot's text is the source; `syntax` names its language
(`javascript`, `tsx`, `json`, `bash`, …); tokens carry `token <kind>` so the kinds' colors apply.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `syntax` | `syntax` | `string` | `""` | The language of the source; unset highlights nothing. |

