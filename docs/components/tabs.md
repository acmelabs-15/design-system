# Tabs

Display tab content.

## Default

```html
<acme-tabs value="apple">
  <acme-tab value="apple">Apple</acme-tab>
  <acme-tab value="orange">Orange</acme-tab>
  <acme-tab value="mango">Mango</acme-tab>
</acme-tabs>
```

## Disabled

```html
<acme-tabs value="apple" disabled>
  <acme-tab value="apple">Apple</acme-tab>
  <acme-tab value="orange">Orange</acme-tab>
  <acme-tab value="mango">Mango</acme-tab>
</acme-tabs>
```

## Disable specific tabs

```html
<acme-tabs value="apple">
  <acme-tab value="apple">Apple</acme-tab>
  <acme-tab value="orange">Orange</acme-tab>
  <acme-tab value="mango" disabled tooltip="Mangos are not allowed">Mango</acme-tab>
</acme-tabs>
```

## With icons

```html
<acme-tabs value="github">
  <acme-tab value="github">
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-github"/>
    </svg>
    GitHub
  </acme-tab>
  <acme-tab value="gitlab">
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-gitlab"/>
    </svg>
    GitLab
  </acme-tab>
  <acme-tab value="bitbucket">
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true" style="color:#2684ff">
      <use href="#i-bitbucket"/>
    </svg>
    Bitbucket
  </acme-tab>
</acme-tabs>
```

## Secondary

```html
<acme-tabs variant="secondary" value="github">
  <acme-tab value="github">GitHub</acme-tab>
  <acme-tab value="gitlab">GitLab</acme-tab>
  <acme-tab value="bitbucket" disabled>Bitbucket</acme-tab>
</acme-tabs>
```

## `<acme-tabs>`

Tabs. A row of `acme-tab` under an inset hairline (`variant="secondary"`: rounded pills,
no hairline), scrolling sideways without a scrollbar. The tab whose `value` matches is
selected; without a value the first tab is. Focusing a tab selects it; Left and Right move to
the neighbouring tab and select it, stopping at a disabled one; the focus ring stays hidden
after a key move until a tab blurs. `disabled` disables every tab. Fires `acme-change`
(`detail.value`). `acme-tab-panel` elements in the `panels` slot show for their value.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` | The selected tab's value. |
| `variant` | `variant` | `"primary" \| "secondary"` | `"primary"` |  |
| `disabled` | `disabled` | `boolean` | `false` | Disables every tab. |
| `aria-label` | `label` | `string` | `""` |  |

Slots: `(default)`, `panels`

Events: `acme-change`

## `<acme-tab>`

One tab of an `acme-tabs`: a 14px gray-900 button with a transparent 2px bottom border that
turns gray-1000 when selected (a 32px rounded pill with a gray-200 fill in a secondary row).
`value` names it; an `icon` slot goes before the title; `disabled` with a `tooltip` explains
the constraint (shown below). The selected tab is the tabbable one.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |
| `selected` | `selected` | `boolean` | `false` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `tooltip` | `tooltip` | `string` | `""` | Shown below on hover; pairs with a disabled tab to say why. |
| — | `groupDisabled` | `boolean` | `false` | Set by the row: every tab is disabled. |
| — | `secondary` | `boolean` | `false` | Set by the row: the secondary (pill) look. |
| — | `showFocusRing` | `boolean` | `true` | Set by the row: whether keyboard focus shows the ring (hidden after an arrow-key move). |

Slots: `icon`, `(default)`

Events: `acme-tab-select`

## `<acme-tab-panel>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |

Slots: `(default)`

## Best Practices

**When to use**

- Use Tabs to move between sibling views inside one page: Overview, Logs, Settings.
- Navigation between unrelated pages is a sub-menu, not Tabs. Tabs say the views share scope, URL parent and data.
- Cap a row at 5–7 tabs on desktop and 3–4 on mobile. Past that, merge views or move secondary ones into a Menu.

**Behavior**

- Selecting a tab is instant; no network confirmation and no toast on change.
- Reflect the active tab in the URL (query param or path) so deep links and refresh restore it.
- Disable a single tab only for permission or empty-state reasons, and give it a tooltip that names the constraint.

**Content**

- A tab title is Title Case, 1–2 words, and names the destination noun (Overview, Logs, Settings). Verbs belong on buttons; View Logs is wrong on a tab.
- A tab tooltip is sentence case and explains the constraint (Only visible to project owners.), not the tab's purpose.
- No counts in the title (Logs (12)); use a badge and drop it at zero.

**Accessibility**

- Left and Right arrows move focus across tabs; Enter and Space activate. Do not override them with global shortcuts.
- Label the tablist with aria-label when no visible heading sits above it (aria-label="Sections").
- Keep a visible focus ring on the active tab; never remove focus styles for polish.

