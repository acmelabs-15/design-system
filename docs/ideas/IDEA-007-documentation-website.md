---
id: IDEA-007
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-007: Documentation website for 1.0

## Intent
- Outcome: a documentation website for 1.0 that replaces the website of release 0.3.3 at the merge, with a page for each component, examples for each way to use 1.0, and a blocks section for recipes.
- User: Peter decides. Developers, designers and coding agents read the website. The MCP server of IDEA-005 serves the same records.
- Why now: the merge replaces the docs, and none of the first six ideas owns the website (DEC-139).
- Success: open, rows 03, 04 and 05. A draft: Peter has chosen what the website holds, where its records come from and how it is built and published; the blocks of 1.0 are decided; a spec exists.
- Constraint: release 0.3.3, its website included, is no input (DEC-125). Research comes before each decision that rests on facts.
- Out of scope: the component list, names and parts (IDEA-001), the design specs and tokens (IDEA-002), the Lit core (IDEA-003), the framework packages (IDEA-004), how the MCP server and the skills ship (IDEA-005) and devtools (IDEA-006).

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the documentation website of 1.0: what it holds, where its records come from, how it shows examples, and how it is built and published. Its plan then writes the pages.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas). They hold for this idea too.
- This idea began on 2026-11-12 with DEC-139. Peter has seen its scope lines in chat and has not yet confirmed its intent.

### Row 01 — resolved
- DEC-144, Peter, 2026-11-12: the website holds the full set. He selected "The full set (Recommended)" in the dialog.

### Row 03 — ready to ask
- Row 01 is resolved, so row 03 is on the frontier.
- The name of the section is settled by Peter's words, by the agent's reading: he said "a blocks section in the docs" twice, so the section is named Blocks. The glossary keeps Recipe as the word for the thing, and says that the documentation shows recipes in its Blocks section.
- Candidates for the blocks, from Peter's words and the inventories: agent interfaces (the 21 patterns of AI Elements of shadcn/ui), app layouts (the blocks of shadcn/ui: dashboard, sidebar, login, signup), page sections for marketing and content sites (no reference system has them), and charts (shadcn/ui and Chakra UI build them on Recharts).

### Waits
- Row 07 — wait: IDEA-003#05 and IDEA-004#04 are resolved.
- Row 08 — wait: IDEA-001 reaches `done`, and IDEA-002 resolves its row 13.
- Row 02 — ready, not started: the agent starts it when a decision of this idea is the next question. No decision on the frontier needs it yet.

### Settled by Peter
- DEC-139: this idea owns the website, its pages, its examples, the blocks section and the records that the MCP server also serves.
- DEC-140: 1.0 gives no recipe out as a component. The documentation gets a blocks section, as shadcn/ui has one. Row 03 holds what is open there.

### Evidence from other ideas
- DEC-119 (IDEA-001#03): 1.0 serves ACME Labs applications, AI-written artifacts, outside teams and marketing and content sites. The website speaks to all four.
- DEC-133 to DEC-135 (IDEA-001 rows 07 and 08): the list holds 145 components with final names. The website has a page for each.
- DEC-142 (IDEA-002#13), for row 04: the usage guidance of a component, which says when to use it and when not, is a spec of its own and no item of the design spec. Peter: "can also be multiple specs". Row 04 decides where that text is written.
- DEC-118 (IDEA-002#18): each design spec reaches the repo as Markdown that an agent pulls from Figma. It is one possible source for row 04.
- DEC-137 and DEC-138 (IDEA-002 rows 04 and 05): 1.0 has light and dark and custom themes, and it targets WCAG 2.2 level AA with both reading directions. The website shows these and must reach the same target itself.
- IDEA-005#06 asks which tools and records the MCP server serves, and IDEA-005#09 asks how an agent with no project gets the 1.0 guidance. Row 04 here is the other view of the same source.
- IDEA-003#11: one HTML page uses 1.0 from a CDN with no build step. The website shows that way of use beside the framework packages.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What does the website hold for each component, and what does it hold beside the component pages (guides, tokens and themes, blocks)? | interview | resolved | — | [DEC-144](../decisions/DEC-144-website-holds-the-full-set.md) |
| 02 | How do other design systems with web components and several framework packages build their documentation websites: which site tools they use, how one page shows an example for each framework, and how they hold a blocks section? | research | open | — | — |
| 03 | Which blocks does the Blocks section have in 1.0? | interview | open | 01 | — |
| 04 | Where do the records of the website come from (component metadata, the design specs pulled from Figma, pages written by hand), and does the MCP server read the same source? | interview | open | 02 | — |
| 05 | Which tool builds the website, and where is it published? | interview | open | 02 | — |
| 06 | How does a page show one example in plain HTML and in each framework package? | interview | open | 02, 07 | — |
| 07 | Import the composition architecture from IDEA-003 and the framework targets from IDEA-004. | task | open | — | — |
| 08 | Import the component list, names and parts from IDEA-001 and the format of a design spec from IDEA-002. | task | open | — | — |

## Not yet specified
- Search, and a version switch for later releases.
- A playground where a reader changes the props of a live component. It overlaps with devtools (IDEA-006): DEC-143 gives devtools live prop switching with prop inspection.
- How a coding agent reads the website, for example through a text version of each page. It sharpens with IDEA-005#09.
- The look of the website itself. It follows the design direction of IDEA-002#26.

## Out of scope
- The component list, names and parts. IDEA-001 owns them.
- The design specs, the tokens and the look of the components. IDEA-002 owns them.
- The Lit core (IDEA-003) and the framework packages (IDEA-004).
- How the MCP server and the skills ship, and what `init` installs. IDEA-005 owns it.
- Devtools (IDEA-006).
- The website of release 0.3.3 as a model. DEC-125 takes release 0.3.3 out as input.
