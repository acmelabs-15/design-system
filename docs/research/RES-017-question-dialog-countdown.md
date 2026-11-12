# Research 17: Question dialog countdown: cause and supported route

Status: historical research with dated implementation follow-ups. Converted 2026-10-21.

## Scope and current interpretation

This is a 2026-09-19–20 investigation of a specific desktop app build and its question renderer. It corrects the clock/wait attribution and records successful answer delivery without claiming the countdown disappeared. The approved maintainer workflow now follows brain's permitted question surface and keeps unanswered choices pending without an agent deadline. The old Plan-only route and local-skill preference below are historical selections, not current host or plugin routing.

The findings below retain their original research dates, source versions, measurements and verification limits. Statements about current code describe the checkpoint in their section. A proposal or source survey is not a decision or runtime acceptance. The [current handoff](../STATUS.md) owns unfinished work; the closed pass's phase gates and delegation do not apply to new work.

## Findings and dated evidence


Investigated 2026-09-19 after Peter supplied a screenshot showing a countdown on the question card's Skip button. Changing the assistant's waiting mechanism did not remove it. The earlier attribution to the clock/wait tool was wrong.

The installed desktop app is `/Applications/ChatGPT.app`, bundle identifier com.openai.codex, with bundled CLI 0.154.0-alpha.6.1. Read-only inspection of its app.asar shows the request auto-resolution manager bypassing requests whose `isBlocking` is true. Non-blocking requests can acquire a countdown through an inactivity policy even when no explicit auto-resolution duration is supplied.

The [standard question handler at CLI 0.154.0](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/core/src/tools/handlers/request_user_input.rs) sets `is_blocking` when the mode is Plan and leaves `auto_resolution_ms` unset. The [asynchronous handler](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/core/src/tools/handlers/request_user_input_async.rs) has only question titles/options, with no timeout-control argument. Peter's screenshot establishes that its rendered question card still has a countdown in this environment.

The walkthrough selected the standard blocking Plan-mode tool. The evidence did not support a sleep-loop fix or timeout argument, so the asynchronous route was not resumed at that checkpoint. The default-mode question feature is not an established solution: standard Default-mode requests are still non-blocking, and the app labels that feature as applying only to new tasks. No feature flag or app file was modified.

The code path is verified. Peter subsequently switched to Plan mode, and the standard question tool returned his animation clarification and icon choices. This establishes successful answer delivery; the absence of a visible countdown has not been independently confirmed by screenshot or explicit user report. The assistant cannot change its active collaboration mode itself. [Official app-server documentation](https://learn.chatgpt.com/docs/app-server#toolrequestuserinput) describes auto-resolution request metadata; the installed app's blocking check is the more specific evidence for this case.

The standard analyzer and three-browser choices were received before this troubleshooting interruption. Later blocking questions delivered the icon defaults, Zag, filtering, Steps, generated-style location, website output, selective loading and shadow choices recorded in the [historical pass](../history/systematization/pass-history.md). Peter left Plan mode to persist each batch. That capture reached the Phase 2 handoff. The old pass handoff then owned the active phase. Answered decisions remained valid through the troubleshooting interruption.

## Local skill and question formatting, 2026-09-19

Peter explicitly selected `/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/SKILL.md` instead of the cached plugin version. Its full text and `references/codex.md` were read. Both copies identify as 0.1.6, so the path, not the version string, identifies his chosen content. No plugin installation or global file edit was requested or performed.

Peter reports that the blocking dialog also displays long question fields as one paragraph, despite authored line breaks. This is user-observed rendering evidence; it is not proof of the renderer's internal cause. The offered schema has no rich-text, preview or layout switch. The response used a self-contained premise and separate option descriptions. It could not assume line breaks rendered or claim the host was fixed.

Follow-up handling also needed repair: answering a request for Chakra/Radix evidence did not settle the scrollbar choice. The correction required answering the clarification, returning to the pending choice, preserving its answer and continuing the decision walk. Describing the next question without asking it had stalled that walk. These repairs did not change the then-active source freeze or approval phases; those completed-pass procedures are historical.

## Formatting rule reapplied, 2026-09-20

Peter selected standard naming attributes, then again reported enormous unformatted question blocks. The assistant had sent a long multi-paragraph question despite the known rendering limitation above. This was failure to apply the saved guidance, not evidence that adding more line breaks would fix the card. The local skill and Codex reference were re-read in full.

Peter clarified that length was not the problem: a question could be long when the decision needed it. The correction used the selected local skill's layout rules at that checkpoint, with distinct subjects where supported and option consequences in separate descriptions. It kept research, recommendation and decision-relevant information in the question surface; supporting evidence notes did not replace necessary card context. It accounted for the reported renderer limit without assuming Markdown or line-break support, preserved necessary detail and retained answers received alongside criticism. Current plugin routing is owned by the approved workflow, not that old local-skill selection.

The next Box-span and Text-tag questions used compact premises and separate option trade-offs; both received answers. That establishes delivery and the selections, not screenshot verification of the renderer or a fix to the host. The walkthrough continued through the then-permitted blocking Plan-mode tool without an agent deadline. [Exchange record](../verification/systematization/primitive-interfaces-review-2026-09-20.json).

## Renderer investigation and continued use, 2026-09-20

Peter supplied [another screenshot](../verification/systematization/question-dialog-formatting-2026-09-20.png) after the assistant again put paragraph breaks and pseudo-headings into the question string. The dialog collapsed them into one block. Peter clarified that a wait-what repair must provide context, plain ASD-STE100 wording, visible organization and the full decision-relevant explanation inside the dialog. Commentary above the dialog is not an adequate substitute. His request changes presentation, not the required depth.

Read-only inspection of the installed app.asar traces the request through Ur in pending-request-item-panel-bd1ce6e9525b.js to k1 and s1 in app-primary-426732871368.js. The question is a string child of a div with normal whitespace handling, not a Markdown or HTML renderer. PBe renders option labels and descriptions in separate elements. The callable tool and [current upstream specification](https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/handlers/request_user_input_spec.rs) expose no rich-text, preview, custom renderer or layout parameter. This is a specific installed-renderer finding, not a claim about every host/version.

A Chrome 153 isolated reproduction of that text layout tested ordinary newlines, Unicode line and paragraph separators, Markdown and HTML. Neither Unicode separator produced the intended paragraph breaks; Markdown and HTML remained literal text. No experimental syntax was sent as a claimed live-dialog fix. The screenshot verifies the original defect; the reproduction tests explain candidate formatting failures, not end-to-end success of a new question surface. [Sources, test code and results](../verification/systematization/style-input-integration-review-2026-09-20.json).

Expanded web research checked the official app-server documentation, the current question schema and upstream issue/discussion searches. It found no documented formatting switch or verified workaround for this desktop dialog. MCP elicitation and MCP Apps are different integration routes; their existence does not prove that this task can render a custom question and resume correctly. No app bundle, plugin, skill or settings were modified. The evidence established neither a supported custom renderer for request_user_input nor the impossibility of every engineering solution.

Peter explicitly declined pursuing a new tool: “Forget it. Let's just keep going forward with what we have. Let's keep using this tool.” The walkthrough continued with the existing blocking Plan-mode route. Its supported question/option blocks carried shared context, evidence and recommendation in the question, with option consequences in their descriptions. HTML, Markdown and newline headings were not a verified structure mechanism. The repair preserved all information needed to choose and adjusted question scope when necessary, without claiming a renderer fix. Unanswered choices remained pending without an agent countdown.

The re-asked omitted-style-input choice received a reference-comparison request, not an answer. After Material Web, Chakra, Radix and Pro evidence was supplied, Peter selected “Preserve absence (Recommended).” That explicit answer closes the getter question; the formatting interruption does not erase it or approve a new tool.

## Sources and limitations

Source provenance: notes/analysis/question-dialog-countdown.md (the source path identifies the pre-migration record). The inline sources and saved evidence above retain their original scope. This conversion does not rerun their experiments.

- Clock/wait attribution was wrong.
- Answer delivery does not prove countdown absence or renderer repair.
- No verified workaround/custom renderer is claimed; not every solution is ruled impossible.
- Repair preserves decision-relevant detail and answers delivered beside criticism.
- Peter declined a new tool; current permitted surfaces still follow brain and unanswered choices remain pending.
