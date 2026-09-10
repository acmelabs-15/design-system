# project-banner: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Project Banner is non-dismissible by design. If the message can be dismissed without resolving the underlying state, it isn’t banner-worthy; move it to a `Note`.
- [ ] (Behavior) Show one Project Banner at a time. Stacking competing banners drowns the most urgent state.
- [ ] (Behavior) Always pass a `callToAction` that resolves the state. A banner with no route is a dead end.
- [ ] (Content) `label` is one sentence in sentence case that names the impact: `Your Pro trial expires in 3 days.` Don’t open with `Heads up` or apologetic preambles.
- [ ] (Content) `callToAction.label` is Title Case `Verb + Noun` and points at the resolver: `Update Payment Method`, `Reactivate Project`, `Review Tokens`.
- [ ] (Content) Name the affected entity when the project context isn’t obvious from the surrounding chrome (`Production deployments are paused on my-project`).
- [ ] (Content) Don’t encode severity in the copy with emoji or interjections; the variant carries that signal.
