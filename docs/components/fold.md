# Fold

A section that shows tiles closed and charts open, with a count dot. House component; Geist has no page for it.

## Closed and open

```html
<div class="vstack" style="gap:16px">
  <acme-fold heading="Runway" count="3">
    <acme-tiles slot="closed">
      <acme-tile label="Months">6.6</acme-tile>
      <acme-tile label="Cash">$8,429</acme-tile>
      <acme-tile label="Burn">$6,000</acme-tile>
    </acme-tiles>
    <p slot="open" class="text-copy-14">The charts go here.</p>
  </acme-fold>
  <acme-fold heading="Usage" open>
    <acme-tiles slot="closed">
      <acme-tile label="Edge">12.4k</acme-tile>
    </acme-tiles>
    <acme-bar-rows slot="open">
      <acme-bar-row small label="iad1" value="62%" percent="62"></acme-bar-row>
      <acme-bar-row small label="sfo1" value="28%" percent="28"></acme-bar-row>
    </acme-bar-rows>
  </acme-fold>
</div>
```

## `<acme-fold>`

Vercel fold: a section that shows tiles closed and charts open. Slots: closed, open.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `heading` | `heading` | `string` | `""` |  |
| `open` | `open` | `boolean` | `false` |  |
| `count` | `count` | `number` | `0` |  |

Slots: `closed`, `open`

Events: `acme-toggle`

