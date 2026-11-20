---
id: DEC-154
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: true
  real-trade-off: true
from: IDEA-005#04 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-030] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-154: 1.0 does not use TanStack Intent

IDEA-005#04 asks where the MCP server and the agent skills of 1.0 ship. Peter made no choice there and asked for wider research. He decided one point in the same reply: 1.0 does not use TanStack Intent. He gave no reason.

His words, 2026-11-20, typed into the question dialog: "I do not want to use tanstack intent", and "we always look to tanstack - but I don't want ot use intent here and they almost certain use it".

## Consequences

- TanStack Intent is one of the ways that RES-030 found for skills that stay inside the installed package: the skills are in the package, and a host reads them through Intent's command line tool. That way is out for 1.0.
- TanStack's own packages stay a source for other rows. For this row they are a fact of the landscape and no model.
- The research IDEA-005#16 describes what Intent does where a library uses it. It does not weigh it as an option for 1.0.
- Row 04 stays open: inside the package or apart is not decided.
