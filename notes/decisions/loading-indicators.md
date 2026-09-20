Decided 2026-09-19 by Peter.

# Remove Loading Dots

Remove Loading Dots entirely. Peter said Spinner and Progress cover the need, rejecting the suggested dots appearance within Spinner as well as a separate Loading Dots component. Do not reintroduce the dots appearance through a renamed variant.

Spinner provides loading feedback without a completion value; Progress describes task progress, including an indeterminate state where appropriate. Exact Progress shapes and interfaces remain inventory work. [Meter](meter-component.md) represents a bounded measurement rather than task completion.

Current Loading Dots and Spinner both show unmeasured work but have different shapes and inconsistent label handling. The shared loading contracts must cover labels, busy state, reduced motion and Button composition. Full Material Progress text was read, but interactive token sets and specification diagrams still need completion before visual recommendations; this decision is not a completed visual or runtime review.

Evidence: [loading and measurement review](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
