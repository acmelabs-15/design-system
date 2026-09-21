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

### Phase 4 authoring choices

Peter selected both named objects and positional arrays, alongside plain values. He selected compact, medium, expanded, large and extraLarge as the five band names and array order. Existing font-relative transitions remain 37.5, 52.5, 75 and 100rem. He also selected window and explicitly chosen container widths, with window width as the default and authors establishing the query container.

The current Grid source already reads JSON object/array attributes and exposes useContainer, but its required sm key, neighbour filling and truthy fallback rules are not the new contract. The Chakra responsive page was re-read for its object/array capabilities; CSS size-query guidance establishes the container mechanism. The earlier Chakra Down-range discrepancy remains unresolved by those capability choices. JSON serialization and Chakra ordering are now selected below. Specify skipped positions, exact condition/validation rules and container declaration syntax before approving dependent inventory entries. [Decision](../decisions/responsive-system.md), [answers and source scope](../alignment/evidence/phase-4-checkpoint-2026-09-19.json).

The next review selected application-wide adjustment of the four ordered font-relative transitions, retaining fixed names/array order and Material defaults. Chakra's complete customization/breakpoint pages demonstrate configurable systems; Radix documents fixed built-in widths. The complete Pro index search found documentation and fixture/metadata matches, not a demonstrated custom-breakpoint implementation. Docs Kit's theming prose lists widths that differ from current Chakra defaults; this is not evidence of active configuration. Preserve source roles.

Peter also selected one-band, below-threshold and between-threshold targeting in responsive objects. The complete pinned Chakra breakpoints.ts was re-read: Down uses a maximum below the band's start, Only uses the next band's start as its upper edge, and between conditions end below the upper named threshold. Peter subsequently selected Chakra's range meaning with native CSS boundaries: include the lower threshold and exclude the upper one. Its 0.04px adjustment is not copied. Complete condition names, native-range implementation of the selected Chakra ordering and configuration delivery remain to specify. [Capability choices](../alignment/evidence/layout-typography-review-2026-09-19.json), [boundary choice](../alignment/evidence/layout-contract-review-2026-09-19.json).

### Container targets, startup configuration and query ordering

Peter selected nearest-or-named ancestor targeting in container mode, with nearest eligible container as the unnamed default. Viewport remains the default overall query mode. He selected application-wide transition widths configured at startup before components render; live replacement is outside that configuration contract. Resizing and native font-relative changes remain supported. Exact declaration/target syntax and initialization interface remain inventory work.

Native CSS documentation supplies the named-container mechanism. A lexical scan read all 1,253 indexed Pro files for literal container-type/name and @container patterns, with no matches. That is a bounded search result, not proof that no dynamic or differently expressed container use exists. It neither removes the selected capability nor establishes a Pro implementation to copy.

The complete pinned Chakra sort-at-params.ts and conditions.ts were read. Generated queries are ordered by query category/length and lexical ties before CSS cascade resolves matching declarations. This does not establish a universal narrowest-range-wins rule. Peter subsequently selected this ordering model explicitly on 2026-09-20. Specify complete ordering/equivalence examples for native range syntax before final approval rather than copying regexes written for min/max syntax. [Evidence and six choices](../alignment/evidence/query-stack-grid-review-2026-09-19.json).

**Selected:** [responsive layout and appearance, Material bands, font-relative thresholds, Material names, objects/arrays and both query modes](../decisions/responsive-system.md). JSON serialization and Chakra ordering are selected; exact validation, condition mapping and per-property support remain for the inventory.

Material's five reference bands change at 600, 840, 1200 and 1600. Peter chose them separately from Chakra-style authoring capabilities. For window queries at a 16px browser default, the direct rem conversion is 37.5, 52.5, 75 and 100; larger browser defaults move those thresholds wider. Container-query font resolution is clarified below.

Chakra 3.37.0 source and its published breakpoint builder were read, including normalization/conditions/unit conversion. Its defaults are base plus 30/48/62/80/96rem. Radix uses initial plus 520/768/1024/1280/1640px. Both demonstrate responsive property values; their defaults are comparison data, not our selected widths.

Chakra also offers ranges, only/down targeting, hideFrom/hideBelow and custom thresholds. These capabilities informed the proposal. Peter subsequently selected arrays and Material band names; Chakra shorthand names and complete CSS-as-props coverage are not selected by those choices.

### Responsive font-basis audit

The post-deadline audit found that media-query initial-font rules had been carried into the container discussion without their platform distinction. The CSS Conditional Rules specification evaluates relative units in container conditions from computed values; rem refers to the root font size. Media queries instead use the initial font basis. WPT's font-relative-units source explicitly sets a root font and tests the resulting rem container condition. This is specification/test-source evidence, not a new local browser run.

Peter selected native CSS behaviour: keep browser-default-based window thresholds and computed-root-based container thresholds. At a 16px browser default and 20px authored root, 37.5rem means 600px for the window condition and 750px for the container condition. Add both font-change cases to acceptance; do not normalize the two bases. The prior six capability choices stand. [Decision and primary sources](../decisions/responsive-system.md#native-font-basis-for-each-query-mode), [bounded audit](../alignment/evidence/pace-review-2026-09-19.json).

### Existing house implementation

src/components/grid/grid.ts already exports Responsive<T>, an attribute JSON converter, restrict and breakpointVars. Grid accepts responsive rows/columns/height; Grid Cell and Grid Cross use those helpers. Generated Grid styles contain viewport and container queries, and use-container exists.

That is evidence for a usable platform path, not an approved general interface. Its required sm key, neighbour-filling order, optional xl in the type and truthy fallback operators require review before reuse. The current implementation is tied to the decorative Grid family. No current responsive helper was changed.

### JSON, ordering and parser follow-up

On 2026-09-20 Peter selected one HTML attribute per responsive property, accepting a plain value or JSON object/array; Lit and React receive corresponding JavaScript values. [Lit documents JSON conversion](https://lit.dev/docs/components/properties/#using-the-default-converter) for object/array attributes. Its installed default converter catches malformed JSON; the existing house converter does not. This confirms the format's platform fit, not the complete house validation policy.

An isolated Bun check extracted the exact converter at src/components/grid/grid.ts:19–22 and transpiled it without changing source. Object and array inputs parsed; plain 0 remained the string "0"; [content-start] 1fr [content-end] threw SyntaxError. [CSS Grid accepts bracketed line names](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns). This is a defect to avoid when generalizing the converter to CSS-valued properties, not a claim that the existing decorative Grid already exposes a grid-template-columns property. The new converter must distinguish property-valid scalar CSS from structured responsive input. No production fix or browser test ran.

Peter also selected Chakra's query-ordering model over narrowest-range priority. The full pinned sort-at-params.ts was executed in Bun with only memo replaced by an identity wrapper and TypeScript transpiled. The lower-bound 52.5rem/upper-bound 99.9975rem query sorts before the 75rem-and-up query, followed by the upper-bound-only 99.9975rem query. Thus expandedToExtraLarge:2 plus large:3 yields three in the large band under that ordering. These legacy query strings test the reference comparator; the house still requires exact native bounds rather than the reference's fractional adjustment. Complete ordering/equivalence cases and generated browser output remain unverified.

The full pinned system.ts and normalize.ts show array normalization skipping only null/undefined positions, retaining zero and false. This supports the draft skipped-position rule; it does not settle array-valued scalar ambiguity or invalid-input handling. Lit advises against automatically reflecting objects/arrays; keep that as the draft property-write behaviour while preserving attribute input. A lexical Pro block search found no literal mdTo, lgOnly, lgDown, mdOnly, smDown or mdDown matches; it is not proof about dynamic conditions. The previously reviewed complete Pro corpus remains the source context, and charts-02/block.tsx was re-read for its actual Simple Grid/gap usage. [Choice and probe record](../alignment/evidence/responsive-spacing-review-2026-09-20.json).

### Reference discrepancies and boundary tests

Chakra's requested page says smDown includes the small band, while the published 3.37.0 builder sets its maximum just below that band's starting threshold. At the default 16px conversion, smDown is below 480px, not the full 480–768 band. Its ranges use the upper named threshold as an exclusive boundary adjusted by 0.04px. The house now selects that between-threshold meaning with exact native CSS comparisons. Test boundary/fractional widths; the complete condition mapping and native-range implementation of the selected Chakra ordering remain open rather than copying ambiguous prose.

The [CSS Media Queries specification](https://drafts.csswg.org/mediaqueries-4/#units) bases relative lengths on initial font values/user preferences, not page declarations. Chakra's FAQ also mentions changing HTML font size; that should not be repeated as a guarantee about media-query thresholds. Browser-default font scaling and page-authored theme font sizes are distinct.

[Source and findings record](../alignment/evidence/responsive-review-2026-09-19.json). Browser behaviour of the final house responsive implementation has not been tested.

## Box primitive

[Peter selected Box](../decisions/box-primitive.md). [Chakra's implementation](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/box/index.ts) is chakra("div"), connected to the shared styling factory. The docs expose theme/style and responsive props. [Radix Box](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/box.tsx) combines common margin/layout definitions with display and div/span/asChild options.

Material Web's targeted repository search found no equivalent Box/layout/container component. The current house Card adds a visual treatment and Panel adds heading/body/footer structure; neither is the same general role.

Box earns its planned place through the shared theme/responsive contract. Keep child arrangement and Card treatment distinguishable. The inventory must define its finite interface and real host-box behaviour. Chakra's changing-tag/asChild mechanism is not automatically a Lit-host capability, and internal composition must not add unnecessary wrapper boxes.

### Selected Box styling scope

Peter selected focused shared properties for spacing, dimensions, positioning, visibility and surface appearance, with theme values and responsive support. Ordinary CSS supplies uncommon rules. This preserves the selected Box purpose without adopting Chakra's entire CSS-as-props and pseudo-state styling interface. Flex, Stack and Grid retain their additional arrangement responsibilities.

The complete Chakra Box/factory and Radix Box main documentation was read. A read-only TypeScript AST census visited every one of the Pro index's 938 JSX/TSX files, finding 479 literal Box tags across 240 files. Frequent properties included background (bg, 82), position (76), color (52), flex (42), padding (p, 39), corners and borders. The full property counts are saved; aliases and runtime-generated tag references were not counted. These are source-authoring observations, not proof of every rendered use or a requirement to copy each property. [Decision](../decisions/box-primitive.md#focused-styling-interface), [census](../alignment/evidence/layout-typography-review-2026-09-19.json).

### Box contract follow-up

Peter selected nine native tags for Box: div, span, section, article, main, nav, aside, header and footer, default div. He separately selected display following the tag: inline for span, block for the other eight, with explicit display overrides. Radix's Box CSS at 1faff10ac26ae17f09944d418c6949b93fc6b566 instead forces display:block for both supported tags. Its complete box.props.tsx includes contents among display values; the house's standing real-box rule excludes that choice. This review is source inspection, not a new browser test of the house defaults.

Peter selected responsive parent-placement properties on Box, applying to the outer host. Radix's complete layoutPropDefs covers flex basis/growth/shrinkage, self alignment and Grid area/row/column placement. That file and box.tsx were read from main; do not claim they were verified at the immutable CSS/props pin. The full Pro course-kit lesson-view and navbar files were re-read: lesson-view uses Box as aside/main and a growing Box, while navbar uses a named nav. These support structural and placement use; the previous host-versus-inner Grid probe remains the runtime evidence.

For colors, corners and shadows, Peter selected matching Chakra's token-and-CSS value acceptance. The complete main content of its effects, border and color-opacity-modifier pages was read. Effects shows token and hardcoded box-shadow values; the color page covers raw/token inputs. Effects identifies 3.36.1, while the other two identify 3.37.0. Their incidental aliases, shorthand syntax and erroneous CSS mapping prose are not house interface definitions. A lexical scan across indexed Pro JSX/TSX files found thirteen numeric/hex-leading visual attributes; some are tokens such as 2xl. The pricing-with-compare/plan-compare.tsx matches at lines 19/56 are explicit CSS shadow values using a color variable. This is not an evaluated census of every custom style.

The [inventory candidate table](../alignment/inventory.md#candidate-property-table) groups 77 possible CSS styling inputs using the already-selected full names and logical directions. It is a proposal, not 77 user-approved properties. The later review selects signed spacing, numeric dimensions, independent size/spacing categories and declaration-order direction. Precise types/defaults, declaration-order representation, CSS-part/host/inner targeting, validation and density mappings remain to close. The four selected choices are preserved separately in the [Box decision](../decisions/box-primitive.md#native-tags-and-default-display) and [evidence record](../alignment/evidence/box-contract-review-2026-09-20.json).

### Shared spacing and Stack contracts

Peter selected numbered theme spacing keys plus valid explicit CSS lengths/expressions. Theme keys do not mean pixel counts; literal overrides are not automatically density-scaled. He also selected full CSS names, logical directions, camelCase JavaScript properties and kebab-case HTML attributes, without duplicate shorthand aliases. Radix's complete layout/spacing documentation demonstrates scale values alongside raw CSS values. Chakra's complete spacing page demonstrates numbered keys. The later votes select rem units and the complete 34-step Chakra spacing table plus zero, as recorded below.

The current generated house theme has a 4px base and step 2 at 8px. Peter selected token 2 as Stack/HStack/VStack's default gap, with overrides including zero. HStack/VStack retain their named directions in the component interface; general Stack supports responsive direction. The complete pinned Stack/HStack/VStack sources show a 0.5rem gap and named wrappers explicitly setting row/column. Chakra's broad CSS property path can still override those defaults, so it is not evidence of an immutable direction. The house's narrower interface is the selected contract.

On 2026-09-20 Peter selected rem for the house spacing scale, using a 16px conversion reference. Token 2 becomes 0.5rem: 8px at a 16px root font, 10px at 20px. [Chakra spacing](https://chakra-ui.com/docs/theming/spacing) uses rem; [Radix spacing](https://www.radix-ui.com/themes/docs/theme/spacing) documents pixel base values and its separate scaling system. The unchanged house theme at src/generated/theme.css:3–14 uses pixel spacing, while form-font tokens at lines 60–67 use rem. The unit choice coordinates spacing with root-font changes. A separate later vote selects Chakra's full spacing scale below; Radix's text-scaling density behaviour remains outside the house contract.

The [CSS rem definition](https://drafts.csswg.org/css-values-4/#rem) uses the document root, not each section's local font. Density continues to adjust spacing without changing text; explicit CSS lengths and custom themes remain supported. Check root-font changes, theme overrides, density and the independent 24px compact target floor together. Review control-size consumers before implementation; this is not an instruction to convert every CSS dimension. [Decision](../decisions/layout-spacing-properties.md#font-relative-house-spacing), [evidence](../alignment/evidence/responsive-spacing-review-2026-09-20.json).

An AST census read all 938 indexed Pro JSX/TSX files: 1,064 literal Stack tags (127 without explicit gap), 626 HStack (302 without explicit gap) and 92 VStack (20 without explicit gap). Explicit numeric and responsive gaps occur frequently. Spreads and runtime defaults were not evaluated. These counts support examining defaults and overrides, not a claim that every omitted value reaches the same runtime setting. [Layout/spacing decision](../decisions/layout-spacing-properties.md), [Stack decision](../decisions/stack-layout.md), [source and counts](../alignment/evidence/layout-contract-review-2026-09-19.json).

Peter subsequently selected Chakra's alignment defaults: general Stack stretches, while HStack/VStack centre across the layout direction, with alignItems overrides. He selected optional automatic house separators, off by default. A full indexed JSX/TSX scan found two direct separator props: sidebar-with-collapsible/sidebar.tsx and charts-00/stat-card.tsx. Both files were re-read in full. These demonstrate vertical section and horizontal measurement separators, not a verified Lit cloning/slot implementation. Specify hidden/text/slotted children, responsive orientation and accessible presentation explicitly; preserve content and framework ownership. [Follow-up record](../alignment/evidence/query-stack-grid-review-2026-09-19.json).

### Spacing scale and separator follow-up

Peter selected Chakra's 34 positive spacing steps, plus zero, on 2026-09-20. The complete pinned spacing.ts defines the default rem values; they equal the key multiplied by 0.25rem. This preserves the current numeric steps' equivalent default values at a 16px root font and adds finer steps. The [decision](../decisions/layout-spacing-properties.md#complete-spacing-scale) lists the complete set; the [evidence](../alignment/evidence/spacing-stack-review-2026-09-20.json) records every default value. Themes may override values; these keys are not arbitrary pixel amounts. Density remains to specify; the later signed-token decision below resolves negative-spacing capability.

A read-only TypeScript AST pass visited all 938 indexed Pro JSX/TSX files for a specified set of spacing attributes, including direct scalar and literal object/array values. It found 25 uses of 0.5, 26 of 1.5, 33 of 2.5, 12 of 3.5 and 134 of 5. The aggregate includes matching tag attributes without resolving every import, spread or expression. Targeted full-source reads confirm Chakra examples: SegmentGroup.Root padding 0.5 in setting-api-key-01/create-api-key-dialog.tsx:59, Container padding 2.5 in sidebar-with-collapsible/navbar.tsx:9, and Stack padding 3.5 in webhooks-list-02/webhook-item.tsx:15. These support useful theme-aware finer spacing, not automatic adoption of all example behaviour.

The complete pinned stack.tsx, stack-separator.tsx and get-separator-style.ts place separate divider elements between children, remove the Stack gap in separator mode, and apply gap as margin on both sides of the divider. Peter selected that spacing over keeping one total gap: two gaps plus divider thickness. Zero gap still leaves divider thickness. The Pro charts-00/stat-card.tsx and sidebar-with-collapsible/sidebar.tsx were re-read in full for horizontal and vertical uses.

A [standalone native HTML/CSS reproduction](../alignment/evidence/stack-separator-wrap-probe-2026-09-20.html) used 100px-wide items, 1px dividers and 8px margins on each side. In isolated Chrome 153, a 150px outer width left dividers at row ends; at 220px a divider began the second row; at 350px all items and dividers fit on one row. DOM rectangles and a screenshot were inspected; the evidence JSON preserves measurements and setup. No complete Chakra runtime or house implementation was tested. Peter selected line-aware dividers for Stack: only between neighbours on the same visible row or column, keeping the selected per-side spacing. Group's member-order joined corners remain unchanged.

MDN labels [row-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/row-rule) experimental with limited availability. CSS.supports accepted its syntax in this Chromium instance, but that is not a rendering or three-engine guarantee. The CSS Gaps draft was opened as background, not reviewed in full. The selected correction still needs a mechanism that preserves content/child identity, handles resize/hide/reorder, RTL and reversed directions, defines cross-axis spacing, and passes Chromium/Firefox/WebKit checks. This review establishes the problem and desired outcome, not a completed fix. [Stack decision](../decisions/stack-layout.md#separator-spacing-and-wrapped-lines).

### Signed spacing, size categories and declaration order

Peter selected signed spacing tokens for margins and positioning offsets where CSS permits negatives. The complete pinned token-middleware.ts derives negative spacing from the original positive CSS variable; token-transforms.ts retains that relationship. The current house theme has hardcoded negative declarations at src/generated/theme.css:26–44, which must not be mistaken for the selected new derivation. The full Pro onboarding-workspace-03/invite-link.tsx uses me="-2" on its copy button. The choice does not add negative padding or gap.

Width, height and their minimum/maximum limits now accept the selected numeric steps as size tokens plus valid CSS values. Chakra's complete sizes.ts starts from the spacing defaults but declares a sizes category; its sizing and customization guides distinguish size and spacing overrides. Peter selected independent categories with matching defaults, so changing spacing need not resize the corresponding dimension. Additional fractional/named aliases in Chakra are reference evidence, not selected house capabilities. Density remains a separately specified spacing-only policy.

A scan of all 938 indexed Pro JSX/TSX files found one direct all-side-plus-specific padding combination: webhooks-form-02/collapsible-section.tsx:47 uses p="4" and pt="4". The full file was read. Its equal values do not establish conflict priority. Radix's pinned padding.css and margin.css group broad, axis and side declarations; the margin read continued after a truncated response. This is source evidence, not a whole-build cross-breakpoint test.

After Peter asked what Chakra does, an in-memory Bun probe executed its pinned createCssFn and relevant helper bodies, with full CSS properties/lengths and identity normalization/transform. It preserved declaration order for padding:16px then paddingInline:8px, and for the reversed input. The [native Chromium reproduction](../alignment/evidence/padding-order-probe-2026-09-20.html) confirmed 16/8/16/8 padding for the first case and 16px everywhere for the reverse. This does not test the complete Chakra React pipeline, tokens, responsive-condition combinations or the house implementation.

Peter selected Chakra declaration order after the clarification. The earlier option had conflated authored order and later update order; the accepted question separates them. Do not substitute a fixed side-priority rule, metadata order or latest-setter order. Installed Lit source saves pre-upgrade properties by constructor metadata order and replays that Map. The [Lit follow-up](lit-practice-review.md#style-declaration-order-follow-up-2026-09-20) makes preservation across pre-definition writes a priority gap, not a claim that the accepted behaviour is impossible. [Decisions and evidence](../alignment/evidence/shared-style-values-review-2026-09-20.json).

The subsequent [browser comparison](lit-practice-review.md#declaration-order-browser-comparison) reproduces that gap with the unchanged helper. A narrow public-API capture candidate preserves separate properties in fifteen targeted checks in each of Chromium, Firefox and WebKit; a single ordered object is an evaluated alternative, not a selected replacement. The [integration follow-up](lit-practice-review.md#style-input-integration-follow-up) verifies a complete-order React connection, field/attribute manifest annotations and CSS-default/lifecycle cases in bounded fixtures. Full package/compiler metadata, responsive combinations, inheritance/store-origin behaviour and all candidate properties still need verification before approval.

### Omitted styling inputs and reference defaults

Peter selected undefined when a CSS styling input is omitted. The CSS layer supplies visual defaults: an unset Stack gap reads undefined but still displays house spacing step 2. Explicitly supplying step 4 makes the property read 4. This preserves author intent for inspection/copying; reading an input is not measuring final CSS pixels. Semantic state properties retain their individual default contracts. [Decision](../decisions/layout-spacing-properties.md#omitted-styling-inputs-and-visual-defaults), [answer and source comparison](../alignment/evidence/style-input-integration-review-2026-09-20.json).

The comparison is deliberately qualified. Material Web's complete Button class and shared SCSS put its 8px gap and logical padding in CSS, with no public JavaScript gap property; softDisabled and trailingIcon have explicit false defaults. Its theming guide and Button documentation separate CSS tokens from behavioural properties. Chakra's pinned Stack source resolves omitted gap to 0.5rem internally, without providing a comparable component-instance DOM getter. Radix Themes' gap definitions have no default; extractProps skips absent styling values and converts supplied values to classes/styles. The complete Pro course-kit lesson-navbar.tsx contains HStacks with omitted gaps alongside explicit gap="2" examples; it establishes authoring use, not getter semantics.

Native CSS distinguishes supplied declarations from computed appearance, while Lit permits properties with explicit defaults. Therefore undefined is a selected house API rule, not a universal community requirement or Material's exact getter implementation. The constructor-default negative control concerns overwriting early writes in one candidate; it does not invalidate every alternative getter design. Material's 8px Button gap is reference evidence and does not replace house theme/density values.

The subsequent [package/compiler verification](lit-practice-review.md#package-metadata-and-compiled-fixture-verification) preserves this selected getter contract in the fixture's emitted types and manifest, and retains the ordering checks after Lit template compilation in all three engines. It also reproduces analyzer path/classification defects on real source and verifies a scratch correction/publication map. These results narrow the integration gaps; final property/token/density rules and the full responsive/style pipeline remain unresolved.

Peter subsequently selected a [Lit helper for overlapping styling inputs](../decisions/layout-spacing-properties.md#lit-helper-for-ordered-styling-inputs), preserving both declaration order and absent getters. The [lifecycle/registry follow-up](lit-practice-review.md#lit-helper-lifecycle-and-registry-boundary) passes its 21 global-registry cases in all three engines before/after compilation with explicit registry selection when nodes are created. The [later ownership choices](../decisions/layout-spacing-properties.md#settings-managed-by-the-lit-helper) limit the helper to supplied settings, clear removed managed keys and reassert current inputs on each helper render. Scoped registry/adoption behaviour, helper-expression removal, types and complete responsive coverage remain separate requirements; this is not a complete styling engine.

### Simple Grid sizing modes

Peter selected both responsive column-count and minimum-child-width automatic modes, then selected Chakra's precedence when both valid settings are supplied: minimum width chooses automatic fitting; columns is ignored. Rejection of that combination is not selected.

The complete pinned SimpleGrid source uses a truthy minChildWidth branch, CSS repeat(auto-fit, minmax(..., 1fr)) for that mode and equal fractional tracks for explicit counts. Valid-setting precedence is selected; zero/null/invalid parsing details are not implicitly adopted from JavaScript truthiness. The complete Pro JSX/TSX scan found 83 literal SimpleGrid tags: 82 columns, one minimum width and no direct combination. The complete charts-02/block.tsx was re-read for the minimum-width Stat-card use. No runtime or accessibility correctness is inferred from its click handlers. [Decision](../decisions/layout-grid.md#simple-grid-sizing-modes), [evidence](../alignment/evidence/query-stack-grid-review-2026-09-19.json).

### Primitive semantics and typography defaults

Peter selected defined suitable native tag sets per primitive, paragraph semantics (p) for Text by default and h2 for Heading by default. Text supports span for inline phrasing; Heading supports h1–h6, with visual size independent of semantic level. The later review selects Text's p/span/div set, inline Box span support and standard naming attributes with shared forwarding. Box's later nine-tag set and display default are now selected below; the detailed forwarding mechanism remains inventory work. The React package still wraps the Lit implementation; arbitrary React substitution and asChild are not selected.

Pinned Chakra text/index.tsx and heading/index.tsx were read completely and confirm p/h2. Radix Text and its property definitions, plus Heading property definitions, were read and confirm span/h1 with restricted tag sets; those Radix URLs refer to main rather than an immutable commit. The Pro census found 917 literal Text tags: 908 without explicit as, eight span and one h3. This demonstrates reliance on defaults in that corpus, not semantic correctness or broad community preference.

Lit retains its custom-element host around the native semantic element. Final composition must verify inline/block layout, allowed native content, attribute targets and computed accessible semantics through shadow/slotted content. Documentation of the intended tag alone does not prove those behaviours. [Decision](../decisions/additional-component-capabilities.md#primitive-tag-sets-and-typography-defaults), [review scope and limitations](../alignment/evidence/layout-typography-review-2026-09-19.json).

### Primitive host and native-element follow-up

Peter selected standard aria-label, aria-labelledby and aria-describedby inputs with shared forwarding to the inner semantic element, inline Box through as="span", and Text's p/span/div set with p as default. The separate naming-property alternative and block-only Box alternative were not selected. Heading and Field keep their existing responsibilities. [Selections](../alignment/evidence/primitive-interfaces-review-2026-09-20.json).

In a standalone Chrome 153 probe, grid-column:span 2 on the host produces a 210px-wide item; the same declaration on an inner CSS part leaves the host at 100px in that grid. Parent layout participation therefore cannot be routed indiscriminately to the inner native element. The probe's part name is illustrative, not an approved universal CSS-part name. Complete placement, dimensions, surface styling, internal layout and container-query targets remain to specify.

The same probe exposes a native inner h2 with slotted text as a level-2 heading. It distinguishes duplicate named wrapper/inner nodes and the working parent-scope element reference from a failing copied ID string. See the [accessibility analysis](lit-practice-review.md#primitive-naming-and-scope-check-2026-09-20) for mechanism and evidence limits. A document-level h1–h6 query returns zero for these shadow headings; coordinate public Heading identity/targets with the selected TOC discovery capability. Browser accessibility-tree output is not screen-reader speech or production certification.

Radix Box's API supports div/span; its Text API supports span/div/label/p. The house's selected native sets and defaults remain distinct. An AST pass over all 938 indexed Pro JSX/TSX files finds literal Box as uses for header/nav/footer/aside/main, along with forms, lists, table/text tags and custom React components. It finds no direct literal Box as="span". Those broader substitutions are reference evidence, not approval for the Lit interface. A separate literal search found no aria-labelledby or aria-describedby occurrences; it does not exclude relationships generated by the underlying components.

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

## Shadcn Resizable follow-up

Peter explicitly requested [shadcn Base Resizable](https://ui.shadcn.com/docs/components/base/resizable) for use in suitable components and layouts. The [resizable-pane decision](../decisions/resizable-panes.md) already selects pointer/keyboard resizing, optional collapse with previous-size restoration, and application-owned preference saving. Inclusion does not need another vote.

The full page text and [base Resizable wrapper](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/resizable.tsx) were read. It composes Group, Panel and Separator from react-resizable-panels, with horizontal/vertical layouts and an optional visible handle. “Base” in this URL does not mean the resizing engine is Base UI. The earlier package review already identifies react-resizable-panels as React-specific; this follow-up does not change the native Lit/TanStack Store/shared-motion implementation with React wrapping the same components.

Use this concrete composition reference when reviewing Sidebar, main/supporting panes, editors, Scroll Area and other suitable layouts. Do not automatically make every Sidebar resizable. The inventory must coordinate responsive mode changes, resize constraints, collapse/reopening, focus, RTL, nested panes, scroll viewport measurement and consumer-owned saving. Exact public naming/parts/defaults remain open. [Request record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).

## Core layout contract proposal

Prepared 2026-09-20 after Peter approved replacing isolated helper questions with complete component proposals. The [inventory](../alignment/inventory.md#core-layout-proposal-for-review) now contains six assembled proposals: Box, Flex, Stack/HStack/VStack, Grid, Simple Grid and Group. It is the sole detailed-contract owner. The proposals carry forward selections, label new recommendations and keep explicit feasibility/child-contract gates. No new user decision or runtime result is asserted by assembling them.

### Sources and comparison

Re-read the complete pinned Chakra implementations of Group, ButtonGroup, Flex, Grid, Simple Grid and Stack, plus breakpoint creation and query sorting. The revision is 1ff9873754e9913fc3d849d23c0844a628f5f20d; this is a reproducible source snapshot, not a claim about the latest release. Full Radix Flex/Grid property files at 1faff10ac26ae17f09944d418c6949b93fc6b566 provide a second layout-interface comparison. The [source ledger](../alignment/evidence/core-layout-proposal-2026-09-20.json) records URLs, available source hashes, local reference paths and the exact scope of this follow-up.

- Chakra Flex exposes direct arrangement with shorthand aliases. Its Stack adds a column default, spacing and optional separators. This supports distinct Flex and Stack roles; the house proposal keeps the selected full CSS names.
- Chakra Grid exposes track/area/auto-placement controls. Its Simple Grid chooses minChildWidth when supplied, generates auto-fit/minmax, and otherwise repeats a column count. It does not clamp a minimum to container width. The later reference-following instruction resolves this behavior without another preference vote and removes the proposed explicit one-column fallback. Positive-number/JSON validation remains a house input-boundary proposal, not a reported reference validator.
- Chakra Group supplies arrangement/attachment; ButtonGroup separately provides button appearance defaults. The house Group's broader provider remains Peter's deliberate selected difference. The proposed size/variant pair has concrete ButtonGroup/Pro evidence; applying compatible values to other control families still requires their contracts.
- The source Group gap is var(--group-gap, .5rem), orientation is horizontal, default alignment is center, and grow changes its display to flex. These inform the proposed house defaults. Chakra's border joining uses a fixed negative pixel overlap; house themes require a seam contract that does not assume every border is one pixel.
- Chakra's breakpoint source and comparator support the selected band/range meanings and query ordering. The proposal adds explicit equivalent-interval validation and separates comparison keys from emitted exact native bounds. This adaptation is unverified and remains an approval gate.
- Radix supplies constrained native tag/display options and ordinary flex/grid concepts. It does not establish that the house's retained Lit host plus semantic root has identical geometry. Actual Pro page compositions support the broader structural tag set, which Peter subsequently selected for all six layout entries. Verification of the real boxes remains open.

The private Pro follow-up reads complete files: course-kit/components/views/lesson-view.tsx; charts-02/block.tsx; webhooks-form-01/secret-input.tsx; property-panel-01/theme-selector.tsx; webhooks-event-log-03/delivery-log-pagination.tsx. Lesson View uses Box for aside/main regions, Stack as article, Flex and growing content. The form uses InputGroup plus a small ghost ButtonGroup for end actions. The property panel joins swatches inside a Select. The event-log footer composes pagination, wrapping HStack, ButtonGroup, page text and a page-size control. These show the need for shared layout with independent semantic/state owners. Their shorthand names, literal sizes, values and application data are reference details, not automatically approved house APIs. Licensed code remains in the private collection; no source is copied into the proposal.

Reuse the already completed [Material layout/interaction review](#full-material-layout-and-interaction-follow-up), all relevant Toolbar/App Bar/Search documentation and actual Material Web source recorded there. No Material implementation is claimed for Box/Stack/Grid. No Material density, spacing or pane-size value is substituted for the house decisions. New prose drafting did not constitute a fresh diagram, animation or browser pass.

### Proposal rationale and limits

The shared proposal makes styling targets explicit: the host owns the external box; a native root owns meaning and child arrangement. This prevents silently placing parent-grid properties on a non-participating inner element. It remains an intended contract, not proof of a two-box implementation. Existing Chromium host-placement/semantic checks cover only their documented cases. Intrinsic and definite sizes, inline flow, percentages, baseline alignment and external ARIA references need the E02/E04 evidence before approval.

Use standard CSS variable references for visual theme values and a root part for ordinary CSS, alongside the selected numeric spacing/size scales. This avoids introducing a second token-name parser while the theme registration contract is unfinished. That is a proposed authoring trade-off, not a retroactive change to Peter's token/CSS decision. Density values, theme scopes and final custom-theme variable registration remain R01 work; size tokens must not silently become spacing-density tokens.

Simple Grid's true minimum follows the inspected reference expression. Under Peter's later reference-following instruction, a defensible alternative is not itself a reason to ask again: the planned clamp-versus-minimum question is retired. The initial whole-input rejection/previous-value retention recommendation is withdrawn after Peter requested Chakra's behavior and the source follow-up below found no corresponding last-valid-value store. Malformed HTML JSON and house-specific responsive structures remain open; the existing converter/helper probes do not settle that contract.

Stack's proposed cross-line gap and member eligibility complete its already selected separator direction. The selected line-aware correction remains unimplemented/unverified. Group retains its different, already selected member-order attachment rule. Neither virtual cloning nor undocumented shadow access is justified by React source patterns.

### Dependency return points

| Owner | Outcome needed | Return point |
| --- | --- | --- |
| R01 / E02–E03 | Responsive condition equivalence/tie-break, startup/target syntax, CSS scalar parsing and converter-specific failure behavior, plus helper removal; exact theme scope/token/density contract | Before approving the shared convention and affected layout entries |
| E02 / E04 | Real host/native geometry, semantic forwarding, scoped registries/adoption and layout identity | Before approving affected as/box/layout behavior |
| E04 | Stack same-line decoration across wraps/reversal/RTL with stable framework-owned children | Before approving L-02 |
| R04–R06 / E04 | Full-word child sizes/variants, member surfaces, focus/seams and single-selection/input participation | Before approving G-01 and affected child entries |
| R02 | Inset, standalone Separator, Scroll Area and Resizable complete proposals | Finish the remaining layout entries; the present batch does not close R02 |
| R03 | Complete Text/Heading and formatting proposals under the shared conventions | Next drafting batch after this review is handed over |
| E03 | Representative generated house CSS and required three-engine outcomes | Existing mandatory gate before Phase 5 implementation approval |

No additional package or production helper is installed or implemented. Approval counts remain zero; six assembled proposals are progress toward review, not six completed implementation tasks.

### Shared layout choices

Peter subsequently chose “Share the set (Recommended)” and “Share Box’s set (Recommended)”. All six layout entries share the focused styling scope and the nine structural native tags, with div default. Styling scope does not approve all 77 detailed candidates, and native tag choice does not certify the retained host/root geometry. These choices are now recorded in the [styling decision](../decisions/layout-spacing-properties.md#shared-styling-across-layout-components) and [native-tag decision](../decisions/additional-component-capabilities.md#shared-structural-tags-for-layout-components). No complete inventory entry is approved by these two answers.

### Chakra style-input follow-up

Peter answered “whatever chakra does” to the invalid styling-input question. The original example mixed invalid CSS values with malformed HTML JSON, although Chakra does not use the house's HTML JSON input format. The complete follow-up reads eight files at Chakra commit 1ff9873754e9913fc3d849d23c0844a628f5f20d: css.ts, serialize.ts, use-resolved-props.ts, utility.ts, system.ts, factory.tsx, conditions.ts and normalize.ts. [Source ledger and exact answer](../alignment/evidence/layout-contract-selections-2026-09-20.json).

| Source | Observed responsibility | Limit of the conclusion |
| --- | --- | --- |
| use-resolved-props.ts, lines 28–63 | Separates current style/variant/element props and computes current styles | No separate last-valid-value store in this path; useMemo is not input-validity retention |
| css.ts, lines 28–60 | Normalizes inputs, skips nullish leaves, transforms and merges CSS, then sorts rules | Does not provide a universal CSS-value validator or all-or-nothing failure policy |
| utility.ts, lines 153–185 | Resolves token values or raw values and invokes property transforms | Individual transforms can differ; do not claim every invalid input has the same outcome |
| system.ts, lines 90–123; normalize.ts | Recognizes property names and maps non-null responsive array positions | Property-name recognition is not value validation or a house JSON decoder |
| conditions.ts, lines 14–37; serialize.ts | Resolves known conditions and distinguishes selector-like forms | Unknown house condition names cannot be assigned a fabricated Chakra rejection contract |
| factory.tsx, lines 148–208 and 249–257 | Serializes current styles and supplies the resulting class to the rendered element | No last-valid class retention mechanism here; browser cascade outcomes still need runtime checks |

**Consequence:** follow current-input CSS processing where the inputs are comparable. Withdraw the previous recommendation to keep prior valid values. Do not replace it with an equally broad claim that Chakra always clears to defaults, throws, warns or rejects a whole update. Neither option from the original question was selected verbatim.

**Bounded remaining question:** the HTML decoder must handle malformed JSON and distinguish it from valid scalar CSS such as bracketed grid lines. Chakra's JavaScript path does not decide that behavior. R01/E02–E03 owns its concrete fallback/error proposal and verification before shared-convention approval. Keep the gap alongside the component contract; it does not reopen agreed styling scope, native tags or helper ownership. No new browser execution, dependency installation or production change occurred in this follow-up.

### Applying established reference behavior

Peter clarified that a definitive Chakra/Radix/other reference supplies the answer; the agent should inspect it instead of asking him to choose the same behavior again. The [standing rule](../decisions/reference-systems.md#follow-the-established-reference-without-another-preference-question) now owns this instruction. It preserves house decisions and asks only when a material conflict, missing source behavior or unresolved source assignment remains after investigation.

Re-read the complete previously saved, hashed Chakra SimpleGrid, Stack and Group sources at 1ff9873754e9913fc3d849d23c0844a628f5f20d. The [original source ledger](../alignment/evidence/core-layout-proposal-2026-09-20.json) identifies those exact files; the [full-set follow-up record](../alignment/evidence/full-proposal-review-2026-09-20.json) records this application. This was not a new latest-release claim or browser run. The previously reviewed Pro chart minimum-width example and lesson layouts remain the composition evidence.

| Detail | Source-defined resolution | House limit |
| --- | --- | --- |
| Simple Grid narrow container | No implicit minimum-width clamp | An explicit fitting expression is an author override; rendered behavior still needs checks |
| Simple Grid mode selection | Choose the minimum-width branch before responsive mapping; columns is not a per-width fallback | This corrects the draft and retains the previously selected valid-setting precedence; zero/invalid HTML inputs remain separate |
| Simple Grid absent count | No declared columns=1 default in the source | Use native implicit layout, not a newly invented explicit count; child placement can create tracks |
| General Stack direction | column | Named H/V directions and the selected house separator correction stand |
| Group ordinary arrangement | Horizontal, centered cross-axis alignment, flex-start justification, .5rem unattached gap, grow-dependent outer display | Use the selected house token scale; attachment/outline/child-appearance extensions remain their own contracts |

These are applications of Peter's standing instruction, not five newly answered questions or complete-entry approvals. The Simple Grid source's component-level branch also explains why sparse responsive minimum widths must not silently re-enable columns at another breakpoint. Verify that case with the retained house boxes before approval. Keep native Lit/TanStack/generated-style implementation ownership; reference behavior does not select the source's React cloning or runtime.

### Full-set source defaults and converter result

The [assembled proposal set](../alignment/inventory.md#complete-proposal-set) applies Peter's instruction to inspect established references instead of asking again. [The source/check ledger](../alignment/evidence/full-proposal-review-2026-09-20.json) records coverage precisely: source files, relevant API sections and reused earlier full reviews are not labelled as new browser verification.

Current Chakra APIs resolve Scroll Area visibility (hover/always, hover default), Hover Card delays (600/300ms), and disclosure/Tabs mounting (lazyMount/unmountOnExit false). The Base UI provider resolves Toast limit3 and duration5000ms/0 persistence. Current Tooltip source supplies open0/leave100ms. These facts complete proposal defaults without new preference votes; sources are linked in each owning family file.

FormatByte's complete Ark wrapper and underlying formatter support decimal/binary scaling and negative values. The helper defaults to three significant digits, decimal/byte/short. It hardcodes zero as 0 B and uses SI labels even after binary division. The proposal explicitly requires accurate zero/unit/localization and binary labels rather than pretending those outcomes are already correct. That is a source finding awaiting targeted verification, not a silent imported runtime.

A pure Bun check of installed @lit/reactive-element 2.1.2's defaultConverter returned null for malformed object/array JSON, parsed valid object/array input, and also returned null for bracketed scalar CSS when incorrectly sent through its Object converter. The [five outputs](../alignment/evidence/full-proposal-review-2026-09-20.json) support the proposed house adaptation: recognize valid scalar CSS first, map failed structured conversion to no current override/undefined, preserve unrelated inputs, and diagnose in development. This is not an end-to-end browser/controller test or a direct Chakra JSON behavior. The previous unresolved parser preference is replaced by this concrete engineering proposal; acceptance still covers actual DOM updates and structured validation.

The remaining compact-density choice uses the current Table's .625rem normal versus 5px compact block padding, with unchanged .5rem inline padding, as explicit evidence. Its [comparison table](../alignment/proposal-questions.md#q02--compact-density-treatment) labels candidate values as proposals. No global compact multiplier is selected from that one source example.

### Whole-set approval and Phase 5 handoff

On 2026-09-20 Peter said “I approve all proposals.” The [approval record](../decisions/inventory-approval.md) selects the complete set and the five stated recommendations. Earlier proposal/unselected statements above retain their historical evidence scope; current design status is approved. Peter subsequently [approved the migration plan](../decisions/migration-approval.md) through “approved”. M00 technical prerequisites remain active before dependent implementation. Production implementation has not started; approval is not a runtime result.

## M00 Stack and Group verification, 2026-09-20

The [completion evidence](../alignment/evidence/m00-completion-2026-09-20.json) verifies native child identity, focus and click behavior through wrapped Stack and attached Group fixtures in all three engines. A red inline-separator control orphans dividers when wrapping. The candidate uses native flex gaps and decorative dividers between measured same-line neighbors; widths 150/220/350, row RTL, reverse directions, column layouts, resize, hiding and reordering pass.

The Group candidate has a real host box and padded outer outline. Two participating shadow-contained native buttons retain 2px focus outlines and raised stacking. Differing 1px/3px borders overlap by the measured minimum 1px in both axes and RTL. Group gains no selection ownership.

These are representative M00 mechanisms, not final visual approval. M07 must cover unequal cross-axis alignment, CSS order, wrap-reverse, zero-size members, font loading, mixed/nested participation, perimeter suppression, card invalid/selected states, input add-on associations and forced colors. The scratch line-grouping code is deliberately not certified as the final general algorithm.

## M05 numeric token delivery, 2026-09-20

One immutable catalog now supplies the selected 35 spacing keys and 35 independent size keys, their rem defaults, CSS variable names and the generated public manifest. Names are --acme-spacing-N and --acme-size-N; decimal keys use a hyphen, so 0.5 maps to 0-5. These are the engineering names allowed by the approved foundations contract. Values default to key × 0.25rem. Negative spacing is derived from its positive variable; sizes have no negative numeric token.

The replacement removes 9 house definitions and updates 13 gap/margin uses. The imported token generator also removes 84 numeric declarations across four contexts and rewrites 8 role references. Named control heights and nonnumeric role tokens remain unchanged. The old --space/--s-N and --acme-space/Nx numeric families do not ship as aliases. A canonical parsed comparison proves the regenerated theme changes only those removals/rewrites, despite older generated whitespace differing.

The split step emits src/generated/tokens.json from the same catalog as the CSS. Build verifies freshness, copies it to dist/tokens.json and the package exports tokens.json. The dev watcher regenerates styles before building when the catalog changes. The producer is deterministic across dates, and all 921 generated files remain byte-identical after repeated generation.

Verification passes: 713 tests, build/docs, independent review, 210 token checks per browser engine, and 114 page comparisons with 92,136 node pairs and zero differences/errors at the default font size. The tests also verify 20px rem growth, independent category overrides, negative-value derivation and retained control heights. A fresh installed tarball consumer resolves all 70 manifest entries through the package export. [Full evidence and reproductions](../alignment/evidence/m05-numeric-tokens-2026-09-20.json). Other theme categories, nested scopes, density and layout rendering remain separate work; this does not certify all custom-theme support.

## M05 theme state and system appearance, 2026-09-20

The headless scope model now owns authored inputs in TanStack and derives immutable effective values. Omission inherits; explicit auto follows the supplied local system source and explicit normal overrides compact. An inherited appearance keeps the parent's resolution, so a future overlay can follow its opener. Parent and system sources can be replaced. The model leaves native language/direction and registered-name validation to their respective owners.

The system preference resource observes its supplied document, shares a native media listener while bindings exist, and releases it when the final binding ends. It never reads a global document, writes preferences or changes the root. Unit checks and real browser checks cover sharing, cleanup, current-value reacquisition and adoption to another document.

The first Firefox fixture failed because its light-phase wait watched only the main document. The next dark wait could accept the foreign document's stale earlier dark value. A native-only reduction and repeated comparison identify this test race; waiting for both documents fixes it without a delay or production workaround. The unchanged original fails seven of eight Firefox runs, while the corrected barrier passes all eight.

The integrated build/docs and 732 tests pass. All 23 browser checks pass in Chromium, Firefox and WebKit. [Sources, full reproductions, controls and limits](../alignment/evidence/m05-theme-state-2026-09-20.json). These are implemented state/resources; no acme-theme or DOM scope transport is claimed.

### Theme delivery integration obligations

The existing base appearance watcher uses the global document/matchMedia and never invokes its saved cleanup. The current shared state and Theme Switcher still mutate root settings and storage. Replace those together with actual scope delivery; keep unrelated Toast and store helpers. Generated palette selectors currently target only the document root. Nested scope styles must preserve gamut/support conditions and redeclare semantic aliases where palette inputs change.

The reference review supports CSS custom properties for visual tokens and a small reactive semantic configuration. Composed context requests can cross the actual slot/shadow event path; closest/assignedSlot traversal alone does not cover closed-root assignment. Lit's context package is neither installed nor selected. A theme-only bridge remains a candidate requiring real late-provider, slot, disconnect/reconnect and adoption checks. Do not silently install a package or present this source review as a verified DOM mechanism.

### Complete theme-token source census

The complete current token sources and all 220 consumed component/shared stylesheets are parsed, including keyframes. The candidate accounts for 499 rows: 407 category/key/property mappings, 84 private color-channel fields and eight roles outside the selected theme categories. All 2,343 consumer variable occurrences agree with independent AST counts. Defaults retain their source selectors, capability/gamut conditions and ordering. [Full mapping, hashes, references and reproduction](../alignment/evidence/m05-theme-token-mapping-2026-09-20.json). This is a source census and candidate naming table, not a claim of complete registered-theme support.

The source exposes real integration work. Select and Toggle directly consume channel triplets; Avatar Group and Tooltip each rebuild 82 palette colors locally. Arbitrary full-color overrides must reach those paths before custom-color coverage is certified. Raw channel lists are not public CSS color values. Font-weight tokens do not yet exist, and font-size/line-height tokens cover only some declarations. Three font-family variables used as font-weight originate in the captured upstream CSS; the house generator preserves that mismatch. Exact rules, offsets, extracted nodes and mappings are saved. Do not guess a replacement weight from the variable name.

The gradient, outline shorthand, opacity and five layer-order roles do not fit the selected categories. Keep these boundaries explicit rather than misclassify values to make a table appear complete. Existing nonnumeric basenames provide a one-to-one candidate mapping; final coverage and any necessary token consolidation remain implementation work.

### Theme context transport candidate, 2026-09-20

An isolated @lit/context 1.1.6 fixture passes eleven mechanism checks in each browser engine. It verifies nearest/nested providers, live TanStack sources, late provider definitions, initially unresolved requests through ContextRoot, composed discovery through a closed root, adoption, subscription disposal and a native opener's live source. Two intentional stock failures reproduce everywhere: a slot reassignment retains the previous provider, and moving outside every provider retains its previous value. Clearing the parent binding in a TanStack batch before public-lifecycle rediscovery corrects those measured cases. [Complete observations, source references and reproduction](../alignment/evidence/m05-theme-context-2026-09-20.json).

Recommend the official Lit package for context discovery and subscription transport. Pass the existing read-only TanStack source through it; TanStack remains the state owner. The package adds no new reactive state framework and its declared dependency is the compatible Lit reactive-element package already present. Adding this direct runtime dependency remains Peter's package decision; the project manifest and lockfile are unchanged.

This is not a complete automatic theme adapter. House integration must own actual-document ContextRoot lifetime, explicit source clearing, slot invalidation, adoption/system-source replacement and overlay opener disposal. Closed-root/forwarded/fallback/manual slot invalidation still requires browser proof. ContextProvider does not expose a general disposal API. The public event export is ContextEvent; ContextRequestEvent is the internal source name. The full installed source and declarations were read, rather than inferring behavior from the guide's examples.

### Nested appearance CSS and local palettes, 2026-09-20

The bounded CSS prototype passes 25 checks per engine. It preserves root token declaration order and capability/gamut conditions when making an explicit appearance scope. Copying every root declaration fails inheritance checks because it resets parent font and spacing overrides. A restricted appearance-field copy passes those checks; the smallest complete appearance/alias dependency closure remains an integration task. Automatic document preference fallback and document-layout selectors such as :root:has(.subbar) stay document-only. [Source positions, counterexamples, final results and reproduction](../alignment/evidence/m05-theme-scope-css-2026-09-20.json).

Avatar Group's count is deliberately dark, and Tooltip deliberately inverts its surrounding appearance unless noinvert applies. Their captured source markers and generator mappings explain the local palettes. Removing those declarations would change current behavior. Parent-only color overrides do not reach the inner .count/.tip reset; direct target overrides do, while cleanup restores the default treatment. That demonstrates reachability, not the final renderer: generator-owned delivery must still preserve author CSS/part precedence and lifetime ownership. Recheck each family's approved replacement contract when integrating it.

Relative RGB expressions let Select's ring and Toggle's thumb consume full color variables with their existing fixed alpha, instead of consuming raw HSL triplets. The candidate passes named/hex/RGB/HSL/Lab/P3 origin and alpha checks. Apply such a rewrite only to actual color declarations; palette self-definitions would become circular. Current full-color palette values can differ from the old raw-channel fallback, so default visual/contrast differences must be measured before shipping the rewrite. WebKit matched the P3 branch; Chromium and Firefox did not. Physical wide-gamut visual parity remains unverified.

The saved initial Select state and in-flight transition results are fixture-development failures, not product defects. The final fixture uses the actual relevant control state and waits for its transition to finish. No production generator, component or theme CSS changes are included in this research checkpoint.

## M05 integrated theme delivery, 2026-09-21

The shared transport and scope implementation now ship in the working branch. One ThemeContextController owns each host's canonical model; AcmeTheme provides that same model. Named registration is immutable and validates the ten category dictionaries against 413 exact token mappings. The scope applies generated full, appearance-only and density boundaries, with owned override sheets below ordinary author CSS. The root preference/storage manager and global dark-host watcher are removed. Theme Switcher emits controlled requests; Appbar, Chart and the website now follow local scope state.

Real browser tests found that an attribute condition outside :host did not match the shadow host. The generator now places those conditions inside :host. Custom fonts also exposed duplicate primary-family aliases; all emitted references now use the two canonical families. Six actual numeric weights become theme tokens, and the three family-as-weight declarations are removed. Registered color overrides reach intentional local palettes; channel consumers use full colors with the same specified alpha.

The final scope fixture passes 35 checks per engine. A fresh packed consumer installs successfully, passes strict TypeScript and five browser checks per engine. The actual docs header changes both its scope and controlled picker without errors in all engines. Generation, build, docs and all 821 tests pass. [Complete integration evidence](../alignment/evidence/m05-theme-integration-2026-09-21.json).

[114 page comparisons](../alignment/evidence/m05-theme-comparisons-2026-09-21.json) cover 92,136 node pairs. Geometry, line height, font weight and other recorded properties remain unchanged. Family-list consolidation and relative-color serialization account for the classified differences. Six Select ring results in WebKit intentionally use the public wide-gamut color instead of private HSL channels. Physical wide-gamut screenshot parity is not claimed.

Density-role adoption, final Theme Switcher composition/localization and other component-owned work remain with their assigned family batches. M05 mechanism completion does not mark those families implemented.

## M07 Separator implementation — 2026-09-21

[Evidence and reproduction](../alignment/evidence/m07-separator-2026-09-21.json) covers canonical orientation/decorative state, the root part, generated hooks and native sizing. The initial percentage-height vertical host produces a zero-height line in an intrinsic flex row in all three engines. An inline-flex host with stretch and an auto-height line passes that case and the definite-height case, retaining real host/root boxes. Forced-colors rendering matches a native CanvasText control. Ten unit/manifest tests pass; nine browser checks pass per engine.

The approved decorative=true property also exposes an authoring contradiction: a native boolean attribute cannot turn a true default off. [Lit documents this restriction](https://lit.dev/docs/components/properties/#boolean-attributes). The delegated clarification preserves the selected property/default, uses a string-valued false opt-out for default-true properties, and retains presence semantics for ordinary default-false booleans. The current consumer example demonstrates the semantic opt-in.

Box's standard role/name forwarding remains the next implementation seam. The complete pinned Material Web aria/delegate.ts and aria/aria.ts were re-read at 56a486b147b8b7e95e6e8035fa02aed7e0009a85. They remove host ARIA to prevent duplicate announcements and explicitly lack IDREF support. These remain references, not copied or selected house storage: canonical state, native external element references and complete lifecycle/metadata checks still govern. No new Box implementation is claimed by this review.

## M07 Box implementation — 2026-09-21

[Implementation evidence](../alignment/evidence/m07-box-2026-09-21.json) records the first actual layout primitive on the shared mechanisms. Box has the nine structural tags and all 77 ordered common style inputs. They remain outside Lit's property metadata to preserve pre-upgrade order; explicit source annotations plus the standard manifest analyzer document their matching attributes and types. Canonical non-style options use the existing atomState bridge. styleInputs, configureBreakpoints and their public authoring types are exported.

Sixteen native checks per engine cover fixed/percentage dimensions, a single padding/border charge, inline and inline-block behavior, parent Flex/Grid placement, native responsive HTML parsing, ordered helper output/clearing, pre-upgrade values, unchanged children, hidden and document adoption. A fresh packed consumer passes strict TypeScript and four checks per engine using public package imports and shipped tokens. Build/docs pass with 111 elements, 82 pages and no undocumented component. Sixteen focused unit/manifest tests pass.

The DOM test shim accepts a JSON object string as valid CSS; therefore the structured HTML parsing assertion uses native browser grammar. The unit check independently covers structured property ownership and removal. No production parser workaround is introduced for the shim. Flex/Stack/Grid/Simple Grid and Group remain unimplemented M07 entries at this checkpoint.

## M07 Flex implementation — 2026-09-21

[Evidence](../alignment/evidence/m07-flex-2026-09-21.json) records eleven native comparisons/checks in each engine, the three initial specificity failures, Box/semantic regressions and 857 passing tests. Flex adds its eight inputs to the 77-property common surface; Box does not gain arrangement inputs. A direction-free internal flex base supplies the seven inputs shared by the later Stack variants and Group.

The real host supplies block/inline placement and owns size/padding/border. The native root arranges children. Generated display delivery translates flex/inline-flex into the host's outer mode while retaining flex on the root. Arrange values are evaluated on the host and inherited by the root, so a root cannot accidentally query a container established on its own host. The nested-container check distinguishes these two results.

Native controls match row alignment, padding/border sizing, wrapping and axis gaps, reverse direction, RTL, a definite-height column, inline intrinsic sizing and span semantics. Testing span variants found that structural selectors were more specific than explicit input rules. Low-specificity defaults fix both Flex and Box's explicit span-display override. These are documented failures followed by passing controls, not inferred CSS equivalence.

The build counter now recognizes compiled templates without bindings; its former helper-import heuristic undercounted compiled files. Template compilation behavior is unchanged. Current output reports 503 modules, 112 files containing compiled templates, 112 elements and 83 documentation pages. Semantic ID-discovery observers now run only while string references need discovery; ordinary Boxes and direct labels do not create that observer.

## M07 Stack family implementation — 2026-09-21

[Evidence](../alignment/evidence/m07-stack-2026-09-21.json) records 32 native checks in each engine, four fresh packed-consumer checks in each engine, strict consumer types and the full 865-test suite. General Stack supports responsive direction; HStack/VStack have no direction property. The direction-free Flex base prevents accidental inherited API exposure.

The complete pinned Chakra Stack, StackSeparator and separator-style files were re-read. They confirm per-side gaps and a stretched separator, while the earlier M00 native control records the wrapping defect. The house implementation retains native flex layout and measures same-line neighbors; it never inserts an in-flow separator that can wrap by itself. An unwrapped divider spans the content box. A wrapped divider spans the visible members of its own row/column, avoiding an implied cross-line track. This is the selected house line-aware behavior, not a claim of identical Chakra output.

The separators compose acme-separator and export its actual root as the public separator part. A zero-size absolute decoration layer is measured at its native static position; it does not create a new containing block for author-owned children. Coordinates are local and normalize positive scale. Geometry writes use the generated style declaration names. Thickness/inset are generated, registered CSS length properties. No new rendering or state package is introduced.

Default gap uses the existing compact-eligible house layout role at spacing step 2. A named theme can change it in a fixed-size Stack without a size observation; a scoped store subscription schedules the measurement. Compact default gaps and explicit non-scaled spacing both pass. Native tests also cover wrap/reverse/RTL, unequal heights, CSS order, zero gap, hidden/raw content, styling hooks, the actual line part, native focus/events, semantic tag changes, adoption, observation disposal and reconnection. Box/Flex regressions remain green.

Automatic membership means normal-flow assigned elements with rendered boxes. Absolute/fixed content retains its native containing block and is not treated as a flex item. Visibility-hidden elements remain in the geometry; hidden/display:none elements leave it. Raw text is preserved rather than filtered away. Limits for unsupported arbitrary transforms and unobservable CSSOM mutations remain explicit in the evidence.

## M07 Grid and Simple Grid implementation — 2026-09-21

[Evidence](../alignment/evidence/m07-grid-2026-09-21.json) records 26 native checks per engine, a fresh packed consumer and the full 854-test suite. Grid exposes native tracks, areas, implicit tracks and placement; Simple Grid exposes counts/minimum width without exposing manual columns. Both use the shared semantic/box/renderer mechanisms. The retained real boxes match the native controls for the recorded fixed/implicit/dense/inline/RTL/area/placement cases.

Minimum-width mode is chosen before responsive conditions are evaluated. Counts do not reactivate in skipped bands. Zero selects the zero size token. True minima can overflow; an explicit min(100%, length) fits a narrow container. Omitted counts retain native implicit placement. Current JavaScript CSS strings remain current values: invalid minimum CSS leaves native implicit layout rather than reviving inactive counts. Clearing the minimum explicitly restores counts. HTML invalid values follow the existing shared converter and clear their override.

The inert-document probe failed in all engines because the converter treated the missing Window.CSS API as an invalid value. The fix validates against that document's native style declaration. Both retention and subsequent adoption now pass. A separate initial named-area failure was in the control fixture's quoted HTML attribute; assigning its cssText through the DOM API fixed the oracle without changing production Grid.

The decorative Grid implementation, four companion tags, old breakpoint/position helpers, generator maps, generated outputs, source CSS and consumer examples are removed. The old decorative tests leave with their removed API; new contract and native-comparison checks replace them. No compatibility aliases, legacy shape adapters or runtime history comments are added. Group remains the only unfinished M07 entry.

## M07 Group foundation implementation — 2026-09-21

[Evidence](../alignment/evidence/m07-group-2026-09-21.json) records 28 native protocol checks per engine, four fresh public-package checks per engine and the full 858-test suite. Group supplies responsive orientation, the common layout inputs, independent attachment/frame options, growth and readonly appearance defaults. ButtonGroup and its source styles/API listing are removed.

Participation is explicit through GroupMemberController, the generated member styles and the component's own surface/appearance model. Direct assigned participants receive defaults; unrelated elements break attached runs. Provider ownership guards make same-task moves safe from a stale previous parent. Native border widths determine overlap, while corners follow member order rather than wrapped lines. Padding leaves inset borders intact. Focus and control-supplied emphasis remain above resting seams. Group does not gain selection, form or disabled ownership.

The proposal's --acme-radius reference is absent from the actual catalog. Group uses the existing --r token, with its 8px house fallback. Optional string removal is now shared with Theme and restores undefined for Group defaults and responsiveContainer. Responsive mapping reuses one helper rather than introducing another condition parser.

**Acceptance boundary:** the registered participant in this fixture is a native-control test fixture. It verifies the protocol, not the production Button/card/input paint matrix. M09 integrates actions and verifies real button strokes; M10 integrates selection cards and the separate single-selection indicator owner; M11 integrates inputs and internal add-on seams. Those are explicit remaining implementation gates. M07 closes its planned layout/protocol foundation boundary; it does not close those later families.

A background dev watcher caused a style-writer lock while coordinated generation ran. The lock protected the files. The server now serves built output on port 4180 without watching; restore watching at migration completion. One browser run also began before CSS regeneration finished and read the previous emphasis stylesheet. Final protocol checks run after generation and pass; the ordering error is not reported as a production regression.
