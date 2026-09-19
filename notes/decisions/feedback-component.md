Decided 2026-09-19 by Peter.

# Keep Feedback as a component with composed examples

Rebuild Feedback from shared house controls and provide inline and pop-up examples that use it. The library owns the common form experience; the consuming application sends the data. This provides a consistent interface with less repeated assembly for agents, at the cost of maintaining a dedicated component.

Peter selected “Component plus examples” after a broader comparison. Semrush provides a Feedback Form component and larger patterns built on it; Cloudscape provides composed examples; Atlassian separates a form from service-specific collection; e-INFRA provides a complete form with an application submission callback. The initial recipe-only recommendation did not adequately consider those alternatives.

This is an accepted qualification of the [composition rule](composition-over-count.md), not permission to keep every existing compound element. Use the house Lit implementation, shared controls, state, motion and generated styles; React wraps the same component. No reference framework or form package is adopted by this decision. Exact fields, defaults, interfaces, reset/dismissal and submission-state contracts remain for the inventory and verification plan.

Evidence: [message-family analysis](../analysis/codebase-systematization.md#phase-2-message-family) and [Phase 2 review](../alignment/phase-2-review.md).
