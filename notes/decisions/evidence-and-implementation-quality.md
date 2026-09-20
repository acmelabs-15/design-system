Decided 2026-09-19 by Peter.

# Base recommendations on evidence and implementation quality

Peter reaffirmed: “everything should be based on evidence, no assumptions.” Decisions must favour the best implementation for this system, not the fastest, easiest or most convenient path. He explicitly requested reevaluation of earlier suggestions affected by these requirements and durable reminders after compaction.

These requirements reinforce the existing AGENTS.md rules, “Best, not fastest” and “Investigate first.” The failure to correct is inconsistent application, not absence of a standing rule. Requests to move quickly change pacing, parallelism and reuse of established evidence; they do not lower the evidence or quality standard.

## Required method

- Establish the problem from current source with locations, relevant official guidance and reference implementations. Use focused tests when they are needed to distinguish the alternatives.
- Separate observed facts, limited probe results, design reasoning and unresolved questions. Do not fill missing facts or requirements with assumptions, or present a hypothesis as established behaviour.
- Compare viable alternatives against correctness, accessibility, maintainability, testability, performance and compatibility with the agreed stack and requirements. State the trade-offs that actually determine the recommendation.
- Do not equate fewer files, smaller component counts, less initial code, convenience, familiarity or a short probe with superior implementation quality.
- A documented pattern proves that the pattern exists; it does not prove it is best here. A bounded source survey is not community consensus or adoption-weighted preference.
- Reevaluate an earlier recommendation when its supporting evidence is insufficient or new findings change the trade-off. Preserve the history of Peter's choice, expose the gap, and bring a supported revision to him if the direction should change. Approval of a direction is not implementation verification.
- Keep open research and verification gates in the current handoff, with an owner and return point, so compaction cannot turn them into settled facts.

At this reaffirmation, CSS-first was an unselected proposal and the actual Lit-system comparison had to be completed before a renewed recommendation. Peter subsequently [selected compiled CSS feeding generated Lit modules](style-production.md) after that comparison. This sequence illustrates the evidence gate; it does not remove the remaining implementation checks.

Evidence audit and follow-ups: [Phase 3 review](../alignment/phase-3-review.md#evidence-audit), [method record](../analysis/systematic-approach.md#evidence-and-implementation-quality-reaffirmation). The pass README exposes this requirement at the top of its mandatory startup handoff.
