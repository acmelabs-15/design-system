---
name: migration-between-releases
description: Update a consumer between explicit @acmelabs/design-system releases. Use when comparing installed and target versions, correcting outdated component names or props, or migrating matching React wrappers and examples.
license: MIT
metadata:
  library: "@acmelabs/design-system"
  library_version: "0.3.0"
  type: "sub-skill"
---

# Migration between releases

1. Record the exact installed core and React versions, the intended target release and the rendering framework. Read [release facts](../references/release.json); this skill describes only that packaged release.
2. Obtain the source release's own manifest and documentation and the target release's corresponding records. Compare public exports, tags, properties, attributes, slots, event names/detail/flags and native-content structure. A missing source release is an evidence gap, not permission to invent a migration.
3. Map each used API to the target's documented component or recipe. Preserve application semantics and state ownership. Use release change records when available, then verify them against the actual target package.
4. Change core, React wrappers, styles, browser URLs and optional tooling together to supported matching versions. Update all imports and complete examples in the consumer; avoid mixing release graphs.
5. Remove replaced code and behavior owners. Keep historical explanation in the migration record rather than leaving duplicate runtime interfaces in the updated application.
6. Verify a clean installation, type checks, native form submission/reset, keyboard behavior, route cleanup and representative rendered results. Run the consumer's tests and report exact versions and remaining gaps.

This first packaged guidance does not claim a historical release migration has been tested. Do not fabricate renamed APIs, compatibility aliases or an upgrade path from uninspected artifacts.
