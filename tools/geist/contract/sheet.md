# sheet: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Behavior) Outside-click does not auto-close, so always render an explicit close affordance and honor Escape.
- [ ] (Accessibility) Trap focus inside the sheet while it’s open and return focus to the trigger row on close so keyboard users keep their place in the list.
- [ ] (Accessibility) Provide a visible close button labeled `Close` (or an icon button with `aria-label="Close"`) since clicking outside doesn’t dismiss.
- [ ] (Accessibility) Announce the sheet with `aria-labelledby` pointing at the title; pair it with `aria-describedby` only when the body is short and load-bearing.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Sheet defaults to `modal=false` so toasts and other high-z elements stay reachable. Keep that default unless the sheet owns the screen.
- [ ] (Behavior) Pick `side` from the trigger location: a row inspector slides from `right`, a global filter from `left`. Don’t change sides mid-session.
- [ ] (Content) Title is Title Case and names the entity (`Deployment Details`, `Member Profile`), not the page action.
- [ ] (Content) Body is read-mostly: sentence case prose with Title Case sub-headings. Action buttons are optional; when present, follow `Verb + Noun`.
- [ ] (Content) Don’t duplicate the page header inside the sheet; the sheet is the detail layer.
