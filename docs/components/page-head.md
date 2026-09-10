# Page Head

The page title, a meta line and the actions; a back link above when the page has a parent. House component; Geist has no page for it.

## Default

```html
<acme-page-head heading="Deployments">
  <span slot="meta">coding-agent-template · Production</span>
  <acme-button slot="actions">Filters</acme-button>
  <acme-button slot="actions" variant="primary">Deploy</acme-button>
</acme-page-head>
```

## With a back link

```html
<acme-page-head heading="dpl_9WjH8QFQySx7" back="Deployments" back-href="#">
  <acme-status-dot slot="meta" state="ready" label></acme-status-dot>
  <acme-button slot="actions" size="small">Visit</acme-button>
</acme-page-head>
```

## `<acme-page-head>`

Vercel page head: title, meta line and actions.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `heading` | `heading` | `string` | `""` |  |
| `back` | `back` | `string` | `""` |  |
| `back-href` | `backHref` | `string` | `""` |  |

Slots: `heading`, `meta`, `actions`

