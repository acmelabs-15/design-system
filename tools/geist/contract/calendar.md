# calendar: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 19 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 16 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Trap focus inside the popover so Tab cycles day cells and presets instead of the page behind it.
- [ ] (Accessibility) Support arrow-key day navigation, `Shift` + arrow for week jumps, and `Page Up` / `Page Down` for month jumps.
- [ ] (Accessibility) Announce range changes through `aria-live="polite"` so a screen reader hears `From Apr 1 to Apr 28` after the second click.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Set `min` and `max` to the data window so users can’t pick outside the retention range.
- [ ] (Behavior) Default to the user’s locale and timezone; never silently render UTC for a US-Pacific viewer.
- [ ] (Behavior) Keep the trigger label as the chosen range (`Apr 1 – Apr 28, 2026`); don’t fall back to `Pick a date` once a value is committed.
- [ ] (Behavior) Persist the selected range when the popover closes and re-opens so users can tweak the end date without re-picking the start.
- [ ] (Accessibility) Each preset is a real button with a Title Case label (`Last 30 Days`); don’t mark presets as menu items without keyboard handling.
