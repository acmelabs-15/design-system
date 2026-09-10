# menu: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

- [ ] onClick — wired in 21 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) Close on item activation, Escape, and outside-click. Don’t auto-close on a hover-out.
- [ ] (Behavior) Use `MenuItemLocked` for permission-gated actions so the lock icon and disabled state explain why the row is inert.
- [ ] (Accessibility) Up/Down arrows move focus through items, Home/End jump to first/last, Enter or Space activates.
- [ ] (Accessibility) Return focus to the trigger on close so keyboard users keep their place in the row.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Open on click, not hover; hover-open menus collide with screen readers and trackpad scrolls.
- [ ] (Behavior) Position auto-flips based on window bounds; don’t hardcode a side that clips on narrow viewports.
- [ ] (Content) Item children are Title Case `Verb + Noun` (`Rename Project`, `Duplicate Deployment`). Bare verbs like `Rename` or `Edit` are wrong outside obvious single-object context.
- [ ] (Content) End an item with `…` only when activating it opens a follow-up dialog (`Rename…`, `Transfer to Team…`).
- [ ] (Content) Group destructive items at the bottom, separated by a divider, and keep the destructive copy as `Verb + Noun` (`Delete Project`, never bare `Delete`).
- [ ] (Content) Section headers (`MenuSection title`) are Title Case, 1–2 words (`Workspace`, `Recent Projects`).
- [ ] (Accessibility) Typeahead jumps to the next item whose label starts with the typed character; keep the visible label first so typeahead matches what the user sees.
