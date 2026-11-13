---
id: IDEA-008
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-008: Claude Design compatibility

## Intent
- Outcome: a decision on what, if anything, 1.0 does so that the design system works with Claude Design, with the research behind it.
- User: Peter decides. People who make designs with Claude Design use the result.
- Why now: Peter added it to the scope of 1.0 on 2026-11-13, as a new idea that needs research.
- Success: open, row 02. A draft: research shows what Claude Design takes from a design system; Peter has decided what 1.0 does for it.
- Constraint: research comes first. Release 0.3.3 is no input (DEC-125).
- Out of scope: the design skill for Figma (IDEA-009), the design specs and tokens in Figma (IDEA-002), how the MCP server and the skills ship (IDEA-005), and the components themselves (IDEA-001 to IDEA-004).

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A decision: what, if anything, 1.0 does to be compatible with Claude Design. If the answer is work of its own, a spec follows; row 02 settles which.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas). They hold for this idea too.
- This idea is a stub. Peter asked for it on 2026-11-13: "This is a new idea that needs research. Stub its idea file now." Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13, item 8.
- His words for the research: "what, if anything, needs to be done to make the design system compatible with Claude Design."
- Row 01 — done on 2026-11-13: RES-074, from the researcher agent `a1bf78002111a302b`, started without a name. Its log records Opus 5.5 and the effort `medium` on all 58 requests, checked after the agent ended. The agent called the host's Artifact tool once, to list the Artifact types, which a hook refused; it created and published nothing.
- A start for row 01: Anthropic's own documentation of Claude Design. The Claude Code host of this session lists a tool named `DesignSync` and Artifact types for a design system (2026-11-13); neither is read for this idea yet.

### Row 01 — resolved
- RES-074, 2026-11-13, from Anthropic's help pages, the Claude Code documentation and one walkthrough of a third party. No trial ran.
- What Claude Design is: Anthropic's tool for designs, interactive prototypes, one-pagers and decks, made by chat on a canvas. Since 2026-09-16 it is a template that an artifact starts from, in any Claude conversation and in Claude Code (`/design`). The standalone site claude.ai/design closes on 2026-12-14. Design systems are in beta.
- What it takes from a design system: colours, typography, components and layout patterns. In Claude a design system is an artifact with a guide, tokens, components with live previews, and files. Three routes bring one in: from a chat (uploads, Figma files, decks, logos, fonts, connected apps); from Claude Code with `/design-sync`; or by a move from the standalone site.
- The route from code is documented for React only. `/design-sync` is described as "Convert your repo's React design system", for a system that "already exists as React components".
- No Anthropic source names web components, custom elements or Lit. None names a token file format, an MCP server or agent skills as an input. None names the framework of the code that a design becomes.
- From the walkthrough of a third party, which Anthropic's documentation does not confirm: the sync builds one bundle with every component, the stylesheet, the fonts and a copy of React, and it finds the components through the entry file and their TypeScript types. Storybook stories become the previews.
- A page of an ordinary artifact loads scripts only from a few public CDNs, jsDelivr's `/npm/` path and unpkg among them. No source says whether the canvas of a design has the same limit.
- A disagreement in Anthropic's own pages: the help page names `/design-sync` as the way to bring a design system into Claude, and the page of the commands says that it uploads to the standalone site, which closes on 2026-12-14.
- Open after the record, and no source can close it: whether Claude Design can show custom elements; whether the React package of 1.0 satisfies `/design-sync`; what a chat import of a library with no React makes of it; whether a design can load a library from a CDN. Row 03 is the trial that can show it.
- A source that the agent could not read: the host of the main session lists a tool named `DesignSync`. Its description says what the sync takes. Read it when row 03 or row 02 is next.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What is Claude Design, what does it take from a design system (components, tokens, a design system file, an MCP server, skills), in which formats, and what does it need from a library of web components? | research | resolved | — | [RES-074](../research/RES-074-claude-design-and-design-systems.md) |
| 02 | What, if anything, does 1.0 do to be compatible with Claude Design? | interview | open | 01, 03 | — |
| 03 | In a trial with Peter's Claude account: what arrives in Claude Design from a small library of Lit components and from its React wrappers, through `/design-sync` and through an import in a chat, and what does a design then show? The trial uploads a design system to his account, so it starts only on his word. | task | open | 01 | — |

## Not yet specified
- Whether the work touches the token output of IDEA-002, the MCP server and the skills of IDEA-005, or the design skill of IDEA-009. It sharpens after row 01.

## Out of scope
- The design skill for Figma. IDEA-009 owns it.
- The design specs, the tokens and the Figma library. IDEA-002 owns them.
- How the MCP server and the skills ship. IDEA-005 owns it.
