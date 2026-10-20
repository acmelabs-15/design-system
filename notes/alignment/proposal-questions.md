# Phase 4 decision register — approved

Closed 2026-09-20 when Peter said “I approve all proposals.” **All five recommendations are approved; no question remains pending.** The sections below preserve the choices and their reasoning. [Approval record](../decisions/inventory-approval.md). Migration approval and technical verification remain separate.

The [proposal set](inventory.md#complete-proposal-set) contains the working recommendation for each family. Source facts, ordinary implementation details and verification work are not added to this question queue.

## Q02 — Compact density treatment

**Status: APPROVED — the recommendation below is selected.**

**Context before approval:** shared spacing-only compact mode is selected, but its visual amount is not. Reference systems do not supply one universal house density map.

**Evidence:** current Table styles reduce vertical cell padding from .625rem (10px at the 16px reference) to 5px while leaving inline padding at .5rem. That is a role-specific change, not proof that all spacing should halve. Fonts stay unchanged under the selected density rule, and compact controls must retain a 24×24 CSS-pixel clickable floor.

**Recommendation:** role-specific compact tokens, using verified control/table examples as the baseline and leaving deliberate section separation readable. The alternative is one uniform multiplier on every eligible spacing token; it is easier to predict mathematically but changes all relationships equally. Prepare the small visual comparison before asking; do not invent approved final compact numbers.

Concrete comparison for the walkthrough, at a 16px root font. These are proposed compact values, not measured future-component output:

| Eligible spacing | Normal | Role-specific proposal | Uniform 0.75 proposal |
| --- | --- | --- | --- |
| Layout gap, token 2 | 8px | 6px | 6px |
| Layout gap, token 4 | 16px | 12px | 12px |
| Table vertical cell padding | 10px | 5px, matching the existing compact rule | 7.5px |
| Table inline cell padding | 8px | 8px, preserving the existing compact rule | 6px |

Both leave text/icons/borders unchanged, preserve explicit CSS overrides and enforce the selected control target floor. The first approach keeps role exceptions; the second applies the same ratio to every eligible spacing. Render this small comparison if a visual is needed to answer; do not start another broad density investigation before showing the actual choice.

**Affected proposals:** [foundations](inventory/foundations.md), controls, Table, Toolbar, menus/dialogs/Toasts' selected normal-density exceptions.

## Q08 — Inspector scope

**Status: APPROVED — the recommendation below is selected.**

**Context before approval:** the inspector is selected, but editing changes its product scope and its interaction with application-owned inputs.

**Recommendation:** read-only properties/events/theme/state diagnostics for this pass. Alternative: add deliberate temporary edits with explicit indication that a subsequent Lit helper/React render can restore the application value. Editing the application source or persisting edits is not either option.

**Evidence/consequence:** the selected next-render reassertion is verified in the saved helper/wrapper fixtures. Devtools mounting does not establish a safe persistent editing bridge. [Complete proposal](inventory/documentation-tooling.md#inspector), [existing decision](../decisions/design-system-devtools.md).

## Q13 — TOC ownership of missing heading IDs

**Status: APPROVED — the recommendation below is selected.**

**Context before approval:** heading discovery and explicit entries are selected; they do not settle whether TOC may add IDs to author content.

**Recommendation:** require stable authored IDs and report/omit missing targets. Alternative: generate IDs only for headings without IDs, with a documented stable collision rule and no rewriting of explicit IDs. Both use real links and preserve native/house Heading discovery.

**Consequence:** required IDs keep bookmark ownership with the application; automatic IDs make generated documents work with less setup but add mutation/lifecycle behavior. Explicit items take precedence over discovery in both proposals; that routine rule is not a second question. [Proposal](inventory/navigation-disclosure.md#n-04-table-of-contents).

## Q14 — Advanced Tree View scope

**Status: APPROVED — the recommendation below is selected.**

**Context before approval:** general hierarchy, expansion and keyboard behavior are selected. At review time, multiple selection, checkbox propagation, asynchronous children, filtering, renaming/reordering and virtualization were unselected; the approved recommendation now excludes them from this pass.

**Recommendation:** finish the core interactive hierarchy and file-tree recipe in this pass; keep editing and advanced data features outside its initial contract. If Peter needs an advanced capability now, identify the required capabilities together and extend this one proposal before approval. Do not silently add every optional source feature or ask one speculative question per feature.

**Consequence:** additional capabilities change node/state/events, rendering and the test matrix. TanStack Virtual is already mandatory if virtualization is included; package selection is not reopened. [Proposal](inventory/navigation-disclosure.md#n-06-tree-view), [scope decision](../decisions/general-tree-view.md).

## Q15 — Coordinated Pagination parts

**Status: APPROVED — the recommendation below is selected.**

**Context before approval:** the earlier page-size recipe boundary was explicitly reopened by his Pro event-log example.

**Recommendation:** include optional Pagination Position and Page Size parts alongside navigation/items, sharing the root's supplied state and reusing existing controls. Alternative: keep Page Size entirely in documented recipes. Application-owned page/page-size/reset/data loading and unknown-total behavior remain the same.

**Evidence:** Pro Event Log 03 composes shared pagination context, page text, navigation and a page-size NativeSelect; its application resets page after size changes. This supports coordinated parts but does not itself approve the boundary revision. [Complete proposal](inventory/data-displays.md#d-02-results-pagination), [saved source/live result](../analysis/documentation-site.md#chakra-pro-pagination-review).

## Removed from the user-question queue

These concrete recommendations are included in the whole-set approval. Engineering acceptance remains required; alternatives not recommended here are not selected.

| Earlier candidate | Resolution and reason |
| --- | --- |
| Q01 theme authoring | Propose named registration plus normal CSS local overrides; no second runtime .tokens interface without demonstrated need. Full theme scope remains selected. |
| Q03 malformed style JSON | Installed Lit 2.1.2 converter returns null on malformed JSON. Propose mapping that to no current style override/undefined, preserving valid scalar CSS first and unrelated inputs. This is an explicit house adaptation, not a claim Chakra parses HTML JSON. Verify actual browser behavior before approval. |
| Q04 ripple configuration | Per-control boolean opt-in, false by default, satisfies selected capability. An additional global control is not required. |
| Q05 content mounting | Read assigned Chakra defaults: lazyMount=false/unmountOnExit=false. Keep explicit opt-in choices; Show retains conditional mounting by purpose. |
| Q06 free-form ComboBox | Current code commits listed options; unmatched programmatic values can display while data arrives. Free-form creation is not an existing capability to vote back in. |
| Q07 Calendar date/time representation | Propose explicit date-only versus offset-bearing date-time under the existing showTimeInput capability and @internationalized/date; parsing/DST tests are agent work. |
| Q09 Markdown raw HTML | Preserve default escaping and existing explicit trusted-content opt-in; do not invent a sanitization guarantee or dependency. Verify parser/output boundaries. |
| Q10 Video autoplay | Preserve the assigned source's reduced-motion-sensitive default and browser playback policy; no unrequested default reversal. |
| Q11 icon delivery | Pinned generated artwork/manifest, explicit imports and missing-artwork diagnostic are engineering work under selected families/fills; no silent network fallback. |
| Q12 Sidebar dimensions | Propose configurable 16rem/3rem widths and medium threshold; verify them with the whole layout, without a separate vote for every dimension. |
| Q16 Flow Diagram scale | Retain small/100-node cases and add a larger stress fixture; report measured capability instead of asking Peter to invent a limit. |
| Simple Grid minimum/precedence/default | Follow the known Chakra source: no automatic clamp; choose mode before responsive mapping; no invented columns=1 input default. |
| General Stack/Group source defaults | Apply their inspected defaults under house naming/token rules; no repeated preference vote. |

## Engineering gates are not questions

Native list/definition-list/table semantics, retained host geometry, ARIA reference forwarding, scoped registries/adoption, form state timing, separator line geometry, animation/overlay cancellation, icon catalog checks, actual parser behavior and generated CSS/package delivery remain assigned engineering work. A failure can require a revised proposal; it does not make every mechanism a preference question.

The existing representative style-pipeline/browser gate remains before Phase 5 approval. Full source implementation and acceptance follow the approved migration. All five choices are closed by the whole-set approval; do not restart their walkthrough.
