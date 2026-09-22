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
| M14 | Scroll Area; Resizable panes; native-content List/Data List; Card/Inset/Item compositions | M06–M13 as used | 4–8 per family slice; document CSS and replacement recipes |
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

M10 introduces explicit keyboard-collection and Toolbar-delegation helpers. A radio collection inside a Toolbar yields arrow ownership and does not change selection. M14 must register its actual Toolbar root, expand registered collection targets, own the sole tab-entry model and consume delegated arrows even when native radio defaults were prevented. The bare-Toolbar protocol fixture is a prerequisite, not completion of the actual Toolbar integration. Include independent actions, editing controls, RTL/vertical direction, edges and nested collections in that M14 gate.

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

[Radio acceptance](evidence/m10-radio-2026-09-21.json) closes Radio, Radio Group and Radio Card at their assigned boundary. Build/site and 900 tests pass. Source/compiled native checks, paired native-radio controls, forced colors, metadata, live forms/cards and the Checkbox Group/Card regression all pass. Choicebox is removed. Continue the shared internal indicator and Segmented Control before reusing acme-switch for binary Switch; then Tabs and Theme Switcher. Actual Toolbar integration remains M14 as stated above.
