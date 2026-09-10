# switch: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Always provide a `label` on every `Switch.Control`, even when an `icon` carries the meaning, so screen readers announce the option. The component renders it as `geist-sr-only` for icon-only controls.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use Switch as a segmented selector for 2–3 mutually exclusive options that show different views of the same surface, like `Source` vs `Output`.
- [ ] (Best Practices) For a boolean on/off setting, use `Toggle`. Switch implements radio semantics, so two options stay mutually exclusive rather than reading as a checkbox.
- [ ] (Best Practices) Past 3 options or when labels grow beyond a couple of words, switch to `Tabs` or a `Select`.
- [ ] (Best Practices) Pass a `name` so the underlying radios are grouped; without it, more than one option can appear selected at once.
- [ ] (Best Practices) Set `defaultChecked` (or controlled `checked`) on exactly one `Switch.Control` so the group has a defined initial state.
- [ ] (Best Practices) Pad each `Switch.Control` so the widest label fits without the active pill resizing on selection. Test with the longest copy in the set.
- [ ] (Best Practices) Title Case each `Switch.Control` label. Keep labels to one or two words and parallel: `Source` / `Output`, not `Source` / `Show output`.
- [ ] (Best Practices) Pair an icon-only Switch with a `Tooltip` on each control so sighted users get the same label assistive tech receives.
