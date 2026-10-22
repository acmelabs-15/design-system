# Use TanStack Intent for consumer-skill tooling

Use TanStack Intent as development tooling for maintaining and distributing the selected consumer skills. Peter chose it over maintaining equivalent tooling ourselves after bounded Bun probes of version 0.4.0.

Decided 2026-09-19 by Peter.

Intent provides validation and package discovery/loading. It does not implement the design-system MCP server or prove the quality of generated artifacts. Pin and review upgrades while the project remains alpha, and retain our own artifact-quality evaluations.

The probe used a synthetic upstream fixture in a temporary directory. It tested invalid/corrected metadata, installed-version content and explicit allowlist rejection. Packaging warnings remained; the test was not a complete publishing workflow.

Detailed CI integration, skill authoring and consumer installation guidance were not settled by this selection. This decision does not authorize automatic edits to AGENTS.md, global settings or agent hooks. The selection did not replace project workflow or official skill-authoring rules.

Evidence: [Intent review](../research/01-agent-tooling.md#tanstack-intent) and [probe results](../verification/systematization/intent-probe-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
