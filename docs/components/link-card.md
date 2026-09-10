# Link Card

A title and a one-line description, raised on hover. House component; Geist has no page for it.

## Grid

```html
<div class="row" style="gap:16px;align-items:stretch">
  <acme-link-card href="#" heading="Analytics" style="width:260px">Traffic and Web Vitals for every deployment.</acme-link-card>
  <acme-link-card href="#" heading="Speed Insights" style="width:260px">
    Real-user performance scores.
    <acme-badge slot="badge" hue="blue" subtle size="small">Beta</acme-badge>
  </acme-link-card>
</div>
```

## `<acme-link-card>`

Vercel link card: a title and one-line description, raised on hover.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `href` | `href` | `string` | `"#"` |  |
| `heading` | `heading` | `string` | `""` |  |

Slots: `(default)`, `badge`

