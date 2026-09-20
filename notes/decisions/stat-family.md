Decided 2026-09-19 by Peter.

# Keep one flexible Stat family

Keep Stat as one composable family for a measurement: label, value and optional unit, explanation and change display. Peter confirmed “one stat family,” using Chakra Stat and the richer Webhooks Detail 04 example as the direction. Exact parts remain for the inventory.

Remove the separate Trend component during migration. Its change display belongs to Stat. Keep numerical direction separate from whether a change is favourable: fewer failed deliveries can have a downward arrow and a favourable treatment. This is not a separate Trend family.

Peter selected **Composed example** for selectable statistics. Replace Stat Strip and Strip Item with documented composition of Stat and appropriate selection controls; the application owns chart data. He subsequently suggested Radio Cards or Checkbox Cards arranged by Group. Those are candidates, not a final selection-control contract. Compare one selected measurement, several measurements for comparison and switching content panels during the Group review.

Peter separately selected **Use Card and Stat** for Tile and Tiles. Remove both interfaces. Related-content surfaces, including Settings Integrations 02–05, use Card; measurements use Stat; shared layout arranges them. Preserve small measurement summaries, including collapsed-section examples. This separate decision corrects the initial proposal to bundle Tile into Stat before examining its intended Card uses.

The alternatives were a standalone Trend, a ready-made selectable Stat group, and a specialised compact Tile. Shared family parts and documented composition better support the selected consistent-interface goal.

The retained Stat family does not automatically preserve every old helper, built-in meter or Spark implementation. Resolve formatting, absent data versus zero, loading, descriptions, announcements, chart/progress composition and helper names in the inventory. Selection-card integration must preserve valid labels, focus and independent actions; a clickable passive Stat is insufficient.

Evidence: [analysis](../analysis/codebase-systematization.md#stat-family-review), [source and choice record](../alignment/evidence/stat-review-2026-09-19.json). Source changes still require Phase 5 approval.
