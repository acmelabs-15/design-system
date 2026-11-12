# Capabilities

What work in this repo needs beyond brain itself: toolchain checks, library skills and MCP servers. The capability check in brain's protocol reads this file. setup-brain wrote it from the repo's files after the user's yes; keep it current by hand as the repo changes.

## Toolchain

A check passes when the command prints a version inside its range, a semver range.

| Command | Version | From |
|---|---|---|
| `bun --version` | `1.4.2` | `packageManager` in `package.json` |

## Library skills

Load a library's skills before you write code that uses the library. `plugin:*` means every skill of that plugin.

| Library | Skills |
|---|---|

## Servers

`Prove with` names the read-only call that shows the server answers. Put the server's own tool there when you know it.

| Server | Configured in | Prove with |
|---|---|---|
| `acme-design-system-docs`, the design system MCP in `packages/mcp` | No host configuration in this repo. Run `bun packages/mcp/dist/cli.js` over stdio from a built checkout. | `resolve_version` with the package version and `framework: "lit"` |

## Sub-agents

Brain's capability check runs before each sub-agent starts, so read these settings at that point.

| Work | Model | Effort | From |
|---|---|---|---|
| Delegated research: a research row, or a search or fetch agent | Opus 5.5 (`opus` in the Agent tool) | `medium` | Peter, 2026-11-12, "where it makes sense" |

A row that needs hard reasoning across many sources can keep the session's model. Say so in chat when you use this exception.
