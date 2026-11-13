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
| `acme-design-system-docs`, the design system MCP in `packages/mcp` | No host configuration in this repo. Run `bun packages/mcp/dist/cli.js` over stdio from a built checkout. | `resolve_version` with `packageVersion`, the version of the package, and `framework: "lit"` |

## Sub-agents

Brain's capability check runs before each sub-agent starts, so read this section at that point.

Start every delegated agent that gathers evidence for a row this way. It covers research rows, task rows such as a trial, and search or fetch agents.

| Field of the Agent call | Value | Reason |
|---|---|---|
| `name` | Leave it out | Agent teams are on in Peter's user settings. A call with a name starts a teammate, and a teammate ignores the `effort` of the call. |
| `model` | `opus`, which is Opus 5.5, or `fable`, which is Fable 5.2. The main session chooses for each agent. | Peter, 2026-11-13 ([DEC-150](../decisions/DEC-150-delegated-agents-run-on-opus-or-fable.md)) |
| `effort` | `medium` or `high`. The main session chooses for each agent. `medium` is the lowest. | Peter left this to the agent on 2026-11-13, on the condition that the quality does not suffer (DEC-150) |

1. Choose the model and the effort for each agent. Peter gives no rule for the choice. The agent's guide of 2026-11-13: Fable 5.2 for a row on which a decision that is hard to reverse rests, or many other rows, or that asks for a judgment across sources that disagree; Opus 5.5 for a survey, an inventory, a listing and a mechanical task. `high` for a row where an error costs much, and to continue a record that came back incomplete at `medium`; `medium` for the rest. Write the model, the effort and the reason in one line into the Notes of the idea.
2. Leave out `name`. Address the agent by the agent ID that the call returns, and write that ID into the Notes of the idea.
3. After the start, confirm both values in the agent's log: `~/.claude/projects/<project>/<session>/subagents/agent-<id>.jsonl` records `model` and `output_config.effort` on each request. If either value is wrong, stop the agent and tell Peter. Check the log again when the agent ends, before you read its record: on 2026-11-13 two agents changed to another model late in their run, during an outage of the login. A record from such a log is not accepted.
4. A model other than these two, or the effort `low`, `xhigh` or `max`, needs Peter's yes before the agent starts.

Peter chose this route on 2026-11-12 over a project setting, so no settings file sets these values. Until 2026-11-13 the model was Opus 5.5 for every agent. The background: on that day three named agents ran on Opus 5.5 at `xhigh`, because they took the effort that Peter's user settings save for that model. Claude Code's documentation gives the orders of precedence: https://code.claude.com/docs/en/sub-agents and https://code.claude.com/docs/en/model-config.

### Workflows

A workflow starts its own agents, so the same values apply to each of them (Peter, 2026-11-12).

1. Set the chosen model, `"opus"` or `"fable"`, and the chosen effort, `"medium"` or `"high"`, on every `agent()` call of the workflow script.
2. After the start, confirm both values in the log of the first agent: `~/.claude/projects/<project>/<session>/subagents/workflows/<run ID>/agent-<id>.jsonl`. If either value is wrong, stop the run and tell Peter.
3. The built-in `deep-research` workflow takes only the question and sets neither value, so its agents take the session's model and effort. Run the copy `.artifacts/v1/research/deep-research-opus-medium.js` with the question as `args`. The copy is scratch, outside git. When it is missing, make it again: take the script that a run of the built-in workflow saves under the session folder, and add the two values to each of its five `agent()` calls.
4. One run of that script reads at most 15 sources and checks at most 25 claims. It fits a landscape question; it cannot list every item of a large set.
