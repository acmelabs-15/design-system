---
id: RES-085
status: in-progress # in-progress | resolved
kind: research
from: IDEA-005#26 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-20
---
# RES-085: The tools of the MCP servers and the skills of frameworks and libraries

## Question
For the frameworks, packages and libraries that provide an MCP server or agent skills: which tools does each MCP server give to an agent, and what does each tool do? Which skills does each project provide, as a complete list, and what does each skill do?

Peter asked for this research on 2026-11-20, with `/deep-research`, in his reply to IDEA-005#17. His words: "this is another thing I'd like us to fan out and do some broad/deep research on - packages that provide mcps, what tools do their mcps provide to the agent/what do those tools do - what skills do they provide - for example figma has quite a few - I'd like to know the complete list of skills provided by each of these frameworks/packages and what they do."

Needed by: IDEA-005#06, the tools of the MCP server of 1.0; IDEA-005#07, the skills that ship for consumers; IDEA-005#12, tools that return user interface. Peter decided on the same day that the server of 1.0 is a documentation server with a search by intent (DEC-160), and he likes MCP Apps but is "not sure exactly what for".

Earlier records: RES-070 has the tools and the skills of fifteen design systems, joined into concepts; RES-082 has, for 112 projects, where the server and the skills live and a short detail of each; RES-066 and RES-080 have MCP Apps in Storybook and in three agent hosts.

## Answer
Not answered yet. The answer is sufficient when it holds, for each surveyed project:

- each official MCP server, the number of its tools, and the complete list of the tools with what each does;
- how its search works: the input, the result, and where and how it ranks;
- each tool that returns user interface, with what the user sees and can do;
- the prompts and the resources of the server;
- the complete list of the official skills, with what each does, and whether a skill points at the server, a command line tool or files in the installed package.

And across the projects: the kinds of tools and of skills with their counts, and the limits of the survey.

## Findings
None yet. The run writes its records to a result file in scratch, and the main session fills this record from it.

## Follow-ups
None yet.

## Next action
The survey runs since 2026-11-20 as a workflow from the script `.artifacts/v1/research/RES-085-survey.js` (scratch, outside git), which is `survey-by-subject.js` with the arguments of this survey written into it. IDEA-005, Notes, "Row 26 — running", holds the run ID, the sample and the fields. When the run ends: check the model and the effort in the logs, save the result as `.artifacts/v1/research/RES-085-result.json`, and fill Answer and Findings from it.
