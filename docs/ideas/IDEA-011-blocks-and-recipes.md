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

### Row 02 — partial
- Source: Peter's reply of 2026-11-20, typed into the question dialog. His words in full:

  > /deep-research I'm leaning towards figma - I think if the figma version of the design system is built correctly, the anatomy of a component (it's granular parts), states, etc - hopefully the figma mcp will be enough for us to be ble to access that system and aligning to the specs will be fairly straight forward - that being said - this is also something I don't know a ton about - I don't know enoubh about the available mechanisms provided by figma that we can use to integrate with stuff build with figma - my feeling is there are likely a handfull of them, from mcp, to rest, to other services they provide that may or may not be very robust and make this easy for us - So again, I'd like you to research what is provided by figma, how other large/popular design-systems handle this exact type of thing - you should fan out and cover a lot of ground here.

- Not settled. He leans to Figma, and a leaning before the research is no decision (his correction of the same day, in IDEA-001, Notes). No question on row 02 is pending.
- His reason for the leaning: when the system in Figma is built correctly, with the anatomy of each component, its granular parts and its states, the Figma MCP may be enough to read it, and the code then follows the design specs with little effort.
- What he says he does not know: which mechanisms Figma provides to integrate with what is built in Figma, "from mcp, to rest, to other services", and how robust each is.
- Asked for by him, with `/deep-research` and "fan out and cover a lot of ground": what Figma provides, and how other large and popular design systems handle the same thing. Rows 07 and 08 hold the two parts, and row 02 waits for both.
- What the records already hold on Figma, from 2026-11-12 and 2026-11-13: RES-023 (what the Figma MCP reads and writes), RES-024 (plans and prices), RES-025 and RES-028 (a live trial and live reads), RES-026 and RES-049 (token routes, and the token flow of nine systems), RES-027 (routes to read a design spec out of Figma), RES-046 (how designers get a library) and RES-075 (Figma's skills and Code Connect). Peter has not seen them as one picture. The answer to rows 07 and 08 gives him that picture, with these records beside the new ones.
- Next: when rows 07 and 08 are resolved, show him the mechanisms and what other systems do, and ask row 02 again from that evidence.

### Rows 07 and 08 — running
- Started on 2026-11-20 by the main session, on Peter's words in his reply to row 02. Both use the script `.artifacts/v1/research/survey-by-subject.js` (scratch, outside git): one agent for each subject, a second agent that checks each record, a critic for what is missing, and one agent that states the facts across the records. Each agent runs on Opus 5.5 at the effort `medium`. The script tells each agent to read a repository through web pages or `git`, and never with `gh`.
- Row 07: run `wf_45b626a8-726`, task `wkglygbht`, record RES-083. It has 22 subjects, each one mechanism or group of tools: the Figma MCP server, the parts of the REST API, webhooks, the Plugin API, Code Connect, Dev Mode, the variables with their import and export, the component features for anatomy, Figma Make, the features between code and design, libraries, the checks of a design, and the tools of third parties for Storybook, tokens, documentation, generation in both directions and visual comparison.
- Row 08: run `wf_10dd351a-a4e`, task `wm6wd4r4h`, record RES-084. It has 46 design systems, from Material, Carbon, Fluent, Polaris, Primer, Atlassian and Spectrum to GOV.UK, Paste, PatternFly, Gestalt and Porsche. Each record has eight fields: the source of truth, the Figma library, the token flow, the link of a component to its code, the process for parity, the larger compositions, the use of agents, and the problems that maintainers state.

### Waits
- Row 04 — wait: IDEA-004#04 decides the framework targets.
- Row 05 — wait: IDEA-001 reaches `done`.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | Which blocks does 1.0 have, by name, in each group of DEC-146? | interview | open | — | — |
| 02 | Is Figma or code the source of truth of a block? | interview | open | 07, 08 | — |
| 03 | Where do the blocks live in the documentation, and where do the source files of a block live? | interview | open | — | — |
| 04 | Import the framework targets from IDEA-004. Each block is written for plain HTML and for each target. | task | open | — | — |
| 05 | Import the component list, names and parts from IDEA-001. A block composes those components. | task | open | — | — |
| 06 | Which word does the glossary take for the thing: recipe, block or pattern? The glossary has Recipe and avoids Block outside the name of the section; Peter writes "blocks"; shadcn/ui and Chakra UI Pro write "blocks", and AI Elements and Web Awesome write "patterns". DEC-148 asks for the standard name. | interview | open | — | — |
| 07 | Which mechanisms do Figma and the tools around it provide to connect code with what is built in Figma: what can each read from a Figma file, what can each write, does it run with no person, which plan does it need, and how robust is it? Peter asked for it with `/deep-research` on 2026-11-20. RES-023 to RES-028, RES-046, RES-049 and RES-075 hold parts of it. | research | in-progress | — | — |
| 08 | How do large and popular design systems keep their Figma library and their code in step: which side is the source of truth, how do tokens and components move, how is a Figma component linked to its code, and how are patterns, templates and blocks handled? Peter asked for it with `/deep-research` on 2026-11-20. | research | in-progress | — | — |

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
