# Search Input

A ready-made search field with a magnifying glass and a clear button.

## Default

```html
<acme-search aria-label="Search" placeholder="Enter some text..."></acme-search>
```

## With Cmdk

```html
<acme-search aria-label="Search" cmdk placeholder="Enter some text..."></acme-search>
```

## Disabled

```html
<acme-search aria-label="Search" cmdk disabled placeholder="Enter some text..."></acme-search>
```

## Loading

```html
<acme-search aria-label="Search" loading placeholder="Enter some text..." value="Project A"></acme-search>
```

## Custom Prefix

```html
<acme-search aria-label="Search" placeholder="Enter some text...">
  <svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
    <use href="#i-sparkles"/>
  </svg>
</acme-search>
```

## `<acme-search>`

A search field: a clearable input with a magnifying glass inside the field at the start (an
element in the `start` slot replaces it) and the field named "Search". `loading` swaps the glass
for a spinner; `clearable="false"` drops the clear button and the Escape shortcut.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `loading` | `loading` | `boolean` | `false` | Replaces the glass with a spinner. |
| `clearable` | `clearable` | `boolean` | `true` | `"false"` drops the clear button and the Escape shortcut. |

Slots: `start`

