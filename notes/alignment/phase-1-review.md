# Phase 1: findings and recommendations

**Current handoff:** [the pass status and next step](README.md#where-we-are). This completed review preserves its research evidence and dated checkpoints. Later decision notes supersede earlier recommendations; implementation remains gated by the approved inventory and migration plan.


The original nine-subject research and the [additional-functionality extension](additional-functionality-review.md#phase-1-closure-audit) are complete. The [Phase 2 closure](phase-2-review.md#phase-2-closure) records resolved dispositions and terminology. This ledger preserves research findings; later decisions supersede the Zag runtime strategy and broad Material-shape-catalogue interpretation. Follow the central handoff for current work.

Source baseline: commit `91ece56e2046ea7a5aeec5160c5dcfca7dbdd7de`, plus the existing uncommitted notes. The research protected 870 source/build-input files with fingerprints; all match. Project package files and generated outputs are unchanged. Candidate dependencies and experimental builds stayed under `/tmp`.

## Main conclusion

The highest-value work is to make the library's contracts reliable, then consolidate their shared implementation. Several visible inconsistencies come from missing metadata, incomplete form integration, or two reactive systems not updating together. Renaming alone would leave those causes in place.

## 1. Codebase analysis

The source census finds 150 elements. Shared controllers and helpers already exist, but form lifecycle, placement, motion, slot detection and highlighting still have competing implementations. Sixty classes declare only a render method; this is a useful candidate list, not evidence that all sixty are behaviour-free or should be deleted.

**Recommend:** design shared responsibilities around the surviving elements. Distinguish semantic roles before combining containers: Entity can be a list item or button, whereas Card is a styled box. Keep the planned composition-over-count test.

[Evidence and recommendation](../analysis/codebase-systematization.md) · [Composition candidates](evidence/composition-candidates.json)

## 2. Lit practice

The current source has 129 TanStack-backed fields and no Lit @state declarations. That earlier migration is substantially done. New browser checks find that Copy Button's public copied property can disagree with its rendering, and Input's inner validity can disagree with the outer form. The docs omit 32 runtime properties and misname one attribute.

**Recommend:** add a standard Custom Elements Manifest, standardize the public-input/state bridge and native form lifecycle, and add browser verification to the Bun unit tier. Preserve the controllers and shared adopted stylesheets already working. Scoped registries still need a fallback at the chosen browser floor. The SSR experiment found blockers; Peter subsequently [excluded SSR altogether](../decisions/server-rendering.md), so it creates no implementation follow-up.

[Evidence and recommendation](../analysis/lit-practice-review.md) · [Browser/test evidence](evidence/verification.json)

## 3. Mandated-package integration

The chosen packages are mostly present in real code. Their responsibilities are not consistently shared. Calendar still implements date arithmetic and placement itself. Markdown owns a second highlighting configuration. Overlay lifecycles repeat around Floating UI, native surfaces, scroll lock and animation.

**Recommend:** keep the stack and finish these integrations. Use controllers or directives to own lifecycle cleanup. A simple dismissal delay is not automatically a Pacer job, and directional widget navigation is not automatically a global hotkey.

[Per-package audit](../analysis/hand-rolled-audit.md)

## 4. Library gaps

Zag supplies Pin Input, Number Input, Scroll Area and Steps behaviour, but no documented official Lit adapter. Its Number Input already uses internationalized/number. The official adapter guide provides a route to map an adapter to our reactivity; no such integration has been proven here. React-only input-otp is not a direct Lit dependency.

The fuzzy-filter test uses 33 labels from our own examples. Upstream match-sorter agrees with the current helper on all nine queries; faster candidates change the answers.

**Current decision:** [native Lit behaviour ports using the full house stack](../decisions/zag-behaviour-ports.md) for Pin Input, Number Input, Scroll Area, Steps and resizable panes. The earlier actual Zag dependency/adapter choice is superseded. Preserve the selected control capabilities; use TanStack state, Lit Motion, generated styling and the other mandated integrations. The preceding package comparison is historical evidence, not authorization to restore a Zag runtime.

**Decided:** use [published match-sorter](../decisions/match-sorter.md), subject to broader compatibility fixtures. **Still proposed:** compose Timeline without a separate behaviour package; its exact inventory and the other control interfaces remain open.

[Evidence, options and costs](../analysis/package-choices.md) · [Filtering experiment](evidence/filter-comparison.json)

## 5. Animation package

The Book already demonstrates Lit Motion's custom 3D frames and interruption handling. With a common Lit baseline, Lit Motion adds 3,173 gzip bytes in the probe, versus 3,825 for Motion mini and 4,434 for Anime WAAPI. Other candidates have broader adoption, but that does not demonstrate better Lit integration or frame rate.

**Decided:** [retain Lit Motion](../decisions/animation-package.md), subject to browser verification of interruption, resizing, removal and reduced motion. Design the shared lifecycle policy in Phases 3–5. Peter reaffirmed that the best long-term result governs, regardless of implementation effort. Its Labs status remains a maintenance consideration; no cross-library FPS or reliability advantage is proven.

[Comparison and limits](../analysis/animation-package.md) · [Package measurements](evidence/package-bundles.json)

## 6. Icon library

Both a named icon element and one tag per icon can support selective imports. The expensive choice is importing a complete icon namespace for arbitrary runtime lookup. Two Lucide icon data exports cost 125 gzip bytes; the complete lookup costs 93,687. Neither figure includes a proposed house renderer.

**Decided:** [one element per icon](../decisions/icon-element-shape.md), using [Material Symbols SVGs](../decisions/material-symbols-icons.md), defaulting to **Rounded, unfilled**. Peter's request for multiple styles supersedes the initial single-element/Lucide recommendation. Support Outlined, Rounded and Sharp families with official filled/unfilled artwork, overrides and separate style imports. No icon font or two-tone. Home SVG sources were verified across those families and fill states; complete coverage and final delivery costs remain to test. The Lucide measurements above are historical comparison data, not Material Symbols sizes.

[Two shapes, licences and build effects](../analysis/icon-library.md)

## 7. Repository layout

The real writers differ from the current generated-file tables. The splitter reads src/geist.css, appends the generated theme and skips mapped styles; the map generator is a separate operation. Reference libraries use several layouts, but they consistently expose clear publication boundaries and machine-readable metadata.

**Decided:** put [committed generated styles under src/generated](../decisions/generated-style-location.md), and [build the website in a Pages workflow with its output excluded from Git](../decisions/documentation-publishing.md). **Later selected:** [a separate React integration package](../decisions/react-integration.md). **Still proposed:** site/_site naming, the house-sheet location and final CSS/package paths. The complete path map and publishing changes remain for the migration plan.

The survey covers Web Awesome, Spectrum, Material Web, Lion and Vaadin repositories, with follow-up checks of Radix Primitives/Themes, Chakra and TanStack's website. Material Web rebuilds adjacent generated styles and ignores them in Git; this is a viable alternative, not the same constraint as our committed generated inputs. For Nord, the public package structure is verified; its linked repository returned 404 and its unpublished layout remains unverified.

[Survey, proposed layout and generated-file map](../analysis/repository-layout.md)

## 8. Build and performance

The fresh isolated build reproduces the 1,339,348-byte minified bundle, 315,589 gzip. Exporting Button through the root barrel retains 298,278 gzip bytes; importing its direct module retains 19,755. A probe excluding Chart, Form helpers, Markdown, Code Block and Snippet saves 71,538 gzip bytes, or 22.7%.

**Decided:** [selective component imports](../decisions/selective-component-loading.md) are the normal generated-HTML path, with the complete standalone bundle retained as an explicit option. Browser-ready selective CDN entries remain to build and verify. Exact entry points, optional heavy membership and registration separation remain for later design. A sideEffects flag alone cannot make an intentionally all-registering barrel selective. Preserve public/dynamic tokens and Lit's working stylesheet sharing. [SSR is excluded](../decisions/server-rendering.md), not deferred.

[Experiments and prioritized proposals](../analysis/build-performance.md) · [Raw bundle measurements](evidence/build-bundles.json)

## 9. Documentation site

The site already shares section, example, API and page renderers. The weak point is the contract they consume: it misses inherited/accessor properties, method information, event payload types and styling hooks. Parts are extracted but not displayed. Examples also need explicit reset and teardown behaviour.

**Recommend:** one manifest-driven page layout, with shared page, example, API, states, composition and census helpers. Keep the existing Lit/router approach. Retain reference example content where required, while giving all pages a consistent structure and agent-readable Markdown twin.

[Page structure, proposed doc components and reference comparison](../analysis/documentation-site.md)

## Shadow mapping selected

Peter selected no shadow for plain Tooltip, shadow 5 for Toast, and Radix tiers by role for the rest: hover cards 4, menus/popovers 5, dialogs/modal drawers 6. Material 3 and Radix support the plain-tooltip outcome; the current menu-shadow relationship and Chakra/Material comparisons informed Toast. Drawer placement is an explicit extension to verify in the inventory. Composed wrappers must not add duplicate shadows. Preserve Radix colour dependencies and dark/color-mix branches through the generator.

[Selected mapping](../decisions/floating-surface-shadows.md) · [Material/Radix/Chakra evidence and limits](../analysis/floating-surface-shadows.md)

## What was verified

- Fresh isolated split, build and docs build: 330 modules, 128 compiled templates, 104 pages, 150 documented elements.
- Existing tests: 608 passed, zero failed, 3,317 assertions across 88 files.
- Real Chrome 153: copy-button state mismatch, required-input validity mismatch, disabled-fieldset inner-control mismatch, working input reset, and shared base stylesheet identity.
- SSR comparison: compiled output fails for Button/Calendar; a TypeScript-only control build renders them. Fieldset fails in both on MutationObserver. No hydration claim.
- Exact package versions, package sizes, two npm download samples, filtering outputs and source fingerprints are recorded with their scope.

## Limits that remain explicit

This is a research review, not a release certification. The full per-element behaviour/census sweep, cross-browser accessibility matrix, production CDN/Core Web Vitals timings, and new package adapters belong to implementation acceptance. No private Nord source was inferred. Static token reachability is not a deletion authorization. No package or architecture recommendation is an approved decision merely because it appears here.

## Decisions to take next

The original walkthrough, Phase 1 extension and Phase 2 disposition/terminology review are closed. Continue from the [current handoff](README.md#where-we-are) and [inventory](inventory.md). Detailed interfaces, export contracts, documentation components and path migrations require their recorded approvals. No research conclusion here approves implementation or a complete inventory entry.

## Guided walkthrough

Peter requested one item at a time. Start with interface accuracy and split larger subjects into individual decisions rather than placing the whole report in a question card.

1. **Manifest generator — decided:** `@custom-elements-manifest/analyzer`, selected 2026-09-19. [Decision](../decisions/custom-elements-manifest.md). Repository-specific output verification is still required before implementation acceptance.
2. **Browser coverage — decided:** require Chromium, Firefox and WebKit checks, selected 2026-09-19. [Decision](../decisions/browser-verification.md). This sets the verification target, not the test-runner implementation or browser version floor.
3. **Animation — decided:** retain Lit Motion subject to the browser checks, selected 2026-09-19. [Decision](../decisions/animation-package.md). Technical fit and long-term quality govern, not avoiding work.
4. **Icon shape — decided:** one element per icon, selected 2026-09-19. [Decision](../decisions/icon-element-shape.md). Exact names and imports remain to design.
5. **Icon source — decided:** Material Symbols SVGs, selected 2026-09-19. [Decision](../decisions/material-symbols-icons.md). Three families, official filled/unfilled forms, default/style switching/overrides/separate imports; no font or two-tone.
6. **Icon defaults — decided:** Rounded, then unfilled, in separate answers. Other families and fill states remain supported. [Decision](../decisions/material-symbols-icons.md).
7. **Pin Input — current:** selected separate-field control, implemented as a [native Lit behaviour port](../decisions/pin-input-behaviour.md). Actual Zag dependency adoption is superseded.
8. **Number Input — current:** formatted entry and stepping through a [native Lit behaviour port](../decisions/number-input-behaviour.md), with the selected independent number utility.
9. **Scroll Area — current:** custom controls over native scrolling, implemented as a native Lit port and replacing Scroller. [Decision](../decisions/scroll-area-behaviour.md). Exact visibility defaults remain inventory work.
10. **ComboBox ranking — decided:** published match-sorter, subject to wider compatibility tests. [Decision](../decisions/match-sorter.md).
11. **Steps — current:** interactive navigation/content through a native Lit port. [Decision](../decisions/steps-behaviour.md). Navigation and validation details remain inventory work.
12. **Shared implementation condition:** use the full house stack, including canonical TanStack state and Lit Motion, with no Zag adapter/interpreter/store. [Current strategy](../decisions/zag-behaviour-ports.md); [superseded strategy record](../decisions/zag-lit-integration.md).
13. **Reference scope — decided:** include Material Web in future implementation comparisons. This does not adopt every Material visual treatment or dependency. [Reference roles](../decisions/reference-systems.md).
14. **Generated styles — decided:** separate src/generated folder, with generated styles still committed. [Decision](../decisions/generated-style-location.md).
15. **Site output — decided:** workflow-built GitHub Pages site, with generated output excluded from Git. Exact paths, workflow triggers and migration details remain to specify. [Decision](../decisions/documentation-publishing.md).
16. **Artifact loading — decided:** import needed components by default; keep the complete bundle available. Direct-browser selective delivery still requires implementation and verification. [Decision](../decisions/selective-component-loading.md).
17. **Shadows — decided:** plain Tooltip none; Toast 5; hover cards 4; menus/popovers 5; dialogs/modal drawers 6. [Decision](../decisions/floating-surface-shadows.md).
18. **Current continuation:** family dispositions and terminology are closed. Use the [inventory](inventory.md) and [central handoff](README.md#where-we-are) for remaining interfaces and approval steps. Timeline composition, detailed documentation interfaces and final migration paths remain their explicit later-phase obligations, not missing package approvals.

No source code changed. The original decision capture is complete; the newer extension has its own current checkpoint and research register. Use his [local question skill](/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/SKILL.md) when the walkthrough resumes. Keep the question premise compact and comparison details in separate option rows because Peter reports flattened paragraph breaks. The [host investigation](../analysis/question-dialog-countdown.md) preserves the blocking route and verification limits. A request for reference evidence is a clarification, not a choice: answer it, then return to the unresolved decision through the tool.
