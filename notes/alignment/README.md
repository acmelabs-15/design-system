# Systematization pass

Entry point for the current work. `AGENTS.md` says how to work in this repo; this file says what the work is and where it stands. Keep `## Where we are` current in every turn that moves anything.

## Where we are

- **Status:** not started. The parity port is closed (`PLAN.md` §3, §5.8; 0.2.0 on npm). Its remaining measurement items (`PLAN.md` 5.1–5.5) are paused until this pass settles which elements survive.
- **Decided:** everything under Phase 0 below, by Peter, 2026-09-10, in conversation. Not yet written as decision notes.
- **In progress:** nothing.
- **Next step:** Phase 0. Open with questions to Peter about the goals and constraints in this file until you can restate them and he agrees; then write the Phase 0 decision notes; then Phase 1.
- **Documents this pass owns:** this file; the skills in `.agents/skills/`; `terms.md`, `inventory.md` (elements, conventions, and the documentation layout), `migration-plan.md` (not yet created); new files under `notes/analysis/` and `notes/decisions/` as they are produced, listed here when created.

## Why this library exists, and what this pass is for

`@acmelabs/design-system` is the house design system, as Lit web components with the `acme-` prefix. It exists so AI-generated artifacts stop guessing at a design language: it is version-tracked, standardized, and renders in the static HTML pages Claude uses for artifacts, which is why it is Lit and not React. The first passes ported vercel.com/geist one-to-one in style, behaviour and functionality. `PLAN.md` records that work, and the fixes it lists are settled.

**Parity was the floor. This pass is about the system.** The goal is no longer to match Geist; it is to standardize and systematize what we have: one name for one concept, one shape for one kind of interface, and fewer elements, built from a small set of primitives flexible enough that the rest of the library composes them. Where today we have several elements that each draw a bordered box with a head and a body, the end state is one container that the others compose, or a documented recipe of primitives that replaces an element entirely. Removals, renames and replacements are part of that, not separate from it.

"I" throughout this file is Peter.

## Skills

The procedures this pass follows are repo skills in `.agents/skills/`, listed in `AGENTS.md`. Codex shows them in the skill selector; any agent can read them as files.

- **domain-modeling** owns the glossary (`CONTEXT.md`) and decision records. Follow it in Phase 2 and whenever a term is challenged.
- **codebase-design** is the architecture vocabulary for Phases 3 and 4.
- **improve-codebase-architecture** finds shallow modules and deepening candidates. I say when to run it (Phase 3).
- **grill-me** is the one-question-at-a-time decision walk inside Phase 3 and per inventory entry in Phase 4. Questions go through `ask-user-question`.

## Rules specific to this pass

The general rules are in `AGENTS.md` and `PLAN.md` §1. These apply to this pass:

- **Source code changes start when the migration plan (Phase 5) is approved.** Until then the outputs are `CONTEXT.md`, decision notes, and documents under `notes/alignment/` and `notes/analysis/`.
- **Every change is a replacement.** The new name, shape or element is the only one left in the code. The record of what it replaced, and why, lives in a decision note, an analysis document, or this plan.
- **Best, not fastest.** Where the best path and the quick path differ, both are named and the best one is taken.
- **The mandated package stack has one narrow exception:** the animation package is open to research in Phase 1.5; Peter's decision on that research is final. Every other package in `PLAN.md` §1 stands.
- **A deleted element is deleted whole:** element, map, sketches, spec, census config, docs page.
- **A rename that touches a class name or a prop the styles key on** is a change to `tools/geist/maps/<name>.ts`, followed by regeneration.
- If a name is odd because of an external constraint (the HTML attribute `type`, a platform API, a published entry point), record the constraint instead of flagging the name.
- If a finding is a judgment call, show the options with the evidence for each rather than picking one silently.

## Phase 0: Record the decisions this pass rests on

Write these as decision notes before doing anything else. They are decided; record them well and link them from `PLAN.md`.

1. **Goal, restated.** Supersedes the "exact parity" clause of `notes/decisions/parity-scope.md`. Geist stays the baseline for every element Geist has. Named deviations are allowed; each records its source (Radix, Chakra, Material) and the value or behaviour taken. The census either accepts a deviation per element in the `ACCEPTED` table in `diff.ts`, or drops that element from the sweep; say which, per element. Elements Geist does not have are verified against their source system's published values. The rest of parity-scope.md stands: self-consistent first, idiomatic for Lit second, familiar to a reference user third.
2. **Composition over count.** An element earns its place by doing something the primitives composed together cannot. An element that is only a fixed arrangement of primitives becomes a recipe (a pattern page, and where it is page-level, a `dashboard.css` recipe), not an element. Every element in the inventory states what it composes and what composes it.
3. **Non-canonical elements.** The 26 elements the earlier passes invented beyond Geist (list in Phase 2.5) are not settled and not parity-tested. No rename or deepening effort goes into them as they stand. Each is deleted, or rebuilt as canonical with its own decision note. Known to come back: Toolbar, Chart (TanStack charts), Markdown (TanStack markdown and highlight). Stat and Trend are likely; decide in Phase 2.
4. **Reference systems.** Geist for the baseline. Radix Themes and Chakra UI for what Geist lacks and for naming when Geist's name is not the community's. Material 3 for the tab indicator only. When references disagree on a name, the more widely used name wins, and the note shows the survey that decided it.
5. **Floating surfaces** take their shadows from Radix Themes' shadow scale. One note; list the elements and the token each maps to.
6. **Tabs** take Material 3 primary tabs' indicator anatomy, states and behaviour, including the horizontal slide on change. Motion runs on the animation package that survives Phase 1.5.
7. **Icons move into an icon library.** No element carries its own inline glyph boilerplate. The form of the library is open (Phase 1.6); the principle is decided.

## Phase 1: Your own analysis

After the opening questions. Each item produces a document in `notes/analysis/`, linked from `notes/alignment/README.md`. Read-only against `src/`.

1. **Codebase analysis.** A deep read of `src/`, `docs-src/`, `tools/geist/` and `scripts/`. What the elements share, where they diverge, what is hand-rolled, what is duplicated, which elements are fixed arrangements of others. This is your view, not a check of mine; I expect it to find things I have not.
2. **Lit practice.** Research current best practice for web components built with Lit: reactive controllers, directives, `ElementInternals` and form association, `CustomStateSet`, scoped registries, SSR readiness, the custom-elements manifest, testing. Extend `lit-practice-review.md` rather than replacing it. Say where we are behind and what it costs.
3. **Mandated-package integration audit.** For each package in PLAN.md §1, what functionality in `src/` it should own and does not. `hand-rolled-audit.md` starts this; finish it, per package, with the elements affected and the shape of the integration (a shared controller, a directive, a wrapper).
4. **Library gaps.** Where the pass will need something no mandated package covers (pin input, number input, scroll area, timeline, and whatever else the inventory reveals), research what the community rates highly, then apply the second filter from PLAN.md §1: is the well-liked option already being displaced by something smaller, faster and more current? Report what you compared and why. I decide.
5. **Animation package.** Read `notes/decisions/motion-on-the-book.md` first; it records demos that answered an earlier objection, and the research must not relitigate that. Then survey the field: is there a newer, smaller, faster, more robust animation library, ideally Lit-native, gaining adoption over `@lit-labs/motion`? Compare on size, performance, API fit with Lit, enter/exit and size-change handling, maintenance, adoption trend. Recommend; I decide.
6. **Icon library.** Two shapes to lay out: one `<acme-icon name="…">` element backed by a registry, or one element per icon (`<acme-arrow-up-icon>`). Compare tree-shaking under our two builds (unbundled and the CDN bundle artifacts use), naming, authoring cost, and how the `start`/`end` slot examples read. Also which icon set: Geist's own, Lucide, or another, with the licence. Recommend; I decide.

7. **Repository layout.** An earlier agent repeatedly had its work overwritten because it did not know where the build writes. The cause is on disk: generated files are committed in places that read as source. `tokens.css` and `dashboard.css` are written to the repo root by `scripts/split-css.ts` and `scripts/build.ts`; the whole `docs/` directory is written by `docs-src/build.ts` (and `docs/` is also where the community keeps hand-written docs); every `*.styles.ts` in `src/components/` is generated and sits beside the hand-written element; `package-lock.json` sits beside `bun.lock` in a Bun-only project; `src/components/book.zip` is a stray. Research how well-regarded Lit and web-component libraries organize a repository (Shoelace / Web Awesome, Spectrum Web Components, Material Web, Lion, Vaadin, Nord at least): where source, generated output, built packages, the docs site and tooling live; how generated files are marked; what `package.json` `files` and `exports` look like. Propose a layout for this repo that an agent arriving cold would read correctly, and that preserves the generator pipeline (`tools/geist/`) and the standing build rules. Include a `## Generated files` section for README and `notes/alignment/README.md` listing every generated path and the script that writes it, whatever layout we choose.
8. **Build and performance.** Research how a Lit component library should be built and delivered for performance, and measure where we stand: bundle size and chunking (the single bundle is 1.33 MB minified; PLAN.md 5.7 already queues splitting charts, forms, markdown and highlighting into separate entries); per-element entry points and tree-shaking (`package.json` sets `"sideEffects": true` for the whole package, which disables tree-shaking for every consumer); `tokens.css` at 260 KB and what the elements actually read; CSS delivery inside shadow roots (constructable stylesheets, `adoptedStyleSheets`, one shared sheet vs. per-element); the Lit template compiler we already use; lazy element definition; SSR readiness; what the CDN path used by artifacts loads on first paint. Report measured numbers, the community's practice, and a prioritized set of changes with the expected gain for each. I decide.

9. **Documentation site.** Audit `docs-src/`: the page structure, the fragments, and what each page hand-builds that a shared doc component could own (example blocks, prop and event tables, the states sections, census pages). Research how well-regarded Lit libraries document their components (Shoelace / Web Awesome, Spectrum Web Components, Material Web, Lion at least): page layout, generation from the custom-elements manifest, live examples beside their code, API tables, composition examples. Report what one standardized page looks like for this library and which doc components would produce it.

Stop and walk me through the findings before Phase 2.

## Phase 2: Domain model and dispositions (domain-modeling skill)

### 2.1 Seed `CONTEXT.md`

From what is already decided: `variant` for the visual look; `start`/`end` for the places beside content, as slots and as treatments (start-and-end-places.md, input-affix-api.md); the line that keeps `type` for "a kind of thing" (PLAN.md 5.7); and the parity-tooling vocabulary in PLAN.md §2 (root, page, map, sketch, spec, census, hard/soft difference, accepted leftover, generator). Each entry gets its `_Avoid_` list. Decide with me whether the element library and `tools/geist/` are one context or two.

### 2.2 The message family

Three concepts, three names:

| Term | Scope | Placement | Lifecycle |
|---|---|---|---|
| **Toast** | result of a recent action | corner overlay | auto-dismisses |
| **Alert** | a section, form or block | inline, inside the section | while the section is relevant |
| **Banner** | the page or the app | top of the page, full width | until dismissed or resolved |

Today's `note` is the Alert. Write all three into `CONTEXT.md`, then audit every element that shows a message (`note`, `banner`, `toast`, `feedback`, `error`, `error-card`, `empty-state`, `project-banner`) against them. Anything that is one of the three by another name is renamed or folded in. Anything that is none of them is a real fourth concept, argued for, or goes.

### 2.3 The container family

`card`, `entity`, `fieldset`, `panel`, `link-card`, `tile`, `item`, `setting-row` all draw a bordered box with a head, a body and sometimes a foot. Survey what Radix, Chakra, Geist and two or three other widely used systems call this and how they split it. I want one canonical container, flexible enough to be composed by the rest, under the community's most common name (Card or Entity is the open question). Then, immediately after, settle **Toolbar** and **Stat**, because the container composes them. Fieldset stays only if it is a form-grouping concept distinct from the container; say why or fold it in.

### 2.4 Name collisions between the new-element list and Geist

Resolve each before anything is built, because the new name and the old name cannot both exist:

| New (Chakra/Radix) | Existing (Geist) | Question |
|---|---|---|
| Grid, Simple Grid | `grid`, `grid-cross`, `grid-page`, `grid-system` | Layout grid vs. the decorative crossed grid. Two concepts; two names. |
| Scroll Area | `scroller` | Same concept? If so, one name. |
| Accordion | `collapse`, `collapse-group` | Same concept? If so, one name. |
| Data List | `description` | Radix's Data List is the term/definition list. Is that what `description` is? |
| Toggle Tip | `tooltip`, `context-card` | Three overlay-on-hover-or-focus things. Which survive, under what names. Radix separates Tooltip (non-interactive text) from Hover Card (rich, interactive). |
| Group | `button-group`, `avatar-group`, `collapse-group`, `radio-group`, `tags`, `tiles`, `items`, `filters`, `bar-rows`, `setting-rows` | Which are a general Group and which are a real element with its own rules. |

### 2.5 Disposition register

Decided items are decided. *Investigate* items need a survey of what the community calls the thing and how it is shaped, and a recommendation with evidence. Confirm every row with me before it goes into the inventory.

| Element | Disposition |
|---|---|
| choicebox, choicebox-item | Delete. Replaced by Checkbox, Checkbox Group, Checkbox Cards, Radio, Radio Group, Radio Cards, composed with Group. |
| error-card | Delete. |
| phone | Delete. |
| project-banner | Delete. |
| text-copy (Text With Copy Button) | Delete. |
| sheet | Delete. Drawer covers it. |
| clearable-input | Delete. Becomes a `clearable` boolean on Input (and Search Input, if it survives as its own element). |
| modal | Rename to Dialog. |
| note | Rename to Alert (2.2). |
| status-dot | Rename to Status. |
| toggle | Rename to Switch. |
| switch, switch-control | Rename; the concept is what the community calls a segmented control. *Investigate* the shape: Radix separates Toggle Group (toggle buttons) from Segmented Control (radio-backed); Chakra's is radio-backed. Lay out both and recommend. |
| kbd (Keyboard Input) | Already `kbd` on disk; fix the docs title. |
| loading-dots | *Investigate* folding into Spinner or a circular Progress. |
| destructive-modal | *Investigate* the name (Alert Dialog? Confirm Dialog?) and whether it is a Dialog variant or a recipe. |
| gauge | *Investigate* the name against the community's. Whatever it is called, it animates when `indeterminate` is true. |
| description | *Investigate* whether it should exist (2.4, Data List). |
| context-card | *Investigate* against Tooltip and Hover Card (2.4). |
| error | *Investigate* whether it is standalone. If it stays, it has no docs page of its own. |
| feedback | *Investigate* what the community ships for this and how it is composed. |
| relative-time (Relative Time Card) | *Investigate* whether it is needed; the name needs improving either way. |
| fieldset, entity, card, panel, link-card, tile, item, setting-row | Resolved by 2.3. |
| toolbar | Rebuild as canonical, flexible enough to be composed by the container and others. |
| stat, stat-delta, stat-desc, stat-foot, stat-strip, strip-item | Likely canonical; *investigate* the shape, decide with 2.3. |
| chart | Rebuild as canonical on TanStack charts. |
| trend | *Investigate* whether it is canonical or a Chart preset. |
| markdown | Rebuild as canonical on TanStack markdown and TanStack highlight. |
| combobox | Keep and standardize. When Select is rebuilt non-native, the two share one list, option and filtering shape. |
| dots-menu | *Open.* Flagged; tell me what you find. |
| code, code-block, context-menu, copy-button, drawer | Reviewed; keep, subject to Phase 4 conventions. |
| Remaining non-canonical: appbar, bar-row, bar-rows, check, chip, filter, filters, fold, forms, item, items, kv, logs, page-head, ricon, shell, task, tasks, tile, tiles | Delete unless 2.3 or the inventory claims one. Say which. |
| Everything else | Keep and standardize. |

### 2.6 Harvest and resolve

With the register agreed, inventory the terms in use across `src/components/`, `src/shared/`, `docs-src/`, and `tools/geist/maps/`: tag names, property names, slot names, event names, CSS custom properties, module and file names. Cluster where one concept has several names or one name covers several concepts. Start with size, shape and state (PLAN.md 5.7), then the container-and-item pairs (`-group`, `-list`, `-strip`, plural; `-item`, `-row`, `-option`, singular), then abbreviations (`ricon`, `kv`, `spark`, `fold`, `atom-state.ts`, `info-ic.styles.ts`, `usage-sum.styles.ts`). Record in `notes/alignment/terms.md`. Walk clusters with me one at a time, largest first; write each resolved term into `CONTEXT.md` as it lands. Offer a decision note only for choices that meet the bar: hard to reverse, surprising without context, a real trade-off.

Stop when the register and the clusters are resolved. I'll start Phase 3.

## Phase 3: Architecture review (improve-codebase-architecture skill, when I say)

When I start it, this is the direction:

> Consistency across the elements that survive Phase 2, and `src/shared/`. Favor candidates where several elements solve one problem through different shapes, so deepening them also removes an inconsistency. Known starting points: the six elements that each call `computePosition` twice (hand-rolled-audit.md); the composition pattern set by compose-the-copy-button.md and compose-the-language-switcher.md; the `*.styles.ts` families in `src/shared/`; the overlay elements, which will share Radix shadows and one enter/exit mechanism; and the mandated-package integrations from Phase 1.3. Name modules with `CONTEXT.md` terms.

During the grilling loop, record each accepted deepening as an inventory note, plus a decision note if it meets the bar. Don't implement.

## Phase 4: The inventory. Nothing is built before this is approved.

`notes/alignment/inventory.md`: the final list of elements in the design system, and the conventions they share. This is the gate. It is done when I have approved every row.

### 4.1 Primitives first

Identify the lower-level elements that the rest compose: at least Group, Icon, Icon Button, the container from 2.3, Toolbar, Stat, the message family, and the overlay base. For each, list everything it must be able to do so that every element that composes it can, with the evidence (which composing element needs which capability). The test is that the composed elements can be expressed as arrangements of primitives with no behaviour of their own beyond what the arrangement gives them; where they can't, the missing capability goes into the primitive, or the composed element is a real element and the inventory says why.

### 4.2 Every element

For each element that will exist, one entry: tag name; what it composes and what composes it; properties with types and defaults; slots; events with detail payloads; states; behaviours (keyboard, focus, dismissal, motion); the source of each value and behaviour (Geist, Radix, Chakra, Material, ours); and whether it is a Geist element (census) or not (verified against its source). Elements that become recipes get a recipe entry instead.

New elements go in too, so their interfaces are designed against the same conventions as the survivors, in this order because each tier composes the one before: Group (Chakra's, with `attached`); layout (Flex, Stack, Grid and Simple Grid, Scroll Area, under the names 2.4 settled); typography (Text, Heading, Link, Code, Quote, Kbd, Strong; all take `truncate` and `lineClamp`; Text and Heading also take `as`, `size`, `weight`; evaluate Chakra's and Radix's shapes per prop); Icon and Icon Button; the selection family (Checkbox, Checkbox Group, Checkbox Cards, Radio, Radio Group, Radio Cards, Segmented Control); the input family (Input with `clearable`, Number Input, Password Input, Pin Input, non-native Select); the container tier (container, Toolbar, Stat, Appbar, Data List if kept); the rest (Accordion and Toggle Tip per 2.4, Timeline, Steps, Inset, Chart, Trend if canonical, Markdown).

Composition rules that hold everywhere: internal start/end content is always the `start`/`end` slot; sibling composition is always Group.

```html
<acme-input><!-- icon element form per Phase 1.6 --><acme-icon slot="start" name="arrow-circle-up"></acme-icon></acme-input>

<acme-group attached>
  <acme-button>Some menu</acme-button>
  <acme-icon-button><acme-icon name="arrow-down"></acme-icon></acme-icon-button>
</acme-group>

<acme-group attached>
  <acme-radio-card value="a" title="Option A">Description of A</acme-radio-card>
  <acme-radio-card value="b" title="Option B">Description of B</acme-radio-card>
</acme-group>
```

### 4.3 Conventions

Alongside the entries, because they are decided together. Start from README's Conventions section and PLAN.md §1's standing build rules, then cover: naming (casing, prefixes and suffixes, pluralization, verb choice, abbreviations, file and directory names, CSS custom properties, slots, events); interface shape (boolean prop naming, enumerated prop typing, event detail payloads, controlled vs. uncontrolled, what composes vs. what wraps, how `start`/`end` are declared, how Group-composable elements declare themselves); exports (`src/index.ts` against `package.json` exports, what `src/shared/` exposes). For each convention: a one-line rule, a before/after from this codebase, and the share of the code that already follows it. Prefer codifying the dominant existing pattern over inventing one. Approved conventions go to `notes/conventions.md`; README's Conventions section becomes a short version that links to it.

### 4.4 Documentation layout and doc components

One layout for every element page and every foundations page, and the set of doc components that build it: a live example with its code, API tables generated from the custom-elements manifest (properties, slots, events, CSS custom properties), a states section, a composition section that shows what the element composes and what composes it, and a census page where the element is Geist's. Each doc component gets an inventory entry in the 4.2 shape. The standing rule that docs pages show exactly the reference page's sections now applies only to the example content of Geist elements; the layout around it is ours, and non-Geist elements follow the same layout with their own examples.

Stop for my approval of the inventory, the conventions, and the documentation layout.

## Phase 5: Migration plan for existing code

Combine the approved repository-layout and build changes from Phase 1.7 and 1.8, the Phase 2 deletions and renames, Phase 3 deepenings, Phase 1.3 package integrations, and Phase 4 convention fixes into one ordered plan in `notes/alignment/migration-plan.md`:

- Small batches, each reviewable on its own, each with a files-touched estimate and whether it touches maps and needs regeneration.
- Layout and build changes first, so every later batch lands in the final structure. Then deletions. Don't rename anything a later batch deletes.
- After every batch: `bun run split && bun run build && bun run docs && bun test` pass, and the affected pages' census reads zero hard differences, or their deviations are in the `ACCEPTED` table.
- Flag every change to a published interface (tag, property, event, slot, `package.json` export) for the release note. That's the whole cost of a breaking change here.

Stop for my approval before implementing.

## Phase 6: Build

Run the migration plan, then build the new elements in the Phase 4.2 order, each to its inventory entry and the conventions. Build the doc components and move every page onto the 4.4 layout as part of the same order, so no element is documented twice. An element whose inventory entry turns out to be wrong during the build stops the build and updates the entry first.

## Output

- This file is the entry point for this pass; keep `## Where we are` and the document list current.
- Working findings in `notes/alignment/`, as tables: Location | Category | Issue | Occurrences.
- Link `notes/alignment/` from `PLAN.md` as a new section, and mark PLAN.md 5.7's "sweep for other concepts" item as superseded by it.
- Keep prose short.
