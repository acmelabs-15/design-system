Decided 2026-09-21 by Peter.

# Finish the approved migration without further decision questions

Peter instructed: “No more questions. Just do all the things that you would recommend doing when you have a question. I just want you to finish.” The agent now resolves remaining implementation, interface and package choices by taking its best evidence-supported recommendation, records the choice and continues. This supersedes the question/approval pauses for those choices in this pass.

The approved inventory, migration scope, evidence standard and verification requirements still govern the work. New findings require investigation and an updated record. They do not require another interview. Continue through implementation, review and final acceptance; do not treat a completed subtask or a passing prototype as completion of the migration.

The immediate application is the recommended @lit/context dependency for theme discovery and subscription transport. TanStack remains the canonical state owner. See [theme architecture](theme-resolution-architecture.md).

## Default-true property attributes — 2026-09-21

Implementation choice under Peter's delegated execution: keep approved boolean property names and defaults, and use an explicitly string-valued HTML attribute where a true default must be turned off in static HTML. Separator's boolean `decorative` property defaults to true; `decorative="false"` opts into separator semantics. Omission restores true. Ordinary boolean attributes whose property defaults to false retain native presence/absence behavior; `disabled="false"` does not enable a control.

The original blanket rule forbidding false strings conflicts with approved default-true properties and static HTML authoring. Lit documents that a default-true property cannot be set false through a native boolean attribute and recommends renaming or a string/number attribute. Preserve the selected names and use the latter approach. Reuse the existing default-true converter; no second alias or negative flag. [Lit boolean attributes](https://lit.dev/docs/components/properties/#boolean-attributes). The Separator unit/manifest and three-engine checks are recorded in the [M07 evidence](../alignment/evidence/m07-separator-2026-09-21.json).
