# browser: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) The browser chrome is decorative and should carry `aria-hidden="true"`; meaning lives on the inner image or video.
- [ ] (Accessibility) Don’t add focusable dot controls or back/forward buttons; the chrome is a frame, and unreachable controls confuse keyboard users.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Match the variant to the surrounding theme: `light` chrome on light backgrounds, `dark` chrome on dark, so the frame doesn’t fight the page.
- [ ] (Behavior) For long URLs, use Middle Truncate inside the address bar so the host and path tail both remain visible.
- [ ] (Behavior) Lock the inner image aspect ratio so the chrome doesn’t reflow when an image is missing or slow to load.
- [ ] (Accessibility) Give the inner screenshot meaningful alt text describing what the user is seeing, not “browser screenshot”.
