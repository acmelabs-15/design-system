---
id: IDEA-011
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-011: Blocks and recipes for 1.0

## Intent
- Outcome: a decided list of the blocks of 1.0, by name and by group, with their source of truth, their place in the documentation and in the repository, and a spec for making them.
- User: Peter decides. Developers and their coding agents copy a block into a project. Designers use the blocks as a library in Figma. Peter names one use: the AI blocks for the chatbot design of his resume site.
- Why now: Peter's additional scope of 2026-11-13 names the AI blocks as a must-have, and on 2026-11-20 he gave the blocks an idea of their own (DEC-156).
- Success: open, rows 01 to 03. A draft: each block of 1.0 is in or out with its name and group; Peter has decided the source of truth and the place of the blocks; a spec exists.
- Constraint: the library gives no block out as a component (DEC-140). Release 0.3.3 is no input (DEC-125). Nothing is built before Peter's review of the whole in Figma (DEC-151).
- Out of scope: the website and its Blocks section as a page (IDEA-007), the drawing of the blocks in Figma (IDEA-002), how agents get the blocks (IDEA-005#13), the design skill for Figma (IDEA-009), and the components that a block composes (IDEA-001 to IDEA-004).

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the blocks of 1.0: the list by name and group, what each block composes and shows, the source of truth, and where the blocks live. Its plan then makes each block for plain HTML and for each framework target.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas). They hold for this idea too.
- This idea began on 2026-11-20 with DEC-156. Peter has seen its scope in the question of that day and has not yet confirmed its intent.

### Settled by Peter before this idea
- DEC-140, 2026-11-12: 1.0 gives no recipe out as a component; the documentation gets a blocks section.
- DEC-146, 2026-11-12: the Blocks section has four groups: agent interfaces, page sections for marketing and content sites, app layouts, and charts. He named two more with "maybe": data tables with virtualization, and forms, each with TanStack packages.
- His additional scope of 2026-11-13, item 2:
  - "Blocks aren't exported from the package. They show how to compose components into layouts."
  - "The AI components and AI blocks (composed layouts that show the state and composition patterns) are a must-have. Others will be too."
  - The blocks are in Figma in any case, "as a library designers can use (for example, the AI blocks for my resume site's chatbot design)".
  - Open, in his words: "Whether Figma or code is their source of truth is still open. Where do they live in the docs? Are they exposed through the MCP, a skill, or both?" Rows 02 and 03 here hold the first two, and IDEA-005#13 holds the third.
- DEC-151, 2026-11-20: the whole of 1.0 is put together in Figma before anything is built, and he reviews it there. By the agent's reading in that record, the whole holds the blocks.

### Evidence
- RES-067, 2026-11-13, the blocks and recipes of the reference systems by name. It was the result of IDEA-007#10 and stays linked there. IDEA-007, Notes, "Row 10 — resolved" holds its facts: the counts for each system, the 21 patterns of AI Elements, how each system gives a block out, and how the blocks fit the four groups of DEC-146.
- RES-047, 2026-11-12: how shadcn/ui, Chakra UI and Web Awesome store and show blocks, and which TanStack packages work with Lit and with each framework target.
- A correction that RES-067 made to DEC-146: page sections for marketing sites exist in Chakra UI Pro. The four groups stand.

### Row 01 — the proposal is complete, next: the main session reads it
- The proposal for the list was made for IDEA-007#11, which is this row now. File: `.artifacts/v1/prep/IDEA-007-11/IDEA-007-11-result.md` (scratch, outside git; 355 lines), from the proposal agent `a0d46807d47234cb6`, whose log records Opus 5.5 and the effort `medium` on all 24 requests. Brief: `.artifacts/v1/briefs/IDEA-007-11.md`.
- The agent's report, which the main session has not checked: 459 source items (shadcn/ui 118, Chakra UI Pro 338, Radix Themes 3) joined into 73 block concepts; 24 for agent interfaces, 18 for app layouts, 8 for charts, 20 for page sections, and 3 e-commerce concepts that no group fits. It proposes 68 in, with all 24 of the agent interfaces as must-have, and 4 out: Card Collection, Divider, Theme Showcase and Career. The two that Peter named with "maybe" are proposals of their own. The cost that it states: 104 versions of a block, times the count of framework targets.
- The agent says that the file changed on disk after its last edit, most likely by its own script for three totals. The main session reads the file in full and checks the totals before the question goes to Peter. Peter then reviews the proposal by group, as he did for the components.

### Row 02 — pending question
- Asked on 2026-11-20 through the question dialog: is Figma or code the source of truth of a block? The question gives the rule that holds for the components and the tokens: Figma is the source, and an agent pulls each design spec into the repo (DEC-117, DEC-118). It says that each block is in Figma before its code exists (DEC-151).
- Options: "Figma (Recommended)"; "Code, after the first build"; "Each on its own".
- The agent recommends Figma. Reason: one rule for the tokens, the components and the blocks, so a designer and a developer look at the same place for the truth. Stated cost: each change of a block starts in Figma, also a small one, and the behaviour that a drawing cannot show is text in the design spec.
- This row rests on no pending research. No record holds what other systems do for the source of truth of their blocks.

### Waits
- Row 04 — wait: IDEA-004#04 decides the framework targets.
- Row 05 — wait: IDEA-001 reaches `done`.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | Which blocks does 1.0 have, by name, in each group of DEC-146? | interview | open | — | — |
| 02 | Is Figma or code the source of truth of a block? | interview | open | — | — |
| 03 | Where do the blocks live in the documentation, and where do the source files of a block live? | interview | open | — | — |
| 04 | Import the framework targets from IDEA-004. Each block is written for plain HTML and for each target. | task | open | — | — |
| 05 | Import the component list, names and parts from IDEA-001. A block composes those components. | task | open | — | — |
| 06 | Which word does the glossary take for the thing: recipe, block or pattern? The glossary has Recipe and avoids Block outside the name of the section; Peter writes "blocks"; shadcn/ui and Chakra UI Pro write "blocks", and AI Elements and Web Awesome write "patterns". DEC-148 asks for the standard name. | interview | open | — | — |

## Not yet specified
- Whether the Blocks section also has data tables with virtualization and forms that use TanStack packages. Peter named both with "maybe" (DEC-146). The proposal for row 01 holds each as a proposal of its own.
- Whether the e-commerce concepts, which fit none of the four groups, get a group. It sharpens at row 01.
- Which chart engine the chart blocks use. The charts of shadcn/ui and of Chakra UI are built on Recharts, a React library (RES-067).
- How a developer takes a block: a copy from the page, a command or a registry. shadcn/ui copies a registry item with one command (RES-067). It sharpens at row 03.
- How a block stays correct when a component that it composes changes. It sharpens in the spec.

## Out of scope
- The website, its pages and the section that shows the blocks. IDEA-007 owns them.
- The pieces of the documentation website itself, which Peter calls "documentation blocks". IDEA-007, deferred row 14, holds them.
- The drawing of the blocks in Figma. IDEA-002 owns it and imports the list (IDEA-002#30).
- Whether the blocks reach agents through the MCP server, a skill or both. IDEA-005#13 owns it.
- The design skill for Figma, which knows the blocks. IDEA-009 owns it.
- The components, their design, the Lit core and the framework packages (IDEA-001 to IDEA-004).
