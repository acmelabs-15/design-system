# Systematization research review

Status: Completed historical research and decision walkthrough.

## Scope and interpretation

This review records the original nine investigations and extended walkthrough. It preserves the baseline, measured failures, alternatives and limited probes. Later approved contracts and implementation resolve its pending interface/delivery statements. Native Lit/TanStack ports replace the old Zag runtime proposal; no full Material shape catalogue was selected.

The dated findings below retain their source versions, measurements, corrections and verification limits. Old phase gates, source freezes, local-skill routing and task-specific permission grants describe the completed pass. They do not govern new work. The [current handoff](../../STATUS.md) owns the next action.


The completed review preserves its research evidence and dated checkpoints. Later decisions and implementation records resolve its earlier recommendations and pending states.


The original nine-subject research and the [additional-functionality extension](../../design/additional-capabilities.md#phase-1-closure-audit) are complete. The [Phase 2 closure](scope-review.md#phase-2-closure) records resolved dispositions and terminology. This ledger preserves research findings; later decisions supersede the Zag runtime strategy and broad Material-shape-catalogue interpretation. The old central handoff owned continuation during the completed pass.

Source baseline: commit `91ece56e2046ea7a5aeec5160c5dcfca7dbdd7de`, plus the existing uncommitted notes. The research protected 870 source/build-input files with fingerprints; all match. Project package files and generated outputs are unchanged. Candidate dependencies and experimental builds stayed under `/tmp`.

## Main conclusion

The highest-value work is to make the library's contracts reliable, then consolidate their shared implementation. Several visible inconsistencies come from missing metadata, incomplete form integration, or two reactive systems not updating together. Renaming alone would leave those causes in place.

## 1. Codebase analysis

The source census finds 150 elements. Shared controllers and helpers already exist, but form lifecycle, placement, motion, slot detection and highlighting still have competing implementations. Sixty classes declare only a render method; this is a useful candidate list, not evidence that all sixty are behaviour-free or should be deleted.

**Recommend:** design shared responsibilities around the surviving elements. Distinguish semantic roles before combining containers: Entity can be a list item or button, whereas Card is a styled box. Keep the planned composition-over-count test.

[Evidence and recommendation](../../research/06-codebase-systematization.md) · [Composition candidates](../../verification/systematization/composition-candidates.json)

## 2. Lit practice

The current source has 129 TanStack-backed fields and no Lit @state declarations. That earlier migration is substantially done. New browser checks find that Copy Button's public copied property can disagree with its rendering, and Input's inner validity can disagree with the outer form. The docs omit 32 runtime properties and misname one attribute.

**Recommend:** add a standard Custom Elements Manifest, standardize the public-input/state bridge and native form lifecycle, and add browser verification to the Bun unit tier. Preserve the controllers and shared adopted stylesheets already working. Scoped registries still need a fallback at the chosen browser floor. The SSR experiment found blockers; Peter subsequently [excluded SSR altogether](../../decisions/0092-server-rendering.md), so it creates no implementation follow-up.

[Evidence and recommendation](../../research/15-lit-practice-review.md) · [Browser/test evidence](../../verification/systematization/verification.json)

## 3. Mandated-package integration

The chosen packages are mostly present in real code. Their responsibilities are not consistently shared. Calendar still implements date arithmetic and placement itself. Markdown owns a second highlighting configuration. Overlay lifecycles repeat around Floating UI, native surfaces, scroll lock and animation.

**Recommend:** keep the stack and finish these integrations. Use controllers or directives to own lifecycle cleanup. A simple dismissal delay is not automatically a Pacer job, and directional widget navigation is not automatically a global hotkey.

[Per-package audit](../../research/13-hand-rolled-audit.md)

## 4. Library gaps

Zag supplies Pin Input, Number Input, Scroll Area and Steps behaviour, but no documented official Lit adapter. Its Number Input already uses internationalized/number. The official adapter guide provides a route to map an adapter to our reactivity; no such integration has been proven here. React-only input-otp is not a direct Lit dependency.

The fuzzy-filter test uses 33 labels from our own examples. Upstream match-sorter agrees with the current helper on all nine queries; faster candidates change the answers.

**Current decision:** [native Lit behaviour ports using the full stack](../../decisions/0114-zag-behaviour-ports.md) for Pin Input, Number Input, Scroll Area, Steps and resizable panes. The earlier actual Zag dependency/adapter choice is superseded. Preserve the selected control capabilities; use TanStack state, Lit Motion, generated styling and the other mandated integrations. The preceding package comparison is historical evidence, not authorization to restore a Zag runtime.

**Decided:** use [published match-sorter](../../decisions/0058-match-sorter.md), subject to broader compatibility fixtures. **Proposed at this checkpoint:** Timeline composition without a separate behavior package; exact interfaces were still open. The later [Timeline contract](../../../spec/SPEC-navigation-disclosure.md#n-11-timeline) and [M15 acceptance](../../verification/systematization/m15-steps-timeline-2026-09-23.json) record the selected scope and tested outcome.

[Evidence, options and costs](../../research/16-package-choices.md) · [Filtering experiment](../../verification/systematization/filter-comparison.json)

## 5. Animation package

The Book already demonstrates Lit Motion's custom 3D frames and interruption handling. With a common Lit baseline, Lit Motion adds 3,173 gzip bytes in the probe, versus 3,825 for Motion mini and 4,434 for Anime WAAPI. Other candidates have broader adoption, but that does not demonstrate better Lit integration or frame rate.

**Decided:** [retain Lit Motion](../../decisions/0004-animation-package.md), subject to browser verification of interruption, resizing, removal and reduced motion. The shared lifecycle policy was assigned to the original Phases 3–5. Peter reaffirmed that the best long-term result governs, regardless of implementation effort. Its Labs status remains a maintenance consideration; no cross-library FPS or reliability advantage is proven.

[Comparison and limits](../../research/02-animation-package.md) · [Package measurements](../../verification/systematization/package-bundles.json)

## 6. Icon library

Both a named icon element and one tag per icon can support selective imports. The expensive choice is importing a complete icon namespace for arbitrary runtime lookup. Two Lucide icon data exports cost 125 gzip bytes; the complete lookup costs 93,687. Neither figure includes a proposed renderer.

**Decided:** [one element per icon](../../decisions/0046-icon-element-shape.md), using [Material Symbols SVGs](../../decisions/0060-material-symbols-icons.md), defaulting to **Rounded, unfilled**. Peter's request for multiple styles supersedes the initial single-element/Lucide recommendation. Support Outlined, Rounded and Sharp families with official filled/unfilled artwork, overrides and separate style imports. No icon font or two-tone. Home SVG sources were verified across those families and fill states; complete coverage and final delivery costs remained untested by those Home samples. The later [M09 delivery record](../../verification/systematization/m09-icon-delivery-2026-09-21.json) supplies its own bounded catalogue/delivery evidence. The Lucide measurements above are historical comparison data, not Material Symbols sizes.

[Two shapes, licences and build effects](../../research/14-icon-library.md)

## 7. Repository layout

At the research checkpoint, the real writers differed from the generated-file tables. The splitter read src/geist.css, appended the generated theme and skipped mapped styles; the map generator was separate. Reference libraries use several layouts, but they consistently expose clear publication boundaries and machine-readable metadata.

**Decided:** put [committed generated styles under src/generated](../../decisions/0044-generated-style-location.md), and [build the website in a Pages workflow with its output excluded from Git](../../decisions/0030-documentation-publishing.md). **Later selected:** [a separate React integration package](../../decisions/0081-react-integration.md). **Proposed at this checkpoint:** site/_site naming, the authored stylesheet location and final CSS/package paths. The later [M01/M02 record](../../verification/systematization/m02-css-pipeline-2026-09-20.json) documents the path/compiler implementation, [M03 delivery](../../verification/systematization/m03-delivery-2026-09-20.json) records package delivery, and [release 0.3.2](../../releases/0.3.2.md) records the publishing/snapshot outcome. These later records retain their own proof limits.

The survey covers Web Awesome, Spectrum, Material Web, Lion and Vaadin repositories, with follow-up checks of Radix Primitives/Themes, Chakra and TanStack's website. Material Web rebuilds adjacent generated styles and ignores them in Git; this is a viable alternative, not the same constraint as our committed generated inputs. For Nord, the public package structure is verified; its linked repository returned 404 and its unpublished layout remains unverified.

[Survey, proposed layout and generated-file map](../../research/18-repository-layout.md)

## 8. Build and performance

The fresh isolated build reproduces the 1,339,348-byte minified bundle, 315,589 gzip. Exporting Button through the root barrel retains 298,278 gzip bytes; importing its direct module retains 19,755. A probe excluding Chart, Form helpers, Markdown, Code Block and Snippet saves 71,538 gzip bytes, or 22.7%.

**Decided:** [selective component imports](../../decisions/0091-selective-component-loading.md) are the normal generated-HTML path, with the complete standalone bundle retained as an explicit option. At this research checkpoint, browser-ready selective CDN entries were unbuilt and unverified; exact entries, optional heavyweight membership and registration separation remained design work. Later [M03 delivery](../../verification/systematization/m03-delivery-2026-09-20.json) and [0.3.2 public delivery](../../releases/0.3.2.md) record implementation and verification at their stated scope. A sideEffects flag alone cannot make an intentionally all-registering barrel selective. Preserve public/dynamic tokens and Lit's working stylesheet sharing. [SSR is excluded](../../decisions/0092-server-rendering.md), not deferred.

[Experiments and prioritized proposals](../../research/05-build-performance.md) · [Raw bundle measurements](../../verification/systematization/build-bundles.json)

## 9. Documentation site

The site already shares section, example, API and page renderers. The weak point is the contract they consume: it misses inherited/accessor properties, method information, event payload types and styling hooks. Parts are extracted but not displayed. Examples also need explicit reset and teardown behaviour.

**Recommend:** one manifest-driven page layout, with shared page, example, API, states, composition and census helpers. Keep the existing Lit/router approach. Retain reference example content where required, while giving all pages a consistent structure and agent-readable Markdown twin.

[Page structure, proposed doc components and reference comparison](../../research/09-documentation-site.md)

## Shadow mapping selected

Peter selected no shadow for plain Tooltip, shadow 5 for Toast, and Radix tiers by role for the rest: hover cards 4, menus/popovers 5, dialogs/modal drawers 6. Material 3 and Radix support the plain-tooltip outcome; the current menu-shadow relationship and Chakra/Material comparisons informed Toast. Drawer placement is an explicit extension to verify in the inventory. Composed wrappers must not add duplicate shadows. Preserve Radix colour dependencies and dark/color-mix branches through the generator.

[Selected mapping](../../decisions/0039-floating-surface-shadows.md) · [Material/Radix/Chakra evidence and limits](../../research/11-floating-surface-shadows.md)

## What was verified

- Fresh isolated split, build and docs build: 330 modules, 128 compiled templates, 104 pages, 150 documented elements.
- Existing tests: 608 passed, zero failed, 3,317 assertions across 88 files.
- Real Chrome 153: copy-button state mismatch, required-input validity mismatch, disabled-fieldset inner-control mismatch, working input reset, and shared base stylesheet identity.
- SSR comparison: compiled output fails for Button/Calendar; a TypeScript-only control build renders them. Fieldset fails in both on MutationObserver. No hydration claim.
- Exact package versions, package sizes, two npm download samples, filtering outputs and source fingerprints are recorded with their scope.

## Limits that remain explicit

This is a research review, not a release certification. The full per-element behaviour/census sweep, cross-browser accessibility matrix, production CDN/Core Web Vitals timings, and new package adapters belong to implementation acceptance. No private Nord source was inferred. Static token reachability is not a deletion authorization. No package or architecture recommendation is an approved decision merely because it appears here.

## Historical decision closure

The walkthrough, extension and Phase 2 dispositions closed before the [inventory](../../../spec/SPEC-design-system.md) supplied detailed interfaces, exports, documentation components and path migrations. This research did not itself approve implementation or a complete entry; later approvals are separate evidence.

## Guided walkthrough

Peter requested one item at a time. The walkthrough began with interface accuracy and split large subjects into individual decisions rather than one report-sized question.

1. **Manifest generator — decided:** `@custom-elements-manifest/analyzer`, selected 2026-09-19. [Decision](../../decisions/0021-custom-elements-manifest.md). Repository-specific output verification is still required before implementation acceptance.
2. **Browser coverage — decided:** require Chromium, Firefox and WebKit checks, selected 2026-09-19. [Decision](../../decisions/0011-browser-verification.md). This sets the verification target, not the test-runner implementation or browser version floor.
3. **Animation — decided:** retain Lit Motion subject to the browser checks, selected 2026-09-19. [Decision](../../decisions/0004-animation-package.md). Technical fit and long-term quality govern, not avoiding work.
4. **Icon shape — decided:** one element per icon, selected 2026-09-19. [Decision](../../decisions/0046-icon-element-shape.md). Exact names and imports remained design work at that checkpoint; the later M09 delivery record above records their implementation scope.
5. **Icon source — decided:** Material Symbols SVGs, selected 2026-09-19. [Decision](../../decisions/0060-material-symbols-icons.md). Three families, official filled/unfilled forms, default/style switching/overrides/separate imports; no font or two-tone.
6. **Icon defaults — decided:** Rounded, then unfilled, in separate answers. Other families and fill states remain supported. [Decision](../../decisions/0060-material-symbols-icons.md).
7. **Pin Input — current:** selected separate-field control, implemented as a [native Lit behaviour port](../../decisions/0078-pin-input-behaviour.md). Actual Zag dependency adoption is superseded.
8. **Number Input — current:** formatted entry and stepping through a [native Lit behaviour port](../../decisions/0071-number-input-behaviour.md), with the selected independent number utility.
9. **Scroll Area — current:** custom controls over native scrolling, implemented as a native Lit port and replacing Scroller. [Decision](../../decisions/0089-scroll-area-behaviour.md). Exact visibility defaults remain inventory work.
10. **ComboBox ranking — decided:** published match-sorter, subject to wider compatibility tests. [Decision](../../decisions/0058-match-sorter.md).
11. **Steps — current:** interactive navigation/content through a native Lit port. [Decision](../../decisions/0103-steps-behaviour.md). Navigation and validation details remain inventory work.
12. **Shared implementation condition:** use the full stack, including canonical TanStack state and Lit Motion, with no Zag adapter/interpreter/store. [Current strategy](../../decisions/0114-zag-behaviour-ports.md); [superseded strategy record](../../decisions/0115-zag-lit-integration.md).
13. **Reference scope — decided:** include Material Web in future implementation comparisons. This does not adopt every Material visual treatment or dependency. [Reference roles](../../decisions/0082-reference-systems.md).
14. **Generated styles — decided:** separate src/generated folder, with generated styles still committed. [Decision](../../decisions/0044-generated-style-location.md).
15. **Site output — decided:** workflow-built GitHub Pages site, with generated output excluded from Git. Exact paths, workflow triggers and migration details remained unspecified at that checkpoint; the later path and release records above resolve them. [Decision](../../decisions/0030-documentation-publishing.md).
16. **Artifact loading — decided:** import needed components by default; keep the complete bundle available. Direct-browser selective delivery required later implementation and verification, recorded separately in the M03 and release evidence above. [Decision](../../decisions/0091-selective-component-loading.md).
17. **Shadows — decided:** plain Tooltip none; Toast 5; hover cards 4; menus/popovers 5; dialogs/modal drawers 6. [Decision](../../decisions/0039-floating-surface-shadows.md).
18. **Historical continuation:** family dispositions and terminology had closed. The [inventory](../../../spec/SPEC-design-system.md) then owned remaining interfaces and approvals, including Timeline composition, documentation interfaces and migration paths. These were later design obligations, not missing package approvals.

No source code changed in this capture. The original decisions were recorded, and the extension kept a separate research register. The walkthrough then used Peter's [local question skill](/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/SKILL.md), with separate option details because the host flattened paragraphs. The [host investigation](../../research/17-question-dialog-countdown.md) records that route and its limits. Reference requests were clarifications, not selections; the old workflow returned to the unresolved choice afterward. Current skill/host routing is owned by the approved maintainer workflow.

## Open follow-ups

- [Actual-platform verification remains unperformed](../../../.scratch/maintenance/issues/002-actual-platform-verification.md).

## Source provenance

Converted 2026-10-21 from notes/alignment/phase-1-review.md. That path identifies the historical source record. Inline source references and saved evidence retain their stated scope; this conversion does not rerun the original checks.
