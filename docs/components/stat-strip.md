# Stat Strip

Selectable figures across the top of a chart card; the selected one drives the chart. House component; Geist has no page for it.

## Default

```html
<acme-stat-strip value="visitors">
  <acme-strip-item value="visitors" label="Visitors">2,847</acme-strip-item>
  <acme-strip-item value="views" label="Page Views">9,120</acme-strip-item>
  <acme-strip-item value="bounce" label="Bounce Rate">41%</acme-strip-item>
</acme-stat-strip>
```

## `<acme-stat-strip>`

Vercel stat strip: selectable figures across the top of a chart card. Items: acme-strip-item.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |

Slots: `(default)`

Events: `acme-change`

## `<acme-strip-item>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |
| `label` | `label` | `string` | `""` |  |
| `selected` | `selected` | `boolean` | `false` |  |

Slots: `(default)`

Events: `acme-strip-select`

