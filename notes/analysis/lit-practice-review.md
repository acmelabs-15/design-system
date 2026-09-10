# Lit practice review

Researched 2026-09-10 against lit.dev and the installed packages, then every actionable claim was
checked against this repository before being written down. Linked from `PLAN.md`.

Peter's prompt was the `cache` directive: are we leveraging Lit's own mechanisms where they would help?
The honest answer is that `cache` is not the gap. Four other things are.

## Checked against our code, and NOT a problem here

Recorded so nobody re-investigates:

| Claim | Reality here |
|---|---|
| `delegatesFocus` combined with a roving-tabindex controller is a focus bug | **Does not apply.** choicebox, menu and tabs use `RovingTabindex`; none sets `delegatesFocus`. |
| The Lit template compiler may not run under a Bun build | **It runs.** `scripts/build.ts` drives the TypeScript transpiler directly with `compileLitTemplates()` as a `before` transformer, so Bun's bundler is not involved. The build reports 129 modules with compiled templates. |
| `match-sorter` drags in a Babel runtime | **Does not apply.** Ours is hand-written in `src/shared/match-sorter.ts` with no imports. |
| Form controls are not form-associated | **Already correct.** Every one declares `formAssociated`, and 14 files use `ElementInternals`. |
| Elements lack typed tag declarations | **Already correct.** All 151 declare `HTMLElementTagNameMap`. |

## Found, fixed already

**Reflected defaults wrote attributes nobody set.** Lit reflects a property on first render, default
included, so `acme-sheet` wrote `side="right"` and `acme-entity` wrote `as="li"` onto bare hosts. Wrong
twice: the consumer's markup gains an attribute they never wrote, and the census reads selectors against
the host, so a spurious attribute can change what a rule matches. Both now declare `useDefault: true`,
with a regression test in `src/shared/__tests__/reflect.test.ts`.

## Real gaps, in value order

### 1. No custom-elements manifest — the highest-leverage missing piece

We ship 151 elements with no `custom-elements.json`. Generating one with the standard analyser and
pointing `package.json#customElements` at it gives every consumer editor autocomplete, attribute
documentation and type hints. Every major web-component library ships one. It is driven from JSDoc tags
we would add anyway: `@slot`, `@csspart`, `@cssprop`, `@fires`, `@attr`.

### 2. `sideEffects: true` blocks tree-shaking

Ours is a blanket `true`, which tells a bundler nothing can be dropped. A blanket `false` would be an
outright bug, because registering a custom element **is** a side effect. The correct shape lists the
registering modules while leaving pure class modules shakeable. Worth pairing with the packaging linters
that check an `exports` map and its types.

### 3. `:state()` instead of reflecting for styling

We reflect 94 properties. Some of those reflect only so CSS can select them. Custom state selectors are
the modern mechanism for that and keep the attribute surface clean. Audit which of the 94 exist purely
for styling and move those.

### 4. Only four directives across 151 elements

We import `styleMap`, `classMap`, `unsafeHTML` and `repeat`. That is a thin slice of the 21 available.
The useful ones for us, with when they earn their place:

| Directive | Earns it | The mistake |
|---|---|---|
| `ifDefined` | Omitting `href`/`src` rather than emitting an empty one | With several expressions in one attribute, the whole attribute drops if any is nullish |
| `live` | A value that changes outside Lit, such as a native input's `.value` | Using it when we own the value |
| `ref` | Imperative handles: focus, measurement | Reading it in `render()` instead of `updated()` |
| `keyed` | Forcing teardown so stale state clears | Confusing it with `repeat` keys |
| `cache` | A container toggling repeatedly between a few *heavy* subtrees | There is **no eviction**: every template ever rendered at that position is retained. Wrong for one-shot switches |
| `guard` | Skipping expensive work behind an immutable reference | With a mutable array the reference never changes and updates are silently dropped |

On `repeat` versus `.map()`: `repeat` earns its place only when items **reorder** *and* rows hold DOM
state that must travel with them, such as focus or an open dropdown. Otherwise `.map()` is smaller and
faster. Reaching for `repeat` reflexively "for performance" costs a key map and buys nothing.

Two traps to avoid entirely: `unsafeHTML` on a public property is a cross-site-scripting hazard for
every consumer, and static expressions cache every unique value permanently, so dynamic tag names leak.

## Corrections to common assumptions, verified

- **There is no Lit 4.** Current is 3.3.3. No labs package has graduated since October 2023.
- **The template compiler is the lowest maturity tier**, labelled prototyping, and we ship it in
  production. It works and the gains are real, so keep it — but pin the TypeScript version and make sure
  tests exercise compiled output, because compiled and uncompiled templates take different code paths.
- **Scoped registries shipped natively** in Safari 26 and Chrome 146, but not Firefox, and Lit core does
  not use the native API yet. Our decision to defer them until after the port stands, and the reason is
  now stronger: the labs package's own documentation is stale on browser support.
- **Signals are still an early-stage proposal**, not near standardisation. Keeping them out of our public
  surface was right, and we have now removed the last unused import.
- **`@lit-labs/forms` exists at version 0.1.0** with a single release. Our own `ElementInternals` usage is
  the safer path; it is a well-specified platform API and that package is the least proven thing here.

## Accessibility: our current approach is right

We set ARIA on inner elements rather than through `ElementInternals`. That remains correct, for a scope
reason rather than a support reason: an identifier reference reaches the same tree or a parent tree, so
inner-element references inside one shadow root work, while a reference from outside into a shadow root
does not, and an out-of-scope reference is **silently dropped**. Use `ElementInternals` for host-level
role and state defaults; keep relationship attributes on inner elements. Revisit when the reference-target
mechanism ships across engines.

## What to do, and in what order

1. Generate the custom-elements manifest and wire it into the package.
2. Fix `sideEffects` to list registering modules.
3. Audit the 94 reflected properties: add `useDefault` where a default exists, move styling-only ones to
   custom state selectors.
4. Adopt `ifDefined` where we emit possibly-empty attributes, and `live` where a native value can change
   outside Lit. Leave `cache` alone unless a container proves it needs it.

## Accessibility: the evidence for keeping our approach

Researched separately and in depth, including empirical checks in a current browser. The conclusion is
stronger than "our approach is acceptable": **migrating to host-level ARIA would be a step backward.**

What the three leading web-component design systems actually do, read from their source: all three put
ARIA on inner shadow-DOM elements. None uses `ElementInternals` for ARIA generally. They use it for form
association and custom states, which is exactly what we use it for.

Three reasons a migration would hurt, each verified:

1. **It breaks the role and value pairing.** A textbox or combobox exposes a live value. Put the role on
   the host while the editable control stays in the shadow DOM, and the value and the role sit on
   different nodes, so the accessible value stops tracking the control.
2. **Our own tests could not read back what they assert.** Host ARIA set through internals is invisible to
   DOM inspection: reading the attribute returns nothing while the internal value is set. There is still
   no standard way to query it, and the proposal to add one is open.
3. **It does not solve the problem that motivates it.** An identifier reference still cannot cross into a
   shadow root. Element reflection, which is broadly available, works **outward** only: a component can
   label itself from slotted light DOM, but an outside label cannot reach in. Setting it that way fails
   *silently*, reading back as empty.

So the shape to adopt:

| Case | Mechanism |
|---|---|
| Relationship attributes within one shadow root | Keep them on inner elements. Plain identifier references work there. |
| A component labelling itself from slotted light DOM | Element reflection. Broadly available and works in that direction. |
| Host role for something with no live value and no native element surrendered | `ElementInternals` is reasonable here, and only here. |
| An outside label reaching into a shadow root | Wait. The reference-target mechanism is the real fix, unflagged in one engine only and behind flags elsewhere. Design for it; do not depend on it. |

One practical note: accessibility rule checkers produced false positives on elements using internals ARIA
until a recent version. If we adopt any of it, pin a current checker.

**On `delegatesFocus`:** correct for a single-control wrapper, wrong for a composite or anything with a
roving tabindex. We already have that right — no element combines it with the roving controller. The one
trap to avoid is pairing it with a host `tabindex`, which creates two tab stops where there should be one.
