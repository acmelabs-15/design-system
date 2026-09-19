# Phase 2 review

Captured 2026-09-19. The glossary split, message-family dispositions, canonical Card and Fieldset direction are recorded. Phase 2.3 remains in progress; Entity/Item is deferred to the Group review. This records planning decisions only, with source implementation still gated by Phase 5 approval.

## Glossary contexts

Peter selected two linked glossaries: [component library](../../CONTEXT.md) and [generation/comparison tools](../../tools/geist/CONTEXT.md). The [context map](../../CONTEXT-MAP.md) defines their relationship. Shared terms are defined once. Paths are a routine documentation choice; the user selected the separation, not these particular filenames.

The initial entries use settled interface names, message definitions and the tooling vocabulary from PLAN section 2. These are seeds, not a complete glossary for the unfinished inventory. Definitions contain no implementation contracts.

## Message-family dispositions

- **Note:** rename to Alert, as already decided. It represents an inline section/form/block message.
- **Toast:** retain the existing selected name and house implementation direction. Brief action results use the selected overlapping presentation; exact timing, actions, announcements and limits remain for the inventory.
- **Banner:** retain the page/app notice concept. The current promotional link arrangement is narrower than that concept; final content/action/dismissal shape belongs to the inventory.
- **Feedback:** [keep a component and composed examples](../decisions/feedback-component.md). Peter explicitly selected this after the broader survey. Applications send the data.
- **Error:** [remove the standalone element](../decisions/message-context-and-errors.md). Peter selected removal after clarifying scope with his diagram. Preserve attached field validation and small plain treatments.
- **Error Card:** delete, as already decided.
- **Project Banner:** delete, as already decided. Page/app notices belong to Banner.
- **Empty State:** [keep a component built from shared parts, with examples](../decisions/empty-state-component.md). Peter accepted the revised recommendation after challenging the recipe-only rule and reviewing Chakra's structure.

Feedback collects input; Empty State explains absent content. Neither is a fourth notification level. The message taxonomy does not prescribe all ARIA roles or force every error into a particular visual treatment.

## Composition clarification

The accepted Feedback and Empty State decisions qualify the earlier unconditional recipe rule. Review the value of a consistent named structure as well as distinct behaviour. Continue to share primitives and avoid duplicated behaviour; retain/delete decisions for other elements remain individual questions. [Updated composition record](../decisions/composition-over-count.md).

Chakra also uses the word “recipe” for style configuration. Our glossary uses it for a documented arrangement/example; those meanings must not be confused.

## Container decisions

- **Card:** Peter selected [one flexible Card](../decisions/canonical-card.md) covering the current Card, Panel and Link Card uses. Remove the separate Panel and Link Card interfaces during migration; provide examples for those uses. Exact shape/semantics remain later.
- **Fieldset:** Peter favoured [rebuilding Fieldset for form grouping](../decisions/fieldset-form-group.md), saying “I think probably option 1 here.” Retain this selected direction with its compatibility and verification conditions. It supplies group meaning and behaviour; Card can provide surrounding presentation.
- **Entity/Item:** no answer selected; deferred below. Their list/content companions and Setting Row remain open subjects for the related grouping/form review.
- **Toolbar:** Peter selected the [Group/Toolbar/selection responsibility split](../decisions/toolbar-group-responsibilities.md). Detailed composition returns with Group below.
- **Stat:** next in Phase 2.3. Consider Tile and related statistics elements with Stat; no automatic Card disposition applies to them.

### Toolbar responsibility selected

The first answer leaned toward keyboard behaviour and layout but requested the full Material comparison. That was not final approval. After the expanded review, Peter selected “Use this split (Recommended)” in question `toolbar_group_responsibilities`: Group arranges children and supplies shared presentation; Toolbar identifies related controls and owns coordinated keyboard movement; selection controls own their selected values and forms.

The [decision](../decisions/toolbar-group-responsibilities.md) accepts these separate responsibilities and their composition. It does not choose every nested key rule or the interface of generic Group. Material explicitly allows text fields and custom controls in Toolbar; their own keys must be coordinated rather than intercepted blindly. [Full comparison](../analysis/codebase-systematization.md#full-material-review-and-selected-responsibilities).

## Decision compatibility and dependencies

Peter explicitly required two checks on 2026-09-19: compare each recommendation with decisions already made, and consider upcoming decisions that could change its scope or rationale.

Before a consequential question:

1. Identify the relevant accepted decisions and compare the proposed behaviour, interface and implementation requirements against them.
2. Inspect upcoming work for choices the proposal depends on or affects. Separate a stable direction from detailed design that remains open.
3. If there is a conflict, identify whether the existing decision, new proposal or both need revision, and explain the evidence and effects. Take material changes to Peter; do not silently override either side.
4. If a missing prerequisite could change the choice, defer it with the exact question, reason, dependency, return point and phase closure requirement. Link it from both this register and the review section that must revisit it.
5. Bring needed research forward when it would avoid a circular phase dependency. Do not mark a required decision complete merely because it was deferred.

The Fieldset check covered the form/state/React/reference/composition/Box decisions and mandated stack. No earlier decision needs reversal at the reviewed capability level. The existing implementation must change, and runtime/accessibility verification remains outstanding. Row comparisons identify adaptations needed for reference virtualization packages, ripples, list navigation and disabled-link semantics. Those differences do not reopen our selected stack automatically.

## Deferred decisions

### Toolbar and Group composition

- **Question:** how do generic Group, Toolbar and nested selection/input controls compose without competing keyboard, selection or form owners?
- **Status:** the responsibility split is selected; exact composition rules remain open.
- **Why it waits:** Group's attached-child contract, selection semantics, text editing, popup focus, RTL and disabled-action discovery affect the correct behaviour.
- **Depends on:** Phase 2.4 Group, Radio/Segmented/Checkbox Card responsibilities, Input/Search, and Dialog/Popover focus and Escape rules. Existing source shows distinct jobs in Button Group, Avatar Group, Radio Group and Collapse Group; do not collapse them by suffix.
- **Revisit:** explicitly in Phase 2.4 Group with the Entity/Item return. Resolve responsibility conflicts before Phase 2 closes. Exact slots, properties, events, keyboard rules and overflow belong in the Phase 4 inventory, before Phase 5 approval.
- **Later surface choices:** floating Toolbar/Search shadow roles and Appbar/Topbar/PageHead or expanded Search dispositions remain separate open questions. The Toolbar decision does not approve those interfaces or Material visual defaults.

### Entity and Item

- **Question:** should Entity and Item become one shared content-row component, or complete examples assembled from shared layout, text and action controls?
- **Status:** unanswered. The tool request was interrupted and returned no choice. Peter's following message added the forward-dependency requirement; it did not select either option.
- **Why it waits:** Group/list responsibilities, descriptive-row versus labelled-form-control purposes, settings rows and selection-control behaviour can change what a standalone row adds. Peter explicitly added Checkbox Card and Radio Card integration with rows to this comparison.
- **Depends on:** the [Phase 2.4 Group review](README.md#24-name-collisions-between-the-new-element-list-and-geist), including items/setting-rows and the distinction between generic composition, semantic lists and selection groups. Bring forward enough Checkbox Card/Radio Card responsibility research to decide the row disposition; exact interfaces remain for Phase 4. Check full-row selection, separate secondary actions, input labels, focus, disabled state and form ownership without assuming that interactive controls can be nested inside a row-wide button.
- **Revisit:** explicitly during that Group review, using the saved [row research](../analysis/codebase-systematization.md#entity-and-item-research-deferred). Consider Entity List, Entity Content, Items and Setting Row with it. Resolve the component disposition before Phase 2.5 is complete and Phase 2 closes; coordinate its final name with Phase 2.6.
- **Later detail:** exact properties, slots, keyboard rules and implementation belong in the inventory. If earlier research is insufficient to decide the disposition, bring the necessary investigation forward rather than silently bypass the phase gate.

This deferral does not undo the selected Card or Fieldset directions. No new List component, row name, navigation policy or recipe-only removal is approved.

### Results pagination

Peter asked to evaluate whether page-position text, page-size selection and navigation should be coordinated parts of Pagination, using the Pro event-log example. The [earlier recipe boundary is under review](../decisions/results-pagination.md#review-pending-after-the-chakra-ui-pro-example); application-owned data/state and unknown totals still stand. Revisit after the complete Pro review, before accepting the Pagination inventory entry. No final replacement interface is selected. [Analysis](../analysis/documentation-site.md#chakra-pro-pagination-review).

## Evidence and limits

[Living analysis](../analysis/codebase-systematization.md#phase-2-message-family) contains local code references and the comparison. [Evidence index](evidence/message-family-review-2026-09-19.json) records the sources, inspected versions and user choices. Peter's diagram is a local reference, not independent proof of community practice.

The [container analysis](../analysis/codebase-systematization.md#phase-2-container-family) contains Card, Fieldset and row comparisons. Its [evidence index](evidence/container-family-review-2026-09-19.json) records the two selections, the unanswered row question and dependency requirements.

The [complete Pro review](chakra-pro-review.md) now covers all 338 blocks, 1,003 exposed block files and 250 kit files; all seven Free Blocks aliases are byte-equivalent. The [capability synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.md) maps 15 families to source evidence, recommendations, conflicts, dependencies and return points. These are additional references under the [standing comparison rule](../decisions/reference-systems.md#standing-comparison-rule), not scope approval.

Browser evidence is limited to default preview DOM inspection and specifically recorded follow-ups, including event-log page-size change and hydrated overlay states. No exhaustive browser, screen-reader or completed house-component test is claimed. No project dependency was added. No source, generated styles, build script or publication setting changed. [Capture verification](evidence/extension-capture-verification.json) records file integrity and link checks.

The [Material review record](evidence/material-full-review-2026-09-19.json) covers 46 documentation pages: 20 layout, six interaction, and all four tabs for Toolbar, App Bar, Search, Button Groups and Segmented Buttons. It separates complete text reading, expanded token sets, inspected diagrams, untested animations and missing numeric renderings. Actual experimental Lit segmented-control source, Chakra Group/ButtonGroup and Radix/APG keyboard evidence are recorded separately. Reference measurements remain labelled; Peter permits evidence-led proposals to change house rules, not silent adoption.

## Resume here

**Phase 2.3 is in progress; Stat is next.** Card, Fieldset and the Toolbar/Group/selection responsibility split are selected. No question card is open. Review Stat with Tile and its related helpers, using the complete Pro collection and applicable full reference documentation. Do not repeat the Toolbar responsibility choice; carry its exact composition rules into the Group review. Peter's full Material-reading rule and reference-versus-house clarification are saved in [reference systems](../decisions/reference-systems.md).

At Phase 2.4 Group, return to [Toolbar composition](#toolbar-and-group-composition), [Entity and Item](#entity-and-item), related list/content companions and Setting Row. These return points are required before the relevant responsibilities and Phase 2 close. Existing decisions remain the baseline; new evidence can support an explicit revision with Peter. Source implementation remains unapproved.

Continue research between questions without waiting for routine “continue” messages. Use the local question skill and an untimed supported question path. Phase 3 starts only when Peter says. Inventory approval and Phase 5 migration approval still precede source implementation.
