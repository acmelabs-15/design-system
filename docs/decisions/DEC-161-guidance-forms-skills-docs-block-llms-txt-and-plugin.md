---
id: DEC-161
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-005#20 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-070, RES-077, RES-082] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-161: The guidance of 1.0 has five forms: skills, documentation in the package, a managed block, llms.txt and a plugin

IDEA-005#20 asks which forms the guidance for coding agents takes. Peter decided on five forms, in three replies of 2026-11-20. He rejected the agent's recommendation of no plugin in 1.0.

| Form | His decision | Source |
|---|---|---|
| Skills, each with a SKILL.md file | Yes | His mark ✅ in his reply to all ten decisions |
| Documentation inside the package | Yes | His mark ✅ in the same reply |
| A managed block in the AGENTS.md or CLAUDE.md of the consumer's project | Yes, and on by default: the command of 1.0 writes it unless the developer says no | His answer to the dialog for the agent's doubt D3: "Yes, on by default (Recommended)" |
| An llms.txt file on the documentation site | Yes | His mark ✅ with the note "(llm.txt)" in decision 4 of the same reply |
| A plugin for agent hosts | Yes, from a marketplace of our own, and thin: it holds pointers only | His answer to the dialog for the agent's doubt D4: "A plugin from our own marketplace" |

The words of the option that he chose for the plugin: "As the brain plugin. It holds pointers only: a skill that reads the installed package, and an entry that starts the installed server. Cost: one plugin format for each host to build and test, and two version numbers." The option that he did not choose adds the official marketplaces of the hosts; his mark for "Plugin marketplaces of agent hosts" in the same reply is ❌.

The example of the block in the question, which shows the kind of text and is no final wording: "This project uses the ACME design system. Before you build UI, call the search tool of the acme MCP server. Use a design system component where one fits, not a local one."

## Consequences

- The block is the text that an agent host always loads. It tells an agent that the design system is there and that it has a server. It answers what Peter saw at Highspot (DEC-160): agents that did not know where the design system was and used a local component with a fitting name.
- The block has markers, so the command can update it and remove it. The command changes a file that the developer owns; the developer can say no.
- The plugin has a version number of its own, beside the version of the installed library. It stays in step because it holds pointers and no content: its skill reads the installed package, and its entry starts the installed server.
- Open, for the spec: a project can hold the files that the command wrote, and the developer can have the plugin too. Then an agent can get the same skill and the same server two times. IDEA-005#27 finds out what each agent host does in that case, and which hosts load a plugin from a marketplace of our own.
- Open, for IDEA-005#25: which agent hosts get a plugin.
- Where each form lives is DEC-162, and the skills by name are IDEA-005#07.
- The design skill for Figma (IDEA-009) decides its own form; the plugin is one possible home for it.
