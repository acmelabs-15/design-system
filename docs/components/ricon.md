# Round Icon

A tinted circle for a state or a kind, leading a row. House component; Geist has no page for it.

## Hues

```html
<div class="row" style="gap:12px">
  <acme-ricon>
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-box"/>
    </svg>
  </acme-ricon>
  <acme-ricon hue="green">
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-check"/>
    </svg>
  </acme-ricon>
  <acme-ricon hue="red">
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-alert"/>
    </svg>
  </acme-ricon>
  <acme-ricon hue="amber">
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-clock"/>
    </svg>
  </acme-ricon>
  <acme-ricon hue="blue">
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-rocket"/>
    </svg>
  </acme-ricon>
  <acme-ricon hue="purple">
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-branch"/>
    </svg>
  </acme-ricon>
  <acme-ricon small hue="teal">
    <svg class="ic" width="16" height="16" aria-hidden="true">
      <use href="#i-globe"/>
    </svg>
  </acme-ricon>
</div>
```

## `<acme-ricon>`

House round icon: a tinted circle for a state or a kind.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `hue` | `hue` | `"" \| "green" \| "red" \| "amber" \| "blue" \| "purple" \| "teal" \| "pink"` | `""` |  |
| `small` | `small` | `boolean` | `false` |  |

Slots: `(default)`

