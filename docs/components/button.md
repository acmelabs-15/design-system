# Button

Starts an action or event, such as a form submit or a dialog.

## Sizes

The default size is medium.

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <acme-button size="small">Upload</acme-button>
  <acme-button>Upload</acme-button>
  <acme-button size="large">Upload</acme-button>
</div>
```

## All Types and Sizes in comparison

```html
<div class="vstack" style="gap:24px">
  <div class="row">
    <acme-button size="small" variant="default">Upload</acme-button>
    <acme-button size="small" variant="error">Upload</acme-button>
    <acme-button size="small" variant="warning">Upload</acme-button>
    <acme-button size="small" variant="secondary">Upload</acme-button>
    <acme-button size="small" variant="tertiary">Upload</acme-button>
  </div>
  <div class="row">
    <acme-button variant="default">Upload</acme-button>
    <acme-button variant="error">Upload</acme-button>
    <acme-button variant="warning">Upload</acme-button>
    <acme-button variant="secondary">Upload</acme-button>
    <acme-button variant="tertiary">Upload</acme-button>
  </div>
  <div class="row">
    <acme-button size="large" variant="default">Upload</acme-button>
    <acme-button size="large" variant="error">Upload</acme-button>
    <acme-button size="large" variant="warning">Upload</acme-button>
    <acme-button size="large" variant="secondary">Upload</acme-button>
    <acme-button size="large" variant="tertiary">Upload</acme-button>
  </div>
</div>
```

## Shapes

An icon-only button needs svg-only and an aria-label.

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <acme-button aria-label="Upload" shape="square" size="tiny" svg-only>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-arrow-up"/>
    </svg>
  </acme-button>
  <acme-button aria-label="Upload" shape="square" size="small" svg-only>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-arrow-up"/>
    </svg>
  </acme-button>
  <acme-button aria-label="Upload" shape="square" svg-only>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-arrow-up"/>
    </svg>
  </acme-button>
  <acme-button aria-label="Upload" shape="square" size="large" svg-only>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-arrow-up"/>
    </svg>
  </acme-button>
  <acme-button aria-label="Upload" shape="circle" size="tiny" svg-only>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-arrow-up"/>
    </svg>
  </acme-button>
  <acme-button aria-label="Upload" shape="circle" size="small" svg-only>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-arrow-up"/>
    </svg>
  </acme-button>
  <acme-button aria-label="Upload" shape="circle" svg-only>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-arrow-up"/>
    </svg>
  </acme-button>
  <acme-button aria-label="Upload" shape="circle" size="large" svg-only>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-arrow-up"/>
    </svg>
  </acme-button>
</div>
```

## Prefix and suffix

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <acme-button>
    <svg class="ic" width="16" height="16" slot="prefix" aria-hidden="true">
      <use href="#i-arrow-left"/>
    </svg>
    Upload
  </acme-button>
  <acme-button>
    Upload
    <svg class="ic" width="16" height="16" slot="suffix" aria-hidden="true">
      <use href="#i-arrow-right"/>
    </svg>
  </acme-button>
  <acme-button>
    <svg class="ic" width="16" height="16" slot="prefix" aria-hidden="true">
      <use href="#i-arrow-left"/>
    </svg>
    Upload
    <svg class="ic" width="16" height="16" slot="suffix" aria-hidden="true">
      <use href="#i-arrow-right"/>
    </svg>
  </acme-button>
</div>
```

## Rounded

shape="rounded" together with shadow: the marketing pill.

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <acme-button shadow shape="rounded" size="small" variant="secondary">Upload</acme-button>
  <acme-button shadow shape="rounded" variant="secondary">Upload</acme-button>
  <acme-button shadow shape="rounded" size="large" variant="secondary">Upload</acme-button>
</div>
```

## Loading

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <acme-button loading size="small">Upload</acme-button>
  <acme-button loading>Upload</acme-button>
  <acme-button loading size="large">Upload</acme-button>
</div>
```

## Disabled

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <acme-button disabled size="small">Upload</acme-button>
  <acme-button disabled>Upload</acme-button>
  <acme-button disabled size="large">Upload</acme-button>
</div>
```

## Disabled variants

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <acme-button disabled>Default</acme-button>
  <acme-button disabled variant="secondary">Secondary</acme-button>
  <acme-button disabled variant="tertiary">Tertiary</acme-button>
  <acme-button disabled variant="error">Error</acme-button>
  <acme-button disabled variant="warning">Warning</acme-button>
</div>
```

## Link

An href renders an anchor with the same props as the button.

```html
<acme-button href="#" style="width:fit-content">Sign Up</acme-button>
```

## Custom

variant="custom" takes its foreground, background and border from normal, hover and active.

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <acme-button variant="custom" active='{"foreground":"#fff","background":"var(--ds-blue-700)","border":"var(--ds-blue-700)"}' hover='{"foreground":"#fff","background":"#0B7BFE","border":"var(--ds-blue-700)"}' normal='{"foreground":"#fff","background":"var(--ds-blue-700)","border":"var(--ds-blue-700)"}' width="160">Upgrade to Pro</acme-button>
</div>
```

## `<acme-button>`

Button. The root carries the interaction states (data-hover, data-focus, data-active),
data-prefix and data-suffix, and the icon size variable; the label sits in its own span; a
prefix span appears with a prefix or the loading spinner (a loading button is disabled);
`href` renders an anchor with role="link". Sizes tiny 24 / small 32 / medium 36 / large 40; variants default (primary),
secondary, tertiary, error, warning, custom; shapes square, circle, rounded; svg-only for icon
buttons, which need an aria-label.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` | `variant` | `ButtonVariant` | `"default"` | default (primary, gray-1000) · secondary (white with a ring) · tertiary (transparent) · error · warning · custom. The default is the primary look, as in the reference. |
| `size` | `size` | `ButtonSize` | `"medium"` |  |
| `shape` | `shape` | `"square" \| "circle" \| "rounded" \| ""` | `""` | square or circle for icon-only buttons; rounded is the marketing pill. |
| `svg-only` | `svgOnly` | `boolean` | `false` | Icon-only: no label padding, width equals height. Needs an `aria-label`. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `loading` | `loading` | `boolean` | `false` | Shows the spinner in the prefix and disables the button. |
| `rounded` | `rounded` | `boolean` | `false` | Alias of `shape="rounded"`. |
| `shadow` | `shadow` | `boolean` | `false` | The inset ring instead of a border, for the rounded marketing pill. |
| `block` | `block` | `boolean` | `false` | Full width (house). |
| `width` | `width` | `number` | `0` | A fixed width in px (min and max). |
| `href` | `href` | `string` | `""` | Renders an anchor. |
| `target` | `target` | `string` | `""` | The anchor's target and rel; a target opens the link there. |
| `rel` | `rel` | `string` | `""` |  |
| `type` | `type` | `"button" \| "submit" \| "reset"` | `"button"` | The HTML button type. |
| `normal` | `normal` | `ButtonColors` | — | `custom` colors at rest: `{ "foreground": "#fff", "background": "var(--ds-blue-700)", "border": "…" }`. |
| `hover` | `hover` | `ButtonColors` | — | `custom` colors on hover. |
| `active` | `active` | `ButtonColors` | — | `custom` colors while pressed. |
| `aria-label` | `label` | `string` | `""` |  |
| `aria-haspopup` | `haspopup` | `string` | `""` | Forwarded to the inner control, for a button that opens a menu or a popover. |
| `aria-expanded` | `expanded` | `string` | `""` |  |
| `aria-controls` | `controls` | `string` | `""` |  |

Slots: `prefix`, `suffix`, `(default)`

## `<acme-button-group>`

A joined group of buttons; add `split` for the Geist split button.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `split` | `split` | `boolean` | `false` |  |

Slots: `(default)`

## Best Practices

- A button is for an action that changes state (deploy, save, delete); a link (href) is for navigation that changes the URL. When several related actions share a row, use a Menu or a Split Button.
- The default button is primary. Use variant="secondary" for the supporting action and variant="error" for a destructive confirmation. primary, success, ghost and violet are not variants.
- A form submit sets type="submit"; the visual variant lives on variant, not on type.
- Set loading instead of swapping in a spinner: the button stays focusable and announces the busy state.
- Disable a button only when the action is impossible right now (missing input, no permission), and add a Tooltip that says why.
- Title Case the label and name what happens: Deploy Project, Invite Member, Rotate Key. Not a bare verb (Submit) and not a generic confirm (OK, Confirm).
- A destructive button reads Verb + Noun and pairs 1:1 with its toast: Delete Project, then Project deleted. A mode switch ends in Instead: Use a Recovery Code Instead.
- An icon-only button needs both svg-only and an aria-label. The label names the action and the target (Copy deployment URL), not the icon (Copy).
- Do not set an aria-label on a button that has visible text; it replaces the label and the screen reader hears something else.

