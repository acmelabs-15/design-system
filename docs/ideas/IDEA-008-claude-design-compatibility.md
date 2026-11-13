---
id: IDEA-008
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-008: Claude Design compatibility

## Intent
- Outcome: a decision on what, if anything, 1.0 does so that the design system works with Claude Design, with the research behind it.
- User: Peter decides. People who make designs with Claude Design use the result.
- Why now: Peter added it to the scope of 1.0 on 2026-11-13, as a new idea that needs research.
- Success: open, row 02. A draft: research shows what Claude Design takes from a design system; Peter has decided what 1.0 does for it.
- Constraint: research comes first. Release 0.3.3 is no input (DEC-125).
- Out of scope: the design skill for Figma (IDEA-009), the design specs and tokens in Figma (IDEA-002), how the MCP server and the skills ship (IDEA-005), and the components themselves (IDEA-001 to IDEA-004).

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A decision: what, if anything, 1.0 does to be compatible with Claude Design. If the answer is work of its own, a spec follows; row 02 settles which.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas). They hold for this idea too.
- This idea is a stub. Peter asked for it on 2026-11-13: "This is a new idea that needs research. Stub its idea file now." Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13, item 8.
- His words for the research: "what, if anything, needs to be done to make the design system compatible with Claude Design."
- No research has started. A research agent needs Peter's go, as the program rules say.
- A start for row 01: Anthropic's own documentation of Claude Design. The Claude Code host of this session lists a tool named `DesignSync` and Artifact types for a design system (2026-11-13); neither is read for this idea yet.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What is Claude Design, what does it take from a design system (components, tokens, a design system file, an MCP server, skills), in which formats, and what does it need from a library of web components? | research | open | — | — |
| 02 | What, if anything, does 1.0 do to be compatible with Claude Design? | interview | open | 01 | — |

## Not yet specified
- Whether the work touches the token output of IDEA-002, the MCP server and the skills of IDEA-005, or the design skill of IDEA-009. It sharpens after row 01.

## Out of scope
- The design skill for Figma. IDEA-009 owns it.
- The design specs, the tokens and the Figma library. IDEA-002 owns them.
- How the MCP server and the skills ship. IDEA-005 owns it.
