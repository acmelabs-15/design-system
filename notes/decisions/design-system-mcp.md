Decided 2026-09-19 by Peter.

# Provide a design-system documentation MCP server

Provide an AG Grid-style MCP server for version-matched design-system documentation, component APIs and examples. Peter explicitly added this requirement while selecting versioned consumer skills; no further confirmation of that selection is needed.

The selected scope supports artifact authoring and version-aware retrieval. It does not authorize live component control, code execution or application-data access. Use the shared documentation and metadata sources rather than a separate handwritten API catalog.

Transport, packaging/hosting, version resolution for installed packages and CDN-only artifacts, resource/tool names, prompt scope, and verification remain to design. The inspected AG Grid package's cached defaults and name inconsistencies are findings to learn from, not a house interface to copy.

Evidence: [MCP implementation review](../analysis/agent-tooling.md#ag-grid-mcp-server). No MCP server was installed, configured, deployed or published.
