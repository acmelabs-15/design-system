# feedback: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Behavior) Pair the metadata variant with non-PII context (route, build ID, plan, viewport) so the team can reproduce the report without a second round-trip.
- [ ] (Behavior) Submit closes the panel and returns focus to the trigger. Don’t replace the panel with a generic acknowledgment toast; the close itself is the acknowledgment.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Keep the panel collapsed until the user clicks the trigger; auto-opening derails the work that prompted the feedback.
- [ ] (Content) `label` is Title Case and short. Default `Feedback` is fine; override only when scoping to a flow: `Feedback on Imports`, `Report a Bug`. Don’t end the label with `?`.
- [ ] (Content) `copy` overrides the prompt header next to the emoji row in sentence case (`How did the import go?`). Cut `please` and `we’re sorry`.
- [ ] (Content) The textarea placeholder (`Your feedback...`) is fixed by Geist; don’t try to override it with rich children.
