---
id: RES-044
status: resolved # in-progress | resolved
outcome: answered
kind: task
from: IDEA-006#08 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-044: Import of the token pipeline decision into the devtools idea

## Question
Import the token pipeline decision from IDEA-002. The row serves IDEA-006#06, which decides whether the theming controls only preview token values or also export changes.

## Answer
Answered. The planned action was to read the accepted decisions of IDEA-002 on the tokens and to state the facts that IDEA-006#06 needs. It is complete when each fact below names its decision record. The main session did it on 2026-11-12; no step has an effect outside this record.

What IDEA-006#06 can rest on:

- Figma is the one place where a token of 1.0 changes. Nobody maintains tokens by hand in code. So the theming controls cannot write a change of the 1.0 tokens into the repo.
- The token files in the repo are the files that Figma's "Export modes" writes, in the format of the Design Tokens Community Group.
- The tokens carry two colour schemes, light and dark, and a custom theme. In a custom theme an outside team replaces the brand colour, the typeface and the corner radius with its own values. Those values belong to the team, not to Figma, so an export of them does not break the rule above.
- Still open in IDEA-002: which token files the pipeline hands to the Lit core (row 11), and how a token change reaches the repo (row 10).

## Findings
- Figma is the source of truth for the tokens, and no implementation maintains them by hand. Source: docs/ideas/IDEA-002-design-specs.md (Intent, Constraint), checked 2026-11-12.
- A token change reaches the repo when a browser agent or a person runs "Export modes"; the exported files are in the Design Tokens Community Group format. Source: docs/decisions/DEC-120-token-export-route.md, checked 2026-11-12.
- The tokens carry light and dark, and custom themes with a team's own brand colour, typeface and corner radius. Source: docs/decisions/DEC-137-theme-dimensions-light-dark-and-custom-themes.md, checked 2026-11-12.

## Follow-ups
None.

## Next action
None.
