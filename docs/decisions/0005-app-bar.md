# Consolidate Appbar and Topbar into App Bar

Provide one flexible App Bar family replacing Appbar and Topbar. Peter selected “One App Bar” over composed headers only. Preserve their useful identity, breadcrumb/navigation, search, start/centre/end and action arrangements through shared parts. Theme switching is optional content, not compulsory.

Decided 2026-09-19 by Peter.

App Bar supplies a page/app header; Toolbar supplies coordinated action-control interaction. The header does not automatically own routes or become a Toolbar. The full Material and Pro comparison supports flexible content, not adoption of Material dimensions or scroll behaviours.

Exact parts, placement, sticky/overflow/responsive behaviour and composition with Sidebar/Toolbar remained inventory work at selection time. The migration included the docs application's Appbar consumer and Topbar's shared Shell styles.

Evidence: [closure source review](../research/06-codebase-systematization.md#phase-2-closure-review), [answers](../verification/systematization/phase-2-closure-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
