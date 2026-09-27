Decided 2026-09-26 under Peter's delegated execution authority.

# Give the published core package its own workspace

The public @acmelabs/design-system manifest lives in packages/core. The repository root owns development tools and is private. React, MCP and Devtools resolve core as an ordinary workspace. This removes the root-package override that reproduces incorrect nested links during incremental installs on both tested Bun releases.

Keep one authored source tree and one generated runtime. Generated delivery links expose only the approved dist/assets/README/skills paths to the core workspace. The packer validates and copies those targets into an ordinary self-contained package; installed consumers need no symlinks or configuration. Public package names and interfaces stay the approved ones.

Changing override syntax, repeated cleanups and upgrading to Bun1.4.2 do not fix the demonstrated install defect. A real workspace supplies supported package ownership without a custom package-manager repair hook. [Evidence and consequences](../analysis/repository-layout.md#m25-core-workspace-correction--2026-09-26); [execution authority](execution-delegation.md).
