---
name: lit-integration
description: Integrate @acmelabs/design-system with Lit templates and lifecycle. Use when binding component properties or events, managing native content, mounting conditional content, or cleaning up Lit consumers.
license: MIT
metadata:
  library: "@acmelabs/design-system"
  library_version: "0.2.0"
  type: "sub-skill"
  framework: "lit"
---

# Lit integration

1. Match the installed core version to [release facts](../references/release.json). Read the selected declarations and Lit recipe records in that release's index.
2. Import individual `@acmelabs/design-system/define/<name>` entries and the token stylesheet for ordinary registration. Class exports are inert; use them only with explicit or scoped registration that the consumer actually configures.
3. Bind object, array and callback inputs as properties. Use the exact documented public events and their native detail types. Check each event's flags rather than assume that every event crosses a shadow boundary.
4. Let the component own its documented state and behavior. Parent state supplies inputs and handles public events; it does not mirror internal focus, selection, validation or overlay machinery.
5. Follow the recipe's native-content structure for Table, List, Data List, Fieldset and media. Use the documented content-renderer APIs for lazy or conditional content; let the component decide when that content mounts.
6. When a template supplies styling inputs, preserve the supported ordered-input helper contract from the release. Later template renders can reapply supplied values after an imperative write.
7. Dispose app-owned subscriptions, effects and controllers when the consumer disconnects. Test reconnect as well as removal, because reused elements must start observing again.
8. Compile and run the actual consumer. Check property updates, public event detail, native form submission where relevant, and removal cleanup.

Load forms-and-accessibility or data-layouts for those responsibilities. This package's browser contract does not include server rendering.
