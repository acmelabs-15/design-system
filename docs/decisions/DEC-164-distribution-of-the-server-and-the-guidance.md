---
id: DEC-164
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-005#22 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-077, RES-082] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-164: 1.0 distributes its MCP server and its guidance through npm, its own command, the skills tool and a plugin from our own marketplace

IDEA-005#22 asks how the MCP server and the guidance are distributed. Peter's marks of 2026-11-20 on decision 6 of the list in RES-082, and his answer of the same day on the plugin (DEC-161), settle it.

| Solution of the list | His decision | Source |
|---|---|---|
| npm, inside the library package | Yes | ✅ |
| The project's own command | Yes | ✅ |
| The `skills` command line tool, `npx skills add` | Yes | ✅ |
| A plugin | Yes, from a marketplace of our own. Not from the marketplaces of the agent hosts | His answer "A plugin from our own marketplace"; his mark ❌ for "Plugin marketplaces of agent hosts" |
| TanStack Intent | No | ❌, and DEC-154 |
| The package manager links the skills that a package holds (pnpm 12) | No | ❌ |
| A hosted address | No | ❌ |

Three readings of the agent, which it told him in chat:

- `npx skills add` gets the path of the skills in `node_modules`, as Web Awesome documents it, so the tool makes links to the installed package. With a repository as its source the tool gives the newest state of that repository, which has his ❌ (DEC-163).
- "A hosted address" has his ❌, and that row of the list holds the hosted servers and also llms.txt by its address. His note "(llm.txt)" in decision 4 names the llms.txt file on the documentation site with ✅ (DEC-161). So the ❌ is read as: no hosted address for the server and for the skills. Whether an agent with no project also gets a hosted MCP server is open in IDEA-005#09, where his mark is 🤔.
- pnpm 12 is no way that 1.0 relies on. The skills folder still sits where pnpm 12 finds it, because that costs nothing (DEC-162).

## Consequences

- The MCP server comes with the command line tool of 1.0. IDEA-005#18 decides which package holds that tool.
- 1.0 is in no official marketplace of an agent host. A developer finds it through npm, the documentation and our own marketplace.
- IDEA-005#23 decides the ways to install, and IDEA-005#25 the agent hosts.
