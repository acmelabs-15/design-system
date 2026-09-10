# Drawer

Shows content in a view of its own, apart from the page behind it.

## Default

A Drawer is for small viewports only. This page shows it at every viewport so you can try it.

```html
<acme-button>Open</acme-button>
<acme-drawer>
  <div style="display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:8px;flex:0 1 auto;padding:48px">
    <p style="font-size:18px;line-height:24px;font-weight:600;text-align:center">A drawer title</p>
    <p class="text-copy-14" style="text-align:center">Drawer body</p>
  </div>
</acme-drawer>
<script>root.querySelector("acme-button").addEventListener("click", () => root.querySelector("acme-drawer").show());</script>
```

## Custom height

```html
<acme-button>Open</acme-button>
<acme-drawer height="200">
  <div style="display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:8px;flex:0 1 auto;padding:48px">
    <p style="font-size:18px;line-height:24px;font-weight:600;text-align:center">A drawer title</p>
    <p class="text-copy-14" style="text-align:center">Drawer body</p>
  </div>
</acme-drawer>
<script>root.querySelector("acme-button").addEventListener("click", () => root.querySelector("acme-drawer").show());</script>
```

## `<acme-drawer>`

Drawer: a bottom sheet for small viewports. The native dialog opens in the top layer (focus stays
inside it, the page behind is inert), the page stops scrolling, the black 40% backdrop fades in and
the full-width popup slides up from the bottom edge, rounded at the top, capped at 80% of the
viewport; `height` fixes it (a number of px, or `max` for the whole viewport). The slotted content
scrolls inside the popup (`vertical-scroll="false"` clips it instead); `heading` puts a title above
it. A swipe down follows the pointer and closes the drawer when released fast, or past half the
popup's height; a shorter one springs back. Escape and a press outside ask to close too, all
through the cancelable `acme-dismiss`; a request during the entrance waits. On close the popup
slides out, then `acme-close` fires and focus returns to the opener. `nested` raises it above an
open modal; `reset-scroll` scrolls the popup to its top whenever it changes; `acme-scroll` fires as
the popup scrolls.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` | `open` | `boolean` | `false` | Open state; `show()` and `close()` set it. |
| `heading` | `heading` | `string` | `""` | The title above the content; the dialog is labelled by it. |
| `height` | `height` | `DrawerHeight` | `""` | The popup's height: `max` (the viewport) or a number of px; unset, its content's, capped at 80% of the viewport. |
| `vertical-scroll` | `verticalScroll` | `boolean` | `true` | `vertical-scroll="false"` clips the popup's content instead of scrolling it. |
| `nested` | `nested` | `boolean` | `false` | The drawer opens from inside a modal: it sits one layer above it. |
| `reset-scroll` | `resetScroll` | `string` | `""` | Any change scrolls the popup back to its top. |

Slots: `(default)`

Events: `acme-close`, `acme-open`

## Best Practices

**When to use**

- A Drawer is a bottom sheet for small viewports only. On desktop use Modal, or Sheet for side context; do not force a Drawer there.
- Do not confirm a destructive action in a Drawer. Its scrim does not block the page fully, so delete and revoke flows lose their weight; use Modal.
- Good uses are short, focused mobile tasks: one form, a filter sheet, a primary call to action with Cancel.

**Behavior**

- A tap outside and a swipe down dismiss it. Keep both unless the form holds unsaved input.
- Keep vertical-scroll on so the body scrolls inside the sheet, not the page behind it.
- Set height only when the default height cuts off the primary action. The action and Cancel stay above the fold.

**Content**

- The title is a Title Case statement that names the entity: Deployment Details, Filter Logs.
- The body is sentence case prose with one Verb + Noun primary button and a literal Cancel. Keep destructive cascade copy out of the small frame.
- Do not repeat the page heading as the title; say what this view does.

**Accessibility**

- Focus stays inside the drawer while it is open and returns to the trigger on close.
- Escape closes it. Honor the system back gesture on mobile so users can leave without the close control.
- Body scroll locks on open and unlocks on close, so iOS rubber-band scroll does not leak through.

