# note: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) A Note is persistent until the underlying state changes; don’t add an ad hoc dismiss control because it competes with the message.
- [ ] (Behavior) One Note per concept. Stacking three Notes on a card means the page architecture, not the Note copy, is wrong.
- [ ] (Behavior) The optional `NoteAction` holds a single inline CTA. Don’t pair it with a second button.
- [ ] (Content) `NoteLabel` is a 1–2 word Title Case prefix that names the topic: `Region Change`, `Rate Limit`, `Plan Limit`. Cut hedges like `Heads Up`, `FYI`, and `Note`.
- [ ] (Content) `NoteContent` is one sentence in active voice that names the impact: `Changing this region restarts all functions.`
- [ ] (Content) No `variant="info"` exists; omit `variant` for the default info icon or use `variant="secondary"` for neutral copy.
- [ ] (Content) Single-fragment labels take no period; full descriptive sentences in the body do.
