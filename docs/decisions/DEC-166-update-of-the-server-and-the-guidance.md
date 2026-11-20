---
id: DEC-166
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-005#24 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-077, RES-082] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-166: An update of the library updates the guidance with no step, and the server refreshes what a host holds as a copy

IDEA-005#24 asks how the MCP server and the guidance get updated when the library is updated. Peter's marks of 2026-11-20 on decision 8 of the list in RES-082 settle it, with his decision of the same day that the command line tool and the server live in the main package (DEC-165).

| Solution of the list | His mark |
|---|---|
| Nothing to do, because the guidance is in the installed package | ✅ |
| The tool refreshes the files when it runs | ✅ |
| A command that the developer runs again | ✅ |
| An update of the plugin | ✅ |
| A script that runs on install | ❌ |
| The newest version on each start, through `npx` with `@latest` | 🤔 |

Two readings of the agent, which it told him in chat:

- "The tool refreshes the files when it runs": in his list this is `next dev` and `turbo`, which write their block again on each run. 1.0 has no dev server. Its tool that runs is the MCP server, which an agent host starts in each session, and the command itself. So the server, at its start, brings the files that the command wrote up to the installed version: the managed block, and each skill that a host holds as a copy.
- `npx` with `@latest` is out. It starts the newest server and not the installed one, and "the latest only" has his ❌ (DEC-163).

## Consequences

- A host that reads a link to the installed package needs nothing. The trial RES-077 found links for Claude Code and Codex, and copies for Cursor, Gemini CLI and VS Code. A copy is up to date after the next start of the server, or after the developer runs the command again.
- The server writes files of the project when it starts. It writes only what the command wrote before, inside its markers and its own folders. The spec says how a developer turns this off.
- The command also removes what a new version no longer has. RES-077 found that a skill which a new version removed stayed in a host as an old copy.
- The plugin has a version of its own and updates through its marketplace. It holds pointers only (DEC-161), so an old plugin still reads the installed package.
