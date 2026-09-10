# Task

A tinted 36px row with an icon, done or not; the getting-started list. House component; Geist has no page for it.

## List

```html
<acme-tasks style="display:block;max-width:420px">
  <acme-task done>
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-branch"/>
    </svg>
    Connect a Git repository
  </acme-task>
  <acme-task>
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-globe"/>
    </svg>
    Add a domain
    <span slot="end">
      <acme-badge size="small" subtle>2 min</acme-badge>
    </span>
  </acme-task>
  <acme-task disabled>
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-shield"/>
    </svg>
    Enable Attack Challenge Mode
  </acme-task>
</acme-tasks>
```

## `<acme-task>`

Vercel task row: a tinted 36px row with an icon, done or not.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `href` | `href` | `string` | `"#"` |  |
| `done` | `done` | `boolean` | `false` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |

Slots: `icon`, `(default)`, `end`

## `<acme-tasks>`

Slots: `(default)`

