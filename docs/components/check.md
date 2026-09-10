# Check Row

A checklist row: a 20px box, a text with a sub line, and a when. House component; Geist has no page for it.

## Default

```html
<div class="vstack" style="gap:0;max-width:420px">
  <acme-check checked when="Done">
    Connect a Git repository
    <span slot="sub">GitHub, GitLab or Bitbucket.</span>
  </acme-check>
  <acme-check when="Today">
    Add a custom domain
    <span slot="sub">Point a CNAME at cname.vercel-dns.com.</span>
  </acme-check>
  <acme-check disabled>Enable Attack Challenge Mode</acme-check>
</div>
```

## `<acme-check>`

House checklist row: a 20px box, a text with a sub line, and a when.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `checked` | `checked` | `boolean` | `false` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `when` | `when` | `string` | `""` |  |

Slots: `(default)`, `sub`

Events: `acme-change`

