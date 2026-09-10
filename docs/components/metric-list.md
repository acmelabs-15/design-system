# Metric List

A column of selectable metric cards with a grade threshold. House component; Geist has no page for it.

## Default

```html
<acme-metric-list value="lcp" style="display:block;max-width:280px">
  <acme-metric value="lcp" label="LCP" unit="s" grade="good">1.2</acme-metric>
  <acme-metric value="inp" label="INP" unit="ms" grade="mid">240</acme-metric>
  <acme-metric value="cls" label="CLS" grade="bad">0.31</acme-metric>
</acme-metric-list>
```

## `<acme-metric-list>`

Vercel metric list: a column of selectable metric cards.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |

Slots: `(default)`

Events: `acme-change`

## `<acme-metric>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |
| `label` | `label` | `string` | `""` |  |
| `unit` | `unit` | `string` | `""` |  |
| `selected` | `selected` | `boolean` | `false` |  |
| `grade` | `grade` | `"" \| "good" \| "mid" \| "bad"` | `""` |  |

Slots: `(default)`

Events: `acme-metric-select`

