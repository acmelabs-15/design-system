---
id: DEC-036
migrated: 0.8
kind: architecture
decided: 2026-10-21
---
# Keep Feedback as a component with composed examples

Rebuild Feedback from shared controls and provide inline and pop-up examples that use it. The library owns the common form experience; the consuming application sends the data. This provides a consistent interface with less repeated assembly for agents, at the cost of maintaining a dedicated component.

Decided 2026-09-19 by Peter.

Peter selected “Component plus examples” after a broader comparison. Semrush provides a Feedback Form component and larger patterns built on it; Cloudscape provides composed examples; Atlassian separates a form from service-specific collection; e-INFRA provides a complete form with an application submission callback. The initial recipe-only recommendation did not adequately consider those alternatives.

This is an accepted qualification of the [composition rule](DEC-018-composition-over-count.md), not permission to keep every existing compound element. Use the Lit implementation, shared controls, state, motion and generated styles; React wraps the same component. No reference framework or form package is adopted by this decision. Exact fields, defaults, interfaces, reset/dismissal and submission-state contracts were still to be specified and verified.

Evidence: [message-family analysis](../research/RES-006-codebase-systematization.md#phase-2-message-family) and [Phase 2 review](../history/systematization/scope-review.md).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../specs/SPEC-003-design-system/spec.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
