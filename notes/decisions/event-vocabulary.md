Decided 2026-09-19 by Peter.

# Use shared meaning-based event names

Keep the acme- prefix and use common event names for common meanings across families. Peter selected “Shared meaning-based names” over family-specific public names. Distinguish live input from a committed change, and action requests from state notifications or completed transitions.

A composed component reports one public notification for one action. The existing language-switcher record demonstrates why forwarding and redispatching the same event can duplicate a change.

This selects naming semantics, not final payload schemas or exact timing. Define cancellation, bubbling/composition, programmatic versus user changes, transition phases and value shapes in the inventory. Internal coordination events and public events must be classified deliberately.

Evidence: [terminology record](../alignment/terms.md#events), [past duplicate-event evidence](compose-the-language-switcher.md#the-defect-this-introduced-and-its-fix), [answer](../alignment/evidence/phase-2-closure-2026-09-19.json).
