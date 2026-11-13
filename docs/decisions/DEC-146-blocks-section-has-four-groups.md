---
id: DEC-146
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-007#03 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-032, RES-035] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-146: The Blocks section has four groups of blocks

The documentation website of 1.0 has a Blocks section for recipes (DEC-140, DEC-144). Asked which groups of blocks it has, Peter selected all four that the agent offered and named two more with "maybe": "Agent interfaces (Recommended), Page sections (Recommended), App layouts, Charts, Maybe virtualization and other datatable stuff leveraging tanstack packages - forms leveraging tanstack packages". The agent had recommended the first two.

## The four groups

- Agent interfaces: blocks such as a chat, a prompt input, a reasoning step and a tool call, built from the chat components of the list. shadcn/ui has 21 such patterns in AI Elements.
- Page sections for marketing and content sites, such as a hero, a feature grid, a pricing table and a footer. No reference system has them, so their design is new work.
- App layouts, such as a dashboard, a sidebar layout, a login page and a signup page. shadcn/ui has 27 such blocks.
- Charts, on a third-party chart engine.

## Named with "maybe"

- Data tables, with virtualization, that use TanStack packages.
- Forms that use TanStack packages.

Peter has not decided these two. They are under "Not yet specified" in IDEA-007 until he does.

## Consequences

- Which blocks each group has is work for the spec and the plan of IDEA-007.
- The documentation depends on a third-party chart engine for the chart blocks, and each chart must follow the tokens of 1.0. Which engine is open.
- Data Table and Chart are out of the component list because they wrap a third-party engine (DEC-133). As blocks they fit: a block is code that a developer copies.
- Each block is written for plain HTML and for each framework package (DEC-144), so the number of blocks multiplies with the number of targets of IDEA-004#04.
