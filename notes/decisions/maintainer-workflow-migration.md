Decided 2026-10-21 by Peter.

# Replace the maintainer workflow with agent-skills and brain

Use the workflow established in Peter's CLI and D&D projects, adapted to this monorepo. Complete the migration to the new file and directory structure, names, content and formats. Preserving old paths can support the transition, but leaving the old structure behind a new index is not the final result.

Remove all five skills under .agents/skills as part of the migration. The plugin skills supply the workflow. Preserve useful product decisions and evidence, while retiring or rewriting project-specific rules that contradict, collide with or confuse the new workflow. Calling a rule project-specific is not a reason to keep a conflict.

These are Peter's direct clarifications. The concrete [migration specification](../../spec/SPEC-maintainer-workflow.md) is a proposal for review. Its target path details, verification plan and implementation completion are not implied by this decision.
