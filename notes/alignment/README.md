# Systematization pass

Entry point for the current work. `AGENTS.md` says how to work in this repo; this file says what the work is and where it stands. Keep `## Where we are` current in every turn that moves anything.

## Where we are

- **Status:** **Phase 2.3, the container family, is in progress.** The two glossary contexts, message-family dispositions, [one flexible Card](../decisions/canonical-card.md) and [Fieldset form-group direction](../decisions/fieldset-form-group.md) are recorded. Entity/Item remains unanswered and [deferred to the Group review](phase-2-review.md#entity-and-item). Phase 1 research and its extension walkthrough remain complete. The [closure audit](additional-functionality-review.md#phase-1-closure-audit) separates completed research from later design, migration and acceptance obligations.
- **Current checkpoint:** [Phase 2 review](phase-2-review.md). Read the [context map](../../CONTEXT-MAP.md), then the relevant glossary. Feedback stays as a shared-control component plus examples; standalone Error is removed in the later migration; Empty State stays for its consistent structure. The [message-family analysis](../analysis/codebase-systematization.md#phase-2-message-family) and [evidence index](evidence/message-family-review-2026-09-19.json) give the reasons and limits. The earlier [extension review](additional-functionality-review.md) and [request snapshot](evidence/additional-functionality-2026-09-19.md) remain the Phase 1 record.
- **Original capabilities and other selections stand:** manifest analyzer, Chromium/Firefox/WebKit verification, Lit Motion, per-icon Material Symbols, the selected Pin Input/Number Input/Scroll Area/Steps behaviours, match-sorter, committed generated styles under src/generated, workflow-built docs, selective imports and the shadow mapping. The original Zag runtime strategy is superseded as below. [Original walkthrough](phase-1-review.md).
- **New living analysis:** [design foundations](../analysis/design-foundations.md), [agent tooling](../analysis/agent-tooling.md), and [developer tooling](../analysis/developer-tooling.md). Existing subject analyses now contain the integration, framework-package, motion/shape, ComboBox/Table, docs-navigation and overlay findings.
- **Latest selections:** shared spacing-only density for pages/sections, normal by default; menus/dialogs/Toasts keep normal inherited spacing; explicitly selected compact controls have a 24 × 24 CSS-pixel clickable-area floor with larger touch-friendly sizing available. Support LTR/RTL for pages/sections in Lit/React. Share moving indicators across suitable single-selection groups using Lit Motion. Exact interfaces and eligibility remain later.
- **Latest implementation correction:** [port Zag behaviour into native Lit using the full house stack](../decisions/zag-behaviour-ports.md). No custom Zag adapter, createMachine/interpreter, vanilla runtime or Zag state store for the five controls. Use the established TanStack Store approach, Lit Motion, generated styles and all applicable house conventions. New components, rebuilds and replacements are allowed; React wraps the same Lit implementation. Existing capabilities stand. The separate remove-scroll utility is unchanged.
- **Table scope stands:** the consuming application runs TanStack Table and owns its state, processing and experimental workers. The design system does not run it. TanStack Virtual is required for both Lit and React virtualization. Results pagination remains reusable, with application-owned state/loading.
- **Latest closure decisions:** [@internationalized/number is selected](../decisions/number-utilities.md) as an independent utility. [Shape morphing follows demonstrated component needs](../decisions/shape-support.md); the entire Material catalogue is not required and no geometry package is selected. The generic library study is background evidence only.
- **Resume:** no question card is open. **Stat is next in Phase 2.3**, with Tile and related helpers. Peter selected the [Group/Toolbar/selection responsibility split](../decisions/toolbar-group-responsibilities.md); do not re-ask it. Return to [Toolbar composition](phase-2-review.md#toolbar-and-group-composition) and Entity/Item during **Phase 2.4 Group**. Exact interfaces remain for the inventory, and Pagination's optional-parts question remains open. Phase 3 still starts only when Peter says; source implementation waits for Phase 5 approval.
- **Complete Pro evidence:** all 338 blocks, 1,003 block files, both kits' 250 files, and seven Free Blocks aliases are covered. The [review](chakra-pro-review.md), [per-file ledger](evidence/chakra-pro-review-ledger.json), [collection audit](evidence/chakra-pro-collection-audit.json) and [capability synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.md) preserve findings and limits. Use the collection in each relevant comparison.
- **Decision dependencies:** check every recommendation against accepted decisions and upcoming choices that could change it. Surface conflicts and decide whether existing/new/both need revision. Record each deferral's question, reason, dependency, return point and closure gate in the [review register](phase-2-review.md#decision-compatibility-and-dependencies), with a link from its owning review section. Deferral is not consent or completion.
- **Standing reference rule:** whenever considering Radix, Chakra UI, Material Design 3 guidance or Material Web's Lit implementation, also search the complete Chakra UI Pro block and kit collection for relevant evidence. It is an additional source, not a list of features to implement. Existing source roles and Peter's approvals still determine the result. [Recorded rule and collection access](../decisions/reference-systems.md#standing-comparison-rule).
- **Latest responsibility selection:** Group owns arrangement/shared presentation; Toolbar identifies related controls and owns coordinated keyboard movement; selection controls retain selected values and forms. These responsibilities compose. [Decision](../decisions/toolbar-group-responsibilities.md). Nested inputs, radio/segmented controls, disabled-action discovery, RTL, overflow and overlay focus return remain named Group/inventory dependencies.
- **Full Material review rule:** always read Overview, Specs and Guidelines in full, plus available Accessibility; include relevant other components and foundation documentation. Expand specification content and distinguish incomplete extraction, source text, diagrams and implementation. [Standing method](../decisions/reference-systems.md#complete-material-documentation-review). The [46-page review](evidence/material-full-review-2026-09-19.json) covers 20 Layout pages, six Interaction pages and all four tabs for five components, plus actual experimental Lit source and Chakra/Radix/APG comparisons. [Analysis](../analysis/codebase-systematization.md#full-material-review-and-selected-responsibilities).
- **House-versus-reference clarification:** label Material values and units separately. Evidence from a component review may justify a proposed change to house spacing, density or other rules; identify earlier/upcoming impacts and take the concrete revision to Peter. Existing decisions remain the baseline until changed. No numerical or visual replacement was selected in this review. [Recorded clarification](../decisions/reference-systems.md#reference-evidence-and-house-changes).
- **Composition qualification:** [Feedback](../decisions/feedback-component.md) and [Empty State](../decisions/empty-state-component.md) are accepted composed components with examples. Their consistent interface, structure and common experience justify retention. The [composition rule](../decisions/composition-over-count.md) now records that qualification; it does not retain all fixed arrangements automatically. [Error removal](../decisions/message-context-and-errors.md) preserves notification contexts and attached field validation.
- **Source freeze:** source, project dependencies, generator/build scripts, generated package/site files and publication settings remain unchanged. [Capture verification](evidence/extension-capture-verification.json) checks 870 protected fingerprints and local links. Peter has authorized checkpoint commits and a push of the saved records. This does not authorize package implementation or a release; the licensed reference source stays in its private local collection.
- **Evidence:** [ComboBox/Zag](evidence/additional-probes-2026-09-19.json), [lint tooling](evidence/tooling-evaluation-2026-09-19.json), [responsive review](evidence/responsive-review-2026-09-19.json), [Intent probe](evidence/intent-probe-2026-09-19.json), and [Devtools probe](evidence/devtools-probe-2026-09-19.json). Synthetic prototypes are not the finished integrations. The earlier 608-unit-test result is historical, not rerun here; the lint probes are not clean certification.
- **Latest evidence:** [blue/control review](evidence/blue-control-review-2026-09-19.json) preserves the browser measurements and comparison; [Table review](evidence/table-review-2026-09-19.json) now includes integrity-checked published artifacts, rendering/layout/pagination references and the consumer-owned correction. These follow-up Table findings are source inspection, not a new browser pass. This capture changes records only.
- **Pane evidence:** [package/source comparison and synthetic probes](evidence/resizable-panes-2026-09-19.json). The probes establish specific connector/sizing outputs, not a real Lit adapter or browser pass. No upstream patch/report was sent.
- **Zag support correction:** official @zag-js/vanilla 1.44.0 is published, but uses @zag-js/store. Lit support remains an unpublished, open draft PR. The vanilla discovery does not override Peter's no-Zag-runtime and TanStack-state decisions. [Review](../analysis/package-choices.md#native-lit-port-strategy).
- **Native-port evidence:** [source mappings and number-parser probe](evidence/native-port-mapping-2026-09-19.json). No port was implemented. The selected independent parser passed six API cases in Bun; no browser/form/IME integration is claimed and it is not installed in the project.
- **Shape background:** [geometry probes](evidence/shape-geometry-review-2026-09-19.json) exposed source/endpoint differences but do not establish AndroidX fidelity. Current component needs can start with ordinary properties and transforms; custom geometry requires a demonstrated inventory need.
- **Foundation follow-up:** [sources, selections and Interaction probe](evidence/foundation-followup-2026-09-19.json). Temporary window listeners remaining after Interaction disconnect were reproduced with synthetic EventTargets in Bun. Drawer/Slider cancellation and Button loading/disabled differences are source findings pending browser checks. Feed/list-detail/supporting-pane layouts remain recipe candidates, not approved new elements.
- **Communication:** use Peter's [local question skill](/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/SKILL.md) and Codex reference. One short self-contained choice at a time, comparisons in option rows, and no agent deadline. Prefer the permitted blocking Plan-mode route; do not use the async countdown card or claim its rendering is fixed. [Host evidence](../analysis/question-dialog-countdown.md).
- **Pacing:** Peter explicitly asked to continue between research subjects without waiting for another “continue.” Keep working within the authorized scope; pause for a substantive user decision or a necessary records checkpoint. Plan mode still prevents project-record writes, and source implementation still requires Phase 5 approval.
- **Approval boundaries:** Phase 3 starts when Peter says. Inventory/conventions/docs and the full Phase 5 migration still require approval before source implementation.

Accepted extension decision notes:

- [Separate Group, Toolbar and selection responsibilities](../decisions/toolbar-group-responsibilities.md).
- [Publish React support as a separate package](../decisions/react-integration.md).
- [Support consumer use of TanStack Table, with TanStack Virtual for Lit and React](../decisions/tanstack-table-compatibility.md).
- [Provide reusable results pagination](../decisions/results-pagination.md).
- [Provide resizable panes, with optional collapse and application-owned saving](../decisions/resizable-panes.md).
- [Port behaviour into new or rebuilt Lit components using the full house stack](../decisions/zag-behaviour-ports.md).
- [Use independent Adobe number utilities](../decisions/number-utilities.md).
- [Share density settings across pages and sections](../decisions/density.md).
- [Support both reading directions](../decisions/bidirectional-support.md).
- [Share moving selection-indicator behaviour](../decisions/shared-selection-indicator.md).
- [Keep native forms and make TanStack Form optional](../decisions/native-and-managed-forms.md).
- [Exclude server-side rendering](../decisions/server-rendering.md).
- [Use Material motion roles with both motion schemes](../decisions/material-motion-system.md).
- [Make shape morphing specific to demonstrated component needs](../decisions/shape-support.md).
- [Wrap complete names in multi-line ComboBox options](../decisions/combobox-long-labels.md).
- [Use the house stack for overlapping Toasts](../decisions/toast-behaviour.md).
- [Open interactive rich help by explicit activation](../decisions/rich-help-activation.md).
- [Support full visual themes on pages and sections](../decisions/custom-themes.md).
- [Make blue the default accent for relevant controls](../decisions/blue-accent.md).
- [Keep ripples off by default and allow opt-in](../decisions/optional-ripples.md).
- [Replace Biome with Oxlint and Oxfmt using Ultracite](../decisions/lint-toolchain.md).

- [Share responsive values across layout and appearance](../decisions/responsive-system.md).
- [Add Box to the planned primitives](../decisions/box-primitive.md).
- [Ship versioned consumer skills](../decisions/consumer-skills.md).
- [Provide a design-system documentation MCP server](../decisions/design-system-mcp.md).
- [Use TanStack Intent for consumer-skill tooling](../decisions/intent-tooling.md).
- [Keep AI support focused on artifact authoring in this pass](../decisions/ai-authoring-scope.md).
- [Build a shared inspector using TanStack Devtools](../decisions/design-system-devtools.md).

Keep Toast under the existing community-naming rule. The survey supports it; it was not a separate naming vote. Always compare the actual Material Web Lit implementation where relevant, under the [reference-system decision](../decisions/reference-systems.md).

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

For this walkthrough Peter explicitly selected the local [ask-user-question skill](/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/SKILL.md), with its [Codex contract](/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/references/codex.md). Use that copy in preference to the plugin cache. This records a task preference; no plugin or global skill was changed.

Addy Osmani's **Agent Skills** also supports the remaining pass. Use its relevant specification, research, planning, implementation, test, and review skills as each stage begins. Preserve the project-specific rules and output paths; [systematic-approach.md](../analysis/systematic-approach.md#agent-skills-for-the-systematization-pass) records the mapping and the defaults our rules override. Load skills as needed rather than preloading the pack's meta-router into project instructions.

## Rules specific to this pass

The general rules are in `AGENTS.md` and `PLAN.md` §1. These apply to this pass:

- **Questions use the question tool, with multiple-choice answers and no answer deadline.** Peter, 2026-09-10: follow `ask-user-question`, and wait until he answers or explicitly closes the question. Never treat elapsed time as an answer, a skip, or permission to proceed. Do not substitute a chat-only question. Do not claim to have disabled an app countdown without verifying it.
- **Source code changes start when the migration plan (Phase 5) is approved.** Until then the outputs are `CONTEXT.md`, decision notes, and documents under `notes/alignment/` and `notes/analysis/`.
- **Every change is a replacement.** The new name, shape or element is the only one left in the code. The record of what it replaced, and why, lives in a decision note, an analysis document, or this plan.
- **Best, not fastest.** Where the best path and the quick path differ, both are named and the best one is taken. Peter reaffirmed on 2026-09-19 that implementation effort must not decide the outcome. Compare long-term fit, correctness, capability, performance and maintenance; recommend replacement when it produces the better library.
- **Compare relevant implementations before asking.** Include Material Web's Lit implementation in future comparisons, as Peter requested on 2026-09-19. Explain how Chakra, Radix and other relevant references handle the question; distinguish authored inputs, generated output, design tokens and actual shipped behaviour. Existing appearance and package decisions still govern unless new evidence leads Peter to change them.
- **Always include the additional Pro reference source in relevant comparisons.** Whenever Radix, Chakra UI, Material Design 3 guidance or Material Web's Lit implementation is considered, referenced or evaluated, also search the [complete Chakra UI Pro block and kit collection](chakra-pro-review.md) for relevant evidence. Consult both capabilities and composition patterns, and record which examples matter or that none apply. Examples inform the comparison; their presence does not approve a feature, component, visual treatment or dependency. [Standing decision](../decisions/reference-systems.md#standing-comparison-rule). Preserve the existing roles of all sources and distinguish source code, observed behaviour and placeholders.
- **Check decisions in both directions.** Compare a recommendation with accepted decisions and with upcoming choices that might change it. Name conflicts and whether the existing decision, new proposal or both need revision; material changes go to Peter. Record unresolved dependencies and an explicit return point for deferred questions, linked from the [deferred register](phase-2-review.md#deferred-decisions) and the review section that must revisit them. Bring needed research forward rather than close a phase with its required decisions unresolved.
- **The mandated package stack stands, with explicit Phase 1 changes.** Peter retained [Lit Motion](../decisions/animation-package.md), selected [native behaviour ports using the house stack](../decisions/zag-behaviour-ports.md) instead of Zag runtime/adapter adoption, and selected [published match-sorter](../decisions/match-sorter.md). The [extension register](additional-functionality-review.md) records the other selected additions and verification conditions. Unselected research requests do not authorize substitutions or early implementation.
- **A deleted element is deleted whole:** element, map, sketches, spec, census config, docs page.
- **A rename that touches a class name or a prop the styles key on** is a change to `tools/geist/maps/<name>.ts`, followed by regeneration.
- If a name is odd because of an external constraint (the HTML attribute `type`, a platform API, a published entry point), record the constraint instead of flagging the name.
- If a finding is a judgment call, show the options with the evidence for each rather than picking one silently.

## Phase 0: Record the decisions this pass rests on

Write these as decision notes before doing anything else. They are decided; record them well and link them from `PLAN.md`.

Recorded 2026-09-19:

- [Goal and success criterion](../decisions/systematization-goal.md).
- [Composition over count](../decisions/composition-over-count.md).
- [Elements added beyond Geist](../decisions/non-canonical-elements.md).
- [Reference systems](../decisions/reference-systems.md).
- [Floating-surface shadows](../decisions/floating-surface-shadows.md); Phase 1 review selected the role mapping and the plain-tooltip/Toast treatments. [Research](../analysis/floating-surface-shadows.md).
- [Material tab indicator](../decisions/material-tab-indicator.md).
- [Shared icon library](../decisions/shared-icon-library.md); Phase 1 review later selected [per-icon elements](../decisions/icon-element-shape.md) and [Material Symbols SVGs](../decisions/material-symbols-icons.md).

1. **Goal, restated.** Supersedes the "exact parity" clause of `notes/decisions/parity-scope.md`. Geist stays the baseline for every element Geist has. Named deviations are allowed; each records its source (Radix, Chakra, Material) and the value or behaviour taken. The census either accepts a deviation per element in the `ACCEPTED` table in `diff.ts`, or drops that element from the sweep; say which, per element. Elements Geist does not have are verified against their source system's published values. The rest of parity-scope.md stands: self-consistent first, idiomatic for Lit second, familiar to a reference user third.
2. **Composition over count.** An element earns its place by doing something the primitives composed together cannot. An element that is only a fixed arrangement of primitives becomes a recipe (a pattern page, and where it is page-level, a `dashboard.css` recipe), not an element. Every element in the inventory states what it composes and what composes it.
3. **Non-canonical elements.** The 26 elements the earlier passes invented beyond Geist (list in Phase 2.5) are not settled and not parity-tested. No rename or deepening effort goes into them as they stand. Each is deleted, or rebuilt as canonical with its own decision note. Known to come back: Toolbar, Chart (TanStack charts), Markdown (TanStack markdown and highlight). Stat and Trend are likely; decide in Phase 2.
4. **Reference systems.** Geist for the baseline. Radix Themes and Chakra UI for what Geist lacks and for naming when Geist's name is not the community's. Material 3 for the tab indicator and selected plain-tooltip guidance; Material Symbols for icon artwork. Peter additionally requested Material Web as an ongoing Lit implementation reference. When references disagree on a name, the more widely used name wins, and the note shows the survey that decided it.
5. **Floating surfaces** use the selected Radix role tiers: hover cards 4; menus, popovers and Toast 5; dialogs and modal drawers 6. Plain Tooltip has no shadow. The decision note maps these roles to current surfaces; final identities remain for the inventory.
6. **Tabs** take Material 3 primary tabs' indicator anatomy, states and behaviour, including the horizontal slide on change. Phase 1.5 review retained Lit Motion.
7. **Icons move into an icon library.** No element carries its own inline glyph boilerplate. Phase 1.6 review selected one element per icon using Material Symbols SVGs, defaulting to Rounded and unfilled. Detailed interfaces and delivery remain open.

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

Completed seed on 2026-09-19. Peter selected two linked contexts: [component library](../../CONTEXT.md) and [generation/comparison tools](../../tools/geist/CONTEXT.md), connected by the [context map](../../CONTEXT-MAP.md). Shared terms are defined once. Entries cover `variant`, `type`, `start`/`end`, add-ons, the message family and PLAN section 2's tooling vocabulary, with `_Avoid_` lists. Extend these glossaries as later terms are settled; keep implementation details in the analysis and inventory.

### 2.2 The message family

Three concepts, three names:

| Term | Scope | Placement | Lifecycle |
|---|---|---|---|
| **Toast** | result of a recent action | corner overlay | auto-dismisses |
| **Alert** | a section, form or block | inline, inside the section | while the section is relevant |
| **Banner** | the page or the app | top of the page, full width | until dismissed or resolved |

Today's `note` is the Alert. Write all three into `CONTEXT.md`, then audit every element that shows a message (`note`, `banner`, `toast`, `feedback`, `error`, `error-card`, `empty-state`, `project-banner`) against them. Anything that is one of the three by another name is renamed or folded in. Anything that is none of them is a real fourth concept, argued for, or goes.

Disposition review completed 2026-09-19; [full record](phase-2-review.md#message-family-dispositions). Note becomes Alert; Toast and Banner retain their distinct contexts; Feedback stays as a composed form plus examples; standalone Error is removed; Error Card and Project Banner retain their prior delete decisions; Empty State stays as a composed component plus examples. Feedback collects input and Empty State explains absent content, so neither adds a fourth notification level. Exact interfaces and behaviour contracts remain for later phases.

### 2.3 The container family

Review `card`, `entity`, `fieldset`, `panel`, `link-card`, `tile`, `item` and `setting-row`. The source survey corrects the premise that all eight are equivalent bordered containers: Entity/Item are rows, Tile is a labelled value, and the current Fieldset is a settings-card presentation. [Evidence](../analysis/codebase-systematization.md#phase-2-container-family). The comparison covers Radix, Chakra, Geist, Material Web, Ant Design and Web Awesome. Peter selected [one flexible Card](../decisions/canonical-card.md), [Fieldset form grouping](../decisions/fieldset-form-group.md), and the [Group/Toolbar/selection split](../decisions/toolbar-group-responsibilities.md). Next settle **Stat**, with Tile and related helpers. Toolbar's detailed composition and Entity/Item return in the Group review; consider Setting Row and related list/content companions there before completing the dispositions.

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

**Required return point:** during the Group row above, revisit the unanswered [Entity/Item disposition](phase-2-review.md#entity-and-item). Establish generic grouping versus semantic-list and selection responsibilities, and descriptive-row versus form-control/settings-row purposes. Then decide the row component versus recipe question with Peter. The empty/interrupted answer selected nothing; do not infer a preferred option. Resolve before Phase 2.5 and Phase 2 close; naming is coordinated with Phase 2.6.

Include Peter's explicit Checkbox Card/Radio Card integration question in that row review. Use all relevant Pro examples to compare descriptive, action, setting, expandable and selectable rows. Bring necessary selection-responsibility research forward from the inventory before resolving the row disposition; leave detailed interfaces in their scheduled phase.

Also return to the selected [Toolbar/Group/selection split](phase-2-review.md#toolbar-and-group-composition). Generic arrangement does not decide selection or form ownership. Resolve nested focus ownership, text-editing arrows, radio/segmented behaviour, disabled controls, RTL and popup focus dependencies before approving the relevant interfaces. The responsibility split does not automatically retain or remove every specialised Group.

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
| switch, switch-control | Rename; the concept is what the community calls a segmented control. *Investigate* the shape. The later source review found Radix Segmented Control using ToggleGroup type=single, while Chakra/Ark uses Zag radio-group; this corrects the earlier radio-backed characterization of Radix. Lay out current semantics and recommend. |
| kbd (Keyboard Input) | Already `kbd` on disk; fix the docs title. |
| loading-dots | *Investigate* folding into Spinner or a circular Progress. |
| destructive-modal | *Investigate* the name (Alert Dialog? Confirm Dialog?) and whether it is a Dialog variant or a recipe. |
| gauge | *Investigate* the name against the community's. Whatever it is called, it animates when `indeterminate` is true. |
| description | *Investigate* whether it should exist (2.4, Data List). |
| context-card | *Investigate* against Tooltip and Hover Card (2.4). |
| error | Delete standalone element. Use messages by context and retain attached field validation. [Decision](../decisions/message-context-and-errors.md). |
| feedback | Rebuild from shared controls, with inline/pop-up examples. Applications send data. [Decision](../decisions/feedback-component.md). |
| empty-state | Keep, built from shared parts with examples; consistent absent-content structure justifies it. [Decision](../decisions/empty-state-component.md). |
| relative-time (Relative Time Card) | *Investigate* whether it is needed; the name needs improving either way. |
| card, panel, link-card | One rebuilt Card covers these uses; remove separate Panel and Link Card interfaces. [Decision](../decisions/canonical-card.md). |
| fieldset | Rebuild for distinct form-group meaning and behaviour. [Decision](../decisions/fieldset-form-group.md). |
| entity, item and related list/content companions | Unanswered; [deferred to Phase 2.4 Group](phase-2-review.md#entity-and-item), before this register closes. |
| setting-row | Open; review form-control/settings-row purpose with the Group and deferred row questions. |
| tile | Open; evaluate with Stat in 2.3. |
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

Apply the accepted [composition qualification](../decisions/composition-over-count.md#qualification-accepted-on-2026-09-19): Feedback and Empty State also earn their place through a consistent named structure/common experience. Do not repeat their retention questions merely because their parts can be composed. Other retention decisions remain subject to review.

### 4.2 Every element

For each element that will exist, one entry: tag name; what it composes and what composes it; properties with types and defaults; slots; events with detail payloads; states; behaviours (keyboard, focus, dismissal, motion); the source of each value and behaviour (Geist, Radix, Chakra, Material, ours); and whether it is a Geist element (census) or not (verified against its source). Elements that become recipes get a recipe entry instead.

New elements go in too, so their interfaces are designed against the same conventions as the survivors, in this order because each tier composes the one before: Group (Chakra's, with `attached`); layout (Flex, Stack, Grid and Simple Grid, Scroll Area, under the names 2.4 settled); typography (Text, Heading, Link, Code, Quote, Kbd, Strong; all take `truncate` and `lineClamp`; Text and Heading also take `as`, `size`, `weight`; evaluate Chakra's and Radix's shapes per prop); Icon and Icon Button; the selection family (Checkbox, Checkbox Group, Checkbox Cards, Radio, Radio Group, Radio Cards, Segmented Control); the input family (Input with `clearable`, Number Input, Password Input, Pin Input, non-native Select); the container tier (container, Toolbar, Stat, Appbar, Data List if kept); the rest (Accordion and Toggle Tip per 2.4, Timeline, Steps, Inset, Chart, Trend if canonical, Markdown).

Composition rules that hold everywhere: internal start/end content is always the `start`/`end` slot; sibling composition is always Group. Icon tags below illustrate the selected per-icon shape; the final icon-name mapping remains for the inventory.

```html
<acme-input><acme-arrow-up-icon slot="start"></acme-arrow-up-icon></acme-input>

<acme-group attached>
  <acme-button>Some menu</acme-button>
  <acme-icon-button><acme-arrow-down-icon></acme-arrow-down-icon></acme-icon-button>
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

## Generated files

Current paths, verified from their writers in Phase 1. The [layout proposal](../analysis/repository-layout.md) includes the future structure and a README-ready table; no paths have moved.

| Path | Writer | Edit instead |
|---|---|---|
| src/generated/theme.css | tools/geist/vars.ts | Token selection and reference inputs in tools/geist |
| Mapped component *.styles.ts | tools/geist/gen.ts | tools/geist/maps and specs |
| Unmapped component/shared *.styles.ts | scripts/split-css.ts | src/geist.css and splitter routing |
| tokens.css | scripts/split-css.ts | Global house rules plus generated theme inputs |
| dashboard.css | scripts/build.ts | Recipe selection and its source families |
| dist/** | scripts/build.ts | src and build configuration |
| docs/** | docs-src/build.ts | docs-src, freshly built dist, CSS and assets |
| Optional external skill reference | docs-src/skill-reference.ts | Docs pages and API metadata |

The splitter skips mapped style families; it does not invoke the map generator. Existing tables that place the house sheet under tools/geist are inaccurate for the current checkout: the script reads src/geist.css.

## Output

- This file is the entry point for this pass; keep `## Where we are` and the document list current.
- [Phase 1 review and execution checkpoint](phase-1-review.md), with durable evidence under `notes/alignment/evidence/`.
- Working findings in `notes/alignment/`, as tables: Location | Category | Issue | Occurrences.
- Link `notes/alignment/` from `PLAN.md` as a new section, and mark PLAN.md 5.7's "sweep for other concepts" item as superseded by it.
- Keep prose short.
