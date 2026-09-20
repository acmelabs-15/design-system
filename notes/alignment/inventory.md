# Design-system inventory

**Draft. Not approved for implementation.** This starts with the shared architecture already selected by Peter. Component entries, exact interfaces, conventions and documentation entries remain to be completed and approved under Phase 4. Existing selections are carried forward rather than asked again.

## Shared architecture carried forward

### Overlay lifetime, placement and coordination

**Confirmed direction:** composable Lit controllers and native surfaces. Floating UI owns anchored placement; Lit Motion owns motion; TanStack owns state. Components own markup and their specific focus/dismissal policies. Modal resources remain until the owned exit ends; reopening cancels exit and removal cleans up immediately.

Consumers include Dialog, Alert Dialog, Drawer, Menu, Select/ComboBox and the relevant help surfaces. Their exact contracts are defined in their component entries; a shared lifetime does not make all of these behave like dialogs.

**Acceptance:** nested overlays, close/reopen interruption, obsolete placement results, removed openers, reduced motion, unrelated child animations, disconnect/reconnect and exactly-once cleanup. Test the affected implementations in Chromium, Firefox and WebKit.

**Still to specify:** controller interfaces, coordination relationships and per-family native surface modes. [Decision](../decisions/overlay-architecture.md).

### Canonical state and public properties

**Confirmed direction:** public state properties read and write canonical TanStack state. Lit owns property metadata, attributes and rendering. Evaluate the existing atomState, StoreSelector and StoreEffect integrations before replacing them.

**Evidence:** a focused scratch refinement passes 24 public-state checks in happy-dom and Chromium, eleven existing regression tests and a strict helper type check. This establishes feasibility, not a final universal decorator.

**Acceptance:** every supported write path keeps public and derived state current; reflected attributes and named changes agree; defaults, upgrade, inheritance, equality, batching and reconnect retain their specified behaviour. Validate the actual compiler, CEM output, React wrapper and all three engines as their implementation batches land.

**Still to specify:** final helper composition and enforcement of its authoring rules; avoid leaving decorator order as an undocumented trap. [Decision](../decisions/public-state-bridge.md), [candidate evidence](evidence/existing-state-integration-2026-09-19.json).

### Native form mechanics

**Confirmed direction:** one shared native-form module owns association, submission, reset, effective disabled state, validity reporting and restoration. Controls supply serialization and validation rules. Composite controls submit one value. Field owns label/help/error associations. Optional TanStack Form binds the same value contract.

**Evidence:** immediate native synchronization passes all fifteen targeted Chromium text-control cases; render-cycle synchronization fails six. A controller with a small native callback bridge is feasible. This does not select its final packaging.

**Acceptance:** immediate submission/validity, reset, own versus inherited disabled state, first-legend exceptions, external form ownership, restoration, one composite value, validity focus, Field associations and managed-form integration. Cover relevant control families and all three engines. Calling a restoration callback directly is not browser-history or autofill verification.

**Still to specify:** callback bridge, per-control mappings and validation/event contracts. [Decision](../decisions/native-form-architecture.md), [comparison](evidence/native-form-mechanism-2026-09-19.json).

### Effective theme and preference storage

**Confirmed direction:** nested scopes inherit appearance and can override it. Components and their overlays follow the relevant scope. Effective-theme resolution is separate from saving preferences; importing a component does not change the page's theme.

**Acceptance:** nested and moved scopes, local overrides, custom themes, system preference and changes while overlays are open. Group appearance defaults and density exceptions retain their own contracts.

**Still to specify:** scope authoring, minimum runtime metadata and propagation for consumers that need values in JavaScript. Preserve CSS inheritance; do not repeat global root-to-host mirroring. [Decision](../decisions/theme-resolution-architecture.md), [foundation evidence](../analysis/design-foundations.md).

### Style production

**Confirmed direction:** compiled CSS feeds generated Lit style modules. Document tokens, global/recipe styles, registrations and metadata have explicit outputs. Do not reverse-parse generated Lit modules to produce other assets.

**Before Phase 5 implementation approval:** verify a representative house-style pipeline, escaping, scope conversion, registration defaults/inheritance/conflicts, deterministic output, invalid-input failures, selective imports and useful source maps. Verify representative rendered outcomes in Chromium, Firefox and WebKit. This is the existing style-production decision's evidence gate; inventory drafting does not waive or postpone it.

**Phase 6 acceptance:** verify the full implemented pipeline and all affected components, including complete build ordering, generated output, escaping/minification, selective delivery, registrations and source maps. Implementation regression checks supplement the pre-approval evidence.

**Still to specify:** compiler/tool choice and final source/output layout. [Decision](../decisions/style-production.md), [comparison](evidence/style-pipeline-comparison-2026-09-19.json).

## Content and interaction architecture recommendations

These are proposals, not additional Peter decisions or approved component interfaces.

- **Content tracking:** refine the existing Places module around content actually assigned to the host's declared slots. The current default descendant query can count a nested child's slot, and its observer watches child lists but not slot-attribute changes. Keep required first-render and reconnect behaviour. Resolve slot ownership in the relevant component inventory entries.
- **Interaction cleanup:** refine the existing Interaction module so it owns temporary pointer listeners and their cancellation/teardown. Keep visual interaction state separate from selection, form values and component-specific commit rules. The existing source and saved cancellation probe justify this work; they do not justify a new global gesture engine. [Evidence](../analysis/codebase-systematization.md#interaction-cancellation-and-cleanup).

## Component review order

Start with Group and ordinary layout, then typography, Icon/Icon Button, selection controls, inputs, Card/Item/Toolbar/Stat/Field/List and the remaining families. Bring each settled decision into the draft before asking about the remaining interface choices. Each complete entry must include the Phase 4 fields listed in the [pass plan](README.md#42-every-element).

Approval of every component row, conventions and documentation layout remains required. Phase 5 then maps these contracts to ordered migration batches; source changes begin only after that plan is approved.

## C-RESP: Shared responsive convention

**Selected capabilities, incomplete convention:** eligible layout, typography, size and appearance properties accept a plain value, named responsive object or positional responsive array. The five names and array order are compact, medium, expanded, large and extraLarge. Default thresholds are 0, 37.5, 52.5, 75 and 100rem; the first band is the baseline, not an additional transition. One application-wide configuration can adjust the four ordered font-relative transitions while preserving names and order. Window width is the default. Container width is explicitly selected and requires an established query container.

**Selected range capability:** responsive objects support one-band, below-threshold and between-threshold values. Match Chakra's between-threshold meaning: lower bound included, upper bound excluded. mediumToLarge covers medium and expanded, stopping where large begins. Use native CSS comparisons for exact boundaries rather than its fractional adjustment. The complete condition-name set and overlap precedence remain to specify; conflicting Down prose is not approved.

**Selected font basis:** follow native CSS. Window-query rem uses the browser's initial/default font size; container-query rem uses the computed root font size. An authored root-font change can therefore change a container threshold without changing its corresponding window threshold. Do not add normalization to force equal thresholds. [Clarification](../decisions/responsive-system.md#native-font-basis-for-each-query-mode).

**Required before approval of dependent entries:** define HTML serialization and Lit/React property forms, skipped positions, scalar values that themselves contain arrays, the complete range-name mapping and overlap precedence, container declaration/selection and the application-wide configuration interface/lifecycle. Draft direction is JSON attributes with corresponding JavaScript property values, using the existing converter approach; exact validation/reset behaviour is unapproved. The agent drafts from source evidence; Peter decides remaining author-facing trade-offs. Return here before final Group/layout/typography approval. Do not repeat the selected formats, names, query modes, native font bases, configurable widths, range capability or between-threshold boundary meaning.

**Acceptance:** identical meaning in static HTML, Lit and React; exact and fractional width boundaries; browser-default and authored root-font changes with the selected distinct query bases; nested query containers; missing container; zero/false values; skipped array positions; invalid input; resize and reconnect. These are future verification requirements, not tests claimed as complete.

[Decision](../decisions/responsive-system.md), [source and answers](evidence/phase-4-checkpoint-2026-09-19.json).

## C-SPACE: Shared layout and spacing properties

**Selected, incomplete convention:** use full CSS names and logical inline/block directions, with camelCase JavaScript properties and kebab-case HTML attributes. For example, paddingInline maps to padding-inline; there is no parallel px alias. This convention applies to the focused shared layout set, not every semantic component property.

Spacing properties accept numbered theme keys and valid explicit CSS lengths/expressions. A numeric key identifies a theme entry rather than that many pixels. Literal values are explicit overrides and do not receive automatic density scaling. Standard unitless CSS values, including zero where valid, follow their property grammar.

**Required before dependent row approval:** enumerate supported keys and default values, spacing/density mapping, each property's allowed values and CSS expressions, and precedence for overlapping shorthand/axis/side assignments. Verify zero values and property removal explicitly. Token naming does not approve a complete third-party scale or its units. [Decision](../decisions/layout-spacing-properties.md), [evidence](evidence/layout-contract-review-2026-09-19.json).

## C-AS: Native element semantics

**Selected, incomplete convention:** suitable primitives expose as with documented native tag sets. They retain their Lit custom-element host and render the selected native semantic element inside it. React wraps the same implementation. Arbitrary HTML/custom React substitution and asChild are not selected. Interactive behaviour belongs to dedicated controls.

Heading's set is h1–h6, default h2. Text defaults to p and supports span for inline use. Final additional Text tags and Box structural tags require review. Define which native attributes apply to the host and which reach the semantic element; avoid duplicate accessible roles/names or broken label, focus and fragment-target relationships.

Before approving these entries, verify the proposed structure against native content models and layout requirements. Browser checks in implementation must cover nested/slotted content, accessible heading levels, inline/block layout and supplied attributes. A semantic name in source is not a completed accessibility check. [Decision](../decisions/additional-component-capabilities.md#primitive-tag-sets-and-typography-defaults).

## L-01: Box

**Status: draft; inclusion, focused styling scope and suitable as support are selected.** Proposed tag: acme-box. A house general container, not a retained Geist census component.

Box owns spacing, dimensions, positioning, visibility and surface appearance, using a focused shared property set with theme values and C-RESP. Uncommon styling uses ordinary CSS. Flex/Stack/Grid add arrangement rules; Card supplies its defined content-surface treatment. Composing primitives does not require an unnecessary nested Box instance.

Content uses the default slot. No new action/value event, selection state, keyboard manager or form ownership is proposed. Supplied content retains its semantics and events. The host keeps a real box.

**Open before row approval:** exact property names/types/defaults and token mapping; supported structural tags and default tag; CSS styling targets and native attribute forwarding; query-container declaration and selection; combinations with dimension, overflow and positioning rules. Evidence comes from the [Box decision](../decisions/box-primitive.md#focused-styling-interface), [foundation comparison](../analysis/design-foundations.md#box-primitive) and [source census](evidence/layout-typography-review-2026-09-19.json).

## L-02: Stack family

**Status: draft; inclusion, gap token 2 and named-direction rules are selected.** Proposed tags are acme-stack, acme-h-stack and acme-v-stack; exact tag spellings remain for entry approval. These are house layout primitives, not a claim of Geist census parity.

The family arranges default-slot children with a gap. It shares the focused layout/spacing properties without requiring nested Box elements. It supplies no selection, form value, keyboard-navigation owner or new public action event. Group remains the owner of joined/shared-appearance behaviour.

**Selected:** default gap is spacing token 2, currently 8px; authors can override it, including zero. Theme/density may change the token's value. HStack and VStack retain their named directions in the component interface. General Stack supports responsive direction through C-RESP. Exact direction-property spelling must follow the full-name convention without exposing duplicate shorthand aliases.

**Open before row approval:** general Stack's default direction; complete property list/types/defaults; cross-axis alignment and justification; wrapping; supported semantic tags; separator composition and content participation. A reference's optional separator feature is not automatically selected. Native CSS can still override consumer styling; the fixed-direction selection concerns component properties.

**Acceptance:** fixed named directions, responsive general Stack, zero/explicit/token gaps, RTL, intrinsic child sizing, wrapping/overflow under the final contract, hidden/reordered/slotted children and event/semantic preservation. Verify final native boxes rather than assume React-style child handling transfers to Lit. [Decision](../decisions/stack-layout.md), [source/census](evidence/layout-contract-review-2026-09-19.json).

## T-01: Text

**Status: draft; p default and suitable as tag sets are selected.** Proposed tag: acme-text. Native p semantics by default; as="span" supplies inline phrasing inside the retained custom-element host. Additional tags remain to specify.

The inventory must include the already-requested size, weight, truncate and lineClamp capabilities, with eligible visual settings using C-RESP. House typography/theme values determine appearance; native paragraph margins are not adopted without style review. Content uses the default slot and can compose suitable inline primitives. Text owns no control value or activation; native descendants retain their events.

**Open before row approval:** exact tag set, attribute forwarding, size/weight types and defaults, color/alignment/wrapping interface, token values and truncation interaction rules. Verify native content models, slotted inline content and accessible text rather than infer them from the source tag. [Semantic decision](../decisions/additional-component-capabilities.md#primitive-tag-sets-and-typography-defaults), [source evidence](evidence/layout-typography-review-2026-09-19.json).

## T-02: Heading

**Status: draft; h2 default and h1–h6 set are selected.** Proposed tag: acme-heading. as selects the semantic level independently of visual size. It renders a native heading within the retained Lit host.

The inventory must include the requested size, weight, truncate and lineClamp capabilities; eligible visual settings use C-RESP. Default-slot content may compose appropriate inline primitives. It does not create navigation, selection or disclosure behaviour itself.

**Open before row approval:** exact visual property types/defaults and house tokens, attribute forwarding, inline content rules and truncation interaction. Verify heading structure and accessible levels in page, Card, Dialog and other compositions. Component defaults do not establish the correct level in every document. [Semantic decision](../decisions/additional-component-capabilities.md#primitive-tag-sets-and-typography-defaults), [source evidence](evidence/layout-typography-review-2026-09-19.json).

## G-01: Group

**Status: draft for review. Inclusion and responsibility are confirmed; the property proposal below is not approved.** Proposed tag: acme-group. This is a house primitive informed by Chakra Group and the requested compositions, not a Geist census element. There is no current src/components/group/group.ts to preserve; ButtonGroup is the selected replacement target.

### Purpose and composition

Group supplies attached edges and compatible shared appearance defaults. Stack/HStack/VStack supply ordinary layout. Group contains real child boxes and keeps a real host box.

Required consumers are Button/Icon Button combinations, Radio Cards, Checkbox Cards, Segmented Control, applicable Toolbar content and external input add-ons. Input may reuse the same internal attached-presentation rules without requiring a new consumer wrapper. Inside start/end content stays part of Input's own content interface.

Selection groups own values, keyboard selection and forms. Toolbar owns coordinated focus where appropriate. The shared active-indicator component owns Lit Motion; eligible single-selection controls supply its target. Checkbox collections have no travelling indicator. General Group neither invents a value nor changes a child's role.

### Property proposal

The responsive value syntax and token types below depend on the shared conventions review; the meanings are explicit even where the final TypeScript alias is not yet named.

- orientation: horizontal or vertical, responsive where supported; proposed default horizontal. Horizontal follows document direction.
- attached: boolean; proposed default false. Joins participating child edges and coordinates their outer corners.
- outline: boolean; proposed name and default false. Adds one surrounding outline independently of attachment. Peter selected allowing either setting or both. Exact token values and final property spelling remain in visual review.
- grow: boolean; proposed default false. Participating children share the available main-axis space.
- flexWrap / flex-wrap: CSS values nowrap, wrap and wrap-reverse, with the normal nowrap default. This applies the selected full-CSS-name convention; no wrap shorthand alias is proposed. Follow Chakra's independent wrapping/attached behaviour. Attached corners follow member order; there is no per-wrapped-row corner calculation. Final responsive serialization follows C-RESP.
- gap: shared spacing value, responsive where supported. Unattached spacing uses the agreed house spacing scale. Attached presentation uses its defined adjoining-edge treatment; it does not silently retain a gap between joined edges. Exact default token remains part of the spacing convention review.
- size: optional full-word size default for compatible children. Unset leaves the child's effective size unchanged. Each child family lists the supported tiers; unsupported tiers must not silently map to arbitrary sizes.
- Additional shared appearance defaults: include only settings supported by an explicit child-family compatibility matrix. Final variant/palette/radius names are not frozen here. Explicit child values override defaults. Each nested Group starts a fresh set; unspecified settings use component defaults rather than outer Group defaults. Theme inheritance remains separate.

No Group-level value, checked, selected, loading or form-submission property is proposed. A disabled Fieldset or the relevant control family retains disabled semantics; generic Group does not disable every descendant by accident.

### Slots, events and states

- Default slot: participating children and any explicitly documented non-participating content. Nested descendants are not automatically members of the outer Group.
- No new public event is proposed for arrangement or appearance propagation. Child public events bubble once; Group does not redispatch them.
- Internal state: participating members, their rendered order and applicable appearance defaults. These are derived from content/configuration. First/middle/last/only edge markers are internal presentation details unless a later extension contract explicitly exposes them.
- Native role/ARIA can name a semantic group where appropriate. Group itself supplies no tab stop, arrow-key manager or selection role.

### Behaviour and visuals

Insertion, removal, reordering and hiding must update the attached edges. Hidden members do not leave a visible gap or incorrect outer corner. Support both orientations and RTL. Keep individual focus indicators visible above borders and selected backgrounds. A shared outer outline must not be the only indication of which child is focused.

Inputs with external add-ons, Buttons and selection cards may have different internal DOM. Participation must target the actual styled box without display:contents, arbitrary property forwarding or reaching into undocumented shadow markup. Define the internal participation interface once; each participating component explicitly implements it.

For single-selection presentation, selected-target changes go to the shared indicator. Reordering, resizing, scroll, orientation changes and removal must not alter the selection owner. Reduced motion follows the indicator contract. General attached appearance does not itself require motion.

Geist remains the foundation for house tokens. Chakra's reviewed joining/default patterns and the complete Pro compositions supply structural evidence. The user's outline and segmented-control images supply requested visual direction. Material tab treatment continues to apply to its selected Tabs variant; none of these references silently replaces house spacing or density.

### Settled choices and remaining dependencies

- G-01-A — **CONFIRMED:** follow Chakra; wrapping can coexist with attached, with member-order corner rules. The proposed single-line restriction is not selected.
- G-01-B — **CONFIRMED:** follow Chakra's nested provider behaviour; start fresh at each Group. The proposed per-setting merge through ancestor Groups is not selected.
- G-01-C — **CONFIRMED:** the outer border and attachment are independent settings.
- Shared responsive capabilities are selected in C-RESP. Exact serialization, spacing tokens and appearance-property names return in the conventions review before this entry is approved.
- The selection/input entries define their participation and focus contracts against this entry. Toolbar key routing and Field/native forms remain separate.

### Acceptance

Verify mixed Button/Icon Button, attached Radio Cards, attached Checkbox Cards, outlined Segmented Control, Toolbar nesting and Input add-ons. Cover explicit child overrides, nested Group, unsupported settings, text/non-participant content, hidden/reordered members, unequal child heights, RTL, responsive orientation, keyboard focus, reduced motion and disconnect/reconnect. Each selected control continues to submit and emit its own value exactly once. No implementation or completed runtime check is claimed by this draft.

Sources: [Group decision](../decisions/group-presentation.md), [complete Chakra/Pro review](../analysis/codebase-systematization.md#comprehensive-chakra-group-review), [review ledger](evidence/group-review-2026-09-19.json), [Toolbar split](../decisions/toolbar-group-responsibilities.md), [indicator](../decisions/shared-selection-indicator.md), [responsive direction](../decisions/responsive-system.md).
