Decided 2026-09-19 by Peter.

# Keep AI support focused on artifact authoring in this pass

This pass includes versioned consumer skills, Intent tooling and a documentation/API MCP server. It does not include an AG Grid AI Toolkit-style facility for AI control of live components inside running applications.

Peter selected authoring support only after the distinction was explained with the example “sort by revenue” in a running table. Runtime operations would need their own use case, state contract and validation. They are outside this pass, not an implied later milestone.

The AG Grid schema-builder investigation remains research evidence. It does not authorize model calls, application-data transfer, or a second declarative UI representation.

Evidence: [AI Toolkit review](../analysis/agent-tooling.md#ag-grid-ai-toolkit).
