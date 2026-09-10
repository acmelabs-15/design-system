# book: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Treat the cover as decorative chrome and surface the title via the underlying heading element so screen readers don’t double-announce.
- [ ] (Accessibility) Inner illustrations need alt text only when they communicate something the title doesn’t; otherwise mark them `aria-hidden`.
- [ ] (Accessibility) When the Book wraps a link, put the focus ring on the link itself, not the cover, so keyboard users see the actual hit target.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Set the `color` prop from design tokens (`var(--ds-blue-700)`, `var(--ds-amber-600)`) instead of raw hex so the cover follows light/dark theme tokens.
- [ ] (Behavior) Reserve the textured variant for hero shots; on a row of multiple Books the texture competes with the labels.
- [ ] (Behavior) Use the responsive width prop to keep covers proportional across breakpoints; squashing aspect ratio breaks the metaphor.
