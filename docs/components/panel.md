# Panel

The dashboard card: radius 6, a shadow border, a 56px head, a body, a footer. Panels lays several out in columns. House component; Geist has no page for it.

## Default

```html
<acme-panel heading="Environment Variables" sub="Values are encrypted at rest." when="Updated 2h ago">
  <acme-button slot="actions" size="small">Add</acme-button>
  <p class="text-copy-14">Three variables in Production.</p>
  <acme-panel-foot slot="footer" tinted>
    Learn more about
    <a href="#">environment variables</a>
    .
    <acme-button slot="actions" size="small" variant="primary">Save</acme-button>
  </acme-panel-foot>
</acme-panel>
```

## Variants

```html
<acme-panels columns="2">
  <acme-panel variant="danger" heading="Delete Project" sub="This cannot be undone.">
    <acme-panel-foot slot="footer" tinted>
      <acme-button slot="actions" size="small" variant="error">Delete</acme-button>
    </acme-panel-foot>
  </acme-panel>
  <acme-panel variant="warning" heading="Trial Ending Soon" sub="3 days left.">
    <acme-panel-foot slot="footer" tinted>
      <acme-button slot="actions" size="small" variant="primary">Add Payment Method</acme-button>
    </acme-panel-foot>
  </acme-panel>
</acme-panels>
```

## Chart panel and a bare head

```html
<acme-panel chart tight>
  <acme-panel-head slot="head" heading="Requests" sub="Last 24 hours">
    <acme-switch slot="actions" size="small" value="1d" name="range">
      <acme-switch-control label="1d" value="1d"></acme-switch-control>
      <acme-switch-control label="7d" value="7d"></acme-switch-control>
    </acme-switch>
  </acme-panel-head>
  <acme-chart height="120">
    <svg viewBox="0 0 600 120" preserveAspectRatio="none" style="width:100%;height:100%">
      <polyline fill="none" stroke="var(--chart-1)" stroke-width="2" points="0,100 150,60 300,80 450,30 600,50"/>
    </svg>
  </acme-chart>
</acme-panel>
```

## `<acme-panel>`

Vercel panel: radius 6, shadow border, a 56px head, a body, a footer.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `heading` | `heading` | `string` | `""` |  |
| `sub` | `sub` | `string` | `""` |  |
| `when` | `when` | `string` | `""` |  |
| `tight` | `tight` | `boolean` | `false` |  |
| `chart` | `chart` | `boolean` | `false` |  |
| `variant` | `variant` | `"" \| "danger" \| "error" \| "warning"` | `""` |  |

Slots: `actions`, `head`, `(default)`, `footer`

## `<acme-panel-head>`

A card or section head with a title, sub line and actions.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `heading` | `heading` | `string` | `""` |  |
| `sub` | `sub` | `string` | `""` |  |

Slots: `heading`, `actions`

## `<acme-panel-foot>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `tinted` | `tinted` | `boolean` | `false` |  |

Slots: `(default)`, `actions`

## `<acme-panels>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `columns` | `columns` | `number` | `2` |  |

Slots: `(default)`

