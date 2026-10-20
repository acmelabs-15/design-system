Decided 2026-09-19 by Peter.

# Share responsive values across layout and appearance

Provide one responsive approach for layout, typography, component sizes and appropriate visual variants. Peter selected this over limiting responsive values to layout alone.

Use Material's five size bands as the default set, combined with Chakra-style responsive authoring capabilities. Peter selected Material bands separately from the authoring approach. Their reference transitions are 600, 840, 1200 and 1600.

For window media queries, make thresholds scale with the browser's default font size. At a 16px initial font size, they match those reference widths; the direct rem conversion is 37.5, 52.5, 75 and 100. Page-authored font sizes do not themselves change media-query thresholds. Ordinary zoom also changes the available CSS viewport width. Container queries follow the separately clarified native font basis below.

## Phase 4 authoring selections

Peter selected plain values plus both named objects and positional arrays. Use compact, medium, expanded, large and extraLarge as the five public band names and as the array order. This chooses Material names over Chakra-style shorthand while retaining the previously selected font-relative thresholds.

Peter selected both window and container widths. Window width is the default; container-based responsiveness is explicitly selected and authors establish a query container. In container mode, use the nearest eligible query container when no name is supplied; authors can explicitly target a named eligible ancestor. This adds a shared container capability without making every element a size-contained box automatically.

Peter subsequently selected application-wide configurable widths: applications may adjust the four ordered, font-relative transitions while retaining the five names and array positions. Configure these widths at startup, before components render. Live replacement of the transition table is outside this configuration contract; normal resizing and native font-relative changes remain supported. The Material widths remain defaults. This does not select arbitrary added bands, per-section breakpoint tables or an exact configuration interface.

Peter also selected range targeting in responsive objects: one band, below a threshold and between thresholds. He subsequently asked to match Chakra and native CSS responsive definitions. Between-threshold ranges include the starting threshold and exclude the ending threshold: mediumToLarge covers medium and expanded, stopping when large begins. Express the boundary with native CSS comparisons rather than copying Chakra's 0.04px approximation. Chakra's ordering model is now selected below; the complete condition-name mapping and its native-range implementation remain to specify. Contradictory Down prose is not adopted.

The serialization format is selected below. Validation, skipped positions, the startup configuration interface and container declaration/target syntax remain inventory work. Existing component-specific limits require review rather than blanket replacement. [Original six-choice checkpoint](../alignment/evidence/phase-4-checkpoint-2026-09-19.json), [layout/typography checkpoint](../alignment/evidence/layout-typography-review-2026-09-19.json), [boundary and layout contract checkpoint](../alignment/evidence/layout-contract-review-2026-09-19.json), [container/configuration choices](../alignment/evidence/query-stack-grid-review-2026-09-19.json).

## HTML format and overlap ordering

Decided 2026-09-20 by Peter: each responsive property has one HTML attribute accepting a plain value, a JSON object or a JSON array. For example, columns='{"compact":1,"medium":2}' or columns='[1,2]'. Lit and React pass the corresponding JavaScript values. Separate attributes for each band/range are not selected. JSON follows Lit's documented object/array conversion and keeps the forms related; correct quoting and brackets are the authoring cost.

Peter selected Chakra's generated-query ordering model over a narrowest-range-wins rule. Results must not depend on responsive-object key insertion order. In the reviewed example, expandedToExtraLarge:2 and large:3 produce three columns in the large band. The pinned comparator was executed in Bun; this is source-level evidence, not a test of the house renderer. Adapt ordering to the already-selected exact native range boundaries; do not copy min/max parsing regexes or the fractional boundary adjustment as the house implementation.

The existing converter treats any leading bracket as JSON and throws for valid scalar grid CSS such as [content-start] 1fr [content-end]. Preserve valid scalar CSS in the new shared converter. Final input validation, array-valued scalar ambiguity and complete ordering/equivalent-condition cases still require the inventory contract. [Answers, sources and isolated checks](../alignment/evidence/responsive-spacing-review-2026-09-20.json).

The later [style-property choice](layout-spacing-properties.md#declaration-order-for-overlapping-properties) follows Chakra's declaration order for overlapping properties within the same condition. It does not replace the query-ordering decision or make condition-key insertion order significant. The [three-engine capture and React follow-up](../alignment/evidence/style-input-integration-review-2026-09-20.json) establish bounded feasibility for two scalar properties; combined responsive-query ordering and the full input protocol remain unverified. An entirely omitted CSS styling input now [reads undefined](layout-spacing-properties.md#omitted-styling-inputs-and-visual-defaults), with its visual default supplied by CSS. This does not settle skipped array positions, invalid-input handling or individual condition removal.

Evidence: [foundation analysis](../analysis/design-foundations.md#responsive-system) and [responsive findings](../alignment/evidence/responsive-review-2026-09-19.json). Source implementation still waits for Phase 5 approval.

## Native font basis for each query mode

After the deadline passed, Peter requested a review of recent rushed work. The review found that the earlier font-scaling description did not distinguish window media queries from container queries. Peter selected **Native CSS rules** after this difference was explained.

Window-query rem thresholds use the initial/browser-default font basis. Container-query rem thresholds use the computed font size of the document root. Keep those native behaviours rather than add a normalization mechanism to force equal thresholds. For example, with a 16px browser default and an authored 20px root font, 37.5rem gives a 600px window threshold and a 750px container threshold.

Document and test both font bases, including authored root-font changes, browser-default changes, custom themes and each required browser engine. Names, array order, nominal rem values and support for both query modes remain selected. This evidence is from specifications and upstream test source, not a new house browser test.

Sources: [media-query units](https://drafts.csswg.org/mediaqueries-5/#units), [container size features](https://drafts.csswg.org/css-conditional-5/#size-container), [WPT font-relative test](https://github.com/web-platform-tests/wpt/blob/master/css/css-conditional/container-queries/font-relative-units.html). [Audit and answer](../alignment/evidence/pace-review-2026-09-19.json).
