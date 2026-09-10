# Feedback

Collects written feedback together with an emotion.

## Default

For desktop only.

```html
<div class="row" style="justify-content:center;align-items:flex-start;min-height:300px">
  <acme-feedback label="vercel" dry-run></acme-feedback>
</div>
```

## Inline

```html
<div style="min-height:300px">
  <acme-feedback dry-run label="vercel" variant="inline"></acme-feedback>
</div>
```

## Feedback with Select

Feedback with a fixed list of topics.

```html
<div class="row" style="justify-content:center;align-items:flex-start;min-height:300px">
  <acme-feedback label="vercel" show-topics dry-run></acme-feedback>
</div>
```

## Feedback with metadata

Feedback with any key-value metadata attached to the submission.

```html
<div class="row" style="justify-content:center;align-items:flex-start;min-height:300px">
  <acme-feedback label="vercel" dry-run metadata='{"userId":"user_12345","location":"post-checkout","orderId":"order_123456"}'></acme-feedback>
</div>
```

## Feedback with prefix

```html
<div style="min-height:300px">
  <acme-feedback dry-run label="vercel">
    <svg class="ic" width="16" height="16" slot="start" aria-hidden="true">
      <use href="#i-flag"/>
    </svg>
  </acme-feedback>
</div>
```

## Feedback with suffix

```html
<div style="min-height:300px">
  <acme-feedback dry-run label="vercel">
    <svg class="ic" width="16" height="16" slot="end" aria-hidden="true">
      <use href="#i-flag"/>
    </svg>
  </acme-feedback>
</div>
```

## `<acme-feedback>`

Feedback: a note plus an emotion. A small secondary "Feedback" button opens a 340px card 8px
under it (`aria-haspopup="dialog"`): a textarea, a markdown hint, and a footer with four
emotion radios and a Send button. `variant="inline"` renders the "Was this helpful?" pill with the
four faces instead; a face grows the pill into the card (336px wide) in place, `upwards` keeps the
row 48px high and shifts the card up, `full-width` fills the row. `show-topics` adds a topic
select and `show-email` an email field above the textarea. Send validates (topic, email, note,
emotion) and shows the message under the textarea; a dry run skips both the checks and the
request. Success swaps the form for a check and two lines, then the card closes after 4s (later
while the pointer rests on it) and the fields reset. Escape closes, ⌘Enter sends, a click
outside closes, focus returns to the trigger. The default slot is unused; `start` and `end`
decorate the trigger. Fires `acme-open`, `acme-close` and `acme-submit` (the payload).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | `""` | The source the submission names. |
| `button-text` | `buttonText` | `string` | `"Feedback"` | The trigger's text. |
| `button-variant` | `buttonVariant` | `FeedbackButtonVariant` | `"secondary"` | The trigger's variant: `secondary` (default), `default` or `tertiary`. |
| `button-type` | `buttonType` | `"button" \| "submit" \| "reset"` | `"button"` | The trigger's HTML type. |
| `copy` | `copy` | `string` | `"Was this helpful?"` | The prompt beside the faces of the inline pill. |
| `variant` | `variant` | `FeedbackVariant` | `""` | `inline` renders the pill instead of the trigger. |
| `upwards` | `upwards` | `boolean` | `false` | The inline card opens upward: the row keeps its height and the card shifts up. |
| `full-width` | `fullWidth` | `boolean` | `false` | The inline pill fills its row. |
| `show-topics` | `showTopics` | `boolean` | `false` | Adds the topic select above the textarea. |
| `show-email` | `showEmail` | `boolean` | `false` | Adds the email field above the textarea. |
| `email` | `email` | `string` | `""` | A known email, sent instead of the field's value. |
| `plan-name` | `planName` | `string` | `""` | The plan the submission names. |
| `site-type` | `siteType` | `string` | `"front"` | The site the submission names in its client string. |
| `metadata` | `metadata` | `Record<string, unknown>` | `{}` | Key-value context sent with the submission, as JSON. |
| `dry-run` | `dryRun` | `boolean` | `false` | Skips the checks and the request: the thank-you shows at once. |
| `endpoint` | `endpoint` | `string` | `"/api/feedback"` | Where a submission is posted, as JSON. |
| `open` | `open` | `boolean` | `false` | The card is open (the trigger's card, or the inline pill grown into the card). |

Slots: `start`, `end`

Events: `acme-open`, `acme-close`

## Best Practices

**When to use**

- Place Feedback at the end of a page, doc or finished flow, where the user has formed an opinion. Do not put it at the top of a surface the user has only just opened.
- Use the topic select when feedback maps to categories the team triages (Bug, Pricing, Documentation); skip it when the open textarea is enough.
- Feedback is not a support form, a bug-report intake or NPS sampling. Those have their own surfaces.

**Behavior**

- The panel stays closed until the user clicks the trigger; opening it on its own derails the work that prompted the feedback.
- Pair the metadata variant with context that holds no personal data (route, build ID, plan, viewport) so the team can reproduce the report without a second round-trip.
- Submit closes the panel and returns focus to the trigger. No acknowledgment toast: the close is the acknowledgment.

**Content**

- label is Title Case and short. The default Feedback is fine; change it only to scope a flow: Feedback on Imports, Report a Bug. No question mark at the end.
- copy replaces the prompt beside the emoji row, in sentence case (How did the import go?). Cut please and we’re sorry.
- The textarea placeholder (Your feedback...) is fixed; do not replace it with rich content.

