# Additional scope for the 1.0 refactor

Peter's message of 2026-11-13, saved word for word. It adds scope and clarifications to [his kickoff prompt](v1-kickoff-prompt.md) of 2026-11-12. The ideas hold its items as rows and scope lines; [IDEA-001, Program rules](../ideas/IDEA-001-component-inventory.md#program-rules-for-all-six-ideas) says where each item went.

---

Here is additional scope and some clarifications for the refactor. Save this word for word next to the kickoff prompt in docs/design/, and link it from the same places. Then fold each item into the right idea file, as rows or scope lines. Follow the placement rules at the end.

## 1. Code block component

- Build it on TanStack Markdown and TanStack Highlight.
- It must support both streaming and static (non-streaming) markdown rendering.
- Research the APIs of other components that do this before designing ours.

Ties to Idea 1 (inventory) and Idea 3 (build).

## 2. Blocks and recipes

- Research the blocks and recipes in all four systems, not only shadcn. The AI components and AI blocks (composed layouts that show the state and composition patterns) are a must-have. Others will be too.
- Blocks aren't exported from the package. They show how to compose components into layouts.
- Open questions to settle with me: blocks will be in Figma regardless, as a library designers can use (for example, the AI blocks for my resume site's chatbot design). Whether Figma or code is their source of truth is still open. Where do they live in the docs? Are they exposed through the MCP, a skill, or both?
- The documentation site itself gets designed in Figma first. That spec is then broken down into documentation blocks.

Ties to Idea 2 (design specs) and Idea 5 (MCP and skills). It may need its own idea; decide that with me.

## 3. Utilities and hooks

- The four reference systems are React, and they export utility functions and hooks. Inventory them all and standardize against them, the same way as the components: comprehensive, one name per concept, a decision for each.
- The logic lives in the Lit core. Export it for vanilla web component users.
- Each framework package exposes it as hooks, plain utilities, or both, whichever fits.
- Design this from the core up, alongside the composition, props and slots model, accounting for how web components and React differ.

Ties to Idea 1 (inventory), Idea 3 (core) and Idea 4 (framework packages).

## 4. Figma build order

Build Figma the way we build code: reusable primitives and shared parts first, reused everywhere. Run as much as possible in parallel, but follow the dependency graph. Don't build everything in parallel blindly.

Ties to Idea 2.

## 5. MCP and skills research

- Research how other design systems build their skills and MCPs: which skills they ship and what they do, which tools their MCPs expose and what they do, and how they package and distribute them.
- Study Storybook's skills and MCP, especially the MCP UI tools that return rendered UI. Find out who else does this, how it works, and what makes sense for us.

Ties to Idea 5.

## 6. Devtools research

Find out whether other design systems ship devtools. Study TanStack Devtools, and look at what larger systems such as Material do. From that, research comprehensively what belongs in our devtools.

Ties to Idea 6.

## 7. CI/CD, deployment and build tooling

Version one had slowness here. Research what the four reference systems and TanStack do for CI/CD, deployment and build tools, then put together a comprehensive plan. This is new scope and probably its own idea; decide with me.

## 8. Claude Design compatibility

Research item: what, if anything, needs to be done to make the design system compatible with Claude Design.

This is a new idea that needs research. Stub its idea file now.

## 9. Root AGENTS.md, CLAUDE.md and README.md

Research item: what other design system libraries, TanStack and other packages put in their root AGENTS.md, CLAUDE.md and README.md. The findings will be used to update ours.

## 10. Starting fresh

This refactor doesn't reuse what's in the repo now. At some point, everything currently there needs to be removed so the new system starts clean on the branch. When that happens is an open question. Add it as a row in the right idea and settle it with me.

What survives the wipe is also an open question to go over with me. That includes the docs directory, the research, the specs and the glossary, plus agent context files and saved prompts. Material from the old system may not be worth keeping at all. Don't assume any of it stays or goes. List what's there, and we decide together before anything is removed.

## 11. Design skill for Figma

Research item: a skill, maybe called a design skill or a Figma skill, that knows every ACMElabs design system component and block in Figma, what each one is and how to use it, so that an agent connected to a Figma MCP can use them to build new Figma designs accurately. Explore whether and how this can work. This is a new idea that needs research. Stub its idea file now.

## Placement: idea phase or spec phase

Not all of this research belongs in the idea phase. Use this rule:

- **Idea phase:** research that changes what we build or what's in scope. That covers the inventories (blocks, utilities and hooks), the landscape surveys (skills and MCP, Storybook MCP UI, devtools, CI/CD) and the open questions in item 2.
- **Spec phase:** research that settles how to build something already decided. That covers the code block's API details, the TanStack Markdown and Highlight integration, and the Figma build order.
- When an item is unclear, place it yourself with a one-line reason. Only ask me if the placement changes scope.

**Spec-phase items get the status "deferred".** Don't stub spec folders ahead of time. Write each spec-phase item now as a row in its idea file with the status `deferred`, with enough detail that it stands on its own. Deferred rows don't count as open: they aren't on the frontier and don't stop the idea's decision tree from finishing, so the idea can close once everything else is settled.

Make this a **standing rule of the workspace**, not a temporary addendum: when an idea is finished and its spec phase starts, every `deferred` row moves into that spec, as open questions or tasks. The handoff isn't done until each deferred row is accounted for.

Decide where the rule belongs among the workspace, capabilities and domain markdown files, going by each file's stated purpose. It may belong in one, several or all three. For example, the handoff rule may fit the workspace file, while `deferred` as a status term may fit the domain file. Tell me where you put it and why, in one line per file.

If these files don't exist yet because the repo is still on brain's old layout, put the rule wherever the current layout keeps its standing rules, and tell me where.

**Stub every new idea now.** These ideas won't all be worked at once, so any new idea this scope creates (for example Claude Design compatibility, and CI/CD or blocks if they become their own ideas) gets a stub idea file right away: its title, what it covers, its scope lines and its known research items. That way nothing waits only in this prompt.

Show me which ideas changed and any new ideas you propose, before interviewing on them.
