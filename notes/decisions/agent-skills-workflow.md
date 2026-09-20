Decided 2026-09-19 by Peter.

# Use Agent Skills throughout the remaining systematization pass

Use Addy Osmani's Agent Skills from planning through review, while keeping the existing project decisions and approval steps. Peter selected this scope over implementation-only use or final testing and review only.

The native Codex plugin `agent-skills@agent-skills` is installed and enabled at version 0.6.10. Its 25 skills and shared references remain together. Load the relevant skill for the current work; keep the project records under `notes/` as the source of truth.

The pack supplements the existing pass. Project instructions still govern the package stack, generated CSS, Bun tests, complete replacements, decisions put to Peter, and permission to commit or publish. Installing the pack does not approve an element interface or the Phase 5 migration plan.

Installation evidence, workflow mapping, and differences from the pack's defaults are in [systematic-approach.md](../analysis/systematic-approach.md#agent-skills-for-the-systematization-pass).

## Complete replacements and current documentation

Peter reaffirmed that no one else uses this library. An approved replacement removes the old implementation and interface completely: no compatibility aliases, fallback paths, deprecated exports or legacy mode. Generic additive-API and staged compatibility guidance in the skills does not apply to this pass.

Code, JSDoc, README and consumer documentation describe only the current design. Do not add commentary about what a name or implementation used to be, or instructions for continuing to use the replaced design. Replacement mappings, rationale and history belong in notes and Git history. During migration, update the affected source, exports, maps, generated output, tests and examples together; verify that the removed interface is absent. This clarification does not bypass the Phase 5 implementation gate.
