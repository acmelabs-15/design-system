Decided 2026-09-19 by Peter.

# Use Agent Skills throughout the remaining systematization pass

Use Addy Osmani's Agent Skills from planning through review, while keeping the existing project decisions and approval steps. Peter selected this scope over implementation-only use or final testing and review only.

The native Codex plugin `agent-skills@agent-skills` is installed and enabled at version 0.6.10. Its 25 skills and shared references remain together. Load the relevant skill for the current work; keep the project records under `notes/` as the source of truth.

The pack supplements the existing pass. Project instructions still govern the package stack, generated CSS, Bun tests, complete replacements, decisions put to Peter, and permission to commit or publish. Installing the pack does not approve an element interface or the Phase 5 migration plan.

Installation evidence, workflow mapping, and differences from the pack's defaults are in [systematic-approach.md](../analysis/systematic-approach.md#agent-skills-for-the-systematization-pass).

## Complete replacements and current documentation

Peter reaffirmed that no one else uses this library. An approved replacement removes the old implementation and interface completely: no compatibility aliases, fallback paths, deprecated exports or legacy mode. Generic additive-API and staged compatibility guidance in the skills does not apply to this pass.

Code, JSDoc, README and consumer documentation describe only the current design. Do not add commentary about what a name or implementation used to be, or instructions for continuing to use the replaced design. Replacement mappings, rationale and history belong in notes and Git history. During migration, update the affected source, exports, maps, generated output, tests and examples together; verify that the removed interface is absent. This clarification does not bypass the Phase 5 implementation gate.

## Complete component proposals and visible progress

Decided 2026-09-20 by Peter: consolidate existing decisions and evidence into complete component proposals, let the agent resolve routine engineering details, and reserve questions for consequential choices in the context of those proposals. Peter approved this correction after objecting that the prolonged foundation/helper discussion was not producing visible phase-level progress.

The [remaining-work queue](../alignment/remaining-work.md) organizes the agreed scope into review groups and assigns technical checks to the agent. It does not create new phases, remove required evidence, approve draft interfaces or waive individual inventory/migration approval. Existing selections remain settled; bring a concrete revision to Peter only when new evidence requires one.

Lead progress reports with complete proposals ready for review, entries approved, remaining review groups, the next complete deliverable and material blockers. Link counts and probe counts are supporting verification rather than the main progress measure. Keep the existing one-question-at-a-time tool workflow for real user decisions; do not replace it with an open-ended implementation-detail interview. [Coverage and approval record](../alignment/evidence/remaining-work-consolidation-2026-09-20.json).

The later [established-reference instruction](reference-systems.md#follow-the-established-reference-without-another-preference-question) narrows that question queue further: when the assigned Chakra/Radix/other source supplies the behavior, inspect and apply it. Do not manufacture a user choice by proposing an alternative to a known reference without a demonstrated house conflict or gap. Keep source-derived resolutions distinct from user votes and full-entry approval.

## Assemble the whole proposal set before the next decision walk

Decided 2026-09-20 by Peter: put every remaining proposal together first, apply the established references, and then review only actual unresolved questions. This supersedes the prior sequence of preparing one family and repeatedly stopping for its smaller decisions. Peter explicitly described that sequence as painful.

Complete the Phase 4 proposal set across all thirteen review groups: components and their parts/recipes, shared conventions, documentation and tooling. Keep accepted decisions, source-derived details, proposed house adaptations and unresolved choices distinct. Investigate discoverable facts and perform agent-owned checks without asking Peter to direct each step. Collect genuine user choices in one review register and ask them only after the set is assembled, one at a time through the existing question skill/tool. A blocked detail does not stop independent proposals from being prepared.

This authorizes records/research/proposal assembly, not production implementation or silent approval of new behavior. Phase 4 review and the Phase 5 migration approval remain required. Report coverage and concrete deliverables, not another promise to prepare the next small piece.
