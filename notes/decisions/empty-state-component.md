Decided 2026-09-19 by Peter.

# Keep Empty State for a consistent absent-content structure

Keep Empty State as a component built from shared parts, with examples. It gives agents a consistent structure for explaining absent content and offering an appropriate next action. Consistent structure and appearance can justify this component even without additional user interaction.

Peter questioned the recipe-only recommendation and asked for comparison with Chakra. After the comparison and an explanation of the composition rule, he accepted the revised recommendation with “Great, let's continue.” Chakra separates root, content, indicator, heading and description, with shared size styling; those are design evidence, not a requirement to duplicate its React component tree or adopt its exact values.

This qualifies the [composition rule](composition-over-count.md) for Empty State. It does not approve every existing fixed arrangement. Final slots, heading semantics, sizing, border/background treatments, responsive behaviour and announcements remain for the inventory. Current plain-div title markup, fixed padding and mixed background/text-size setting are review findings, not automatically retained interfaces.

Evidence: [message-family analysis](../analysis/codebase-systematization.md#phase-2-message-family) and [Phase 2 review](../alignment/phase-2-review.md).
