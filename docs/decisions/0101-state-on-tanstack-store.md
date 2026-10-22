# Element state lives in a per-instance TanStack Store

Each element keeps canonical state in a per-instance TanStack Store. This preserves one state model for local and shared values, despite common design systems using framework-local state.

Decided 2026-09-10 by Peter. This supersedes a narrowing I wrote without asking.

## The decision

Every element holds its own state in a TanStack Store created per instance, the way TanStack Form
creates a store per form and per field. `@state()` is not used for new work.

## What this replaces, and why the record matters

Peter's rule, from the commit that established it: **"any state management, anywhere in this system,
uses TanStack Store."**

In that same commit I wrote a narrowing — *"state inside a single element stays on Lit's own reactive
properties; anything shared between elements belongs in a store"* — into the README, into
`src/shared/state.ts` and into an analysis note. It was my interpretation, never Peter's decision.
When he later asked whether the copy button should use the store, I cited that narrowing back to him
as though it were established, and cited "no element does this" as evidence, which is the circular
argument our own rules forbid: if a rule was ignored, the resulting pattern is evidence of the
omission, not evidence against the rule.

## The evidence, gathered before deciding

Two independent research passes on 2026-09-10 read source rather than documentation. The measurements and package observations below describe those passes; they are not current universal performance claims.

| Question | Finding |
|---|---|
| Is it signal-based? | Yes. A vendored alien-signals graph, with push-based dependency tracking, memoised derived values, `batch()`, and glitch-free diamond propagation. |
| Bundle cost | 1.6 KB for the store, 1.9 KB with the Lit adapter. Not an argument either way. |
| Performance against `@state()` | 0.0011 ms against 0.0015 ms per update. Both about 1.5 microseconds — noise. Lit's own signals RFC says "signals aren't necessary for performance". |
| What TanStack say it is | "A framework-agnostic signals implementation." Their React adapter documents `useCreateStore` as "only created once per mount", and **Form creates a store per form and per field** — so per-instance stores are their own pattern. |
| Prior art | Spectrum, Shoelace, Material Web, Red Hat, Fluent, UI5, Vaadin and Nord hold local state in the framework's own decorator: 235 declarations, no stores. Carbon ships a signals library, uses it for cross-component coordination, and keeps `@state()` for local state in the same file. |

The prior art points the other way, and Peter chose the rule anyway. That is a legitimate call: the
evidence says the two are equivalent in cost and performance, and consistency across one system has
its own value.

## The pattern

This historical excerpt comes from the first migrated element, `src/components/copy-button/copy-button.ts`. The later [public-state bridge decision](0080-public-state-bridge.md) records a derived-state failure and the canonical public-property contract; this excerpt is not the current recommended API:

```ts
private ownState = createStore({ done: false, hasIcon: false });
private showsCheck = createStore(() => this.copied || this.ownState.get().done);
private selector = new StoreSelector(this, () => this.ownState);
private checkSelector = new StoreSelector(this, () => this.showsCheck);

private set(patch: Partial<{ done: boolean; hasIcon: boolean }>) {
  this.ownState.setState((s) => ({ ...s, ...patch }));
}
```

Four things to know, each learned the expensive way:

- **A derived store is the point.** Form's per-field store is a function reading the form's store, not
  a holder for a value. The intended `showsCheck` derivation followed `copied` or `done`. The later public-state bridge review found that a plain `copied` property did not update the derived store. Store-backed public accessors resolve that ownership requirement; the original example alone did not.
- **One selector per store, and the count is load-bearing.** A derived store only re-renders for what
  *it* reads. `hasIcon` is read by the template alone, so it needs its own selector. Removing it left
  a late-slotted icon showing the fallback glyph beside it.
- **The unit tests cannot see this.** `slotchange` does not fire under happy-dom, so that failure
  passed the suite. Browser verification was required for every migrated element.
- **`setState` takes an updater function, not a value.** Passing a value is a type error rather than a
  runtime failure, which is the better outcome, but it is not the shape the name suggests.

## The order

The 2026-09-10 migration census found 147 fields across 57 elements:

| Group | Elements | What a store gives |
|---|---|---|
| Several fields genuinely combined in one expression | 15 | A real derived value |
| Several fields, never combined | 16 | Nothing to derive |
| One field only | 26 | Nothing to derive |

The migration prioritized the 15 combined-field elements, including context-card, feedback, modal, drawer, combobox and tooltip. They established the derived-store pattern before the 42 simple cases. This completed order is historical, not a current task queue.

## The adapter needs a patch to be safe

The inspected `@tanstack/lit-store` 0.13.2 lacked `hostConnected`, so a moved element stopped following its store. The fix was recorded in `patches/`, guarded by `src/shared/__tests__/store-reconnect.test.ts`, and tested by removing the patch. The 2026-09-10 comparison counted 2,308 weekly adapter downloads against 15.4M for core and found no public design-system adopter. These dated observations supported caution about the adapter; they do not establish current usage or package versions.

## What would change this

A measured cost that the research did not find — a real performance difference at the scale of a
whole page, or a failure mode in the adapter that the patch cannot cover.
