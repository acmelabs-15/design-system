# Design-system inventory

**Approved design — 2026-09-20 by Peter. Implementation remains gated on Phase 5.** This starts with the shared architecture already selected by Peter. The complete inventory, conventions and documentation layout are approved through “I approve all proposals.” The stated recommendations are selected; technical verification and the migration plan still precede implementation. Existing selections are carried forward rather than asked again.

The [remaining-work queue](remaining-work.md) is the complete review index. It groups the current source and selected additions into thirteen review areas, separates agent-owned checks from user choices, and states the next complete deliverable. This inventory and its linked family files are the sole owners of detailed contracts. All thirteen review groups now have assembled proposals, including conventions, documentation and tooling. The five user-owned recommendations are approved, and explicit engineering gates remain. [Approval scope and frozen texts](../decisions/inventory-approval.md).

## Complete proposal set

The original six layout entries remain below. Each other family has one owning proposal file; shared conventions apply across them. All entries are approved as design contracts under the [whole-set approval](../decisions/inventory-approval.md). Approval alone does not certify implementation. M00 is closed; implementation proceeds through the verified migration batches.

| Group | Contract owner |
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

[Coverage and replacement map](proposal-coverage.md) accounts for all 150 current source tags and all thirty extension records. [The decision register](proposal-questions.md) records all five recommendations as approved; source-defined defaults and ordinary engineering work are not another question queue. The [foundations](inventory/foundations.md) define common part/event/state/semantics contracts; family entries list their additions. Documentation units and release/tooling contracts are part of this set, not deferred omissions.

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

Prepare and review complete family proposals under the [consolidated queue](remaining-work.md#phase-4-proposal-groups). Shared-rule and helper details are prepared with their consuming components. Internal implementation choices and required tests remain agent work; only material unresolved author-facing trade-offs go to Peter. The existing dependencies and evidence gates still apply.

Peter approved every listed component/family entry, the conventions and documentation layout on 2026-09-20. Phase 5 maps them to ordered migration batches; source changes begin only after that plan is approved and its required evidence is satisfied.

## C-RESP: Shared responsive convention

**Approved contract.** Eligible properties accept a plain value, named responsive object or positional array. Names/order: compact, medium, expanded, large, extraLarge. Default starts: 0, 37.5, 52.5, 75, 100rem. Configure the four transitions once at startup; names/order stay fixed. Window is default; explicit container mode uses the nearest eligible ancestor or a named one.

Use native font bases: media-query rem follows the browser initial font, container-query rem the computed root font. Do not normalize them into an invented shared pixel basis. Between ranges include the lower bound and exclude the upper; Chakra's generated-query ordering model determines overlap, independent of object-key order.

One HTML attribute accepts plain or JSON input; Lit/React use actual values. Preserve zero/false where their property allows them. Array null/undefined skips a position. Do not reflect object/array writes automatically. Valid scalar bracketed Grid CSS must survive.

Exact condition names, equivalence/order rules, target/configuration names and input semantics are in the approved [responsive contract](#responsive-authoring-proposal) and [shared adaptation](inventory/foundations.md#responsive-layout-and-styles). Verify boundaries, fonts, nested/missing containers, malformed input and reconnect at the migration gates; approval is not runtime evidence. [Decision](../decisions/responsive-system.md), [bounded checks](evidence/responsive-spacing-review-2026-09-20.json).

## C-SPACE: Shared layout and spacing properties

**Approved contract.** Use full CSS names and logical directions, camelCase properties and kebab-case attributes, with no shorthand aliases. All six layout entries share the focused scope. Numeric inputs are selected theme keys, not pixel counts; explicit CSS values keep their authored meaning and do not receive automatic density scaling.

Use the [34 positive spacing keys plus zero](../decisions/layout-spacing-properties.md#complete-spacing-scale), defaulting to key × .25rem. Margins/insets accept signed steps where CSS permits; padding/gaps are nonnegative. Role-specific compact density is approved under the [density decision](../decisions/density.md#approved-compact-treatment); fonts/icons/borders and the pixel target floor remain separate.

Overlapping properties under one condition follow declaration order, not setter arrival or a fixed side hierarchy. Omitted CSS inputs read undefined; CSS supplies visible defaults. Native/semantic state defaults are separate. Named appearance inheritance tracks authored presence under [the conventions](inventory/foundations.md#contract-used-by-every-entry).

The approved Lit helper accepts overlapping settings together, manages supplied keys only, clears removed owned keys and reasserts current inputs on each helper/template render. Direct writes work immediately until that later render. React preserves complete prop order. The detailed [helper contract](#html-lit-and-react-authoring) and [failure adaptation](inventory/foundations.md#responsive-layout-and-styles) are approved designs; final types, scoped registry/adoption, cleanup and full property coverage remain engineering checks.

Evidence remains bounded: [order comparison](evidence/declaration-order-probe-2026-09-20.json), [React/CSS-default integration](evidence/style-input-integration-review-2026-09-20.json), [compiler/CEM](evidence/style-package-verification-2026-09-20.json), [lifecycle and original WebKit failure](evidence/lit-style-helper-review-2026-09-20.json), [ownership/batching](evidence/lit-style-ownership-review-2026-09-20.json). These do not certify a production implementation or waive the representative style-pipeline gate.

## C-SIZE: Numeric dimensions and independent theme values

**Approved contract.** Width/height and their limits accept the selected nonnegative numeric steps plus zero as size tokens, alongside valid CSS. Size and spacing categories have matching defaults and independent overrides. Do not make ratios/flex growth into size tokens or silently rescale all dimensions under density.

The complete [property table](#common-box-properties), Simple Grid minimum-width contract and [theme scope](inventory/foundations.md#theme-scope-and-customization) supply the approved interface. Verify all supported token/CSS values and literal overrides; the choice does not prove generated/native layout behavior. [Decision and evidence](../decisions/layout-spacing-properties.md#signed-spacing-and-separate-size-values).

## C-AS: Native element semantics

**Approved contract.** Retain real custom-element hosts plus native semantic roots for the structural primitives. Box, Flex, Stack/HStack/VStack, Grid, Simple Grid and Group use div/span/section/article/main/nav/aside/header/footer, default div. Box's span display is inline and other tags block by default; layout families retain their arrangement. Text uses p/span/div, default p; Heading uses h1–h6, default h2.

Use ordinary aria-label/labelledby/describedby inputs with forwarding to the actual semantic target, avoiding duplicate names and supporting required references. Native ID/class/style/slot ownership and part targets are in [the detailed semantics contract](#semantics-state-events-and-lifecycle). Arbitrary React substitution/asChild is excluded.

Real inline flow, content models, form/focus/ARIA references, native collections, scoped registries and adoption remain required engineering verification. An as tag in a template is not proof of accessible meaning. [Decision](../decisions/additional-component-capabilities.md), [bounded Chromium evidence](evidence/primitive-interfaces-review-2026-09-20.json).

## Core layout proposal for review

Prepared 2026-09-20. **The full contract is approved through Peter's whole-set approval.** The selected rules above remain authoritative. The six complete entry proposals below cover Box, Flex, Stack/HStack/VStack, Grid, Simple Grid and Group. These are house layout contracts, not Geist-census parity contracts; the former decorative Grid and ButtonGroup are replacement sources, not behavior to preserve automatically. Text/Heading and the remaining Inset/Separator/Scroll Area/Resizable contracts now live in the linked complete proposal set.

The design is approved as a whole. Named engineering checks still establish feasibility and correctness; a material failure requires a documented revision, not a silent change. Approval does not mean the outcome has been implemented or tested.

### Which layout element to use

| Need | Element | Responsibility |
| --- | --- | --- |
| A semantic container, spacing or surface | Box | Owns its box and native meaning |
| Direct control over one-dimensional layout | Flex | Exposes ordinary flex arrangement |
| A row or column with house spacing, optionally with dividers | Stack, HStack, VStack | Adds spacing defaults and automatic decorative separators |
| Explicit tracks, areas and placement | Grid | Exposes ordinary grid arrangement |
| Equal columns or automatic fitting | Simple Grid | Produces repeated columns |
| Joined controls or shared compatible appearance | Group | Adds attachment, outer outline and appearance defaults |

A component can style its own box. A Grid does not require a Box around it just to add padding. Card, selection controls, Field, Toolbar and semantic List keep their own responsibilities.

### Shared value and input contract

These proposed details complete the selected conventions for this batch. Export/type names remain proposals.

| Input | Proposed contract |
| --- | --- |
| CSS styling properties | Optional; getter is the supplied value or undefined. Every listed style input supports C-RESP. CSS supplies the visual defaults. |
| Property and attribute names | Full CSS camelCase properties and kebab-case attributes. No shorthand aliases. Component properties such as minChildWidth are documented separately from CSS properties. |
| Spacing | A selected numeric spacing key, or a string valid for that CSS property. Negative numeric keys are allowed only for margin/inset. Numeric zero is valid. A multi-value CSS shorthand is one string, not a responsive array. |
| Sizes | A selected nonnegative numeric size key, or a valid CSS size string. Proposed extension of that same type to flexBasis and minChildWidth; they do not introduce a third scale. |
| Unitless values | flexGrow/flexShrink are finite nonnegative numbers; opacity is a finite number from 0 to 1 or a valid CSS string; zIndex is an integer or a valid CSS string. Numeric aspectRatio is a positive ratio, not a size token. |
| Other CSS values | Strings following the named property's CSS grammar, including supported CSS-wide keywords, var() and calc() where valid. Type declarations provide known literals plus CSS strings. A string type alone does not establish runtime validity. |
| Color, radius and shadow tokens | Recommend standard CSS variable references for token-backed strings, such as var(--ds-gray-200), alongside literal CSS. No additional bare-name token lookup is proposed for this batch. Final custom-theme token names/registration remain R01 work; examples use existing names only. |
| Numeric HTML attributes | Parse numbers only when the property's type accepts them. For spacing/size fields a bare numeric string selects a token; explicit pixels require px. A border width of 2 requires "2px", not an invented spacing-token interpretation. |
| Booleans | Ordinary HTML presence/absence, actual booleans in Lit/React. attached="false" is still present and true; use omission to express false. Boolean component options below are not responsive. |
| Removal | Removing a supplied input restores its absence and CSS/component default. An undefined property clears it. Empty CSS attribute values clear that style input. Empty boolean attributes mean true. |
| Reflection | Object/array writes do not serialize back to attributes automatically. Property reads retain authored inputs, not resolved pixels or the currently active responsive branch. |

**Selected reference direction:** Peter answered “whatever chakra does” for invalid styling inputs. Follow Chakra's current-input CSS processing for comparable values; the proposed last-valid-value retention policy is withdrawn. Neither blanket clearing nor whole-input rollback/diagnostics is selected. Malformed HTML JSON has no direct Chakra equivalent. The [full-set proposal](inventory/foundations.md#responsive-layout-and-styles) now supplies a source-backed house adaptation from the installed Lit converter: malformed structured input produces no current override, preserving unrelated inputs and valid scalar CSS. It is proposed engineering behavior, not a new Peter vote; structural validation and browser verification remain gates. CSS variable resolution retains native CSS behavior. The complete pinned-source inspection is not a new runtime check. [Decision](../decisions/layout-spacing-properties.md#follow-chakra-for-comparable-style-inputs), [analysis](../analysis/design-foundations.md#chakra-style-input-follow-up).

### Responsive authoring proposal

Use the five selected bands and native font bases from C-RESP. Proposed public configuration is configureBreakpoints({ medium, expanded, large, extraLarge }), called once before rendering, with positive increasing rem values. Omitted entries retain defaults. A repeated identical call is harmless; a conflicting later call fails. There is no live reconfiguration. Export location is shared-package work in R13.

| Object condition | Proposed interval |
| --- | --- |
| compact | Baseline, all widths |
| medium, expanded, large, extraLarge | At or above that band's start |
| compactOnly through largeOnly | From the band's start to, but not including, the next band's start |
| extraLargeOnly | Same interval as extraLarge |
| mediumDown through extraLargeDown | Below the named band's start |
| lowerToUpper, for any two ordered distinct bands | From lower's start to, but not including, upper's start |

There is no compactDown, reverse range or unknown condition. Arrays have at most five positions in the selected order; null/undefined positions emit no declaration. An absent position does not reset an earlier band. Preserve zero and false wherever the property's type permits them. No array-valued scalar is exposed in this batch; CSS lists remain strings.

Normalize equivalent intervals before ordering: compactOnly, mediumDown and compactToMedium mean the same interval. Equal values collapse to one declaration; unequal values for equivalent intervals reject the complete input. For remaining overlaps, retain the selected Chakra model: baseline first, minimum-bearing queries by ascending lower bound, maximum-only queries by descending upper bound, and the source comparator's query-text tie-break. Use a canonical comparison key in Chakra's min/max form, with the selected exact rem bounds, separately from emitted native range syntax. The ordering must not depend on object insertion order. Verify equal-minimum bounded/unbounded cases before approval; do not replace the selected model with “narrowest wins.”

Proposed target inputs are responsiveTarget / responsive-target ("window" default, or "container") and responsiveContainer / responsive-container (optional CSS container name). They are scalar and do not inherit silently. A missing selected container applies baseline values only, with a development diagnostic; it never falls back to window thresholds. Use standard CSS container-type: inline-size and optional container-name on an ancestor. The component's host can establish a query container for descendants; it cannot query its own size as its ancestor.

The HTML converter first recognizes a property-valid scalar, then validates JSON object/array forms. This preserves Grid values such as "[content-start] 1fr". JSON parse success alone is insufficient. Dynamic font, resize, container movement and reconnect use the native query meaning already selected.

### Common box properties

The following is the approved 77-property table with values, targets and defaults. Peter approved it with the full inventory after previously selecting the shared scope across all six layouts. Each entry restricts display to its own modes. [Scope decision](../decisions/layout-spacing-properties.md#shared-styling-across-layout-components), [whole-set approval](../decisions/inventory-approval.md). Spacing/size token values come from C-SPACE/C-SIZE; no new numeric scale is added.

#### Candidate property table

| Properties | Type | Target and visual default when absent |
| --- | --- | --- |
| margin, marginInline, marginBlock, marginInlineStart, marginInlineEnd, marginBlockStart, marginBlockEnd | Signed spacing or property-valid CSS, including auto | Host; 0 |
| padding, paddingInline, paddingBlock, paddingInlineStart, paddingInlineEnd, paddingBlockStart, paddingBlockEnd | Nonnegative spacing or property-valid CSS | Host; 0 |
| width, minWidth, maxWidth, height, minHeight, maxHeight | Size token or property-valid CSS | Host; native auto/none defaults; intrinsic minimums stay native unless explicitly overridden |
| aspectRatio | Positive number or CSS ratio string | Host; auto |
| position | CSS position value | Host; static |
| inset, insetInline, insetBlock, insetInlineStart, insetInlineEnd, insetBlockStart, insetBlockEnd | Signed spacing or property-valid CSS, including auto | Host; auto |
| zIndex | Integer or CSS string | Host; auto |
| display | Entry-specific values below | Coordinates host outer display and inner arrangement; never display: contents |
| visibility | CSS visibility value | Host, inherited by contents; visible unless inherited otherwise |
| overflow, overflowX, overflowY | Native overflow grammar | Host; visible |
| opacity | Number 0–1 or CSS string | Host; 1 |
| color | CSS color, including theme variable references | Host; inherited |
| backgroundColor | CSS color, including theme variable references | Host; transparent |
| boxShadow | CSS shadow, including theme variable references | Host; none |
| borderWidth, borderInlineWidth, borderBlockWidth, borderInlineStartWidth, borderInlineEndWidth, borderBlockStartWidth, borderBlockEndWidth | CSS border-width grammar; numeric 0 also accepted | Host; 0 |
| borderStyle, borderInlineStyle, borderBlockStyle, borderInlineStartStyle, borderInlineEndStyle, borderBlockStartStyle, borderBlockEndStyle | CSS border-style grammar | Host; none |
| borderColor, borderInlineColor, borderBlockColor, borderInlineStartColor, borderInlineEndColor, borderBlockStartColor, borderBlockEndColor | Corresponding CSS color grammar | Host; currentColor |
| borderRadius, borderStartStartRadius, borderStartEndRadius, borderEndStartRadius, borderEndEndRadius | CSS radius grammar, including theme variable references; numeric 0 also accepted | Host; 0 |
| flexBasis | Size token or CSS flex-basis string | Host as a child; auto |
| flexGrow, flexShrink | Nonnegative number or CSS string | Host as a child; 0 and 1 respectively |
| alignSelf, justifySelf | Corresponding CSS alignment grammar | Host as a child; auto |
| gridArea, gridColumn, gridColumnStart, gridColumnEnd, gridRow, gridRowStart, gridRowEnd | Corresponding CSS placement string; integer grid lines accepted for Start/End | Host as a child; auto |

The seven borderWidth properties above use each property's own arity; the all-sides shorthand can take four values, logical-axis shorthands two, and single sides one. The same rule applies to borderStyle/borderColor and other shorthands. Padding never accepts negative resolved lengths. CSS invalid-at-computed-value behavior still applies to unresolved var() expressions.

Host box-sizing is border-box. Author CSS remains available for less common rules, including container declarations, backgrounds and transforms. Consumers style the host with a normal selector and the native inner element with ::part(root). Internal generated variables are not additional public hooks.

**Geometry requirement:** the host participates in its parent's layout and owns outer size, padding, borders, positioning and overflow. The native root owns semantics and, for layout entries, arranges children inside the host's content box. A single declared width must not be charged twice. Definite heights, stretching, intrinsic sizing, percentages, baseline alignment and inline wrapping must all work with the retained real boxes. This is a required outcome, not a verified wrapper algorithm; E02/E04 must establish it before entry approval. Do not hide a failed geometry case with display: contents.

### Semantics, state, events and lifecycle

**Selected:** Flex, Stack/HStack/VStack, Grid, Simple Grid and Group share Box's nine structural as values, with div default. Peter selected this extension, supported by Pro's Stack as="article" and semantic Box page regions. [Decision](../decisions/additional-component-capabilities.md#shared-structural-tags-for-layout-components). Choosing span requires valid phrasing content; it is not a way to put arbitrary blocks inside paragraphs. Semantic tag changes do not change a layout entry's flex/grid arrangement.

Standard aria-label/labelledby/describedby and an explicit role describe the native root, without a second named host role. Keep id, class, style, slot and data-* on the host; id remains the page's fragment/host reference. lang and dir preserve native inheritance through the root. hidden hides the entire component; inert retains native subtree behavior. These layout entries add no tab stop or click/keyboard behavior. External ID references and supported element-reference properties need cross-shadow verification before approval; do not promise that copying an attribute string solves it.

Each entry has one default slot, no named content slots and no new public events or methods. Native child events retain their ordinary propagation; layout does not redispatch them. The root part is public. Children stay owned by their author/framework; no cloning, moving them to a different light-DOM parent or replacing them during layout. Raw text is ordinary content in Box/Flex/Grid; automatic decoration and attachment use the member rules in the relevant entry.

Public values use canonical TanStack state and the existing Lit integration; layout measurements are derived internal data. No second public state store is added. Theme/density/dir inherit under their owning conventions; layout does not persist preferences. Ordinary layout changes have no automatic animation. Only the selected shared indicator owns its Lit Motion behavior.

On insertion, removal, slot changes, resize, font change or reconnection, refresh only the derived content/geometry needed by the entry. Disconnect releases observers/listeners and cancels pending work; reconnect derives current content without duplicating decorations or notifications. Adoption and scoped-registry behavior are E02 gates. No component claims a public refresh() workaround.

### HTML, Lit and React authoring

The following is **proposed usage**, not runnable released API. Import paths are not frozen by these examples.

Static HTML uses the existing selected attribute convention:

```html
<acme-grid
  as="main"
  grid-template-columns='{"compact":"minmax(0, 1fr)","expanded":"16rem minmax(0, 1fr)"}'
  gap="6"
  padding-inline='{"compact":4,"expanded":8}'
>
  <acme-box as="aside">Navigation content</acme-box>
  <acme-stack as="section" gap="4">
    <h1>Account</h1>
    <p>Page content</p>
  </acme-stack>
</acme-grid>
```

This demonstrates tracks, not a complete mobile Sidebar interaction. The later navigation entry owns hiding, opening and focus continuity.

Recommend the Lit helper name styleInputs. It receives one ordered object for overlapping style inputs; individual properties still exist. These are proposed names, not a new state mechanism:

```ts
html`<acme-box ${styleInputs({
  padding: 4,
  paddingInline: { compact: 6, expanded: 8 },
  backgroundColor: "var(--ds-background-100)",
})}>Content</acme-box>`
```

The selected helper rules apply: only supplied keys are managed, removed keys clear, unrelated settings remain, and each parent/helper render reasserts its current inputs. Recommend that removing the helper expression clears its remaining owned inputs, with ownership tracking preventing cleanup from erasing a newer helper's inputs. Disconnection alone is not expression removal. Mixed overlapping writers are unsupported authoring; group overlapping settings into this single input. Preserve the previously tested immediate direct-write/next-render reassertion behavior.

React wraps the same Lit components and supplies ordinary properties in declaration order:

```tsx
<Grid
  as="main"
  gridTemplateColumns={{ compact: "minmax(0, 1fr)", expanded: "16rem minmax(0, 1fr)" }}
  gap={6}
>
  <Box as="aside">Navigation content</Box>
  <Stack as="section" gap={4}>Page content</Stack>
</Grid>
```

The React order-synchronization work is part of the wrapper contract; plain @lit/react did not pass all saved ordering cases. These examples do not select new wrapper packages.

### Review choices and approval gates

The stated recommendations below are included in the whole-set approval. Keep source limits and verification gates; do not reopen a source-defined detail as a preference question.

| Review point | Recommendation | Consequence |
| --- | --- | --- |
| Shared surface across layouts | **Selected:** shared focused styling scope and Box's nine native tags/default; exact table details and root-part contract remain proposed | Authors style layouts and express structural meaning directly; geometry and accessibility verification remain required |
| Group appearance propagation | Proposed size and variant defaults; return with the R04–R06 child contracts before selecting their exact shared values | Replaces ButtonGroup defaults without applying arbitrary settings to descendants; do not approve a compatibility promise before the children are specified |
| Styling input failures | **Selected direction:** match Chakra for comparable CSS inputs; malformed HTML JSON/house responsive structure remains open | Withdraw previous-value retention; establish the converter-specific result without claiming Chakra defines it |
| Narrow automatic grids | **Resolved from the assigned Chakra source:** preserve the authored minimum width; no automatic clamp | A true minimum may overflow; this is no longer a queued preference question |

Remaining public names/defaults in the tables form a coherent contract, not separate votes. Where an established reference supplies a detail, inspect and apply it under the [standing instruction](../decisions/reference-systems.md#follow-the-established-reference-without-another-preference-question); ask only about a material unresolved gap or conflict. Peter has approved the complete entries. Source-derived resolutions are not extra individual user votes.

**Required engineering verification for the approved entries:** close real-host geometry/semantics, complete responsive ordering/parser cases and the unresolved converter failure contract, helper cleanup and scoped-registry feasibility, wrapped-line separator correction, and Group compatibility/visual focus checks. R01 must define actual theme scope/token/density settings; R04–R06 must confirm Group's child values and selection/input participation. These are bounded dependencies, not permission to restart every earlier investigation.

**Before Phase 5 implementation approval:** also close the existing representative generated-style/package gates. The six proposals do not close all of R01 or R02. The source ledger and engineering return points are in the [proposal analysis](../analysis/design-foundations.md#core-layout-contract-proposal).

## L-01: Box

**Approved design; implementation remains gated.** Tag acme-box; React Box. Inclusion, the nine as tags, default tag/display, parent placement and token/CSS surface values are already selected. The [common contract](#common-box-properties) supplies every property/type/default/target, responsive input, native attribute, slot, part and lifecycle rule.

Box supplies a semantic container and its own surface. It does not arrange children with flex/grid, substitute for Card's content contract, or own interaction.

| Additional/restricted input | Proposed type and default |
| --- | --- |
| as | div, span, section, article, main, nav, aside, header, footer; div |
| display | Responsive none, inline, inline-block or block; CSS default inline for span and block otherwise |
| responsiveTarget, responsiveContainer | Shared target contract; window and undefined |

No additional properties, named slots, events, methods or component states. part="root" identifies the native semantic element. The host owns the common box styling. Source [Box decision](../decisions/box-primitive.md), [reference/local comparison](../analysis/design-foundations.md#box-primitive) and [candidate evidence](evidence/box-contract-review-2026-09-20.json) remain the basis.

**Acceptance:** inline phrasing wraps across lines; block/inline-block sizing; fixed/min/max dimensions; overflow and positioned descendants; all logical edges in RTL; ordinary and responsive parent Grid/Flex placement; name/role forwarding without duplicates; equivalent HTML/Lit/React results. Confirm zero, theme changes, removal, pre-upgrade inputs and reconnect. An inner span tag alone is not evidence that the two-box inline layout works.

## L-02: Stack family

**Approved design; implementation remains gated.** Tags acme-stack, acme-h-stack, acme-v-stack; React Stack, HStack, VStack. All use the common contract. They arrange children with house spacing. Group retains attachment/default propagation; Stack owns no selection, form or keyboard state.

| Additional/restricted input | Type | Visual/component default |
| --- | --- | --- |
| as | Shared nine structural tags | div |
| display | Responsive flex, inline-flex or none | flex |
| flexDirection — Stack only | Responsive row, row-reverse, column, column-reverse | column, from the established Chakra source |
| HStack/VStack direction | No direction input on named forms | row / column, selected |
| alignItems | Responsive native CSS alignment string | stretch for Stack; center for HStack/VStack, selected |
| justifyContent | Responsive native CSS justification string | flex-start |
| alignContent | Responsive native CSS alignment string | stretch |
| flexWrap | Responsive nowrap, wrap, wrap-reverse | nowrap |
| gap, rowGap, columnGap | Responsive nonnegative spacing/CSS | gap token 2 selected; axis values override by declaration order |
| separator | Boolean | false |

All CSS-input getters are undefined when absent, including gap/direction/alignment. separator is a semantic option with false default. Separator nodes are internal; public part="separator" styles their line, alongside part="root". Proposed hooks: --acme-stack-separator-color defaults to var(--ds-gray-200), --acme-stack-separator-width defaults to 1px, and --acme-stack-separator-inset defaults to 0. Width is line thickness and cannot be negative. Defaults derive from the current house Separator, not Material spacing.

With separator enabled, each visible gap along a line has one divider and the effective main-axis gap on **each side**, as selected: total distance is 2 × gap + thickness. The main gap is columnGap for a row and rowGap for a column, falling back to gap. Between wrapped lines, use the other ordinary axis gap; do not double it. Derive neighbors in visual order after direction/RTL/reversal/wrapping. No leading, trailing or cross-line dividers.

Eligible automatic-divider members are direct assigned element children with rendered boxes. Ignore comments, whitespace and display:none/hidden children; visibility:hidden retains geometry. Non-whitespace raw text remains renderable ordinary Stack content, but disables automatic separators with a development diagnostic: authors wrap it in a semantic element for the decorated pattern. Nested descendants are not additional members. A zero-size rendered element remains a member. Explicit CSS order affects visual adjacency, not DOM reading order.

```html
<acme-h-stack gap="2" align-items="center" separator>
  <span>Draft</span>
  <span>Saved just now</span>
</acme-h-stack>
```

**Acceptance:** the shared cases plus all three forms, reverse/RTL, unequal sizes, wrapping in either axis, rowGap/columnGap, zero gap, hidden members, insertion/removal/reordering and font/width changes. Verify no orphan dividers, unchanged child identity/events, decorative accessibility and no extra focus stops. The existing wrap probe proves the reference defect, not this proposed correction. [Decision](../decisions/stack-layout.md), [source review](../analysis/design-foundations.md#spacing-scale-and-separator-follow-up).

## L-03: Simple Grid

**Approved design; implementation remains gated.** Tag acme-simple-grid; React SimpleGrid. Uses the common contract. Column counts, minimum child widths and minimum-width precedence are selected. It lays out content, without owning data processing, selection or keyboard navigation.

| Additional/restricted input | Type | Visual/component default |
| --- | --- | --- |
| as | Shared structural tags | div |
| display | Responsive grid, inline-grid or none | grid |
| columns | Responsive positive integer; undefined removes input | No authored column count; native implicit Grid behavior |
| minChildWidth | Responsive nonnegative size token or CSS fixed track minimum: nonnegative length/percentage, calc() or var(); zero is explicit, absence is undefined | absent |
| gap, rowGap, columnGap | Responsive nonnegative spacing/CSS | 0 |
| alignItems, justifyItems, alignContent, justifyContent | Responsive corresponding CSS grammar | Native normal behavior |
| gridAutoRows | Responsive CSS auto-row track sizes | auto |

columns and minChildWidth read undefined when omitted. Do not introduce a columns=1 override absent from the reference; ordinary unplaced children follow native implicit row-flow layout, while explicit child placement can create additional tracks. No gridTemplateColumns input competes with these modes; use Grid for manual tracks. No Grid Cell element is required; child layout primitives use their common placement properties.

Follow Chakra's component-level mode choice before responsive mapping: a valid supplied minChildWidth selects minimum-width mode for the component, and columns does not control it at other widths. Counts produce repeat(n, minmax(0, 1fr)); minimum widths produce repeat(auto-fit, minmax(width, 1fr)). Empty tracks collapse under auto-fit. Removing the complete minChildWidth input returns to column-count mode. A skipped responsive position preserves an earlier value within the chosen mode; before any value applies there is no track override from that input, not a fallback to columns. This corrects the earlier draft's unsupported per-width mode switching. [Source-defined contract](../decisions/layout-grid.md#source-defined-sizing-details).

The numeric zero case is an explicit proposed house normalization: preserve the selected zero size token and test for supplied valid input, not JavaScript truthiness. Chakra's raw numeric 0 and CSS string "0px" take different branches; do not describe the house's consistent zero treatment as byte-for-byte source behavior. Column count 0 remains invalid. Verify zero-minimum track behavior before approval.

**Source-defined overflow behavior:** honor the minimum as authored, matching the inspected Chakra expression under Peter's standing reference instruction. Do not silently clamp a 20rem minimum to a 12rem container. Authors who need a fitting minimum can supply "min(100%, 20rem)" where valid. Long child content can overflow its grid area; minWidth={0}, text wrapping or Scroll Area remain explicit author choices. Confirm percentage/function track grammar before accepting a value; auto/fr/negative values are not fixed minima for this mode. CSS variable resolution retains native limitations. The overflow preference question is retired; runtime verification remains required.

```html
<acme-simple-grid columns='{"compact":1,"medium":2,"large":3}' gap="4">
  <article>First item</article>
  <article>Second item</article>
</acme-simple-grid>
<acme-simple-grid min-child-width="min(100%, 18rem)" gap="4">
  <article>Automatically fitted item</article>
</acme-simple-grid>
```

Public parts/slots/events are the shared root/default/none. **Acceptance:** both modes separately/together, transitions/removal, 1 and large counts, invalid zero/non-integer column counts, explicit zero minimum width, fewer items than tracks, empty content, named grid lines in other CSS inputs, narrow containers, intrinsic overflow, RTL and dynamic children. [Decision](../decisions/layout-grid.md#simple-grid-sizing-modes), [reference](../analysis/design-foundations.md#simple-grid-sizing-modes).

## L-04: Flex

**Approved design; implementation remains gated.** Tag acme-flex; React Flex. Uses the common contract. It is the direct flex-layout option without Stack separators/default gap or Group appearance behavior.

| Additional/restricted input | Type | Visual/component default |
| --- | --- | --- |
| as | Shared structural tags | div |
| display | Responsive flex, inline-flex or none | flex |
| flexDirection | Responsive row, row-reverse, column, column-reverse | row |
| flexWrap | Responsive nowrap, wrap, wrap-reverse | nowrap |
| alignItems, alignContent, justifyContent | Responsive corresponding CSS grammar | normal, normal, normal |
| gap, rowGap, columnGap | Responsive nonnegative spacing/CSS | 0 |

Display maps the requested outer block/inline mode to the real host and flex layout to the inner root. No duplicate direction/align/justify/wrap/inline aliases. Use child flexBasis/flexGrow/flexShrink/alignSelf on the child host; these are not confused with the parent's arrangement inputs.

```html
<acme-flex align-items="center" justify-content="space-between" flex-wrap="wrap" gap="3">
  <h2>Deliveries</h2>
  <div>Actions</div>
</acme-flex>
```

Shared root/default-slot/no-event contract applies. **Acceptance:** main/cross alignment, wrapping, reverse/RTL, equal/unequal growth, shrinking with intrinsic content, baseline alignment, percentages and definite height; same outer geometry in HTML/Lit/React. Source [pinned Chakra Flex](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/components/flex/flex.tsx); house full-CSS names deliberately replace reference aliases. Pro event-log and lesson layouts inform composition.

## L-05: Grid

**Approved design; implementation remains gated.** Tag acme-grid; React Grid. Uses the common contract. It exposes native track and alignment concepts. The removed decorative Grid/Cell/Cross/System/Page family does not return.

| Additional/restricted input | Type | Visual/component default |
| --- | --- | --- |
| as | Shared structural tags | div |
| display | Responsive grid, inline-grid or none | grid |
| gridTemplateColumns, gridTemplateRows | Responsive CSS track-list string | none |
| gridTemplateAreas | Responsive CSS named-area string | none |
| gridAutoColumns, gridAutoRows | Responsive CSS implicit-track sizes | auto |
| gridAutoFlow | Responsive row, column, dense, row dense, column dense | row |
| alignItems, justifyItems, alignContent, justifyContent | Responsive corresponding CSS grammar | normal |
| gap, rowGap, columnGap | Responsive nonnegative spacing/CSS | 0 |

Named lines and areas are authored as ordinary CSS strings. Grid supplies no numeric column-count alias; use Simple Grid or repeat() for that. Browser support determines advanced CSS track features; subgrid across the retained host/root boundary is **not** promised by accepting a string. It needs a separate feasibility result before being advertised as supported.

The shared page example demonstrates Grid plus Box/Stack. For a named region, use a child Box grid-area="content". Visual order never changes DOM reading/tab order; documentation must show meaningful source order. There are no row/cell parts or data-table semantics.

Shared root/default-slot/no-event contract applies. **Acceptance:** tracks/areas, bracketed scalar CSS, implicit rows/columns, placement/span, auto flow including dense, intrinsic/percentage sizing, RTL, overflow and responsive changes; check host/root effects and reading order. [Grid decision](../decisions/layout-grid.md), [Chakra source](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/components/grid/grid.tsx), [Radix props](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/grid.props.tsx).

## T-01: Text

The complete Text contract is now owned by [the typography proposal](inventory/typography.md#shared-typography-interface). This retained anchor redirects earlier analysis links; it is not a competing partial draft.

## T-02: Heading

The complete Heading contract is now owned by [the typography proposal](inventory/typography.md#shared-typography-interface), including native meaning, styles and TOC dependency. The selected h2 default/h1–h6 set stands.

## G-01: Group

**Approved design; implementation remains gated.** Tag acme-group; React Group. General Group replaces ButtonGroup. It combines the common box contract with joined edges and compatible child defaults. It supplies no selected value, form submission, disabled-state owner or arrow-key manager.

### Properties and defaults

| Additional/restricted input | Proposed type | Visual/component default |
| --- | --- | --- |
| as | Shared nine structural tags | div |
| display | Responsive flex, inline-flex or none | inline-flex; grow selects flex when display is omitted |
| orientation | Responsive horizontal or vertical | horizontal; getter horizontal when omitted |
| attached | Boolean | false |
| outline | Boolean | false; independent of attached |
| grow | Boolean | false |
| flexWrap | Responsive nowrap, wrap, wrap-reverse | nowrap |
| alignItems, alignContent, justifyContent | Responsive native CSS values | center, normal, flex-start |
| gap, rowGap, columnGap | Responsive nonnegative spacing/CSS | gap token 2, mapping Chakra's .5rem default to the selected house scale |
| size | Optional full-word child-size value; scalar | undefined; no default supplied |
| variant | Optional child-variant string; scalar | undefined; no default supplied |

orientation is a component option, not a CSS styling property, so its getter has the stated default. Horizontal means row in the current text direction; vertical means column. There is no separate flexDirection property. No value, checked, selected, disabled, loading, name or form property is added. No palette, radius or arbitrary-prop provider is proposed in this first compatibility set; the Group's own common radius/color inputs style its own box.

CSS getters retain undefined when omitted. attached forces zero inter-member gap; authored gap values remain readable and take effect when attachment is off. When grow is true, eligible members use equal flex growth with zero basis, subject to intrinsic/minimum sizes. It does not erase a child's explicit width/minimum. Explicit display overrides grow's block-display default.

### Compatible defaults and membership

Recommend only size and variant as shared defaults. Explicit child values win; unsupported inherited values leave the child's own default intact and issue a development diagnostic. Invalid child appearance values remain part of the child-enum contract; the Chakra CSS-input direction does not automatically define them. The Group does not coerce a value into a different size or appearance. Nested Groups start fresh as selected; ordinary theme inheritance still crosses the boundary.

This matrix and the explicit supported value subsets in the approved action/selection/input files define eligibility:

| Child family | Attachment | Shared size | Shared variant | Other owner |
| --- | --- | --- | --- | --- |
| Button, Icon Button, button-based Copy/Toggle actions | Yes, on the actual button surface | Yes, when listed in that child contract | Yes, when listed in that child contract | Action/control owns activation, loading and disabled state |
| Radio Card, Checkbox Card | Yes, on the card surface | Yes, when supported | Yes, when supported | Radio/Checkbox family owns selection, forms and keyboard behavior |
| Input/select surface with external add-on controls | Internal reuse required; public participation only through the control's documented interface | Only where that control declares the value | Only where that control declares the value | Input/Field owns value, labels, validity and submission |
| Group nested as a direct member | Nested Group keeps its own defaults; no automatic outer attachment | No outer inheritance | No outer inheritance | Inner Group owns its members |
| Plain content, arbitrary native elements, unrelated components | No automatic attachment | No | No | Author retains semantics/styling |

The exact full-word size tiers and variants come from the approved R04–R06 child contracts. This is one dependency, not a license to pass any string into every component. An arbitrary native button cannot participate in the house attachment protocol merely because it has a button tag.

Direct assigned participating elements are members. Do not query all descendants. Hidden/display:none members leave the sequence; visibility:hidden keeps its box. Nonparticipating visible content breaks an attached run; it is laid out normally and gets no corner/border mutations. Raw text remains content, but creates no attachable surface. Slot changes, membership, hide/show and reordering update runs. CSS order is not supported for attached members: preserve DOM/member order and issue a development diagnostic if author styles reorder them. Ordinary wrapping remains allowed and uses member-order corners without per-line correction, as selected.

### Border, corners, focus and slots

One default slot; no new events or methods. part="root" identifies the native arrangement/semantic element. The Group host draws the optional outer border; no second independently sized outline wrapper is added.

Proposed public custom properties:

| Hook | Proposed default | Meaning |
| --- | --- | --- |
| --acme-group-outline-color | var(--ds-gray-200) | Optional outer border color |
| --acme-group-outline-width | 1px | Outer border thickness |
| --acme-group-outline-radius | var(--acme-radius) | Outer border corner radius |
| --acme-group-outline-padding | 0 | Padding inside the optional outer border |

For an outlined inset-control presentation, authors supply padding (for example token 1) on Group. This does not change the selected independence of outline and attachment. Explicit common border/padding/radius inputs override the corresponding outline defaults; all overrides remain on the same host surface, not a double border.

attached joins eligible surfaces with zero gap, removes their internal adjoining corner radii and combines coincident resting borders into one seam. Outer endpoints retain the child's appropriate outer corners. Do not hardcode a negative 1px overlap for every theme border width. An outer outline replaces only coincident perimeter strokes; inset child borders remain intentional surfaces. Focus rings and invalid/selected indicators stay visible above resting seams; the outer outline never substitutes for the focused child's own indication.

Unequal-height controls can attach, but attachment does not promise a single smooth perimeter unless their surfaces align. The proposed default center alignment follows Chakra; use alignItems="stretch" when a composition needs matching cross-axis bounds. Wrapped attachment keeps selected member-order corners. The optional outer border encloses the entire Group, not each wrapped row.

The attachment protocol addresses documented participating surfaces, not arbitrary shadow selectors. Generated house styles own normal/hover/focus/disabled/selected/error seams. Representative visuals must establish the precise corner/seam treatment before approval; these prose outcomes do not constitute rendered verification.

### Composition examples and boundaries

Proposed ordinary action usage, using child appearance names only after their contracts confirm them:

```html
<acme-group attached aria-label="Document actions" role="group">
  <acme-button>Save</acme-button>
  <acme-button>Duplicate</acme-button>
</acme-group>
```

No shared child size/variant string is invented for this example. A Toolbar can contain this presentation where it also needs coordinated focus. Group alone keeps normal child Tab behavior.

Required selection composition, with **conceptual ownership rather than unapproved tag/slot syntax**:

```text
Radio Group — owns one value, validation and radio keyboard behavior
  Group — supplies attached/outlined presentation
    Radio Card — owns one choice and its content
    Radio Card — owns one choice and its content
  Shared active indicator — internal; follows the selected card via Lit Motion

Checkbox Group — owns multiple values
  Group — supplies attached/outlined presentation
    Checkbox Card
    Checkbox Card
  Each card draws its own selected state; no travelling indicator
```

The indicator is not a public Group property or consumer-installed animation. The single-selection family connects its selected target to the shared indicator. That component handles both orientations, resize, interruption and reduced motion.

Required input composition:

```text
Field — owns label, help and error associations
  Input composition — owns native value, validity and submission
    External start add-on | input surface | external end action
    Shared attachment rules align the outer edges and seams
    Inside start/end content stays inside the input surface
```

This does not require a new public Group wrapper around every Input. The Input entry decides the exact parts/slots while reusing the approved presentation rules. A nested button remains an independent focusable action, not part of the text input's accessible name.

### Acceptance and dependencies

Verify Button/Icon Button, Radio Cards, Checkbox Cards, outlined single-selection presentation, Toolbar nesting and input add-ons. Cover inherited versus explicit appearances, unsupported values, nested Groups, nonmembers, one/zero members, wrapping, hidden/reordered members, different border widths/heights, horizontal/vertical, RTL, keyboard focus, selected/invalid/focus combinations, reduced motion and disconnect/reconnect. Controls retain exactly one value/event/submission owner.

Group's property/ownership contract and R04–R06 compatibility subsets are approved. Common host/semantics checks and actual visual/behavior verification remain required before implementation acceptance.

Sources: [Group decision](../decisions/group-presentation.md), [complete Chakra/Pro review](../analysis/codebase-systematization.md#comprehensive-chakra-group-review), [review ledger](evidence/group-review-2026-09-19.json), [Toolbar split](../decisions/toolbar-group-responsibilities.md), [indicator](../decisions/shared-selection-indicator.md), [source follow-up](../analysis/design-foundations.md#core-layout-contract-proposal).
