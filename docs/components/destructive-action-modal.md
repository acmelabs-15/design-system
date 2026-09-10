# Destructive Action Modal

A confirmation for destructive actions: the user must type a phrase before the primary button enables, and a red band can name what cannot be undone.

## Default

The primary button stays disabled until the typed text equals the phrase. The red band at the bottom names what cannot be undone.

```html
<acme-button size="small" variant="error">Delete Project</acme-button>
<acme-destructive-modal heading="Delete Project" confirm-label="Delete Project" verification-label="project name" verification-phrase="next-year-boilerplate" irreversible-description="Deleting next-year-boilerplate cannot be undone.">
  <b>next-year-boilerplate</b>
  and all its deployments, domains, and environment variables will be permanently deleted.
</acme-destructive-modal>
<script>const m = root.querySelector('acme-destructive-modal'); root.querySelector('acme-button').addEventListener('click', () => m.show()); m.addEventListener('acme-confirm', () => { m.loading = true; setTimeout(() => { m.loading = false; m.close(); }, 1500); });</script>
```

## Reversible

Leave out irreversible-description when the action can be undone or re-enabled. The typed gate stays; the red band goes.

```html
<acme-button size="small" variant="error">Disable Vercel Authentication</acme-button>
<acme-destructive-modal heading="Disable Vercel Authentication" confirm-label="Disable Vercel Authentication" verification-phrase="disable vercel authentication">Anyone will be able to view your deployments without being a member of your team.</acme-destructive-modal>
<script>const m = root.querySelector('acme-destructive-modal'); root.querySelector('acme-button').addEventListener('click', () => m.show()); m.addEventListener('acme-confirm', () => m.close());</script>
```

## Loading

loading disables both buttons and spins the primary one while the request runs. The caller owns open: the modal never closes itself on confirm.

```html
<acme-button size="small" variant="error">Delete Project</acme-button>
<acme-destructive-modal heading="Delete Project" confirm-label="Delete Project" verification-label="project name" verification-phrase="my-project" irreversible-description="Deleting my-project cannot be undone." loading>my-project and all its deployments will be permanently deleted.</acme-destructive-modal>
<script>const m = root.querySelector('acme-destructive-modal'); root.querySelector('acme-button').addEventListener('click', () => m.show());</script>
```

## With error

error shows an inline message and keeps the modal open so the user can try again.

```html
<acme-button size="small" variant="error">Delete Project</acme-button>
<acme-destructive-modal heading="Delete Project" confirm-label="Delete Project" verification-label="project name" verification-phrase="my-project" irreversible-description="Deleting my-project cannot be undone." error="Couldn’t delete project. Try again.">my-project and all its deployments will be permanently deleted.</acme-destructive-modal>
<script>const m = root.querySelector('acme-destructive-modal'); root.querySelector('acme-button').addEventListener('click', () => m.show()); m.addEventListener('acme-confirm', () => m.close());</script>
```

## `<acme-destructive-modal>`

Destructive action modal: a 480px modal that confirms a destructive action behind a typed gate.
The panel holds the heading, the description (the default slot) and a stack: the red band naming
what cannot be undone (`irreversible-description`; leave it out for a reversible action), the
prompt "To confirm, type the project name “my-project”" above the verification input, and the
inline error line (`error`). The footer holds Cancel and the red confirm button, which enables
only while the typed text equals `verification-phrase`; Enter in the input confirms the same
way. Leaving the input with a wrong non-empty value marks it invalid ("The project name must
match exactly."). `loading` disables the input and both buttons and spins the confirm. The
input gets focus on open; the typed text resets on close. The caller owns `open`: confirm
dispatches `acme-confirm` and leaves the modal open; Cancel, Escape and a press outside dispatch
`acme-cancel` (cancelable, `detail.reason`) and close it unless the event is prevented.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` | `open` | `boolean` | `false` | Open state; `show()` and `close()` set it. |
| `heading` | `heading` | `string` | `""` | Title Case, Verb + Noun, a statement: "Delete Project". |
| `confirm-label` | `confirmLabel` | `string` | `""` | The confirm button's label; the heading when unset. |
| `cancel-label` | `cancelLabel` | `string` | `"Cancel"` |  |
| `confirm-variant` | `confirmVariant` | `string` | `"error"` | The confirm button's variant. |
| `verification-phrase` | `verificationPhrase` | `string` | `""` | The text the user must type exactly. |
| `verification-label` | `verificationLabel` | `string` | `""` | Names the phrase in the prompt: "To confirm, type the project name …". |
| `irreversible-description` | `irreversibleDescription` | `string` | `""` | The red band's text: "Deleting my-project cannot be undone."; unset for a reversible action. |
| `loading` | `loading` | `boolean` | `false` | Disables the input and both buttons and spins the confirm. |
| `error` | `error` | `string \| Error \| null` | `null` | An inline error under the input (a string, or an Error whose message shows); the modal stays open. |
| `width` | `width` | `number` | `480` | The panel's width in px. |

Slots: `(default)`

Events: `acme-confirm`

## Best Practices

**When to use**

- Prefer it over Modal when the action is destructive and deserves friction: delete, rotate, revoke, disconnect, downgrade, or disable a security setting. Typing the phrase proves intent.
- Use it for reversible actions too when the consequence is serious (disabling deployment protection, revoking a shared token). Keep the typed gate and leave out irreversible-description.
- Skip it for routine confirmations such as save draft, discard changes or close without saving; the typed gate is too heavy there. Use a plain Modal.

**Behavior**

- The input gets focus on open so typing can start at once. The primary button stays disabled until the value equals verification-phrase exactly.
- Enter submits only when the gate is open; otherwise nothing happens. Cancel, a click outside and Escape all dismiss.
- loading disables both buttons. The caller owns open: close the modal after the request settles, or keep it open with an error so the user can retry.
- Match the success toast verb to the primary button: a Delete Project button gives a Project deleted toast, never Project removed.

**Content**

- heading is Title Case, Verb + Noun, and a statement: Delete Project, not Delete this project?.
- The description is sentence case, names the consequence, and names the resource in bold: my-project and all its deployments will be permanently deleted. is stronger than a generic sentence.
- confirm-label equals the heading. Never Confirm, OK, Continue, or a bare verb such as Delete.
- cancel-label is Cancel unless Cancel is ambiguous, for example Keep Turn Running when the primary action is itself a cancellation.
- For an entity delete, the phrase is the resource name (my-project) with verification-label="project name", so the prompt reads To confirm, type the project name “my-project”. Use a lowercase verb phrase (disable vercel authentication) only when there is no entity to name.
- irreversible-description names the action and the resource and ends with cannot be undone.: Deleting my-project cannot be undone. Leave the attribute out for reversible actions.
- error carries the API failure in Vercel voice: Couldn't save settings. Try again. Never a raw error object.

**Accessibility**

- The input's accessible name is the full prompt, and the prompt's for points at the field, so a screen reader announces To confirm, type the project name “my-project” on focus.
- The warning icon in the band is aria-hidden; the sentence carries the meaning.
- Focus stays inside the modal when an error appears, so the user can retry in place. After success, focus returns to the trigger.

