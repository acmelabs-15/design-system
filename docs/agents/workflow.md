# Workflow records

Brain owns the workflow. [The workspace](workspace.md) names the folders for ideas, decisions, research and specs, and says how to find the active work. This file adds the record locations that are specific to this repository. Each fact has one owner.

| Record | Owner |
| --- | --- |
| Current stage, next action, pending approval and working state | The rows and records of the unfinished ideas and specs; [the workspace](workspace.md#session-state) reports them |
| Intent, interview answers and the map of open questions | docs/ideas/IDEA-NNN-slug.md |
| Requirements, approved plan and task acceptance | specs/SPEC-NNN-slug/, with spec.md, tasks/plan.md and tasks/todo.md |
| Selected decisions and their reasons | docs/decisions/DEC-NNN-slug.md |
| Research | docs/research/RES-NNN-slug.md |
| Scope, phases and interview rules of the 1.0 refactor, in Peter's words | [Kickoff prompt](../design/v1-kickoff-prompt-original-2026-11-12.md) |
| Source prompts and intent documents of releases 0.1 to 0.3 | docs/design/ |
| Indexes of the decisions, research and specifications of releases 0.1 to 0.3 | docs/history/ |
| Release summaries | docs/releases/ |
| Durable verification and original evidence | docs/verification/ |
| Completed process history | docs/history/ |
| The retired status note, with its bytes kept | [docs/agents/history/STATUS.md](history/STATUS.md) |
| Unresolved follow-ups of release 0.3.3 | [Maintenance index](../../.scratch/maintenance/issues/README.md) |
| Live cross-package acceptance code and fixtures | scripts/verification/ |
| Scratch outputs | .artifacts/ |

Create each numbered file through `brain new-doc`. Research updates its existing subject record; a new subject gets a new record. Numbers identify records; they do not invent decision chronology.

An explicit later decision can supersede an earlier selection. Preserve the earlier reasons and date, then link the resolution. Update the current requirement once. Historical evidence keeps its original bytes and limits.

## Domain and earlier records

Two linked contexts exist; [the glossary map](../../GLOSSARY-MAP.md) names them. Packages share those contexts, so a new package does not create a new glossary. Shared component terms are defined once, in the component glossary.

Use component names directly. Every component belongs to the same design system. Explain a material Lit or platform trade-off when the task needs it.

The decision, research and specification records of releases 0.1 to 0.3 keep their dates, evidence and supersession links. They are evidence for a 1.0 question, not its answer. A historical count or a passing prototype proves only its recorded scope. Find them through the [decision index](../history/decision-index-0.3.md), the [research index](../history/research-index-0.3.md) and the [specification index](../history/specification-index-0.3.md).

A code difference does not change an approved contract. Name the conflict and record the decision through brain:domain-modeling.

## Shared work

One workflow serves the monorepo. Each task names authored inputs, generated outputs, affected packages and checks. A package-local rule is justified only by an actual local difference.

A delegated task names its owned files and result-file path. The worker writes findings there. The coordinator reads the file before accepting the result and owns map rows, plan rows and commits. Serialize shared generator, build and browser jobs.

Keep an incomplete plan when a new request arrives. Record the relationship or interruption in the plan or the idea. A new request is not automatic approval to overwrite the existing plan or change a selected product contract.

## Migration evidence terms

These terms describe the maintainer migration records; they are not additional product contexts.

- A baseline identifies the source revision and the inputs/results whose scope is being verified.
- The migration ledger maps each original file to a destination or a justified retirement.
- A batch is a bounded group with named files and acceptance checks.
- Byte preservation means the source and destination contain exactly the same bytes, including final newlines.

The [migration evidence index](../verification/workflow-migration/README.md) owns its detailed mappings and checks. Current state stays in the ideas and specs; an evidence report is not another task queue.
