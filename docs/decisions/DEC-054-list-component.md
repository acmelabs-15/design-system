---
id: DEC-054
migrated: 0.8
kind: architecture
decided: 2026-10-21
---
# Add a semantic List component

Add a List component with capabilities like Chakra List: ordered and unordered lists, nested lists, custom markers, and plain or rich item content. Peter explicitly requested this addition during the Field and List discussion. This records that direct request; it was not a selection from a separate multiple-choice question.

Decided 2026-09-19 by Peter.

List gives related content a consistent list structure and presentation. Support richer content through composition while preserving ordered, unordered and nested-list meaning. Custom marker appearance must not remove the accessible list relationship. The request does not add a selection engine, selected-value ownership or automatic arrow-key navigation. Controls and actions within list content retain their own behavior.

This capability does not decide whether Entity, Item or SettingRow should exist, or turn every row or card into a List item. Shared arrangement and presentation must fit the [Group responsibility decision](DEC-112-toolbar-group-responsibilities.md). Chakra examples are references for capability and composition, not an instruction to copy their framework, styling or exact interface.

Exact parts, markers, spacing, responsive behavior, names and interfaces were left for architecture and inventory work. Verify list semantics, nested content, marker alternatives and interaction with contained controls. The initial capability decision changed no source code.

The subsequent [focused Item](DEC-050-item-content-family.md) and [general Tree View](DEC-043-general-tree-view.md) decisions distinguish reusable item content and coordinated hierarchy from List's collection meaning. Their exact combined interfaces were left for subsequent review.

Evidence: [Field and List composition review](../research/RES-006-codebase-systematization.md#field-and-list-composition-review) and [source review record](../verification/systematization/field-list-review-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../specs/SPEC-003-design-system/spec.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
