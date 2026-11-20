---
id: RES-087
status: in-progress # in-progress | resolved
kind: task
from: IDEA-004#10 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-20
---
# RES-087: The React package on Preact, and a wrapper of @lit/react on three runtimes

## Question
Does the React package over Lit elements run on Preact through `preact/compat`, and does a wrapper made with `createComponent` of `@lit/react` pass on React 19, on Redact and on Preact?

Peter decided on 2026-11-20 that the framework targets of 1.0 are React, Redact and Preact (DEC-168). The test RES-079 ran one application on React 19 and on Redact and found one changed wrapper that passes on both. It did not run Preact, and it did not use `@lit/react`.

Needed by: IDEA-004#05, whether each wrapper is generated or written by hand; IDEA-004#06, the tests of each wrapper; IDEA-004#07, whether each target is its own package or an entry of one package.

## Answer
Not answered yet.

Planned action: in the scratch folder `.artifacts/v1/trial/IDEA-004-10/`, start from a copy of the application of `.artifacts/v1/trial/IDEA-004-03/`. Run the same application code on three runtimes: React 19, Redact, and Preact through `preact/compat`. Run it with three wrappers: the unchanged wrapper of RES-079, its changed wrapper, and a wrapper made with `createComponent` of `@lit/react`. The brief is `.artifacts/v1/briefs/IDEA-004-10.md` with `.artifacts/v1/briefs/common-task.md` (scratch, outside git).

Completion condition: the result file gives, for each of the eight points of RES-079 and for each of the three wrappers, the observed outcome on React 19, on Redact and on Preact side by side, or "not performed" with the reason. It also says, for Preact, whether a hook of the application works and what a ref holds.

Steps that are safe to repeat: each of them. The task writes only inside its scratch folder, installs packages only there, publishes nothing and signs in to nothing.

## Findings
None yet.

## Follow-ups
None yet.

## Next action
The task agent runs the test. The progress file is `.artifacts/v1/trial/IDEA-004-10/IDEA-004-10-progress.md`.
