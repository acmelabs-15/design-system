# Kickoff prompt for the 1.0 refactor, amended

This is Peter's kickoff prompt of 2026-11-12. Six passages are changed, because they conflicted with the brain plugin (version 0.13.0) or with a fact found on that day. Every other word is his original. Read this file for the rules. The [word-for-word original](v1-kickoff-prompt-original-2026-11-12.md) stays as history.

Amended on 2026-11-12, at Peter's request:

| Passage | The original said | Now | Reason |
| --- | --- | --- | --- |
| Lifecycle | define, plan, build, review, ship | Adds verify | Brain's lifecycle has six stages. |
| Branch name | Record it "in the plan" | Record it in the idea files | Brain has no plan before a spec exists. |
| Capability check | Load "the repo's skills in .agents/skills/"; run at start and phase change | Load the skills that `docs/agents/capabilities.md` names; also run before a sub-agent starts | That folder does not exist. Brain's check reads the capabilities file and also runs before each sub-agent. |
| Idea file | Keep it current after every answer | Adds what the idea file holds, and that a row's detailed progress goes in its RES record | Brain: "A research or do record is its own living progress record." |
| Research tool | "Anthropic's deep research skill" | Claude Code's `deep-research` workflow | The installed `/deep-research` is a built-in workflow, not a skill. |
| Sub-agent progress | Every agent appends progress to a scratch file and writes a report | A research agent writes only its RES record; a task agent uses a scratch progress file and a result file | Brain's protocol: the progress file is "a task agent's scratch file, or a research agent's RES file". |

---

Read AGENTS.md and follow its reading order. Then start a new body of work: a major refactor of this design system to its next major version (1.0 or 2.0, whichever is next; check package.json and the changelog and tell me which). Nobody uses the package yet, so nothing needs backwards compatibility. Every decision must be the best one for what we're building, not the easiest or fastest.

This work runs on the **brain plugin's lifecycle** (define, plan, build, verify, review, ship). Follow it strictly. In the past, agents on this repo have gone off the rails: they let scope bleed between phases, asked me far too many questions and stopped maintaining the idea tree. The rules below exist to stop that.

## A full replacement, on one branch

This refactor replaces the existing design system entirely; it is not an incremental upgrade. Do all of this work on a single long-lived branch for the new major version. When that branch merges, it replaces everything on main: components, packages, docs, MCP and skills. Nothing from the old system survives in code unless a decision record deliberately keeps it. The record of what replaced what lives in the decision and analysis docs, not in leftover code.

Until the merge, main stays as it is. Don't patch main for anything this refactor will replace. Set up the branch and record its name in the idea files before any research starts.

## Capability check

Run this before you start, at every phase change and before you start a sub-agent, as brain's protocol says. Load brain's ask-user-question, domain-modeling and context-engineering, plus the brain skill for the current phase and the skills that docs/agents/capabilities.md names. Confirm that the design system MCP answers one real read-only call. Report the check in one line. If anything is missing and you can't fix it, stop and tell me.

## Scope: six ideas, strictly separated

Turn each phase below into its own brain idea, with its own idea file. Each idea gets an explicit **Out of scope** section that names the later phases. Nothing from a later phase gets decided, designed or built inside an earlier one. If a question belongs to a later idea, write it into that idea's file as an open row and move on. Wire the dependencies between ideas, and run independent ideas in parallel where the graph allows.

You work out the exact boundaries and rows for each idea. Show me the six idea files with their scope lines before any interviewing starts.

### Idea 1: Component inventory research (no opinions)

The current component set doesn't make enough sense. Research which components a design system should include by comparing:

- shadcn/ui
- Radix, both Primitives and Themes
- Chakra UI
- Vercel's Geist

For each component concept, record which systems have it, what they call it, how they split it into parts (root, trigger, content, item and so on), and where they disagree. **The research must come back with no recommendations and no opinion.** It's facts, sources and disagreements only. Put the output in a comparison matrix in the repo.

After that, we interview back and forth (see Interviewing below) to settle the final component list, the names and the compositions. Every final choice gets a decision record.

### Idea 2: Design specs

The output is a design spec for every component on the final list, made before any code: anatomy and parts, variants, sizes, states, tokens, slots and subcomponents, accessibility behaviour and motion. Evaluate whether to do this in Figma (through the Figma MCP) or as in-repo spec documents, present the trade-offs and let me decide. No implementation happens in this idea.

If we go with Figma, the design work must produce two more things. Research both first, then decide with me:

- **A way for designers to use the system in Figma.** Designers should be able to pull the components straight into their files. Evaluate a published Figma library against a custom Figma plugin, or both together, and how each one stays in sync with new versions.
- **A token pipeline with Figma as the source of truth.** Tokens are authored in Figma and exported into the design system repo, never maintained by hand in code. Evaluate the options, for example Figma Variables through the REST API, a plugin such as Tokens Studio, or the W3C design tokens format transformed by Style Dictionary or a newer alternative. Cover how changes flow into the repo (manual export, CI job or pull request), how they're versioned, and how they feed the Lit core and every framework package.

### Idea 3: Lit core build, composition-first

The Lit web components are the core implementation. The key constraint: Lit composes through slots and React composes through component children and context. Research and decide on an architecture that lets every framework wrapper export **both** a top-level convenience component (for example `Stepper`) **and** every subcomponent used to build it (`Stepper.Root`, `Stepper.Item`, `Stepper.Indicator` and so on), the way Chakra does, so that consumers can compose custom versions. Settle this architecture with me before building anything. Explain the trade-offs to me; this is my first Lit project, so don't assume I know them.

### Idea 4: Framework packages

The wrappers over the Lit core are React, Preact, TanStack Redact and possibly Solid. Redact is a React-API-compatible runtime, so test whether the React package runs on it unchanged before planning a separate build. Evaluate each target: whether it's needed, how its wrapper is generated or written, and how it's tested.

### Idea 5: MCP and skills, shipped in the package

Research first. The current direction, which still needs testing, is to ship the MCP server and the agent skills **inside** the design system npm package, so their versions always match the installed components. An `init` script exposed through the package.json `bin` would install the MCP and skills into a consumer's project. Evaluate this against separate packages and decide with me.

### Idea 6: Devtools

A devtools package for all the framework versions. Evaluate TanStack Devtools (extend it, or fork it into something custom) against building our own. Capabilities include live prop switching on a selected component and theming controls. Research first, then decide with me.

## Interviewing: fewer questions, a living tree

Use brain's interview-me for each idea.

**Before asking anything:** read this prompt, AGENTS.md and the existing notes, and mark every decision they already answer. Only ask about what's still open.

**What to ask me versus decide yourself:**

- Choices that are cheap, reversible and don't change what gets built, you make yourself. State them in chat with a one-line reason, and don't create a row for them.
- Facts that research can settle, you research. Don't ask me.
- Only ask me about real decisions: trade-offs, taste, direction, or anything that's hard to reverse.
- Ask one question at a time, using ask-user-question, most important first.

**After every answer, re-evaluate the whole tree before you ask the next question.** This step is mandatory and visible:

1. Close the rows the answer settles, including indirectly.
2. Merge duplicate rows and drop rows that no longer matter.
3. Add any new rows the answer opened up.
4. Recompute the frontier: the open rows whose prerequisites are settled.
5. Tell me in one or two lines what changed (closed, merged, dropped or added), then ask the next most important frontier question.

If you skip this, the interview is broken. Keep the idea file on disk current after every answer. The idea file holds each row's status, my answers with their source, the waits and the running agents. The detailed progress of a research or task row goes in that row's own record, its RES file.

Never research the whole tree up front. Start research only for the row in front of us, or for the few big unknowns that shape the whole tree. Keep asking about rows that don't depend on pending research, and park the ones that do. When research returns, review it with me, then decide, drop or re-scope the row and re-check the tree.

## Research: which tool, when

- **Claude Code's `deep-research` workflow** (`/deep-research`): use it for broad landscape sweeps that need many sources, specifically the four-system component comparison (Idea 1), the framework-target evaluation (Idea 4), the MCP and skills packaging survey (Idea 5) and the devtools landscape (Idea 6).
- **Brain's research rows (RES files):** use them for narrow questions with one answer that come up mid-interview, for example "does Chakra's Group pass size props to its children?"
- Both kinds of output go to files in the repo, with sources and dates. Deep research output is filed and linked from the idea's research rows so that brain tracks it.
- Neither kind of research makes recommendations unless I ask for them.

## Sub-agents

Every sub-agent brief names the exact skills the agent must load and whether it needs the MCP. A research agent keeps its progress in its own research record, its RES file, and writes no other file. A task agent appends granular progress lines to its own file in the scratch folder, and writes its result to a file whose name starts with the row or task ID. Run independent work in parallel; don't be conservative about how much runs at once.

## Stopping points

Don't write handoff notes. Keep every status current in the files, then commit and push.

Start now: run the capability check, report which version this is, then show me the six idea files with their scope lines.
