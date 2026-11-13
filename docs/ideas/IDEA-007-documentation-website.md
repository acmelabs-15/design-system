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
- Success: open, rows 04 and 05. A draft: Peter has chosen what the website holds, where its records come from and how it is built and published; the blocks of 1.0 are decided; a spec exists.
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

### Row 03 — resolved
- DEC-146, Peter, 2026-11-12: the Blocks section has four groups: agent interfaces, page sections for marketing and content sites, app layouts, and charts. He named two more with "maybe"; they are under "Not yet specified".
- The section is named Blocks, by the agent's reading of his words "a blocks section in the docs". The glossary keeps Recipe as the word for the thing.

### Row 02 — resolved
- RES-047, 2026-11-12, from the repositories and sites of ten web component systems. Six ship a framework package; five of them are covered in full, and the site source of Calcite is not public.
- Facts for row 05, the site tool: Eleventy builds the sites of Web Awesome, Shoelace, Spectrum Web Components (first generation) and Material Web. Docusaurus builds those of Ionic and UI5 Web Components. Astro builds Lion's. Storybook is the site of Fluent UI Web Components, Carbon Web Components and the second generation of Spectrum. The hosts named are Vercel, GitHub Pages and Firebase.
- Facts for row 04, the source of the records: the prose of a page is written by hand in each system. The API tables come from a Custom Elements Manifest or from generated metadata in Web Awesome, Shoelace, Spectrum, Ionic and UI5.
- Facts for row 06, one example for each framework: only Ionic and UI5 show a snippet for each framework in every example; each keeps an example as a folder with one file for each framework, and a toggle or tabs switch between them. Shoelace pairs an HTML and a React snippet by hand. Web Awesome and Spectrum show HTML examples only and put the use in a framework on guide pages. All run the HTML example live in the page.
- Facts for the Blocks section: shadcn/ui has 97 blocks, 27 pages and layouts and 70 charts; each is a folder of files with a preview in an iframe and a command that copies it into the project. The documentation of Chakra UI has no blocks section; its 338 blocks are on the paid Chakra UI Pro site. Web Awesome has 50 patterns of plain HTML to copy, a case from a web component system.
- Facts for the two blocks that Peter named with "maybe": TanStack Table has packages for Lit, React, Preact and Solid (9.3.1). TanStack Form has all four too. TanStack Virtual has Lit, React and Solid, and none for Preact. No TanStack document says whether the React packages run on Redact.
- For "How a coding agent reads the website" under "Not yet specified": the sites of Ionic and UI5 build a text version for agents with an `llms.txt` plugin.

### Additional scope of 2026-11-13
Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13, item 2. IDEA-001, Notes, has the table of all items.

- Settled by Peter: "Blocks aren't exported from the package. They show how to compose components into layouts." It agrees with DEC-140.
- Settled by Peter: the research covers the blocks and recipes of all four systems, "not only shadcn", and "the AI components and AI blocks (composed layouts that show the state and composition patterns) are a must-have. Others will be too." Row 10 holds the research. RES-047 has how shadcn/ui, Chakra UI and Web Awesome store and show blocks, with their counts; it has no list of the blocks by name.
- Settled by Peter: the blocks are in Figma in any case, as a library that designers can use. IDEA-002 draws them (IDEA-002#30).
- Open, to settle with Peter: whether Figma or code is the source of truth of a block (row 12); where the blocks live in the documentation (row 13); whether the blocks are exposed through the MCP server, a skill or both (IDEA-005#13).
- Row 13 and DEC-146: DEC-146 gives the blocks a section of the website with four groups. His question of 2026-11-13, "Where do they live in the docs?", comes after that decision, so row 13 asks it again and adds where the source files of a block live.
- Settled by Peter: "The documentation site itself gets designed in Figma first. That spec is then broken down into documentation blocks." The step is the deferred row 14. The agent's reading, not confirmed: the documentation blocks are the pieces of the website's own pages. Whether they are a fifth group of the Blocks section is open inside that row.
- His words on the owner: "It may need its own idea; decide that with me." Row 09 holds that decision. Until then the rows stay here, because DEC-139 gives the blocks section to this idea. The work now reaches IDEA-002 (blocks in Figma), IDEA-005 (blocks for agents) and IDEA-009 (the design skill knows the blocks).

### Waits
- Row 02 — done on 2026-11-12, in the block of agent work that Peter approved: researcher agent `a0832e1b4ed460aa0`, record RES-047. It started without a name; its log records `claude-opus-5-5` and the effort `medium`. The list is in IDEA-001, Notes, "Block of agent work".
- Row 07 — wait: IDEA-003#05 and IDEA-004#04 are resolved.
- Row 08 — wait: IDEA-001 reaches `done`, and IDEA-002 resolves its row 13.

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

### Row 10 — resolved
- RES-067, 2026-11-13, from the documentation and the registries of the systems. It holds each block by name.
- Counts, for row 11:
  - shadcn/ui: 21 patterns in AI Elements, 27 blocks for pages and layouts (1 dashboard, 16 sidebars, 5 login pages, 5 signup pages) and 70 chart blocks in 7 kinds of chart. It has no block for a marketing page.
  - Chakra UI: no blocks in its documentation, and a chart package with documented examples. Chakra UI Pro, a paid site apart from it: 338 blocks in four groups (application 151, marketing 114, e-commerce 23, documentation 50), 5 of them AI blocks, and 7 free blocks. Its code is not public, so the record has the names and, for the AI blocks, what the preview images show.
  - Radix Primitives and Geist: none. Radix Themes: no blocks section; three example pages (a dashboard, a shop, a music app) that exist only in the source of its website.
- The AI blocks, for the group "agent interfaces": the record lists each of the 21 patterns of AI Elements with the components that it composes and the states that it shows. The steps of an agent inside one turn (reasoning, a tool call, a plan, a task, sources and others) are all built on the Trace component, so each step has one shape. A pattern is code on the page that the developer copies; there is no package.
- How a block is given out: shadcn/ui copies a registry item with one command; Chakra UI Pro needs a paid subscription and an API key.
- Against the four groups of DEC-146: agent interfaces, app layouts and charts have blocks in shadcn/ui and in Chakra UI Pro. Page sections for marketing exist only in Chakra UI Pro. The e-commerce blocks of Chakra UI Pro and two of the examples of Radix Themes fit none of the four groups.
- For the deferred row 14 and the reading of "documentation blocks": Chakra UI Pro has a group named documentation with 50 blocks, the pieces of a documentation website: navbar, sidebar, header, code block, example preview, table of contents, parameter field, step, pagination and changelog. So "documentation blocks" is a group that another system has. It is evidence for the agent's reading and no confirmation by Peter.
- A correction to DEC-146: its sentence that no reference system has page sections for marketing sites was wrong for Chakra UI Pro. The record now carries the correction. The decision of the four groups stands.
- For "Which chart engine the chart blocks use" under "Not yet specified": the charts of shadcn/ui and the chart package of Chakra UI are both built on Recharts, a React library.
- For IDEA-005#13: the page of AI Elements also offers a prompt for a coding agent.
- All eight chat components of shadcn/ui are in the list of DEC-135. Two patterns share a name with a component of the list, File Tree and Message; IDEA-001, Notes, holds the point for the review of the parts.
- Not confirmed by the record: what each block of Chakra UI Pro composes, the content of its four templates, and the chatbot template of shadcn/ui, which it did not read.

### Second block of agent work
- Row 10 — done on 2026-11-13: RES-067, from the researcher agent `ab6e1ab009a6abe73`, started without a name. Its log records Opus 5.5 and the effort `medium` on all 114 requests, checked after the agent ended. It was the third start of the row; two starts of the same day ended in outages of the Claude login.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What does the website hold for each component, and what does it hold beside the component pages (guides, tokens and themes, blocks)? | interview | resolved | — | [DEC-144](../decisions/DEC-144-website-holds-the-full-set.md) |
| 02 | How do other design systems with web components and several framework packages build their documentation websites: which site tools they use, how one page shows an example for each framework, how they hold a blocks section, and which TanStack packages (Table, Virtual, Form) work with Lit and with each framework target? | research | resolved | — | [RES-047](../research/RES-047-documentation-websites-of-web-component-systems.md) |
| 03 | Which blocks does the Blocks section have in 1.0? | interview | resolved | 01 | [DEC-146](../decisions/DEC-146-blocks-section-has-four-groups.md) |
| 04 | Where do the records of the website come from (component metadata, the design specs pulled from Figma, pages written by hand), and does the MCP server read the same source? | interview | open | 02 | — |
| 05 | Which tool builds the website, and where is it published? | interview | open | 02 | — |
| 06 | How does a page show one example in plain HTML and in each framework package? | interview | open | 02, 07 | — |
| 07 | Import the composition architecture from IDEA-003 and the framework targets from IDEA-004. | task | open | — | — |
| 08 | Import the component list, names and parts from IDEA-001 and the format of a design spec from IDEA-002. | task | open | — | — |
| 09 | Do the blocks and recipes get an idea of their own, or do they stay in this idea? | interview | open | — | — |
| 10 | Which blocks and recipes do shadcn/ui, Radix (Primitives and Themes), Chakra UI and Geist have, and which AI components and AI blocks among them: for each, what it composes, which state and composition pattern it shows, and how the system gives it out? | research | resolved | — | [RES-067](../research/RES-067-blocks-and-recipes-of-the-reference-systems.md) |
| 11 | Which blocks does 1.0 have, by name, in each group of DEC-146? | interview | open | 10 | — |
| 12 | Is Figma or code the source of truth of a block? | interview | open | — | — |
| 13 | Where do the blocks live in the documentation, and where do the source files of a block live? | interview | open | — | — |

## Deferred rows
Rows of the spec phase, by [the workspace rule](../agents/workspace.md#deferred-rows). They are not open and not on the frontier. Each one moves into the spec of this idea when its spec phase starts.

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 14 | Design the documentation website in Figma first, then break that design spec down into documentation blocks. Open inside this row: whether the documentation blocks are a fifth group of the Blocks section. Source: Peter's additional scope of 2026-11-13, item 2. | task | deferred | — | — |

## Not yet specified
- Whether the Blocks section also has data tables with virtualization and forms that use TanStack packages. Peter named both with "maybe" (DEC-146). Row 02 checks which TanStack packages work with Lit and with each framework target.
- Which chart engine the chart blocks use.
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
