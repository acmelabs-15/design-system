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
Source: Peter's kickoff prompt of 2026-11-12, [saved word for word](../design/v1-kickoff-prompt-original-2026-11-12.md). IDEA-002 to IDEA-006 link to this section.

- Target: version 1.0.0. The current release is 0.3.3 across five packages.
- 1.0 is a full replacement. Nobody uses the package yet, so nothing needs backwards compatibility. Nothing from 0.3.3 survives in code unless a decision record keeps it.
- Branch: `v1`. On Peter's machine its worktree is `/Users/peterkloss/Dev/ACMElabs/design-system-v1`. All work for 1.0 happens there. `main` stays as it is until the merge.
- Every decision is the best one for the product, not the easiest or the fastest.
- Each session loads brain's ask-user-question, domain-modeling, context-engineering and the skill for the current phase. It proves the design system MCP with one real read-only call.
- Questions: one at a time, most important first, and only for real decisions. The agent makes cheap, reversible choices and states them in chat. Research settles facts.
- After every answer the agent evaluates the whole map, saves it, and tells Peter in one or two lines what changed.
- Research starts only for the row in front of us, or for a big unknown that shapes the map. It gives no recommendation unless Peter asks. Its output goes to files with sources and dates.
- Landscape sweeps use the deep research skill: IDEA-001#01, IDEA-004#01, IDEA-005#01 and IDEA-006#01. Narrow questions use brain research records.
- The 0.3.3 decision and research records are evidence for a question. They do not answer it.
- A question that belongs to a later idea goes into that idea's map as an open row.

### Waits
- Decision records: the prompt's own decisions (full replacement, branch, no compatibility) get DEC files after the workspace migration. Before it, new DEC numbers collide with the legacy records 0001 to 0116.
- Row 01 — wait: this session has no skill named Anthropic's deep research skill. Retry when Peter installs it or names a substitute.

### Settled by the prompt
- The matrix has five columns: shadcn/ui, Radix Primitives, Radix Themes, Chakra UI and Vercel's Geist.
- For each component concept the matrix records which systems have it, what they call it, how they split it into parts, and where they disagree.
- The final list, names and compositions come from an interview after the research. Each final choice gets a decision record.

### Agent choices
- The matrix lives under `docs/research/`, one table per component category, with the version of each system and the access date.
- Rows 07 to 09 are decided by rule first (rows 03 to 06). Peter is then asked only about the exceptions.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | Which component concepts do shadcn/ui, Radix Primitives, Radix Themes, Chakra UI and Geist have, what does each system call them, how does each split them into parts, and where do they disagree? | research | open | — | — |
| 02 | Which components, parts and recipes does release 0.3.3 ship, and which decision records chose their names? | research | open | — | — |
| 03 | Which products and users does 1.0 serve, and what does that rule in or out of the list? | interview | open | — | — |
| 04 | Can the list hold a component concept that none of the five reference columns has? | interview | open | 02, 03 | — |
| 05 | When the reference systems disagree on a name, which rule picks the 1.0 name? | interview | open | 01 | — |
| 06 | Which words name the pieces of a component (part, subcomponent, slot), and which shared part names apply across components? | interview | open | 01 | — |
| 07 | Which component concepts from the matrix are in the 1.0 list? | interview | open | 01, 03, 04 | — |
| 08 | What is the final name of each included component? | interview | open | 05, 07 | — |
| 09 | What is the final part composition of each included component? | interview | open | 06, 07 | — |

## Not yet specified
- The per-category rows for rows 07 to 09. The matrix sets the categories.
- Whether recipes and icons need their own inventory decisions.
- Which 0.3.3 glossary terms stay. The glossary has no word yet for the pieces of a component.

## Out of scope
- Design specs: anatomy, variants, named sizes, states, tokens, accessibility behaviour and motion. IDEA-002 owns them.
- How a part becomes a Lit element or a slot. IDEA-003 owns it.
- Framework packages (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006).
- Reference systems beyond the five columns. The prompt fixes the set.
