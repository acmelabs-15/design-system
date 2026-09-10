# empty-state: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Behavior) The CTA must be a real `Button` or `Link`, not an `onClick` div, so it joins the tab order and exposes a role.
- [ ] (Behavior) After an async filter change, wrap the region in `aria-live="polite"` so screen readers announce the new state.
- [ ] (Content) Error variant pairs the body with a copyable request ID and a `Try Again` button.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Cap at one primary CTA, plus one secondary when the first action could legitimately be one of two paths (`Import Repository` and `Deploy Template`). Three CTAs is a smell.
- [ ] (Behavior) Don’t auto-launch a tour from the educational variant; pair `Start Tour` with `Skip`.
- [ ] (Content) `title` is Title Case (`No Logs Match Your Filter`); `description` is sentence case and adds new information instead of restating the title.
- [ ] (Content) Quote a single typed query verbatim with curly quotes: `No logs match “${query}”. Clear the filter to see all logs.` For multi-facet filters use the plural template `No {Items} Match Your Filters` and suggest widening or clearing.
- [ ] (Content) Onboarding bodies name the next action that creates the first item: `Push to your Git repository to create your first one.` Tier-gated bodies follow `{Feature value} with the {Plan} plan.`
- [ ] (Content) CTA labels are Title Case `Verb + Noun`. Never `Get Started`, `Continue`, or `OK`.
