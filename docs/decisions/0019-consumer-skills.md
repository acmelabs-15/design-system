# Ship versioned consumer skills

Ship agent guidance with the matching design-system release. Peter selected this over documentation and examples alone, then explicitly requested the complementary [MCP server](0027-design-system-mcp.md).

Decided 2026-09-19 by Peter.

The purpose is correct artifact authoring: choosing and composing elements, using the supported frameworks, avoiding known mistakes, and updating consumers across releases. The actual skill taxonomy and migration-skill boundaries were left for later review. API references already exist; the skills add task guidance rather than another manually maintained property catalog.

Use the selected [Intent tooling](0048-intent-tooling.md) for validation and distribution. Maintain and evaluate the guidance alongside component APIs and examples. Packaging a skill does not prove an agent activates or follows it.

Evidence: [agent-tooling analysis](../research/01-agent-tooling.md). The decision itself installed no consumer skill, project hook or global agent configuration.

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
