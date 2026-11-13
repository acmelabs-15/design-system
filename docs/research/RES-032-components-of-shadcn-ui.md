---
id: RES-032
status: in-progress # in-progress | resolved
kind: research
from: IDEA-001#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-032: Component inventory of shadcn/ui

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
Which components does shadcn/ui have, what does it call each one, and how does it split each one into parts?

## Answer
Not answered yet. The inventory run is in progress.

Needed by: RES-037, the comparison matrix, which answers IDEA-001#01.

Sufficient-answer condition:

- Every component page of the current official documentation of shadcn/ui has one record, or is named as a page that no agent could read.
- Each record holds the component name as the documentation writes it, its parts as written, how a developer uses it (one component, parts, or both) and the link to its page.
- The record states the version of shadcn/ui and the access date.

The record gives facts and sources only. It gives no recommendation.

### How the run works
- Tool: `.artifacts/v1/research/deep-research-component-inventory.js` (scratch, outside git). It is the `deep-research` workflow of Claude Code, changed for an inventory. Peter asked for this on 2026-11-12 (IDEA-001, Notes).
- Scope: two agents list every component page, one from the navigation of the documentation and one from a machine-readable source. The run reads the union of both lists.
- Fetch: agents read the pages in groups of five and write one record for each page.
- Verify: a second agent reads every page again and confirms or corrects each record.
- Every agent runs on Opus 5.5 at medium effort; the logs of both listing agents show `claude-opus-5-5` and `medium`.
- Arguments: date 2026-11-12, documentation root https://ui.shadcn.com/docs/components.

## Findings
None yet.

## Follow-ups
None yet.

## Next action
Wait for workflow run `wf_1b43c93e-fa0` (task `waqvkjna2`), started on 2026-11-12. Its full result is in the task output file that the notification names, and in `journal.jsonl` of the run's transcript folder. Then render the records into this file with a script, state the counts and the pages that failed, and judge the sufficient-answer condition. If the run is lost, start the script again with the same arguments, or resume it with the run ID.
