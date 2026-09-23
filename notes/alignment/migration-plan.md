# Phase 5 migration plan

**Approved by Peter on 2026-09-20 through “approved”.** [Migration approval](../decisions/migration-approval.md). The [Phase 4 approval](../decisions/inventory-approval.md) fixes the design and five recommended outcomes. The [inventory](inventory.md#complete-proposal-set), [conventions](../conventions.md) and [coverage map](proposal-coverage.md) are implementation requirements, not a new interview queue.

This plan orders the work and fixes its output boundaries. M00 contains technical prerequisites to complete before the dependent production edits. Approval is recorded; do not ask for it again merely because a prerequisite still needs work. M00 is now closed and Phase 6 implementation has begun; publication settings still require their assigned verification and authorization.

## Current evidence and final structure

Read on 2026-09-20: package.json is 0.2.0; source is under src; authored docs under docs-src; generated docs are tracked under docs; generated component styles currently sit beside components. scripts/build.ts emits compiled Lit JS/declarations/bundles and reconstructs dashboard.css from generated TypeScript. split-css reads src/geist.css and skips mapped families; gen.ts separately writes map output. The release workflow currently uses Node/npm, which must be replaced with a verified pure-Bun path.

Approved final paths for migration:

| Area | Final path/ownership |
| --- | --- |
| Main package | Keep root @acmelabs/design-system and src/; avoid a needless whole-source workspace move |
| Authored component/shared code | src/components/<name>/ and src/shared/; __tests__ beside tested files |
| Generator-owned sources | styles/house.css replaces src/geist.css; tools/geist/maps/spec remain provenance/measurement tools |
| Committed generated inputs | src/generated/css/, src/generated/components/, src/generated/shared/, src/generated/theme.css and generation manifest/registrations |
| Final package output | dist/ JS/declarations/maps, dist/styles/ document/token/recipe CSS, dist/cdn/ selective browser modules/chunks |
| Definition/class separation | src/define/<name>.ts registers a component/dependencies; component class modules are side-effect free; src/all.ts is the explicit full registration entry |
| React package | packages/react/src → packages/react/dist; @acmelabs/design-system-react |
| Inspector package | packages/devtools/src → packages/devtools/dist; @acmelabs/design-system-devtools; absent from normal production output |
| Documentation MCP | packages/mcp/src → packages/mcp/dist; @acmelabs/design-system-mcp; local stdio/versioned-doc retrieval |
| Consumer skills | skills/ authored guidance plus generated release-qualified references; validated with Intent and packaged with the matching release |
| Authored website | site/ replaces docs-src/; keep the existing Lit builder/router |
| Generated website | _site/ disposable, built by Pages workflow; stop tracking docs/ only in the verified publishing migration |
| Icons | Pinned public artwork/license and generated catalog under assets/material-symbols/ and src/generated/icons/; explicit per-icon/family delivery |

Root CSS files move to dist/styles as final outputs; no duplicate compatibility files. Source maps point back to meaningful generator/authored input, not merely an empty mapping to generated TypeScript. Generated CSS/Lit modules remain committed while the upstream corpus is not in CI. A clean release build consumes reviewed committed generated inputs; the generation manifest checks their producer/source fingerprints. Do not pretend CI regenerated unavailable corpus inputs.

Use root Bun workspaces for the three additional packages. Keep existing version 0.2.0 during the code migration; release version selection/publication is a separate, registry-verified step. Never infer unpublished status from the local manifest alone.

## M00 — Close pre-implementation evidence

This is authorized research/scratch work, not permission to edit production code.

| Check | Required evidence | Pass condition |
| --- | --- | --- |
| CSS compiler/output | Representative house CSS through the candidate compiler, generated Lit module and scoped document output | Correct escaping, nesting/scope, registrations/defaults/inheritance/conflicts, deterministic output, invalid input and useful maps; Chromium/Firefox/WebKit render expected results |
| Compiler choice | Compare the existing Bun CSS capability against requirements; use source and executable evidence | One named/versioned tool with actual supported transforms/maps; do not add a compiler package by assumption |
| State/property/metadata | Extend existing atomState/helper evidence to representative scalar/array/responsive and reset cases | One canonical store, correct declaration order/defaults, CEM/export/type agreement and no partial invalid transaction |
| Registry and semantics | Representative real-host inline/block/parent placement, native collection content and ARIA/form targets with the selected mixin/polyfill path | Correct late definition, scoped/global creation, adoption, labeling and submission in required engines |
| Motion/overlay/Group | Representative cancel/reopen/remove, both indicator axes, wrapped Stack separators and attached child focus/seams | Correct ownership and cleanup; no invalid interface hidden by a timer or display:contents |
| Package delivery | Selective HTML, Lit and React consumer fixtures plus native-content document CSS | No missing modules/styles, duplicate runtime/state engine, accidental full-library import or devtools/Solid/ELK inclusion in a small artifact |
| Pure-Bun release path | Inspect/probe authentication/provenance and workspace packing without publishing | Concrete supported release mechanism; no unverified claim that replacing node with bun preserves npm trusted publishing |

Record fixtures/results and failures in existing analysis/evidence. A technical failure does not reopen a preference automatically. Resolve it within the approved interface when possible; bring a material interface/package change back with evidence. The [completion evidence](evidence/m00-completion-2026-09-20.json) now verifies six representative technical areas. Peter selected Lightning CSS 1.33.0 through “A” on 2026-09-20. [Recorded selection](../decisions/style-production.md#compiler-selected-2026-09-20). M00 is closed; proceed into dependent slices under the approval already granted. Full component acceptance and real Linux CI/registry trust verification remain assigned implementation/release checks, not claims made by these scratch probes.

## Implementation progress

- M00 is closed following Peter's compiler selection.
- M01 first slice: styles/house.css replaces the old source path; split and development watching consume it. The exact compiler dependency is installed. [Checks and baseline comparison](evidence/m01-house-style-path-2026-09-20.json).
- M01/M02 are implemented and verified. Generated modules, canonical CSS/maps, input/output manifest, site/_site routing and document output are in place. All 128 static library CSS blocks enter the generator; the intermediate-part selector defect is fixed; reverse-parsing and the old formatter are removed. [Evidence and review](evidence/m02-css-pipeline-2026-09-20.json).
- M03 is complete: analyzer metadata, class/definition/browser entries, production staging and private workspace skeletons pass review and fresh-consumer checks. [Manifest checkpoint](evidence/m03-manifest-2026-09-20.json); [delivery closure](evidence/m03-delivery-2026-09-20.json). Text Copy's dependency-closed removal was pulled forward from M04. Continue the remaining M04 closures; coupled replacements stay with their family batches. Final Linux publication/Pages settings remain M25, including removal of the frozen docs snapshot.

- M04-01 removes seven dependency-closed tags, four pages and eleven style entries; 142 source components remain. Retained styles are byte-identical; 656 tests pass. [Removal ledger](evidence/m04-removals-2026-09-20.json). Remaining isolated and coupled removals stay explicit.

- M04-02 removes six more isolated tags and 57 dedicated tooling artifacts. Retained generation inputs stay intact; 273 surviving CSS files are unchanged and 614 tests pass. The source count is now 136. Review approves the slice; example/style-owner closures remain.

- M04-03 closes 27 more retirement dependencies through retained examples, recipe/style cleanup and Toolbar ownership. M04 is complete: 109 components remain and eleven coupled implementations have explicit replacement owners in the [ledger](evidence/m04-removals-2026-09-20.json). Final checks: 592 tests and all-engine composition checks pass. Continue with M05 shared mechanisms.

- M05-01 refines the existing canonical state helper and passes all-engine ordinary/compiled public-state checks, metadata checks and 604 tests. [Evidence](evidence/m05-state-2026-09-20.json). The M05-02 headless appearance resolver also passes its focused unit, strict-type and three-engine checks; [evidence](evidence/m05-appearance-2026-09-20.json). M05-03 implements canonical ordered inputs and responsive normalization; [evidence](evidence/m05-styles-2026-09-20.json). Full style/HTML/renderer integration and theme scope remain. The [Lit helper-removal conflict](evidence/m05-style-helper-lifecycle-2026-09-20.json) needs a bounded authoring-contract revision before the public directive is implemented. Group provider lookup/integration belongs to M07.

- M05-04 adds startup-only breakpoint configuration, the 77-property schema and responsive HTML conversion. The build/docs and 700 tests pass, with 137 successful browser checks per engine. [Evidence](evidence/m05-responsive-inputs-2026-09-20.json). The helper cleanup decision was pending at this checkpoint and is resolved as explicit clearing on 2026-09-21.

- M05-05 delivers the full rem spacing/size catalog, removes both replaced numeric alias families, exports a freshness-checked token manifest and updates dev watching. Build/docs, 713 tests, 210 checks per engine, 114 page comparisons and a fresh packed consumer pass. [Evidence and migration map](evidence/m05-numeric-tokens-2026-09-20.json). Theme scope and remaining style integration stay active.

- M05-06 adds canonical headless theme resolution and reference-counted per-document system-preference observation. Build/docs and 732 tests pass; all 23 browser checks pass per engine after correcting a documented fixture transition race. [Evidence](evidence/m05-theme-state-2026-09-20.json). DOM scope transport, scope CSS, registration and Theme Switcher replacement remain an atomic integration boundary.

- M05-07 fixes actual static stylesheet loss and first-render failures across documents without rewriting declarations. The public rendering-root boundary, owner-document cache and stable Lit anchor pass build/docs, 744 tests, real three-engine adoption/initialization checks and 114 unchanged page comparisons. [Evidence](evidence/m05-stylesheet-adoption-2026-09-20.json). Nested theme transport and token-category integration remain.

- M05-08 implements initial style-input capture and responsive declaration planning using canonical TanStack ordered inputs. Capture preserves HTML/pre-upgrade order and synchronous detached state; the planner groups queries before applying authored property order. Independent review approves both modules. Build/docs and 762 tests pass; native fixtures pass 23 capture and 68 plan checks per engine. [Capture evidence](evidence/m05-style-input-capture-2026-09-20.json), [plan evidence](evidence/m05-responsive-style-plan-2026-09-20.json). Family accessors/manifest annotations and generated renderer delivery remain integration work. The public helper contract was pending at this checkpoint; Peter selected explicit clearing on 2026-09-21.

- M05-09 implements the explicit-clear directive/controller bridge and current JavaScript CSS-string processing. The helper uses actual-instance attachment rather than registry promises. Ownership survives reentrant publication and rolls back on failed grouped validation. [Helper evidence](evidence/m05-explicit-style-helper-2026-09-21.json), [current CSS evidence](evidence/m05-current-css-inputs-2026-09-21.json). Review, build/docs and 780 tests pass. The compiled helper passes 17 cases per engine; current CSS processing passes 22 cases per engine. Generated rendering, family accessors and root exports remain separate integration work. The bare Firefox/polyfill define-after-adoption failure is an [open registry-delivery return point](../analysis/lit-practice-review.md#registry-delivery-return-point-first-definition-after-adoption), not a passing helper test.

## Ordered implementation work packages

M05 is complete at its shared-mechanism boundary on 2026-09-21. [Theme/package/website acceptance](evidence/m05-theme-integration-2026-09-21.json), [appearance comparison](evidence/m05-theme-comparisons-2026-09-21.json) and [responsive delivery](evidence/m05-responsive-renderer-2026-09-21.json) record the results and native-platform limits. M07 onward owns actual family adoption; M10 owns final Theme Switcher composition/localization. Continue with M06 shared form, content, interaction and overlay lifetimes.

M06 is complete at its shared-mechanism boundary on 2026-09-21. [Implementation and native acceptance](evidence/m06-shared-lifetimes-2026-09-21.json) records 843 passing tests, 56 checks per browser engine, initial failures and native controls. The shared controller/callback bridge, Field registration/naming, Places, Interaction and three overlay controllers are implemented. M10–M17 retain their assigned family integration and genuine autofill/history acceptance. M07 layout families are the current work; completion of shared mechanisms does not count those families as delivered.

The table fixes dependency order and atomic replacement boundaries. Each work package is split into vertical commits by the named slice, normally 3–8 authored files plus tests/generated/site output. Mechanical path/registration batches can touch many files and are explicitly labelled. Counts below are planning ranges from the current tree, not measured final diffs. Each replacement removes the old interface and updates every internal consumer in that same slice; there are no compatibility exports or legacy modes.

| ID | Slices and concrete outcome | Dependencies | Estimated authored files per slice; generation |
| --- | --- | --- | --- |
| M01 | Generated-output path manifest and routing; house sheet move; site source/output path routing and dev watcher | M00 evidence sufficient for selected paths | 4–8 plus mechanical imports/committed generated files; yes |
| M02 | Compiled CSS as canonical intermediate; Lit/document/registration emitters; eliminate dashboard reverse-parsing; stable generation checks | M01, M00 CSS gate | 4–8 per emitter/integration slice; yes |
| M03 | Manifest analyzer/output normalization; class/definition/browser-entry generators; minimal workspace package skeletons | M01–M02 | 3–8 per generator/package slice; generated declarations/exports |
| M04 | Closed removal batch for unused retired interfaces; reverse-dependency ledger for coupled replacements | M03 | 3–8 per removable cluster; rebuild maps/docs as affected |
| M05 | Existing store helpers, authored/effective input distinction, ordered style helper, theme scope and responsive resolver | M00 state/registry, M02–M03 | 3–8 per shared mechanism with focused tests; yes for style outputs |
| M06 | Native form module, Field registration/naming, content tracking and interaction cancellation; overlay lifetime/placement/coordination | M05 and M00 proofs | 3–8 per mechanism; representative real-control fixtures |
| M07 | Separator and Box; Flex/Stack; Grid/Simple Grid; Group with explicit participation protocol | M05; Group seam evidence | 4–8 per primitive/family slice; maps, styles and examples |
| M08 | Typography/formatters; native Heading/Markdown/TOC target protocol; correct byte zero/binary labels | M05/M07 | 3–7 per element; generated typography styles |
| M09 | Icon catalog/base/selected delivery; Spinner; Button/Icon Button/Copy/Toggle actions | M05–M08 as used | 4–8 per capability; catalog/assets/notice/styles |
| M10 | Checkbox/Radio/Switch; state-owning groups/cards; shared indicator; Segmented Control/Tabs | M06–M09 | 4–8 per control/part slice; coordinated docs and old Switch/Toggle/Choicebox consumers |
| M11 | Field/Fieldset/Label; Input/Search/Password/Textarea; native form/reset/managed-form examples | M06/M09–M10 | 4–8 per control/family slice; remove Clearable Input/Check Row consumers atomically |
| M12 | Number Input and Pin Input native behavior ports using the selected independent utilities | M06/M11 | 4–8 per port slice; all-engine input/hold/paste/form tests |
| M13 | Menu/Context Menu and shared collection behavior; non-native Select/ComboBox/Multi Select; Slider/Calendar | M06/M09–M12 as used | 4–8 per family slice; approved scorer/date/number stack |
| M14 | Scroll Area; Resizable panes; native-content List/Data List; Card/Inset/Item/Disabled Wall compositions | M06–M13 as used | 4–8 per family slice; document CSS and replacement recipes |
| M15 | Accordion/Collapsible/Show; Steps/Timeline; Toolbar/App Bar/Breadcrumbs/Command Menu | M06–M14 | 4–8 per family slice; replace coupled action/disclosure consumers together |
| M16 | Sidebar/TOC/core Tree; author-ID discovery and file-tree recipe; no advanced Tree engine | M08/M13–M15 | 4–8 per family slice; focus/resize/fragment/RTL |
| M17 | Dialog/Alert Dialog/Drawer public families; Tooltip/Hover Card/Toggle Tip and typed-confirmation recipe | M06/M09/M11–M13 | 4–8 per family slice; named shadow/deviation and lifetime checks |
| M18 | Alert/Banner/Toast; Feedback/Empty State; Progress/Skeleton/Meter/Stat/Status | M09/M11/M14/M17 | 4–8 per family slice; normal-density exceptions and announcements |
| M19 | Native-content Table and optional Pagination parts; full consumer TanStack Table/Virtual examples | M07/M09–M14/M18 as used | 4–8 per structure/feature-combination slice; no Table runtime engine |
| M20 | Chart/Sparkline/Legend; ELK-backed Flow Diagram with separate worker delivery | M07/M09/M14/M18–M19 as used | 4–8 per chart/viewer capability; graph geometry/worker cleanup |
| M21 | Code Block/Snippet/JSON View/Markdown/Book/Browser/Video; migrate embedded retired controls | M08–M20 as used | 3–8 per retained family; preserve source capabilities and explicit trust boundaries |
| M22 | Generated React wrappers and shared native-content rendering fixtures across final APIs | M03 onward incrementally; final pass after M21 | 3–8 per wrapper generator/fixture slice; no parallel React behavior implementation |
| M23 | Standard docs units/pages, persistent document navigation, recipe/state fixtures and CEM/Markdown references | M03 onward with every family; final audit after M22 | 3–8 per doc unit/page cluster; _site rebuild, no hand-edited output |
| M24 | Versioned consumer skills/Intent, documentation MCP and read-only inspector | M03/M22–M23 | 3–8 per tool/packaging slice; production exclusion, no global config writes |
| M25 | Oxlint/Oxfmt/Ultracite + Stylelint replacement, build/CI checks and verified pure-Bun package workflow | M02–M03 established; finish across M21–M24 | 3–8 per config/check slice; formatting diffs separated from behavior |
| M26 | Whole-package removal/export audit, clean consumer builds, complete acceptance and release readiness | All prior work | Tests/docs/metadata only except fixes; regenerate affected outputs |

M04 removes only dependency-closed clusters. Coupled old families disappear in their replacement package: for example Code Block's old segmented-control consumer changes with M10, even if its own full rebuild lands in M21. Do not rename a class that is scheduled for deletion. The source-to-target ledger is the [approved 150-tag map](proposal-coverage.md); maintain a reverse-import/tag-use check so deletion cannot leave hidden docs/templates/tests broken.

M17's shared behavior exists at M06 for dependent controls; the public family work can be pulled earlier when a consumer requires it. This is a dependency edge, not permission to implement a second private Dialog. Likewise React/doc fixtures accompany each slice; M22/M23 are completion audits, not permission to postpone all cross-framework/documentation checks.

## Per-slice acceptance and removal checks

1. Read the exact approved entry and relevant source record; implement one vertical outcome with generated styles and matching HTML/Lit/React example as applicable.
2. Run adjacent focused tests, type/declaration checks and meaningful browser outcomes for the affected behavior.
3. Complete the required build order after the batch: bun run split, bun run build, bun run docs, bun test. Update those scripts atomically to their new paths; generation must not overwrite unrelated dirty work.
4. For reference-derived visuals, migrate/run the corresponding census and record only named accepted differences. New families use their explicit reference and behavior fixtures; no invented zero-difference claim.
5. Search source, imports, definitions, exports, manifests, docs inputs and tests for retired tags/properties/events/slots. Notes/Git may retain history; consumer README/docs describe current implemented behavior only.
6. Verify generated output determinism and record the result. Commit scoped changes only with applicable user authorization; do not create a tag, push or publish as a side effect.

A failing assertion is fixed at its cause; tests are not skipped or thresholds weakened to move a batch forward. Re-run broader checks when changes or failures justify it. The optional inspector and heavy graph/formatting assets must remain absent from minimal production examples.

## Publishing and completion

The Pages workflow must build the site from the same package outputs being documented before changing the remote Pages source or removing the old publishing path. Verify current remote settings again; the 2026-09-19 branch-/docs observation is historical. Prepare/test the change locally, then perform the outward action only with authorization.

Package publication uses explicit files/exports, exact matched versions, third-party notices and the verified Bun authentication/provenance path. No release trigger is exercised during planning or by ordinary branch commits. Consumer skills/MCP contents must match the packed release, not an authoring checkout.

Completion requires every approved source mapping accounted for, all final exports/examples working, no compatibility interfaces, all supported-browser/accessibility/visual/behavior checks complete, and the optional tools correctly isolated. The plan is approved; source changes depend on satisfying M00's technical prerequisites, not another permission round trip.

## M07 foundation completion — 2026-09-21

Separator, Box, Flex, Stack/HStack/VStack, Grid/Simple Grid and Group's layout/participation protocol are implemented. [Group boundary and package checks](evidence/m07-group-2026-09-21.json) link the final foundation validation. The current full suite passes 858 tests. The decorative Grid companions and ButtonGroup are removed.

Remaining assigned integration edges are mandatory: M09 adds action participation and verifies the actual painted border model; M10 adds Radio/Checkbox Cards and single-selection indicator composition; M11 adds input/add-on participation. No production member-matrix pass is claimed from the protocol fixture. Continue with M08 typography/formatting, then these family integrations. The local port-4180 server is temporarily in no-watch mode to avoid concurrent generators; restore normal watching at the end of migration execution.

### M08 completion — 2026-09-21

All eleven typography/formatting entries are implemented. [Typography evidence](evidence/m08-typography-2026-09-21.json) records 883 passing unit/site/metadata tests, 21 basic and 26 detailed checks per engine, strict public types and four fresh packed-consumer checks per engine. [Formatter evidence](evidence/m08-formatters-2026-09-21.json) covers localized byte data and number formatting. The full build and 93-page site pass with zero undocumented elements.

M16 owns final TOC use of the explicit heading-target protocol; M21 owns native Markdown content. M22/M26 must revisit the saved single-bundle Bun static-class/dynamic-definition import initialization reproduction. Split ESM works; no unproven upstream claim or compatibility alias is added. Continue with M09's icons and actions and actual Group member integration.

### M09 icon-delivery checkpoint — 2026-09-21

The complete pinned icon catalog and explicit per-icon/family modules are verified, with shared configuration and token-bootstrap entries. [Delivery evidence](evidence/m09-icon-delivery-2026-09-21.json) records complete asset geometry, source clipping comparisons, unchanged public manifest facts, fresh package/CDN acceptance and 893 passing tests. Internal glyph replacement, Spinner, Button/Icon Button/Copy/Toggle and the R04 identity entries (Avatar/Avatar Group/Badge/Pill/Tag) remain in M09. Split Button's Menu composition belongs to M13 and Theme Switcher to M10. These explicit return points prevent R04 entries falling between the short batch headings.

### M09 action acceptance — 2026-09-21

[Button, Icon Button, Toggle Button and Copy Button](evidence/m09-actions-2026-09-21.json) are implemented. Chip and old action aliases are removed with their callers. Native submitter ownership, canonical current values, attached Group surfaces, loading focus, clipboard lifetimes and optional ripple pass three-engine acceptance. Build/site and all 895 tests pass. Avatar/Avatar Group/Badge/Pill/Tag remain in M09. Split Button/Menu stays M13, Theme Switcher M10 and generated React wrapper reconciliation M22.

### M09 completion — 2026-09-21

[Identity acceptance](evidence/m09-identity-2026-09-21.json) completes Avatar/Avatar Group/Badge/Pill/Tag. Combined with the preceding icon, Spinner and action records, all M09 entries are complete at their assigned boundaries. The final build/site and 894 tests pass. Each engine passes 24 source and compiled identity checks, with live documentation overflow/removal actions. Native image lifetimes, count limits, immutable keyed members, RTL marker order and real Pill hit geometry are verified. Old service/username/avatar-size and Badge/Pill alias interfaces are removed. Reference-only style producers now retire their own recorded outputs safely. Continue M10 with the [failing Checkbox baseline](evidence/m10-checkbox-baseline-2026-09-21.json). Final whole-library appearance, accessibility, React/package acceptance and the two preserved platform limits remain M22/M26.

### M10/M11 integration return points — 2026-09-21

Checkbox now consumes NativeFormController and the shared semantic owner, which targets the actual input. Complete its current verification gate before building Checkbox Group/cards and the other selection families.

- Before adding Switch thumb motion, keep ripple cancellation scoped to the ripple. The current Ripple controller owns the only animation on an action/Checkbox host; its AnimateController.cancel must not cancel an independent thumb transition on that same host. Verify the combined case when Switch lands.
- M11 Field integration must supply names/descriptions through the semantic owner's defaults/reference inputs. The M06 FieldAssociation helper currently writes DOM references directly; do not let it compete with the new semantic controller on one native control. Adapt the existing helper and retain its lifecycle/ownership tests.
- Readonly belongs to AcmeReadOnlyFormElement for native text-like controls. Checkbox consumes AcmeFormElement and exposes no meaningless readOnly property.

### M10 standalone Checkbox slice — 2026-09-21

[Verified Checkbox behavior](evidence/m10-checkbox-progress-2026-09-21.json) replaces the old per-component form handling and handwritten check/dash artwork. Build/site and 897 tests pass. Native and compiled checks pass in all engines, including actual Chromium accessibility naming, unchanged Button/ripple regressions and live form examples. The new unchecked border is a measured accessibility deviation using existing gray-700. Continue Checkbox Group/Card integration and the remaining M10 families; this slice does not close M10. The Firefox native label-collection behavior is recorded with a bare-element reproduction and a validated naming guard.

### M10 Checkbox Group/Card slice — 2026-09-21

[Group/Card acceptance](evidence/m10-checkbox-group-card-2026-09-21.json) completes Checkbox ownership and card integration. Build/site and 907 tests pass. Each engine passes 40 source and compiled checks, plus five live documentation interactions. Conditional forwarded slots, owner removal, independent stateful actions, native input observer timing, current/default semantics, actual joined surfaces and name/description separation have explicit regressions. Continue Radio/Radio Group/Radio Card, then remove coupled Choicebox consumers. The registered-member mechanism and shared appearance fallback are reusable; no Radio, Switch, Tabs or indicator completion is implied.

### Radio / Toolbar integration return point — 2026-09-21

M10 introduces explicit keyboard-collection and Toolbar-delegation helpers. A radio collection inside a Toolbar yields arrow ownership and does not change selection. M15 must register its actual Toolbar root, expand registered collection targets, own the sole tab-entry model and consume delegated arrows even when native radio defaults were prevented. The bare-Toolbar protocol fixture is a prerequisite, not completion of the actual Toolbar integration. Include independent actions, editing controls, RTL/vertical direction, edges and nested collections in that M15 gate.

The M10 internal selection indicator needs explicit private definition delivery. Keep it available to its owning families without advertising it as another public selection component or an undocumented consumer tag. Verify the generator/manifest boundary when that internal element is added; the current delivery pipeline has only public component records.

### Exact-parity census scope for rebuilt controls — 2026-09-21

Under the approved systematization goal, these rebuilt interfaces leave the old one-to-one page sweep. Historical census files and diff rules remain historical evidence; no old-template mismatch is reclassified as a passing comparison. The listed acceptance records replace that page-shape oracle. M26 still owns the complete integrated appearance review.

| Elements | Named differences and retained baseline | Current verification |
| --- | --- | --- |
| Button, Icon Button, Toggle Button, Copy Button | House blue state roles; current parts/slots; native action ownership; separate toggle semantics; private clipboard feedback. Source action tier geometry remains. | M09 action geometry, contrast, native forms, source/compiled fixtures and live docs |
| Avatar, Avatar Group, Badge, Pill, Tag | Explicit image sources and immutable members; current size/slot names; accurate overflow; house label roles. Avatar and Badge/Pill tier geometry and Badge palettes remain source baselines. | M09 identity image/lifetime/count/geometry fixtures and generated metadata |
| Spinner, Icon Tile | Current sizes/parts; Lit Motion lifetime; named/decorative status ownership. Source blade geometry remains. | M09 Spinner/Tile and complete icon delivery records |
| Checkbox, Checkbox Group/Card | House blue mark and measured gray-700 control boundary; one current/reset owner; native naming and a 24px label hit surface in this family; separate card actions. Card structure/spacing references Chakra with house tokens. | M10 Checkbox and Group/Card native/compiled/forced-colors checks |
| Radio, Radio Group/Card | House blue state roles; native form/tree name scopes; one scalar owner; APG/RTL navigation; separate card actions. The 16px/8px medium mark baseline remains. | M10 Radio and paired native-platform fixtures |
| Choicebox, Choicebox Item | Removed outright. | Retired tags/exports/styles absent; replacement collection/card tests |

These are explicit per-element sweep dispositions, not exemptions from the approved behavior, accessibility, geometry or final visual gates. The 24px hit surface is a control-family implementation choice; it does not impose a new library-wide normal-density policy.

### M10 Radio family slice — 2026-09-21

[Radio acceptance](evidence/m10-radio-2026-09-21.json) closes Radio, Radio Group and Radio Card at their assigned boundary. Build/site and 900 tests pass. Source/compiled native checks, paired native-radio controls, forced colors, metadata, live forms/cards and the Checkbox Group/Card regression all pass. Choicebox is removed. Continue the shared internal indicator and Segmented Control before reusing acme-switch for binary Switch; then Tabs and Theme Switcher. Actual Toolbar integration remains M15 as stated above.

### M10 shared indicator checkpoint — 2026-09-21

[Private delivery and spring indicator](evidence/m10-selection-indicator-2026-09-21.json) pass source and compiled acceptance in all three engines, build/site and all 906 tests. Private definitions register through public owners; the standard analyzer's internal-class omission is preserved and private modules are excluded from consumer metadata. Both Material motion schemes have numeric role tokens and a verified Lit Motion parameter mapping. Integrate Segmented Control, binary Switch, Tabs and Theme Switcher. This does not close M10.

### M10 Segmented Control and Switch — 2026-09-21

[Combined acceptance](evidence/m10-segmented-switch-2026-09-21.json) records Segmented Control/Item and binary Switch, migrated Code Block/forms/docs callers, native/compiled checks and the retained Radio/Checkbox/Group/action regressions. Final selected-outline build, source/compiled and light/dark contrast checks pass. Implement Tabs and Theme Switcher to close M10. The parent reset and barred-control validity fixes are shared mechanisms verified through real consumers. Preserve the inset indicator's selected-state contrast in Tabs.

### M10 Theme Switcher — 2026-09-21

[Acceptance](evidence/m10-theme-switcher-2026-09-21.json) completes the application-owned appearance picker through actual Segmented Control/Group/indicator composition. Build/site, 900 tests, 18 Chromium and 17 Firefox/WebKit source/compiled checks, three live scoped examples and the application header pass. Tabs is the final M10 family; continue M11–M26 afterward.

### M10 Tabs implementation and M22 return point — 2026-09-21

[Tabs acceptance in progress](evidence/m10-tabs-2026-09-21.json) includes native relationship scope, controlled templates and scrolling. Finish the named gates before closing M10. M22 must provide framework-owned React mounting/reconciliation using the same canonical panel activation state; it must not clone/reparent ordinary React children or use a second selection store. Lit/HTML renderer acceptance alone does not close that adapter gate.

### M10 completion — 2026-09-22

[Tabs acceptance](evidence/m10-tabs-2026-09-21.json) closes the final M10 family. Build/site, 897 tests, source and compiled three-engine checks, actual documentation interactions and both appearance contrast checks pass. All M10 controls, selection owners/cards, the private indicator, Segmented Control, binary Switch, Tabs and Theme Switcher are complete at their assigned boundaries. Continue M11 with Field/Fieldset/Label and the text-control family. Preserve the named M14/M22/M26 integration gates; completion of this batch does not close them.

### M11 Fieldset native container and M22 return point — 2026-09-22

[Implementation evidence](evidence/m11-fieldset-2026-09-22.json) selects the actual native light-DOM ancestor. Finish compiled/site/full-suite acceptance. M22 must use x-acme-native-root to render one stable native child before the custom host connects; React's child reconciliation then retains its own DOM parent. Ordinary HTML/Lit ranges are preserved without cloning. Structural reconciliation remains distinct from synchronous disabled-property effects.

### M11 Fieldset acceptance — 2026-09-22

[Fieldset acceptance](evidence/m11-fieldset-2026-09-22.json) passes build/site, 898 tests, native and compiled checks in all engines, real React parent ownership and live form/first-legend actions. Continue Label/Field, then text controls and the optional managed-form adapter. The M22 native-root renderer contract remains mandatory. The current Disabled Wall gets its separate documentation page; its C-05 behavior rebuild belongs to the M14 surface batch. Toolbar belongs to M15, as the batch table specifies; earlier integration-return-point references have been corrected.

### M11 Label acceptance — 2026-09-22

[Label acceptance](evidence/m11-label-2026-09-22.json) completes the native label, exact/implicit association and actual-control focus bridge. Build/site, 897 tests, source/compiled three-engine checks and live activation examples pass. Slider owns its retained label stylesheet until M13; it no longer imports the removed Label styles. Continue Field, then the text controls and managed-form adapter.

### M11 Field acceptance — 2026-09-22

[Field acceptance](evidence/m11-field-2026-09-22.json) passes build/site, 901 tests, native/compiled checks and live form actions. It reuses the registry/association and canonical NativeFormController. Continue the text-control family, Clearable Input removal and the managed-form adapter. New text controls must register through this Field path rather than own duplicate label/help/error presentation.

### M11 text and managed-form acceptance — 2026-09-22

Input, Search, Password Input and Textarea use the shared native string owner, Field semantics and Group attachment. Clearable Input and control-owned label/error interfaces are removed; examples use Field and the clearable Input action. Slider's retained numeric entry uses the new text Input with decimal input mode; M13 replaces its composition with Number Input as assigned. Managed forms use a typed field-store binding with subscription cleanup and separate Field error presentation. [Final text/managed-form acceptance](evidence/m11-text-controls-2026-09-22.json) closes M11: strict package build, site and all 896 tests pass; every engine passes 38 source/compiled text checks, ten source/compiled managed-form checks and seven live documentation flows. Continue M12.

The build now enforces strict TypeScript. The final audit found widened getter types and cyclic controller inference in M10/M11; explicit types correct them. The six M10 files produce identical JavaScript before and after these type corrections. No old interface is restored.


### M12 Number Input acceptance — 2026-09-22

[Number Input acceptance](evidence/m12-number-input-2026-09-22.json) completes the number family: strict build, site, 906 tests, 44 source/compiled checks per engine and five live documentation flows. Native/managed form contracts, standard locale formats, decimal-safe steps, optional action parts and hold cleanup are implemented. The source-derived decimal loop and binary modifier-step drift are replaced with bounded decimal operations. Continue Pin Input to close M12.


### M12 complete — 2026-09-22

[Pin Input acceptance](evidence/m12-pin-input-2026-09-22.json) closes M12 alongside Number Input: strict package build/site and 916 tests pass. Each engine passes 32 source/compiled Pin checks, four source/compiled managed-form checks and five live examples. Shared manifest reference identity is now normalized once. Continue M13 with the verified slotted-overlay coordination correction.

## M13 Menu family and Split Button complete — 2026-09-22

[Menu / Context Menu / Split Button acceptance](evidence/m13-menu-2026-09-22.json) closes these assigned family entries: strict package build, site and all 905 tests pass. Each engine passes 30 source/compiled Menu checks, four source/compiled Split Button checks and six live documentation flows. Native shadow comparisons cover the three selected tiers in light/dark. Menu Button/Divider and the old Split Button interfaces are removed; Code Block and the authored examples use the replacements.

M13 remains active for shared Option, Select/ComboBox/Multi Select, Slider and Calendar. [Selection preparation](evidence/m13-selection-preparation-2026-09-22.json) records current source/docs review and three-engine native input/button reference candidates; it does not claim component acceptance. The complete pinned Material Web Select comparison is recorded; fixtures remain under /tmp/acme-m13-selection. Continue without questions under execution delegation.


## M13 selection replacement in verification — 2026-09-22

Select, ComboBox and Multi Select now share Option, native form ownership, popup placement/presence, keyboard/typeahead and generated field/list styling. Code Block uses Option children. ComboBox uses the published match-sorter package and manual slot projection; its authored node order remains stable through ranking and Lit keyed updates. Root-owned trigger content preserves native accessible relationships. The evidence-driven contract corrections are in execution-delegation.md and F-06. The old ComboBox Option, Multi Select Row, local scorer and old selection maps/styles are removed. Source browser checks pass; package/site/compiled verification is running. Number/Pin/Menu also share the tested slot-owner transfer helper. Do not mark this slice or M13 complete until final acceptance is recorded.


## M13 selection family complete — 2026-09-22

[Acceptance](evidence/m13-selection-2026-09-22.json) closes Option, Select, ComboBox and Multi Select at the assigned native/Lit boundary. Strict package build, 96-page site and all 881 tests pass. Source and compiled native checks cover forms, keyboard, projection, lifecycle, custom trigger content and caller migration. Actual Lit/React keyed child identity and Chromium accessibility order are verified. Code Block and Feedback now use Option children; renderer comments do not contaminate derived labels. Number/Pin/Menu slot ownership fixes pass native regressions. Slider and Calendar remain active in isolated worktrees; M13 is not complete.


## M13 Slider complete — 2026-09-22

[Slider acceptance](evidence/m13-slider-2026-09-22.json) records the strict build/site and all 883 tests, 44 source/compiled native checks per engine, six documentation flows and resolved independent review findings. Middle Truncate consumes the array value and live event. Calendar and date-runtime correction remain; continue locally from the isolated Calendar worktree.

## M13 complete — 2026-09-23

[Calendar acceptance](evidence/m13-calendar-2026-09-23.json) closes the final M13 family. The strict package build, 96-page site and all 900 tests pass. Each engine passes 28 source and compiled checks, six visible documentation flows and fifteen shared-overlay regressions. The corrected date runtime, generated styles, native form model, modal focus containment and frame-scheduled placement are integrated. M13 is complete at its assigned boundaries; M22/M26 retain actual platform, React and final release gates. Continue M14 with Disabled Wall, native List/Data List, Card/Inset/Item, Scroll Area and Resizable.

## M14 native-content and Disabled Wall slice — 2026-09-23

[Acceptance](evidence/m14-native-content-2026-09-23.json) closes C03–C05 at their native/Lit boundaries. Build/site, 902 tests, seven source/compiled checks per engine and all three documentation pages pass. Description is removed. Continue Card/Inset/Item, then Scroll Area and Resizable; M14 is not yet complete.

## M14 Card/Inset/Item slice — 2026-09-23

[Acceptance](evidence/m14-surfaces-2026-09-23.json) closes C01/C02/L06 at their assigned boundary. The package/site and all 906 tests pass; source/compiled geometry and real documentation interactions pass all three engines. Explicit logical Inset edges replace the ambiguous draft. Scroll Area and Resizable are the two remaining M14 families.

## M14 Scroll Area slice — 2026-09-23

[Acceptance](evidence/m14-scroll-area-2026-09-23.json) closes L08 at its native/Lit boundary. Build/site and all 909 tests pass; seventeen source/compiled cases per engine include an actual TanStack Virtual consumer, keyboard/wheel/drag, ownership and cleanup. The documentation actions and custom-bar appearance pass. Scroller is removed. Resizable is the only remaining M14 family.

## M14 complete — 2026-09-23

[Resizable acceptance](evidence/m14-resizable-2026-09-23.json) closes L09 and M14 at their assigned boundaries. Build/site, 926 tests, 23 source/compiled checks per engine, actual documentation and Chromium accessibility inspection pass. Forty repeated WebKit mounts pass after correcting the global reduced-motion rule; the unsuccessful styling experiments are removed. Continue M15. Include all N12 controls, not just Show. N08 Command Menu depends on the public Dialog family, so implement that M17 slice before Command Menu and record its completion there; do not create another dialog engine.

### M15 disclosure slice complete — 2026-09-23

[Disclosure acceptance](evidence/m15-disclosure-2026-09-23.json) closes N09 and N12 at their assigned boundaries. Accordion/Collapsible replace Collapse/Collapse Group; Show controls explicit content lifetimes; Show More and Load More share native action behavior. Tab Panel reuses the same owned-content helper. The newly reproduced focus-token defect in M14 controls is corrected in the authored producer. Build/site, 926 tests and all-engine source/compiled/documentation checks pass. Continue Steps/Timeline and the remaining M15 navigation families.

### M15 Steps and Timeline complete — 2026-09-23

[Acceptance](evidence/m15-steps-timeline-2026-09-23.json) closes N10/N11 at their assigned boundaries. Strict build/site, 932 tests, sixteen source/compiled checks per engine and actual documentation flows pass. Steps uses the documented value=count completion state and application validation requests; Timeline is descriptive ordered content. Continue Toolbar/App Bar/Breadcrumbs, then Dialog before Command Menu.

### M15 navigation slice complete — 2026-09-23

[Navigation acceptance](evidence/m15-navigation-2026-09-23.json) closes N01/N02/N05 at their assigned boundaries. Appbar is replaced by App Bar and its explicit regions; Toolbar integrates the M10 Radio/Segmented delegation contract; Breadcrumbs owns navigation only. The docs header consumer and Command Menu page-stack consumer are updated together. Strict build/site, 934 tests, thirteen source/compiled checks and seven documentation flows per engine pass. API table overflow is fixed in the site generator. Bring Dialog/Alert Dialog forward from M17, then complete N08 Command Menu.

### Native-dialog dependency order — 2026-09-23

Bring O01/O02/O03 (Dialog, Alert Dialog and Drawer) forward together before finishing M15 Command Menu and starting M16 Sidebar. The current Drawer/Sheet import Modal helpers; Sidebar explicitly composes the new Drawer. This ordering lets one verified slice remove those old implementations outright. Tooltip/Hover Card/Toggle Tip remain the later M17 remainder.

### O01/O02/O03 brought-forward slice complete — 2026-09-23

[Native-dialog acceptance](evidence/m17-native-dialogs-2026-09-23.json) closes Dialog, Alert Dialog and Drawer at their assigned boundaries. Strict build/site, 919 tests, 27 source/compiled checks per engine, actual documentation flows and shared regressions pass. Modal, Modal Inset and Sheet are removed; Drawer uses the new interface. Continue M15 Command Menu, then M16 Sidebar/TOC/Tree. The remaining M17 help families stay open.

### M15 complete — 2026-09-23

[Command Menu acceptance](evidence/m15-command-menu-2026-09-23.json) closes N08 and M15. Strict build/site, 915 tests, sixteen source/compiled checks per engine, real documentation and ComboBox regressions pass. The earlier slices close N01/N02/N05/N09/N10/N11/N12. Continue M16 with the already verified Drawer dependency.


### M16 TOC acceptance — 2026-09-23

[TOC evidence](evidence/m16-toc-2026-09-23.json) closes N04 at its native/Lit boundary. Explicit entries, registered Heading discovery, native fragments/focus and configurable scrolling pass source and compiled checks in all engines. The site fragment handler now preserves component navigation. Sidebar and core Tree remain M16 work; actual platform/React/final acceptance remains M22/M26.


### M16 Sidebar acceptance — 2026-09-23

[Sidebar evidence](evidence/m16-sidebar-2026-09-23.json) closes N03 at its native/Lit boundary. The shared Drawer, separate desktop/mobile state, explicit compact content and node-preserving slot projection pass all-engine source, compiled and documentation checks. Core Tree remains M16 work.


### M16 complete — 2026-09-23

[Tree View acceptance](evidence/m16-tree-view-2026-09-23.json) closes N06 and M16 with the prior TOC/Sidebar slices. Data-driven hierarchy, keyed author content, native links, selection/expansion/focus and Sidebar composition pass all engines. File Tree/Folder/File are removed, including their style producers. Continue the M17 help families; O01/O02/O03 are already complete.


### M17 complete — 2026-09-23

[Help acceptance](evidence/m17-help-2026-09-23.json) closes O04/O05/O06; the earlier native-dialog acceptance closes O01/O02/O03. Shared native presence, anchored geometry, motion, descriptions, focus and explicit interactive help pass source/compiled checks in all engines. Context Card and all legacy Tooltip producers are removed. Continue M18; actual platform/React/final package gates remain M22/M26.


### M18 message surfaces — 2026-09-23

[Alert/Banner acceptance](evidence/m18-messages-2026-09-23.json) closes M-01. Shared inputs, explicit live semantics, native actions and application-owned dismissal pass all engines. Note and old Banner producers are removed. M18 display families, scoped Toast and Feedback remain.


### M18 passive display surfaces — 2026-09-23

[Empty State/Status acceptance](evidence/m18-passive-displays-2026-09-23.json) closes M-04/M-08 at their assigned native/Lit boundaries. Composed empty content, application-defined status and owned pulse lifetime pass all engines. Default-attribute and documentation-coverage discoveries have concrete M26/M25 return points. Continue Progress/Skeleton/Meter, Stat, Toast and Feedback.


### M18 measurements — 2026-09-23

[Measurement acceptance](evidence/m18-measurements-2026-09-23.json) closes Progress/Skeleton/Meter and revalidates the shared Spinner/Status motion lifetime. Known zero, missing/loading values, finite ranges, native semantics, RTL and the named contrast deviation pass the assigned checks. M18 Stat, Toast and Feedback remain.


### M18 Stat family — 2026-09-23

[Stat acceptance](evidence/m18-stat-2026-09-23.json) closes M-07 at its native/Lit boundary. Native terms/definitions, explicit direction/sentiment, formatting, loading ownership and selection composition pass the assigned checks. Trend and the abbreviated Stat helpers are removed. M18 scoped Toast and Feedback remain.
