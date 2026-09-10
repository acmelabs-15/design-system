# Parity port plan

The one and only plan for this project. Read this file first and you know what we are building,
how we prove it, and where we are. Updated 2026-09-10 09:55 PDT.

Status legend: `[x]` done · `[~]` running · `[ ]` queued · `[?]` needs Peter

---

## 1. What we are building

`@acmelabs/design-system` is Peter's house design system, built as Lit web components with the
`acme-` prefix. Repo `~/dev/ACMElabs/design-system`. Pure Bun: no Node runtime, no Python.
Docs on GitHub Pages, package on npm (0.1.1 published).

**The goal is a one-to-one port of the reference design system at vercel.com/geist**: style,
behaviour and functionality. Every docs page shows the same sections as the reference page. The
foundations pages match too.

**Parity is not implementation parity.** Decided by Peter on 2026-09-10, and it governs every
element: see [notes/decisions/parity-scope.md](notes/decisions/parity-scope.md). The reference is
React; ours is Lit web components. Copying React's internal shape into a web component does not make
the port more faithful, it makes it worse on the platform it runs on. So every implementation
decision answers one question: *what is the best decision for a Lit web component that has to reach
style, behaviour and functional parity with the reference?*

Our public API therefore does not have to be identical to theirs. It has to be, in this order:

1. **Consistent with itself** — one name for one concept, everywhere.
2. **Idiomatic for Lit and the web-component community** — where the reference's choice would
   surprise a web-component consumer, ours wins.
3. **Familiar to someone arriving from the reference** — they should recognise our API and guess it
   correctly. Never rename for novelty.

Where the reference contradicts itself, that is a licence to choose the better name, not an
instruction to reproduce the contradiction.

What this does **not** loosen: style parity stays exact and census-proven to zero hard differences
in both themes; behaviour and functionality stay exact, including states, keyboard handling, focus
movement and motion.

**Functionality counts as much as appearance, and the census cannot see it.** The census reads
computed styles. It cannot tell you that a button does nothing when clicked. So every element and
every docs example also needs a behaviour check: the demo the reference page shows must actually
work here. A worked example of this failure is in section 6 — the virtualized table's Show More
button did nothing, because the demo listened for an event the element never fires, while every
style measured clean.

Behaviour parity checklist, per element:

- Each interactive control does what the reference's does: click, keyboard, focus order, escape.
- Each docs example is exercised, not just rendered. If the reference's demo scrolls, filters,
  expands, virtualizes or copies, ours does too.
- Events match the reference's contract. Where the reference control is *controlled* (the owner
  holds the state and the control only reports a click), ours is controlled the same way.
- Anything that cannot be checked in the hidden browser pane (motion, placement, pointer drag)
  is listed as unverified and checked in Peter's own Chrome.

Four things are ours and never change to match the reference:

| Ours | Detail |
|---|---|
| Fonts | Google Sans Flex for text, Google Sans Code for numbers, labels and code |
| Class names | Our own names throughout |
| Vocabulary | Nothing under `src/` names the reference, in code, comments or JSDoc |
| Packages | Our stack, listed below, not the reference's packages |

### The package stack Peter chose

Behaviour is built on these, not on the reference's own dependencies:

- `@lit-labs/motion` for animation, `@lit-labs/router` for the docs app,
  `@lit-labs/compiler` for build-time template compilation
- TanStack for state (`store`), virtualization (`virtual`), rate limiting (`pacer`),
  syntax highlighting (`highlight`), markdown (`markdown`), forms (`form`), charts, hotkeys
- `@floating-ui/dom` for overlay placement
- Native `<dialog>` and the Popover API for overlays
- `@zag-js/remove-scroll` for scroll lock
- `@internationalized/date` for dates
- A vendored copy of cmdk's command-score
- Our own controllers: `Interaction`, `RovingTabindex`

These are not suggestions. **When a piece of functionality falls to one of these packages, that
package is the one to use** — for every item on the list, not only the obvious ones. Syntax
highlighting is TanStack highlight, never Shiki. Hotkeys are TanStack hotkeys, never hotkeys-js.
Virtualization is TanStack virtual. Charts are TanStack charts. Rate limiting and debouncing are
TanStack pacer. Placement is floating-ui. Animation is @lit-labs/motion.

Where a package ships only a vanilla build, write the Lit wrapper or controller for it here rather
than reaching for a different library.

**A package on the list with no imports yet is not a defect.** It means the port has not reached
functionality that needs it. Leave it in the dependencies and use it when that work arrives. Do
not remove it, and do not substitute something else when the moment comes.

Where the stack genuinely lacks something the reference has, and the work is complex, **use a
package rather than hand-rolling it**. Stop first and do comprehensive web research into what the
community holds in high regard. Then apply one more filter: a well-liked package that has been
around a long time may already be superseded by something smaller, faster and more modern. Check
for that before choosing, and say in the report what you compared.

The data layer (TanStack Query and DB) is a separate package, later.

### Which chosen packages are in use today

A blank row means the port has not yet reached work that needs it. That is expected, not a gap.

| Package | Files importing it in `src/` |
|---|---|
| `@floating-ui/dom` | 6 |
| `@zag-js/remove-scroll` | 5 |
| `@tanstack/highlight` | 2 |
| `@tanstack/lit-store` | 2 |
| `@tanstack/charts` | 1 |
| `@tanstack/lit-form` | 1 |
| `@tanstack/lit-hotkeys` | 1 |
| `@tanstack/lit-virtual` | 1 |
| `@tanstack/markdown` | 1 |
| `@tanstack/pacer` | 1 |
| `@internationalized/date` | 1 |
| `@lit-labs/motion` | none yet — see the task in 5.6 |

No rival library has crept in: a sweep for shiki, highlight.js, prismjs, marked, markdown-it,
date-fns, luxon, moment, hotkeys-js, mousetrap, chart.js and d3 in `src/` returns nothing.

### Standing build rules

- Every CSS declaration ships through the generator. Fix a defect **in the generator**, never
  work around it in an element.
- Wrappers keep a real box. Never `display: contents`.
- Link buttons are an `href` on the element. There is no separate link-button element.
- The shared base carries no focus ring. Rings arrive through the generator.
- Docs pages show exactly the reference page's sections. A state the reference page does not show
  is an example with `census: true`, which renders only on `/census/<id>`.
- Tests live in `__tests__/` beside the file, named `<file>.test.ts`, using `bun:test`.
- Decisions that are Peter's go through the question dialog, one at a time. **Commit only when
  Peter asks.**
- **No backwards compatibility. Nobody uses this package yet.** So a better design replaces the old one
  outright: no deprecated alias, no fallback branch, no option that keeps the previous behaviour, and no
  comment explaining what a thing used to be. Rename or delete, and let the new name be the only name.
  This removes a whole class of work from every decision below — a breaking change costs a release note
  and nothing else. Revisit the moment there is a real consumer.
- **Evidence, never inference.** Every claim about how the reference behaves traces to something
  observed: its own prose, its own example code, its compiled output, or its live behaviour. Finding
  that the reference wraps Radix, cmdk or react-aria tells us *where to look*, never what the answer
  is — a wrapper can pass different options, override a handler, use one part and hand-roll the rest,
  or pin an older version. Upstream documentation is a hypothesis to check against the reference, and
  where they disagree the reference wins, because the reference is what we are porting. Where
  evidence is unavailable, record the gap as unverified rather than filling it with something
  plausible.
- **Write the decision down the moment it is agreed, not later.** Every decision, every scope
  change and every clarification lands in this file as part of the same turn it was settled in. A
  decision that lives only in the conversation is lost the next time the context resets, and the
  next agent then rediscovers it the expensive way. If a decision or an investigation is too large
  for a plan entry, give it its own file under `notes/decisions/` or `notes/analysis/` and link it
  from here. This file stays the entry point: reading it, and the files it links, is enough to know
  the whole project.

### The tools, and what each decides

| Tool | What it decides | What it refuses to decide |
|---|---|---|
| `bun tools/geist/gen.ts <name>` | The element's whole stylesheet, from the map and the spec | Nothing — it is fully deterministic |
| `bun tools/geist/diff.ts <page>` | Hard, soft, or accepted, by exact rule | Whether a new difference should become accepted |
| `bun tools/geist/contract.ts` | Extracts 442 reference behaviour statements and 40 wired callbacks, sorted by who can decide them | Whether our element satisfies any of them |
| `bun tools/geist/config.ts <name>` | The mechanical half of a census config | The five fields that carry the measurement's meaning: prepare, viewport, width, text parts, hops |

### Supporting documents

This plan is the entry point. These carry detail too large to inline:

Hand-written notes live under `notes/`, never under `docs/`: `docs/` is build output and
`bun run docs` overwrites it.

| File | What it holds |
|---|---|
| [tools/geist/README.md](tools/geist/README.md) | The full runbook for the parity pipeline, and every guarantee the generator makes |
| [notes/analysis/systematic-approach.md](notes/analysis/systematic-approach.md) | **Read this second.** The method: what a script decides, what a person decides, and the measured evidence for where that line falls |
| [notes/analysis/behaviour-verification-method.md](notes/analysis/behaviour-verification-method.md) | How behaviour parity gets proven: the four instruments, what each is for, and the traps. Includes the test-tier decision and the cheap checks we were missing |
| [notes/analysis/hand-rolled-audit.md](notes/analysis/hand-rolled-audit.md) | Living record of what we hand-roll that a package could own, with an assessment and reason for each |
| [notes/analysis/lit-practice-review.md](notes/analysis/lit-practice-review.md) | Which Lit mechanisms we use and which we are missing, checked against our own code. Includes the accessibility evidence for keeping ARIA on inner elements |
| [notes/analysis/package-choices.md](notes/analysis/package-choices.md) | Every package choice with its evidence: confirmed, worth adopting, or to avoid. Records that no Zag adapter for Lit exists |
| [notes/analysis/functional-parity-sources.md](notes/analysis/functional-parity-sources.md) | What is and is not obtainable for verifying behaviour, and the method that follows. Records that there is no source code to read, so nobody looks twice |
| [notes/decisions/parity-scope.md](notes/decisions/parity-scope.md) | **Decided.** What parity means: style, behaviour and functionality, never implementation. The rule every API choice is judged against |
| [notes/decisions/prop-naming-vs-reference.md](notes/decisions/prop-naming-vs-reference.md) | The button `type`/`typeName` case that raised the question, kept for its evidence. Settled by the parity-scope decision |

---

## 2. How we prove parity

The proof is measurement, not opinion. The tooling lives in `tools/geist/`, and
`tools/geist/README.md` is the full runbook. This section is the mental model.

### Three servers

| Port | Command | What it serves |
|---|---|---|
| 4180 | `bun scripts/dev.ts --no-build` | Our docs site |
| 4183 | `bun tools/geist/collector.ts` | Receives measurements; serves `/census.js` |
| 4184 | `bun tools/geist/serve.ts` | A mirror of the reference site, scripts stripped |

### The loop for one element

1. **Spec** — `bun tools/geist/extract.ts <page>` reads the reference page into
   `spec/<page>.json`. A state the server HTML lacks (an open menu, a tooltip) is drawn by hand as
   a sketch and added with `extract.ts synth`.
2. **Map** — write `maps/<name>.ts`: our root selector, each prop value to one modifier class,
   the children, the slotted tags.
3. **Generate** — `bun tools/geist/gen.ts <name>` writes `src/components/<name>/<name>.styles.ts`.
   Read the report until only known reference inconsistencies remain.
4. **Template** — rebuild the element's DOM to match the reference, with our class names and our
   package stack. Comments never name the reference.
5. **Build** — `bun run split && bun run build && bun run docs && bun test`.
6. **Census** — in a browser, open the mirror page and our page, inject `census.js`, and call
   `window.__census({...})` for each side, in both themes.
7. **Record** — save the exact configuration you ran to `census/<page>.config.json`.
8. **Diff** — `bun tools/geist/diff.ts <page>` and `<page>.dark`. Fix causes until hard = 0.

### Reading the measurements correctly

This trips people up, so it is written out.

- A **root** is one measured box. A **page** is one docs URL.
  **One page usually carries several roots.** The tooltip page carries four roots: the trigger,
  the bubble, the backdrop and the key inside the bubble. The menu page carries five.
- The `page` field in a result file is a **label the caller chooses**, not a URL. The collector
  writes `census/<label>.<side>.json` from that label. So `avatar`, `avatar-group` and
  `avatar-wrap` are three roots measured on the one avatar page.
- Today: **125 measured roots across 69 reference pages.**
- A **hard** difference is a defect. A **soft** difference comes from the fonts and is expected.

### Accepted leftovers

These are differences we accept, with the reason. They are also in the runbook.

| Leftover | Why |
|---|---|
| Wrapper box `min-width`: `auto` where the reference reads `0px` | Our root is a flex item of the wrapper; theirs is a block child. `auto` resolves like `0` in a column's cross axis. No visible effect. |
| Blockified `display` (`inline-flex` reads `flex`) | Same cause: a flex item blockifies. No visible effect. |
| Top-layer boxes read `position: fixed`, reference reads `absolute` | The top layer's containing block is the viewport, so viewport coordinates are the only correct placement. |
| Video's sample file | Streamed from the reference's address. |
| Reference quirks reproduced on purpose | A one-word-per-line right tooltip; two broken utility classes on select. |

---

## 3. Where things stand

| Measure | Value |
|---|---|
| Element directories | 151 |
| Maps written | 129 |
| Sketches | 187 |
| Specs extracted | 76 |
| Tests | 583 pass, 0 fail — and they pass with the corpus absent, the way CI runs |
| Build, docs build | pass |
| Committed | **0.2.0 released 2026-09-10.** Eight commits pushed to main, tag v0.2.0 published to npm |
| Pages at zero hard differences | **103 of 124**, with accepted leftovers classified by rule in `diff.ts` |
| Pages reporting real differences | 21, listed in section 5.1. All against measurements older than today's generator fixes |
| Elements the generator reproduces byte-identically | 90 of 95. The other five each drop an unused legacy variable or a duplicate line |
| Maps the generator reports clean | 93 of 129. The rest report cascade notes and documented reference quirks, not defects |

### Wave 3: overlays

- [x] tooltip — top layer, floating-ui fixed strategy; kbd inside it fixed
- [x] menu — top layer; Tab swallowed as the reference does
- [x] select — a styled native select; no overlay machinery
- [x] modal — native dialog; sheet form fixed
- [x] combobox — a Radix popover with match-sorter filtering, not cmdk; `acme-combobox-option` and the list template are shared with the two below
- [x] toast — store-driven queue; viewport in the top layer; the reference has no swipe and no violet type
- [x] dots-menu — composes menu
- [x] destructive-action-modal — composes modal, input, note, error and button
- [x] context-menu — the reference is a Radix context menu, not its Menu; ours composes menu with the context list's own rules
- [x] multi-select — the reference is a popover of checkbox rows with smart selection, not a chip combobox; nothing reused
- [x] command-menu — cmdk-based; native dialog; vendored command-score; hotkeys through TanStack
- [x] drawer — the reference is a Base UI drawer with no handle; the popup is the drag surface; native dialog
- [x] sheet — a Radix dialog of its own, not the modal's sheet form; native dialog
- [ ] **calendar** — dates through `@internationalized/date`; floating popover. On disk: spec, styles. Missing: map, sketches, census. Its agent stopped on a spend limit.
- [ ] **context-card** — hover card on the tooltip base. On disk: spec, map, sketches, styles. Missing: census. Two real defects were found and fixed here (see section 6).
- [ ] **relative-time-card** — hover card with time zones. On disk: spec, maps, sketches, census config. Missing: the census run itself.

Dependency tree:

```
menu ──┬── dots-menu
       └── context-menu
modal ──── destructive-action-modal
combobox ──┬── multi-select
           └── command-menu
tooltip ──┬── context-card
          └── relative-time-card
```

---

## 4. The measurement problem, and what actually caused it

**Read this before trusting any parity number.**

### What was found

On 2026-09-09 every generated style module was rewritten between 15:13 and 16:33. Almost every
measurement had been taken earlier that day, between 07:24 and 16:01. So the measurements on disk
describe code that no longer exists.

A sweep of the 125 measured roots read 85 clean and 40 with hard differences, of which 29 carried
differences that were not accepted leftovers. Those numbers could not be trusted either way.

### The real cause: two generator bugs

Rather than re-measure blind, the generator was tested for faithfulness: regenerate every mapped
element and compare against what shipped. 84 of 95 matched byte for byte. Eleven did not, and the
differences exposed two genuine bugs in `tools/geist/simplify.ts`.

The simplifier decides when a later shorthand replaces an earlier longhand. It decided this by
**name prefix**: if a property's name starts with the shorthand's name plus a hyphen, it was
treated as reset. That heuristic is wrong for several real properties.

| Bug | What broke | Authority |
|---|---|---|
| `outline` was treated as resetting `outline-offset` | `outline-offset: 2px` was deleted from nine elements' focus rules | CSS UI spec: "outline-offset is not part of the outline shorthand" |
| `transform` was treated as resetting `transform-style` | `transform-style: preserve-3d` was deleted from book, which breaks its 3D flip | CSS Transforms 2 gives `transform-style` its own section |

**Both are fixed.** `simplify.ts` now carries a `NOT_RESET` table naming, per shorthand, the
same-prefixed properties it does **not** reset: `outline`, `transform`, `text`, `background`,
`border`, `overflow`, `flex`, `grid`, `mask`, `animation`, `page`, `column`, `font`.

Five tests cover the rule in `tools/geist/__tests__/simplify.test.ts`.

After the fix, 90 of 95 elements regenerate byte-identical. The five that still differ were each
checked by hand and are all **improvements**, not losses:

- `avatar-group`, `fieldset`, `tooltip`, `command-menu` — drop unused legacy custom properties
  (`--acme-secondary-light` and similar) that nothing reads; `command-menu` also **gains** the
  `outline-offset` the old bug had removed.
- `gauge` — drops a duplicated `transform-origin` and a `transition-property` that a later
  `transition` shorthand correctly resets.

### Where that leaves parity

The generator is now faithful and deterministic. The element code on disk is correct and passes
583 tests. What is missing is a fresh set of measurements taken against this generator.

**Nothing is known to be broken. Parity is simply unproven until the re-census runs.**

---

## 5. What has to happen next, in order

### 5.1 Re-measure the 21 pages that report differences `[ ]`

**Not all 124.** The full diff sweep, run with the accepted-leftover classification now in `diff.ts`,
reads **103 pages at zero hard differences**. Re-measuring those spends the most expensive resource we
have to confirm what we already know. The 21 that report real differences are the target:

```
badge  book  choicebox  clearable-input  code-block  collapse  collapse-group
description  error  input  pagination  pagination-next  progress  scroller-narrow
search-input  separator  snippet  split-button  split-button-trigger  tab  tabs
```

Their numbers come from measurements taken before today's generator fixes, so each may already be clean.

Per page: run both sides in both themes, **save the config** (`bun tools/geist/config.ts <name>` derives
the mechanical half and prints the five judgement fields it refuses to guess), then
`bun tools/geist/diff.ts <page>` and `<page>.dark` until hard is zero.

67 of 125 roots still have no saved config. Save one for every root touched.

### 5.2 Fix what survives `[~]`

Working the 21 pages that report differences, cheapest first. **All 21 have matching root counts per
side**, so unlike context-card these numbers are not a harness fault — the setup is sound and the
differences point at something real.

- [x] **separator — at parity.** Its 5 differences were the docs page's own spacing. The reference's
  page spaces its row with `space-x-4` and `space-x-2`, which put a margin on every child; ours uses
  `gap` on the same row. Verified in the browser that the spacing is identical: 16px against 16, 8
  against 8, none where the row stacks. Recorded as soft, with the reason.
- [~] **collapse and collapse-group — cause found, config being rebuilt.** Their single difference is
  an expanded panel's height, 85 against 173. **Ours is correct and the reference's page is stale:**
  its panel measures height 0 with 40px of content hidden by overflow, while carrying
  `aria-expanded="true"`. Confirmed on the **live** site, not only the mirror, and clicking the
  heading there does not open it either — the opening is script-driven and does not complete on a
  freshly loaded page. `aria-expanded` matches on both sides, which is the real check.

  Blocked on one thing: neither page had a saved census config, and the reconstruction I derived from
  the map picks 6 roots on the reference against 7 on ours. **A root-count mismatch makes every
  downstream number meaningless**, so the marker needs pinning down before this can be called done.

- [ ] Remaining, in cost order: pagination (1), tabs (1), scroller-narrow (1), description (6),
  error (2), search-init (2), snippet (2), input (4), pagination-next (4), progress (6),
  clearable-input (6), tab (20), code-block (31), badge (51), split-button (60), book (142),
  split-button-trigger (240), choicebox (558).

  A lesson already earned: **a page with no saved config is more expensive than its difference count
  suggests**, because the config has to be rebuilt and verified before the count means anything.

In the generator, never in an element. A new accepted leftover goes in the `ACCEPTED` table in
`diff.ts` with its reason, so the classification stays the same on every run.

### 5.3 Finish the last three elements, cheapest first `[ ]`

Measured, not estimated:

1. [x] **relative-time-card — at parity, 2026-09-10.** All six runs read **0 hard**: card 4 roots,
   label 1, trigger 6, in both themes. The trigger's 16 accepted are the documented wrapper-box
   context value. The census config now carries two prepare steps it was missing, both recorded with
   their reason.
2. [x] **context-card — at parity, 2026-09-10.** All four runs read **0 hard**: the card 8 roots, the
   trigger 17, in both themes.

   Every one of the 208 differences first reported was the harness measuring two different things, and
   each cause is now recorded in the config with its reason:

   | Cause | Cost | Why |
   |---|---|---|
   | Different viewport widths | 64 | The layer is fixed to the viewport, so its width is the window's. Read both sides at 1367 by 924. |
   | The card's inline width read as hard | 64 | It is sized from its own text, so it follows the font. `card` and `fade` are text parts. |
   | Cards opened below the fold | 32 | Placement flips against the viewport **at open time**. A trigger at y≈1100 in a 924-tall window makes every card resolve to `top`. Scroll each group to the reference's own trigger offset first. |
   | Preview width applied after prepare | 16 | The census sets `width` after prepare runs, so cards opened there saw the docs page's natural 958px column. That left 177px right of the fourth trigger where the card needs 311, so `right` correctly flipped. Set the width inside prepare, before opening. |
   | The card's `transform` read as hard | 32 | Not comparable by design: the mirror strips scripts, so the reference's transform is the sketch's static value — every reference card sits 425 to 541px **above** its trigger, which no live run produces. Ours is computed live and correct. Read as soft; the **side** each card resolves to is the real check, and all four match. |

   The lesson worth carrying into the remaining elements: **an overlay's placement is measured at the
   moment it opens**, so anything that changes the page before that — scroll position, container width,
   layout still settling — changes the answer. Set the page up fully, then open.

3. [ ] **calendar — the expensive one, and now scoped properly.**

   The element is built (412 lines) and its five tests pass. It has a spec and generated styles. It has
   **no map, no sketches and no census**, and the reason is structural rather than neglect.

   **The reference renders no calendar at all until its trigger is clicked.** Confirmed on the live site,
   not only the mirror: all 16 examples show a loading skeleton, and the real calendar appears only after
   a click. So the usual path — extract the server-rendered DOM into a spec — yields nothing to map.

   **What changed today: the live site can supply that DOM.** With browser access working, clicking a
   trigger renders the real thing — 35 grid cells, Start and End fields, an Apply button, a timezone
   selector, and the month grid inside a popover. Its class strings are readable directly, which is a
   better source than reconstructing them from the compiled chunks.

   The work, in order:

   1. Open each of the **nine** examples on the live site and capture its DOM: Default, Horizontal
      Layout, Sizes, Presets, Compact, Stacked, Presets with default value, Min and max dates, Pinned
      timezone.

      **The capture method, proven on Default.** Click the trigger, then read the popover's tree. The
      Default state has **40 distinct classed nodes**. Two constraints found by trying it:

      - The live site's security policy blocks a request to localhost, so the page cannot POST its
        capture to the collector. Read the tree back through the browser tool in pieces instead. The
        collector's `/capture/<name>` route exists and works from the mirror or our own pages, which is
        where it is useful.
      - The whole tree is about 36 KB, too large for one round trip. Capture the distinct classed
        nodes with their depth and tag; that is what a sketch needs, and it fits.
   2. Write a sketch per state and run `extract.ts synth` to fold them into the spec.
   3. Write the map, generate, and re-template our element to match.
   4. Write the census config and run it, both themes.

   Budget it as several times the cost of the other two, because every state must be captured by hand
   before anything can be measured. The lesson from context-card applies with force here: the calendar
   is a popover, so its placement is measured at open time, and the setup must be complete before the
   trigger is clicked.

### 5.4 Prove behaviour, not just styles `[ ]`

Method in [notes/analysis/behaviour-verification-method.md](notes/analysis/behaviour-verification-method.md).
The census reads computed styles and is blind to behaviour: a control with perfect styles that does
nothing measures clean, which is exactly what shipped in the virtualized table.

Driving our own examples is **not sufficient on its own** — our examples only show what we chose to
build, so a behaviour we never wired stays invisible. The oracle must come from the reference.

- [ ] Work the contract checklists in `tools/geist/contract/`, already generated for 58 pages. They sort
  **442 reference statements** into 114 that name something a test can observe, 24 mixed, and 304 that
  need judgement — plus **40 callbacks the reference's own examples wire up**, which is the signal that
  catches a control wired to nothing.
- [ ] Stand up a real-browser test tier. `happy-dom` has no `ElementInternals`, no `CustomStateSet`, and
  returns zeros from `getBoundingClientRect`; every form control we ship is form-associated and several
  elements are layout-driven, so no change of test library fixes that. `bun test` keeps the unit tier.
- [ ] Port the applicable ARIA Authoring Practices suites, about 35 elements' worth, with a
  shadow-piercing active-element helper.
- [ ] Build an event manifest per element and assert it **from a light-DOM parent**, because a
  `CustomEvent` defaults to `composed: false` and never leaves the shadow root, and a listener on the host
  cannot detect that.
- [ ] Compare computed role and accessible name against the live reference, through the WebDriver
  endpoints. Not through Playwright, which reimplements those algorithms itself.
- [ ] Add the four cheap emulation checks: forced colors (a `box-shadow` focus ring vanishes there),
  reduced motion, touch, print.

### 5.5 Compare against the live reference `[ ]`

**Unblocked 2026-09-10.** Two paths work and agree exactly on the live reference: same box, same wiring,
same animation name.

**Leave the preview pane open, behind other windows if you like.** Covered is `OCCLUDED`, which keeps
frames: measured at 121 frames per second with the pane behind the terminal, and a tooltip fade watched
live through its 400ms delay and 100ms run. Minimized or closed is `HIDDEN`, which kills them, and no
setting changes that.

**Either way, probe for frames rather than trusting a flag.**
`document.visibilityState` is not a reliable gate — frames were observed firing while the page reported
itself `hidden`, and the document-wide animation count read zero while a real animation ran on an element.
So: run a one-frame probe with a timeout, then read animations from the **element** and sample twice with a
gap, since one reading cannot tell running from finished. Verified by catching our tooltip's fade
mid-flight at 55% opacity with the pane minimized.

Default to the preview pane; it does not touch Peter's browser. Use the DevTools protocol when the probe
says frames are not firing, or when element identifiers make an interaction easier — and close only tabs
you opened there. Method and code in
[notes/analysis/behaviour-verification-method.md](notes/analysis/behaviour-verification-method.md).

First real finding from it, already: the reference wires `aria-describedby` on a tooltip trigger **only
while the tooltip is open**, and our page has none of its 31 tooltips open at rest. The census cannot see
either fact.

- [ ] Overlay placement and motion, per element, against the live reference
- [ ] Computed role and accessible name, both sides, in one run
- [ ] Keyboard behaviour with real key input: focus order, escape, arrow keys
- [ ] The four emulation checks: forced colors, reduced motion, touch, print

Use real driver input only. Synthetic events do not drive the reference at all. Compare live against
live in the same run, so a change on their side is a reviewable difference rather than a mystery.

### 5.6 Package and practice audits `[ ]`

Three living documents carry the detail. Each names what to do and why, and each says where hand-rolling
is the better call:

- [notes/analysis/package-choices.md](notes/analysis/package-choices.md) — what we use, what to adopt,
  what to avoid. Confirms floating-ui, `@internationalized/date` and TanStack; records that **no Zag
  adapter for Lit exists**, so adopting Zag means writing and maintaining that layer.
- [notes/analysis/hand-rolled-audit.md](notes/analysis/hand-rolled-audit.md) — what we hand-roll that a
  package could own. Includes the shared floating-ui controller, since six elements each call
  `computePosition` twice with the same shape.
- [notes/analysis/lit-practice-review.md](notes/analysis/lit-practice-review.md) — the Lit mechanisms we
  are not using. Highest single item is the missing custom-elements manifest.

### 5.7 Cleanup `[ ]`

- [ ] Rename `src/geist.css` and remove the dead hand-written rules the generated modules replaced
- [ ] Prune `tokens.css` to the tiers the elements read (260 KB today)
- [ ] Split the bundle: charts, forms, markdown and highlighting as separate entries (1.33 MB minified today)
- [ ] Sheet: the non-modal form is the reference default and should open as a manual popover, so the page stays interactive. Today it uses `showModal` and makes the page inert.
- [ ] Menu: the reference's mobile path. Under 601px the list opens inside a drawer, which sets no shadow on it. Absent from the corpus, so sketch it alongside the combobox mobile form.
- [ ] Modal: a `form` option wrapping body and footer, so destructive-action-modal drops its two context lines
- [ ] Combobox: the reference's mobile form, a button that opens a drawer under 601px
- [ ] **Move the animated elements onto `@lit-labs/motion`.** Two patterns cover nearly all of it:

  1. *A box whose size changes.* Collapse is the clearest case: it measures the body with
     `getBoundingClientRect` and drives an inline pixel height, which is precisely what the
     `animate` directive does properly. Anything else that grows or shrinks belongs here too.
  2. *Something entering or leaving.* Modal, drawer, sheet, toast, tooltip, context-card,
     command-menu and feedback all fade, scale or slide in and back out, today through
     hand-written transitions plus `getAnimations()` bookkeeping to hold the exit open. The
     directive's enter and exit handling is built for exactly this.

  Also review calendar, middle-truncate and text-copy, which animate in script.

  The bar is parity with the reference's motion; the package is how we get there, not a licence to
  change how anything looks or times.
- [ ] Sweep the last reference mentions under `src/`
- [ ] Refresh README, the Get Started page and the design-system skill. **README is currently wrong**: it lists `@lit-labs/signals` and `@lit-labs/virtualizer`, but the chosen stack uses TanStack store and TanStack virtual.
- [x] The dialog reset lives in `src/shared/dialog.ts`; modal, drawer and sheet import it
- [x] Menu follow-ups: `width` accepts `auto` plus `min-width`; `offset` replaces the gap constant; context-menu is modal with scroll lock, as the reference's Radix menu is
- [x] Docs app: a census page titles itself "<Element> (census)"
- [x] **Prop naming against the reference** — settled by the parity-scope decision. The reference's
  Button puts the visual look on `type` and the HTML type on `typeName`, and flags that as a trap
  in its own prose; it uses `variant` 174 times against `type` 37 across its pages. Our `variant`
  and `type` stand: self-consistent, idiomatic, and the reference's own majority name. No rename.
- [x] **One name per concept: the visual look is `variant`.** Done 2026-09-10. Seven elements renamed
  from `type`: feedback, fieldset, select, progress, tooltip, snippet and menu-item. **18 elements now
  name the visual look `variant`, up from 11.** The sweep also drew the line that keeps `type` where it
  names a kind of thing rather than an appearance — chart's shape, choicebox's selection mode, file's
  icon, breadcrumbs' layout, and the real HTML attribute on button, copy-button, split-button and input.
  The test and the reasoning are in [notes/decisions/parity-scope.md](notes/decisions/parity-scope.md).
  It changes the 0.2.0 interface on seven elements, which costs a release note and nothing more.
- [ ] Sweep the same way for every other concept that may carry two names (size, shape, state).
- [ ] Select: decide the house-only `options` property, which feedback uses `[?]`
- [ ] Foundations pages: the reference's exact heading levels, or ours `[?]`

### 5.8 Release

- [x] **0.2.0, 2026-09-10, live on npm.** The first tag failed CI, because tw.ts and simplify.ts
  read the gitignored corpus at import time. That defect is fixed, the tag was moved to the fixed
  commit (0.2.0 had never published, so the number was still free), and the second run published. The parity port to date: 22 more elements (131 to 153 exports), every
  element re-templated to the reference's DOM, states and API, all 159 style modules regenerated,
  the parity tool itself (129 maps, 187 sketches, 76 specs), the chosen package stack as real
  dependencies, two generator bug fixes with tests, and the virtualized table demo fixed. A minor
  bump, because element APIs changed and below 1.0 that is where breaking changes go. Published by
  pushing the v0.2.0 tag; the workflow publishes through npm's Trusted Publisher, no token.
- [ ] The next release is the one that can claim parity: after the measurement sweep (5.1), the
  behaviour sweep (5.4) and the last three elements (5.3). Ask Peter once before tagging it.

Ask Peter once, then: commit, push, docs deploy, npm release.

---

## 6. Defects found and fixed, for the record

| Where | Defect | Fix |
|---|---|---|
| `tools/geist/simplify.ts` | `outline` wrongly treated as resetting `outline-offset`; nine elements shipped without it | `NOT_RESET` table; 5 tests |
| `tools/geist/simplify.ts` | `transform` wrongly treated as resetting `transform-style`; book lost `preserve-3d` | same table |
| `src/components/context-card/context-card.ts` | Focus and click handlers sat on the shadow trigger box, which a light-DOM event never reaches. Real keyboard focus never opened the card; a link click never closed it. The old test passed only because it dispatched events straight onto the shadow box, which no browser does. | Handlers moved to the host |
| `src/components/context-card/context-card.ts` | Escape closed the card, then restored focus, and that focus reopened it | A `dismissed` flag, cleared when focus truly leaves |
| `docs-src/pages/components/table.ts` | The virtualized table's Show More did nothing. The demo listened for `acme-toggle`, which `acme-show-more` never fires: like the reference's, it is controlled and only bubbles a click. Every style on the page measured clean, so the census could never have caught it. | The demo now listens for `click` and sets `expanded`, matching the reference's `onClick` contract. Verified in the browser: the row count moves between 9 and 5000 and back. |
| `tools/geist/tw.ts` and `simplify.ts` | Both read the reference corpus at **import** time. The corpus is gitignored (it is the reference site's own output), so any import of these modules failed wherever the corpus is absent. It broke the 0.2.0 publish: a new unit test imported `simplify` for one pure function and CI had no corpus. | Both now parse on first use. `loadReference()` is exported and called at the top of `generate()`. Verified by hiding the corpus locally: 583 tests pass with it and without it. |
| `src/components/context-card/__tests__/` | Five assertions compared exact class strings; Lit appends newly-true classes on update, so order carries no meaning | Compare the class set |

---

## 7. Decided, and deferred

**No right-to-left support.** Decided 2026-09-10 on evidence: the reference has none. Zero `dir`
attributes, zero direction selectors, and it mixes 87 physical properties with 75 logical ones, which
would break in a right-to-left context. Our modules inherited that mix faithfully. Supporting it would
mean *deviating* from the reference on several hundred declarations, each becoming a census difference to
accept. Reasoning in [notes/decisions/parity-scope.md](notes/decisions/parity-scope.md).

**No backwards compatibility, ever, until there is a real consumer.** Nobody uses the package yet, so a
better design replaces the old one outright. No alias, no fallback, no comment about what a thing used to
be. This is in the standing rules because it removes work from every decision here.

- **Scoped custom element registries** (`@lit-labs/scoped-registry-mixin`): one pass after the
  port, before 1.0. Every composing element lists what it composes. The polyfill loads only where
  the browser lacks the feature. Decided by Peter on 2026-09-09.
- **Data layer** (TanStack Query and DB): a separate package, later.
