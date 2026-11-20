---
id: DEC-167
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-005#23 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-030, RES-077, RES-082] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-167: A consumer installs the MCP server and the guidance with one command of 1.0, and three other ways stay open

IDEA-005#23 asks how a consumer installs the MCP server and the guidance, and which files that writes into the project. Peter's marks of 2026-11-20 on decision 7 of the list in RES-082 settle the ways.

| Solution of the list | His mark |
|---|---|
| One command of the project writes the files for the agent hosts | ✅ |
| No step: the tool writes or refreshes the files when it runs | ✅ |
| `npx skills add` | ✅ |
| The command of the agent host, or a configuration file by hand, for the server | ✅ |
| The install of a plugin | ✅ |
| Nothing to install | ❌ |

The one command is in the `bin` of the main package (DEC-165). It writes the entry for the MCP server, the skills as links or copies, and the managed block, which is on by default (DEC-161). The three other ways are for a developer who does not use the command: `npx skills add` with the path of the skills in `node_modules` (DEC-164), the host's own command or a file by hand for the server, and the plugin from our own marketplace.

The agent's reading of "no step", which it told him in chat: after the first run of the command, the MCP server keeps the files up to date at each start (DEC-166). A first install with no step at all is not in 1.0, because a script on install has his ❌ and 1.0 has no dev server. The plugin is the way where one install in an agent host serves every project.

## Consequences

- Which files the command writes follows from the agent hosts of IDEA-005#25 and from what each host reads. These are facts of the hosts and no further decision. RES-030 and RES-077 hold the folders of each host.
- The check with Peter at the keyboard, which the trial RES-077 left open, moves to the spec phase as the deferred row IDEA-005#15. It then runs with the real package of 1.0: a real approval in the dialog of each host, a session in which a model uses a skill and calls a tool, and the list of the files for each host.
- Each agent host asks a person before it uses a server from a project (RES-077). So the command cannot make the server work with no step of the developer.
- The agent's note: four ways are four ways to document and to test for each host.
