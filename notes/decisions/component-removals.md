Decided 2026-09-19 by Peter.

# Remove the listed specialised components

Peter explicitly selected removal of Fold, Filter, Round Icon, Shell, Task, Tile, Trend, Bar Row, Key Value, Link Card, Metric List, Page Head, Panel, Stat Strip and Check Row. Round Icon is `ricon`, Key Value is `kv`, and Check Row is `check` in the current source. These are settled removals, not unanswered proposals.

Migration cleanup includes dedicated family parts and collection wrappers: Filters, Tasks, Tiles, Bar Rows, Metric, Panel Head, Panel Foot, Panels and Strip Item. This follows their inspected relationships; it is not a separate new capability decision. Shell removal alone does not settle Side Nav, Topbar or Subnav merely because they share a docs page.

The previous [Card](canonical-card.md) and [Stat](stat-family.md) decisions stand. Data List is a candidate for appropriate Key Value metadata uses; exact replacements must account for secondary text, dates and converted values. Fold's closed summary, selectable metrics, checklist labels and action states must be considered in the replacement inventory. A component removal does not automatically approve another component's interface or require preserving every old visual default.

Remove obsolete interfaces and their associated source, exports, generated-style inputs, tests and docs together in the approved migration. No aliases or fallback interface. Exact path closure and complete replacement examples belong to Phases 4–5; source implementation remains frozen.

Evidence: [local source review](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [explicit request and verified mapping](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
