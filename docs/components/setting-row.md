# Setting Row

A title and description with a control at the right; rows stack behind hairlines. House component; Geist has no page for it.

## Rows

```html
<acme-setting-rows>
  <acme-setting-row heading="Password Protection">
    Require a password on every preview deployment.
    <acme-toggle slot="control" checked aria-label="Password Protection"></acme-toggle>
  </acme-setting-row>
  <acme-setting-row heading="Production Branch">
    The branch that deploys to production.
    <acme-select slot="control" options='["main","release"]' aria-label="Branch"></acme-select>
  </acme-setting-row>
  <acme-setting-row heading="Transfer Project">
    Move this project to another team.
    <acme-button slot="control" size="small">Transfer</acme-button>
  </acme-setting-row>
</acme-setting-rows>
```

## `<acme-setting-row>`

Vercel setting row: a title and description with a control at the right.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `heading` | `heading` | `string` | `""` |  |

Slots: `(default)`, `control`

## `<acme-setting-rows>`

Slots: `(default)`

