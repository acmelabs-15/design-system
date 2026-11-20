---
id: DEC-163
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-005#21 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-077, RES-082] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-163: The MCP server and the guidance of 1.0 stay at the version of the installed library

IDEA-005#21 asks how the MCP server and the guidance stay at the version of the installed library. Peter's marks of 2026-11-20 on decision 5 of the list in RES-082 settle it. This is the aim of his kickoff prompt: the server and the skills always match the installed components.

| Solution of the list | His mark |
|---|---|
| Server: it reads the installed package or the project | ✅ |
| Server: it takes a version as an argument | ✅ |
| Server: its own version is pinned to the library | ✅ |
| Server: it serves the latest only | ❌ |
| Guidance: it is in the installed package, or it points at it | ✅ |
| Guidance: it comes from a repository at its newest state | ❌ |

## Consequences

- Each thing outside the installed package holds a pointer and no content: the links or copies in the folders of the agent hosts, the managed block, and the plugin (DEC-161).
- "The newest version on each start, through `npx` with `@latest`" had his mark 🤔 in decision 8. The agent's reading, which it told him in chat: it is out, because it starts the newest server and not the installed one. That is "the latest only", which has his ❌.
- The agent's note on the version as an argument: a server that runs from the installed package reads that package and has its version with no more work. The argument does something where no installed package exists, and the server then needs the records of other versions. The spec decides how far 1.0 goes there. Ant Design's command line tool holds a snapshot for each minor version (RES-082).
- The trial RES-077 showed the base of this decision: after an update of the package with no new `init`, the server answered as the new version, and so did each skill that is a link to the installed package. A copy stays at the old version until the command runs again (IDEA-005#24).
