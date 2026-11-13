---
id: IDEA-009
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-009: Design skill for Figma

## Intent
- Outcome: a decision whether and how a skill gives an agent, connected to a Figma MCP, exact knowledge of every 1.0 component and block in Figma, so that the agent builds new Figma designs with them accurately.
- User: Peter decides. Designers and their agents use the skill. Peter names one case: the AI blocks for the chatbot design of his resume site.
- Why now: Peter added it to the scope of 1.0 on 2026-11-13, as a new idea that needs research.
- Success: open, row 03. A draft: research and a trial show whether such a skill can work and how; Peter has decided; a spec exists if the skill is built.
- Constraint: research comes first. Peter: "Explore whether and how this can work."
- Out of scope: the Figma library, the design specs and the tokens (IDEA-002), how the consumer skills ship (IDEA-005), the list of the blocks (IDEA-007), and Claude Design (IDEA-008).

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A decision: 1.0 gets a design skill for Figma or not, and in which form. If it does, a spec for the skill.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas). They hold for this idea too.
- This idea is a stub. Peter asked for it on 2026-11-13: "This is a new idea that needs research. Stub its idea file now." Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13, item 11.
- His words for the skill: "a skill, maybe called a design skill or a Figma skill, that knows every ACMElabs design system component and block in Figma, what each one is and how to use it, so that an agent connected to a Figma MCP can use them to build new Figma designs accurately."
- The name of the skill is open; he gives "design skill" and "Figma skill" with "maybe".
- Row 01 — running since 2026-11-13, in the second block of agent work that Peter approved (IDEA-001, Notes, "Second block of agent work"). Researcher agent `a46b5cee5e1ed59e3`, started without a name on Opus 5.5 at the effort `medium`, when the second agent of the block ended. Its record is found by its `from`. Its brief is `.artifacts/v1/briefs/IDEA-009-01.md` with `common.md`. Check the log when the agent ends, before its record is read.

### Evidence from other ideas
- RES-030 (IDEA-005#01): Figma ships its own skills as a plugin for each agent host, from the repository `figma/mcp-server-guide`, with no npm package.
- RES-046 (IDEA-002#06): components that an agent or a plugin draws into a file are local to that file and get no updates; instances of a published library, inserted by key, update as library instances. So the skill needs the published library.
- RES-025 and RES-028 (IDEA-002 rows 16 and 19): a trial file with one component exists, and the Figma MCP wrote and read it.
- DEC-117 and DEC-118 (IDEA-002): the design specs of 1.0 are made in Figma, and each reaches the repo as Markdown that an agent pulls.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | How do existing skills and guides teach an agent to build designs from a Figma library through a Figma MCP (Figma's own skills, Code Connect, the design system skills of other libraries), and what does each need from the library and from the agent host? | research | in-progress | — | — |
| 02 | In a trial with the Figma MCP: can an agent with a draft of the skill place the right components of a published library in a new design, with the right variants and variables, and where does it fail? | task | open | 01 | — |
| 03 | Does 1.0 get a design skill for Figma, and in which form? | interview | open | 01, 02 | — |

## Not yet specified
- Where the knowledge of the skill comes from: the Figma library itself, the design specs pulled into the repo, or the component metadata. It sharpens after row 01.
- How the skill reaches a designer's agent, and how it stays in step with the library. IDEA-005 holds the same question for the consumer skills.
- A trial that means something needs more than the one component of the trial file. It sharpens when IDEA-002 has its first library.

## Out of scope
- The Figma library, the design specs and the tokens. IDEA-002 owns them.
- How the consumer skills and the MCP server ship. IDEA-005 owns it.
- Which blocks 1.0 has. IDEA-007 owns it.
- Claude Design. IDEA-008 owns it.
