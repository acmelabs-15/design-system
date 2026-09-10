# split-button: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Set `menuButtonLabel` to a screen-reader sentence that names the action set, like `More deploy options`. It becomes the `aria-label` on the dropdown trigger and is the only label a screen reader hears for that button.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use a Split Button when one action is the clear default and 1–4 close variants belong next to it, like `Deploy` paired with `Deploy to Preview`. For unrelated actions, use a `Menu` instead.
- [ ] (Best Practices) Mirror the primary action as the first item in the dropdown so keyboard users and screen readers get the same options. The visible button label and the first item must match exactly.
- [ ] (Best Practices) Restrict the primary `type` to `default` or `secondary`. The API blocks the destructive variants on purpose, since hiding a delete inside a dropdown is a sharp edge.
- [ ] (Best Practices) Title Case every menu item label and follow `Verb + Noun`: `Deploy to Production`, `Promote to Production`, `Rollback Deployment`. Group destructive items at the bottom with a divider.
- [ ] (Best Practices) Default `menuAlignment="bottom-start"` aligns the menu under the primary button; switch to `bottom-end` only when the button sits flush with the right edge of its container.
