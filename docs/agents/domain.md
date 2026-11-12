# Domain docs

How brain's skills read this repo's domain documentation. Layout: multi-context.

## Before you name a domain concept, read these

- `GLOSSARY.md` at the repo root: the glossary, one term per entry, with the words to avoid.
- `GLOSSARY-MAP.md` at the repo root, when it exists: the repo has several contexts, and the map points to the `GLOSSARY.md` for each. Read the one your topic belongs to.
- `docs/decisions/`: the decision records that touch the area you work in, one `DEC-NNN-<slug>.md` file per decision. An architecture decision is a decision record with `kind: architecture`. When `docs/agents/workspace.md` names another decisions folder, read that one.

If a file is absent, proceed without it and do not suggest creating it. The domain-modeling skill creates `GLOSSARY.md` and the first decision record lazily, when a term or a decision is resolved.

## Use the glossary's words

When your output names a domain concept, in a task title, a spec, a test name or a reply, use the term as `GLOSSARY.md` defines it. A word the glossary marks _Avoid_ stays out.

A concept the glossary lacks is a signal: either you are inventing a word the project does not use, so reconsider, or there is a real gap, so note it for the domain-modeling skill.

## Flag a decision you contradict

If your output contradicts a decision record, say so where the reader will see it, and say why it is worth reopening. Do not override it in silence.
