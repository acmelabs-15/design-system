# Note

A short inline message that needs attention or adds context beside the thing it describes.

## Default

```html
<acme-note>A default note.</acme-note>
```

## Sizes

```html
<div class="row-md" style="gap:24px;align-items:flex-start">
  <acme-note size="small">A small note.</acme-note>
  <acme-note>A medium note.</acme-note>
</div>
```

## Action

```html
<div class="vstack" style="gap:24px;align-items:flex-start">
  <acme-note>
    This note details some information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note>
    This note details a large amount information that could potentially wrap into two or more lines, forcing the height of the Note to be larger.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
</div>
```

## Success

```html
<div class="vstack" style="gap:24px">
  <acme-note variant="success">This note details some success information.</acme-note>
  <acme-note variant="success">
    This note details some success information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="success">
    This note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="success" fill>This filled note details some success information.</acme-note>
  <acme-note variant="success" fill>
    This filled note details some success information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="success" fill>
    This filled note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
</div>
```

## Error

```html
<div class="vstack" style="gap:24px">
  <acme-note variant="error">This note details some error information.</acme-note>
  <acme-note variant="error">
    This note details some error information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="error">
    This note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="error" fill>This filled note details some error information.</acme-note>
  <acme-note variant="error" fill>
    This filled note details some error information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="error" fill>
    This filled note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
</div>
```

## Warning

```html
<div class="vstack" style="gap:24px">
  <acme-note variant="warning">This note details some warning information.</acme-note>
  <acme-note variant="warning">
    This note details some warning information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="warning">
    This note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="warning" fill>This filled note details some warning information.</acme-note>
  <acme-note variant="warning" fill>
    This filled note details some warning information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="warning" fill>
    This filled note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
</div>
```

## Secondary

```html
<div class="vstack" style="gap:24px">
  <acme-note variant="secondary">This note details some secondary information.</acme-note>
  <acme-note variant="secondary">
    This note details some secondary information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="secondary">
    This note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="secondary" fill>This filled note details some secondary information.</acme-note>
  <acme-note variant="secondary" fill>
    This filled note details some secondary information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="secondary" fill>
    This filled note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
</div>
```

## Violet

```html
<div class="vstack" style="gap:24px">
  <acme-note variant="violet">This note details some violet information.</acme-note>
  <acme-note variant="violet">
    This note details some violet information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="violet">
    This note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="violet" fill>This filled note details some violet information.</acme-note>
  <acme-note variant="violet" fill>
    This filled note details some violet information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="violet" fill>
    This filled note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
</div>
```

## Cyan

```html
<div class="vstack" style="gap:24px">
  <acme-note variant="cyan">This note details some cyan information.</acme-note>
  <acme-note variant="cyan">
    This note details some cyan information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="cyan">
    This note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="cyan" fill>This filled note details some cyan information.</acme-note>
  <acme-note variant="cyan" fill>
    This filled note details some cyan information.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note variant="cyan" fill>
    This filled note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
</div>
```

## Disabled

```html
<div class="vstack" style="gap:24px">
  <acme-note disabled fill variant="warning">
    This note details a warning.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
  <acme-note disabled fill variant="warning">
    This filled note details some success information. Check
    <a href="#">the documentation</a>
    to learn more.
    <acme-button slot="action" size="small" variant="primary">Upgrade</acme-button>
  </acme-note>
</div>
```

## Label

```html
<acme-note>
  <span slot="label">Region Change:</span>
  Changing this region restarts all functions.
</acme-note>
```

## Custom icon

```html
<div class="vstack" style="gap:24px">
  <acme-note>
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" slot="icon" aria-hidden="true">
      <use href="#i-sparkles"/>
    </svg>
    A custom icon replaces the variant’s default.
  </acme-note>
  <acme-note no-icon>Pass a null icon to render no icon at all.</acme-note>
</div>
```

## `<acme-note>`

Note: a short inline message beside the thing it describes. The root carries the variant, fill,
size and disabled modifiers; the body holds the icon and the content column; an action wrapper
appears when an action is slotted and rounds the corners to 10px. Slots: default (the content),
`label` (a bold prefix), `icon` (replaces the variant's icon), `action` (one small button, which
a disabled note disables too).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` | `variant` | `NoteVariant` | `""` | Meaning: `error`, `warning`, `success`, `secondary`, `violet`, `cyan`; unset is the default info note. |
| `fill` | `fill` | `boolean` | `false` | Tinted background with a lighter border. |
| `size` | `size` | `"small" \| "medium"` | `"medium"` |  |
| `disabled` | `disabled` | `boolean` | `false` | Gray-700 text and border, transparent background; the slotted action button is disabled too. |
| `no-icon` | `noIcon` | `boolean` | `false` | No icon at all. |

Slots: `label`, `action`, `icon`, `(default)`

## Best Practices

**When to use**

- A Note gives inline feedback next to the field, card or section it is about: a region-change warning above a region picker, a rate-limit notice beside a usage gauge.
- A page-level or system-wide message with a call to action is a Banner; a transient acknowledgment is a Toast; a destructive confirmation is a Modal.
- Pick the variant by meaning: error for a problem the user must fix, warning for a consequence to acknowledge, success for a passed check, secondary for neutral information.

**Behavior**

- A Note stays until the state behind it changes. It has no dismiss control; one would compete with the message.
- One Note per concept. Three Notes stacked on a card point at a page structure problem, not a copy problem.
- The optional action slot holds one inline call to action, never a second button.

**Content**

- The label is a one- or two-word Title Case prefix that names the topic: Region Change, Rate Limit, Plan Limit. Hedges such as Heads Up, FYI and Note go.
- The content is one active-voice sentence that names the impact: Changing this region restarts all functions.
- There is no info variant. Leave variant unset for the default info icon, or use secondary for neutral copy.
- A single-fragment label takes no period; a full sentence in the body does.

