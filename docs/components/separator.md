# Separator

A line that splits content into sections, horizontal or vertical.

## Horizontal

```html
<div>
  <div style="margin-bottom:16px">
    <h3 class="text-label-16">Section 1</h3>
    <p class="text-copy-14" style="color:var(--ds-gray-900)">This is the first section of content.</p>
  </div>
  <acme-separator></acme-separator>
  <div style="margin-top:16px">
    <h3 class="text-label-16">Section 2</h3>
    <p class="text-copy-14" style="color:var(--ds-gray-900)">This is the second section of content.</p>
  </div>
</div>
```

## Vertical

```html
<div class="row" style="gap:16px;height:32px;flex-wrap:nowrap">
  <p class="text-copy-14">Home</p>
  <acme-separator orientation="vertical"></acme-separator>
  <p class="text-copy-14">About</p>
  <acme-separator orientation="vertical"></acme-separator>
  <p class="text-copy-14">Services</p>
  <acme-separator orientation="vertical"></acme-separator>
  <p class="text-copy-14">Contact</p>
</div>
```

## Orientation Variants

```html
<div>
  <div style="margin-bottom:32px">
    <h4 class="text-label-14" style="margin-bottom:8px">Horizontal Separators</h4>
    <div>
      <p class="text-copy-14" style="margin-bottom:8px">Content above separator</p>
      <acme-separator orientation="horizontal"></acme-separator>
      <p class="text-copy-14" style="margin-top:8px">Content below separator</p>
    </div>
  </div>
  <div>
    <h4 class="text-label-14" style="margin-bottom:8px">Vertical Separators</h4>
    <div class="row" style="gap:8px;height:24px;flex-wrap:nowrap">
      <span class="text-copy-14">Left</span>
      <acme-separator orientation="vertical"></acme-separator>
      <span class="text-copy-14">Center</span>
      <acme-separator orientation="vertical"></acme-separator>
      <span class="text-copy-14">Right</span>
    </div>
  </div>
</div>
```

## `<acme-separator>`

Separator: a 1px gray-200 line. Horizontal fills the width; vertical fills the height of the
row it sits in. The host renders as its contents, so the line itself is the flex or block
item, and a percentage height resolves against the row.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `orientation` | `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | horizontal · vertical. |

