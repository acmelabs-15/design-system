# Remove Loading Dots

Remove Loading Dots entirely. Peter said Spinner and Progress cover the need, rejecting the suggested dots appearance within Spinner as well as a separate Loading Dots component. Do not reintroduce the dots appearance through a renamed variant.

Decided 2026-09-19 by Peter.

Spinner provides loading feedback without a completion value; Progress describes task progress, including an indeterminate state where appropriate. Exact Progress shapes and interfaces were still inventory work at selection time. [Meter](0063-meter-component.md) represents a bounded measurement rather than task completion.

The inspected Loading Dots and Spinner both showed unmeasured work but had different shapes and inconsistent label handling. The shared loading contracts must cover labels, busy state, reduced motion and Button composition. Full Material Progress text was read, but interactive token sets and specification diagrams were not yet fully reviewed before visual recommendations; this decision is not a completed visual or runtime review.

Evidence: [loading and measurement review](../research/06-codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../verification/systematization/disposition-checkpoint-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
