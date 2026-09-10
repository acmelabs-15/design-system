# keyboard-input: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Best Practices) `children` is one key, digit, or named key (`K`, `7`, `Enter`, `Esc`). Don’t lowercase it, don’t spell out modifiers inside, and don’t pack a sentence into the element.
- [ ] (Best Practices) Punctuation lives outside the element: `Press <Kbd meta>K</Kbd> to open the command menu.` Period, comma, and `or` separators stay in surrounding prose so screen readers don’t announce them as keys.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use `<Kbd>` for shortcut hints inside prose, menu items, and button suffixes. In long-form docs that narrate a shortcut, write `the ⌘ K shortcut` directly so the page renders the same when copied to plain text.
- [ ] (Best Practices) Pass modifiers via boolean props (`meta`, `shift`, `alt`, `ctrl`). The component swaps `⌘` for `Ctrl` on Windows and Linux, so hard-coding `<Kbd>Cmd+K</Kbd>` ships the wrong glyph to half your users.
- [ ] (Best Practices) Use `small` inside dense surfaces like menu rows, command-bar items, or table cells where the default size crowds adjacent text.
