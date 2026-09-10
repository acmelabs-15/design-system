# context-menu: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

- [ ] onClick — wired in 8 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) Close on activation, Escape, and outside-click. Don’t close on hover-out.
- [ ] (Accessibility) Up/Down arrows move focus, Enter/Space activates, Escape closes and returns focus to the row.

## Read and judge — names an observable, but also carries guidance

- [ ] (Content) Items follow the same rules as `Menu`: Title Case `Verb + Noun` (`Open in New Tab`, `Copy URL`, `Delete Deployment`). Bare verbs are wrong.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Bind to right-click on desktop and long-press on touch. Suppress the native browser menu only on the trigger area, not the whole page.
- [ ] (Behavior) Position the menu at the pointer; if it would overflow the viewport, flip horizontally then vertically before clipping.
- [ ] (Content) End with `…` only when activating opens a follow-up dialog (`Rename…`, `Move to Folder…`).
- [ ] (Content) Group destructive items at the bottom with a divider and keep the destructive label `Verb + Noun`. `Delete` alone never ships.
- [ ] (Accessibility) Trigger the keyboard menu key (`Shift+F10` on Windows/Linux, the menu key, or platform equivalent) to open the same menu without right-click.
- [ ] (Accessibility) Don’t bury destructive items behind nested submenus. One level deep keeps keyboard navigation predictable.
