---
id: IDEA-001
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-001: Component inventory for 1.0

## Intent
- Outcome: a final 1.0 component list, with one name and one part composition for each component, and a decision record for each final choice.
- User: Peter decides. IDEA-002 to IDEA-006 build on the result, and so do the designers and developers who use 1.0.
- Why now: the 0.3.3 component set does not make enough sense, and 1.0 replaces it with no compatibility duty.
- Success: the comparison matrix is in the repo with sources and no opinions; every component concept in it is in or out; every included component has a name and its parts.
- Constraint: research returns facts, sources and disagreements only. It gives no recommendation unless Peter asks.
- Out of scope: design specs (IDEA-002), the Lit core (IDEA-003), framework packages (IDEA-004), MCP and skills (IDEA-005), devtools (IDEA-006) and the documentation website with its recipes (IDEA-007).

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A decision: the 1.0 component inventory. One inventory record lists each included component with its name and parts, and links the decision record for each choice. The comparison matrix stays in the repo as its evidence.

## Notes

### Program rules for all six ideas
Source: [Peter's kickoff prompt](../design/v1-kickoff-prompt.md) of 2026-11-12. IDEA-002 to IDEA-006 link to this section.

- Target: version 1.0.0. The current release is 0.3.3 across five packages.
- 1.0 is a full replacement. Nobody uses the package yet, so nothing needs backwards compatibility. Nothing from 0.3.3 survives in code unless a decision record keeps it.
- Branch: `v1`. On Peter's machine its worktree is `/Users/peterkloss/Dev/ACMElabs/design-system-v1`. All work for 1.0 happens there. `main` stays as it is until the merge.
- Every decision is the best one for the product, not the easiest or the fastest.
- Each session loads brain's ask-user-question, domain-modeling, context-engineering and the skill for the current phase. It proves the design system MCP with one real read-only call.
- Questions: one at a time, most important first, and only for real decisions. The agent makes cheap, reversible choices and states them in chat. Research settles facts.
- After every answer the agent evaluates the maps of all six ideas, not only the idea of the question. It closes, merges, drops and adds rows, computes the frontier again, saves the files, and tells Peter in one or two lines what changed. Then it asks the next most important frontier question. Peter, 2026-11-12: "don't just check the idea you're working on - should do this across all ideas".
- Research starts only for the row in front of us, or for a big unknown that shapes the map. It gives no recommendation unless Peter asks. Its output goes to files with sources and dates.
- Landscape sweeps use `deep-research`, the built-in workflow of Claude Code that `/deep-research` starts: IDEA-001#01, IDEA-004#01, IDEA-005#01 and IDEA-006#01. Narrow questions use brain research records.
- How to start a delegated agent is in [the capabilities file](../agents/capabilities.md#sub-agents): without a name, on Opus 5.5 at medium effort, with a check of its log afterwards.
- Release 0.3.3, the current design system, is no input for 1.0 (DEC-125): not its code, its component list, its names, its look, or its decision and research records. Peter, 2026-11-12: "I think we shouldnt' take the current acmelabs design system into consideration at all for this"; and to the question how far that goes: "I think everything".
- A question that belongs to a later idea goes into that idea's map as an open row.
- Order of work, Peter, 2026-11-12: "can we get all the ideas completed - then you do that - then specs - then build? ... I'd like to move this a long, the question/answer part adn then give you a block of stuff to do - then any follow ups - then go into auto build". The agent's reading, which it told him: first every question that needs no work of the agent, across all ideas; then one block of agent work (the prototypes, all open research, the trials and the proposal for the parts); then the follow-up questions; then the specs; then the build in auto mode inside each approved plan. The block and the follow-ups come twice, because some work needs his choice of the architecture. In the block the agent runs all open research at one time, which replaces "research only for the row in front of us" for that block. The agent asks for his go on the list of the block before it starts. He stopped the start of two prototype agents with this message; no agent ran.
- State of that order on 2026-11-12, after 27 answers of Peter in one session: every decide row that needs no work of the agent is answered. The block of agent work, which had his go and is complete since 2026-11-12 (see "Block of agent work" below): the two prototypes (IDEA-003#05 and IDEA-002#26); the research rows IDEA-002#06, IDEA-002#28, IDEA-003#14 and IDEA-007#02; the follow-ups of the three landscape records RES-029, RES-030 and RES-031, two questions each; the trial IDEA-002#20; and the agent's proposal for the parts of the 145 components (IDEA-001#09). A second block follows his choice of the architecture: IDEA-004#03 and IDEA-005#03.
- Since 2026-11-12 the work has seven ideas: IDEA-007 owns the documentation website (DEC-139). These rules hold for it, and "all six ideas" in this section means all seven. The heading keeps its words, because the other ideas link to it.

### Working state for all six ideas
Carried over from `docs/STATUS.md` on 2026-11-12, when the workspace moved to brain's layout 2. The ideas and their records now hold the state; `brain status` reports it.

- Checks of the 0.3.3 code: none has run on `v1` since the migration moved the records. `scripts/workflow-migration.ts` and its test still name the old layout, because they verify the completed maintainer migration. Run the unit suite before the first product change on `v1`, then repair or retire that verifier.
- Links: `docs/verification/` and `docs/agents/history/` keep their bytes, so 3 links in `docs/verification/` and 7 in the retired status note still name old paths. The note's link to the kickoff prompt is the one exception: it points to the corrected prompt, on Peter's instruction of 2026-11-12.

- Authorization: the kickoff prompt authorizes commits and pushes of this work on `v1`. It authorizes no merge, release or publication.
- Baseline: `v1` starts at ee37be98e, the tip of `main` on 2026-11-12, where the quality run passes. No product check has run on `v1`; the branch changes records only so far.
- Runtime: the repo requires Bun 1.4.2. The `v1` worktree has no local runtime yet. On Peter's machine the verified executable is `/Users/peterkloss/Dev/ACMElabs/design-system/.artifacts/runtime/bun-1.4.2/bun-darwin-aarch64/bun`.
- MCP proof: the 0.3.3 design system MCP answers `resolve_version` and `search_docs` over stdio (2026-11-12, from the built package in the `main` checkout).
- Capability gaps: no skill named Anthropic's deep research skill is installed; no Figma MCP is connected; the folder `.agents/skills/` does not exist. The seven consumer skills are in `skills/`.
- Other sessions: the branches `claude/ci-speed` and `claude/issue-12-strict-style-policy` have their own worktrees, and the `main` checkout holds uncommitted files. They change the system that 1.0 replaces. Leave them as they are.
- The open maintenance issues of 0.3.3 stay in the local tracker, `.scratch/maintenance/issues/`.

### Block of agent work — complete on 2026-11-12
- Go: Peter, 2026-11-12, selected "Go, 14 single agents (Recommended)" in the question dialog, with no condition. The option read: "All five items start now. Each follow-up question gets one research agent. I report when all results are in, with the follow-up questions for you." The question named the cost: one agent for each item on Opus 5.5 at medium effort, eight at one time. The go covers these 14 agents and no workflow run.
- State: agents 1 to 8 run since 2026-11-12, started by the main session `9218537e-0c38-4db5-aa51-b897cb967e80` in a fresh session, as Peter asked. Each started without a name; the log of each records `claude-opus-5-5` and the effort `medium` on every request so far. All 14 agents have started. Agent 2 ended on 2026-11-12 with the prototype of the design direction complete, and agent 10 with RES-029 resolved. Agent 1 ended on 2026-11-12 with the prototype of the composition architecture complete, agent 11 with question 1 of RES-030 answered, and agent 13 with question 1 of RES-031 answered. Agent 14 is `ae5af13955a9023dc` (RES-031, question 2), started on 2026-11-12; it ended on the same day with RES-031 resolved. Agent 12 ended on 2026-11-12 with RES-030 resolved. All 14 agents have ended, and no agent runs. Agent 12 is `a3a0147c45ccc9e1d` (RES-030, question 2), started on 2026-11-12. Ended on 2026-11-12: agent 8 with RES-048 resolved, agent 4 with RES-046 resolved, agent 5 with RES-049 resolved, agent 3 with the proposal for the parts complete, agent 6 with RES-045 resolved, agent 7 with RES-047 resolved, and agent 9 with question 1 of RES-029 answered. Agent 10 is `a4717c5e0e713bd19` (RES-029, question 2), started on 2026-11-12. Started on 2026-11-12: agent 9, `a250484f13dcbb03c` (RES-029, question 1); agent 11, `a24d9f4296e3e280c` (RES-030, question 1); and agent 13, `a0becb199c1440699` (RES-031, question 1).
- Agent and record of each item: 1 is `afbdfc01151967238` (IDEA-003#05); 2 is `a1f8073e09f49bbcb` (IDEA-002#26); 3 is `a0533350f2ccf8869` (IDEA-001#09); 4 is `a278b8c98ca46fab4` (RES-046); 5 is `a51af336d2021a7fa` (RES-049); 6 is `aa4269e9b3b3956e9` (RES-045); 7 is `a0832e1b4ed460aa0` (RES-047); 8 is `afaf8c600aefa4a34` (RES-048). The Notes of each idea hold the same IDs for its rows.
- The two prototype agents share one browser through the Chrome DevTools MCP. Each brief tells its agent to open a page of its own and to pass that page's ID on every call. Their local servers use the ports 4731 and 4732.
- Capability check before the start, 2026-11-12: Bun 1.4.2 at the path under "Working state"; the `bun` on PATH is 1.4.4, so each brief names the pinned executable. The design system MCP of 0.3.3 answers `resolve_version` over stdio. The Chrome DevTools MCP answers `list_pages`, and web search answers. `brain check` reports no finding in 217 files.
- Order: eight at one time. First agents 1 to 8. Then the six follow-up questions; the two questions of one record run one after the other, because both write the same record.
- The 14 agents:
  1. IDEA-003#05, the prototype of the composition architecture. A task agent with brain's prototype skill, logic branch. One Steps component in three candidates. A: the page author writes the parts, and the root shares its state through context, with a repair for a part that connects before its root. B: the page author writes the parts, and the root finds them through its slot. C: one element with all parts in its shadow DOM, styled through `::part`. One pure logic module serves all three. Eight cases, the same for each candidate: plain markup; the order of definition; a part inside an extra `<div>`; a Steps inside another Steps; an item added and removed; keyboard and assistive technology; right-to-left; React with the convenience form, the composed form and a custom composition. Plain JavaScript from a CDN, no build step. Folder: `.artifacts/v1/prototype/IDEA-003-05/`, with a progress file and a result file. The agent observes each case in a browser and recommends nothing. Inputs: RES-042, RES-043, DEC-127, DEC-131, DEC-135, DEC-138.
  2. IDEA-002#26, the prototype of the design direction. A task agent with brain's prototype skill, UI branch. One page of sample components with the names of DEC-135, in four variants: Geist as Vercel's site has it; Geist's colours and materials with the sizes, spacing, radius and focus ring of Radix Themes; the same with those of Chakra UI; new values made for Google Sans Flex. Switches for the variant, for light and dark, and for the reading direction. A list of each colour pair of Geist that fails level AA, with its ratio. Inputs: RES-041, DEC-123, DEC-126, DEC-128, DEC-136, DEC-137, DEC-138. Folder: `.artifacts/v1/prototype/IDEA-002-26/`. No Figma call, and no recommendation.
  3. IDEA-001#09, the proposal for the parts. A task agent. For each of the 145 components of DEC-135, by category: the proposed parts, the system that they follow, where the systems disagree, and the components that it uses, for the dependency graph of DEC-142. Sources: RES-032 to RES-037 and DEC-124. A component that one system has takes that system's parts. The proposal marks each part that is a helper of React only and leaves it to Peter's review. File: `.artifacts/v1/prep/IDEA-001-09/IDEA-001-09-result.md`. It is a proposal for the interview and no research record.
  4. IDEA-002#06, research. Add to the row's question: how the designers of an outside team get the components, and what each route needs on the Professional plan (RES-024).
  5. IDEA-002#28, research. The agent reads RES-026 first and does not repeat it. It covers at least six named design systems, and what a script can do on the Professional plan.
  6. IDEA-003#14, research. It covers Chakra UI 3, Radix Themes, web component libraries that take a value for each breakpoint in an attribute, and the means of the platform, with no CSS-in-JS and no build step.
  7. IDEA-007#02, research. It covers at least six design systems with web components and framework packages, the blocks sections of shadcn/ui and Chakra UI, and the TanStack packages for Lit.
  8. IDEA-002#20, the trial. A task agent with a task record. The Notes of IDEA-002 hold its inputs under "Row 20".
  9 and 10. IDEA-004#01: the two questions under "Next action" in RES-029, with server rendering left out (DEC-127).
  11 and 12. IDEA-005#01: the two questions under "Next action" in RES-030.
  13 and 14. IDEA-006#01: the two questions under "Next action" in RES-031. Each base is checked against the six capabilities of DEC-143 and the theme export of DEC-145.
- The brief of a research agent is the one in interview-me's RESEARCH.md. No agent reads code or records of release 0.3.3 (DEC-125), and no agent recommends.
- After the block: read each result in full, close its row, check all seven ideas, and bring Peter the follow-up questions, most important first: his choice of the architecture, his choice of the design direction, and his review of the parts. Then the second block: IDEA-004#03 and IDEA-005#03.
- Check of all seven ideas on 2026-11-12, after the last result. Resolved by the block: IDEA-002 rows 06, 20 and 28; IDEA-003#14; IDEA-004#01; IDEA-005#01; IDEA-006#01; IDEA-007#02. The follow-up questions for Peter, most important first, one at a time:
  1. IDEA-003#05, the composition architecture, from the prototype. Asked on 2026-11-12; the pending question is in IDEA-003, Notes.
  2. IDEA-002#26, the design direction, from the prototype.
  3. IDEA-001#09, the review of the parts, from the proposal; it follows the architecture.
  4. IDEA-002#10, how token changes reach the repo, with the facts of RES-049. He has a partial answer there.
  5. IDEA-002#11, the token files, with the facts of RES-048.
  6. IDEA-002#07, library, plugin or both, with the facts of RES-046.
  7. IDEA-003#15, the mechanism of the style props, with the facts of RES-045.
  8. IDEA-006#04, the base of devtools, with the facts of RES-031.
  9. IDEA-007#05, the site tool and the host, and IDEA-007#04, the source of the records, with the facts of RES-047.
  10. His go for the second block: the trial IDEA-005#03, which is ready now, and the test IDEA-004#03, which needs his choice of the architecture first. The go of 2026-11-12 covers the 14 agents only.
  11. The readings of the agent that he has not confirmed: in DEC-133 (Portal and Text With Copy Button are in; Choicebox, Form, Description and Scroller are out), in DEC-142 (the twelve items of a design spec) and in DEC-124 (a part name that all systems share needs no review); and the intent of IDEA-007.
- Rows that still wait for another row and are no question yet: IDEA-002#22 (after row 26); IDEA-003 rows 06, 07, 08, 11 and 12 (after row 05) and 13; IDEA-004 rows 04 to 07; IDEA-005 rows 04 to 07 and 09 (after the trial); IDEA-006#05; IDEA-007#06.

### Settled by Peter outside a row
- DEC-123, 2026-11-12: the list holds an Icon component. The icon library makes one component for each icon with it, from Material Symbols. The components for single icons are not entries of the list.

### Row 07 — resolved
- DEC-134 changed the list in one point on the same day: Progress Circle is no concept of its own. The list holds 145 concepts.
- DEC-133 holds the list: 146 concepts in and 36 out, with Peter's answers, the reasons for out, and the readings of the agent that he saw and did not correct. DEC-130 and DEC-132 hold his two rules, and DEC-131 holds his words on the style props of the layout components.
- How it ran: the agent proposed in or out for each of the 182 concepts, and Peter reviewed the proposal in three questions by category on 2026-11-12.
- Reasons for out that Peter did not accept, for any later proposal: "a plain HTML element or CSS does the job" (DEC-130) and "other components can compose it" (DEC-132).

### Row 08 — resolved
- DEC-135 holds the 145 final names, Peter's decisions on the ten ties and the names that the rule of DEC-122 gives. Resizable is his choice against the lead of the survey RES-039. DEC-134 holds his decision that Progress is one component, linear or circular.
- The glossary has the names that he decided on 2026-11-12: Progress, Gauge, Toggle, Bleed, Pin Input, Password Input, Native Select, Checkbox Card and Radio Card, Status and Copy Button.

### Row 11 — resolved
- DEC-140, Peter, 2026-11-12: 1.0 gives no recipe out as a component; its documentation gets a blocks section. DEC-139 gives that section to IDEA-007, and IDEA-007#03 decides which blocks it has and how it is named.

### Row 07 — evidence
- Peter, 2026-11-12, same reply: "shadcn includes ai components as well for example - none of the others do I don't think". The inventories agree in part: shadcn/ui lists eight chat components among its components and a separate catalog "AI Elements" with 21 patterns (RES-032). RES-037 shows which concepts only one system has. This is evidence for row 07; it puts no component in or out.

### Waits
- Row 09 — the proposal for the parts is complete since 2026-11-12, and the row waits for Peter's review. File: `.artifacts/v1/prep/IDEA-001-09/IDEA-001-09-result.md` (scratch, outside git; 4,537 lines), from the task agent `a0533350f2ccf8869`, whose log records `claude-opus-5-5` and the effort `medium`.
  - Counts: 145 components; 90 with parts and 55 proposed as one element; 53 for Peter's review; 41 parts marked as helpers of React; 9 gaps in the records.
  - By status: 71 components that one system has, 53 for review, 20 with no parts in any system, 1 on which all systems agree.
  - The main session checked by script on 2026-11-12: the 145 entries are the 145 names of DEC-135, with no name twice, and each entry has the five points. It read the top of the file and the questions in full. It reads each category in full before that category goes to Peter.
  - The agent read the inventories through their JSON in `.artifacts/v1/research/` and RES-037 in full; it did not read the Markdown of RES-032 to RES-036.
  - How the proposal treats a disagreement: it takes each role that two systems or more share, and each role that one system alone has, with that system named. It leaves out only parts that a record calls a shortcut or unstable.
  - The file ends with nine questions for Peter. Four of them are rules across components: whether a helper of React becomes a part of a Lit component (it waits for IDEA-003#05); whether one name for a role, such as Content or Body, is chosen once for all components; whether Dropdown Menu, Context Menu and Menubar share one set of parts; whether Calendar and Date Picker share one set. Five are about single components: Checkbox Card and Radio Card, Radio Group and Radio, Field and Fieldset, Input, Skeleton.
  - Order: the review comes after Peter's choice of the architecture, because the parts that a component can have depend on it (DEC-124).
- Decision records: the prompt's own decisions (full replacement, branch, no compatibility) have no DEC files yet. The same holds for Peter's setup decisions of 2026-11-12: the kickoff prompt lives in `docs/design/`, the glossary takes the GLOSSARY names, every legacy record moves to layout 2, the tracker files are removed, `docs/agents/workflow.md` gives way to the workspace file, one corrected kickoff prompt replaces the original, and delegated agents start without a name on Opus 5.5 at medium effort. The workspace is on layout 2 since 2026-11-12, so `brain new-doc DEC` now gives DEC-117 and later. The first decision record is DEC-117 (IDEA-002#02). Next: create the records for the prompt's decisions and the setup decisions.
- Row 01 — wait: Peter's go for the four sweeps. The tool is settled: on 2026-11-12 Peter pointed to `/deep-research`, which is Claude Code's built-in `deep-research` workflow, not a skill. One run fetches at most 15 sources, so the matrix takes one run for each of the five columns. The check of the model is done (2026-11-12): the built-in script takes only the question as `args`, and none of its five `agent()` calls sets `model` or `effort`, so its agents take the session's model and effort. The workflow tool accepts `model` and `effort` on each `agent()` call, so a copy of the script with `model: 'opus'` and `effort: 'medium'` on those calls runs on Opus 5.5 at medium effort. Source: the script that Claude Code 2.1.323 saved on 2026-11-12, `~/.claude/projects/-Users-peterkloss/87264c59-59da-4763-9ea5-bf456eb0bc12/workflows/scripts/deep-research-wf_cc4e1756-8a4.js`, and the workflow authoring reference of the same version. One run starts up to about 100 agents: 1 for the scope, up to 6 searches, 15 sources, 25 claims with 3 checks each, and 1 for the report. Question asked on 2026-11-12: go with the copy on Opus 5.5 at medium effort (recommended), go with the built-in script on the session's model, or not yet. Answer, Peter, 2026-11-12, through the question dialog: "Go: Opus 5.5 copy (Recommended)", with no condition. The option read: "I run a copy of the workflow script with model opus and effort medium on each agent call. 8 runs, up to about 100 agents each. I check the log of the first agent for both values and stop the run if either is wrong." The go covers the four sweeps: IDEA-001#01, IDEA-004#01, IDEA-005#01 and IDEA-006#01. Started on 2026-11-12: IDEA-004#01 (RES-029), IDEA-005#01 (RES-030) and IDEA-006#01 (RES-031), one run each; the first agent of each run records `claude-opus-5-5` and the effort `medium` in its log. Not started: the five runs for row 01. The script gives one run at most 15 sources, 5 claims for each source and 25 checked claims, so five runs cannot list every component of five systems with its parts. The statement to Peter that five runs make the matrix was wrong. Pending question, 2026-11-12: how the matrix is made. Options: a page-by-page workflow that reads every component page, about 100 agents (recommended); the five `deep-research` runs, up to about 500 agents and an incomplete matrix; one researcher agent for each system, 5 agents and no second check. Peter selected "Page-by-page workflow (Recommended)" in the dialog and then asked for the question again in plainer words. The agent explained the question again in chat. Peter then wrote: "can't it be updated to remove the 15 pages at most restriction and say to read every component page?" The agent read the selection and this message together as the go for the page-by-page workflow, and told him so. Peter then interrupted and wrote: "I think what I really care about is using \"/deep-research\" for this - what ever way it makes the most sense to use that and cover all the components for each system we shoudl do - My feeling is this will result in multiple research docs and then one synthesized research doc?" Settled by that message: row 01 uses the `deep-research` workflow, changed so that it covers every component of each system; the agent chooses how; the result is one research record for each system and one synthesized record. Running since 2026-11-12, from the script `.artifacts/v1/research/deep-research-component-inventory.js`, one run for each system: shadcn/ui `wf_1b43c93e-fa0` (RES-032), Radix Primitives `wf_2a6d23d6-536` (RES-033), Radix Themes `wf_8c0d2337-45f` (RES-034), Chakra UI `wf_a3ef6cdd-bde` (RES-035), Geist `wf_e43ef516-c22` (RES-036). Both listing agents of each run record `claude-opus-5-5` and the effort `medium`. The synthesized record is RES-037, the comparison matrix; it becomes the result of row 01. In each run, two agents list every component page by different routes; agents read the pages in groups of five; a second agent reads every page again and corrects the records. All five runs ended on 2026-11-12 with no agent error: RES-032 (66 components), RES-033 (35), RES-034 (56), RES-035 (115) and RES-036 (75) are resolved, 347 components in total. The shadcn/ui run read each page in its Base UI and its Radix UI variant; the main session merged the two by script. The synthesis is running since 2026-11-12: workflow run `wf_3f80fbdc-1cd` (task `w34bn3pqr`) from `.artifacts/v1/research/deep-research-component-matrix.js`, which `make-matrix-workflow.py` in the same folder builds from the five inventories. One agent places every component into a concept; skeptical agents check each concept that joins different names; a critic looks for missed matches. The main session then renders RES-037 from the result with a script. The run ended on 2026-11-12 with 86 agents and no error. RES-037 is resolved: 347 components in 182 concepts; 13 concepts are in all five systems, 15 in four, 17 in three, 33 in two and 104 in one; 26 concepts join different names.

### Settled by the prompt
- The matrix has five columns: shadcn/ui, Radix Primitives, Radix Themes, Chakra UI and Vercel's Geist.
- For each component concept the matrix records which systems have it, what they call it, how they split it into parts, and where they disagree.
- The final list, names and compositions come from an interview after the research. Each final choice gets a decision record.
- The words for the pieces of a component, the first half of row 06: the prompt uses "parts" for the pieces of the anatomy ("root, trigger, content, item and so on"), "subcomponent" for a piece that a wrapper exports ("`Stepper.Root`, `Stepper.Item`, `Stepper.Indicator`"), and "slots" for the way Lit composes. The glossary holds the three terms since 2026-11-12. The second half of row 06, the shared part names, is open.

### Agent choices
- The matrix lives under `docs/research/`, one table per component category, with the version of each system and the access date.
- Rows 07 and 08 are decided by rule first (rows 03 to 05). Peter is then asked only about the exceptions and the ties. Row 09 is a review with Peter (DEC-124): the agent prepares the parts of one family of components side by side for the five systems, and Peter decides the structure where they disagree.
- The rule from row 03 (DEC-119): a component concept is a candidate when one of the four audiences needs it. No audience rules a concept out.
- Evidence for row 04, not an answer: the marketing and content audience needs page sections, and the reference columns may not have them. Row 01 shows whether they do.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | Which component concepts do shadcn/ui, Radix Primitives, Radix Themes, Chakra UI and Geist have, what does each system call them, how does each split them into parts, and where do they disagree? | research | resolved | — | [RES-037](../research/RES-037-component-comparison-matrix.md) |
| 03 | Which products and users does 1.0 serve, and what does that rule in or out of the list? | interview | resolved | — | [DEC-119](../decisions/DEC-119-four-audiences-for-1-0.md) |
| 04 | Can the list hold a component concept that none of the five reference columns has? | interview | resolved | 03 | [DEC-129](../decisions/DEC-129-list-sources-case-by-case-catalogs-are-recipes.md) |
| 05 | When the reference systems disagree on a name, which rule picks the 1.0 name? | interview | resolved | 01 | [DEC-122](../decisions/DEC-122-name-rule-most-of-five.md) |
| 06 | Which words name the pieces of a component (part, subcomponent, slot), and which shared part names apply across components? | interview | resolved | 01 | [DEC-124](../decisions/DEC-124-parts-reviewed-where-systems-disagree.md) |
| 07 | Which component concepts from the matrix are in the 1.0 list? | interview | resolved | 01, 03, 04 | [DEC-133](../decisions/DEC-133-component-list-146-concepts.md) |
| 08 | What is the final name of each included component? | interview | resolved | 05, 07, 10 | [DEC-135](../decisions/DEC-135-final-names-of-the-1-0-components.md) |
| 09 | What is the final part composition of each included component? | interview | open | 06, 07 | — |
| 10 | For the 11 concepts on which the five systems tie, which name do more sources use: the WAI-ARIA patterns and other widely used component libraries? | research | resolved | 05 | [RES-039](../research/RES-039-names-for-the-tied-concepts.md) |
| 11 | Does 1.0 ship recipes, such as page sections, app layouts and charts, and which idea holds their list? | interview | resolved | 07 | [DEC-140](../decisions/DEC-140-recipes-are-blocks-in-the-documentation.md) |

## Not yet specified
- The per-category rows for rows 08 and 09. The matrix sets the categories. Row 07 runs in five batches (Notes).
- The glossary still holds entries of release 0.3.3 for components that are outside the 1.0 list, such as TOC, Relative Time, Flow Diagram, App Bar, HStack / VStack, Sparkline and Feedback, and for the parts of Resizable. They decide nothing for 1.0 (DEC-125). Row 09 and the end of the idea remove or replace them.
- Which audience wins when two audiences need different things from one component. It sharpens at row 07, with real cases.

## Out of scope
- Row 02, retired on 2026-11-12: "Which components, parts and recipes does release 0.3.3 ship, and which decision records chose their names?" DEC-125 takes release 0.3.3 out as input. Its research record RES-038 was committed in 4a0242b5b and removed in the commit that records DEC-125.
- Design specs: anatomy, variants, named sizes, states, tokens, accessibility behaviour and motion. IDEA-002 owns them.
- How a part becomes a Lit element or a slot. IDEA-003 owns it.
- Framework packages (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006).
- Reference systems beyond the five columns. The prompt fixes the set.
