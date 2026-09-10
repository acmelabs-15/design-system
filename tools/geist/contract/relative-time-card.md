# relative-time-card: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use `<RelativeTimeCard>` anywhere a recent timestamp appears in scannable surfaces: `Table` cells, `Entity` rows, deploy lists, activity feeds. For a static date in body prose past 7 days, render `Mar 14, 2026` directly.
- [ ] (Best Practices) Pass `date` as a number (Unix ms or epoch). Don’t pre-format the value, and don’t replace `children` with a formatted string. The component’s short formatter is the canonical form (`2m`, `5h`, `Yesterday`).
- [ ] (Best Practices) Don’t append `ago` after the component. The formatter already produces `2m ago` / `5h ago`, so `<RelativeTimeCard /> ago` reads as `2m ago ago`.
- [ ] (Best Practices) Use `children` only for non-time labels (`Just now`, `Pending`, `Queued`) where the formatter can’t describe the state.
- [ ] (Best Practices) Pair with a leading label when the row is ambiguous on its own: `Last deploy <RelativeTimeCard date={ts} />`. The hover card already shows absolute UTC and local time, so don’t duplicate that copy elsewhere on the row.
