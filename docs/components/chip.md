# Chip

A pressable filter pill; pressed fills solid. Tags are the static small gray keywords. House component; Geist has no page for it.

## Chips

```html
<div class="row" style="gap:8px">
  <acme-chip pressed>All</acme-chip>
  <acme-chip>Production</acme-chip>
  <acme-chip>Preview</acme-chip>
  <acme-chip disabled>Archived</acme-chip>
</div>
```

## Tags

```html
<acme-tags>
  <acme-tag>next.js</acme-tag>
  <acme-tag>edge</acme-tag>
  <acme-tag>iad1</acme-tag>
</acme-tags>
```

## `<acme-chip>`

House chip: a pressable filter pill; `pressed` fills solid.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `pressed` | `pressed` | `boolean` | `false` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |

Slots: `(default)`

Events: `acme-change`

## `<acme-tag>`

House tag: a small gray mono keyword. Wrap several in acme-tags.

Slots: `(default)`

## `<acme-tags>`

Slots: `(default)`

