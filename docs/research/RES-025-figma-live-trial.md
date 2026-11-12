---
id: RES-025
status: in-progress # in-progress | resolved
kind: task
from: IDEA-002#16
date: 2026-11-12
---
# RES-025: Live trial of one component through the Figma MCP

## Question
What does a live trial of one component made through the Figma MCP show: the number of calls, the manual cleanup, the errors, whether `use_figma` counts against the rate limit, and whether a Starter account can write to its own drafts?

## Answer
Not answered yet. No step has run.

Completion condition: one component with variants, component properties and variable bindings exists in a Figma draft file, made through the remote Figma MCP. This record then states the number of tool calls, each error, the manual cleanup that was necessary, the answer on the rate limit and the answer on Starter drafts.

Planned steps:

1. Peter creates a free Figma account (Starter). Only Peter can do this step.
2. Peter says so. The agent starts the Figma sign-in of the installed plugin, and Peter approves it in the browser.
3. The agent makes one read call and one small write call to a draft file. This shows whether a Starter account can write to its own drafts. Starter allows 20 read calls each month, so the agent counts every call here.
4. If Starter cannot write: Peter buys the Professional plan with one Full seat and monthly billing (RES-024: $20 for each month). Only Peter can do this step.
5. The agent builds the trial component in a draft file, in the order that the `figma-generate-library` skill gives: variables first, then the component set.
6. The agent writes the results here and sets the outcome.

Safe to repeat: steps 2, 3 and 5, on a draft file only. Step 4 is a purchase; do not repeat it.

## Findings

## Follow-ups
None.

## Next action
Step 1: Peter creates the free Figma account and says so.
