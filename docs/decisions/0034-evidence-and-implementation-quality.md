# Base recommendations on evidence and implementation quality

Peter reaffirmed that recommendations require evidence and must favor the best implementation for this system. He requested reevaluation of affected earlier suggestions and durable records so compaction did not erase open questions.

Decided 2026-09-19 by Peter.

Peter's words were “everything should be based on evidence, no assumptions.” The issue was inconsistent application of his existing “Best, not fastest” and “Investigate first” preferences. Requests for speed changed pacing, parallelism and evidence reuse; they did not lower the evidence or quality standard. The [maintainer workflow](../../spec/SPEC-maintainer-workflow.md) now assigns the procedure and handoff owners.

## Required method

The reaffirmation required these distinctions and comparison criteria:

- Current source locations, relevant official guidance, reference implementations and focused tests established the problem and distinguished alternatives.
- Observed facts, bounded probes, reasoning and unresolved questions stayed separate. Hypotheses did not become established behavior.
- Correctness, accessibility, maintainability, testability, performance and compatibility with the selected stack determined the trade-off.
- Fewer files or components, less initial code, convenience, familiarity and a short probe did not establish better implementation quality.
- A documented pattern proved existence, not suitability. A bounded source survey did not establish community consensus or adoption-weighted preference.
- Insufficient evidence or new findings triggered reevaluation. Peter's choice history stayed intact; a changed direction needed a supported revision. Approval did not establish implementation verification.
- The handoff kept open research and verification with an owner and return point, so compaction could not turn them into settled facts.

At this reaffirmation, CSS-first was an unselected proposal. The actual Lit-system comparison preceded a renewed recommendation. Peter subsequently [selected compiled CSS feeding generated Lit modules](0104-style-production.md). This history illustrates the evidence requirement without claiming that design approval completed implementation checks.

Evidence audit and follow-ups: [Phase 3 review](../history/systematization/architecture-review.md#evidence-audit), [method record](../research/20-systematic-approach.md#evidence-and-implementation-quality-reaffirmation). The completed pass originally put this reminder at the top of its startup record.
