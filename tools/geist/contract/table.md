# table: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 2 time(s), so at least one demo here is interactive.

- [ ] onClick — wired in 1 example. Our equivalent: 

## Read and judge — names an observable, but also carries guidance

- [ ] (Behavior) Sortable column headers are buttons. The visible label stays Title Case; the sort-direction arrow is decorative and the button announces the next sort state to assistive tech.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) When the underlying list is empty (filter cleared, never created), render `Empty State` outside the table rather than an empty `<Table.Body>`.
- [ ] (Behavior) Render `—` in cells where a value is unknown or not applicable. Don’t substitute `N/A`, `null`, or an empty string.
- [ ] (Behavior) Apply `tabular-nums` (or Geist Mono) to numeric columns so digits align across rows for comparison.
- [ ] (Content) Column headers (`<Table.Head>`) are Title Case nouns or noun phrases: `Last Used`, `Requests (7d)`, `Created`, `Status`. Never sentences.
- [ ] (Content) Use the canonical short relative-time form in cells (`2m ago`, `5h ago`); switch to `Mar 14, 2026` past 7 days. See `Relative Time Card`.
- [ ] (Content) Pagination labels are `Previous` and `Next`. Page-count copy reads `Page 2 of 7` or `21–40 of 142` with an en-dash inside the range.
