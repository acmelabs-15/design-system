---
id: DEC-006
migrated: 0.8
kind: architecture
decided: 2026-10-21
---
# Keep Avatar Group for member limits and remaining counts

Keep Avatar Group in the Avatar family, composing general Group for shared appearance and arrangement. Peter selected **Keep Avatar Group** over replacing it with a composed example.

Decided 2026-09-19 by Peter.

Its distinct responsibility is presenting a bounded set of people and the count of those not individually shown. The implementation inspected on 2026-09-19 provided member limits and remaining counts; Geist documents a limit. Chakra's generic Group and AvatarGroup do not own that counting, and its overflow example calculates it in application code. Retaining the family component avoids repeating that logic.

Exact member inputs, count conventions, empty collections, accessible names, dynamic updates, overlap settings and any overflow interaction were still unspecified at selection time. Keeping the component does not adopt a menu, retain every current property or certify the current implementation.

Evidence: [Group and specialised-family review](../research/RES-006-codebase-systematization.md#comprehensive-chakra-group-review), [Group evidence](../verification/systematization/group-review-2026-09-19.json), [general Group decision](DEC-045-group-presentation.md).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../specs/SPEC-003-design-system/spec.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
