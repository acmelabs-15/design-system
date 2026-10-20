# Independent runtime review — 2026-09-26

Scope: scoped rendering and explicit registration; their base/generator/CEM integration; scalar/subclass default restoration; Tabs indicator stacking. Reviewed with the code-review-and-quality skill across correctness, architecture, readability, security and performance. This is a bounded source review, not final release certification.

## Required finding, corrected during review

The entry collector recursively scanned the canonical `createScopedElement` implementation after collecting a call's literal tag. Its inert-document `ownerDocument.createElement(name)` used generic `K extends keyof HTMLElementTagNameMap`, so collection treated every custom tag as an owned dependency and produced a self-cycle. The earlier test replaced the real factory with an `owner.createElement` body, hiding the failure.

The independent reproduction copied the actual scoped factory into an isolated two-component fixture. Before correction, `collectComponents` threw `Component dependency cycle: owner -> owner`. The author added an explicit canonical-factory boundary at `scripts/entries.ts` lines 199–206, preserving validation at each call site. The identical reproduction now returns Owner → Child, with no extra dependencies. The scoped-factory regression now uses an `ownerDocument.createElement` implementation. Full generator/manifest/build verification remains the integration owner's gate.

## Other reviewed coverage

- `src/shared/scoped-render-root.ts`: native registry transport, public polyfill creation APIs, current ownerDocument use after adoption and inert-node construction for imperative owned elements. Inspected the 17-outcome saved source fixture and independent native cross-document control. Actual final packed execution is a separate gate.
- `src/shared/registration.ts`: idempotence, compatible subclass preservation, unrelated-constructor rejection and prototype-safe ancestry checks.
- `src/base.ts`: one shared render-root path, Lit's public creationScope and destination-owned static styles. No added store or selection owner.
- `src/shared/attributes.ts`, `src/shared/hover-help.ts`, Hover Card and Alert Dialog: absence conversion and capture of subclass defaults before authored attributes. Canonical values remain in the existing atom-backed fields.
- `scripts/entries.ts` and `scripts/manifest.ts`: explicit registration modules remain inert, definition modules invoke the same dependency graph, private dependencies remain private, and standard CEM definitions still reference class declarations. Source tag maps stay authoritative.
- `scripts/browser-modules.ts` and build integration: generated registration modules retain references into the single browser class/runtime graph; imported files and extensions are verified.
- Tabs structure CSS and browser regression: primary indicator paints above member hover/focus surfaces, inset remains behind the selected content, pointer interaction stays disabled on the visual indicator, both orientations are exercised. The saved regression checks actual rendered pixels as well as target geometry.

No additional actionable defect was found in those bounded areas. No source or generated files were edited by this reviewer. The required scanner correction was implemented by its owner and independently rechecked here.

Focused verification: Bun 1.4.2 ran registration, Alert Dialog and Hover Card tests: five pass, fifteen assertions. No full suite was rerun. Native/compatibility browser limits retain their explicit records under `../m26-scoped/README.md`; this review does not convert those limits into fresh browser certification.

## Complete inventory and completion audit

Read the full 555-line inventory, all thirteen family files, the full 412-line migration plan and 98-line remaining-work register. Used the complete 150-tag disposition map and all thirty numbered extension records as the index. The approved set contains 91 component/family/adapter entries, seven documentation units, shared foundations and consumer tooling. This audit checks assigned implementation and acceptance evidence; it does not pretend that rereading a specification reruns its browser tests.

| Area | All entry ranges reviewed | Implementation evidence and current return point |
| --- | --- | --- |
| R01 shared rules | State, forms, theme, responsive inputs, motion, events, localization and delivery conventions | M05/M06 evidence; final defaults/scoped/package gates are active. No newly missing mechanism identified. |
| R02 layout | L01–L09 plus G01, including all six core layout entries | M07 and M14 acceptance; Group member integration closes in M09–M11. No omitted layout family found. |
| R03 typography | T01–T11 | M08, M16 TOC and M21 Markdown acceptance; saved single-bundle reproduction is a current M26 gate. |
| R04 actions/identity | A01–A10 | M09, M10 Theme Switcher and M13 Split Button/Menu acceptance. |
| R05 selection | S01–S07 | M10 acceptance, M15 Toolbar integration and M22 React mounting. Recent Tabs stacking and default restoration have separate regressions. |
| R06 forms | F01–F10 | M11–M13 acceptance. **A real delivery gap was found in F10:** nested/array managed-form checks existed for Lit, but no delivered React managed-form example or matching TanStack Form reset/error/disposal proof was found. Root owns this correction. Native React form tests alone do not close it. |
| R07 content | C01–C05 and all seven retired-arrangement mappings | M14 acceptance and M23 recipe coverage. |
| R08 navigation/disclosure | N01–N12 | M15/M16 acceptance; M22 owns React content mounting. |
| R09 messages/statistics | M01–M08 | M18 acceptance; actual OS background-window Toast pause/resume remains unverified. |
| R10 overlays/help | O01–O06 and typed confirmation | M17 and M23 acceptance; actual Safari date/time Tab behavior and assistive technology remain explicit external/manual checks. |
| R11 data | D01–D05, all seventeen Table feature areas and required combinations | M19/M20/M22 evidence; Table application patch is now delivered. Flow stress already covers 100 and 500 nodes in all engines. Do not reopen that requirement. Official Firefox navigation remains an active gate after the patched155 crash. |
| R12 rich content | RC01–RC07 | M21 and M22 native-content/React acceptance. |
| R13 documentation/tools | Seven documentation units, seven consumer skills, MCP, inspector and coordinated packages | M23/M24 records plus current package checks. The consumer evaluations exist and remain one-run observations, not a claim of statistical superiority. |

All 150 original tag mappings and thirty extensions retain an implementation, recipe or explicit exclusion owner. The removal scan found 79 removed/renamed tags, no surviving retired component registration/export and no retired consumer markup. SSR, live AI control, a Table engine inside the component, advanced Tree editing/virtualization, Flow editing/execution and compatibility aliases stay excluded; their absence is not unfinished scope.

### Local follow-ups identified during audit — now closed

The numbered items below preserve the findings at audit time. All of their local implementation and verification work is now closed by [final acceptance](../m26-final/README.md), including the full archive matrix, actual history restoration and restored preview. External/manual gates remain separate.

1. **Durable family browser coverage.** The prior CI list ran wrapper/docs/tooling/Tabs gates but omitted the other colocated family fixtures. The new `scripts/component-browser-checks.ts` indexes all 31 fixture files: 26 preserved driver suites contain 357 named cases, four additional fixture protocols cover ComboBox/Number Input/Pin Input/Slider, and Tabs retains its dedicated gate. Case bodies and setup are committed in `component-browser/cases.json`; runtime execution uses no historical temporary paths. Protocol tests pass; complete execution and any failures still need closure.
2. **Official Firefox navigation.** Playwright 1.63.0's patched Firefox155 still crashes after Flow worker teardown/navigation. The first failed full-site run is evidence, not a pass. The new official Firefox156.0.1 gate must run the same sequential page assertions and the preserved twenty Flow cancellation/navigation cycles. Old patched-runtime render checks must be identified as isolated rendering coverage, never presented as a passing navigation regression.
3. **F10 managed React forms.** Deliver and test the missing example identified above. Include nested/array paths, real FormData/invalid focus, reset, errors/disabled state and disposal in the same canonical property/event model.
4. **Native browser-history restoration.** This remains locally executable through real navigation/back with a paired native-control oracle. Direct restoration callbacks do not close it; do not classify it as inherently external.
5. **Final existing gates.** Finish the coordinated build/format/types/unit checks and final archives, default-removal matrix, scoped/native adoption, bundle initialization, standalone worker recipe, generated documentation and optional-tool isolation checks. These are the root's current active work; this audit does not introduce another approval phase.
6. **Record synchronization and developer preview.** Update current status in alignment README, migration-plan and remaining-work. Their dated checkpoints remain historical. The remaining-work row still says M01–M19, and its transitive-map/patch/docs-coverage text is stale. Restore the normal watched preview after serial build verification, as the migration plan explicitly assigns.

The transitive mapped-input return point is corrected with its stale-helper regression. The old Command Menu Input map itself was removed, so its historic filename must not be reported as a current broken map. Missing public documentation now fails through the release projection even though the preliminary site census logs a warning. Devtools runtime dependencies have moved to its development metadata, and the core no longer depends on @tanstack/lit-virtual. Those completed items need current notes, not new implementation.

### External/manual limits that local automated passes cannot certify

- Genuine OS IME/dictation and browser autofill. Direct restoration callbacks and synthetic composition events prove their specific paths only; real history navigation is a separate local return point above.
- Actual Safari's native date/time segment Tab boundary, modal focus timing, browser settings and assistive-technology interaction. WebKit engine results are distinct.
- Actual screen-reader navigation/announcement behavior for form relationships and native collections; browser accessibility trees establish a different, useful layer.
- Real OS background-window visibility/focus pause/resume for Toast. The existing injected visibility and timer checks do not establish this.
- Linux GitHub Actions execution, future OIDC exchange/new signing, all four registry trusted-publisher configurations and actual publication/deployment. Local loopback crypto plus verification of prior public provenance do not establish future account configuration.
- Pages source migration and removal of the frozen published docs snapshot stay coupled to separately authorized publication. No push, release, account setting or Pages change is authorized by these checks.

Closure language must separate completed implementation/local verification from these unperformed platform and external release checks. Do not mark them passed, silently delete their requirements, or ask another user question to conceal an unfinished local task.

### Audit follow-up closure

The identified family-runner gap now has a permanent command and preserved test records. [Component-browser evidence](component-browser/README.md) records 482 passing result rows per engine across the complete matrix and its focused follow-ups, including the original Number/Pin/Slider driver assertions. The final archive run now passes all1446 component result rows; see [the final matrix](../m26-final/components.json).

[Official Firefox evidence](official-firefox/README.md) records all 125 current documentation pages, including managed forms, followed by the original twenty Flow navigation cycles. The current official browser passes; the old patched155 crash remains a labelled automation-runtime constraint.

Root reports the F10 delivery correction complete with fresh Lit/React managed-form checks, including the field-path lifetime correction. Its owning evidence and final archive gate remain in the root integration record. These follow-ups resolve the concrete implementation gaps found by this audit without claiming the external/manual checks passed.

Final closure: all125 documentation pages and20Flow cycles pass in official Firefox, all48 managed-form checks pass, real Input history/back restoration passes in all3engines, and the watched preview is restored. The original combined-run Intent-oracle failure and its complete successful rerun are preserved separately in the final record. No external/manual gate is inferred from these results.
