# command-menu: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 6 time(s), so at least one demo here is interactive.

- [ ] onClick — wired in 3 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) Trap focus inside the overlay while it’s open and return focus to the previously active element on close.
- [ ] (Accessibility) Use `aria-live="polite"` on the result count so screen readers hear how the list narrows as the user types.
- [ ] (Accessibility) Up/Down arrows move highlight, Enter activates, Escape closes. Backspace at an empty input pops the page stack.
- [ ] (Accessibility) Display each item’s `keybind` as a `Kbd` slot so the shortcut is discoverable to sighted users and announced as a label to screen readers.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Bind `⌘K` on macOS and `Ctrl+K` elsewhere. Don’t reuse the binding for any in-page filter input; it’s a global shortcut.
- [ ] (Behavior) Open into the root page; preserve the search query when navigating back from a sub-page so the user’s typing isn’t lost.
- [ ] (Behavior) Show a recent or default item set when the input is empty so the menu is useful before typing.
- [ ] (Content) `<CommandMenu.Item>` children are Title Case verb phrases (`Deploy Project`, `Invite Team Member`). Avoid navigation phrasing like `Go to project page`; CommandMenu commands act, not browse.
- [ ] (Content) `CommandMenuPage.label` is Title Case and names the scope (`Projects`, `Team Settings`).
- [ ] (Content) `CommandMenuPage.placeholder` is sentence case, action-oriented, and ends with `…` (`Search projects…`, `Type a command or search…`). Bare `Search…` is wrong because it doesn’t name the scope.
- [ ] (Content) `<CommandMenu.Group heading>` is Title Case, 1–2 words (`Actions`, `Recent`).
