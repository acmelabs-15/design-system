# Decided: what parity means, and what it does not

Public interfaces prioritize self-consistency, then Lit and web-component conventions, then familiarity to reference users. This order avoids reproducing inconsistent names or React internals in a different platform.

Decided by Peter on 2026-09-10. The original port plan linked this decision.

The systematization pass supersedes this note's unconditional exact-parity requirements: [systematization-goal.md](0105-systematization-goal.md) permits named, sourced, explicitly verified differences. The later [bidirectional-support decision](0007-bidirectional-support.md) also supersedes the no-RTL section below, and [custom themes](0022-custom-themes.md) qualify the fixed default appearance as the default rather than the only supported theme. The interface priority order remains in force; apply later decision notes where they supersede this dated port record.

## The rule

The 2026-09-10 port matched style, behavior and functionality, without copying implementation. Later systematization decisions permit named, sourced and explicitly verified differences.

The reference is React. Ours is Lit web components: a different platform with different idioms,
different composition rules and a different consumer. Copying React's internal shape into a web
component does not make the port more faithful, it makes it worse on the platform it actually runs
on.

The original implementation question was how a Lit component could achieve reference style, behavior and function on its own platform. React's implementation was evidence, not the required internal shape.

## What this means for the public API

Our API does not have to be identical to theirs. It has to be:

1. **Consistent with itself.** One name for one concept, everywhere. Where the reference uses two
   names for one concept across different components, we pick one and use it throughout.
2. **Idiomatic for Lit and the web-component community.** Standard attribute and property
   conventions, standard event patterns, nothing that fights the platform. Where the reference's
   choice would surprise a web-component consumer, ours wins.
3. **Familiar to someone arriving from the reference.** This is the balance. The original port sought a
   recognizable API for reference users. The current naming priority preserves that familiarity after
   consistency and platform conventions; approved systematization decisions can change capabilities and treatments.

Where the reference contradicts itself, that is a licence to choose the better name, not an
instruction to reproduce the contradiction.

## What stays strictly matched

The original port constrained naming separately from parity:

- Exact style meant zero hard census differences in both themes.
- Exact behavior meant matching states, keyboard handling, focus movement and motion.
- Exact function meant every capability of the reference component.
- Fonts remained Google Sans Flex and Google Sans Code.
- Source under `src/` did not name the reference.

The first three requirements are superseded by the linked systematization decisions. The default fonts and reference-name exclusion in source remain selected; custom themes qualify the default appearance.

## The first case this settled

The reference's Button puts the visual look on `type` and the HTML button type on `typeName`. Its
own documentation flags that as a trap. Across its 77 pages the reference uses `variant` 174 times
and `type` 37 times, so `variant` is its own dominant name for the concept.

**Our naming stands: `variant` for the look, `type` for the HTML type.** It is self-consistent, it
is what a web-component consumer expects from `type` on an element that renders a `<button>`, and it
matches the reference's own majority name. No rename.

## The tie-breaker: consistency wins when it conflicts with familiarity

Decided 2026-09-10, on a case the original rule did not anticipate.

Applying the rule to ourselves found six elements naming the visual look `type` while eleven named it
`variant`: feedback, fieldset, select, progress, tooltip and snippet. That is the same inconsistency we
objected to in the reference.

The complication: on tooltip, snippet, progress and feedback **the reference itself uses `type` and never
`variant`**. So our `type` there was not inherited by mistake; it matched the reference exactly. Renaming
would satisfy the first test and fail the third on the same element.

**Peter's decision: rename all six to `variant`.** Self-consistency wins.

**Done 2026-09-10, and the sweep found a seventh.** `acme-menu-item` also used `type` for a look
(`error` colours a destructive row red), so it was renamed too. **18 elements now name the visual look
`variant`, up from 11.**

The sweep also distinguished a kind of thing from an appearance. These were the 2026-09-10 examples of
`type`; the table preserves historical interfaces, including elements later removed:

| Element | What its `type` names |
|---|---|
| `chart` | line, bar or area — the chart's shape |
| `choicebox` | radio or checkbox — the selection mode |
| `file` | the icon: file, lambda, edge function, middleware |
| `breadcrumbs` | text or menu — the layout |
| `button`, `copy-button`, `split-button`, `input` | the real HTML `type` attribute |

**The test to apply:** if the values are appearances of one thing, it is `variant`. If they are different
things, it is `type`. Renaming a kind to `variant` would be consistency for its own sake, which is not
what the rule asks for.

The reasoning worth keeping: a user of a design system meets the whole API, not one element. An
inconsistency costs them on every element they touch, while an unfamiliar name costs them once, on first
contact with that element. So the first test outranks the third even when they point in opposite
directions, and this is now the written tie-breaker rather than a judgement to re-make each time.

## Decided: no right-to-left support, because the reference has none

**Superseded by [bidirectional-support.md](0007-bidirectional-support.md):** the selected scope includes LTR/RTL for pages and sections. The evidence and reasoning below describe the 2026-09-10 port decision, not the current scope.

Decided 2026-09-10, on evidence rather than preference. Peter's position was that it is not a priority
unless it comes free with the reference's own implementation. It does not.

What the reference actually does, measured across its saved stylesheets and pages:

| Signal | Count |
|---|---|
| `dir="rtl"` anywhere | 0 files |
| A `[dir=…]` or `:dir()` selector | 0 files |
| A right-to-left variant prefix in its utilities | 0 files |
| Physical properties (`margin-left`, `padding-left`) | 87 declarations |
| Logical properties (`margin-inline`, `padding-inline`, `inset-inline`) | 75 declarations |

The reference mixes physical and logical properties freely and has no direction handling at all, so it
would break in a right-to-left context. Our generated modules inherited the same mix, faithfully: 101
physical declarations against 74 logical, plus 263 uses of `left` and `right`.

**So supporting right-to-left is not "pulling in" anything from the reference. It would be deviating from
it** on several hundred declarations, and every one of those deviations is a place the census would then
report a difference we would have to accept as a leftover. That trades our strongest quality signal for a
capability the reference does not have.

The historical decision excluded right-to-left support to preserve that exact-port criterion. A future RTL effort was expected to convert physical properties to logical ones, add direction handling and document census differences. The later bidirectional-support decision replaces that exclusion; it is not a current consumer-triggered gate.

## Applying it from here

The retained product priority is self-consistency first, platform idiom second, and familiarity to a reference user third. Its rationale is that an inconsistency costs users across the whole API, while an unfamiliar consistent name is learned once. Current decision and approval procedure belongs to the [maintainer workflow](../../spec/SPEC-maintainer-workflow.md).
