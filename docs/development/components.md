# Component implementation

Read this guide before changing a component interface, behavior or composition. Read its current specification and applicable decisions through the [specification index](../../spec/README.md).

## Interfaces and state

Use the glossary's component names and the approved interface. Prioritize self-consistency, then Lit and web-component conventions, then familiarity to reference users. Historical port parity does not override approved adaptations.

Completed replacements remain final. Current source, exports and consumer documentation expose the selected interface without retired aliases, legacy modes or fallback implementations. Future API scope is decided separately. Publication does not establish measured usage or a permanent compatibility policy.

TanStack owns canonical state. Use `StoreSelector` for render observation and `StoreEffect` for non-render consequences. Lit and React share the same behavior. React wrappers do not create a second implementation. Applications retain the selected Table, Virtual and Form responsibilities described in [stack guidance](stack.md).

Preserve approved property and enum names, including platform-name corrections. Generic REST naming examples do not rename a Lit interface. Link-capable actions use `href`; follow the current Button contract.

## Composition and browser behavior

Wrappers keep real boxes. Do not use `display: contents` on wrappers. Use native content where semantics require it. Components own their positioning context; a documentation harness must not supply missing production behavior.

Read a composed component's actual variants, slots, parts and event contract before adapting it. Avoid duplicate notifications according to that contract; there is no universal event-suppression rule. Shadow styles use supported properties and the component's public styling surface.

Keep required reactive-controller registrations even when a field appears unused. Snapshot live collections before mutation. Test slot behavior in a real browser. Preserve native form submission, submitter identity, reset, validity and focus behavior where the component contract requires them.

Focus rings belong to the component that owns the interaction. Follow the [focus-ring decision](../decisions/0041-focus-ring-ownership.md), including its qualifications. Use the shared [start/end place model](../decisions/0099-start-and-end-places.md). Book's state and animation requirements remain in its [motion decision](../decisions/0065-motion-on-the-book.md); its historical census method is not a universal animation rule.

## Styling and source boundaries

Default typography uses Google Sans Flex for text and Google Sans Code for numbers, labels and code. Custom themes retain their approved override contract. Use component class names and authored interfaces; preserve the selected appearance, density, motion, shape and direction contracts in the [foundations specification](../../spec/SPEC-foundations.md).

Keep Geist identity out of source code, comments and JSDoc under `src/`. Put reference provenance in research and decision records. [Reference guidance](reference-sources.md) explains the source-selection obligations and citation location. Another organization's brand identity is not a design-system capability.

CSS changes use the owning producer described in [style guidance](styles.md). A removal or rename reaches the actual source, styles, registration, exports, metadata, examples and callers. Check platform name collisions and owned internal parts. Do not infer completion from an import search or a generated summary alone.

These constraints preserve [parity-scope decisions](../decisions/0077-parity-scope.md), [canonical state](../decisions/0101-state-on-tanstack-store.md) and the completed systematization resolutions. Verification requirements live in [verification guidance](../agents/verification.md).
