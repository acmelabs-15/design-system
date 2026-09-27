# Remaining work and component review queue

The [central handoff](README.md#where-we-are) owns current status. The [inventory index](inventory.md#complete-proposal-set) and linked family files own detailed contracts. The [coverage map](proposal-coverage.md) accounts for all 150 original source tags and the selected additions.

## Where completion stands

| Measure | Current state |
| --- | --- |
| Phases 0–2 | Closed, with named follow-ups |
| Phase 3 | Architecture responsibilities agreed; mechanism gates remain explicit |
| Phase 4 | Complete design approved: all thirteen groups, conventions and documentation/tooling |
| Complete inventory approval | Granted 2026-09-20 by Peter; technical verification is not implied |
| User-owned decision queue | Original five recommendations approved in [the register](proposal-questions.md); [explicit helper clearing](../decisions/layout-spacing-properties.md#explicit-clearing-for-the-style-helper) selected 2026-09-21; @lit/context selected under [delegated execution](../decisions/execution-delegation.md); remaining choices are agent-owned |
| Engineering gates | Six representative M00 technical areas verified; final implementation acceptance stays assigned |
| Phase 5 | [Migration plan approved](../decisions/migration-approval.md); M00 closed after compiler selection |
| Phase 6 | M01–M25 are implemented. M26 local automated acceptance is complete. Actual-platform and external release gates remain unperformed; see the final acceptance record. |

These are review groups, not thirteen questions, equal-sized tasks or duration estimates. The groups describe the approved design decomposition. The current implementation status is above; technical acceptance remains distinct from design approval.

## Phase 4 proposal groups

| Group | Proposal owner |
| --- | --- |
| R01 | [Shared rules and themes](inventory/foundations.md) |
| R02 | [Layout and attached groups](inventory/layout.md) |
| R03 | [Text and formatting](inventory/typography.md) |
| R04 | [Actions, icons and identity](inventory/actions.md) |
| R05 | [Selection and tabs](inventory/selection.md) |
| R06 | [Inputs and forms](inventory/inputs-forms.md) |
| R07 | [Surfaces and content composition](inventory/surfaces.md) |
| R08 | [Navigation and disclosure](inventory/navigation-disclosure.md) |
| R09 | [Messages, progress and statistics](inventory/messages-statistics.md) |
| R10 | [Overlays and help](inventory/overlays-help.md) |
| R11 | [Tables, charts and diagrams](inventory/data-displays.md) |
| R12 | [Rich content and media](inventory/rich-content.md) |
| R13 | [Documentation and public tooling](inventory/documentation-tooling.md) |

R02 also uses the six existing [core layout entries](inventory.md#core-layout-proposal-for-review). Text and Heading have moved to the typography proposal, so the old partial drafts are no longer independent contract owners. Retired source tags map to replacement/recipe entries; their presence in coverage is not retention approval.

## Current review sequence

Peter requested the whole proposal set before further questions. That assembly is now complete across all groups. Apply [definitive reference behavior](../decisions/reference-systems.md#follow-the-established-reference-without-another-preference-question) without another preference vote. Preserve approved deviations and resolve ordinary engineering choices in the proposal.

Peter approved all five recommendations with the complete set: role-specific density, read-only inspector, authored TOC IDs, core Tree scope and coordinated Pagination parts. The [decision register](proposal-questions.md) is closed. Peter subsequently selected Lightning CSS 1.33.0 as the build-only compiler, closing M00.

Proceed through [M00 and the approved migration plan](migration-plan.md). M00 is closed; execute the dependent implementation slices. Do not repeat inventory or migration approval. The [M00 results](evidence/m00-prerequisites-2026-09-20.json) preserve passing candidates, failing controls and unresolved limits.

## Engineering work owned by the agent

| Work | Concrete completion condition | Gate |
| --- | --- | --- |
| E01 State, forms and lifetime | Canonical public-state/native-form/content/interaction/overlay mechanisms satisfy the selected ownership; default/reset/restoration, cancellation and exactly-once events have meaningful oracles | Before approving interfaces they can invalidate; final mechanisms before Phase 5 |
| E02 Native structure and registries | Real host/native geometry, native List/Data List/Table composition, ARIA references, late definition, scoped registry/mixin/polyfill and adoption work in supported cases | Before dependent interface approval; complete browser/accessibility acceptance before shipping |
| E03 Styles and metadata | Representative compiled CSS→Lit/document outputs, registrations, maps, escaping, deterministic output, invalid-input handling, CEM/export normalization and selective imports | Existing representative three-engine gate before Phase 5 approval |
| E04 Compositions and visuals | Stack line-aware separators, Group/control seams, focus/contrast/density/RTL, single-selection indicator and actual reference values verified | Evidence needed for recommendations before affected approval; full implementation regression in Phase 6 |
| E05 Delivery and tools | Pure-Bun build/test/lint/publishing plan; coordinated packages/versioned docs/skills/MCP; optional inspector excluded from production | Complete tooling contract in Phase 4; concrete ordered migration in Phase 5 |
| E06 Contract-specific corrections | Verify installed Lit malformed-JSON adaptation; FormatByte zero/bit/binary labels; source-defined mounting/delays; Table 17-feature combinations and ELK scale benchmarks | Before claiming the affected contract works; do not turn source lookups into user choices |

Each investigation has an interface/gate it can invalidate and a completion condition. Reuse prior evidence. New findings revise their owning proposal/analysis in the same turn; unrelated proposal work does not stop. Unknown runtime outcomes remain unverified, not assumed from the written specification.

## Remaining execution

- [x] Resolve the five user-owned choices through whole-set approval.
- [x] Complete the representative state, metadata, registry, semantics and interaction investigations under M00.
- [x] Obtain approval of the inventory, conventions and documentation layout.
- [x] Draft notes/alignment/migration-plan.md with paths, dependency order, atomic replacement slices and acceptance.
- [x] Obtain migration approval through Peter's “approved”.
- [x] Verify useful CSS map delivery, complete existing CSS syntax coverage with the demonstrated generator correction, packaged consumers and the local Bun publication mechanism.
- [x] Select Lightning CSS 1.33.0 and close M00. Final real CI/account/publication acceptance stays in M25.
- [x] Implement approved batches with matching docs/tooling and no compatibility aliases.
- [x] Finish local archive acceptance: all23 required browser invocations are accepted, with the corrected Intent oracle rerun explicitly recorded. [Final evidence](evidence/m26-final/README.md).
- [ ] Complete actual-platform and separately authorized external release acceptance. These are not established by automated engine checks.

Source changes now proceed under the approved migration; the old protected-file hashes describe the completed pre-implementation baseline. The migration is approved; technical prerequisites govern dependent source edits. Publishing requires its separate authorization. Existing research snapshots are historical evidence, not current runtime results.

## Progress reporting

Report proposal coverage, actual approvals, the bounded question register and engineering gates. Static source/link checks support the record but are not phase completion. The full set is now reviewable; do not revert to delivering one tiny proposal followed by another permission round trip.

## Added verification return points — 2026-09-23

- Closed M25/E03: mapped-style fingerprints include transitive local runtime imports, with a stale-helper regression. Current outputs retain the same CSS. The historical Command Menu Input map was removed. [Evidence](evidence/m26-audit/README.md).
- M22/M26: verify the native date/time Tab boundary and modal focus with actual Safari and assistive technology. Paired native controls plus source/compiled Chromium/Firefox/WebKit cases pass; these are not actual-platform certification.

### M26 public attribute default audit — 2026-09-23

A failing M18 reproduction found that removing a nonnullable string attribute produced null instead of its documented default. Status value, Tooltip content and Alert/Banner heading now use Lit's useDefault and pass explicit removal tests. The complete rebuilt audit now passes 704 scalar default resets and 736 native ARIA resets in each engine. The 41 baseline failures are corrected, including inherited and subclass defaults. Intentionally optional undefined values remain distinct. [Evidence](evidence/m26-audit/README.md). Evidence: the colocated status/tooltip/alert tests and /tmp/acme-m18-passive/defaults-red.log and defaults-green.log.

### M25 documentation coverage gate — 2026-09-23

Replacing the Empty State page temporarily removed Icon Tile's only documentation tag. The site build warned but still exited successfully. Icon Tile now has its own page and coverage is back to zero missing entries. The release projection now rejects a public element without guidance and supplies the shared CI gate. It uses the manifest and page/catalog tags. The final site has 125 pages, 4,319 elements and no undocumented entries.

### M22/M25/M26 durable browser and platform acceptance — 2026-09-23

The durable component runner preserves all 31 colocated fixtures and their accepted drivers; 482 result rows pass per engine across the recorded complete matrix and focused follow-ups. The shared final archive gate runs this suite. Real Input history/back restoration also passes in fresh documents in all three engines. Actual OS background-window pause/resume for Toast remains unverified: injected visibility/timer checks establish their narrower paths only. [Family evidence](evidence/m26-audit/component-browser/README.md), [history evidence](evidence/m26-native-forms/README.md).

### M25 dependency and consumer gates — 2026-09-23

Retain the combined custom-feature/experimental-worker type regression when changing Table dependencies. The worker recipe supplies the exact guarded 9.2.4 declaration correction and verifies it in a fresh application; runtime JavaScript is unchanged. Core has no Table engine or lit-virtual dependency. The inspector runtime dependencies remain outside production core. [Worker delivery](evidence/m26-audit/README.md#worker-example-delivery-closure).
