# textarea: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Read and judge — names an observable, but also carries guidance

- [ ] (Best Practices) Labels are short Title Case nouns (`Description`, `Release Notes`); placeholders show an example value, not instructions like `Enter a description`.
- [ ] (Best Practices) Render helper text as a sibling `<p>` linked through `aria-describedby`; sentence case, one sentence, with a period.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Pick `<Textarea>` for content that wraps to multiple lines (commit messages, descriptions, notes); use `Input` for a single value like a name or domain.
- [ ] (Best Practices) Set a generous default `rows` and grow only when the surface has vertical room; don’t let the field push primary actions below the fold.
- [ ] (Best Practices) Validate on blur and pass a string to `error` to render the inline message; the validation replaces helper text on failure.
- [ ] (Best Practices) Trim leading and trailing whitespace on submit so empty newlines don’t pass a `required` check.
- [ ] (Best Practices) Validation names the field and constraint, ends in a period, and skips `please` (`Description is required.`, `Release notes can’t exceed 500 characters.`).
