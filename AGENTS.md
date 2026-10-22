# ACMElabs design system

This repository owns the Lit components with the acme- prefix and their shared delivery, React bridge and consumer tools. One workflow serves all five packages. Current work belongs to [docs/STATUS.md](docs/STATUS.md).

## Session start

From a package directory, find the Git repository root and use it for this workflow. Complete these steps before starting the requested work.

1. Read [status](docs/STATUS.md), [domain routing](docs/agents/domain.md), [the context map](CONTEXT-MAP.md) and the glossary for the task. Read each selected file to its last line.
2. Read [the specification index](spec/README.md), then the active specification, plan and task list named by status. Read [the record layout](docs/agents/workflow.md). Preserve an incomplete plan when Peter changes the request.
3. Inspect Git status and the active branch. Verify the selected Bun executable and its version. Preserve work owned by other sessions. Read [repository ownership](docs/agents/repository.md) and [verification](docs/agents/verification.md) before editing; identify authored inputs, generated outputs, affected packages and applicable check evidence.
4. Establish the baseline from its revision, inputs and check scope. Run missing or invalidated checks using the verification guide. A historical green result does not close a newer failure.
5. Report the phase, last completed step, next step, red checks and pending decisions in five lines or fewer. Follow Peter's current request. A request to continue resumes the next approved task; a completed plan does not authorize another feature.

## Work through brain

Use brain:using-brain to select the applicable skill. Agent-skills remains available. When both plugins provide the same skill, use brain's version. The plugins own the lifecycle and engineering procedures; this repository supplies its facts and record locations.

A user-owned decision or permission uses brain:ask-user-question and its host reference. Keep approval scoped to the actual task and action. The status file records current authorization; a completed pass or another repository grants no standing permission here.

Setup, wait-what, handoff, triage and wayfinder start from Peter's prompt. When one is needed, give him the applicable command or skill invocation. [CLAUDE.md](CLAUDE.md) carries Claude command spellings; Codex uses the installed skill names.

Before changing an area, read the applicable decisions and research through their [decision](docs/decisions/README.md) and [research](docs/research/README.md) indexes. Use the glossary's names. Source facts, proposals, selected contracts and verification results remain distinct.

| Change | Required guidance |
| --- | --- |
| Component behavior or interface | [Component rules](docs/development/components.md), [interface conventions](docs/development/interfaces.md), and its owning specification |
| CSS or style production | [Style ownership](docs/development/styles.md); [generation and comparison](docs/development/generation.md) when mapped sources or census evidence change |
| Package or dependency responsibility | [Selected stack](docs/development/stack.md) and the package ownership map |
| Website, examples or consumer guidance | [Documentation rules](docs/development/documentation.md) |
| A reference comparison | [Reference sources](docs/development/reference-sources.md) |
| A domain term or decision record | brain:domain-modeling and [domain routing](docs/agents/domain.md) |
| A skill or agent instruction file | The official skill-creator workflow and brain:writing-for-agents |

## Task end and handoff

1. Update the task's acceptance checks and any specification whose facts change. Record research or a decision in its one owning record.
2. Save exact verification commands, results, revision and limits. Use focused checks for each slice, then the full gate and review at the task's closure.
3. Rewrite [status](docs/STATUS.md) with the next action, anything red and what awaits Peter. Include the exact invocation when the next step is user-started. A fresh session must resume without the conversation.
4. Record what is committed, uncommitted, pushed or awaiting approval. Stage owned files by name. Use only the local-commit and outward-action authorization actually granted for this work. Merge approved pull requests with merge commits.

Historical plans and releases provide evidence. They do not restart their completed phases. The [local issue tracker](docs/agents/issue-tracker.md) owns unresolved follow-ups; its [labels](docs/agents/triage-labels.md) define their status.
