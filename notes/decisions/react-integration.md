Decided 2026-09-19 by Peter.

# Publish React support as a separate package

Provide React integration as a separate package around the same Lit components, using @lit/react where appropriate. Peter selected a separate package after the framework-package survey. Package names, peer-version ranges and release coordination remain for the inventory and migration plan.

React 19 supports custom-element properties and events directly. Wrappers are justified by typed JSX, event mapping and authoring consistency, rather than a claim that React cannot render custom elements. The approved custom-elements-manifest analyzer remains the metadata source; using a wrapper generator must not silently replace it with another analyzer.

For Table, the [clarified consumer-owned scope](tanstack-table-compatibility.md) keeps React cell rendering in the consuming React application. Our component must permit its content, events, references and layout to work correctly. A bridge that runs React cell components through TanStack's Lit renderer is not a selected requirement. Peter also explicitly confirmed TanStack Virtual for both React and Lit virtualization. Final composition still needs browser verification. Server rendering is excluded by the [server-rendering decision](server-rendering.md).

Evidence: [Lit practice review](../analysis/lit-practice-review.md#phase-1-extension-react-and-forms) and [package-layout survey](../analysis/repository-layout.md#phase-1-extension-framework-packages).
