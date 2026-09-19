Decided 2026-09-19 by Peter.

# Ship versioned consumer skills

Ship agent guidance with the matching design-system release. Peter selected this over documentation and examples alone, then explicitly requested the complementary [MCP server](design-system-mcp.md).

The purpose is correct artifact authoring: choosing and composing elements, using the supported frameworks, avoiding known mistakes, and updating consumers across releases. The actual skill taxonomy and migration-skill boundaries remain for later review. API references already exist; the skills add task guidance rather than another manually maintained property catalog.

Use the selected [Intent tooling](intent-tooling.md) for validation and distribution. Maintain and evaluate the guidance alongside component APIs and examples. Packaging a skill does not prove an agent activates or follows it.

Evidence: [agent-tooling analysis](../analysis/agent-tooling.md). No consumer skill, project hook or global agent configuration has been installed by this decision.
