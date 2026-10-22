# Use shared meaning-based event names

Keep the acme- prefix and use common event names for common meanings across families. Peter selected “Shared meaning-based names” over family-specific public names. Distinguish live input from a committed change, and action requests from state notifications or completed transitions.

Decided 2026-09-19 by Peter.

A composed component reports one public notification for one action. The existing language-switcher record demonstrates why forwarding and redispatching the same event can duplicate a change.

This selects naming semantics, not final payload schemas or exact timing. Cancellation, bubbling/composition, programmatic versus user changes, transition phases and value shapes belong to the component contracts. Internal coordination events and public events must be classified deliberately.

Evidence: [terminology record](../design/component-vocabulary.md#events), [past duplicate-event evidence](0017-compose-the-language-switcher.md#the-defect-this-introduced-and-its-fix), [answer](../verification/systematization/phase-2-closure-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
