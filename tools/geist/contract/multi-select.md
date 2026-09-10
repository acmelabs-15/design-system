# multi-select: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 6 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 3 examples. Our equivalent: 
- [ ] onClick — wired in 3 examples. Our equivalent: 
- [ ] onSelectAll — wired in 3 examples. Our equivalent: 
- [ ] onSelectOnly — wired in 3 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Keyboard Navigation) **Up/Down arrows**: Navigate between rows while maintaining checkbox/button focus state
- [ ] (Keyboard Navigation) **Left/Right arrows**: Switch between checkbox and button focus within the current row
- [ ] (Keyboard Navigation) **Tab**: Focus away from the menu (natural tab behavior)
- [ ] (Keyboard Navigation) **Enter/Space**: Execute actions based on current focus (checkbox toggle or button click)
- [ ] (Behavior) Keep checkbox focus and button focus distinct so Up/Down navigates rows and Left/Right toggles between the row’s checkbox and action button.
- [ ] (Accessibility) Each row checkbox needs an `aria-label` that names the item (`Select us-east-1`); a bare `Select` is unanchored for screen readers.
- [ ] (Accessibility) Trap focus inside the menu while it’s open and return focus to the trigger on close.
- [ ] (Accessibility) Announce bulk actions (`Select All`, `Select Only`) through the visible button label so the action matches what the screen reader speaks.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Show the selected count in the trigger (`3 regions selected`); show the single name when only one is picked.
- [ ] (Behavior) Use controlled mode when state lives in the URL or syncs to the server so the trigger label and stored value stay in lockstep.
- [ ] (Behavior) For empty filters, render `No {items} match "{query}"` rather than `No results`.
- [ ] (Accessibility) The trigger button needs a stable accessible name even when zero items are selected; don’t rely on the placeholder alone.
