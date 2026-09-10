# Modal

A dialog over the page for content that needs a decision or more detail before the page continues.

## Default

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Create Token">
  <p slot="subtitle">Enter a unique name for your token to differentiate it from other tokens and then select the scope.</p>
  <p class="text-copy-14">Some content contained within the modal.</p>
  <acme-button slot="actions" variant="secondary">Cancel</acme-button>
  <acme-button slot="actions">Submit</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Sticky

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Create Token" sticky>
  <p class="text-copy-14">Some content contained within the modal.</p>
  <!-- … 49 more paragraphs … -->
  <div slot="actions">
    <acme-button variant="secondary">Cancel</acme-button>
    <acme-button variant="secondary">
      <svg class="ic" width="16" height="16" slot="start">
        <use href="#i-back"/>
      </svg>
      Previous
    </acme-button>
  </div>
  <acme-button slot="actions">Submit</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Single button

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Create Token" sticky>
  <p class="text-copy-14">Some content contained within the modal.</p>
  <acme-button slot="actions" block>Cancel</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Disabled actions

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Modal">
  <p slot="subtitle">This is a modal.</p>
  <p class="text-copy-14">Some content contained within the modal.</p>
  <acme-button slot="actions" variant="secondary">Cancel</acme-button>
  <acme-button slot="actions" disabled>Submit</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Inset

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Modal">
  <p slot="subtitle">This is a modal.</p>
  <acme-modal-inset>
    <p class="text-copy-14">Content within the inset.</p>
  </acme-modal-inset>
  <div style="padding-top:20px">
    <p class="text-copy-14">Content outside the inset.</p>
  </div>
  <acme-button slot="actions" variant="secondary">Cancel</acme-button>
  <acme-button slot="actions">Submit</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Control initial focus

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Initial Focus" initial-focus="#initial-focus-submit">
  <p slot="subtitle">This Modal is set up to programmatically move the focus onto the Submit button, making it possible to promptly continue with the Enter key.</p>
  <acme-button slot="actions" variant="secondary">Cancel</acme-button>
  <acme-button slot="actions" id="initial-focus-submit">Submit</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Focus an input on open

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Invite Member" initial-focus="#invite-name">
  <p slot="subtitle">On both desktop and the mobile bottom sheet, the Name field receives focus when the Modal opens so the user can start typing immediately.</p>
  <div class="vstack" style="gap:12px">
    <acme-input id="invite-name" label="Name" placeholder="Jane Doe"></acme-input>
  </div>
  <acme-button slot="actions" variant="secondary">Cancel</acme-button>
  <acme-button slot="actions">Send Invite</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Mobile sheet with inputs

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Invite Member">
  <p slot="subtitle">On a mobile viewport this opens as a bottom sheet. Verify that both inputs receive focus and accept keyboard input.</p>
  <div class="vstack" style="gap:12px">
    <acme-input label="Name" placeholder="Jane Doe"></acme-input>
    <acme-input label="Email" placeholder="jane@example.com"></acme-input>
  </div>
  <acme-button slot="actions" variant="secondary">Cancel</acme-button>
  <acme-button slot="actions">Send Invite</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Combobox focus

Focus lands on the combobox input when the modal opens, and its list stays closed until the user asks for it.

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Create Database">
  <p slot="subtitle">Choose a region for your database. Reads and writes will take place in this region.</p>
  <acme-modal-inset last>
    <acme-combobox label="Region" size="small" placeholder="Search regions..." options='["Washington, D.C., USA (East) – iad1","San Francisco, USA (West) – sfo1","London, UK (London) – lhr1","Frankfurt, Germany (Central EU) – fra1","Singapore (Southeast Asia) – sin1"]'></acme-combobox>
  </acme-modal-inset>
  <acme-button slot="actions" variant="secondary">Cancel</acme-button>
  <acme-button slot="actions">Create Database</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close());</script>
```

## Toasts and focus trap

```html
<acme-button size="small">Open Modal</acme-button>
<acme-modal heading="Toasts and Focus Trap">
  <p slot="subtitle">The Modal traps focus, so Tab stays within it. Toasts still render above the Modal and remain interactive — trigger one, then click its action. The Modal stays open and focus returns to it.</p>
  <div class="vstack" style="gap:12px">
    <acme-button size="small" variant="secondary" id="show-toast">Show Toast</acme-button>
  </div>
  <acme-button slot="actions">Done</acme-button>
</acme-modal>
<script>const modal = root.querySelector("acme-modal"); root.querySelector("acme-button").addEventListener("click", () => modal.show()); for (const b of modal.querySelectorAll('acme-button[slot="actions"], [slot="actions"] acme-button')) b.addEventListener("click", () => modal.close()); root.querySelector("#show-toast").addEventListener("click", () => window.acme.toasts.message({ text: "Project link copied", action: "Undo", onAction: () => window.acme.toasts.message({ text: "Copy reverted" }) }));</script>
```

## `<acme-modal>`

Modal: a dialog over the page for content that needs a decision. The native dialog opens in the
top layer (focus stays inside it, the page behind is inert), the page stops scrolling, and its
backdrop fades in while the 540px panel (`width`) scales up; on close both fade out and the modal
leaves after the exit, focus back on the opener. The panel holds the body (padding 20, or 0 with
`body-padding="0"`) with its header (`heading` or the `heading` slot, the `subtitle` slot) and
the default slot, then the footer with the `actions` slot: small buttons, one with `block` for a
lone full-width action, or a div of several. `sticky` pins the header and footer while the body
scrolls, each with a shadow once the body's end behind it is out of view. Under 600px it opens as
a bottom sheet (`drawer="false"` keeps the panel; `drawer-height` and `drawer-vertical-scroll`
shape the sheet). Escape and a press outside ask to close (`acme-dismiss`, cancelable), unless
`no-dismiss`, or `enable-skip` for the sheet's outside press; an open popup inside closes first.
Focus goes to `initial-focus` (a selector), else the first tabbable element that is not an
action, else the panel. `acme-open` fires on open, `acme-enter` on Enter, `acme-close` once the
modal has left.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` | `open` | `boolean` | `false` | Open state; `show()` and `close()` set it. |
| `width` | `width` | `number` | `540` | The panel's width in px. |
| `heading` | `heading` | `string` | `""` |  |
| `sticky` | `sticky` | `boolean` | `false` | The header and footer stay in view while the body scrolls. |
| `allow-overflow` | `allowOverflow` | `boolean` | `false` | The panel lets content overflow (a menu opened from inside it). |
| `drawer` | `drawer` | `boolean` | `true` | Under 600px the modal opens as a bottom sheet; `drawer="false"` keeps the panel. |
| `drawer-height` | `drawerHeight` | `ModalDrawerHeight` | `""` | The sheet's height: `max` (the viewport), `expand` (90% of it) or a number of px. |
| `drawer-vertical-scroll` | `drawerVerticalScroll` | `boolean` | `true` | `drawer-vertical-scroll="false"` clips the sheet's content instead of scrolling it. |
| `disable-focus-trap` | `disableFocusTrap` | `boolean` | `false` | No wrapper takes focus around the panel and nothing is focused on open. |
| `enable-skip` | `enableSkip` | `boolean` | `false` | The sheet ignores a press outside it. |
| `no-dismiss` | `noDismiss` | `boolean` | `false` | Escape and a press outside do not close it. |
| `initial-focus` | `initialFocus` | `string` | `""` | Selector (in the light DOM) of the element that gets focus on open. |
| `render-delay` | `renderDelay` | `number` | `0` | Delay in ms before the entrance starts, and the length of the exit (350 by default). |
| `body-padding` | `bodyPadding` | `number` | `20` | The body's padding in px (20); 0 removes it. |
| `center` | `center` | `boolean` | `false` | Centres the title. |

Slots: `subtitle`, `heading`, `(default)`, `actions`

Events: `acme-enter`, `acme-close`, `acme-open`

## `<acme-modal-inset>`

The full-bleed tinted block inside a modal's body: it runs through the body's padding on both
sides (the padding variable reaches it from the body), with a hairline above and below and the
tinted fill. `last` makes it the body's final block: it meets the footer with no bottom hairline
and no body padding under it. An inset with no div after it drops its bottom hairline too.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `last` | `last` | `boolean` | `false` | The inset is the last thing in the body: it meets the footer with no bottom hairline. |

Slots: `(default)`

## Best Practices

**When to use**

- A Modal blocks the page until the user decides. When the page must stay readable beside persistent context, use Sheet on desktop and Drawer on mobile.
- Confirm a destructive action in a Modal. Drawer and Sheet do not dim the whole page, so they feel too soft for a delete or a revoke.
- A routine create flow with its own page goes to that page, not into a Modal.

**Behavior**

- A destructive Modal opens with focus on Cancel. Enter never fires the destructive action unless the user typed a confirmation.
- Escape and a click outside close a non-destructive Modal. A destructive Modal with unsaved input keeps them from closing it.
- Focus stays inside the Modal while it is open and goes back to the trigger when it closes. Body scroll comes back in the same tick the Modal leaves.
- A high-stakes destructive action (delete a production resource, rotate a signing key, downgrade a plan) enables its primary button only after the user types the resource name.

**Content**

- The title is a Title Case statement, never a question: Transfer Project, not Transfer Project?.
- The body is one to three sentences in sentence case. The consequence comes first, then any cascade.
- The primary button is Verb + Noun and repeats the title's verb (Transfer Project title, Transfer Project button). A destructive primary is never Confirm, OK or a bare verb.
- The cancel button reads Cancel. A Modal that only acknowledges (after a key reveal, a one-time view) uses Done, never OK or Close.
- An irreversible body ends with This cannot be undone.; a body with a partial cascade ends with Some effects cannot be undone. and does not claim full irreversibility.
- The success toast repeats the primary button's verb: a Delete Project button gives a Project deleted toast.

**Accessibility**

- The dialog's aria-labelledby points at the title, so screen readers announce it on open.
- The cancel button stays literally Cancel, so screen-reader users hear the same dismissal in every destructive flow.
- After an error inside the Modal, focus stays inside so the user can retry. After success, focus returns to the trigger.

