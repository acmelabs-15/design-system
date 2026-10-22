# Completed systematization migration plan

**Approved by Peter on 2026-09-20 through “approved”.** [Migration approval](../../../docs/decisions/0064-migration-approval.md). The [Phase 4 approval](../../../docs/decisions/0049-inventory-approval.md) fixes the design and five recommended outcomes. The [inventory](../../../spec/SPEC-design-system.md#complete-proposal-set), [conventions](../../../docs/development/interfaces.md) and [coverage map](../../../spec/component-coverage.md) are implementation requirements, not a new interview queue.

This completed plan records work order, dependencies and evidence. M00 prerequisites and M01–M25 implementation completed. M26 local acceptance combines an initial 22-of-23 browser run with one documented targeted correction against identical archives. Version 0.3.2 subsequently completed external delivery. The [release record](../../../docs/releases/0.3.2.md) retains actual-platform limits; today's work belongs to [status](../../../docs/STATUS.md), not this closed plan.

## Baseline and originally intended structure

The 2026-09-20 baseline had package.json version 0.2.0, source under src, authored documentation under docs-src, tracked generated documentation under docs, and generated styles beside components. scripts/build.ts emitted compiled Lit JS/declarations/bundles and reconstructed dashboard.css from generated TypeScript. split-css read src/geist.css and skipped mapped families; gen.ts wrote map output separately. The release workflow used Node/npm; the plan required a verified pure-Bun replacement.

The original approved path plan was:

| Area | Final path/ownership |
| --- | --- |
| Main package | Originally retained root @acmelabs/design-system and src/, avoiding a whole-source workspace move; later core-workspace and browser-distribution decisions superseded manifest/delivery ownership |
| Authored component/shared code | src/components/<name>/ and src/shared/; __tests__ beside tested files |
| Generator-owned sources | styles/house.css replaces src/geist.css; tools/geist/maps/spec remained provenance/measurement tools |
| Committed generated inputs | src/generated/css/, src/generated/components/, src/generated/shared/, src/generated/theme.css and generation manifest/registrations |
| Final package output | dist/ JS/declarations/maps, dist/styles/ document/token/recipe CSS, dist/cdn/ selective browser modules/chunks |
| Definition/class separation | src/define/<name>.ts registers a component/dependencies; component class modules are side-effect free; src/all.ts is the explicit full registration entry |
| React package | packages/react/src → packages/react/dist; @acmelabs/design-system-react |
| Inspector package | packages/devtools/src → packages/devtools/dist; @acmelabs/design-system-devtools; absent from normal production output |
| Documentation MCP | packages/mcp/src → packages/mcp/dist; @acmelabs/design-system-mcp; local stdio/versioned-doc retrieval |
| Consumer skills | skills/ authored guidance plus generated release-qualified references; validated with Intent and packaged with the matching release |
| Authored website | site/ replaces docs-src/; keep the existing Lit builder/router |
| Generated website | _site/ disposable, built and deployed by the verified Pages workflow |
| Icons | Pinned public artwork/license and generated catalog under assets/material-symbols/ and src/generated/icons/; explicit per-icon/family delivery |

The plan moved root CSS outputs to dist/styles without compatibility copies. Maps had to identify meaningful generator/authored input rather than an empty mapping to generated TypeScript. Generated CSS/Lit modules stayed committed because CI lacked the upstream corpus. Clean releases consumed reviewed committed inputs and checked producer/source fingerprints; this did not claim CI regenerated unavailable corpus data.

The original plan used root Bun workspaces for three additional packages and retained 0.2.0 during code migration. Release version selection/publication required separate registry verification; the local manifest alone could not establish unpublished status.

Later decisions give [core its own workspace](../../../docs/decisions/0020-core-workspace.md) after the reproducible incremental-install defect, then [separate browser delivery](../../../docs/decisions/0010-browser-distribution-package.md) after npm rejected the 185,977-file combined archive. Shared source remained in one tree. The [current producer/package map](../../../docs/agents/repository.md) owns maintained paths; the table above is the original plan.

## M00 — Close pre-implementation evidence

At the M00 stage, authorization covered research and scratch work only. Production edits depended on its prerequisite evidence. That completed stage is not a current permission boundary.

| Check | Required evidence | Pass condition |
| --- | --- | --- |
| CSS compiler/output | Representative generated CSS through the candidate compiler, generated Lit module and scoped document output | Correct escaping, nesting/scope, registrations/defaults/inheritance/conflicts, deterministic output, invalid input and useful maps; Chromium/Firefox/WebKit render expected results |
| Compiler choice | Comparison of the existing Bun CSS capability against requirements using source and executable evidence | One named/versioned tool with actual supported transforms/maps; no compiler package selected by assumption |
| State/property/metadata | Extend existing atomState/helper evidence to representative scalar/array/responsive and reset cases | One canonical store, correct declaration order/defaults, CEM/export/type agreement and no partial invalid transaction |
| Registry and semantics | Representative real-host inline/block/parent placement, native collection content and ARIA/form targets with the selected mixin/polyfill path | Correct late definition, scoped/global creation, adoption, labeling and submission in required engines |
| Motion/overlay/Group | Representative cancel/reopen/remove, both indicator axes, wrapped Stack separators and attached child focus/seams | Correct ownership and cleanup; no invalid interface hidden by a timer or display:contents |
| Package delivery | Selective HTML, Lit and React consumer fixtures plus native-content document CSS | No missing modules/styles, duplicate runtime/state engine, accidental full-library import or devtools/Solid/ELK inclusion in a small artifact |
| Pure-Bun release path | Inspect/probe authentication/provenance and workspace packing without publishing | Concrete supported release mechanism; no unverified claim that replacing node with bun preserves npm trusted publishing |

The M00 plan required fixtures, results and failures to be recorded. Technical failures were resolved within the approved interface where possible; a material interface/package revision required evidence. The [completion evidence](../../../docs/verification/systematization/m00-completion-2026-09-20.json) now verifies six representative technical areas. Peter selected Lightning CSS 1.33.0 through “A” on 2026-09-20. [Recorded selection](../../../docs/decisions/0104-style-production.md#compiler-selected-2026-09-20). M00 closed and enabled dependent slices within that approved migration. Full component acceptance and real Linux CI/registry trust verification remained assigned implementation/release checks, not claims made by these scratch probes.

## Implementation progress

- M00 is closed following Peter's compiler selection.
- M01 first slice: styles/house.css replaces the old source path; split and development watching consume it. The exact compiler dependency is installed. [Checks and baseline comparison](../../../docs/verification/systematization/m01-house-style-path-2026-09-20.json).
- M01/M02 are implemented and verified. Generated modules, canonical CSS/maps, input/output manifest, site/_site routing and document output are in place. All 128 static library CSS blocks enter the generator; the intermediate-part selector defect is fixed; reverse-parsing and the old formatter are removed. [Evidence and review](../../../docs/verification/systematization/m02-css-pipeline-2026-09-20.json).
- M03 is complete: analyzer metadata, class/definition/browser entries, production staging and private workspace skeletons pass review and fresh-consumer checks. [Manifest checkpoint](../../../docs/verification/systematization/m03-manifest-2026-09-20.json); [delivery closure](../../../docs/verification/systematization/m03-delivery-2026-09-20.json). Text Copy's dependency-closed removal was pulled forward from M04. The next scheduled work covered the remaining M04 closures; coupled replacements stay with their family batches. Final Linux publication/Pages settings remained M25, including removal of the frozen docs snapshot.

- M04-01 removes seven dependency-closed tags, four pages and eleven style entries; 142 source components remained. Retained styles are byte-identical; 656 tests pass. [Removal ledger](../../../docs/verification/systematization/m04-removals-2026-09-20.json). Remaining isolated and coupled removals stayed explicit.

- M04-02 removes six more isolated tags and 57 dedicated tooling artifacts. Retained generation inputs stay intact; 273 surviving CSS files are unchanged and 614 tests pass. The source count is now 136. Review approves the slice; example/style-owner closures remained.

- M04-03 closes 27 more retirement dependencies through retained examples, recipe/style cleanup and Toolbar ownership. M04 is complete: 109 components remained and eleven coupled implementations have explicit replacement owners in the [ledger](../../../docs/verification/systematization/m04-removals-2026-09-20.json). Final checks: 592 tests and all-engine composition checks pass. The next scheduled work was M05 shared mechanisms.

- M05-01 refines the existing canonical state helper and passes all-engine ordinary/compiled public-state checks, metadata checks and 604 tests. [Evidence](../../../docs/verification/systematization/m05-state-2026-09-20.json). The M05-02 headless appearance resolver also passes its focused unit, strict-type and three-engine checks; [evidence](../../../docs/verification/systematization/m05-appearance-2026-09-20.json). M05-03 implements canonical ordered inputs and responsive normalization; [evidence](../../../docs/verification/systematization/m05-styles-2026-09-20.json). Full style/HTML/renderer integration and theme scope remained. The [Lit helper-removal conflict](../../../docs/verification/systematization/m05-style-helper-lifecycle-2026-09-20.json) needs a bounded authoring-contract revision before the public directive is implemented. Group provider lookup/integration belongs to M07.

- M05-04 adds startup-only breakpoint configuration, the 77-property schema and responsive HTML conversion. The build/docs and 700 tests pass, with 137 successful browser checks per engine. [Evidence](../../../docs/verification/systematization/m05-responsive-inputs-2026-09-20.json). The helper cleanup decision was pending at this checkpoint and is resolved as explicit clearing on 2026-09-21.

- M05-05 delivers the full rem spacing/size catalog, removes both replaced numeric alias families, exports a freshness-checked token manifest and updates dev watching. Build/docs, 713 tests, 210 checks per engine, 114 page comparisons and a fresh packed consumer pass. [Evidence and migration map](../../../docs/verification/systematization/m05-numeric-tokens-2026-09-20.json). Theme scope and remaining style integration were still pending.

- M05-06 adds canonical headless theme resolution and reference-counted per-document system-preference observation. Build/docs and 732 tests pass; all 23 browser checks pass per engine after correcting a documented fixture transition race. [Evidence](../../../docs/verification/systematization/m05-theme-state-2026-09-20.json). DOM scope transport, scope CSS, registration and Theme Switcher replacement remained an atomic integration boundary.

- M05-07 fixes actual static stylesheet loss and first-render failures across documents without rewriting declarations. The public rendering-root boundary, owner-document cache and stable Lit anchor pass build/docs, 744 tests, real three-engine adoption/initialization checks and 114 unchanged page comparisons. [Evidence](../../../docs/verification/systematization/m05-stylesheet-adoption-2026-09-20.json). Nested theme transport and token-category integration remained.

- M05-08 implements initial style-input capture and responsive declaration planning using canonical TanStack ordered inputs. Capture preserves HTML/pre-upgrade order and synchronous detached state; the planner groups queries before applying authored property order. Independent review approves both modules. Build/docs and 762 tests pass; native fixtures pass 23 capture and 68 plan checks per engine. [Capture evidence](../../../docs/verification/systematization/m05-style-input-capture-2026-09-20.json), [plan evidence](../../../docs/verification/systematization/m05-responsive-style-plan-2026-09-20.json). Family accessors/manifest annotations and generated renderer delivery remained integration work. The public helper contract was pending at this checkpoint; Peter selected explicit clearing on 2026-09-21.

- M05-09 implements the explicit-clear directive/controller bridge and current JavaScript CSS-string processing. The helper uses actual-instance attachment rather than registry promises. Ownership survives reentrant publication and rolls back on failed grouped validation. [Helper evidence](../../../docs/verification/systematization/m05-explicit-style-helper-2026-09-21.json), [current CSS evidence](../../../docs/verification/systematization/m05-current-css-inputs-2026-09-21.json). Review, build/docs and 780 tests pass. The compiled helper passes 17 cases per engine; current CSS processing passes 22 cases per engine. Generated rendering, family accessors and root exports remained separate integration work. The bare Firefox/polyfill define-after-adoption failure is an [open registry-delivery return point](../../../docs/research/15-lit-practice-review.md#registry-delivery-return-point-first-definition-after-adoption), not a passing helper test.

## Ordered implementation work packages

M05 is complete at its shared-mechanism boundary on 2026-09-21. [Theme/package/website acceptance](../../../docs/verification/systematization/m05-theme-integration-2026-09-21.json), [appearance comparison](../../../docs/verification/systematization/m05-theme-comparisons-2026-09-21.json) and [responsive delivery](../../../docs/verification/systematization/m05-responsive-renderer-2026-09-21.json) record the results and native-platform limits. M07 onward owns actual family adoption; M10 owns final Theme Switcher composition/localization. The next scheduled work was M06 shared form, content, interaction and overlay lifetimes.

M06 is complete at its shared-mechanism boundary on 2026-09-21. [Implementation and native acceptance](../../../docs/verification/systematization/m06-shared-lifetimes-2026-09-21.json) records 843 passing tests, 56 checks per browser engine, initial failures and native controls. The shared controller/callback bridge, Field registration/naming, Places, Interaction and three overlay controllers are implemented. M10–M17 retain their assigned family integration and genuine autofill/history acceptance. M07 layout families were next; completion of shared mechanisms does not count those families as delivered.

The table records the original dependency order and atomic replacement boundaries. Work packages were planned as vertical commits, normally 3–8 authored files plus tests/generated/site output. Mechanical path/registration batches had explicitly broader bounds. These counts were planning ranges, not measured final diffs. Each replacement removed its old interface and updated internal consumers in the same slice, without compatibility exports or legacy modes.

| ID | Slices and concrete outcome | Dependencies | Estimated authored files per slice; generation |
| --- | --- | --- | --- |
| M01 | Generated-output path manifest and routing; authored stylesheet move; site source/output path routing and dev watcher | M00 evidence sufficient for selected paths | 4–8 plus mechanical imports/committed generated files; yes |
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

M04 covered dependency-closed clusters. Coupled families disappeared with their replacement: Code Block's old segmented-control consumer changed with M10 before its full M21 rebuild. Classes scheduled for deletion were not renamed. The [approved 150-tag map](../../../spec/component-coverage.md) and reverse-import/tag-use checks accounted for hidden documentation, template and test consumers.

M06 supplied shared behavior for dependent controls. M17 public families could move earlier when a consumer required them; this did not authorize a second private Dialog. React/documentation fixtures accompanied each slice. M22/M23 were completion audits, not deferred first checks.

## Per-slice acceptance and removal checks

The completed plan required six checks per slice:

1. One approved vertical outcome, with source evidence, generated styles and applicable HTML/Lit/React examples.
2. Adjacent tests, type/declaration checks and real browser outcomes for affected behavior.
3. The recorded batch order: bun run split, bun run build, bun run docs, bun test. Path changes were atomic and generation preserved unrelated work.
4. Reference-derived visuals had a migrated census with named differences; new families used explicit reference/behavior fixtures rather than invented zero-difference claims.
5. Removal searches covered source, imports, definitions, exports, manifests, docs inputs and tests. Consumer documentation described implemented APIs; historical notes/Git retained prior interfaces.
6. Generated-output determinism was recorded. Scoped commits required applicable authorization; tags, push and publication were not side effects.

Current verification procedure belongs to [verification guidance](../../../docs/agents/verification.md) and the installed brain workflow.

The plan required failures to be fixed at their cause without skipped tests or weakened thresholds. Broader checks followed changes or failures. Minimal production examples excluded the optional inspector and heavy graph/formatting assets.

## Publishing and completion

The plan required Pages to build from the documented package outputs before remote-source changes or old-path removal. The 2026-09-19 branch-/docs observation was a baseline, not proof of later remote settings. Local preparation and testing preceded separately authorized external actions.

Publication required explicit files/exports, exact matched versions, notices and verified Bun authentication/provenance. Planning and ordinary branch commits did not exercise release triggers. Consumer skills/MCP content had to match the packed release rather than the authoring checkout.

Completion required coverage of every approved source mapping, working exports/examples, complete replacements, supported-browser/accessibility/visual/behavior acceptance and optional-tool isolation. M00 prerequisites preceded dependent source changes within the already approved plan. Named actual-platform limits remained separate and explicit.

## M07 foundation completion — 2026-09-21

Separator, Box, Flex, Stack/HStack/VStack, Grid/Simple Grid and Group's layout/participation protocol are implemented. [Group boundary and package checks](../../../docs/verification/systematization/m07-group-2026-09-21.json) link the final foundation validation. The suite at this checkpoint passed 858 tests. The decorative Grid companions and ButtonGroup are removed.

Remaining assigned integration edges are mandatory: M09 adds action participation and verifies the actual painted border model; M10 adds Radio/Checkbox Cards and single-selection indicator composition; M11 adds input/add-on participation. No production member-matrix pass is claimed from the protocol fixture. The next scheduled work was M08 typography/formatting, then these family integrations. The local port-4180 server temporarily used no-watch mode to avoid concurrent generators. Normal watching was required again at migration completion; the M26 closure below records the final preview behavior.

### M08 completion — 2026-09-21

All eleven typography/formatting entries are implemented. [Typography evidence](../../../docs/verification/systematization/m08-typography-2026-09-21.json) records 883 passing unit/site/metadata tests, 21 basic and 26 detailed checks per engine, strict public types and four fresh packed-consumer checks per engine. [Formatter evidence](../../../docs/verification/systematization/m08-formatters-2026-09-21.json) covers localized byte data and number formatting. The full build and 93-page site pass with zero undocumented elements.

M16 owns final TOC use of the explicit heading-target protocol; M21 owns native Markdown content. M22/M26 were assigned to revisit the saved single-bundle Bun static-class/dynamic-definition import initialization reproduction. Split ESM works; no unproven upstream claim or compatibility alias is added. The next scheduled work was M09's icons and actions and actual Group member integration.

### M09 icon-delivery checkpoint — 2026-09-21

The complete pinned icon catalog and explicit per-icon/family modules are verified, with shared configuration and token-bootstrap entries. [Delivery evidence](../../../docs/verification/systematization/m09-icon-delivery-2026-09-21.json) records complete asset geometry, source clipping comparisons, unchanged public manifest facts, fresh package/CDN acceptance and 893 passing tests. Internal glyph replacement, Spinner, Button/Icon Button/Copy/Toggle and the R04 identity entries (Avatar/Avatar Group/Badge/Pill/Tag) remained in M09. Split Button's Menu composition belongs to M13 and Theme Switcher to M10. These explicit return points prevent R04 entries falling between the short batch headings.

### M09 action acceptance — 2026-09-21

[Button, Icon Button, Toggle Button and Copy Button](../../../docs/verification/systematization/m09-actions-2026-09-21.json) are implemented. Chip and old action aliases are removed with their callers. Native submitter ownership, canonical current values, attached Group surfaces, loading focus, clipboard lifetimes and optional ripple pass three-engine acceptance. Build/site and all 895 tests pass. Avatar/Avatar Group/Badge/Pill/Tag remained in M09. Split Button/Menu stays M13, Theme Switcher M10 and generated React wrapper reconciliation M22.

### M09 completion — 2026-09-21

[Identity acceptance](../../../docs/verification/systematization/m09-identity-2026-09-21.json) completes Avatar/Avatar Group/Badge/Pill/Tag. Combined with the preceding icon, Spinner and action records, all M09 entries are complete at their assigned boundaries. The final build/site and 894 tests pass. Each engine passes 24 source and compiled identity checks, with live documentation overflow/removal actions. Native image lifetimes, count limits, immutable keyed members, RTL marker order and real Pill hit geometry are verified. Old service/username/avatar-size and Badge/Pill alias interfaces are removed. Reference-only style producers now retire their own recorded outputs safely. The next scheduled work covered M10 with the [failing Checkbox baseline](../../../docs/verification/systematization/m10-checkbox-baseline-2026-09-21.json). Final whole-library appearance, accessibility, React/package acceptance and the two preserved platform limits remained M22/M26.

### M10/M11 integration return points — 2026-09-21

Checkbox now consumes NativeFormController and the shared semantic owner, which targets the actual input. Its verification preceded Checkbox Group/cards and the other selection families.

- Switch integration required ripple cancellation to stay scoped to the ripple. The current Ripple controller owns the only animation on an action/Checkbox host; its AnimateController.cancel must not cancel an independent thumb transition on that same host. The combined case required verification with Switch.
- M11 Field integration was required to supply names/descriptions through the semantic owner's defaults/reference inputs. The M06 FieldAssociation helper currently writes DOM references directly; its adaptation had to avoid competition with the semantic controller on one native control and retain lifecycle/ownership tests.
- Readonly belongs to AcmeReadOnlyFormElement for native text-like controls. Checkbox consumes AcmeFormElement and exposes no meaningless readOnly property.

### M10 standalone Checkbox slice — 2026-09-21

[Verified Checkbox behavior](../../../docs/verification/systematization/m10-checkbox-progress-2026-09-21.json) replaces the old per-component form handling and handwritten check/dash artwork. Build/site and 897 tests pass. Native and compiled checks pass in all engines, including actual Chromium accessibility naming, unchanged Button/ripple regressions and live form examples. The new unchecked border is a measured accessibility deviation using existing gray-700. The next scheduled work covered Checkbox Group/Card integration and the remaining M10 families; this slice does not close M10. The Firefox native label-collection behavior is recorded with a bare-element reproduction and a validated naming guard.

### M10 Checkbox Group/Card slice — 2026-09-21

[Group/Card acceptance](../../../docs/verification/systematization/m10-checkbox-group-card-2026-09-21.json) completes Checkbox ownership and card integration. Build/site and 907 tests pass. Each engine passes 40 source and compiled checks, plus five live documentation interactions. Conditional forwarded slots, owner removal, independent stateful actions, native input observer timing, current/default semantics, actual joined surfaces and name/description separation have explicit regressions. The next scheduled work covered Radio/Radio Group/Radio Card, then remove coupled Choicebox consumers. The registered-member mechanism and shared appearance fallback are reusable; no Radio, Switch, Tabs or indicator completion is implied.

### Radio / Toolbar integration return point — 2026-09-21

M10 introduces explicit keyboard-collection and Toolbar-delegation helpers. A radio collection inside a Toolbar yields arrow ownership and does not change selection. M15 was required to register its actual Toolbar root, expand registered collection targets, own the sole tab-entry model and consume delegated arrows even when native radio defaults were prevented. The bare-Toolbar protocol fixture is a prerequisite, not completion of the actual Toolbar integration. The M15 gate included independent actions, editing controls, RTL/vertical direction, edges and nested collections.

The M10 internal selection indicator needs explicit private definition delivery. The private element had to remained available to owning families without becoming a public selection component or undocumented consumer tag. Its generator/manifest boundary required verification because the pipeline then had only public component records.

### Exact-parity census scope for rebuilt controls — 2026-09-21

Under the approved systematization goal, these rebuilt interfaces leave the old one-to-one page sweep. Historical census files and diff rules remained historical evidence; no old-template mismatch is reclassified as a passing comparison. The listed acceptance records replace that page-shape oracle. M26 still owns the complete integrated appearance review.

| Elements | Named differences and retained baseline | Current verification |
| --- | --- | --- |
| Button, Icon Button, Toggle Button, Copy Button | Selected blue state roles; current parts/slots; native action ownership; separate toggle semantics; private clipboard feedback. Source action tier geometry remained. | M09 action geometry, contrast, native forms, source/compiled fixtures and live docs |
| Avatar, Avatar Group, Badge, Pill, Tag | Explicit image sources and immutable members; current size/slot names; accurate overflow; selected label roles. Avatar and Badge/Pill tier geometry and Badge palettes remained source baselines. | M09 identity image/lifetime/count/geometry fixtures and generated metadata |
| Spinner, Icon Tile | Current sizes/parts; Lit Motion lifetime; named/decorative status ownership. Source blade geometry remained. | M09 Spinner/Tile and complete icon delivery records |
| Checkbox, Checkbox Group/Card | Selected blue mark and measured gray-700 control boundary; one current/reset owner; native naming and a 24px label hit surface in this family; separate card actions. Card structure/spacing references Chakra with selected tokens. | M10 Checkbox and Group/Card native/compiled/forced-colors checks |
| Radio, Radio Group/Card | Selected blue state roles; native form/tree name scopes; one scalar owner; APG/RTL navigation; separate card actions. The 16px/8px medium mark baseline remained. | M10 Radio and paired native-platform fixtures |
| Choicebox, Choicebox Item | Removed outright. | Retired tags/exports/styles absent; replacement collection/card tests |

These are explicit per-element sweep dispositions, not exemptions from the approved behavior, accessibility, geometry or final visual gates. The 24px hit surface is a control-family implementation choice; it does not impose a new library-wide normal-density policy.

### M10 Radio family slice — 2026-09-21

[Radio acceptance](../../../docs/verification/systematization/m10-radio-2026-09-21.json) closes Radio, Radio Group and Radio Card at their assigned boundary. Build/site and 900 tests pass. Source/compiled native checks, paired native-radio controls, forced colors, metadata, live forms/cards and the Checkbox Group/Card regression all pass. Choicebox is removed. The next scheduled work covered the shared internal indicator and Segmented Control before reusing acme-switch for binary Switch; then Tabs and Theme Switcher. Actual Toolbar integration remained M15 as stated above.

### M10 shared indicator checkpoint — 2026-09-21

[Private delivery and spring indicator](../../../docs/verification/systematization/m10-selection-indicator-2026-09-21.json) pass source and compiled acceptance in all three engines, build/site and all 906 tests. Private definitions register through public owners; the standard analyzer's internal-class omission is preserved and private modules are excluded from consumer metadata. Both Material motion schemes have numeric role tokens and a verified Lit Motion parameter mapping. Segmented Control, binary Switch, Tabs and Theme Switcher integration remained next. This checkpoint did not close M10.

### M10 Segmented Control and Switch — 2026-09-21

[Combined acceptance](../../../docs/verification/systematization/m10-segmented-switch-2026-09-21.json) records Segmented Control/Item and binary Switch, migrated Code Block/forms/docs callers, native/compiled checks and the retained Radio/Checkbox/Group/action regressions. Final selected-outline build, source/compiled and light/dark contrast checks pass. Tabs and Theme Switcher were still required to close M10. The parent reset and barred-control validity fixes are shared mechanisms verified through real consumers. Tabs retained the inset indicator's selected-state contrast requirement.

### M10 Theme Switcher — 2026-09-21

[Acceptance](../../../docs/verification/systematization/m10-theme-switcher-2026-09-21.json) completes the application-owned appearance picker through actual Segmented Control/Group/indicator composition. Build/site, 900 tests, 18 Chromium and 17 Firefox/WebKit source/compiled checks, three live scoped examples and the application header pass. Tabs is the final M10 family; M11–M26 followed afterward.

### M10 Tabs implementation and M22 return point — 2026-09-21

[Tabs acceptance in progress](../../../docs/verification/systematization/m10-tabs-2026-09-21.json) includes native relationship scope, controlled templates and scrolling. The named gates were still required before M10 closure. M22 was required to provide framework-owned React mounting/reconciliation using the same canonical panel activation state; it could not clone/reparent ordinary React children or use a second selection store. Lit/HTML renderer acceptance alone does not close that adapter gate.

### M10 completion — 2026-09-22

[Tabs acceptance](../../../docs/verification/systematization/m10-tabs-2026-09-21.json) closes the final M10 family. Build/site, 897 tests, source and compiled three-engine checks, actual documentation interactions and both appearance contrast checks pass. All M10 controls, selection owners/cards, the private indicator, Segmented Control, binary Switch, Tabs and Theme Switcher are complete at their assigned boundaries. The next scheduled work covered M11 with Field/Fieldset/Label and the text-control family. The named M14/M22/M26 integration gates remained separate; this batch did not close them.

### M11 Fieldset native container and M22 return point — 2026-09-22

[Implementation evidence](../../../docs/verification/systematization/m11-fieldset-2026-09-22.json) selects the actual native light-DOM ancestor. Compiled/site/full-suite acceptance was still pending at this checkpoint. M22 was required to use x-acme-native-root to render one stable native child before the custom host connects; React's child reconciliation then retains its own DOM parent. Ordinary HTML/Lit ranges are preserved without cloning. Structural reconciliation remained distinct from synchronous disabled-property effects.

### M11 Fieldset acceptance — 2026-09-22

[Fieldset acceptance](../../../docs/verification/systematization/m11-fieldset-2026-09-22.json) passes build/site, 898 tests, native and compiled checks in all engines, real React parent ownership and live form/first-legend actions. The next scheduled work covered Label/Field, then text controls and the optional managed-form adapter. The M22 native-root renderer contract remained mandatory. The current Disabled Wall gets its separate documentation page; its C-05 behavior rebuild belongs to the M14 surface batch. Toolbar belongs to M15, as the batch table specifies; earlier integration-return-point references have been corrected.

### M11 Label acceptance — 2026-09-22

[Label acceptance](../../../docs/verification/systematization/m11-label-2026-09-22.json) completes the native label, exact/implicit association and actual-control focus bridge. Build/site, 897 tests, source/compiled three-engine checks and live activation examples pass. Slider owns its retained label stylesheet until M13; it no longer imports the removed Label styles. The next scheduled work covered Field, then the text controls and managed-form adapter.

### M11 Field acceptance — 2026-09-22

[Field acceptance](../../../docs/verification/systematization/m11-field-2026-09-22.json) passes build/site, 901 tests, native/compiled checks and live form actions. It reuses the registry/association and canonical NativeFormController. The next scheduled work covered the text-control family, Clearable Input removal and the managed-form adapter. New text controls were required to register through this Field path rather than duplicate label/help/error presentation.

### M11 text and managed-form acceptance — 2026-09-22

Input, Search, Password Input and Textarea use the shared native string owner, Field semantics and Group attachment. Clearable Input and control-owned label/error interfaces are removed; examples use Field and the clearable Input action. Slider's retained numeric entry uses the new text Input with decimal input mode; M13 replaces its composition with Number Input as assigned. Managed forms use a typed field-store binding with subscription cleanup and separate Field error presentation. [Final text/managed-form acceptance](../../../docs/verification/systematization/m11-text-controls-2026-09-22.json) closes M11: strict package build, site and all 896 tests pass; every engine passes 38 source/compiled text checks, ten source/compiled managed-form checks and seven live documentation flows. The next scheduled work covered M12.

The build now enforces strict TypeScript. The final audit found widened getter types and cyclic controller inference in M10/M11; explicit types correct them. The six M10 files produce identical JavaScript before and after these type corrections. No old interface is restored.


### M12 Number Input acceptance — 2026-09-22

[Number Input acceptance](../../../docs/verification/systematization/m12-number-input-2026-09-22.json) completes the number family: strict build, site, 906 tests, 44 source/compiled checks per engine and five live documentation flows. Native/managed form contracts, standard locale formats, decimal-safe steps, optional action parts and hold cleanup are implemented. The source-derived decimal loop and binary modifier-step drift are replaced with bounded decimal operations. The next scheduled work covered Pin Input to close M12.


### M12 complete — 2026-09-22

[Pin Input acceptance](../../../docs/verification/systematization/m12-pin-input-2026-09-22.json) closes M12 alongside Number Input: strict package build/site and 916 tests pass. Each engine passes 32 source/compiled Pin checks, four source/compiled managed-form checks and five live examples. Shared manifest reference identity is now normalized once. The next scheduled work covered M13 with the verified slotted-overlay coordination correction.

## M13 Menu family and Split Button complete — 2026-09-22

[Menu / Context Menu / Split Button acceptance](../../../docs/verification/systematization/m13-menu-2026-09-22.json) closes these assigned family entries: strict package build, site and all 905 tests pass. Each engine passes 30 source/compiled Menu checks, four source/compiled Split Button checks and six live documentation flows. Native shadow comparisons cover the three selected tiers in light/dark. Menu Button/Divider and the old Split Button interfaces are removed; Code Block and the authored examples use the replacements.

M13 remained active for shared Option, Select/ComboBox/Multi Select, Slider and Calendar. [Selection preparation](../../../docs/verification/systematization/m13-selection-preparation-2026-09-22.json) records current source/docs review and three-engine native input/button reference candidates; it does not claim component acceptance. The complete pinned Material Web Select comparison is recorded; fixtures remained under /tmp/acme-m13-selection. That stage proceeded under the then-scoped execution delegation. The completed grant is not current authorization.


## M13 selection replacement in verification — 2026-09-22

Select, ComboBox and Multi Select now share Option, native form ownership, popup placement/presence, keyboard/typeahead and generated field/list styling. Code Block uses Option children. ComboBox uses the published match-sorter package and manual slot projection; its authored node order remained stable through ranking and Lit keyed updates. Root-owned trigger content preserves native accessible relationships. The evidence-driven contract corrections are in the [execution resolutions](../../../docs/decisions/0035-execution-delegation.md) and F-06. The old ComboBox Option, Multi Select Row, local scorer and old selection maps/styles are removed. Source browser checks pass; package/site/compiled verification was still running. Number/Pin/Menu also share the tested slot-owner transfer helper. This checkpoint did not close the slice or M13; the later final acceptance below did.


## M13 selection family complete — 2026-09-22

[Acceptance](../../../docs/verification/systematization/m13-selection-2026-09-22.json) closes Option, Select, ComboBox and Multi Select at the assigned native/Lit boundary. Strict package build, 96-page site and all 881 tests pass. Source and compiled native checks cover forms, keyboard, projection, lifecycle, custom trigger content and caller migration. Actual Lit/React keyed child identity and Chromium accessibility order are verified. Code Block and Feedback now use Option children; renderer comments do not contaminate derived labels. Number/Pin/Menu slot ownership fixes pass native regressions. Slider and Calendar remained active in isolated worktrees; M13 was not complete at that checkpoint.


## M13 Slider complete — 2026-09-22

[Slider acceptance](../../../docs/verification/systematization/m13-slider-2026-09-22.json) records the strict build/site and all 883 tests, 44 source/compiled native checks per engine, six documentation flows and resolved independent review findings. Middle Truncate consumes the array value and live event. Calendar and date-runtime correction remained; the next work used the isolated Calendar worktree.

## M13 complete — 2026-09-23

[Calendar acceptance](../../../docs/verification/systematization/m13-calendar-2026-09-23.json) closes the final M13 family. The strict package build, 96-page site and all 900 tests pass. Each engine passes 28 source and compiled checks, six visible documentation flows and fifteen shared-overlay regressions. The corrected date runtime, generated styles, native form model, modal focus containment and frame-scheduled placement are integrated. M13 is complete at its assigned boundaries; M22/M26 retain actual platform, React and final release gates. The next scheduled work covered M14 with Disabled Wall, native List/Data List, Card/Inset/Item, Scroll Area and Resizable.

## M14 native-content and Disabled Wall slice — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m14-native-content-2026-09-23.json) closes C03–C05 at their native/Lit boundaries. Build/site, 902 tests, seven source/compiled checks per engine and all three documentation pages pass. Description is removed. The next scheduled work covered Card/Inset/Item, then Scroll Area and Resizable; M14 was not complete at that checkpoint.

## M14 Card/Inset/Item slice — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m14-surfaces-2026-09-23.json) closes C01/C02/L06 at their assigned boundary. The package/site and all 906 tests pass; source/compiled geometry and real documentation interactions pass all three engines. Explicit logical Inset edges replace the ambiguous draft. Scroll Area and Resizable are the two remaining M14 families.

## M14 Scroll Area slice — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m14-scroll-area-2026-09-23.json) closes L08 at its native/Lit boundary. Build/site and all 909 tests pass; seventeen source/compiled cases per engine include an actual TanStack Virtual consumer, keyboard/wheel/drag, ownership and cleanup. The documentation actions and custom-bar appearance pass. Scroller is removed. Resizable is the only remaining M14 family.

## M14 complete — 2026-09-23

[Resizable acceptance](../../../docs/verification/systematization/m14-resizable-2026-09-23.json) closes L09 and M14 at their assigned boundaries. Build/site, 926 tests, 23 source/compiled checks per engine, actual documentation and Chromium accessibility inspection pass. Forty repeated WebKit mounts pass after correcting the global reduced-motion rule; the unsuccessful styling experiments are removed. The next scheduled work covered M15. The remaining N12 scope included every control, not only Show. N08 Command Menu depends on the public Dialog family, so that M17 slice moved before Command Menu and recorded its own completion without a second dialog engine.

### M15 disclosure slice complete — 2026-09-23

[Disclosure acceptance](../../../docs/verification/systematization/m15-disclosure-2026-09-23.json) closes N09 and N12 at their assigned boundaries. Accordion/Collapsible replace Collapse/Collapse Group; Show controls explicit content lifetimes; Show More and Load More share native action behavior. Tab Panel reuses the same owned-content helper. The newly reproduced focus-token defect in M14 controls is corrected in the authored producer. Build/site, 926 tests and all-engine source/compiled/documentation checks pass. The next scheduled work covered Steps/Timeline and the remaining M15 navigation families.

### M15 Steps and Timeline complete — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m15-steps-timeline-2026-09-23.json) closes N10/N11 at their assigned boundaries. Strict build/site, 932 tests, sixteen source/compiled checks per engine and actual documentation flows pass. Steps uses the documented value=count completion state and application validation requests; Timeline is descriptive ordered content. The next scheduled work covered Toolbar/App Bar/Breadcrumbs, then Dialog before Command Menu.

### M15 navigation slice complete — 2026-09-23

[Navigation acceptance](../../../docs/verification/systematization/m15-navigation-2026-09-23.json) closes N01/N02/N05 at their assigned boundaries. Appbar is replaced by App Bar and its explicit regions; Toolbar integrates the M10 Radio/Segmented delegation contract; Breadcrumbs owns navigation only. The docs header consumer and Command Menu page-stack consumer are updated together. Strict build/site, 934 tests, thirteen source/compiled checks and seven documentation flows per engine pass. API table overflow is fixed in the site generator. The next dependency sequence brought Dialog/Alert Dialog forward from M17 before N08 Command Menu.

### Native-dialog dependency order — 2026-09-23

O01/O02/O03 (Dialog, Alert Dialog and Drawer) moved forward together before M15 Command Menu completion and M16 Sidebar. The then-current Drawer/Sheet imported Modal helpers; Sidebar explicitly composes the new Drawer. This ordering let one verified slice remove those old implementations outright. Tooltip/Hover Card/Toggle Tip remained the later M17 remainder.

### O01/O02/O03 brought-forward slice complete — 2026-09-23

[Native-dialog acceptance](../../../docs/verification/systematization/m17-native-dialogs-2026-09-23.json) closes Dialog, Alert Dialog and Drawer at their assigned boundaries. Strict build/site, 919 tests, 27 source/compiled checks per engine, actual documentation flows and shared regressions pass. Modal, Modal Inset and Sheet are removed; Drawer uses the new interface. The next scheduled work covered M15 Command Menu, then M16 Sidebar/TOC/Tree. The remaining M17 help families were still open at that checkpoint.

### M15 complete — 2026-09-23

[Command Menu acceptance](../../../docs/verification/systematization/m15-command-menu-2026-09-23.json) closes N08 and M15. Strict build/site, 915 tests, sixteen source/compiled checks per engine, real documentation and ComboBox regressions pass. The earlier slices close N01/N02/N05/N09/N10/N11/N12. The next scheduled work covered M16 with the already verified Drawer dependency.


### M16 TOC acceptance — 2026-09-23

[TOC evidence](../../../docs/verification/systematization/m16-toc-2026-09-23.json) closes N04 at its native/Lit boundary. Explicit entries, registered Heading discovery, native fragments/focus and configurable scrolling pass source and compiled checks in all engines. The site fragment handler now preserves component navigation. Sidebar and core Tree remained M16 work; actual platform/React/final acceptance remained M22/M26.


### M16 Sidebar acceptance — 2026-09-23

[Sidebar evidence](../../../docs/verification/systematization/m16-sidebar-2026-09-23.json) closes N03 at its native/Lit boundary. The shared Drawer, separate desktop/mobile state, explicit compact content and node-preserving slot projection pass all-engine source, compiled and documentation checks. Core Tree remained M16 work.


### M16 complete — 2026-09-23

[Tree View acceptance](../../../docs/verification/systematization/m16-tree-view-2026-09-23.json) closes N06 and M16 with the prior TOC/Sidebar slices. Data-driven hierarchy, keyed author content, native links, selection/expansion/focus and Sidebar composition pass all engines. File Tree/Folder/File are removed, including their style producers. The next scheduled work covered the M17 help families; O01/O02/O03 are already complete.


### M17 complete — 2026-09-23

[Help acceptance](../../../docs/verification/systematization/m17-help-2026-09-23.json) closes O04/O05/O06; the earlier native-dialog acceptance closes O01/O02/O03. Shared native presence, anchored geometry, motion, descriptions, focus and explicit interactive help pass source/compiled checks in all engines. Context Card and all legacy Tooltip producers are removed. The next scheduled work covered M18; actual platform/React/final package gates remained M22/M26.


### M18 message surfaces — 2026-09-23

[Alert/Banner acceptance](../../../docs/verification/systematization/m18-messages-2026-09-23.json) closes M-01. Shared inputs, explicit live semantics, native actions and application-owned dismissal pass all engines. Note and old Banner producers are removed. M18 display families, scoped Toast and Feedback remained.


### M18 passive display surfaces — 2026-09-23

[Empty State/Status acceptance](../../../docs/verification/systematization/m18-passive-displays-2026-09-23.json) closes M-04/M-08 at their assigned native/Lit boundaries. Composed empty content, application-defined status and owned pulse lifetime pass all engines. Default-attribute and documentation-coverage discoveries have concrete M26/M25 return points. The next scheduled work covered Progress/Skeleton/Meter, Stat, Toast and Feedback.


### M18 measurements — 2026-09-23

[Measurement acceptance](../../../docs/verification/systematization/m18-measurements-2026-09-23.json) closes Progress/Skeleton/Meter and revalidates the shared Spinner/Status motion lifetime. Known zero, missing/loading values, finite ranges, native semantics, RTL and the named contrast deviation pass the assigned checks. M18 Stat, Toast and Feedback remained.


### M18 Stat family — 2026-09-23

[Stat acceptance](../../../docs/verification/systematization/m18-stat-2026-09-23.json) closes M-07 at its native/Lit boundary. Native terms/definitions, explicit direction/sentiment, formatting, loading ownership and selection composition pass the assigned checks. Trend and the abbreviated Stat helpers are removed. M18 scoped Toast and Feedback remained.

### M18 scoped Toast — 2026-09-23

[Toast acceptance](../../../docs/verification/systematization/m18-toast-2026-09-23.json) closes M-02 at its native/Lit boundary. Explicit stores, timer lifecycle, announcements, gestures, focus and author-owned content pass the recorded gates. Toaster/global queue and standalone Error are removed with their producers and consumers. Feedback is the remaining M18 entry.

### M18 completion — 2026-09-23

[Feedback acceptance](../../../docs/verification/systematization/m18-feedback-2026-09-23.json) closes M-03 and M18. All eight message/statistics entries are implemented and verified at their assigned native/Lit boundaries. The old Feedback network/popup interface and style producers are removed. The next scheduled work covered M19: native author-owned Table, coordinated results Pagination and complete consumer-owned TanStack Table/Virtual examples.

### M19 completion — 2026-09-23

[Table/Pagination acceptance](../../../docs/verification/systematization/m19-table-pagination-2026-09-23.json) closes M19 at its assigned boundaries. Native content, generated scoped CSS, coordinated result controls and both framework-owned consumer renderers pass source/compiled/fresh-package checks. The required feature combinations, 10,000-row virtualization and real experimental-worker lifecycle are recorded with their limits. Old data-driven Table and documentation-link Pagination interfaces and producers are removed. The next scheduled work covered M20: Chart, Sparkline, Legend and Flow Diagram.

### M20 chart families — 2026-09-23

[Chart/Sparkline/Legend acceptance](../../../docs/verification/systematization/m20-chart-sparkline-legend-2026-09-23.json) closes D-03/D-04 at the native/Lit boundary. The typed engine, exact-value alternative, safe point information, theme contrast and primitive compositions pass the recorded gates. Spark and old Chart/Legend interfaces/producers are removed. Flow Diagram remained M20 work.

### M20 Flow implementation checkpoint — 2026-09-23

[Flow Diagram evidence](../../../docs/verification/systematization/m20-flow-diagram-2026-09-23.json) records the viewer, worker delivery, package assets, normal/isolated compiled matrix and tested geometry sizes. One rapid-cancellation/navigation Firefox DOM-worker crash remained a final release gate. Independent M21 work may proceed; M26 required a resolution or an exact external-platform finding with an explicit supported-runtime disposition. This is not a passing final M20 acceptance.

### M21 Browser and Snippet — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m21-snippet-browser-2026-09-23.json) closes RC-02/RC-06 at the native/Lit boundary. Source and compiled checks pass seven cases per engine, live documentation passes, and all 870 unit tests pass. Shared Scroll Viewport key handling is verified across physical arrows, RTL boundaries and descendant input isolation. Code Block, JSON View, Markdown, Book and Video remained.

### M21 Code Block — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m21-code-block-2026-09-23.json) closes RC-01 at the native/Lit boundary. Exact source, application-owned references, keyboard focus recovery, scrolling/wrapping, failure fallback and author content pass source/compiled checks in all engines. Live examples and the typography consumer are migrated; strict build/site and 866 tests pass. The next scheduled work covered RC-03/04/05/07.

### M21 JSON View — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m21-json-view-2026-09-23.json) closes RC-03 at its native/Lit boundary. Descriptor snapshots, safe markers, real owned groups, iterative deep rendering, expansion preservation, keyboard/RTL and cross-document data pass the recorded gates. The package/site build and all 864 tests pass. Markdown, Book and Video remained.

### M20 current Firefox acceptance — 2026-09-23

[Official Firefox156.0.1 evidence](../../../docs/verification/systematization/m20-flow-diagram-2026-09-23.json) closes the Flow component release concern for the current supported browser: twenty timing-varied reconnect/cancel/navigation cycles pass using the unmodified, checksum/signature-verified release. The same sequence crashes the older Playwright-patched Firefox155. Its exact cause remained unverified. This became an M25/M26 test-runtime constraint: both reproductions and the official-browser gate remained, without a speculative library workaround or omitted regression. M20 is complete at its assigned native/Lit boundary.

### M21 Markdown — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m21-markdown-2026-09-23.json) closes RC-04 at the native/Lit boundary. Native prose, TOC/fragments, scoped IDs/styles, shared highlighting/scrolling, trust/failure behavior and live labels pass the recorded source/compiled/docs gates. The complete suite passes 867 tests. Book and Video remained in M21.

### M21 Book — 2026-09-23

[Acceptance](../../../docs/verification/systematization/m21-book-2026-09-23.json) closes RC-05 at its native/Lit boundary. Nine source/compiled cases per engine, six browser distributions, fresh package, live docs, strict build/site and all 859 tests pass. Motion regressions and WebKit resize notification feedback are resolved. Book’s image and Flow’s worker share verified file-asset delivery. Video is the remaining M21 entry.

### M21 Video and content batch closure — 2026-09-23

[Video acceptance](../../../docs/verification/systematization/m21-video-2026-09-23.json) closes RC-07 and M21 at their native/Lit boundary. Source, compiled and fresh packed consumers pass twelve cases per engine; real autoplay rejection, framework-owned tracks, live docs, strict build/site and 854 tests pass. The next scheduled work covered M22 generated React wrappers, including the native Video portal and existing native-content metadata.

### M22 React package complete — 2026-09-23

[React acceptance](../../../docs/verification/systematization/m22-react-2026-09-23.json) closes the generated browser-wrapper and final native-content boundary. All 4,319 wrappers and 741 declared defaults are verified. Thirteen wrapper and nineteen real Table/Virtual/Worker cases pass per engine; fresh package/type checks and all 860 tests pass. The same Lit stores, selection, form and motion behavior remained authoritative. The next scheduled work covered M23; the stated global-registry wrapper contract does not close M26’s separate core scoped-registry or actual-platform gates.

## M23 documentation complete — 2026-09-26

[Acceptance](../../../docs/verification/systematization/m23-documentation-2026-09-26.json) closes the seven documentation units, complete API/Markdown projection, explicit source/lifecycle/reset/error handling, fifteen recipe families and persistent/mobile navigation. The full build, strict root types and all 906 tests pass. Thirteen recipe outcomes pass in each engine; source-copy and native accessibility regressions are retained. The next scheduled work covered M24 consumer tools and M25 toolchain/package integration. The Bun incremental-install root-package defect and final actual-platform checks retain their later owners; no publication or push occurred.

## M24 consumer tooling implemented — 2026-09-26

The coordinated 0.3.0 packages contain seven versioned consumer skills, seventeen recipe families, a local documentation MCP and an optional read-only inspector. The website, Markdown, skills and MCP derive their contracts and source examples from the same manifest and authored records. The full TanStack Devtools application shell stays out of production core; the optional inspector has a separate verified bundle. Six independent skill artifacts retain their original grades and explicit supplemental checks. No statistical superiority is inferred from that small sample. [Consumer evidence](../../../docs/verification/systematization/m24-consumers/acceptance-2026-09-26.json), [skill evaluation](../../../docs/verification/systematization/m24-skills/iteration-1/README.md), [managed forms](../../../docs/verification/systematization/m26-managed-forms/README.md). The final combined archive run is M26's remaining integration gate.

## M25 local toolchain and release gates implemented — 2026-09-26

Oxlint/Oxfmt/Ultracite and Stylelint replace Biome. The complete source check passes, with scoped policy regressions and a separate verified mechanical formatting commit. Bun 1.4.2 is pinned and preserved in child commands. The coordinated archive record distinguishes clean committed source from a dirty local candidate; dirty candidates cannot publish. The release route passes local cryptographic checks and real read-only verification of existing public provenance. [Tooling](../../../docs/verification/systematization/m25-tooling/README.md), [release evidence and limits](../../../docs/verification/systematization/m25-release/README.md).

The quality workflow includes durable component fixtures, generated React and package consumers, documentation, managed forms, actual Input history restoration and the official Firefox navigation regression. The old patched Firefox 155 failure remained recorded; its isolated page-render checks do not replace the mandatory official 156 sequential and Flow checks. Publication and Pages remained disabled. Linux execution, new trusted-publisher configuration, live OIDC/new signing and deployment are not established by local verification.

## M26 final combined acceptance in progress — 2026-09-26

The final inventory audit accounts for all 91 approved entries, seven documentation units, 150 original tags and thirty extensions. Runtime corrections cover scalar default removal, scoped dependency registration and document adoption, native imperative creation, Tabs indicator paint and single-bundle initialization. Consumer corrections complete worker declaration setup and both nested/array managed-form examples. Documentation now covers all 4,319 elements across 125 pages. Real font and phone layout checks are recorded separately from fallback-font page checks.

All 960 unit tests, strict types, lint/format/style checks and the 640-package vulnerability audit pass. The shared committed rebuild reproduces generated files without drift. Four clean-source 0.3.0 archives are prepared from c9eabeece. The shared browser run executes all 23 invocations before aggregating failures; its final result remained pending. [Full audit and platform limits](../../../docs/verification/systematization/m26-audit/final-runtime-review.md), [scoped creation](../../../docs/verification/systematization/m26-scoped/README.md), [bundles](../../../docs/verification/systematization/m26-bundle/README.md), [history](../../../docs/verification/systematization/m26-native-forms/README.md), [appearance](../../../docs/verification/systematization/m26-appearance/README.md).

Actual OS input/autofill, Safari/assistive technology and OS background-window behavior remained explicit unperformed checks. External publication, Pages migration and removal of the frozen published snapshot require their separate authorized release boundary. These limits are not waived by automated passes.

### M26 local acceptance complete — 2026-09-26

[Final acceptance](../../../docs/verification/systematization/m26-final/README.md) closes the implementation and local automated boundary. The final unit suite passes 963 tests. The clean committed rebuild has no generated drift. All required browser invocations are accepted: the initial sequence passed 22 of 23, and the one corrected Intent-reference oracle passed its complete targeted rerun against the identical archives. All 1,446 component results, managed forms, history, scoped/package delivery, official Firefox and consumer-tool records pass. The recorded rerun is explicit; the initial command's failure is preserved.

The developer preview now watches examples and rejects encoded traversal. Actual-platform and external release gates above remained unperformed. They are not implementation tasks silently deferred from this pass and are not waived. No push, publication or deployment occurred.

### Authorized release delivery — 2026-10-20

Peter's release request authorizes the external delivery work. All five 0.3.1 packages are public and cryptographically verified. Public CDN component and Flow worker checks pass in Chromium, Firefox and WebKit. The reviewed Pages workflow deploys successfully, and all 25,120 public files match. Browser acceptance then identifies development dependencies. The [0.3.2 correction](../../../docs/releases/0.3.2.md) selects production dependencies and updates the MCP SDK and two HTTP dependencies for new audit advisories. At that release checkpoint, corrected public acceptance was still required before snapshot retirement.

The corrected 0.3.2 release passes all package, CDN and public Pages checks. All 25,120 site files match the reviewed artifact. The three-engine browser matrix includes exact headings, mobile navigation, diagram layout, Add step and actual worker closure. PR #6 removes the 244-file snapshot after independent review and complete CI. Its merged tree equals the tested tree, and its entire site artifact equals the accepted public output. At closure, version 0.3.2 was stable/latest on GitHub. The original tags and archives remained unchanged. [Final closure](../../../docs/verification/releases/0.3.2/closure.json).

PR #4 merges the declaration-order correction after full Linux acceptance. Two independent verified Linux builds of the same source tree produce byte-identical archives for all five packages. The published version and tag remained immutable. The actual-platform limits above remained unperformed and explicit.

## Scope of this completed record

The dated checkpoints retain their original test counts, failed runs and remaining work at that date. They do not override the current handoff. The [maintainer-workflow specification](../../../spec/SPEC-maintainer-workflow.md) carries the later Chromium Hover Card baseline failure. Historical release success does not close it. Actual OS IME/dictation/autofill, actual Safari/assistive technology and OS background-window behavior remain explicitly unperformed; this conversion supplies no new runtime evidence or outward-action permission.
