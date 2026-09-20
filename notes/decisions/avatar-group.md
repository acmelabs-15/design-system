Decided 2026-09-19 by Peter.

# Keep Avatar Group for member limits and remaining counts

Keep Avatar Group in the Avatar family, composing general Group for shared appearance and arrangement. Peter selected **Keep Avatar Group** over replacing it with a composed example.

Its distinct responsibility is presenting a bounded set of people and the count of those not individually shown. The current house implementation provides member limits and remaining counts; Geist documents a limit. Chakra's generic Group and AvatarGroup do not own that counting, and its overflow example calculates it in application code. Retaining the family component avoids repeating that logic.

Exact member inputs, count conventions, empty collections, accessible names, dynamic updates, overlap settings and any overflow interaction remain for the inventory. Keeping the component does not adopt a menu, retain every current property or certify the current implementation.

Evidence: [Group and specialised-family review](../analysis/codebase-systematization.md#comprehensive-chakra-group-review), [Group evidence](../alignment/evidence/group-review-2026-09-19.json), [general Group decision](group-presentation.md). Source changes remain behind Phase 5 approval.
