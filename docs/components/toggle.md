# Toggle

Displays a boolean value.

## Default

```html
<div class="vstack">
  <acme-toggle aria-label="Enable Firewall"></acme-toggle>
  <acme-toggle aria-label="Enable Firewall" checked></acme-toggle>
</div>
```

## Disabled

```html
<div class="vstack">
  <acme-toggle aria-label="Enable Firewall" disabled></acme-toggle>
  <acme-toggle aria-label="Enable Firewall" checked disabled></acme-toggle>
</div>
```

## Sizes

```html
<div class="row">
  <acme-toggle aria-label="Enable Firewall"></acme-toggle>
  <acme-toggle aria-label="Enable Firewall" size="medium"></acme-toggle>
  <acme-toggle aria-label="Enable Firewall" size="large"></acme-toggle>
</div>
```

## Custom Color

```html
<div class="vstack">
  <acme-toggle aria-label="Enable Firewall" color="amber">
    <svg slot="icon-checked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-lock"/>
    </svg>
    <svg slot="icon-unchecked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-lock-open"/>
    </svg>
  </acme-toggle>
  <acme-toggle aria-label="Enable Firewall" color="red">
    <svg slot="icon-checked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-lock"/>
    </svg>
    <svg slot="icon-unchecked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-lock-open"/>
    </svg>
  </acme-toggle>
  <acme-toggle aria-label="Enable Firewall" color="amber" size="large">
    <svg slot="icon-checked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-lock"/>
    </svg>
    <svg slot="icon-unchecked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-lock-open"/>
    </svg>
  </acme-toggle>
  <acme-toggle aria-label="Enable Firewall" color="red" size="large">
    <svg slot="icon-checked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-lock"/>
    </svg>
    <svg slot="icon-unchecked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-lock-open"/>
    </svg>
  </acme-toggle>
</div>
<script>for (const t of root.querySelectorAll("acme-toggle")) t.addEventListener("acme-change", (e) => { for (const o of root.querySelectorAll("acme-toggle")) o.checked = e.detail.checked; });</script>
```

## With Label

```html
<div class="vstack" style="gap:16px">
  <div class="row" style="gap:16px">
    <acme-toggle>Enable Firewall</acme-toggle>
    <acme-toggle direction="switch-first">Enable Firewall</acme-toggle>
  </div>
  <div class="row" style="gap:16px">
    <acme-toggle size="large">Enable Firewall</acme-toggle>
    <acme-toggle direction="switch-first" size="large">Enable Firewall</acme-toggle>
  </div>
  <div class="row" style="gap:16px">
    <acme-toggle>
      <svg slot="icon-checked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-lock"/>
      </svg>
      <svg slot="icon-unchecked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-lock-open"/>
      </svg>
      Enable Firewall
    </acme-toggle>
    <acme-toggle direction="switch-first">
      <svg slot="icon-checked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-lock"/>
      </svg>
      <svg slot="icon-unchecked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-lock-open"/>
      </svg>
      Enable Firewall
    </acme-toggle>
  </div>
  <div class="row" style="gap:16px">
    <acme-toggle size="large">
      <svg slot="icon-checked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-lock"/>
      </svg>
      <svg slot="icon-unchecked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-lock-open"/>
      </svg>
      Enable Firewall
    </acme-toggle>
    <acme-toggle direction="switch-first" size="large">
      <svg slot="icon-checked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-lock"/>
      </svg>
      <svg slot="icon-unchecked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-lock-open"/>
      </svg>
      Enable Firewall
    </acme-toggle>
  </div>
</div>
<script>for (const t of root.querySelectorAll("acme-toggle")) t.addEventListener("acme-change", (e) => { for (const o of root.querySelectorAll("acme-toggle")) o.checked = e.detail.checked; });</script>
```

## `<acme-toggle>`

A boolean switch: a label root with the text (12px, capitalized), a visually hidden checkbox
with the switch role, a track and a thumb that slides when checked. Sizes small 28×14 /
medium 36×20 / large 40×24; `color` presets amber and red for the track; the `icon-checked`
and `icon-unchecked` slots draw an icon in the thumb. The root carries the interaction states
(data-hover, data-focus, data-active) and the own states (data-checked, data-disabled).
Form-associated and labelable.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `checked` | `checked` | `boolean` | `false` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `size` | `size` | `ToggleSize` | `"small"` |  |
| `color` | `color` | `ToggleColor` | `""` |  |
| `direction` | `direction` | `"label-first" \| "switch-first"` | `"label-first"` | `switch-first` puts the switch before the text. |
| `label-casing` | `labelCasing` | `"title" \| "normal"` | `"title"` | `title` capitalizes the text; `normal` keeps its case. |
| `no-margin` | `noMargin` | `boolean` | `false` | Drops the track's margin. |
| `name` | `name` | `string` | `""` |  |
| `value` | `value` | `string` | `"on"` |  |
| `aria-label` | `label` | `string` | `""` | Accessible name when the toggle has no text of its own. |

Slots: `(default)`

Events: `acme-change`

## Best Practices

- Use a Toggle for one boolean setting where ON takes effect at once, such as Password Protection or Auto-Cancel Builds. A multi-select list is Checkboxes; two or three exclusive views are a Switch.
- The element reflects checked; own the state in your app and update it from acme-change.
- Persist on change and confirm with a success toast (Password protection enabled) so the user knows the flip stuck. Add a form footer only when the setting needs an explicit Save.
- Disable a Toggle only when the action is impossible (missing plan, locked policy), with helper text or a Tooltip that names the way out.
- The label is the element's content, not a prop. Title Case noun phrase, 1–4 words, naming what is true when ON: Password Protection, not Enable Password Protection.
- An optional one-sentence description under the label explains ON only. Do not describe OFF; it is the negation.
- Keep label-casing="title" (the default) so labels match other Title Case surfaces; use normal only for sentence-case text inline beside the toggle.
- Give an accessible name through the content, aria-label or aria-labelledby.
- Set aria-label only when the visible label sits elsewhere in the row; otherwise let the content carry it so sighted and screen-reader copy match.

