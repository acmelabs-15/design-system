Decided 2026-09-19 by Peter.

# Consolidate Appbar and Topbar into App Bar

Provide one flexible App Bar family replacing Appbar and Topbar. Peter selected “One App Bar” over composed headers only. Preserve their useful identity, breadcrumb/navigation, search, start/centre/end and action arrangements through shared parts. Theme switching is optional content, not compulsory.

App Bar supplies a page/app header; Toolbar supplies coordinated action-control interaction. The header does not automatically own routes or become a Toolbar. The full Material and Pro comparison supports flexible content, not adoption of Material dimensions or scroll behaviours.

Exact parts, placement, sticky/overflow/responsive behaviour and composition with Sidebar/Toolbar remain inventory work. Update the docs application's existing Appbar consumer and account for Topbar's shared Shell styles in the migration.

Evidence: [closure source review](../analysis/codebase-systematization.md#phase-2-closure-review), [answers](../alignment/evidence/phase-2-closure-2026-09-19.json).
