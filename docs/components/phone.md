# Phone

Device chrome that frames a screenshot, a recording or other content the way a real phone would.

## Composition

```html
<div style="width:100%;max-width:320px;margin:0 auto">
  <acme-phone address="https://vercel.com"></acme-phone>
</div>
```

## `<acme-phone>`

Phone frame. A device shell sized by its container (rounded by container width, padded 2.5%)
around a 9:19.5 screen that shows the slotted content on a gray canvas. The shell carries the
island at the top of the screen (`notch`, on by default), the home indicator at the bottom, and
the four side keys (mute, volume up and down on the left, power on the right). With an
`address`, a dark gradient shades the foot of the screen and a navigation bar sits over it: a
back key, an address pill that shows the address without its scheme, `www.` and trailing
slash, and a more key. `variant` picks the shell: `dark` (black, default) or `light` (gray-100
with a gray outline) for a light surrounding page. The frame is decorative: set
`aria-hidden="true"` on the element and describe the screenshot inside it.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `address` | `address` | `string` | `""` | The URL the navigation bar shows; without one the bar and the gradient stay out. |
| `notch` | `notch` | `boolean` | `true` | The island at the top of the screen; `notch="false"` leaves it out. |
| `variant` | `variant` | `"dark" \| "light"` | `"dark"` | The shell: `dark` (black) or `light` (gray-100 with a gray outline). |

Slots: `(default)`

## Best Practices

**When to use**

- Phone is marketing chrome around mobile screenshots, recordings and demo images on landing pages and docs.
- Live mobile product UI does not go inside the frame. The chrome says "captured screen", not "interactive surface".
- To show desktop and mobile side by side, pair it with Browser and keep both on the same theme.

**Behavior**

- Match the variant to the surrounding theme so the chrome does not outshine the screenshot it frames.
- Lock the inner image to a real device ratio (19.5:9 for a modern phone) so the bezel does not crop the content.
- No extra shadow on the parent. The frame carries its own elevation; a second shadow reads as a halo.

**Accessibility**

- The chrome is decorative and carries aria-hidden="true". The accessible name belongs to the inner screenshot.
- The inner image's alt text describes the screen (Vercel dashboard on iPhone), not the device.
- Autoplay video inside the frame respects prefers-reduced-motion and falls back to a paused poster.

