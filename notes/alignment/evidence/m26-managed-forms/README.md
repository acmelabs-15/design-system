# Managed form completion

The final inventory audit found a missing F-10 deliverable: React had native form checks, but no delivered TanStack Form example. The Lit example also did not demonstrate nested fields and editable arrays.

Both examples now use the same component property/event contracts. TanStack Form owns the managed values and metadata. Controls retain native validity and FormData. The application owns disabled state and the submission receipt. The React example uses the official useForm/Field API from React Form 1.33.5, which uses the same Form Core 1.33.5 as the installed Lit controller.

## Evidence

The initial fresh archive consumer passes seven checks for each framework in each engine (42 total). It installs coordinated core/React archives, copies the actual example source, checks strict types, builds it in the independent application, and tests native required focus, managed errors, nested/array edits, native FormData, immediate submission, disabled/reset behavior and disposal/remount. [Initial results](initial-consumer-results.json).

A visual review then found clipped Remove labels at 320px. The row now uses Box's supported flexGrow/flexShrink/flexBasis/minWidth inputs to let the field shrink while preserving the action width. An eighth browser check measures the actual label range inside the native button. The corrected fresh consumer passes all eight checks per framework and engine (48 total). [Final consumer results](consumer-results.json). The [documentation action-label check](../m26-appearance/action-labels.json) now passes all six engine/appearance cases at 320px for both frameworks. Each label has 52px available for 52px of text. All six refreshed phone Forms screenshots were visually inspected and show the full Remove label; see [appearance evidence](../m26-appearance/README.md).

The Lit array initially used stable item IDs as renderer keys. Removing the first item left the surviving directive bound to contacts[1]. Installed @tanstack/lit-form 1.25.5 FieldDirective.update creates its FieldApi once and does not update fieldConfig afterward. The example now keys those field lifetimes by their index path; it retains the standard controller and bindField. React's field hook updates its name and supports the stable row keys used by that example. This is an application integration correction, not a second adapter or a patch to private state.

The source formatter also now handles TSX as TSX. The red formatter test rejected JSX with the former .ts parser; the corrected formatter and syntax-highlighter preserve the executable source and escape it safely. The managed-forms recipe reuses these exact examples and makes them available through the website, versioned skills and MCP records.

Harness corrections remain distinct from library defects: Field.invalid and Input.type are properties without required attribute reflection, so checks read their properties. Application forms have explicit accessible names; checks do not confuse them with the private native forms inside controls. A missing React docs registration was fixed in site/app/main.ts. The documentation census now rejects every undefined rendered HTML custom element, including docs-*.

## Reproduce

Prepare the coordinated archives, then run with the pinned Bun and configured browser runtime:

```sh
bun examples/forms/__tests__/managed.browser-check.ts
```

ACME_BROWSER_RUNTIME selects the Playwright installation; ACME_CHROMIUM_PATH optionally selects installed Chromium. The test uses its own loopback server and temporary consumer. It does not require the docs preview server.

Sources: [TanStack basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts), [arrays](https://tanstack.com/form/latest/docs/framework/react/guides/arrays), [UI integration](https://tanstack.com/form/latest/docs/framework/react/guides/ui-libraries), and the installed Lit FieldDirective and Form Core FieldApi implementations.
