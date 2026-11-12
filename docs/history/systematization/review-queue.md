# Completed systematization review and execution queue

Status: Completed pass history; open verification follow-ups have separate issue owners.

## Scope and interpretation

The queue records thirteen review groups, six engineering areas and completed implementation/release work. The release results retain their exact scope and dates. A later records commit has a Chromium Hover Card failure with an unverified cause. Actual-platform verification and credential rotation remain open issues; the completed queue is not a new execution plan.

The dated findings below retain their source versions, measurements, corrections and verification limits. Old phase gates, source freezes, local-skill routing and task-specific permission grants describe the completed pass. They do not govern new work. The [current handoff](../../../docs/STATUS.md) owns the next action.


The [central handoff](../../../docs/STATUS.md) owns current status. The [inventory index](../../../spec/SPEC-design-system.md#complete-proposal-set) and linked family files own detailed contracts. The [coverage map](../../../spec/component-coverage.md) accounts for all 150 original source tags and the selected additions.

## Completion at the recorded release checkpoint

| Measure | Recorded state |
| --- | --- |
| Phases 0–2 | Closed, with named follow-ups |
| Phase 3 | Architecture responsibilities agreed; mechanism gates remain explicit |
| Phase 4 | Complete design approved: all thirteen groups, conventions and documentation/tooling |
| Complete inventory approval | Granted 2026-09-20 by Peter; technical verification is not implied |
| User-owned decision queue | Original five recommendations approved in [the register](../../../docs/design/systematization-decisions.md); [explicit helper clearing](../../../docs/decisions/0052-layout-spacing-properties.md#explicit-clearing-for-the-style-helper) selected 2026-09-21; @lit/context selected under [delegated execution](../../../docs/decisions/0035-execution-delegation.md); remaining choices are agent-owned |
| Engineering gates | Six representative M00 technical areas verified; final implementation acceptance stays assigned |
| Phase 5 | [Migration plan approved](../../../docs/decisions/0064-migration-approval.md); M00 closed after compiler selection |
| Phase 6 | M01–M25 and M26 automated acceptance are complete. All five 0.3.2 packages, CDN delivery and public Pages pass verification. The obsolete snapshot removal is merged. GitHub 0.3.2 is stable/latest; actual-platform limits stay explicit. See the [completed release record](../../../docs/releases/0.3.2.md). |

These are review groups, not thirteen questions, equal-sized tasks or duration estimates. The groups describe the approved design decomposition. The recorded implementation status is above; technical acceptance remains distinct from design approval.

## Phase 4 proposal groups

| Group | Proposal owner |
| --- | --- |
| R01 | [Shared rules and themes](../../../spec/SPEC-foundations.md) |
| R02 | [Layout and attached groups](../../../spec/SPEC-layout.md) |
| R03 | [Text and formatting](../../../spec/SPEC-typography.md) |
| R04 | [Actions, icons and identity](../../../spec/SPEC-actions.md) |
| R05 | [Selection and tabs](../../../spec/SPEC-selection.md) |
| R06 | [Inputs and forms](../../../spec/SPEC-inputs-forms.md) |
| R07 | [Surfaces and content composition](../../../spec/SPEC-surfaces.md) |
| R08 | [Navigation and disclosure](../../../spec/SPEC-navigation-disclosure.md) |
| R09 | [Messages, progress and statistics](../../../spec/SPEC-messages-statistics.md) |
| R10 | [Overlays and help](../../../spec/SPEC-overlays-help.md) |
| R11 | [Tables, charts and diagrams](../../../spec/SPEC-data-displays.md) |
| R12 | [Rich content and media](../../../spec/SPEC-rich-content.md) |
| R13 | [Documentation and public tooling](../../../spec/SPEC-documentation-tooling.md) |

R02 also uses the six existing [core layout entries](../../../spec/SPEC-design-system.md#core-layout-contract). Text and Heading have moved to the typography proposal, so the old partial drafts are no longer independent contract owners. Retired source tags map to replacement/recipe entries; their presence in coverage is not retention approval.

## Historical review sequence

Peter requested the whole proposal set before further questions. That assembly is now complete across all groups. The completed review applied [definitive reference behavior](../../../docs/decisions/0082-reference-systems.md#follow-the-established-reference-without-another-preference-question), preserved approved deviations and assigned ordinary engineering choices to the proposal.

Peter approved all five recommendations with the complete set: role-specific density, read-only inspector, authored TOC IDs, core Tree scope and coordinated Pagination parts. The [decision register](../../../docs/design/systematization-decisions.md) is closed. Peter subsequently selected Lightning CSS 1.33.0 as the build-only compiler, closing M00.

The original continuation followed [M00 and the approved migration plan](plan.md). M00 closed before dependent slices proceeded; inventory and migration approvals were already settled. The [M00 results](../../../docs/verification/systematization/m00-prerequisites-2026-09-20.json) preserve passing candidates, failing controls and unresolved limits.

## Engineering work owned by the agent

| Work | Concrete completion condition | Gate |
| --- | --- | --- |
| E01 State, forms and lifetime | Canonical public-state/native-form/content/interaction/overlay mechanisms satisfy the selected ownership; default/reset/restoration, cancellation and exactly-once events have meaningful oracles | Before approving interfaces they can invalidate; final mechanisms before Phase 5 |
| E02 Native structure and registries | Real host/native geometry, native List/Data List/Table composition, ARIA references, late definition, scoped registry/mixin/polyfill and adoption work in supported cases | Before dependent interface approval; complete browser/accessibility acceptance before shipping |
| E03 Styles and metadata | Representative compiled CSS→Lit/document outputs, registrations, maps, escaping, deterministic output, invalid-input handling, CEM/export normalization and selective imports | Existing representative three-engine gate before Phase 5 approval |
| E04 Compositions and visuals | Stack line-aware separators, Group/control seams, focus/contrast/density/RTL, single-selection indicator and actual reference values verified | Evidence needed for recommendations before affected approval; full implementation regression in Phase 6 |
| E05 Delivery and tools | Pure-Bun build/test/lint/publishing plan; coordinated packages/versioned docs/skills/MCP; optional inspector excluded from production | Complete tooling contract in Phase 4; concrete ordered migration in Phase 5 |
| E06 Contract-specific corrections | Verify installed Lit malformed-JSON adaptation; FormatByte zero/bit/binary labels; source-defined mounting/delays; Table 17-feature combinations and ELK scale benchmarks | Before claiming the affected contract works; do not turn source lookups into user choices |

Each investigation had an affected interface/gate and completion condition. The completed review reused applicable evidence and revised owning proposals/analyses for new findings without stopping unrelated work. Unknown runtime outcomes remained unverified rather than inferred from specifications.

## Recorded execution checklist

- [x] Resolved the five user-owned choices through whole-set approval.
- [x] Completed representative state, metadata, registry, semantics and interaction investigations under M00.
- [x] Obtained approval of the inventory, conventions and documentation layout.
- [x] Drafted the original migration plan with paths, dependency order, atomic replacement slices and acceptance.
- [x] Obtained migration approval through Peter's “approved”.
- [x] Verified useful CSS map delivery, complete existing CSS syntax coverage with the generator correction, packaged consumers and the local Bun publication mechanism.
- [x] Selected Lightning CSS 1.33.0 and closed M00. Final real CI/account/publication acceptance was then assigned to M25.
- [x] Implemented approved batches with matching docs/tooling and no compatibility aliases.
- [x] Finished local archive acceptance: all23 required browser invocations were accepted, with the corrected Intent oracle rerun explicitly recorded. [Final evidence](../../../docs/verification/systematization/m26-final/README.md).
- [x] Published and verified all five 0.3.2 packages, provenance and public CDN behavior under the recorded release authorization.
- [x] Verified all 25,120 public Pages files and the three-engine navigation/Flow matrix.
- [x] Merged the reviewed snapshot retirement and published the stable GitHub release. [Complete evidence](../../../docs/releases/0.3.2.md).
- [ ] Actual Safari, assistive-technology, OS input/autofill and background-window checks remained unperformed at closure. Their current owner is the [actual-platform issue](../../../.scratch/maintenance/issues/002-actual-platform-verification.md); automated engines do not establish them.

The old protected-file hashes describe the completed pre-implementation baseline. Peter's release request supplied the separate authorization for that completed publication. Existing research snapshots are historical evidence, not current runtime results.

## Progress reporting

The original reporting correction emphasized complete proposal coverage, actual approvals, the bounded question register and engineering gates. Static source/link checks supported the record but did not prove phase completion. Whole-set review replaced repeated isolated proposals and permission round trips.

## Added verification return points — 2026-09-23

- Closed M25/E03: mapped-style fingerprints include transitive local runtime imports, with a stale-helper regression. Current outputs retain the same CSS. The historical Command Menu Input map was removed. [Evidence](../../../docs/verification/systematization/m26-audit/README.md).
- M22/M26: verify the native date/time Tab boundary and modal focus with actual Safari and assistive technology. Paired native controls plus source/compiled Chromium/Firefox/WebKit cases pass; these are not actual-platform certification.

### M26 public attribute default audit — 2026-09-23

A failing M18 reproduction found that removing a nonnullable string attribute produced null instead of its documented default. Status value, Tooltip content and Alert/Banner heading now use Lit's useDefault and pass explicit removal tests. The complete rebuilt audit now passes 704 scalar default resets and 736 native ARIA resets in each engine. The 41 baseline failures are corrected, including inherited and subclass defaults. Intentionally optional undefined values remain distinct. [Evidence](../../../docs/verification/systematization/m26-audit/README.md). Evidence: the colocated status/tooltip/alert tests and /tmp/acme-m18-passive/defaults-red.log and defaults-green.log.

### M25 documentation coverage gate — 2026-09-23

Replacing the Empty State page temporarily removed Icon Tile's only documentation tag. The site build warned but still exited successfully. Icon Tile now has its own page and coverage is back to zero missing entries. The release projection now rejects a public element without guidance and supplies the shared CI gate. It uses the manifest and page/catalog tags. The final site has 125 pages, 4,319 elements and no undocumented entries.

### M22/M25/M26 durable browser and platform acceptance — 2026-09-23

The durable component runner preserves all 31 colocated fixtures and their accepted drivers; 482 result rows pass per engine across the recorded complete matrix and focused follow-ups. The shared final archive gate runs this suite. Real Input history/back restoration also passes in fresh documents in all three engines. Actual OS background-window pause/resume for Toast remains unverified: injected visibility/timer checks establish their narrower paths only. [Family evidence](../../../docs/verification/systematization/m26-audit/component-browser/README.md), [history evidence](../../../docs/verification/systematization/m26-native-forms/README.md).

### M25 dependency and consumer gates — 2026-09-23

The acceptance contract retained the combined custom-feature/experimental-worker type regression for Table dependency changes. The worker recipe supplies the exact guarded 9.2.4 declaration correction and verifies it in a fresh application; runtime JavaScript is unchanged. Core has no Table engine or lit-virtual dependency. The inspector runtime dependencies remain outside production core. [Worker delivery](../../../docs/verification/systematization/m26-audit/README.md#worker-example-delivery-closure).

## Open follow-ups

- [Chromium Hover Card activation failure; cause unverified](../../../.scratch/maintenance/issues/001-hover-card-activation.md).
- [Actual-platform verification remains unperformed](../../../.scratch/maintenance/issues/002-actual-platform-verification.md).
- [Owner-controlled npm token rotation remains unverified](../../../.scratch/maintenance/issues/003-npm-token-rotation.md).
- [Exact dependency-audit dispositions require review by 2026-11-20](../../../.scratch/maintenance/issues/004-advisory-review-deadline.md).

## Source provenance

Converted 2026-10-21 from notes/alignment/remaining-work.md. That path identifies the historical source record. Inline source references and saved evidence retain their stated scope; this conversion does not rerun the original checks.
