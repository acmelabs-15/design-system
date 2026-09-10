# Theme Switcher

A control that switches between light and dark themes.

## Default

```html
<acme-theme-switcher></acme-theme-switcher>
```

## Small

```html
<acme-theme-switcher small></acme-theme-switcher>
```

## Disabled

```html
<acme-theme-switcher disabled></acme-theme-switcher>
```

## `<acme-theme-switcher>`

Theme switcher: three radios (system, light, dark) in a 32px pill, each a hidden radio under a
round label with an icon; `small` is the 24px pill with its own glyphs. The checked radio follows
the shared theme store, and choosing one writes the store, which sets `data-theme` on the root
element. Each option span keeps its radio's states as attributes (data-checked, data-disabled,
data-focus) beside the interaction states. `disabled` greys every option and blocks the change.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `small` | `small` | `boolean` | `false` | The 24px pill. |
| `disabled` | `disabled` | `boolean` | `false` |  |

Events: `acme-change`

## Best Practices

- Use the Theme Switcher for the canonical Light / System / Dark control. Place it once per app, in the footer or the settings, not on every page.
- Pass small in dense chrome (footers, dropdowns); the default size belongs on a settings page with room around it.
- Every instance reads and writes the shared theme store, which sets data-theme on the root element and remembers the choice; do not mirror its state elsewhere.
- Set disabled only for a read-only preview of the control itself, or when the app forces one theme.
- Do not rebuild a theme picker from a Switch or three icon buttons. The element already carries the icons, an aria-label per option and System detection.
- The element composes its own option labels (System, Light, Dark); leave them alone so they stay consistent across surfaces.

