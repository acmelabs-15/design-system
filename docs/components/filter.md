# Filter

The Vercel filter chips: a pill that names a key and value with a remove, a dashed suggestion, and the add trigger. House component; Geist has no page for it.

## Filter row

```html
<acme-filters>
  <acme-filter add>
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-filter"/>
    </svg>
    Add Filter
  </acme-filter>
  <acme-filter key="Status" value="Error" removable></acme-filter>
  <acme-filter key="Author" value="loriensleafs" suggest></acme-filter>
</acme-filters>
```

## `<acme-filter>`

Vercel filter chips: a pill that names a key and value, with a remove; `suggest` for a dashed suggestion, `add` for the trigger.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `key` | `key` | `string` | `""` |  |
| `value` | `value` | `string` | `""` |  |
| `suggest` | `suggest` | `boolean` | `false` |  |
| `add` | `add` | `boolean` | `false` |  |
| `removable` | `removable` | `boolean` | `false` |  |

Slots: `icon`, `(default)`

Events: `acme-select`, `acme-remove`

## `<acme-filters>`

Slots: `(default)`

