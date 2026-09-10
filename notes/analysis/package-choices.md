# Package choices: what we use, what we should, what to avoid

Researched 2026-09-10 against the npm registry and browser compatibility data. Every claim that changes
what we do was checked against this repository first. Linked from `PLAN.md`.

Peter's rule: for anything complex, use a well-regarded package rather than hand-rolling, and research
what the community holds in high regard — including whether a popular older package has been superseded
by something smaller and more modern. This file is the standing record of those judgements.

## Confirmed correct, keep

| Choice | Evidence |
|---|---|
| `@floating-ui/dom` for overlay placement | Still the standard. CSS anchor positioning now exists in all three engines, but the Safari and Firefox floors are very recent, so it is not a replacement yet. |
| `@internationalized/date` for dates | Keep. The native `Temporal` API has reached the final standards stage and ships in Chrome, Firefox and Edge, but **Safari has not shipped it**, and the polyfill is about a megabyte. Revisit when Safari ships. |
| `@tanstack/lit-virtual` for virtualization | Keep, and **do not** ship the Lit labs virtualizer alongside it. That package has had no functional work in fourteen months and 86 open issues; TanStack shipped days ago. |
| TanStack Store for state | Peter's rule, and correct: it is signal-based underneath, so it is a store built on signals rather than a heavier layer over them. |
| `@zag-js/remove-scroll` for scroll lock | Keep. |
| Vendored command-score | Keep. The npm package is **archived and last published in 2016**; the upstream library vendors it too, and ours is parity-driven. |

## Changed as a result

- **Removed `@lit-labs/virtualizer`.** It was a dependency that nothing imported, and the research
  confirms it is stagnant. TanStack is our virtualization.
- **Removed `@lit-labs/signals`** earlier the same session, for the same reason: a dependency with one
  unused import.

## Corrections to what we assumed

**There is no Zag adapter for Lit.** Verified: the package returns "not found" on the registry, the
framework directory in their repository lists preact, react, solid, svelte, vanilla and vue with no Lit,
and the community pull request adding Lit examples has been open and unmerged since July 2025.

That materially changes the open question in the hand-rolled audit. Adopting Zag means using their
vanilla package plus a reactive controller we write and maintain, and every machine used inside a shadow
root needs its root node passed explicitly or positioning breaks silently.

The case for it is stronger than expected in one respect: their popper package depends on the same
floating-ui we already use, and their date utilities take `@internationalized/date` as a peer dependency,
so it composes with our choices rather than competing with them.

**The recommendation is per-machine, not all-or-nothing.** We own all rendering and styling, so pixel
parity is unaffected either way. The genuine risk is behaviour: their state machines encode their
interaction decisions, and our target is a specific reference implementation. So adopt a machine only
where the reference's behaviour is conventional, and keep ours where the reference diverges. That
decision belongs to each element's port, on evidence, not to a blanket policy.

## Worth adopting

| Need | Choice | Why |
|---|---|---|
| Fuzzy filtering for the combobox | Compare `uFuzzy` and `fuzzysort` against our real option lists before choosing | Ours is 117 hand-written lines. Do not reach for `match-sorter`, which pulls a Babel runtime, or Fuse, which is the heaviest and slowest of the set. Measure on our data. |
| Focus trap | Buy it rather than build it | Neither leading option handles `delegatesFocus`, so read the shadow-DOM handling before choosing. |
| Roving tabindex | **Keep ours.** | No package does this well, and it needs knowledge of our slot assignment that only we have. A 72-line controller beats a dependency here. |
| Schema validation | **Ship none.** | TanStack Form consumes the standard schema interface natively, so accepting that interface generically costs zero bytes. Shipping a validator would force every consumer to bundle a second one. |
| Drag, sort, resize | Framework-agnostic options exist; check status before use | The best-known sorting library is stagnant with hundreds of open issues and mutates the DOM in ways that fight Lit. |

## Delete on sight

Polyfills the platform has absorbed: element internals, inert, focus-visible, CSS anchor positioning,
and duration formatting. None is needed at our support floor.

## A real gap worth naming

**Plural message formatting.** Lit's localisation package cannot express a plural rule, an open issue
since 2021. Across 151 elements that is 151 chances to be wrong in a language with plural categories.
The native message-format API is in no engine yet. If we ever localise, this needs a decision.

## Unverified

- No sizes measured under our own build. Measure before choosing between fuzzy matchers.
- No match-quality testing on our real option data.
- `@tanstack/lit-form` is by far the least-travelled path in our stack, with a major version in alpha.
  Worth watching rather than acting on.
