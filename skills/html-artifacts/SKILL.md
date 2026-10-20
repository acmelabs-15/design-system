---
name: html-artifacts
description: Build standalone HTML artifacts with @acmelabs/design-system browser modules. Use for CDN-only pages, no-build demos and HTML examples that need working imports, tokens, forms or navigation.
license: MIT
metadata:
  library: "@acmelabs/design-system"
  library_version: "0.3.0"
  type: "sub-skill"
  framework: "html"
---

# HTML artifacts

1. Read [release facts](../references/release.json) and match the exact CDN package version. Read the selected component and HTML recipe records from that release's index.
2. Copy the complete HTML example, including token CSS, definition imports, explicit helper imports and application-owned setup. Keep every CDN URL on the same exact version and shared browser module graph.
3. Use selective `dist/cdn/define/<name>.js` modules for registration. Import configuration helpers from the release's browser configuration entry. A class module alone does not register markup. The full-library and standalone entries include heavy component code; choose them only when that cost is intended.
4. Put primitive attribute values in markup. Set property-only values, arrays, objects and callbacks in a module script using the contract in the generated record. Check the documented HTML conversion as well as the property type; a boolean property does not imply native boolean-attribute rules.
5. Give each example a local root. Query inside it and keep application event handlers in one setup function. Return a cleanup function for listeners, timers, observers and app-owned resources; invoke it before resetting or removing the example.
6. Preserve native forms, headings, links, tables and lists where the recipe requires them. Name controls and provide accessible labels.
7. Open the actual HTML in a browser. Confirm module and asset requests succeed, submit the form or activate the navigation, and check the resulting outcome. A screenshot alone does not prove interaction.

## HTML false values

Native boolean attributes use presence and absence. For example, `disabled="false"` still disables a control; remove `disabled` to enable it.

Some documented component attributes accept the string `"false"` to turn off a default-true setting. Keep valid markup such as Separator `decorative="false"` and Video `controls="false"`. Video also accepts `autoplay="false"` to override its preference-based omitted default. Read the release record for each attribute rather than apply either rule to every component. JavaScript property bindings use actual boolean values.

Use the same packaged release reference for every lookup. If that release lacks an example or API, state the gap rather than substitute current online documentation silently.
