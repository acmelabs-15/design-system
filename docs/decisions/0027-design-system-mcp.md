# Provide a design-system documentation MCP server

Provide an AG Grid-style MCP server for version-matched design-system documentation, component APIs and examples. Peter explicitly added this requirement while selecting versioned consumer skills.

Decided 2026-09-19 by Peter.

The selected scope supports artifact authoring and version-aware retrieval. It does not authorize live component control, code execution or application-data access. Use the shared documentation and metadata sources rather than a separate handwritten API catalog.

Transport, packaging/hosting, version resolution for installed packages and CDN-only artifacts, resource/tool names, prompt scope, and verification were not yet designed by this selection. The inspected AG Grid package's cached defaults and name inconsistencies are findings to learn from, not a selected interface to copy.

Evidence: [MCP implementation review](../research/01-agent-tooling.md#ag-grid-mcp-server). The initial decision installed, configured, deployed or published no MCP server.

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
