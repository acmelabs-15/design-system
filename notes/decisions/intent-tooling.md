Decided 2026-09-19 by Peter.

# Use TanStack Intent for consumer-skill tooling

Use TanStack Intent as development tooling for maintaining and distributing the selected consumer skills. Peter chose it over maintaining equivalent tooling ourselves after bounded Bun probes of version 0.4.0.

Intent provides validation and package discovery/loading. It does not implement the design-system MCP server or prove the quality of generated artifacts. Pin and review upgrades while the project remains alpha, and retain our own artifact-quality evaluations.

The probe used a synthetic upstream fixture in a temporary directory. It tested invalid/corrected metadata, installed-version content and explicit allowlist rejection. Packaging warnings remained; the test was not a complete publishing workflow.

Detailed CI integration, skill authoring and consumer installation guidance remain open. This decision does not authorize automatic edits to AGENTS.md, global settings or agent hooks. The existing project workflow and official skill-authoring rules still govern.

Evidence: [Intent review](../analysis/agent-tooling.md#tanstack-intent) and [probe results](../alignment/evidence/intent-probe-2026-09-19.json).
