# Project Banner

A temporary, project-wide notice that stays until someone resolves the state behind it.

## Default

```html
<acme-project-banner cta-label="Disable" cta-href="/">
  <svg class="ic" width="16" height="16" slot="icon">
    <use href="#i-shield"/>
  </svg>
  Attack Challenge Mode is enabled for this project
</acme-project-banner>
```

## Success

A positive, temporary mitigation that protects the project, such as Attack Challenge Mode.

```html
<div class="vstack" style="gap:24px">
  <div class="vstack" style="gap:8px">
    <acme-project-banner variant="success" cta-label="Disable" cta-href="/">
      <svg class="ic" width="16" height="16" slot="icon">
        <use href="#i-shield"/>
      </svg>
      Attack Challenge Mode is enabled for this project
    </acme-project-banner>
  </div>
</div>
```

## Warning

An exceptional state the project must leave, with no rush, such as an active rollback.

```html
<div class="vstack" style="gap:24px">
  <div class="vstack" style="gap:8px">
    <acme-project-banner variant="warning" cta-label="Undo Rollback">
      <svg class="ic" width="16" height="16" slot="icon">
        <use href="#i-rollback"/>
      </svg>
      This project was rolled back by
      <acme-tooltip text="Yesterday for project marketing-website" style="text-decoration:underline dashed;text-underline-offset:5px">@johnphamous</acme-tooltip>
    </acme-project-banner>
  </div>
</div>
<script>root.querySelector("acme-project-banner").addEventListener("acme-action", () => alert("Button clicked"));</script>
```

## Error

Critical downtime, now or soon, that needs immediate attention, such as an overdue payment.

```html
<div class="vstack" style="gap:24px">
  <div class="vstack" style="gap:8px">
    <acme-project-banner variant="error" cta-label="Add Credit Card" cta-href="/$">
      <svg class="ic" width="16" height="16" slot="icon">
        <use href="#i-warn-tri"/>
      </svg>
      Payment failed, update credit card information before your account is shut down
    </acme-project-banner>
  </div>
</div>
```

## `<acme-project-banner>`

Project banner: a full-width, non-dismissible 40px aside naming a project-wide state, with the
one call to action that resolves it. The root carries the variant; inside, a column (a row from
601px) holds the message (the icon wrapper and the label paragraph) and the call to action: a
link with `cta-href`, otherwise a button that dispatches `acme-action`. The action carries the
interaction states (data-hover, data-focus, data-active) and writes its focus ring, colored per
variant, as an inline style. Slots: default (the label), `icon`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` | `variant` | `ProjectBannerVariant` | `"gray"` | Severity: `error` for critical or payment-blocking states, `warning` for an exceptional state, `success` for a positive mitigation, `gray` for routine notices. |
| `cta-label` | `ctaLabel` | `string` | `""` | Title Case Verb + Noun of the resolver, rendered as a link with `cta-href` or as a button that dispatches `acme-action`. |
| `cta-href` | `ctaHref` | `string` | `""` |  |

Slots: `icon`, `(default)`

Events: `acme-action`

## Best Practices

**When to use**

- Project Banner is for project-wide states that need resolution: overdue billing, an active rollback, attack mitigation, an expiring trial that blocks deploys.
- An inline message tied to one field or card is a Note; a transient acknowledgment is a Toast; a confirmation is a Modal.
- The variant follows severity: error for critical downtime or a payment-blocking state, warning for an exceptional state with non-immediate action, success for a positive temporary mitigation, gray for a routine project-wide notice.

**Behavior**

- A Project Banner has no dismiss control by design. A message that can go away without resolving the state is a Note, not a banner.
- One Project Banner at a time. Stacked banners drown the most urgent state.
- Every banner carries a call to action that resolves the state. A banner with no route is a dead end.

**Content**

- The label is one sentence in sentence case that names the impact: Your Pro trial expires in 3 days. No Heads up, no apology first.
- The call to action is Title Case Verb + Noun and points at the resolver: Update Payment Method, Reactivate Project, Review Tokens.
- Name the affected entity when the surrounding chrome does not make the project obvious (Production deployments are paused on my-project).
- No emoji or interjection to signal severity in the copy; the variant carries that signal.

