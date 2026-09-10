# Toolbar

A row of controls above a list, with an end group pushed right. House component; Geist has no page for it.

## Default

```html
<acme-toolbar>
  <acme-search placeholder="Search deployments" style="width:260px"></acme-search>
  <acme-select options='["All branches","main"]' aria-label="Branch"></acme-select>
  <acme-button slot="end">Export</acme-button>
  <acme-button slot="end" variant="primary">Deploy</acme-button>
</acme-toolbar>
```

## `<acme-toolbar>`

Slots: `(default)`, `end`

