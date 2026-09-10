# Card

The block that must read as its own object: a bordered surface with a 6px radius. House component; Geist has no page for it.

## Variants

```html
<div class="row" style="gap:16px;align-items:stretch">
  <acme-card style="padding:16px;width:200px">Default</acme-card>
  <acme-card variant="raised" style="padding:16px;width:200px">Raised</acme-card>
  <acme-card variant="flat" style="padding:16px;width:200px">Flat</acme-card>
  <acme-card variant="feature" style="padding:16px;width:200px">Feature</acme-card>
</div>
```

## `<acme-card>`

House card: the block that must read as its own object.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` | `variant` | `"" \| "raised" \| "flat" \| "feature"` | `""` |  |

Slots: `(default)`

