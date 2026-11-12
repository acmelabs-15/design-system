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
| Every delegated agent that gathers evidence for a row: research rows, task rows such as a trial, and search or fetch agents | Opus 5.5 (`opus` in the Agent tool) | `medium` | Peter, 2026-11-12 |

Set both values in the Agent call; an agent without them inherits the session's model. Another model needs Peter's yes before the agent starts.

Known fault, found on 2026-11-12: the `effort` value of the Agent call did not take effect. Three agents launched with `model: opus` and `effort: medium` ran on `claude-opus-5-5`, but every request carried the session's effort, `xhigh`. After each launch, read the agent's log to confirm both values: `~/.claude/projects/<project>/<session>/subagents/agent-<id>.jsonl` records `model` and `output_config.effort` on each request. Until the cause is known, the session's own effort decides the effort of its agents.

What Claude Code's documentation says, looked up on 2026-11-12 (https://code.claude.com/docs/en/sub-agents, https://code.claude.com/docs/en/model-config, https://code.claude.com/docs/en/agent-teams):

- Model order, first wins: the `model` of the Agent call, the agent definition, the variable `CLAUDE_CODE_SUBAGENT_MODEL`, the session's model. A project's `.claude/settings.json` may set that variable in its `env` block.
- Effort order, first wins: the variable `CLAUDE_CODE_EFFORT_LEVEL`, the `effort` of the Agent call, the agent definition, the session's level. No setting applies to sub-agents only. `modelSettings.<model>.effortLevel` sets effort for one model, and a project file outranks the user file.
- Agent teams are on in Peter's user settings. With teams on, an Agent call that has a `name` starts a teammate, and the teammate documentation lists no per-call effort. This is the likely reason for the fault above: the named Opus agents took `xhigh` from `modelSettings` in Peter's user settings.
- So the documented way to get medium effort is an Agent call without a `name`, with `model` and `effort` in the call, or an agent definition that sets `effort`.

No settings file was changed. Peter's choice between unnamed calls and a project setting is recorded below when he makes it.
