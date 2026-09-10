# middle-truncate: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 3 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 1 example. Our equivalent: 
- [ ] onValueChange — wired in 1 example. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Keep the visible string long enough on small viewports that the head still identifies the resource (path segment, ID prefix).

## Read and judge — names an observable, but also carries guidance

- [ ] (Accessibility) Avoid Middle Truncate inside focusable controls without an explicit `aria-label`; the ellipsis on its own gives screen readers nothing to announce.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Middle Truncate renders a single ellipsis glyph (`…`) rather than three periods. This keeps monospace values, including environment variable keys, IDs, hashes, and paths, from reserving three character cells for the truncation marker.
- [ ] (Behavior) The component listens to its container width, so layouts that change width on hover (expanding cards, animated rows) cause the truncation point to jitter. Lock the width during interaction.
- [ ] (Behavior) Copying truncated text yields the full original string from the underlying value, not the visible ellipsis form. Confirm this stays true if wrapping with custom `onCopy`.
- [ ] (Behavior) Don’t wrap Middle Truncate in another `text-overflow: ellipsis` container; the two strategies fight each other and the inner ellipsis wins inconsistently.
- [ ] (Accessibility) Expose the full string to assistive tech via the wrapping element’s accessible name (the component already keeps the full value in the DOM for copy).
