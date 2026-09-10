# snippet: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 2 time(s), so at least one demo here is interactive.

- [ ] onClick — wired in 1 example. Our equivalent: 
- [ ] onCopy — wired in 1 example. Our equivalent: 
- [ ] onKeyDown — wired in 1 example. Our equivalent: 

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use Snippet for a runnable shell command the user is meant to copy. For inline tokens (env var names, paths) use `InlineCode`, and for multi-line source use `CodeBlock`.
- [ ] (Best Practices) Pass the command as `text`. Authors never type a leading `$`; the component renders the prompt, so `text="$ vercel deploy"` displays as `$ $ vercel deploy`.
- [ ] (Best Practices) Set `prompt={false}` for non-shell content (URLs, JSON, output you want copied verbatim) so the rendered string matches what gets copied.
- [ ] (Best Practices) Pair `placeholder` with `text=""` for an empty state. Sentence case, no trailing period, no `Please`: `Run vercel link to fetch env vars`. The placeholder is informational, not copied.
- [ ] (Best Practices) Use `copyText` only when `text` contains rich nodes (`<span>` highlights, conditional fragments) and the clipboard payload should be plain text. For a string `text`, `copyText` is redundant.
- [ ] (Best Practices) Keep one command per Snippet. Pass an array to `text` for a short multi-line block; for longer scripts, switch to `CodeBlock` so users can read before they copy.
- [ ] (Best Practices) Use `copied` plus an `onCopy` callback when a parent surface (a card, a tooltip) needs to show the same checkmark feedback while copying different text.
