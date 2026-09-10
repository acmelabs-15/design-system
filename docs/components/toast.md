# Toast

A succinct message that is displayed temporarily.

## Default

```html
<acme-button>Show Toast</acme-button>
<script>root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.message({ text: "The Evil Rabbit jumped over the fence." }));</script>
```

## Multi-line

```html
<acme-button>Show Toast</acme-button>
<script>root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.message({ text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence." }));</script>
```

## With jsx

```html
<acme-button>Show Toast</acme-button>
<script>
  root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.message({ text: Object.assign(document.createElement("span"), { innerHTML: '
  <span style="font-weight:600;letter-spacing:-.28px">The Evil Rabbit</span>
  jumped over the fence.' }), preserve: true }));
</script>
```

## With a link

```html
<acme-button>Show Toast</acme-button>
<script>
  root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.message({ text: Object.assign(document.createElement("span"), { innerHTML: 'The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the
  <a href="/geist">fence again</a>
  .' }), preserve: true }));
</script>
```

## Preserve

```html
<acme-button>Show Toast</acme-button>
<script>root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.message({ text: "The Evil Rabbit jumped over the fence.", preserve: true }));</script>
```

## Action

```html
<acme-button>Show Toast</acme-button>
<script>root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.message({ text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence again.", action: "Undo" }));</script>
```

## Undo

```html
<acme-button>Show Toast</acme-button>
<script>root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.message({ text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence again.", onUndoAction: () => 0 }));</script>
```

## Success

```html
<acme-button>Show Toast</acme-button>
<script>root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.success("The Evil Rabbit jumped over the fence."));</script>
```

## Warning

```html
<acme-button>Show Toast</acme-button>
<script>root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.warning("The Evil Rabbit jumped over the fence."));</script>
```

## Error

```html
<acme-button>Show Toast</acme-button>
<script>root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.error("The Evil Rabbit jumped over the fence."));</script>
```

## `<acme-toast>`

One toast, drawn by `acme-toaster` from its queue: a 420px box (at most the viewport less two
gaps) with a 12px radius, the menu shadow and 16px padding, filled blue, red or amber for the
success, error and warning types. The message row holds the text and the dismiss control (an
undo control before it with `onUndoAction`; none with `hideX` or an action); an action adds a
row of two small buttons, cancel (Dismiss) and the action, and makes the toast an alert dialog.
A visual block sits above the message. The toast enters translated down and transparent over
350ms, hides itself after 3500ms (`timeout`) unless preserved or carrying an action, and leaves
scaled to 0.98 over 160ms. Behind the front toast it collapses to 50px, rises 20px per step and
scales down 5% per step; while the pointer is over the viewport (`hovering`) every toast expands
to its own height and the timers pause. The fourth toast from the front is hidden, the third on
a viewport of 400px or less.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| — | `item` | `ToastItem` | — | The toast shown. |
| — | `queue` | `ToastQueue` | — | The queue the toast belongs to: it takes the measured height and the removal. |
| `position` | `position` | `number` | `0` | The toast's place counted from the front: 0 is the newest. |
| — | `heights` | `(number \| undefined)[]` | `[]` | Every toast's measured height, the front first. |
| `hovering` | `hovering` | `boolean` | `false` | The pointer is over the viewport: the stack expands and the timers pause. |
| `visible` | `visible` | `boolean` | `false` | The toast has entered: its box is drawn in place. |
| `hiding` | `hiding` | `boolean` | `false` | The toast is on its way out. |

## `<acme-toaster>`

The toast viewport: a fixed area a gap (24px) from the bottom right corner of the window, in
the top layer, that stacks the toasts of its queue newest in front. It rises 10px once it holds
more than one toast, and moves to calc(50% - 210px) from the right (half a toast's width) with
`center`. The pointer over the area (or a touch on it) expands the stack and pauses the
toasts' timers. On a touch screen the area keeps clear of the keyboard by the visual
viewport's height. It renders the shared `toasts` queue unless `queue` names another; of
several viewports on one queue the first connected renders, and the next takes over when it
leaves.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| — | `queue` | `ToastQueue` | `toasts` | The queue this viewport shows: the shared `toasts` unless set. |
| `center` | `center` | `boolean` | `false` | Centers the area: calc(50% - 210px) from the right. |

## Best Practices

**When to use**

- A toast is a non-blocking acknowledgment of an action the user started: Domain added, Project archived, Deployment canceled.
- A billing failure, a permission denial or a build failure the user must triage needs more than a toast: pair a toast of six words or fewer (Build failed) with a persistent row that carries the recovery step and a stable identifier.
- Field validation belongs on the Input, not in a toast. A persistent configuration warning belongs in a Note or a Banner.
- Pick the method by how the user experienced the event, not by HTTP status. A user-canceled deploy is toasts.message("Deployment canceled"), not success; a partial deploy with skipped routes is toasts.warning(...).

**Behavior**

- Toasts auto-dismiss by default; pass preserve only when the user must read or act on the message first.
- An undo snackbar stays 5–10 seconds and pairs the past-tense message with a single Undo button.
- Do not narrate one async flow with a stack of toasts; emit the success or error toast at the last step.

**Content**

- One sentence, sentence case, no trailing period when the toast is a single sentence.
- A completion toast reads {Noun} {past participle}: Blob deleted, Domain added, Environment variable saved. Never successfully; the verb implies it.
- An error toast is two sentences with periods and ends with a recovery step: Couldn’t verify domain. Try again. Use Couldn’t for user-state errors and Failed to for system errors, and keep one form through a flow.
- Match the toast verb to the destructive button verb (Delete Project, then Project deleted; never Project removed).
- An undo snackbar uses the literal label Undo, never Restore, Bring Back or Cancel, and only when the rollback is safe.

**Accessibility**

- The toast region announces with aria-live="polite"; keep assertive for blocking errors that interrupt a flow.
- No primary navigation inside a toast; a transient surface is gone before a keyboard user reaches it.

