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
- Out of scope: design specs (IDEA-002), the Lit core (IDEA-003), framework packages (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006).

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
- The 0.3.3 decision and research records are evidence for a question. They do not answer it.
- A question that belongs to a later idea goes into that idea's map as an open row.

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

### Row 10 — running
- Started on 2026-11-12: one brain researcher agent, without a name, on Opus 5.5 at medium effort; agent ID `ad94ad192eada27c8`. It claims its own record with the slug `names-for-the-tied-concepts`. Its survey set is fixed: the WAI-ARIA patterns, native HTML, Base UI, React Aria Components, MUI, Mantine, Ant Design, Ark UI, Headless UI, Fluent UI React, Carbon and Material Design 3.
- The 11 ties of RES-037: Bleed or Inset; Resizable or Splitter; Item or Entity; Copy Button or Clipboard; Checkbox Cards or Checkbox Card; Radio Cards or Radio Card; Native Select or Select (Native); Input OTP, One-Time Password Field or Pin Input; Password Input or Password Toggle Field; Status or Status Dot; Direction Provider or Direction.
- DEC-122: the agent surveys more sources for each tie and then puts each tie to Peter. Row 08 holds his decisions.

### Settled by Peter outside a row
- DEC-123, 2026-11-12: the list holds an Icon component. The icon library makes one component for each icon with it, from Material Symbols. The components for single icons are not entries of the list.

### Row 04 — evidence
- RES-038: these 0.3.3 components have no matching concept in RES-037: App Bar, Disabled Wall, Flow Diagram, Icon Tile, Legend, Markdown, Sparkline, Table of Contents and Pill. Only two concepts that four or five reference systems have are absent from 0.3.3: Aspect Ratio and Popover.
- RES-038: release 0.3.3 ships 184 public elements on 100 component pages, 17 recipes, and 4,135 icon elements.

### Row 07 — evidence
- Peter, 2026-11-12, same reply: "shadcn includes ai components as well for example - none of the others do I don't think". The inventories agree in part: shadcn/ui lists eight chat components among its components and a separate catalog "AI Elements" with 21 patterns (RES-032). RES-037 shows which concepts only one system has. This is evidence for row 07; it puts no component in or out.

### Waits
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
| 02 | Which components, parts and recipes does release 0.3.3 ship, and which decision records chose their names? | research | resolved | — | [RES-038](../research/RES-038-components-of-release-0-3-3.md) |
| 03 | Which products and users does 1.0 serve, and what does that rule in or out of the list? | interview | resolved | — | [DEC-119](../decisions/DEC-119-four-audiences-for-1-0.md) |
| 04 | Can the list hold a component concept that none of the five reference columns has? | interview | open | 02, 03 | — |
| 05 | When the reference systems disagree on a name, which rule picks the 1.0 name? | interview | resolved | 01 | [DEC-122](../decisions/DEC-122-name-rule-most-of-five.md) |
| 06 | Which words name the pieces of a component (part, subcomponent, slot), and which shared part names apply across components? | interview | resolved | 01 | [DEC-124](../decisions/DEC-124-parts-reviewed-where-systems-disagree.md) |
| 07 | Which component concepts from the matrix are in the 1.0 list? | interview | open | 01, 03, 04 | — |
| 08 | What is the final name of each included component? | interview | open | 05, 07, 10 | — |
| 09 | What is the final part composition of each included component? | interview | open | 06, 07 | — |
| 10 | For the 11 concepts on which the five systems tie, which name do more sources use: the WAI-ARIA patterns and other widely used component libraries? | research | in-progress | 05 | — |

## Not yet specified
- The per-category rows for rows 07 to 09. The matrix sets the categories.
- Whether recipes need their own inventory decisions. Icons are settled by DEC-123.
- Which 0.3.3 glossary terms stay.
- Which audience wins when two audiences need different things from one component. It sharpens at row 07, with real cases.

## Out of scope
- Design specs: anatomy, variants, named sizes, states, tokens, accessibility behaviour and motion. IDEA-002 owns them.
- How a part becomes a Lit element or a slot. IDEA-003 owns it.
- Framework packages (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006).
- Reference systems beyond the five columns. The prompt fixes the set.
