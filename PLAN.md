# Parity port plan

The one and only plan for this project. Read this file first and you know what we are building,
how we prove it, and where we are. Updated 2026-09-10 03:20 PDT.

Status legend: `[x]` done · `[~]` running · `[ ]` queued · `[?]` needs Peter

---

## 1. What we are building

`@acmelabs/design-system` is Peter's house design system, built as Lit web components with the
`acme-` prefix. Repo `~/dev/ACMElabs/design-system`. Pure Bun: no Node runtime, no Python.
Docs on GitHub Pages, package on npm (0.1.1 published).

**The goal is a one-to-one port of the reference design system at vercel.com/geist.** Every
element matches on styles, states, functionality and API. Every docs page shows the same sections
as the reference page. The foundations pages match too.

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
| Tests | 583 pass, 0 fail |
| Build, docs build | pass |
| Committed | nothing since v0.1.1; about 620 changed files on disk |
| Parity, measured | **not currently provable — see section 4** |

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

### 5.1 Re-census every element `[ ]`

The blocking step. Everything after it depends on it.

Scope: **125 roots across 69 reference pages, in two themes.**

A real gap to plan around: only 26 census configs are saved, naming 61 of the 125 roots.
**67 roots have no saved config**, so their runs must be reconstructed from the element's map
before they can be repeated. The runbook requires saving the config; that step was skipped for
most elements. Save one for every root this time.

Per root: open the mirror page and our page, inject `census.js`, run both sides in both themes,
save the config, then `bun tools/geist/diff.ts <root>` and `<root>.dark` until hard = 0.

### 5.2 Fix whatever the re-census finds `[ ]`

Fix causes in the generator, never in an element. Record any new accepted leftover in the runbook
table with its reason.

### 5.3 Finish the last three elements `[ ]`

calendar, then context-card, then relative-time-card. One element per agent, at most four agents
at a time. Each agent gets the runbook and the rules in section 1, and reports: hard differences
per theme, API changes, shared-file edits, generator fixes, unverified items, and final test
totals.

### 5.4 Behaviour sweep over every docs example `[ ]`

Separate from the census, because the census is blind to it. For each of the 105 docs pages, drive
every interactive example and confirm it does what the reference's does. The table's Show More was
found this way and is fixed; assume there are more.

A cheap first pass already run: every `acme-*` event a docs demo listens for was cross-checked
against every event the elements actually dispatch. Only the table mismatched. That check catches
wrong event names but not a control wired to nothing, so the hands-on pass is still needed.

### 5.5 Check overlays against the live reference `[ ]`

The census reads computed styles; it cannot see placement, motion or keyboard behaviour. This
needs Peter's own Chrome, which reaches vercel.com. Currently disconnected.

### 5.6 Package audit: use each chosen package everywhere its job appears `[ ]`

Peter's point, and it is the reason this is a step rather than a checkbox: he named the packages he
wants for each kind of work, but he cannot enumerate every place in the codebase where that work
happens. Finding those places is our job.

So audit the codebase **per package**, not per element. For each one, search for the work it is
meant to own, and list every place doing that work by hand. Then convert them, or record why a
given case should stay as it is.

What the first scan already shows:

| Package | Its job | What a scan finds today |
|---|---|---|
| `@tanstack/lit-store` | Shared state | `src/shared/state.ts` holds state in plain module objects, 19 references. Two files import the store. |
| `@tanstack/lit-hotkeys` | Key handling | **20 elements** add their own `keydown` listeners or `@keydown` bindings. One file imports hotkeys. |
| `@tanstack/pacer` | Debounce, throttle, queue, batch | **20 elements** use raw `setTimeout`. One file imports pacer. |
| `@lit-labs/motion` | Animation | No imports. Two clear patterns waiting, listed in cleanup below. |
| `@tanstack/lit-virtual` | Long lists | Table uses it. Check every other list that can grow: menu, combobox, multi-select, command-menu, file-tree, json-view. |
| `@tanstack/highlight` | Syntax highlighting | Two files. Check code, code-block and snippet all route through it. |
| `@tanstack/markdown` | Markdown | One file. Check the docs Markdown twin and any prose rendering. |
| `@tanstack/charts` | Charts | One file. Check every chart surface. |
| `@tanstack/lit-form` | Forms | One file. Check fieldset and the form examples. |
| `@floating-ui/dom` | Placement | Six files. Check every floating thing is placed by it, none by hand. |
| `@internationalized/date` | Dates | One file. Calendar and relative-time both need it. |

Not every hand-rolled case should convert. A single `setTimeout` for a one-shot delay is not a
pacer case. A single `keydown` for one key on one control may not be a hotkeys case. Judge each,
and write the reason down either way, so the next agent does not re-litigate it.

Where a package ships vanilla only, write the Lit wrapper or controller here.

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
- [ ] Select: decide the house-only `options` property, which feedback uses `[?]`
- [ ] Foundations pages: the reference's exact heading levels, or ours `[?]`

### 5.8 Release `[?]`

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
| `src/components/context-card/__tests__/` | Five assertions compared exact class strings; Lit appends newly-true classes on update, so order carries no meaning | Compare the class set |

---

## 7. Deferred, decided

- **Scoped custom element registries** (`@lit-labs/scoped-registry-mixin`): one pass after the
  port, before 1.0. Every composing element lists what it composes. The polyfill loads only where
  the browser lacks the feature. Decided by Peter on 2026-09-09.
- **Data layer** (TanStack Query and DB): a separate package, later.
