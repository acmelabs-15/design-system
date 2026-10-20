# Example watcher regression

Verified 2026-09-26 with Bun 1.4.2. `scripts/dev.ts` now watches `examples/` alongside its existing style, source and site inputs. Example edits rebuild the library and documentation without regenerating styles. Child scripts still use the running Bun executable.

The regression starts a copy of the actual dev server on an ephemeral port. The fixture starts with generated CSS present; its documentation build imports an example module. The test edits only that example and reads the served HTTP page. It also checks that style generation ran zero times.

- Before the change, the new test fails: the page remains `initial` (`red.log`).
- After the change, all four watcher tests pass, with 17 assertions (`green.log`). Existing authored CSS, generated-file edits, failed style generation and numeric-token regeneration behavior remain covered.
- Targeted Oxfmt and Oxlint checks pass for `scripts/dev.ts` and its adjacent test.

No real core/docs build runs in this fixture. It does not use port 4180 or change the active preview server. The fix adds the missing authored input; it does not suppress generated-file events or change build scheduling.

## Development server path boundary

A second bounded check uses only a harmless temporary fixture `private.txt` beside `_site`. Before the fix, `/..%2fprivate.txt` returns HTTP 200 and its sentinel contents. Malformed percent encoding returns HTTP 500. This is recorded in `traversal-red.log`; no real user or credential file was accessed.

The server now decodes with error handling, rejects null bytes, resolves the requested path and requires it to remain under `_site` before reading a file or applying the deep-link fallback. Invalid encoding and escaping paths return HTTP 400. The server binds explicitly to `127.0.0.1`.

`traversal-green.log` records all six dev tests passing, with 30 assertions. The added checks verify two encoded traversal forms, malformed encoding, null bytes, deep-link fallback, real asset delivery, missing asset HTTP 404, and unchanged `Cache-Control: no-store`. Targeted Oxfmt and Oxlint pass. The containment check is lexical; this test does not create or establish a guarantee for deliberately authored symlinks that point outside the build output.
