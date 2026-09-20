Decided 2026-09-19 by Peter.

# Add a semantic List component

Add a List component with capabilities like Chakra List: ordered and unordered lists, nested lists, custom markers, and plain or rich item content. Peter explicitly requested this addition during the Field and List discussion. This records that direct request; it was not a selection from a separate multiple-choice question.

List gives related content a consistent list structure and presentation. Support richer content through composition while preserving ordered, unordered and nested-list meaning. Custom marker appearance must not remove the accessible list relationship. The request does not add a selection engine, selected-value ownership or automatic arrow-key navigation. Controls and actions within list content retain their own behavior.

This capability does not decide whether Entity, Item or SettingRow should exist, or turn every row or card into a List item. Shared arrangement and presentation must fit the [Group responsibility decision](toolbar-group-responsibilities.md). Chakra examples are references for capability and composition, not an instruction to copy their framework, styling or exact interface.

Exact parts, markers, spacing, responsive behavior, names and interfaces remain for architecture and the Phase 4 inventory. Verify list semantics, nested content, marker alternatives and interaction with contained controls. The Phase 5 migration plan and approval still govern source changes; none are made by this decision.

The subsequent [focused Item](item-content-family.md) and [general Tree View](general-tree-view.md) decisions distinguish reusable item content and coordinated hierarchy from List's collection meaning. Their exact combined interfaces remain for review.

Evidence: [Field and List composition review](../analysis/codebase-systematization.md#field-and-list-composition-review) and [source review record](../alignment/evidence/field-list-review-2026-09-19.json).
