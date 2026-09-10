# json-view: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) JSON View renders as a tree. Arrow keys move between visible nodes, Enter and Space toggle expandable nodes, and Home and End move to the first and last visible node.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Start with `defaultExpandDepth={1}` for log and detail surfaces where the top-level fields are useful by default.
- [ ] (Behavior) Use `defaultExpandDepth={0}` for dense tables, compact previews, or rows where expanded JSON would compete with primary row content.
- [ ] (Behavior) Pass `highlightPattern` only for active search states. Leave it `null` when nothing is being searched.
- [ ] (Behavior) Keep the source data as an object or array. Do not pre-stringify JSON before passing it to `data`.
- [ ] (Accessibility) Keep the component near the text or control that introduces the JSON. The accessible tree label is `JSON`, so surrounding context should identify the object.
- [ ] (Accessibility) Preserve selectable text. Users often copy JSON from logs or traces into search, support, or debugging tools.
