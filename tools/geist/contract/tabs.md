# tabs: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 10 time(s), so at least one demo here is interactive.


## Assert in a test — names something a test can observe

- [ ] (Behavior) Selecting a tab is instant; don’t trigger network confirmation or toast on tab change.
- [ ] (Behavior) Reflect the active tab in the URL (query param or path) so deep-links and refresh restore state.
- [ ] (Behavior) Disable individual tabs only for permission or empty-state reasons; pair the disabled tab with a `tooltip` that names the constraint.
- [ ] (Accessibility) Keep Left/Right arrows moving focus across tabs and Enter/Space activating; don’t hijack with global shortcuts.
- [ ] (Accessibility) Label the tablist with `aria-label` when no visible heading sits above it (`aria-label="Sections"`).
- [ ] (Accessibility) Maintain a visible focus ring on the active tab; don’t suppress focus styles for visual polish.

## Read and judge — names an observable, but also carries guidance

- [ ] (Content) `tabs[].title` is Title Case, 1–2 words, and names the destination noun (`Overview`, `Logs`, `Settings`). Verbs belong on buttons; `View Logs` is wrong on a tab.
- [ ] (Content) `tabs[].tooltip` is sentence case and explains the constraint (`Only visible to project owners.`), not the tab’s purpose.

## Guidance — read it, apply judgement, no test

- [ ] (Content) Don’t append a count to the title (`Logs (12)`); use a badge slot instead and drop the badge at zero.
