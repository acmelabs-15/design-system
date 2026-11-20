---
id: RES-082
status: in-progress # in-progress | resolved
kind: research
from: IDEA-005#16 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-20
---
# RES-082: Where frameworks and libraries keep their MCP servers and agent skills

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
Where do the MCP servers and the agent skills of large frameworks, packages and libraries live, over a large sample that is not limited to design systems: inside the main package, in a package of their own, on a hosted server, in a repository or a marketplace of plugins? How does a consumer install each, and how does each stay at the version of the installed library?

Peter asked for this research on 2026-11-20, with `/deep-research`, in his reply to IDEA-005#04. His conditions: a large sample, not only design systems, and comprehensive. His examples: Storybook, AG Grid and Chakra UI. He decided in the same reply that 1.0 does not use TanStack Intent (DEC-154); the survey records what Intent does as a fact of the landscape.

Needed by: IDEA-005#04, inside the package or apart; IDEA-005#05, what `init` installs and how it updates; IDEA-005#09, an agent with no project.

Earlier records with a smaller sample: RES-030, about twelve libraries and the folders of each agent host; RES-070, the skills and the tools of fifteen design systems; RES-077, the trial of an `init` command.

## Answer
Not answered yet.

Sufficient answer: one checked record for each surveyed project, with the place of its MCP server, the place of its guidance for coding agents, the way a consumer installs both, the way both stay at the version of the installed library, the tool that distributes the skills, and the reason that the maintainers state. Then the counts for each place, the groups of projects, the disagreements and what was not confirmed.

## Findings
None yet.

## Follow-ups
None.

## Next action
The first run, `wf_48bdc7bd-7b0`, was stopped by the main session on 2026-11-20 after 47 of its agents had ended. Its agents read GitHub with the `gh` command, which acts with Peter's login, and Peter wrote: "use the git instead of gh". Its four listers and 43 first records were complete; no record was checked yet. The 43 records are in `.artifacts/v1/research/RES-082-run1/` as `p01.json` to `p43.json`, and the candidates of the listers are in `lister-candidates.json` there (scratch, outside git).

The second run is in progress since 2026-11-20: run `wf_1e4f16be-d04`, task `w7nqfxq8u`, from the script `.artifacts/v1/research/survey-by-subject.js` (scratch, outside git). The script now tells each agent to read a repository through its public web pages or with `git`, and never with `gh`. It has 106 subjects: the 43 with a first record, which go straight to the second agent that checks them; the other 31 of the seed list; and 32 that the listers found, such as Quasar, DevExpress, Handsontable, Recharts, Bootstrap, tRPC and Redux Toolkit. A critic can add 6. Each agent runs on Opus 5.5 at the effort `medium`. The main session writes the result into this record.
