# Remove the listed specialised components

Peter explicitly selected removal of Fold, Filter, Round Icon, Shell, Task, Tile, Trend, Bar Row, Key Value, Link Card, Metric List, Page Head, Panel, Stat Strip and Check Row. Round Icon is `ricon`, Key Value is `kv`, and Check Row is `check` in the source inspected on 2026-09-19. These are settled removals, not unanswered proposals.

Decided 2026-09-19 by Peter.

Migration cleanup includes dedicated family parts and collection wrappers: Filters, Tasks, Tiles, Bar Rows, Metric, Panel Head, Panel Foot, Panels and Strip Item. This follows their inspected relationships; it is not a separate new capability decision. Shell removal alone does not settle Side Nav, Topbar or Subnav merely because they share a docs page.

The previous [Card](0012-canonical-card.md) and [Stat](0100-stat-family.md) decisions stand. Data List was identified as a candidate for appropriate Key Value metadata uses; exact replacements must account for secondary text, dates and converted values. Fold's closed summary, selectable metrics, checklist labels and action states must be considered in the replacement inventory. A component removal does not automatically approve another component's interface or require preserving every old visual default.

The approved replacement scope included obsolete interfaces and their associated source, exports, generated-style inputs, tests and docs. No aliases or fallback interface remain part of the selected design. Exact path closure and complete replacement examples were still required at selection time. The source freeze belonged to the completed pass.

Evidence: [local source review](../research/06-codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [explicit request and verified mapping](../verification/systematization/disposition-checkpoint-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
