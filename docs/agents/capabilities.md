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

A likely cause, found on 2026-11-12 and not confirmed: Peter's user settings (`~/.claude/settings.json`) set effort by model under `modelSettings`, with `xhigh` for `claude-opus-5-5` and for `claude-fable-5-2`. Peter asked whether the project's `.claude/settings.json` can define the model and effort of sub-agents. A documentation lookup for that was still running when this note was written; no settings file was changed. Next: get that answer, propose the smallest setting to Peter, and change a settings file only after his yes.
