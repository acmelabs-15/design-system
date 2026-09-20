Decided 2026-09-19 by Peter.

# Share responsive values across layout and appearance

Provide one responsive approach for layout, typography, component sizes and appropriate visual variants. Peter selected this over limiting responsive values to layout alone.

Use Material's five size bands as the default set, combined with Chakra-style responsive authoring capabilities. Peter selected Material bands separately from the authoring approach. Their reference transitions are 600, 840, 1200 and 1600.

For window media queries, make thresholds scale with the browser's default font size. At a 16px initial font size, they match those reference widths; the direct rem conversion is 37.5, 52.5, 75 and 100. Page-authored font sizes do not themselves change media-query thresholds. Ordinary zoom also changes the available CSS viewport width. Container queries follow the separately clarified native font basis below.

## Phase 4 authoring selections

Peter selected plain values plus both named objects and positional arrays. Use compact, medium, expanded, large and extraLarge as the five public band names and as the array order. This chooses Material names over Chakra-style shorthand while retaining the previously selected font-relative thresholds.

Peter selected both window and container widths. Window width is the default; container-based responsiveness is explicitly selected and authors establish a query container. This adds a shared container capability without making every element a size-contained box automatically.

Peter subsequently selected application-wide configurable widths: applications may adjust the four ordered, font-relative transitions while retaining the five names and array positions. The Material widths remain defaults. This does not select arbitrary added bands, per-section breakpoint tables or an exact configuration interface.

Peter also selected range targeting in responsive objects: one band, below a threshold and between thresholds. He subsequently asked to match Chakra and native CSS responsive definitions. Between-threshold ranges include the starting threshold and exclude the ending threshold: mediumToLarge covers medium and expanded, stopping when large begins. Express the boundary with native CSS comparisons rather than copying Chakra's 0.04px approximation. Exact complete condition names and overlap rules remain to specify; contradictory Down prose is not adopted.

Exact attribute/property serialization, skipped positions, configuration lifecycle and container declaration/selection remain inventory work. Existing component-specific limits require review rather than blanket replacement. [Original six-choice checkpoint](../alignment/evidence/phase-4-checkpoint-2026-09-19.json), [layout/typography checkpoint](../alignment/evidence/layout-typography-review-2026-09-19.json), [boundary and layout contract checkpoint](../alignment/evidence/layout-contract-review-2026-09-19.json).

Evidence: [foundation analysis](../analysis/design-foundations.md#responsive-system) and [responsive findings](../alignment/evidence/responsive-review-2026-09-19.json). Source implementation still waits for Phase 5 approval.

## Native font basis for each query mode

After the deadline passed, Peter requested a review of recent rushed work. The review found that the earlier font-scaling description did not distinguish window media queries from container queries. Peter selected **Native CSS rules** after this difference was explained.

Window-query rem thresholds use the initial/browser-default font basis. Container-query rem thresholds use the computed font size of the document root. Keep those native behaviours rather than add a normalization mechanism to force equal thresholds. For example, with a 16px browser default and an authored 20px root font, 37.5rem gives a 600px window threshold and a 750px container threshold.

Document and test both font bases, including authored root-font changes, browser-default changes, custom themes and each required browser engine. Names, array order, nominal rem values and support for both query modes remain selected. This evidence is from specifications and upstream test source, not a new house browser test.

Sources: [media-query units](https://drafts.csswg.org/mediaqueries-5/#units), [container size features](https://drafts.csswg.org/css-conditional-5/#size-container), [WPT font-relative test](https://github.com/web-platform-tests/wpt/blob/master/css/css-conditional/container-queries/font-relative-units.html). [Audit and answer](../alignment/evidence/pace-review-2026-09-19.json).
