# phone: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Treat the chrome as decorative (`aria-hidden="true"`); accessible naming belongs on the inner screenshot.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Match the variant to the surrounding theme so the chrome doesn’t outshine the screenshot it’s framing.
- [ ] (Behavior) Lock the inner image aspect ratio to a real device ratio (typically 19.5:9 for modern phones) so the bezel doesn’t crop content.
- [ ] (Behavior) Avoid stacking shadows on the parent container; the Phone chrome already has its own elevation and additional shadow stacks read as a halo.
- [ ] (Accessibility) Give the inner image alt text describing the screen content (`Vercel dashboard on iPhone`), not the device.
- [ ] (Accessibility) For autoplay video inside the frame, respect `prefers-reduced-motion` and provide a paused poster fallback.
