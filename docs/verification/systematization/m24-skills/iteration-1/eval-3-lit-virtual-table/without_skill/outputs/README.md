# Baseline consumer evaluation

Run from this directory using the already installed parent dependencies:

```sh
bun build app.ts --target browser --outdir .
bun serve.ts
```

Open http://localhost:4311. `bun verify.ts` runs Chrome verification. Typecheck with:

```sh
bun /Users/peterkloss/Dev/ACMElabs/design-system/node_modules/typescript/bin/tsc --project tsconfig.json
```

`result.json` holds the final evaluation and attempt history. All nine browser checks pass. The application owns 10,000 records, the TanStack Table instance, the TanStack Virtual instance, native table markup, selection, sort/filter state, pagination requests and keyboard focus. The design-system Table supplies the viewport and styling. The Lit controllers clean up on disconnect.

Evidence: strict typecheck passes with skipLibCheck false; a 10,000-row page renders 12 rows at its far end and reaches record-9999. Control+End moves logical cell focus to row 9999. Chrome AX names include Application records, Record pages and Show. Disconnect clears the virtualizer scroll element and changing table state while detached does not render. Reattaching the same instance resumes rendering.

The baseline used the matching virtualized-table JSON recipe and public declarations. It did not read consumer SKILL.md guidance or other evaluation directories. No dependencies or repository files were changed.

Failures are preserved. Initial authoring had one syntax and one nullable-lookup error. The first browser test assumed a native select; the actual control is a custom combobox. The second run exposed a consumer event-handler bug: a descendant Select also emits acme-request with action close. The corrected handler accepts only page and page-size actions. No installed package defect blocked this run.
