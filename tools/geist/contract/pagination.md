# pagination: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use Pagination for sequential navigation between sibling pages (docs articles, blog posts, onboarding steps). For revealing more rows of the same data set, use `Show More` or a numbered pager.
- [ ] (Best Practices) `previous.title` and `next.title` are the destination page names (`Deploy Hooks`, `Environment Variables`). Geist already renders the `Previous` / `Next` label, the chevron, and the `Go to {direction} page: {title}` aria label; don’t prepend arrows or `Go to`.
- [ ] (Best Practices) Hide the slot at the start or end of a sequence instead of disabling it; an empty rail reads cleaner than a dimmed link with nowhere to go.
- [ ] (Best Practices) Keep titles Title Case and short enough to fit the rail without wrapping; long destination names truncate, so put the distinctive word first.
- [ ] (Best Practices) Don’t restate ordinal positions like `Page 3 of 10` inside `previous.title` or `next.title`. Pagination is sibling-link, not a numbered pager.
