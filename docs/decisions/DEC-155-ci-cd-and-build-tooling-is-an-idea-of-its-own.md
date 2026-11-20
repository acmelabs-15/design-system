---
id: DEC-155
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-010#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-155: CI/CD, deployment and build tooling is an idea of its own

Peter's additional scope of 2026-11-13 added CI/CD, deployment and build tooling as "new scope and probably its own idea; decide with me". The agent made the stub IDEA-010 at once, as a proposal. Peter decided on 2026-11-20 that it stays: IDEA-010 is an idea of its own, with its own spec for the repository. No other idea owns the repository, and the framework packages, the website and the MCP server depend on its tooling as the core does.

He selected "Yes, keep IDEA-010 (Recommended)" in the question dialog, with no condition. The question said that the idea also holds the clean start of the branch: what survives the removal of the old system, and when.

## Considered Options

- Fold its rows into IDEA-003, the Lit core. The tooling that every package shares would then be decided inside the idea of one package.

## Consequences

- IDEA-010 is no proposal any more. Its rows 03, 05 and 06 and its deferred row 07 stay where they are.
- By the agent's placement, which the question named and Peter did not change, the idea keeps the clean start of the branch (rows 04 to 06) and the root files of the repository (deferred row 07).
- One more spec is written and planned: the spec for the repository of 1.0.
