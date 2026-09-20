# Phase 2 review

Closed 2026-09-19. Phase 2 component dispositions and semantic naming choices are complete. The final closure below supersedes earlier in-progress handoffs in this chronological review. Exact interfaces and runtime verification remain later; source implementation is gated by Phase 5 approval.

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
- **Entity/Item:** [one focused Item family](../decisions/item-content-family.md) supplies reusable descriptive content structure. It replaces overlapping Entity/Item purposes. The later selection supersedes the provisional recipes-only answer; companion dispositions are closed, while exact interfaces and file migrations remain inventory/migration work.
- **File Tree:** [generalise to Tree View](../decisions/general-tree-view.md), with file-tree composition. Exact interfaces and advanced capabilities remain separate choices.
- **Sidebar:** [responsive panel](../decisions/responsive-sidebar.md) with expanded, compact collapsed and mobile Drawer presentations; routing and child behaviour stay separate.
- **TOC:** [both discovered and explicit entries](../decisions/table-of-contents.md), real heading links and current-section tracking; defaults and precedence remain open.
- **Setting Row/Setting Rows:** [remove in favour of Field/Item recipes](../decisions/settings-row-composition.md).
- **Description:** [replace with Data List](../decisions/data-list.md) for metadata pairs; KV is now explicitly selected for removal; exact replacement composition remains inventory work.
- **FormatNumber/FormatByte:** [numeric value input](../decisions/format-components.md); child content is not an alternate source.
- **Direct additions:** [Accordion, Show, Hover Card and appropriate as support](../decisions/additional-component-capabilities.md) are included. Resolve mappings and detailed contracts without repeating inclusion questions.
- **Toolbar:** Peter selected the [Group/Toolbar/selection responsibility split](../decisions/toolbar-group-responsibilities.md). Detailed composition returns with Group below.
- **Stat:** [one flexible family](../decisions/stat-family.md). Change display belongs to Stat; remove standalone Trend. Replace Stat Strip/Strip Item with composed selectable-Stat examples. Radio Cards/Checkbox Cards arranged by Group are candidates, not a chosen universal selection model.
- **Tile/Tiles:** separately selected for removal; use Card for related-content surfaces, Stat for measurements and shared layout for arrangement. Preserve compact/collapsed summaries.
- **Group/ButtonGroup:** [Group supplies compatible shared appearance defaults](../decisions/group-presentation.md), with explicit child overrides; remove ButtonGroup. Attached Radio/Checkbox Card presentation is requested. Evaluate the optional outer outline and reuse for external input add-ons.
- **Avatar Group:** [retain member limits and remaining counts](../decisions/avatar-group.md), using general Group for shared presentation.
- **List:** [add Chakra-like semantic lists](../decisions/list-component.md), including ordered/unordered, nested, plain/custom-marker and rich content. No selection engine is implied.
- **Field:** [add the shared label/control/help/error structure](../decisions/field-component.md), with required/optional and horizontal/vertical presentation. Native control values/validity and optional TanStack Form remain distinct.
- **Active indicator:** [one shared component owns Lit Motion](../decisions/shared-selection-indicator.md), including both horizontal and vertical movement/resizing. Single-selection only. The requested inset-highlight Tabs variant and Radio + Group Segmented Control direction remain subject to their detailed contracts.

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
- **Return:** the Phase 2 responsibility review is complete. Phase 4 must define contextual slots, properties, events, keyboard rules and overflow together before Phase 5 approval.
- **Later surface details:** one App Bar now replaces Appbar/Topbar, and Side Nav/Subnav become navigation compositions. Page Head/Shell are removed. Exact Toolbar/Search shadow, expanded Search interface and focus details return in Phase 4; these do not require reopening settled family purposes. The Toolbar decision does not approve those interfaces or Material visual defaults.

### Entity and Item

- **Resolved purpose/mapping:** focused Item supplies content; Card supplies a surface; controls/navigation retain behaviour. Remove Entity Content/Entity List/Items through Item parts and semantic List plus suitable Stack/Group/Card compositions. Exact markup remains Phase 4.
- **Status:** selected after the joint review: **Focused Item**. An early interrupted question selected nothing. A later recipes-only answer was held provisional after Peter requested a pattern survey; he then found shadcn Item compelling and selected the focused family after the broader composition review.
- **Why detailed composition remains open:** content structure, List meaning, Field associations, independent actions and selection-card behaviour must fit together. Their purpose split is settled enough for Phase 2; exact interfaces and valid combined markup remain inventory work.
- **Depends on:** the [Phase 2.4 Group review](README.md#24-name-collisions-between-the-new-element-list-and-geist), including items/setting-rows and the distinction between generic composition, semantic lists and selection groups. Bring forward enough Checkbox Card/Radio Card responsibility research to resolve the remaining composition and companion dispositions; exact interfaces remain for Phase 4. Check full-row selection, separate secondary actions, input labels, focus, disabled state and form ownership without assuming that interactive controls can be nested inside a row-wide button.
- **Return:** the final companion selections close this Phase 2 return point. Specify exact Item/List/Stack/Group/Card parts, safe combined markup and migration paths in Phases 4–5.
- **Later detail:** exact properties, slots, keyboard rules and implementation belong in the inventory. If earlier research is insufficient to decide the disposition, bring the necessary investigation forward rather than silently bypass the phase gate.

The Item content-family disposition and old-companion replacements are settled. Exact parts, tags, secondary-action structure and per-path migration remain inventory obligations. Setting Row/Setting Rows are now selected for removal through Field/Item recipes. Do not infer one universal interactive Item root from the retained content family.

### Sidebar, TOC and hierarchy

- **Requested review:** establish how Item, Card, Radio/Checkbox Cards and their collections using Group, List, Sidebar, TOC and relevant adjacent components work together. Include Field/Fieldset, Link/Button, Menu/Toolbar, Accordion/Collapsible, Drawer/Dialog, Scroll Area, Listbox, Data List/Table, Tabs and existing pane/layout work.
- **Selected:** general Tree View replaces the file-specific family, with File Tree as a composition. Focused Item supplies content structure. Ordinary nested navigation and TOC remain distinct from tree interaction.
- **Selected follow-up:** responsive Sidebar and TOC with both heading discovery and explicit entries. Do not repeat their inclusion or data-source choices.
- **Open details:** Sidebar presentation/focus/state transitions and dimensions, TOC heading/scroll/history policy, current-location indicator eligibility, and exact independent primary/secondary action contracts.
- **Return:** purposes and required dispositions are selected. Define the combined interfaces and acceptance cases in Phase 4 before Phase 5.
- **Indicator dependency:** investigate current-location highlighting separately from form selection. Reusing the shared single-target indicator in navigation/TOC is not automatically selected by visual resemblance.
- **Tree dependency:** stable node identity, accessible text, expansion/focus/selection, disabled states and file presentation need a contract. Checkbox propagation, multi-selection, async loading, filtering, rename/reorder, virtualization and submitted form values remain unselected advanced capabilities.

### Shared presentation and indicator contracts

- **Selected:** general Group replaces ButtonGroup for arrangement and compatible appearance defaults; Avatar Group retains member limits/counts. Field and List are added. Indicator motion lives inside one shared component and supports both horizontal and vertical orientations.
- **Open:** child participation, inherited defaults/overrides, attachment versus outer outline, independent child actions, focus visibility, nested control ownership, and exact single-selection indicator eligibility.
- **Return points:** settle remaining specialised-group and row dispositions during Phase 2.4; specify public interfaces and these combined cases in Phase 4 before Phase 5 approval.
- **Input dependency:** external add-ons can reuse attached presentation, but label/help/error association belongs with Field/control. Inner start/end content stays distinct. Do not silently add an extra consumer wrapper requirement.
- **Selection dependency:** one-selected Stat examples may use Radio Cards; multiple comparisons may use Checkbox Cards; panel switching may use Tabs. Peter's suggestions are candidates. Checkbox/multiple selection never uses the one travelling indicator.
- **Visual dependency:** the screenshot-based outlined/inset-highlight Tabs variant is additional to the existing Material primary-tab treatment. Its name, exact values and default are unselected. Radio + Group + shared indicator is the Segmented Control direction to evaluate; preserve radio/form versus tab/panel meaning.
- **Field dependency:** choose label/error ownership and migration of current embedded properties explicitly; define native and composite control participation, disabled inheritance, error timing and cross-shadow accessibility. Fieldset remains for related controls.
- **Stat dependency:** resolve helper parts, built-in meter/Spark responsibilities, formatting/loading and announcements in the inventory. Retaining Stat does not preserve every helper interface automatically.

### Results pagination

Peter asked to evaluate whether page-position text, page-size selection and navigation should be coordinated parts of Pagination, using the Pro event-log example. The [earlier recipe boundary is under review](../decisions/results-pagination.md#review-pending-after-the-chakra-ui-pro-example); application-owned data/state and unknown totals still stand. Revisit after the complete Pro review, before accepting the Pagination inventory entry. No final replacement interface is selected. [Analysis](../analysis/documentation-site.md#chakra-pro-pagination-review).

## Evidence and limits

[Living analysis](../analysis/codebase-systematization.md#phase-2-message-family) contains local code references and the comparison. [Evidence index](evidence/message-family-review-2026-09-19.json) records the sources, inspected versions and user choices. Peter's diagram is a local reference, not independent proof of community practice.

The [container analysis](../analysis/codebase-systematization.md#phase-2-container-family) contains Card, Fieldset and row comparisons. Its [evidence index](evidence/container-family-review-2026-09-19.json) records the two selections, the unanswered row question and dependency requirements.

The [complete Pro review](chakra-pro-review.md) now covers all 338 blocks, 1,003 exposed block files and 250 kit files; all seven Free Blocks aliases are byte-equivalent. The [capability synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.md) maps 15 families to source evidence, recommendations, conflicts, dependencies and return points. These are additional references under the [standing comparison rule](../decisions/reference-systems.md#standing-comparison-rule), not scope approval.

Browser evidence is limited to default preview DOM inspection and specifically recorded follow-ups, including event-log page-size change and hydrated overlay states. No exhaustive browser, screen-reader or completed house-component test is claimed. No project dependency was added. No source, generated styles, build script or publication setting changed. [Capture verification](evidence/extension-capture-verification.json) records file integrity and link checks.

The [Material review record](evidence/material-full-review-2026-09-19.json) covers 46 documentation pages: 20 layout, six interaction, and all four tabs for Toolbar, App Bar, Search, Button Groups and Segmented Buttons. It separates complete text reading, expanded token sets, inspected diagrams, untested animations and missing numeric renderings. Actual experimental Lit segmented-control source, Chakra Group/ButtonGroup and Radix/APG keyboard evidence are recorded separately. Reference measurements remain labelled; Peter permits evidence-led proposals to change house rules, not silent adoption.

## Resume here

**Phase 2 is complete.** Read [the closure](#phase-2-closure) and [terms](terms.md); Peter subsequently started [Phase 3](phase-3-review.md). No question card is open. The earlier deferred review entries retain evidence and inventory obligations; their companion-purpose votes are now resolved.

At Phase 2.4 Group, return to [Toolbar composition](#toolbar-and-group-composition), [Entity and Item](#entity-and-item), related list/content companions and Setting Row. These return points are required before the relevant responsibilities and Phase 2 close. Existing decisions remain the baseline; new evidence can support an explicit revision with Peter. Source implementation remains unapproved.

Continue research between questions without waiting for routine “continue” messages. Use the local question skill and an untimed supported question path. Phase 3 starts only when Peter says. Inventory approval and Phase 5 migration approval still precede source implementation.

Latest evidence: [Stat](evidence/stat-review-2026-09-19.json), [complete Group census and decisions](evidence/group-review-2026-09-19.json), [Field/List comparison](evidence/field-list-review-2026-09-19.json), [Material List Specs](evidence/material-list-specs-2026-09-19.json), and [Material Text Field Specs](evidence/material-field-specs-2026-09-19.json). Source and reference facts are distinguished from browser observations; no implementation acceptance is claimed.

Joint-review evidence: [row-pattern survey](evidence/row-pattern-survey-2026-09-19.json), [comparison and choices](evidence/joint-composition-review-2026-09-19.json), and [Material navigation token/figure record](evidence/material-navigation-specs-2026-09-19.json). These cover the research requested after the provisional recipes-only answer, not implementation or blanket approval of Sidebar/TOC.

The subsequent [capability checkpoint](evidence/capability-checkpoint-2026-09-19.json) records the five selected choices and direct component additions. Use this later selection record with the earlier research; its acceptance does not certify implementation.

## Disclosure, layout and smaller-component checkpoint

[Evidence and answer sequence](evidence/disposition-checkpoint-2026-09-19.json), [living source/reference analysis](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions).

- [Accordion and Collapsible](../decisions/disclosure-components.md): coordinated versus independent disclosure; replace Collapse/Collapse Group; Show remains conditional rendering.
- [Tooltip, Hover Card and Toggle Tip](../decisions/overlay-help-components.md): short help, supplementary preview and explicitly activated help; remove Context Card.
- [Explicit component removals](../decisions/component-removals.md): fifteen named components and their dedicated family cleanup. Shell removal does not decide Side Nav/Topbar/Subnav.
- [Scroll Area](../decisions/scroll-area-behaviour.md#replace-scroller): replaces Scroller with useful optional edge hints and scroll controls; content layout/virtualization remain separate.
- [Grid and Simple Grid](../decisions/layout-grid.md): ordinary layout only; remove the decorative Grid family.
- [Loading Dots](../decisions/loading-indicators.md): remove completely, including the suggested Spinner dots variant.
- [Dialog plus Alert Dialog](../decisions/dialog-components.md): the later shadcn Base Alert Dialog addition supersedes the preceding Dialog-only vote. Remove Destructive Modal; typed confirmation stays a complete composition.
- [Meter](../decisions/meter-component.md): replaces Gauge for bounded measurements; task Progress stays distinct.
- [Relative Time](../decisions/relative-time-component.md): reusable localized updating text, with a separate Hover Card example for detailed UTC/local time.
- [Dots Menu](../decisions/dots-menu-composition.md): replace with Menu/Icon Button compositions.
- [Resizable panes](../decisions/resizable-panes.md#shadcn-composition-reference): already included; add the specific shadcn reference and evaluate suitable component/layout combinations.

### Required follow-ups from this checkpoint

These are return points, not reasons to repeat the settled disposition votes.

- **Completed in Phase 2 closure:** Item/List/Group companions, other specialised groups, remaining register entries and semantic terminology clusters are resolved. Exact interfaces remain Phase 4; no required family-purpose vote is carried into implementation.
- **At Dialog/Alert Dialog inventory:** settle initial/final focus, dismissal while work runs, typed-input reset, async success/error and Menu/nested-dialog transitions. The final public scope includes both Dialog and Alert Dialog.
- **At Meter/Progress inventory:** complete Material Progress interactive token/diagram review and actual Lit implementation comparison before visual recommendations. Define measurement loading/missing/error/zero semantics and task-progress shapes; retain animated loading without invented values.
- **At layout/Resizable/Scroll Area inventory:** coordinate responsive mode changes, actual scroll viewport access, nested panes, virtual content, restored sizes, focus and RTL. The application owns saved preferences.
- **At Hover Card/Toggle Tip/Relative Time inventory:** resolve keyboard/touch/essential-content access, date input/locale/update timing and optional absolute-time presentation.
- **At Phase 5 migration:** prove full removal of obsolete interfaces and associated exports/generator inputs/docs/tests, preserving the selected capabilities through complete examples. No source implementation was done in this checkpoint.

[Material Dialog evidence](evidence/material-dialog-review-2026-09-19.json) contains full tab-reading coverage, two expanded Default Light token sets and six inspected diagrams. Its values remain reference-only; animations and house runtime accessibility are not verified.

## Flow Diagram addition

Peter selected [Flow Diagram as an interactive viewer using ELK](../decisions/flow-diagram.md). Supplied nodes/connections receive automatic layout and routing; users can pan/zoom and operate controls inside nodes. No flow authoring/reconnection or workflow execution is selected. Use a house Lit viewer with the shared stack and React wrapper, and load geometry separately when needed.

[Research and limited geometry checks](evidence/flow-diagram-review-2026-09-19.json) compare layout engines, mature renderers and Lit-native candidates. The [reference image](evidence/flow-diagram-reference-2026-09-19.png) is preserved. Exact API/scale, worker delivery, accessibility and dynamic layout stability remain inventory work. If fixed positions during rerouting become necessary, revisit the engine before approval. The ELK choice is not proof of finished browser behaviour.

Include this component in the dependency-ordered inventory and the shared state/motion/viewport work. Those companion mappings were subsequently resolved in the final Phase 2 closure.

## Phase 2 closure

Closed 2026-09-19 after recording thirteen final selections, the Stack/HStack/VStack clarification, the Forms classification correction and the complete terminology census. [Answers](evidence/phase-2-closure-2026-09-19.json), [resolved terms](terms.md), [source census](evidence/phase-2-terms-census-2026-09-19.json), [analysis](../analysis/codebase-systematization.md#phase-2-closure-review).

- Remove Entity Content/Entity List/Items through Item parts and List plus appropriate layout/surface compositions.
- Use radio-based Segmented Control, replacing old Switch/Switch Control. Keep independent persistent buttons in the Toggle Button capability replacing Chip; existing Toggle becomes Switch.
- Consolidate Appbar/Topbar into App Bar. Remove Side Nav/Subnav in favour of real-link navigation compositions.
- Remove Tags wrapper, retain Tag. Use Stack/HStack/VStack for ordinary layout and Group for its specific features.
- Remove fixed-schema Logs and provide event-log examples. Forms is a guide, not a component removal.
- Adopt full-word size tiers; separate shape from corner treatment; distinguish highlight, selection, checked, pressed, current and focus.
- Use Heading and distinct label/description/metadata/header/footer roles. Distinguish Open/Expanded/Visible. Keep shared meaning-based acme- event names.

These choices close the previously required Group/Item companion and family-purpose return points. Toolbar coordinates effective focus; nested selection/input controls retain values/forms and necessary key semantics. Exact contextual key routing and markup remain Phase 4 obligations under that selected division, not competing Phase 2 ownership proposals.

The register and semantic clusters are resolved. Architecture, complete public interfaces, exact token names/values, per-component defaults, event schemas, combined accessibility and migration paths are not approved by this closure. Material Progress and relevant Chip visual review gaps remain explicit before their visual inventory recommendations. Flow Diagram fixed-position/worker/browser limits also stand.

**Subsequent handoff:** Peter started [Phase 3](phase-3-review.md); use its current evidence audit and architecture record. Phase 4 inventory/conventions/docs and Phase 5 migration approval still precede source implementation. No files under the source/build/generator freeze changed; capture validation records the fingerprints and links.
