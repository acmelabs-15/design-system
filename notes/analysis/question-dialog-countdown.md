# Question dialog countdown: cause and supported route

Investigated 2026-09-19 after Peter supplied a screenshot showing a countdown on the question card's Skip button. Changing the assistant's waiting mechanism did not remove it. The earlier attribution to the clock/wait tool was wrong.

The installed desktop app is `/Applications/ChatGPT.app`, bundle identifier com.openai.codex, with bundled CLI 0.154.0-alpha.6.1. Read-only inspection of its app.asar shows the request auto-resolution manager bypassing requests whose `isBlocking` is true. Non-blocking requests can acquire a countdown through an inactivity policy even when no explicit auto-resolution duration is supplied.

The [standard question handler at CLI 0.154.0](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/core/src/tools/handlers/request_user_input.rs) sets `is_blocking` when the mode is Plan and leaves `auto_resolution_ms` unset. The [asynchronous handler](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/core/src/tools/handlers/request_user_input_async.rs) has only question titles/options, with no timeout-control argument. Peter's screenshot establishes that its rendered question card still has a countdown in this environment.

Use the standard blocking question tool in Plan mode for the walkthrough. Do not resume the asynchronous question route, claim that a sleep loop removes the UI countdown, or add an unsupported timeout argument. The default-mode question feature is not an established solution: standard Default-mode requests are still non-blocking, and the app labels that feature as applying only to new tasks. No feature flag or app file was modified.

The code path is verified. Peter subsequently switched to Plan mode, and the standard question tool returned his animation clarification and icon choices. This establishes successful answer delivery; the absence of a visible countdown has not been independently confirmed by screenshot or explicit user report. The assistant cannot change its active collaboration mode itself. [Official app-server documentation](https://learn.chatgpt.com/docs/app-server#toolrequestuserinput) describes auto-resolution request metadata; the installed app's blocking check is the more specific evidence for this case.

The standard analyzer and three-browser choices were received before this troubleshooting interruption. Later blocking questions delivered the icon defaults, Zag, filtering, Steps, generated-style location, website output, selective loading and shadow choices linked from the [current handoff](../alignment/README.md). Peter left Plan mode to persist each batch. The walkthrough is now at the Phase 2 handoff; preserve answered decisions rather than re-asking them.

## Local skill and question formatting, 2026-09-19

Peter explicitly selected `/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/SKILL.md` instead of the cached plugin version. Its full text and `references/codex.md` were read. Both copies identify as 0.1.6, so the path, not the version string, identifies his chosen content. No plugin installation or global file edit was requested or performed.

Peter reports that the blocking dialog also displays long question fields as one paragraph, despite authored line breaks. This is user-observed rendering evidence; it is not proof of the renderer's internal cause. The offered schema has no rich-text, preview or layout switch. Use a compact, self-contained premise and the separately rendered option descriptions for the comparison. Do not keep sending a long structured field on the assumption that newlines render, or claim the host is fixed.

Follow-up handling also needed repair: answering a request for Chakra/Radix evidence did not settle the scrollbar choice. The assistant should answer the clarification, return to that choice through the tool, preserve the submitted answer, and continue with the next supported decision. Do not end repeatedly with a description of the next question instead of asking it. These communication corrections do not alter the project's source freeze or approval phases.
