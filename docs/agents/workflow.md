# Workflow records

Brain owns the workflow. These locations adapt its records to this repository and preserve one owner for each fact.

| Record | Owner |
| --- | --- |
| Current phase, next action, pending approval and working state | [STATUS](../STATUS.md) |
| Capability index and current requirements | [spec/](../../spec/README.md) |
| Approved current plan and task acceptance | tasks/plan.md and tasks/todo.md |
| Completed plans and task snapshots | tasks/done/ |
| Intent and interview answers | docs/design/ |
| Selected decisions and their reasons | docs/decisions/NNNN-slug.md |
| Research and its index | docs/research/NN-slug.md and README.md |
| Release summaries | docs/releases/ |
| Durable verification and original evidence | docs/verification/ |
| Completed process history | docs/history/ |
| Open issues and wayfinder records | [Local tracker](issue-tracker.md) |
| Live cross-package acceptance code and fixtures | scripts/verification/ |
| Scratch outputs | .artifacts/ |

When a skill names an intent or interview output, use docs/design/ here. Keep its procedure and decision boundary. Research updates its existing subject record; a new subject gets a numbered note and an index entry. Numbers identify records; they do not invent decision chronology.

An explicit later decision can supersede an earlier selection. Preserve the earlier reasons and date, then link the resolution. Update the current requirement once. Historical evidence keeps its original bytes and limits.

## Shared work

One active status and plan/task pair serves the monorepo. Each task names authored inputs, generated outputs, affected packages and checks. A package-local rule is justified only by an actual local difference.

A delegated task names its owned files and result-file path. The worker writes findings there. The coordinator reads the file before accepting the result and owns shared indexes, status and commits. Serialize shared generator, build and browser jobs.

Keep an incomplete plan when a new request arrives. Record the relationship or interruption in status. A new request is not automatic approval to overwrite the existing plan or change a selected product contract.

## Migration evidence terms

These terms describe the maintainer migration records; they are not additional product contexts.

- A baseline identifies the source revision and the inputs/results whose scope is being verified.
- The migration ledger maps each original file to a destination or a justified retirement.
- A batch is a bounded group with named files and acceptance checks.
- Byte preservation means the source and destination contain exactly the same bytes, including final newlines.

The [migration evidence index](../verification/workflow-migration/README.md) owns its detailed mappings and checks. Current status remains in STATUS; an evidence report is not another task queue.
