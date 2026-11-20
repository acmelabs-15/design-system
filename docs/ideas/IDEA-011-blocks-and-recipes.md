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

### Row 02 — partial, second reply
- Source: Peter's reply of 2026-11-20 to the question from the evidence, typed into the question dialog: "hmmm well I guess I'm still not totally sure - just looking at the figma website I just stumbled apon https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP#h_01KMK2P47H2V1GFBJDNH6496T2 which make it sound like these skills paired with teh mcp could potentially really be great?"
- Not settled: he chose no option and is not sure. No decision record exists for row 02.
- The page, read by the agent on 2026-11-20 in full. Source: https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP, checked 2026-11-20. Facts from it:
  - `figma-use` "powers write-to-canvas": an agent creates frames, components, variables and auto layout in a file as real, editable content.
  - Two example skills go from code to Figma. `figma-generate-library` "builds or updates a Figma design system library from your codebase", in phases: discovery, variables and styles, file structure, components with variants and variable bindings, then Code Connect and a quality check. `figma-generate-design` "builds full-page screens in Figma using real components, variables, and styles from your design system", from a page of the codebase.
  - `figma-code-connect` connects published components to their code; it needs the Professional plan or higher.
  - `figma-spec` lets an agent read, create and update Figma Specs, "whether it's a standalone spec or a spec embedded in a Figma Design or FigJam file", to give the agent "requirements, decisions, and open questions". Figma Specs is in open beta.
  - `figma-code-workflows` brings an existing project into Figma as a code layer, a Figma Make file or editable design layers.
  - The page names no skill for the direction from a Figma design to web code. The host of this session has one from the same plugin, `figma-design-to-code`, which goes with the MCP tool `get_design_context`.
- These skills are installed in the host of this session, with the Figma plugin. Two earlier records used the MCP live on Peter's account: RES-025, one component made through the MCP in 11 calls, and RES-028, live reads.
- What the agent told him: the skills make both directions workable for an agent, so they lower the cost of either choice; they do not choose the side. Three facts to weigh, from RES-083: Code Connect on the Professional plan allows one library and one framework, and 1.0 has several framework packages; writing to the canvas is in beta and becomes a paid feature; behaviour and states do not come across, and a Figma Spec is a place for that text (DEC-118).
- Asked on 2026-11-20 through the question dialog: a trial first, or a decision now. Options: "A trial first (Recommended)"; "Decide now: Figma"; "Decide now: code after the first build"; "Decide now: Figma for the look, code for the behaviour". The trial, as the question describes it: in a trial file of his Figma team an agent builds three components and one block with the Figma skills, makes the code from them, then makes one change on each side and carries it to the other side; the result shows what holds and what breaks in each direction. Its stated cost: agent runs, calls on his Figma account, and one trial file in his team. It would be a new prototype row, and it could also serve IDEA-009#02.

### Row 02 — partial, third reply
- Source: Peter's reply of 2026-11-20 to the question "Do you want the trial first, or do you decide now?", typed into the question dialog: "well if those skills plus the mcp make going either way a piece of cake - what that means is i'll be using an agent to create figma specs - so that could really allow us to call figma the source of truth for tokens and the compound components parts anatomy - so we could likely create a idk rule or skill or something that always points an ai to figma for tokens and the part composition of a compound component's anatomy?"
- Not settled: he chose no option, and his words are a view with a question. He does not name blocks.
- His view: Figma is the source of truth for the tokens and for the anatomy of the compound components, which is the part composition of each component. An agent creates the design specs in Figma.
- His proposal, as a question: a rule or a skill that always points an agent to Figma for the tokens and for the part composition. The agent answered yes on 2026-11-20, and told him how it fits the records: the tokens already have Figma as their source (DEC-120); each design spec is made in Figma and reaches the repo as Markdown that an agent pulls (DEC-117, DEC-118); a design spec holds the anatomy and the parts (DEC-142); and the compound components are "taken straight from the component's anatomy in Figma" (DEC-158). So the rule states what is decided, and the skill is the way to carry it out. IDEA-002, deferred row 33, holds the rule and the skill.
- One correction that the agent gave him: the skills make both directions workable. "A piece of cake" is not shown yet. The limits of RES-083 stand, and only a trial or the first work in Figma shows how well it holds for 1.0.
- Asked on 2026-11-20 through the question dialog: does the same rule hold for a block? Options: "Yes, the same rule for blocks (Recommended)"; "Yes, and prove it with a trial first"; "No, a block follows the code".

### Row 02 — resolved
- DEC-159, Peter, 2026-11-20: Figma is the source of truth for the structure of a block, by the same rule as for the tokens and for the anatomy of the compound components. He selected "Yes, the same rule for blocks (Recommended)" in the dialog, with no condition, after the research of rows 07 and 08 and three replies.
- Behaviour and states are text in the design spec in Figma. A change starts in Figma, and an agent updates the code.
- The rule and the maintainer skill that point an agent to Figma are IDEA-002, deferred row 33.
- He chose the rule without the trial that the agent offered. The first real work in Figma is the proof that the tools hold.
- The notes above on row 02 keep the history of the question.

### Row 06 — resolved
- DEC-158, Peter, 2026-11-20: the word is Block. His definition: "Larger, ready-made sections of UI built from several different components. Also called patterns or recipes. Examples: login form, search bar, user profile card, dashboard sidebar." It is the fourth of his four levels; IDEA-003, Notes, "Row 24 — resolved" holds the others.
- The glossary has Block in place of Recipe since that day. A block combines several different components; a composite component assembles its own compound components.
- The title of this idea keeps "Blocks and recipes", which are Peter's words of 2026-11-13.

### Row 02 — partial
- Source: Peter's reply of 2026-11-20, typed into the question dialog. His words in full:

  > /deep-research I'm leaning towards figma - I think if the figma version of the design system is built correctly, the anatomy of a component (it's granular parts), states, etc - hopefully the figma mcp will be enough for us to be ble to access that system and aligning to the specs will be fairly straight forward - that being said - this is also something I don't know a ton about - I don't know enoubh about the available mechanisms provided by figma that we can use to integrate with stuff build with figma - my feeling is there are likely a handfull of them, from mcp, to rest, to other services they provide that may or may not be very robust and make this easy for us - So again, I'd like you to research what is provided by figma, how other large/popular design-systems handle this exact type of thing - you should fan out and cover a lot of ground here.

- Not settled. He leans to Figma, and a leaning before the research is no decision (his correction of the same day, in IDEA-001, Notes). No question on row 02 is pending.
- His reason for the leaning: when the system in Figma is built correctly, with the anatomy of each component, its granular parts and its states, the Figma MCP may be enough to read it, and the code then follows the design specs with little effort.
- What he says he does not know: which mechanisms Figma provides to integrate with what is built in Figma, "from mcp, to rest, to other services", and how robust each is.
- Asked for by him, with `/deep-research` and "fan out and cover a lot of ground": what Figma provides, and how other large and popular design systems handle the same thing. Rows 07 and 08 hold the two parts, and row 02 waits for both.
- What the records already hold on Figma, from 2026-11-12 and 2026-11-13: RES-023 (what the Figma MCP reads and writes), RES-024 (plans and prices), RES-025 and RES-028 (a live trial and live reads), RES-026 and RES-049 (token routes, and the token flow of nine systems), RES-027 (routes to read a design spec out of Figma), RES-046 (how designers get a library) and RES-075 (Figma's skills and Code Connect). Peter has not seen them as one picture. The answer to rows 07 and 08 gives him that picture, with these records beside the new ones.
- Next: when rows 07 and 08 are resolved, show him the mechanisms and what other systems do, and ask row 02 again from that evidence.

### Row 07 — resolved
- RES-083, 2026-11-20: 27 records, each for one mechanism or one group of tools, and each checked by a second agent. Its 56 agents ran on Opus 5.5 at `medium`, checked in the logs after the run; none ran `gh`. The main session read the facts across the records in full. It reads the record of a single mechanism when a later row needs it.
- Facts for row 02, for a team on the Professional plan:
  - Reading a system out of Figma: the Figma MCP server, the REST endpoints for files and nodes, the Plugin API, Dev Mode and the native export of variables. The REST file endpoints give the whole tree of a file as data, with the properties of each component, the bound variables, the descriptions and the documentation links, and they run with no person.
  - Writing into Figma: the Plugin API, and the MCP server through `use_figma`, in beta, which becomes a paid feature by use. No REST endpoint creates a component, a variant or a component property.
  - The link of a component to its code: Code Connect maps the properties, the nested instances and the slots of a component to a code snippet, which Dev Mode and the MCP server show. Professional allows one library and one framework. This settles the point that RES-075 left open.
  - Not on Professional: the Variables REST API and library analytics (Enterprise); plan access tokens for CI, branching and "Check designs" (Organization and higher); extended collections (Enterprise).
  - The MCP server on Professional: 200 read calls a day and 10 a minute for a Full or Dev seat. Whether it runs with no person after the first sign-in is not stated by Figma.
  - Figma components have slots on every plan. The Plugin API and Code Connect know them; it is not confirmed that the MCP server or the REST API read them.
- What no mechanism carries: the behaviour of a component (events, keyboard, logic); states in the direction from Figma to code; structure through the quick routes, which give flat layers; annotations through most routes.
- For Peter's reasoning of 2026-11-20: the records support that the structure, the properties, the variables and the Code Connect snippets of a system built in Figma can be read through the MCP. They do not support that behaviour and states come across; those are text in the design spec (DEC-118, DEC-142).
- For IDEA-002 rows 07, 10 and 11 and for IDEA-009#03: the same facts apply. Row 08, the survey of the design systems, is still in progress, and row 02 waits for it.

### Row 08 — resolved
- RES-084, 2026-11-20: 50 design systems, each record checked by a second agent. Its 102 agents ran on Opus 5.5 at `medium`, checked in the logs after the run; none ran `gh`. The main session read the facts across the records. It reads the record of a single system when a later row needs it.
- Facts for row 02:
  - The source of truth for components: 27 of 50 name none; 14 name code or point to it, among them Polaris, Primer, MUI, Mantine, shadcn/ui, HeroUI, Web Awesome, GitLab Pajamas and Porsche; 7 name Figma or point to it, among them Carbon, Spectrum, Untitled UI, Skyscanner Backpack, Uber Base and Telefonica Mistica; 2 share the tokens and keep the components apart.
  - Tokens are the one thing that teams move by machine, in both directions. Components are kept the same by hand in nearly each system, with a checklist, a review or a redraw. No system generates its components from the other side.
  - No system that names Figma as its source generates code from Figma. A person builds the code to the Figma spec.
  - Patterns, templates and blocks: in code only in many systems, among them Polaris, Chakra UI Pro, Mantine UI, HeroUI Pro, Tailwind Plus, shadcn/ui and Web Awesome; on both sides in a second group, among them Atlassian, SAP, Untitled UI, Nuxt UI, PrimeTek, Paste and Porsche. Only six records state which side leads: Figma in Carbon, Flowbite and Wise; code in USWDS, Tailwind Plus and Polaris.
  - Code Connect links components to code in eight systems. PatternFly removed it in 2026 for "significant overhead"; others name stale snippets.
  - Problems that maintainers state: the Figma library lags the code; Figma cannot express some features of code; structures differ, so a mapping fails.
- Row 02 is free: both research rows are resolved.

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
| 02 | Is Figma or code the source of truth of a block? | interview | resolved | 07, 08 | [DEC-159](../decisions/DEC-159-figma-is-the-source-of-truth-for-tokens-anatomy-and-blocks.md) |
| 03 | Where do the blocks live in the documentation, and where do the source files of a block live? | interview | open | — | — |
| 04 | Import the framework targets from IDEA-004. Each block is written for plain HTML and for each target. | task | open | — | — |
| 05 | Import the component list, names and parts from IDEA-001. A block composes those components. | task | open | — | — |
| 06 | Which word does the glossary take for the thing: recipe, block or pattern? The glossary has Recipe and avoids Block outside the name of the section; Peter writes "blocks"; shadcn/ui and Chakra UI Pro write "blocks", and AI Elements and Web Awesome write "patterns". DEC-148 asks for the standard name. | interview | resolved | — | [DEC-158](../decisions/DEC-158-terminology-primitives-compound-composite-blocks.md) |
| 07 | Which mechanisms do Figma and the tools around it provide to connect code with what is built in Figma: what can each read from a Figma file, what can each write, does it run with no person, which plan does it need, and how robust is it? Peter asked for it with `/deep-research` on 2026-11-20. RES-023 to RES-028, RES-046, RES-049 and RES-075 hold parts of it. | research | resolved | — | [RES-083](../research/RES-083-figma-mechanisms-between-design-and-code.md) |
| 08 | How do large and popular design systems keep their Figma library and their code in step: which side is the source of truth, how do tokens and components move, how is a Figma component linked to its code, and how are patterns, templates and blocks handled? Peter asked for it with `/deep-research` on 2026-11-20. | research | resolved | — | [RES-084](../research/RES-084-how-design-systems-keep-figma-and-code-in-step.md) |

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
