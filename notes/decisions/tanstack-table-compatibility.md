Decided 2026-09-19 by Peter.

# Support consumer use of TanStack Table

Peter clarified that the design system must not integrate or run TanStack Table. Our Table must provide the structure, appearance, custom content and interaction access that let a consuming application connect TanStack Table easily. Evaluate the complete capability set and feature combinations, not just sorting and pagination.

The application creates the TanStack Table instance and owns its data processing, state, sorting, filtering, pagination and worker use. TanStack Table is not selected as a design-system runtime dependency. Consumer examples and compatibility checks may use it. Earlier research phrased a house Table adapter as the intended outcome; that was the agent's misinterpretation, corrected by Peter on 2026-09-19.

The current Table uses TanStack Virtual but exposes a limited rows/columns interface. Its lack of a TanStack Table import is not a defect. The gaps are the restrictions on consumer control of headers, cells, rows, layout, measurement and interactions. Compatibility remains a target, not a verified claim.

## Framework rendering and virtualization

Consumers retain their framework's rendering for custom content: React renders React cells; Lit renders Lit cells. A design-system bridge that runs React cell components through TanStack's Lit renderer is not required by this decision. Exact Table markup, slots, references and events remain for the architecture and inventory reviews.

Peter explicitly confirmed **TanStack Virtual for both Lit and React virtualization**. For Table, the application connects the appropriate framework integration; our Table exposes the scrolling element, measurement targets and layout controls it needs. This does not select a second virtualization engine or fix the final interface.

## Experimental workers and compatibility limits

Peter initially selected inclusion of experimental worker support, then clarified the consumer-owned scope. That selection now means consumers can use the experimental plugin with our Table; the design system does not create, recover or terminate their workers. Examples/checks must make experimental status and failure behaviour clear. It is not the default path or a stable upstream guarantee.

The investigated packages were table-core, lit-table and react-table 9.2.4. This is a research baseline, not a selected future version pin. Stock features, custom extensions, client/manual server processing and virtualization need consumer compatibility coverage. Experimental features and future releases retain their own status. Server-side data processing stays possible; [server-side rendering is excluded](server-rendering.md).

Evidence and the capability checklist: [codebase analysis](../analysis/codebase-systematization.md#phase-1-extension-table-compatibility).
