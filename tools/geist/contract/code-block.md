# code-block: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 4 time(s), so at least one demo here is interactive.


## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Always pass a `language`/`syntax` (`tsx`, `bash`, `json`, `diff`). Highlighting is the primary reason to choose `<CodeBlock>` over a plain `<pre>`.
- [ ] (Behavior) Highlight only the lines under discussion. A block where every line is highlighted reads the same as no highlight at all.
- [ ] (Behavior) Mark added or removed lines with the `diff` syntax or the dedicated added/removed props. Faking them with `// added` comments breaks copy-paste.
- [ ] (Behavior) Show the filename header when the snippet has a paste destination (`app/page.tsx`, `vercel.json`). Omit it for ephemeral examples.
- [ ] (Content) Snippets stay runnable. Don’t paraphrase real code into pseudo-syntax, and don’t prepend `$` to shell commands. `<Snippet>` already renders the prompt, so `text="$ vercel deploy"` doubles to `$ $ vercel deploy`.
- [ ] (Content) Keep prose around the block in sentence case and put backticks around CLI flags inline (`` `--prebuilt` ``).
