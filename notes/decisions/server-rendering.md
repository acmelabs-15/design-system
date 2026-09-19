Decided 2026-09-19 by Peter.

# Exclude server-side rendering

Peter explicitly excludes server-side rendering from this design system. It is not a deferred milestone. Do not plan SSR exports, hydration work or a later SSR rollout.

Earlier SSR probes remain historical evidence. They do not create follow-up implementation work. This decision does not exclude server-side table filtering, sorting or pagination, or submitting forms to a server.

Evidence and historical results: [build investigation](../analysis/build-performance.md#ssr-readiness-measured-not-assumed).
