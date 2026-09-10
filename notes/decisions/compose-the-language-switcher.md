# The code block's language switcher composes our own elements

Decided 2026-09-10 by Peter, who asked why the switcher is not our select and the language tabs
are not our switch.

## The decision

`acme-code-block` composes `acme-select` for the `switcher` property and `acme-switch` (of
`acme-switch-control`) for the `tabs` property. It stops building either one inline.

## What was there

Two hand-built controls inside the code block:

- **The switcher**: a `.switcher` wrapper, a visible `.face` div holding the current label and a
  chevron glyph, and a bare `<select>` at `opacity: 0` layered over it. Plus an `Interaction`
  controller and a `@query` to drive the face's hover and focus states, and a whole generated
  stylesheet, `code-block-switcher.styles.ts`, from a map of its own.
- **The tabs**: an `acme-tabs` of `acme-tab`.

## Why this is not the same question as parity

The reference builds the switcher by hand too. I checked the spec rather than assume:
`data-geist-select` is zero across all nine examples of the code-block page, and their switcher is
the same wrapper, face and transparent native select. Their own Select component appears nowhere
on the page.

So our markup already matched theirs. Peter's point is a different one, and it is the same one he
made about the copy button: **our own system should have one answer to "how do you pick from a
list", not three.** Parity governs style, behaviour and functionality. It does not require us to
copy the reference's decision to skip its own component.

The tabs are the clearer case. A language switcher picks one of several mutually exclusive views.
That is what `acme-switch` is for — a segmented selector with radio semantics — and `acme-tabs` is
for panels.

## What it costs

`acme-select` and `acme-switch` render their own internals, so the census will report differences
against the reference's native select and its tab strip. That is the accepted cost of the decision,
not a defect to chase.

## The defect this introduced, and its fix

Composing changed the event contract, and the first version fired twice. The old markup used the
native `change` event, which does not collide. `acme-select` and `acme-switch` both fire
`acme-change` of their own, which bubbles and is composed, so a listener on the code block saw
every language change twice — once from the composed element, once from the block's own re-dispatch.

Caught by a unit test reporting `["lua", "lua"]`. The block now stops the composed element's event
before dispatching its own. Verified in the browser: one event per change, from both controls.

## What was removed, not deprecated

- `src/components/code-block/code-block-switcher.styles.ts`
- `tools/geist/maps/code-block-switcher.ts`
- the `.switcher` wrapper, the `.face` div, the native `<select>`, the `current` lookup, the
  `switcherEl` query and the `switcherInteraction` controller

## Three rendering defects the first version shipped, all found by Peter in the browser

Composing put our elements inside a frame styled for the reference's own controls. Each defect is
the same shape: a rule written for their box applied to ours, which is a different box.

| Defect | Cause | Fix |
|---|---|---|
| The floating copy button sat in a 24px gap above the code | Composing added two host boxes between the frame and the button. The reference has none: its button *is* the absolutely-positioned box. An in-flow inline host takes a line of the frame's 24px `line-height`, which pushed the content down and left the button floating in the gap. The rule meant to prevent this named `acme-button.floating`, but since composing the class sits on `acme-copy-button`, so it matched nothing. | A block host of zero height. It takes no line, and the frame stays the positioning context the absolute button resolves against. |
| The select's chevron was not flush, the field shifted 12px left | I set `variant="secondary"` when composing. That variant is documented on the element as "no ring, the field shifted 12px left" — a borderless select for inline use, applying `translate: -0.75rem 0`. The switcher is a bordered control in a toolbar. | The default variant. Verified against the select docs page: the native field now aligns with its wrap at offset 0, chevron 12px from the right edge. |
| The switch's ring was clipped on the left, top and bottom | The map pointed our `acme-switch` at the reference's `data-geist-tabs` node, so the generator wrote their scrolling tab-strip rules onto it, including `overflow-x: auto`. A `box-shadow` ring paints outside the border box, so a scrolling ancestor clips it. | The switch is no longer mapped to their tabs node — we chose a different element deliberately, and `acme-switch` carries its own generated styles. The strip takes 1px of padding to give the ring its room. The generator now reports their tab list as an unmapped child, which is accurate and recorded in the map. |

`display: contents` was tried first for the floating host and is wrong: it removes the host box but
promotes the inner `acme-button` into the frame's flow, where its `inline-block` display takes the
same 24px line. Measured, not assumed.

## The tiny size tier

Decided 2026-09-10 by Peter, who asked for a size below small on the select and for space in the
bar and above the frame.

**The tier is called `tiny`, not `extra-small`.** The reference already ships this size and names
it that: their button spec carries a "Tiny tertiary icon" example at `height: 24px`, and
`acme-button` already implements `ButtonSize` `"tiny"`. A second name for one concept would give
the system two words for the same thing.

**Scope: the select only, with a token.** `--acme-form-tiny-height` (24px), `-font` and
`-line-height` are added to the house sheet's `:root`, beside the generated
`--acme-form-small-*` tiers. Those generated tiers are derived by the token pipeline from the
reference's own `--geist-form-*` names and must not be hand-edited, which is why ours lives in
`src/geist.css`.

**One correction to what was said when the decision was put.** I described the button's 24px as
hard-coded. It is not: `button.styles.ts` is generated, and its `.tiny` rule comes from the
reference's own `h-[24px]`. So `acme-button` does not read the new token and must not be changed to
— the generator owns that value, and an edit there is overwritten on the next run. The token serves
the elements we add the tier to ourselves.

Seven other elements keep a three-tier scale. Each gains `tiny` when it needs it.

## The two spacing gaps

| Gap | Was | Now | Why |
|---|---|---|---|
| Strip to frame | 0px | 12px | The reference's own `mb-3` on its tab strip. We lost it when the switch stopped being mapped to their tab list, so it is restored on our own `.strip` rule. |
| Select to copy button | 4px | 8px | The reference's `gap-1` is 4px between two flat, borderless items. Ours holds a bordered select, where 4px puts a visible border against the button. The row also stretched its items, so `align-items: center` was added with it. |

## A third unmapping, for the same reason as the switch

The switcher was still mapped to the reference's select wrapper, whose `h-8` sized **our** host: a
32px box around a 24px field. Same rule as the switch — where we choose a different control from
theirs, its size is ours to set. `acme-select.switcher` is no longer mapped, and the generator now
reports two unmapped children on this page. Both are deliberate and recorded in the map.
