# @acmelabs/design-system-mcp

Local versioned design-system documentation server. This private workspace reserves the approved package boundary.
The implementation and public exports are completed in M24 of the migration plan.

The core package stays at the repository root. Local Bun resolution uses the root
override and project-local hoisted linker to share the live core build. Packed metadata
retains an exact core peer version and omits local overrides.
