# show-more: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 2 time(s), so at least one demo here is interactive.

- [ ] onClick — wired in 1 example. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Render hidden rows in the DOM when the count is small so find-in-page works; lazy-load only when the dataset is large enough to hurt initial render.
- [ ] (Best Practices) The trigger is a `<button>` with `aria-expanded` and `aria-controls` pointing at the list. After expansion, move focus to the first newly revealed row so screen readers and keyboard users land in the new content.

## Read and judge — names an observable, but also carries guidance

- [ ] (Best Practices) Pair the trigger with the count of hidden items so the user knows the cost of expanding (`Show 12 More`, then `Show Less` after expand). Title Case both labels.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use ShowMore for progressive disclosure of a single long list or block (recent activity, repo branches, attached resources). For sibling pages of the same data set, use `Pagination`; for optional sections, use `Collapse`.
- [ ] (Best Practices) Show enough rows to convey the shape of the list before truncating (5–10 typical). Truncating at 2 makes the affordance feel performative.
- [ ] (Best Practices) Don’t cycle Show More then Show Less mid-flow on the same data set; collapsing rows after the user expanded them scrolls them away from where they were reading.
