# Remaining work and component review queue

The [central handoff](README.md#where-we-are) owns current status. The [inventory index](inventory.md#complete-proposal-set) and linked family files own detailed contracts. The [coverage map](proposal-coverage.md) accounts for all 150 current source tags and the selected additions.

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
| Phase 6 | M01–M05 complete; M06 shared mechanisms active. Family adoption and final browser/package acceptance remain. |

These are review groups, not thirteen questions, equal-sized tasks or duration estimates. The design contracts are approved; they are not implemented or verified components. Technical gates remain distinct from the recorded design review.

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

Peter requested the whole proposal set before further questions. That assembly is now complete across all groups. Apply [definitive reference behavior](../decisions/reference-systems.md#follow-the-established-reference-without-another-preference-question) without another preference vote. Preserve approved house deviations and resolve ordinary engineering choices in the proposal.

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
- [ ] Implement approved batches with matching docs/tooling and no compatibility aliases.
- [ ] Complete three-engine, accessibility, visual, behavior and packaged-consumer acceptance.

Source changes now proceed under the approved migration; the old protected-file hashes describe the completed pre-implementation baseline. The migration is approved; technical prerequisites govern dependent source edits. Publishing requires its separate authorization. Existing research snapshots are historical evidence, not current runtime results.

## Progress reporting

Report proposal coverage, actual approvals, the bounded question register and engineering gates. Static source/link checks support the record but are not phase completion. The full set is now reviewable; do not revert to delivering one tiny proposal followed by another permission round trip.

## Added verification return points — 2026-09-23

- M25/E03: extend mapped-style fingerprints to transitive local imports. tools/geist/maps/command-menu-input.ts imports CLOSED from command-menu.ts, but writeStyles currently records only its explicit map/extends inputs. Add a regression that changes an imported helper and requires stale-output detection. M26 release acceptance must verify closure. Current mapped outputs were fully regenerated; no current visual mismatch is claimed.
- M22/M26: verify the native date/time Tab boundary and modal focus with actual Safari and assistive technology. Paired native controls plus source/compiled Chromium/Firefox/WebKit cases pass; these are not actual-platform certification.

### M26 public attribute default audit — 2026-09-23

A failing M18 reproduction found that removing a nonnullable string attribute produced null instead of its documented default. Status value, Tooltip content and Alert/Banner heading now use Lit's useDefault and pass explicit removal tests. M26 must audit the remaining public defaulted inputs against their documented types/defaults, including shared bases. Preserve intentionally optional undefined and native ARIA null inputs; do not blanket-convert them. Evidence: the colocated status/tooltip/alert tests and /tmp/acme-m18-passive/defaults-red.log and defaults-green.log.

### M25 documentation coverage gate — 2026-09-23

Replacing the Empty State page temporarily removed Icon Tile's only documentation tag. The site build warned but still exited successfully. Icon Tile now has its own page and coverage is back to zero missing entries. M25 must make missing public documentation a failing release/CI check, while preserving any deliberate preview workflow. Use the existing manifest and page/catalog tag coverage, not a second manually maintained list.
