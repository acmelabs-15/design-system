---
id: IDEA-006
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-006: Devtools for all framework versions

## Intent
- Outcome: a devtools package that works with every framework version of 1.0, with live prop switching on a selected component and theming controls.
- User: Peter decides. Developers use it while they build with 1.0.
- Why now: 1.0 replaces the 0.3.3 inspector, so its base is chosen again: TanStack Devtools, a fork of it, or our own.
- Success: research covers extending TanStack Devtools, forking it and building our own; Peter has chosen; the capability list is fixed; a spec exists.
- Constraint: research comes first, then Peter decides.
- Out of scope: the documentation website (IDEA-007). IDEA-002 owns the token pipeline, IDEA-003 the Lit core, IDEA-004 the wrappers and IDEA-005 the MCP server and skills.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the 1.0 devtools package: its base, its capabilities, and how it reaches each framework version.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Additional scope of 2026-11-13
Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13. IDEA-001, Notes, has the table of all items.

- Item 6, his words: "Find out whether other design systems ship devtools. Study TanStack Devtools, and look at what larger systems such as Material do. From that, research comprehensively what belongs in our devtools."
- RES-031 covers TanStack Devtools and eleven other bases as a base for our package. It does not say which design systems ship devtools of their own, and it does not list what such tools do. Row 09 holds that survey.
- The six capabilities of DEC-143 stand until row 10, which asks what the survey adds or takes away. Row 04, the base, now waits for row 10, because the base must carry the final list.

### Waits
- Row 01, the two follow-up questions of RES-031 — in the block of agent work that Peter approved on 2026-11-12, as two single research agents and not as workflow runs. Question 1 (the other in-page bases) is answered in RES-031 since 2026-11-12, by the researcher agent `a0becb199c1440699`. Question 2 (devtools for web components, and TanStack Devtools with no framework) runs since 2026-11-12 in the same record: researcher agent `ae5af13955a9023dc`, started without a name. The main session added the follow-up of question 1 to its brief: the Vite DevTools Kit and Devframe, a base that the first run did not name. It is the same row question and needs no further agent.
- RES-031, from question 1, evidence for row 04: Storybook has something ready for most of the six capabilities of DEC-143, but it does not run inside the consumer's application. Vue DevTools and Nuxt DevTools run only in a Vue or Nuxt application, and the Astro dev toolbar only in an Astro site. The Vercel toolbar has no documented API for third parties. No base, TanStack Devtools included, documents a token inspector, an editor for the values of a custom theme, or the export of a theme file (DEC-145). The list is in IDEA-001, Notes, "Block of agent work".
- Row 01 — running since 2026-11-12, after Peter's go (IDEA-001, Notes). Record: RES-031. Workflow run `wf_40354acd-051`, task `w76opab21`, from the script `.artifacts/v1/research/deep-research-opus-medium.js`. Its first agent's log records `claude-opus-5-5` and the effort `medium`. The run ended on 2026-11-12 with 104 agents and no error. RES-031 holds a partial answer: 8 findings on TanStack Devtools (alpha, version 0.16.0, shell written in Solid.js, adapters for six frameworks, none for Lit or plain custom elements); no confirmed claim on any other base. Two narrower runs are named in RES-031, Next action. The agent holds these runs until the decision rows of this idea are next: the facts are about tools that change each month, and no decision that needs them is on the frontier. Peter can ask for them sooner.
- Row 07 — wait: IDEA-003#05 and IDEA-004#04 are resolved.
- Row 08 — done on 2026-11-12 by the main session: RES-044.

### Row 01 — resolved
- RES-031 is answered since 2026-11-12: the sweep, then one research agent for each of its two follow-up questions (`a0becb199c1440699` and `ae5af13955a9023dc`; both logs record `claude-opus-5-5` and the effort `medium`). The second agent also covered the Vite DevTools Kit and Devframe, the follow-up of the first.
- Facts for row 04, the base:
  - TanStack Devtools (0.16.0, alpha, MIT): a panel can be plain DOM code, and the core mounts with no framework. Its shell is written in Solid. No source covers its use on a page with no build step; the published core imports Solid by bare module names. It has an accessibility plugin with rules up to WCAG 2.2 AA and a download from its panel. No source describes property editing or theme controls as a feature; the documentation names state editing as something that a plugin can build.
  - Storybook has most of the six capabilities of DEC-143 ready, but it is an application of its own and does not run inside the consumer's application.
  - Vue DevTools, Nuxt DevTools and the Astro dev toolbar each run only in their own framework. The Vercel toolbar documents no API for third parties.
  - Devframe (1.3.3, MIT, first published in April 2026) is a framework-neutral base for devtools. It needs a running JavaScript server. The Vite DevTools Kit needs Vite 8.3 or later.
  - Tools for web components: Lit DevTools (third party, BSD-3-Clause, Lit elements only) edits properties on the live element, records events and reads a Custom Elements Manifest; it runs on Vite DevTools or on Devframe. The browser extensions run in the browser's own devtools and not in the page. `api-viewer-element` works on its own demo instance and not on a component of a running application.
  - No base documents a token inspector, an editor for the values of a custom theme, or the export of a theme file (DEC-145). So 1.0 builds these three on any base.
  - No base documents a plain HTML page with no server and no build step as a host. DEC-119 names such pages as one way of use.
- Facts for row 05: the table in RES-031 holds each base against the six capabilities and the theme export. Lit DevTools shows that one tool can work on the custom elements themselves, for Lit elements.
- Points that no source covers, marked UNVERIFIED in the record: a custom element as a TanStack panel; TanStack Devtools with no build step; a theme file written through the server functions of Devframe.

### Evidence from other ideas
- DEC-137 (IDEA-002#04), for rows 03 and 06: the tokens carry light and dark, and custom themes with a team's own brand colour, typeface and corner radius. 1.0 has no density setting and no built-in accent choice. The theming controls work on these.
- DEC-127 (IDEA-003#04): 1.0 does not render on the server.

### Settled by the prompt
- One devtools package serves all the framework versions.
- Its capabilities include live prop switching on a selected component, and theming controls.
- The options to evaluate: TanStack Devtools (extend it, or fork it into something custom) against our own build. Research comes first.

### Row 03 — resolved
- DEC-143, Peter, 2026-11-12: the first release has six capabilities: live prop switching with prop inspection, theming controls, token inspector, accessibility checks, event log and breakpoint view. He selected all four that the agent offered; the agent had recommended the token inspector only.

### Row 06 — resolved
- DEC-145, Peter, 2026-11-12: the theming controls preview a custom theme and export it as a theme file. The export holds only a team's own values; RES-044 holds the facts.

### Second block of agent work
- Row 09 — running since 2026-11-13, in the second block of agent work that Peter approved (IDEA-001, Notes, "Second block of agent work"). Researcher agent `a3522f423f715c650`, started without a name; its log records Opus 5.5 and the effort `medium`. Its record is RES-063. It is the second start: the first agent, `a96e132160640b841`, ended in the outage of the Claude login on 2026-11-13, and its record was removed at Peter's request.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What does TanStack Devtools offer for extension and for a fork, and which other bases for devtools exist? | research | resolved | — | [RES-031](../research/RES-031-devtools-bases-landscape.md) |
| 03 | Which capabilities must the first devtools release have beyond live prop switching and theming controls? | interview | resolved | — | [DEC-143](../decisions/DEC-143-devtools-first-release-capabilities.md) |
| 04 | Is devtools built on TanStack Devtools (extended or forked), or built by us? | interview | open | 01, 03, 10 | — |
| 05 | Does devtools work on the custom elements for every framework, or through an adapter for each framework? | interview | open | 04, 07 | — |
| 06 | Do the theming controls only preview token values, or do they also export changes? | interview | resolved | 03, 08 | [DEC-145](../decisions/DEC-145-theming-controls-preview-and-export-a-custom-theme.md) |
| 07 | Import the composition architecture from IDEA-003 and the wrapper targets from IDEA-004. | task | open | — | — |
| 08 | Import the token pipeline decision from IDEA-002. | task | resolved | — | [RES-044](../research/RES-044-devtools-import-of-the-token-pipeline.md) |
| 09 | Which design systems ship devtools of their own, Material and other large systems among them, what does each tool do, and what do the tools of TanStack Devtools do for their users? The result is a full list of candidate capabilities for ours. | research | in-progress | — | — |
| 10 | Which capabilities does the survey add to the six of DEC-143, and does one of the six go? | interview | open | 09 | — |

## Not yet specified
- How devtools stays out of production bundles.
- Whether devtools and the MCP server read component metadata from one source.

## Out of scope
- Row 02, retired on 2026-11-12: "What does the 0.3.3 devtools package do, and which limits do its records name?" DEC-125 takes release 0.3.3 out as input.
- The token pipeline (IDEA-002), the Lit core (IDEA-003) and the wrappers (IDEA-004).
- The MCP server and the skills (IDEA-005).
