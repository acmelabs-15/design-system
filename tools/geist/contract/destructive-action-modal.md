# destructive-action-modal: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 9 time(s), so at least one demo here is interactive.

- [ ] onCancel — wired in 4 examples. Our equivalent: 
- [ ] onClick — wired in 4 examples. Our equivalent: 
- [ ] onConfirm — wired in 4 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) The verification input gets focus on open so the user can start typing immediately. Submit stays disabled until the value matches `verificationPhrase` exactly.
- [ ] (Behavior) Enter submits only when the gate is open; it's a no-op otherwise. Cancel, outside-click, and Escape all dismiss.
- [ ] (Accessibility) The verification input is associated with its prompt via `aria-labelledby` + `htmlFor`. Screen readers announce the full prompt (`To confirm, type "delete my-project"`) on focus.
- [ ] (Accessibility) The Warning icon in the irreversibility band is `aria-hidden`; the sentence carries the meaning so nothing is announced twice.
- [ ] (Accessibility) Focus stays inside the modal across an `error` transition so the user can retry without losing context. After success, return focus to the trigger.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) `loading` disables both buttons. The caller owns `open` — do not self-dismiss from `onConfirm`. Close the modal after the API settles (success or error), or keep it open on error so the user can retry.
- [ ] (Behavior) Pair the post-confirm success toast verb 1:1 with the primary button: `Delete Project` button, `Project deleted` toast. Never `Project removed`.
- [ ] (Content) `title` is Title Case, `Verb + Noun`, a statement — never a question. `Delete Project`, not `Delete this project?`.
- [ ] (Content) `description` is sentence case, names the consequence, and interpolates the specific resource when relevant. `<b>my-project</b> and all its deployments will be permanently deleted.` reads stronger than `This project and all its deployments will be deleted.`.
- [ ] (Content) `confirmLabel` matches the title 1:1. Never generic (`Confirm`, `OK`, `Continue`), never a bare verb (`Delete`).
- [ ] (Content) `cancelLabel` defaults to `Cancel`. Override when Cancel is ambiguous, such as `Keep Turn Running` when the primary action is itself a cancellation.
- [ ] (Content) `verificationPhrase`: for entity deletes, type the **resource name itself** (`my-project`) and pair with `verificationLabel="project name"` so the prompt reads `To confirm, type the project name "my-project"`. That's the canonical signal that the user knows which thing they're acting on. Fall back to a lowercase verb phrase (`disable vercel authentication`) only when there's no entity to name.
- [ ] (Content) `irreversibleDescription` names the specific action and resource and ends with `cannot be undone.` — `Deleting my-project cannot be undone.` rather than the generic `This cannot be undone.`. Omit the prop entirely for reversible actions; the prop's absence is the signal, not a falsy value.
- [ ] (Content) `error` surfaces the API failure verbatim in Vercel voice: `Couldn't save settings. Try again.`. Never dump a raw error object.
