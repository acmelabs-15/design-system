---
name: react-integration
description: Use the generated @acmelabs/design-system-react wrappers with React 19. Use when writing JSX, binding typed custom events and refs, rendering conditional or native content, or debugging wrapper lifecycle.
license: MIT
metadata:
  library: "@acmelabs/design-system"
  library_version: "0.2.0"
  type: "sub-skill"
  framework: "react"
---

# React integration

1. Match both the core and React package versions to [release facts](../references/release.json). Read the relevant component declaration and React recipe; use its wrapper export name and import path.
2. Import individual wrapper modules from `@acmelabs/design-system-react/components/<name>`. They register the same underlying elements. The package root imports every wrapper, including the icon catalog.
3. Use public property names as JSX props. Declared custom event callbacks use the generated names, such as `onAcmeChange`; the callback receives the native event and typed detail. Read methods and read-only state through a ref to the actual custom element.
4. Keep children owned by React. For controlled content mounting use the documented `renderContent` or `renderFallback` prop; return React nodes. The underlying component controls the mounting point and timing.
5. Preserve native content from the recipe: a real table, list, definition list or legend where required. Video's unassigned source and track children enter its native video element; named fallback content remains separate.
6. Removing a prop restores its declared default or absence. A later render reapplies supplied inputs after an imperative change. Use the component's public events for controlled state updates rather than install a second behavior implementation.
7. Verify callback replacement, ref identity, controlled updates and unmount cleanup in a browser. Include Strict Mode when the application uses it. The wrappers use the global custom-element registry and support browser rendering; server rendering is outside this contract.

Consult forms-and-accessibility for form ownership and data-layouts for table/virtualization examples.
