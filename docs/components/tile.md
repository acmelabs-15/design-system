# Tile

Small figures in a tinted box; the closed state of a fold. House component; Geist has no page for it.

## Default

```html
<acme-tiles>
  <acme-tile label="Months">6.6</acme-tile>
  <acme-tile label="Cash" qualifier="today">$8,429</acme-tile>
  <acme-tile label="Burn" qualifier="/mo">$6,000</acme-tile>
  <acme-tile label="Plain" plain>—</acme-tile>
</acme-tiles>
```

## Large

```html
<acme-tiles>
  <acme-tile large label="Requests">12.4k</acme-tile>
  <acme-tile large label="Errors">0.2%</acme-tile>
</acme-tiles>
```

## `<acme-tile>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | `""` |  |
| `qualifier` | `qualifier` | `string` | `""` |  |
| `plain` | `plain` | `boolean` | `false` |  |
| `large` | `large` | `boolean` | `false` |  |

Slots: `(default)`

## `<acme-tiles>`

House tiles: small figures in a tinted box.

Slots: `(default)`

