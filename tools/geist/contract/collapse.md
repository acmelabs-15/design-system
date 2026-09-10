# collapse: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Behavior) Don’t nest Collapse more than one level deep. Two-level nesting hides too much and breaks the keyboard tab path.
- [ ] (Accessibility) The trigger is a `<button>` with `aria-expanded` that flips on toggle and `aria-controls` pointing at the panel id.
- [ ] (Accessibility) Enter and Space toggle. Don’t bind any other key globally; arrow keys move focus inside the panel content.
- [ ] (Accessibility) Render the panel content in the DOM when closed (with `hidden` or visibility) so search and find-in-page still hit it; lazy-render only for expensive content.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Default state is closed unless the first-time visitor must read the content to act.
- [ ] (Behavior) Inside a `CollapseGroup`, allow only one panel open at a time when items are mutually exclusive; allow multiple when items are independent.
- [ ] (Behavior) Animate the open/close transition; jump-cuts make the page feel like it teleported.
- [ ] (Content) Heading is Title Case and names the topic, not the action (`Advanced Settings`, not `Show Advanced Settings`).
- [ ] (Content) Body is sentence case prose with normal section formatting; treat the panel as a small page, not a tooltip.
- [ ] (Content) Don’t put primary destructive actions inside a closed Collapse; the user has to click twice to reach the warning.
