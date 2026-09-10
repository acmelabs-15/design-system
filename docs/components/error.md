# Error

A good error is clear, useful and friendly. A short, accurate message unblocks the user and builds trust by meeting people where they are.

## Default

```html
<acme-error>This email address is already in use.</acme-error>
```

## Custom label

```html
<acme-error label="Email Error">This email address is already in use.</acme-error>
```

## No label

```html
<acme-error>This email address is already in use.</acme-error>
```

## Sizes

```html
<div class="row-md" style="gap:24px;align-items:stretch">
  <acme-error size="small">This email is in use.</acme-error>
  <acme-error>This email is in use.</acme-error>
  <acme-error size="large">This email is in use.</acme-error>
</div>
```

## With an error property

```html
<acme-error error='{"message":"The request failed.","action":"Contact Us","link":"https://vercel.com/contact"}'></acme-error>
```

## `<acme-error>`

Error: inline red copy for a failed section or resource. The root is an atomic alert; a 16px
icon sits left of the text; `label` adds a bold prefix ("Email Error:"); `error` renders a
message and an action link that opens in a new tab. Sizes small 13 / medium 14 / large 16.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | `""` | The bold prefix before the message; unset shows none (`"false"` is read as none too). |
| `size` | `size` | `"small" \| "medium" \| "large"` | `"medium"` |  |
| `error` | `error` | `ErrorInfo \| null` | `null` | `{ "message", "action", "link" }` as JSON: the message, then the action as a link. |

Slots: `(default)`

## Best Practices

**When to use**

- Use Error as a block surface when a section or page-level resource failed to load: a panel, a dashboard card, a route boundary.
- Use toasts.error() for a transient action failure (Couldn’t save settings. Try again.) and the error attribute of Input for field validation. This block replaces neither.
- Pair every platform or system error with a stable identifier: request ID x-vercel-id, deployment ID dpl_…, run ID, trace ID. Validation and permission denials are user state and need no ID.

**Behavior**

- The recovery action does something concrete: Try Again when the operation is safe to retry, a named verb (Reconnect GitHub, Update Payment Method) when it is not.
- No automatic retry in the background; the user came here to decide.
- For a full-page route error, move focus to the Try Again button when it appears, so a keyboard user can retry at once.

**Content**

- Say what happened, then what to do next, in that order. Drop apologetic openers (Unfortunately, Oops, We’re sorry).
- Use Couldn’t or Can’t for user-state errors (Couldn’t verify your passkey. Try again.); use Failed to for system errors that mirror CLI output (Build failed. Bundle exceeds 50 MB.). Unable to is banned.
- Do not fall back to Something Went Wrong as a title; name the resource that failed (Couldn’t Load Page, Couldn’t Load Deployments).
- Show the stable ID on a monospace line under a collapsed details element so the user can paste it into a support thread.
- Never joke in an error. The user is frustrated; insincere copy makes it worse.

**Accessibility**

- When the error appears after a failed fetch, wrap the region in aria-live="polite" so it is announced. Keep aria-live="assertive" for a blocking error that interrupts input.

