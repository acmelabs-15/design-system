---
id: DEC-162
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-005#19 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-077, RES-082] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-162: The guidance of 1.0 lives in the main package, in the consumer's project, on the documentation site and in our marketplace repository

IDEA-005#19 asks where the guidance for coding agents lives. Peter's marks of 2026-11-20 on decision 4 of the list in RES-082, and his two answers of the same day on the managed block and on the plugin (DEC-161), settle four places. The content has one home, the main package; the other places hold pointers to it or a text made from the same records.

| Place | What lives there | Source |
|---|---|---|
| Inside the main package | The skills and the documentation | His mark ✅ for "Inside the main package" |
| The consumer's project | The managed block, and the files that the one command of 1.0 writes for each agent host | His mark for "Written into the consumer's project" was 🤔. His answer on the block, "Yes, on by default", and his mark ✅ for "One command of the project writes the files for the agent hosts" in decision 7 settle it |
| The documentation site | The llms.txt file | His mark ✅ with the note "(llm.txt)". His mark for a hosted catalog of skills in decision 10 is ❌ |
| Our own marketplace repository | The thin plugin | His answer on the plugin, "A plugin from our own marketplace" |

His mark for "A repository of skills, apart from the package" was 🤔, which is his sign for "I don't know". The agent's reading, which it told him in chat: 1.0 has no repository that holds the content of the skills, because he marked "Guidance: it comes from a repository at its newest state" with ❌ in decision 5. The marketplace repository holds pointers only.

## Consequences

- A change to a skill or to the documentation is a change to the main package. It reaches a consumer with an update of the package.
- His table for decision 4 had no row for "Inside the package of the project's command line tool". IDEA-005#18 decides where the command line tool lives.
- The skills folder sits in the package at the place that pnpm 12 looks for, `skills/<name>/SKILL.md`. It is a choice of the agent that costs nothing and is easy to change; 1.0 does not rely on that way (DEC-164).
