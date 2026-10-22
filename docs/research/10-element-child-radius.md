# Research 10: `.el` gives a large button the wrong radius, and the spec cannot say otherwise

Status: historical research with dated implementation follow-ups. Converted 2026-10-21.

## Scope and current interpretation

This is a historical generator investigation from 2026-09-10. Its initial checkpoint records four measured differences, a known cause and two rejected fixes. The [later port completion record](../history/parity-port-plan.md) says Peter accepted the four differences rather than fixing the generator, and Split Button's census reached zero hard differences in both themes. That is acceptance of a measured deviation, not evidence of a generator correction or current component behavior. The migration creates no cleanup task from this closed port question.

The findings below retain their original research dates, source versions, measurements and verification limits. Statements about current code describe the checkpoint in their section. A proposal or source survey is not a decision or runtime acceptance. The [current handoff](../STATUS.md) owns unfinished work; the closed pass's phase gates and delegation do not apply to new work.

## Findings and dated evidence


Found 2026-09-10 while taking split-button from 60 hard differences to 4. The last 4 are this.

## The symptom

A **large** split button's trigger reads `border-radius: 0 6px 6px 0`; the reference reads
`0 8px 8px 0`. Four roots, two each in the reference's "Default" and "Title with Icon" examples,
which are the only large ones on the page.

## The cause, measured

`acme-button` gets its radius right by size — `.btn:where(.lg) { border-radius: 8px }` — and the
split button's **main** button proves it, reading `8px 0 0 8px` correctly. The trigger loses it to a
later rule of equal specificity:

```css
.btn:where(.lg) { border-radius: 8px; }      /* line 113 */
.btn:where(.el) { border-radius: 0.375rem; } /* line 123 — wins, being later */
```

`.el` is `elementChild`: a button whose slotted content is an element rather than text. The split
button's trigger is one, because it slots a `<span class="inner">` holding the chevron.

## Why the generator emitted it, traced rather than guessed

The reference has **one** `elementChild` example, and it is small:

```jsx
<Button elementChild size="small" aria-label="Menu"><IconChevronDown /></Button>
```

So the group has exactly one member, that member does carry `rounded-md`, and every check the
generator makes passes. The emitted selector `.el` then fires on element-child buttons at **every**
size, including large, where the reference is 8px.

Neighbouring groups for the same declaration all carry the guard the spec gave them evidence for —
`:not(.tiny, .lg):is(.tertiary, .error, .warning)`, `:not(.lg).loading`,
`:not(.tiny, .lg).square`. `.el` has no guard because a single small sample gave it no reason to.

**The spec has no evidence about elementChild at large.** Nothing the generator can read says the
radius follows the size there; the reference simply never renders that combination on its own page.

## What the reference actually does, from the wider corpus

Reading every button in the spec by height rather than by declared prop, an element-child button's
radius follows its size exactly like any other button:

| Height | Radius | Element-child buttons |
|---|---|---|
| (tiny) | `rounded-[4px]` 4px | 2 |
| 32px | `rounded-md` 6px | 3 |
| medium | `rounded-md` 6px | 4 |
| **large** | **`rounded-[8px]` 8px** | **3** |

No large element-child button carries `rounded-md`. So the correct rule is `:not(.lg)` on the `.el`
group, matching its neighbours.

## Two fixes I tried and rejected

1. **Guarding the generator's `widen()` last-resort path.** It changed nothing: a trace showed `.el`
   comes from the single-prop pool with `members=1`, never reaching `widen`.
2. **Reading `elementChild` from the DOM.** My first walk found 15 element-child buttons and
   disagreed with the generator's 1. The generator reads the docs page's declared props, not the
   DOM, and its definition is the authoritative one — my walk was measuring a different thing.

The generator is unmodified; `bun tools/geist/gen.ts button` regenerates byte-identically.

## The decision this needs

The investigation found a real measurement gap that the spec could not express. It left three placement options for Peter:

- **In the map**, as a constraint on the `elementChild` group saying its radius follows the size.
  Honest about where the knowledge came from, but the map gains a mechanism it does not have yet.
- **In the element**, as a hand-written rule after the generated sheet. Contradicts the standing
  rule that every declaration ships through the generator.
- **In the generator**, as a rule that a group on one prop never overrides a group on a prop the
  spec varies independently. The broadest fix and the one most likely to move other elements, so it
  needs its own regeneration pass across all 95.

At this initial checkpoint the choice remained with Peter. Split Button had four hard differences, all from the measured cause above. The port completion entry subsequently records his acceptance of the deviation; the original investigation ended before that entry.

## Sources and limitations

Source provenance: notes/analysis/element-child-radius.md (the source path identifies the pre-migration record). The inline sources and saved evidence above retain their original scope. This conversion does not rerun their experiments.

- The old spec lacks large elementChild evidence.
- Both attempted fixes are rejected for recorded reasons.
- The generator remains unchanged at the investigation checkpoint; the later recorded outcome accepts the deviation.
- The accepted old differences do not establish current generator behavior or create a current task.
