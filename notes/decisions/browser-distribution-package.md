Decided 2026-10-20 by Peter.

# Separate package modules from browser delivery

This is an implementation choice under [Peter's execution delegation](execution-delegation.md). npm rejects the combined core0.3.0 archive with E415 because it contains185,977 files. Keep package modules and types in @acmelabs/design-system. Publish the existing browser module graph, bundles, styles and notices in the coordinated @acmelabs/design-system-browser package. Use the new browser package in CDN examples and generated consumer guidance.

Both distributions come from the same source and build. Preserve every icon, artwork style, selective import, registration function, worker and shared runtime identity. The browser graph does not become a second runtime implementation. Core's production allowlist excludes browser-only output; the browser package has its own explicit delivery allowlist.

Keep individual class and icon-record declarations. Six closed artwork export patterns resolve types through their existing symbol records. Exact definition and registration exports use shared declarations with the same empty or registration-function interfaces. Those declarations import the real public component and icon type indexes, restoring native tag inference for definition-only consumers. Rewrite declaration-only aggregation imports accordingly. Do not emit declaration maps that point to source files absent from the archive.

This increases TypeScript's declaration loading for a definition import but preserves selective runtime loading. It avoids an8MB export map and keeps invalid runtime entry names invalid in TypeScript. Projections are about55,400 core files and54,900 browser files; actual packed counts and consumer checks remain required.

Every archive must fit the60,000-entry project budget, counted the same way as npm's pinned tarball reporter. This is a conservative project threshold, not a claim about npm's exact current limit. Add the check to packing and release validation.

The corrected coordinated release is0.3.1. The existing0.3.0 tag, archives and published companions remain immutable. The [failure record](../alignment/release-0.3.0.md#core-registry-rejection-too-many-files) and [recovery plan](../alignment/release-0.3.1.md) hold the evidence and execution status.
