# Design foundations: Phase 1 extension

Research checkpoint, 2026-09-19. This is a living analysis, not an approved inventory. The [request register](../alignment/additional-functionality-review.md) tracks all additions and their status.

## Selected scope

Support [full visual themes on pages and sections](../decisions/custom-themes.md) and a [blue default accent](../decisions/blue-accent.md). Motion and shapes are recorded in the existing [animation analysis](animation-package.md#phase-1-extension-material-motion-and-shapes). [Responsive scope and defaults](../decisions/responsive-system.md) and [Box](../decisions/box-primitive.md) are now selected; the complete Material aesthetic is not adopted.

## Local evidence

- docs-src/pages/components/button.ts:64–67: the Custom example uses --ds-blue-700 with white text, #0B7BFE on hover, and blue borders. Effective colours have several fallback/gamut definitions. The later sRGB contrast probe below measures this example; wider-gamut and complete control-state checks remain open.
- src/components/button/button.styles.ts uses gray-1000 for the current default background and per-state custom variables for the custom variant. Shared semantic accent roles require a coordinated generator change.
- src/shared/state.ts:48–75: Theme is auto/light/dark and updates the document root.
- src/base.ts:171–203: all registered hosts get data-dark from document.documentElement, not from their closest themed section. Nested CSS colour overrides alone do not establish correct nested theme behaviour.
- A scan of generated style modules found width conditions at 400/401, 540, 560, 600/601, 760, 768/769, 900, 960/961, 992 and 1200/1201, plus a Scroller 470–670 range. These are local observations, not proof that every component-specific limit should be replaced by one global threshold.

## Sources read

The supplied Material foundation main content was read across layout overview/parts/adaptive design; scaffold overview/bars/rails/panes; grids/spacing/density; all five width bands; RTL; feed/list-detail/supporting-pane examples; customization; token overview/use; gestures/inputs/selection/states. The [source snapshot](../alignment/evidence/additional-functionality-2026-09-19.md) preserves every supplied URL.

Additional implementation references:
- [Material Web theming](https://github.com/material-components/material-web/blob/main/docs/theming/README.md), [colour](https://github.com/material-components/material-web/blob/main/docs/theming/color.md), [shape](https://github.com/material-components/material-web/blob/main/docs/theming/shape.md).
- [Chakra responsive design](https://chakra-ui.com/docs/styling/responsive-design) and [theming source](https://github.com/chakra-ui/chakra-ui/blob/main/apps/www/content/docs/theming/overview.mdx).
- [Radix Theme](https://www.radix-ui.com/themes/docs/components/theme), [breakpoints](https://www.radix-ui.com/themes/docs/theme/breakpoints), [layout](https://www.radix-ui.com/themes/docs/overview/layout).

Material Web exposes scoped CSS custom properties for colour, typography and shape. Its theming guide explicitly does not claim reference-palette or system-motion token support. Its inspected component tree does not supply a complete Scaffold/Pane/layout system. Tokens without a component are not implementation evidence.

## Responsive system

**Selected:** [responsive layout and appearance, Material bands, and font-relative thresholds](../decisions/responsive-system.md). Exact property syntax, names, ranges and per-property support remain for the inventory.

Material's five reference bands change at 600, 840, 1200 and 1600. Peter chose them separately from Chakra-style authoring capabilities. At a 16px browser default, the direct rem conversion is 37.5, 52.5, 75 and 100; larger browser defaults move the thresholds wider.

Chakra 3.37.0 source and its published breakpoint builder were read, including normalization/conditions/unit conversion. Its defaults are base plus 30/48/62/80/96rem. Radix uses initial plus 520/768/1024/1280/1640px. Both demonstrate responsive property values; their defaults are comparison data, not our selected widths.

Chakra also offers ranges, only/down targeting, hideFrom/hideBelow and custom thresholds. These capabilities informed the proposal. Arrays, shorthand names and complete CSS-as-props coverage were not separately selected.

### Existing house implementation

src/components/grid/grid.ts already exports Responsive<T>, an attribute JSON converter, restrict and breakpointVars. Grid accepts responsive rows/columns/height; Grid Cell and Grid Cross use those helpers. Generated Grid styles contain viewport and container queries, and use-container exists.

That is evidence for a usable platform path, not an approved general interface. Its required sm key, neighbour-filling order, optional xl in the type and truthy fallback operators require review before reuse. The current implementation is tied to the decorative Grid family. No current responsive helper was changed.

### Reference discrepancies and boundary tests

Chakra's requested page says smDown includes the small band, while the published 3.37.0 builder sets its maximum just below that band's starting threshold. At the default 16px conversion, smDown is below 480px, not the full 480–768 band. Its ranges use the upper named threshold as an exclusive boundary adjusted by 0.04px. Define the house semantics explicitly and test boundary/fractional widths rather than copying ambiguous prose.

The [CSS Media Queries specification](https://drafts.csswg.org/mediaqueries-4/#units) bases relative lengths on initial font values/user preferences, not page declarations. Chakra's FAQ also mentions changing HTML font size; that should not be repeated as a guarantee about media-query thresholds. Browser-default font scaling and page-authored theme font sizes are distinct.

[Source and findings record](../alignment/evidence/responsive-review-2026-09-19.json). Browser behaviour of the final house responsive implementation has not been tested.

## Box primitive

[Peter selected Box](../decisions/box-primitive.md). [Chakra's implementation](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/box/index.ts) is chakra("div"), connected to the shared styling factory. The docs expose theme/style and responsive props. [Radix Box](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/box.tsx) combines common margin/layout definitions with display and div/span/asChild options.

Material Web's targeted repository search found no equivalent Box/layout/container component. The current house Card adds a visual treatment and Panel adds heading/body/footer structure; neither is the same general role.

Box earns its planned place through the shared theme/responsive contract. Keep child arrangement and Card treatment distinguishable. The inventory must define its finite interface and real host-box behaviour. Chakra's changing-tag/asChild mechanism is not automatically a Lit-host capability, and internal composition must not add unnecessary wrapper boxes.

## Other findings and work ahead

- Scaffold, feed, list-detail and supporting-pane guidance provides candidate recipes. Peter has now selected resizable panes, optional collapse and application-owned preference saving below. Fixed arrangements still follow the composition-over-count rule.
- Adaptive layout should preserve selection, scroll context and user resizing choices. These requirements still need code mapping and acceptance cases.
- Density is separate from text size. Material recommends opt-in density and sufficient hit targets; its 48dp target is not silently adopted as every house control's visible size.
- RTL needs logical placement, keyboard direction and selective icon mirroring. Charts, media and time-related direction can be exceptions; a global transform is not a complete solution.
- Colour roles, shape, type and state values need a documented theme contract. Contrast and layout checks remain necessary for custom themes.
- Android predictive-back and XR recommendations are not automatically web features.

The responsive scope/default choices are resolved. The blue contrast direction and optional-ripple default are now selected below. Remaining work includes the full control/theme/state acceptance matrix and broader code/reference/capability map. Detailed component boundaries and public interfaces belong to the later phases.

## Resizable panes

**Current implementation strategy:** [native Lit ports using the full house stack](../decisions/zag-behaviour-ports.md) supersede the earlier Zag runtime/adapter selection described below. Pane resizing, collapse and saving capabilities remain selected. The port may be a new component and uses TanStack Store, Lit Motion, generated styles and the other applicable house tools. Zag is a behaviour/source reference.

The 2026-09-19 walkthrough selected four related choices in sequence: user resizing by drag and keyboard; @zag-js/splitter; optional collapse with previous-size restoration; and application-owned saving across reloads. [Decision](../decisions/resizable-panes.md). These choices do not approve a general scaffold element or settle the existing Panel/Shell dispositions.

### Current implementation and references

Read src/components/panels/panels.ts, panel/panel.ts, shell/shell.ts and appbar/appbar.ts in full. Panels provides equal grid columns with a one-column rule at 900px. Panel provides heading/body/footer presentation; Shell provides sidebar/topbar/content slots; Appbar provides sticky navigation. None of these inspected implementations supplies a user-operated divider, saved sizes or pane collapse/restore. The pointer/resize scan found handlers for other controls, not an existing layout splitter.

The full [Material panes page](https://m3.material.io/foundations/layout/scaffold/panes) describes fixed/flexible panes; single/two/three-pane arrangements; permanent/temporary content; resizing and snapping; and persistent versus temporary sizing preferences. Its 360/412dp snap suggestions, three-pane recommendation and XR guidance are reference facts, not adopted house limits or new scope. It also describes side-by-side, floating and docked presentation, and show/hide/reflow transitions. Those broader recipes and focus/reading-order contracts still need the scheduled foundation/inventory review.

[Chakra Splitter docs](https://chakra-ui.com/docs/components/splitter), its component source and its underlying Ark use-splitter implementation were read. Chakra styles Ark's parts; Ark connects the Zag machine with root and direction context. It supports orientation, multiple/nested panes, size limits, collapse, controlled sizes and keyboard interaction. Material Web's complete, non-truncated tree search found no pane/splitter/scaffold implementation under those names. Radix Primitives' inspected Separator is a static role/orientation wrapper, not a resizing engine. The [package comparison](package-choices.md#resizable-pane-package-comparison) includes other implementations.

### Collapse and saving

Peter chose optional collapse, reopening at the previous open size within current constraints. The [W3C window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) describes restoration on Enter; its page also states that the APG example/review remains incomplete, so it is guidance rather than tested implementation evidence. Focusable splitters need correct labels, orientation, controls and current/minimum/maximum values. Hidden pane contents must not leave unreachable focus targets; the final focus/visibility contract remains to design and test.

Zag's published collapsePanel stores the current size before collapse; expandPanel reads it, with minimum-size fallback and constraint handling. The keyboard collapseOrExpandPanel instead calculates expansion from minimum size and does not use that same saved-size path. The source establishes a behavioural difference; no keyboard-collapse browser test was run. Do not treat package adoption as proof that previous-size restoration already works for every trigger.

Material recommends persistent preferences for most resizable layouts and temporary preferences for some supporting panes. Peter chose **application-owned saving**, allowing either policy. [Chakra's storage example](https://github.com/chakra-ui/chakra-ui/blob/main/apps/compositions/src/examples/splitter-with-storage.tsx) saves size through an application hook on resize end. It is evidence for ownership, not a complete recipe for our selected restore behaviour: saving only a collapsed size loses the prior open size.

The house contract must expose sizes, collapsed state and previous open sizes, with change events and saving examples. Browser storage, account storage, keys and choosing not to save belong to the application. Local src/shared/state.ts currently persists the theme; that existing special case does not establish a pane-storage policy. No storage helper or dependency was added.

### Status and next subject

Source review and synthetic package probes are saved in [pane evidence](../alignment/evidence/resizable-panes-2026-09-19.json). The Lit/TanStack integration, ARIA/keyboard corrections, state restoration, responsive behaviour and three-engine verification remain pending. Exact names and interfaces remain in later phases. The later density, RTL, layout and interaction follow-up is recorded below. Do not repeat the four pane questions.

## Density and interaction targets

[Peter selected shared density](../decisions/density.md) in three answers: optional page/section spacing changes without shrinking text; normal inherited spacing for menus/dialogs/Toasts; and a 24 × 24 CSS-pixel clickable-area floor for explicitly selected compact controls, with larger touch-friendly sizing available. These selections do not set every control to 24px or adopt 48px as a universal normal-mode target.

Local source distinguishes several existing concepts: Button has tiny/small/medium/large sizes, Input has size variants, Table has default/compact density and Panel has tight padding. Input/button size styles can change text size as well as geometry. Table's compact style reduces vertical cell padding from 10px to 5px without changing its 14px text. Menu Item and ComboBox Option share popover-row tokens; Dialog and Toast have their own padding. These are source observations, not measured target-area passes.

The full [Material density page](https://m3.material.io/foundations/layout/grids-spacing/density) separates information layout from component scaling, keeps text size stable under density, describes opt-in scaling and cautions against compact menus/dialogs/notifications. Its negative-number scale, 4dp steps and 48px target guidance are reference values, not automatically selected house settings. Its recommendation not to change density automatically across breakpoints is recorded for later preference/responsive design; it does not revoke the already selected responsive size/appearance capabilities.

[Material Web's touch-target SCSS](https://github.com/material-components/material-web/blob/main/button/internal/_touch-target.scss) separates a 48px-high target from the visible control and offers wrapper margins or no extra target. This does not prove a universal 48 × 48 result in every component. Its Menu and Dialog SCSS were read: spacing is component-specific; whole-library density is not established by those files. Their display:contents wrappers are not approved for the house system.

Chakra's Input/Menu recipes change text styles as part of component size; Dialog sizes mainly change its maximum width while body/header/footer padding is separately defined. Radix Theme's inspected scaling option explicitly scales spacing, font sizes and line heights. These differ from the selected spacing-only density meaning.

Read W3C's full explanations of [2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [2.5.5 Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html). The former is 24 × 24 CSS pixels with defined exceptions; the latter is 44 × 44 with its own exceptions. Neither is identical to Material's 48px guidance. Actual target geometry matters: rounded/clipped shapes, adjacent or overlapping controls, labels and expanded hit areas must be checked. The chosen compact floor is not a whole-product conformance certification. No browser target-size audit ran.

## Right-to-left support

[Peter selected both directions](../decisions/bidirectional-support.md) for pages and nested sections in both frameworks. The full [Material RTL guide](https://m3.material.io/foundations/layout/bidirectionality-rtl) distinguishes alignment from text direction, mirrors directional navigation, and identifies media/clock/time/chart and language-specific exceptions. Preserve mixed-direction emails, URLs and numbers. Do not turn these examples into indiscriminate icon/image flipping or automatically add Android predictive-back support.

Local evidence: src/shared/roving-tabindex.ts:46–47 maps Left/Up to previous and Right/Down to next without reading direction. Tabs passes its assigned elements in order. switch.ts:95–96, currently the segmented-control concept, also uses fixed left/right advancement. calendar.ts:270–281 maps days without reading direction. Slider already reads computed direction for pointer values and horizontal keys (slider.ts:210, :299–314). Partial support is not a complete interaction contract; no RTL browser test ran in this follow-up.

Actual [Material Web Tabs](https://github.com/material-components/material-web/blob/main/tabs/internal/tabs.ts) reads computed direction when deciding whether a horizontal arrow advances the tab index. [Chakra's RTL guide](https://chakra-ui.com/guides/overview-rtl-support) separates HTML direction from the locale/direction context used by Ark behaviour. [Radix Direction](https://github.com/radix-ui/primitives/blob/main/packages/react/direction/src/direction.tsx) resolves an explicit direction, provider direction or LTR default. These are implementation references; no new provider/package interface is selected yet.

## Common layout recipes

The full Material [feed](https://m3.material.io/foundations/layout/canonical-examples/feed), [list-detail](https://m3.material.io/foundations/layout/canonical-examples/list-detail) and [supporting-pane](https://m3.material.io/foundations/layout/canonical-examples/supporting-pane) pages were reread and mapped to the planned building blocks. Under the existing composition rule, these remain recipe candidates rather than newly approved standalone elements:

- Feed: responsive Grid/Stack, spacing and container composition; the application supplies/loads content. Preserve meaningful item and reading order as columns change.
- List-detail: one or two visible sections with application-owned selected record/navigation. Examples must cover Back navigation, empty details and preserved selection/scroll position. Resizable panes provide the optional adjustable divider. Material itself makes some single-pane choices product-dependent; do not hardcode them as a universal data/navigation engine.
- Supporting pane: primary content and related secondary content beside or below it. Compose responsive layout, optional resizing/collapse and an appropriate Drawer presentation where needed. The source's 360dp side width is not an approved house default.

Chakra SimpleGrid documents explicit columns, auto-fit/minimum-child-width, spans and gaps. Radix Grid exposes responsive layout/margin properties. Current grid.ts remains tied to decorative guides; Panels uses equal columns and a fixed 900px switch. Their names/shapes do not establish the planned generic layout primitives. Material Web has no identified production implementation of these complete patterns. The inventory must approve the final recipes and ensure their focus, state and scroll behaviour works; no recipe was built here.

## Interaction and theme follow-up

Read the full main content of Material gestures, inputs, selection, state overview, state layers and applying-states pages. Gesture guidance covers tap, long press, scroll, swipe, drag, pinch and combined gestures. It is a set of interaction references, not blanket approval for new drag-reorder, map/zoom or Android gesture engines. Existing/selected controls supply the concrete use cases. Preserve native scrolling, text selection, browser zoom and usable alternatives to gestures in their acceptance contracts.

Material's input guidance covers devices used together, independent of window size. Therefore a narrow viewport does not establish touch input and a large one does not establish mouse input. Its generic statements about Escape removing focus and disabled navigation must be reconciled with each web widget's platform/accessibility contract; do not copy them globally. The house optional-ripple decision stands.

The state-layer page initially scraped only interactive-table labels. Retrying with onlyMainContent:false exposed the full main text and values: hover .08, focus .10, press .10, drag .16, with .38 shown in the disabled table entry. It describes one visual state layer at a time, while the applying-states page allows combined interaction states. Do not confuse combined semantic states with stacking every opacity. These are reference findings, not adoption of a new house opacity palette. Earlier illustrative .08/.12 contrast calculations remain explicitly hypothetical; they were not these measured/published Material values.

Actual Material Web Ripple separates touch delay, release/click and cancellation, tracks the initiating pointer and clears visual state when disabled. Radix Slider's inspected implementation commits on pointerup; it does not provide a complete pointer-cancellation path. Zag Slider defines distinct POINTER_UP and POINTER_CANCEL actions, but its tracking helper wiring was not fully audited. None of these facts alone certifies a complete reference implementation or adopts Zag Slider. [Local cancellation/cleanup findings](codebase-systematization.md#interaction-cancellation-and-cleanup) identify concrete later checks.

The full Material token overview/use pages explain reusable reference values, system roles, component roles and contextual values. They support a consistent theme contract; they do not select Material's token names, Figma plugin, DSP format or a token-processing dependency. Rechecked local base.ts:171–203: dark-state attributes follow the document root, so nested theme behaviour needs more than colour overrides. state.ts:48–75 only persists auto/light/dark; tools/geist/vars.ts and scripts/split-css.ts own generated theme/CSS delivery. The selected custom-theme capability needs role-based values, correct section/overlay inheritance and combined density/direction/state checks through that pipeline. Exact schema and naming remain in later phases.

[Foundation follow-up evidence](../alignment/evidence/foundation-followup-2026-09-19.json) preserves the source material, selections and probe limits. The subsequent [Phase 1 closure audit](../alignment/additional-functionality-review.md#phase-1-closure-audit) separates completed research from the interface and implementation checks assigned to later phases. This closed the foundation investigation before Phase 2; the current checkpoint is in the [pass handoff](../alignment/README.md#where-we-are). No source implementation or completed browser acceptance is implied.

## Blue accent contrast and visual choice

Researched and selected 2026-09-19. [Peter chose darker blue with white text](../decisions/blue-accent.md). The [evidence record](../alignment/evidence/blue-control-review-2026-09-19.json) preserves the browser output, method and comparison values.

### Measured example

A temporary read-only Bun server served the existing docs at http://127.0.0.1:4199/components/button#custom. An isolated Chrome 153 page read the Custom button's internal control. Its text was 14px, weight 500, opacity 1. The browser reported no P3 gamut support. The probe temporarily set theme and interaction attributes, disabled transitions for static measurement, then restored the attributes and styles. It measures CSS states, not complete pointer or keyboard behaviour.

- Light and dark rest/pressed: white on rgb(0,114,245), **4.4440306525:1** after 8-bit sRGB conversion.
- Light and dark hover/focus: white on #0B7BFE, **3.9783543836:1**.
- The exact fractional HSL conversion of blue-700 gives 4.436143744:1; the small conversion difference does not change the failure.
- Root tokens.css and docs/tokens.css had the same SHA-256, recorded in the evidence. A stale copied token file does not explain these results.

The [W3C contrast explanation](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) requires 4.5:1 for normal text, including hover/focus text. Do not round a value below the threshold into a pass. Inactive controls are exempt from that text criterion; their usability still needs review.

### Visual comparison and selected direction

The [saved comparison](/Users/peterkloss/.codex/visualizations/2026/09/11/01a08f33-2059-7b23-9412-209b913e74ab/blue-button-options.html) shows both options in light and dark surroundings:

- **A, selected:** white text; #0062D1 rest (5.72556:1), #0068D6 hover (5.31493:1).
- **B:** black text; #0072F5 rest (4.72544:1), #0B7BFE hover (5.27856:1).

The preview uses 14px/500 text, a 160 by 36px button and a 6px corner radius. These are comparison settings, not a newly approved size contract. Peter's reply was “Yup, let's go with A.” The choice fixes the darker-blue/white-text direction; final state tokens can still be refined.

### Remaining checks

Do not use a palette ordinal as a cross-theme semantic role: the observed blue-900 supports white text at 5.31493:1 in light mode but only 2.49886:1 in dark mode. Define shared accent roles deliberately. Verify non-text contrast, focus rings, relevant control states, theme scopes, wide-gamut definitions and all required engines before acceptance.

[Ripples are optional and off by default](../decisions/optional-ripples.md). An illustrative calculation overlays white on #0062D1: 8% gives 4.94958:1, 12% gives 4.59476:1, and both together (19.04% effective) give 4.02274:1 against white text. These are hypothetical opacity choices, not measured Material token values or the final house implementation. They show why combined states must be checked; separate passing states do not establish a passing combination.

## Full Material layout and interaction follow-up

The Toolbar/Group review read all 20 Layout pages Peter supplied and six Interaction pages, including both companions to States Overview. The [coverage and source findings](../alignment/evidence/material-full-review-2026-09-19.json) distinguish complete prose/table/caption reading from inspected diagrams and untested animations. The new [standing review method](../decisions/reference-systems.md#complete-material-documentation-review) applies to future relevant questions.

Peter clarified the comparison rule: **Material's values are reference evidence; new evidence may nevertheless justify an explicit proposed change to our rules.** Record the source value and unit, the current house decision, the benefit/cost of changing it, and affected earlier and upcoming choices. Existing rules remain effective until he selects a revision. No spacing, density, target-size or shape value changed in this review.

### Adaptive layout and panes

Material's current scaffold uses bars, rails and panes as regions. Grids and spacing can make relationships explicit through boundaries or implicit through proximity. The inspected column diagram shows 4 compact, 8 medium/expanded and 12 large/extra-large columns; it does not label a universal gutter size. Rulers align safety regions, titles and content without necessarily becoming DOM elements.

Material recommends one pane at compact, usually one at medium, usually two at expanded/large, and at most three at extra-large. Fixed examples use 360dp at expanded and 412dp at larger widths; a 400dp maximum side sheet is a documented exception. These are reference recommendations, not new house defaults. A visually centred split can include the navigation region in one half, so it need not mean equal content-pane widths.

Material recommends preserving user pane sizes and collapsed state across app closure and breakpoint changes, with resetting allowed for temporary supporting panes. This informs our still-open responsive restoration contract; it does not transfer saving from the application to the component. The list-detail guidance preserves selected item and navigation context, with a separate multi-selection exception when collapsing. Generic Group, selected-value ownership and pane navigation must remain distinct.

Return to these details in the responsive and resizable-pane inventory entries, alongside focus/scroll continuity, temporary-pane exceptions and application-owned persistence. The Pro playground and cart's independent mobile/desktop values supply concrete counterexamples for continuity checks.

### Density, spacing and interaction

The full density page distinguishes information layout from component spacing, keeps text unchanged, and says not to automatically change the user's density preference on orientation or breakpoint changes. Its 48dp/48 CSS-pixel guidance and 4dp spacing steps are Material values. Our selected explicit compact 24 × 24 CSS-pixel floor remains the recorded house decision, with actual target geometry still requiring checks. The density-setting control's own target size is a later review case, not a newly approved exception.

The browser diagrams confirm the difference between visible geometry and interaction area: Material shows a 24dp icon and a 36dp-high button inside 48dp targets. The density equation table's 240dp cell spans all three pixel-density rows; the earlier extraction gap was a merged cell, not missing values. Keep physical pixels, dp, CSS pixels and rem distinct.

Selection, focus and a transient state layer are separate. Material allows focus and selection to coexist while applying one visual state layer at a time; it does not specify a complete priority algorithm among simultaneous transient states. Its general disabled-focus and Escape-clearing advice must be reconciled with web widget semantics. Optional ripples, house focus treatment and Lit Motion remain the baseline unless new evidence supports a separately selected revision.

Return spacing/density proposals to the shared conventions and affected component inventory entries. Check the chosen Group/Toolbar/selection split, responsive behaviour and overlay density together before proposing a global adjustment.
