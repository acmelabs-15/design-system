# badge: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Set `title` for icon-only or ambiguous badges so screen readers announce the meaning. Don’t rely on color alone; the text has to be readable without it.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use Badge for short, scannable metadata that sits next to the thing it describes: status, plan tier, environment, or role. One badge per row; two side by side is a sign the row needs a second column.
- [ ] (Best Practices) For a colored dot without text, use `Status Dot`. For clickable filter chips that toggle a query, use the `pill` variant or a small `Button`.
- [ ] (Best Practices) Badges are static labels. Don’t wire `onClick` onto them; promote to a Button or link if the user can act on the value.
- [ ] (Best Practices) Keep badge content to text or `icon` + text. Never stack two icons or a child Badge inside a Badge.
- [ ] (Best Practices) Pair lifecycle badges (`Alpha`, `Beta`, `Early Access`) with a `Tooltip` that names the limit, like `Alpha: API may change before GA`.
- [ ] (Best Practices) Title Case, one word when possible, two max: `Active`, `Pending`, `Pro`, `Enterprise Trial`. Match the canonical API or log term: `Production` not `Prod`, `Deployed` not `Live`, `Canceled` not `Cancelled` (the Vercel API uses one L).
- [ ] (Best Practices) Don’t add a checkmark icon for success states or an X for errors; the variant carries that signal. Map meaning to color: `green` for healthy, `red` for error, `amber` for warning, `blue` for informational or production, `gray` for neutral. The `-subtle` suffix tones any of them down on dense surfaces.
- [ ] (Best Practices) Skip stuffing sentences inside (`Currently Active`, `You are on Pro`); the surrounding row supplies the context.
