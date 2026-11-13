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
- Row 01 — done on 2026-11-13: RES-075, from the researcher agent `a46b5cee5e1ed59e3`, started without a name. Its log records Opus 5.5 and the effort `medium` on all 122 requests, checked after the agent ended. It called no Figma tool. The main session read the Answer and the follow-ups in full. It reads the findings on each skill when rows 02 and 03 are next.

### Row 01 — resolved
- RES-075, 2026-11-13, from Figma's documentation, Figma's own skills at version 2.2.207 and the repositories of other systems.
- Facts for row 03, the form of the skill:
  - Figma ships skills that already build screens from a published library: `figma-use` and `figma-generate-design`. They find the components at run time, in three ways: Code Connect files in the codebase, a search of the library, and the screens that exist. No skill of Figma reads a shipped list of the components of a library.
  - Three design systems publish a skill that builds Figma designs with their own library: Telefónica's Mística, Kajabi's Pine and Red Hat's PatternFly. Each is a layer on top of Figma's skills. None holds a written entry for each component.
  - What these three skills hold: the names of the libraries to use and to avoid; rules for layout, placement and variables; what to do when a component is missing; a check at the end for detached instances and values that are bound to no variable.
  - Where the knowledge of one component lives in all of them: in the library itself, in the name, the description and the properties of the component, read live. One skill of a third party gives the description a fixed form: purpose, behaviour, composition, usage, notes for code.
  - So the sources do not match Peter's picture of a skill that "knows every component and block" as a list inside the skill. They put that knowledge into the Figma library and give the skill the rules. Row 03 puts this to him.
- Facts for IDEA-002, the design specs: the description of a component in Figma is what an agent reads to choose and to use it. DEC-142 owns what one design spec holds; this is evidence for its description.
- Code Connect: it maps a Figma component to code, and its HTML form covers web components, with an example for Lit. It needs published components. Figma's documentation says that the Professional plan allows it with one library and one framework; Figma's own skill says Organization or Enterprise only. A live publish on Peter's Professional plan settles it; the trial of row 02 can do that.
- What the agent host needs: Figma's remote MCP server and a sign-in; a Full seat to write outside drafts. Writing is in beta and free for now, and becomes a paid feature. A Full seat on the Professional plan has 200 calls a day.
- Failures that the sources name: a wrong variant; a detached instance; plain layers in place of a library instance; a wrong property key that fails with no message; an import that times out.
- Row 02, the trial, is ready by the map, but it needs a library with more than one component, as "Not yet specified" says. It waits for the first Figma library of IDEA-002.

### Evidence from other ideas
- RES-030 (IDEA-005#01): Figma ships its own skills as a plugin for each agent host, from the repository `figma/mcp-server-guide`, with no npm package.
- RES-046 (IDEA-002#06): components that an agent or a plugin draws into a file are local to that file and get no updates; instances of a published library, inserted by key, update as library instances. So the skill needs the published library.
- RES-025 and RES-028 (IDEA-002 rows 16 and 19): a trial file with one component exists, and the Figma MCP wrote and read it.
- DEC-117 and DEC-118 (IDEA-002): the design specs of 1.0 are made in Figma, and each reaches the repo as Markdown that an agent pulls.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | How do existing skills and guides teach an agent to build designs from a Figma library through a Figma MCP (Figma's own skills, Code Connect, the design system skills of other libraries), and what does each need from the library and from the agent host? | research | resolved | — | [RES-075](../research/RES-075-figma-design-skills-and-guides.md) |
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
