---
id: DEC-160
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-005#17 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-070, RES-082] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-160: The MCP server of 1.0 is a documentation server with a search by intent

IDEA-005#17 asks whether 1.0 has an MCP server and what its job is beside the guidance for coding agents. Peter decided: 1.0 has an MCP server, and it is a documentation server. It lists the components, it searches them, and it has a search by intent: an agent describes what the user must be able to do, and the server names the components that fit. He rejected the agent's recommendation, a server that does only what a file cannot do, with the props read from the files in the installed package.

His words, 2026-11-20, typed into the question dialog: "I disagree with you regarding the mcp only does what a file cannot do", and "So yes documentation server - lists the components - search the components - provide semantic search that allows an agent to describe it's intent".

His reasons, in his words:

- "I wouldn't want the coding agent trying to find the props in the installed npm package - it's a waste of tokens and time, an mcp can provide it much faster".
- "at highspot agents would never know where to look to find the design system files and would frequently discover components that had been written locally in the app it was installed to that had a name, lets say select, and it happened to be looking for a select, it would just use that component."

His example of the search by intent: an agent builds a settings page, and the ticket says "Let users turn email notifications on and off." The agent does not know the names of the components and guesses "toggle". It calls a tool `search` with `intent`, "let the user turn one setting on or off, and the change saves right away", and `context`, "settings page, no submit button". The result ranks Switch first with a score, a `why` ("Use for a binary setting that takes effect immediately."), an `avoid_when` ("The choice is part of a form that is submitted later; use Checkbox."), the `import` line and the `key_props`. Checkbox and SegmentedControl follow, each with a `why`. The example shows the kind of tool; IDEA-005#06 decides the tools and their fields.

## Consequences

- The server gives the documentation and the API of the components. The same content also ships as files in the installed package, which Peter marked with ✅ in his reply to all ten decisions of 2026-11-20 (IDEA-005, Notes). The server and the files are two ways to the same records.
- The search by intent needs, for each component, a text on when to use it and a text on when to avoid it. That is the usage guidance of DEC-142. IDEA-007#04 decides where that text is written.
- Open, for IDEA-005#06: the full list of tools, and how the search ranks its results. A server on the developer's machine has no model for meaning unless the package holds one; the other way is a search by words over the usage texts. RES-085 surveys how the servers of other projects search.
- Open, for IDEA-005#06: whether the server also has tools that work on the consumer's project, such as a check of code that an agent wrote. Peter did not speak of it.
- Open, for IDEA-005#12: tools that return user interface. His view of the same reply, and no decision: "i also do really like the idea of leveraging the MCP Apps standard to provide interactive uis via mcp tools - not sure exactly what for though".
- Not decided here: where the server lives (IDEA-005#18), and how an agent with no project gets the guidance (IDEA-005#09).
- The agent's note on his second reason: an agent that does not know of the design system does not call its server either. MUI and Web Awesome report that agents do not look (RES-070). A text that the agent host always loads tells the agent to use the design system and its server: a block in the instructions file of the project, or the description of a skill. IDEA-005#20 decides those forms.
