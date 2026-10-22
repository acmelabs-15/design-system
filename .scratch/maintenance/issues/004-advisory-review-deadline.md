# Renew the reviewed dependency evidence

Status: ready-for-agent
Type: task
Owner: maintainer review
Due: 2026-11-20

## Evidence and scope

The [dependency audit](../../../scripts/dependency-audit.ts) has exact reviewed dispositions with a 2026-11-20 deadline. Their fingerprints, dependency paths, severity and advisory identity are part of the proof. The [regression tests](../../../scripts/__tests__/dependency-audit.test.ts) reject expired or changed evidence.

This is a review task, not a standing exemption. The migration's passing check does not extend the deadline or approve future dependency changes.

## Completion

Run the audit and its proof cases with the selected Bun runtime. Review current advisories and exact installed paths. Fix or explicitly resolve new findings through the applicable workflow. Save dated evidence before changing a disposition or its deadline.

Any package or product change follows its approved scope. Preserve rejection of unknown, changed or expired findings.

## Comments

2026-10-21: carried forward with the existing deadline and verification strength.
