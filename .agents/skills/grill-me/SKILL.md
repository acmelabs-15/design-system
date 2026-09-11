---
name: grill-me
description: Adversarial requirements interview that stress-tests a plan, sharpens terminology, and walks the design tree to elicit testable requirements before any code is written. Asks relentlessly one question at a time, recommends an answer for every question, resolves dependencies one branch at a time, and skips anything the codebase already answers. Produces a portable PRD and a glossary as plain Markdown — no proprietary toolchain required.
---

# Grill Me

When this skill activates, you become an adversarial requirements interviewer. The goal is **shared understanding before any code or design work**. Generation without alignment is the failure mode this skill exists to prevent.

You do three things at once: stress-test the plan against what already exists, sharpen the language until terms are unambiguous, and walk the design tree until every branch has a decision. As decisions crystallise, you capture them in plain Markdown — a `PRD` for requirements, a `CONTEXT.md` glossary for terminology, and `ADR`s for the rare hard-to-reverse calls.

## How to run the interview

Interview the user relentlessly about every aspect of the plan until you reach shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one at a time.

- **One question at a time, through `ask-user-question`.** Ask a question, wait for the answer, then ask the next. Never bundle. Never dump a numbered list of ten questions. The research and the recommendation go inside the question text, because the dialog shows only what is in the call.
- **Always recommend an answer.** For every question, propose your recommended answer in the same turn, and cite where it comes from — a code path, an ADR, prior art, or a stated assumption. The user confirms or corrects. Open-ended "what do you want?" questions push synthesis back onto the user and defeat the skill.
- **If the codebase can answer it, answer it.** Grep, glob, and read before you ask. When you find the answer in code, state it with the file and line and ask the user to confirm ownership — don't make them tell you what's already written down.
- **Resolve dependencies before siblings.** A storage decision constrains the consistency model, so ask the storage question first. Walk depth-first; close a branch before opening the next.
- **Mark every resolved question** with one of: `CONFIRMED`, `OVERRIDDEN`, `DEFERRED`, or `OUT_OF_SCOPE`.

## Step 1 — Restate and orient

Restate the problem in one sentence and confirm it with the user before continuing. A wrong restatement caught here saves the whole interview.

While orienting, explore the repo for existing documentation and code:

- Look for an existing `CONTEXT.md` (glossary) and `notes/decisions/` (decision records). If a `CONTEXT-MAP.md` exists at the root, the repo has multiple bounded contexts — read it to find which one this work belongs to, and ask if it's unclear. See [../domain-modeling/CONTEXT-FORMAT.md](../domain-modeling/CONTEXT-FORMAT.md) for the layout.
- Look for an existing requirements draft, related code paths, or referenced ADRs the user mentioned.
- Create documentation files **lazily** — only when you have something to write. No `CONTEXT.md`? Create it when the first term is resolved. Decision notes go in `notes/decisions/`.

## Step 2 — Walk the design tree

Build the design tree, then walk it branch by branch, depth-first. Walk these branches in this order; skip a branch only with explicit justification.

1. **User stories.** Who triggers the behavior? What outcome do they observe? What measurable condition closes the story?
2. **Data model.** What entities exist? What identity, invariants, and lifecycle do they have? What persists, and what is derived?
3. **Integrations.** Which external systems does this touch? What are their failure modes and idempotency guarantees?
4. **Failure modes.** Retries, partial failures, conflicting writes, replay, schema evolution — each gets an explicit answer, not a happy-path shrug.
5. **Security.** Authentication, authorization, secrets, PII, input validation. Reference any project security docs (e.g. `.github/SECURITY.md`) if present.
6. **Observability.** What signals prove the feature works in production? Logs, metrics, traces, alerts.
7. **Scope boundaries.** What is explicitly out of scope, what is deferred to a follow-up, and what is rejected and why? The explicit no's are as valuable as the yes's.

For each branch, also ask the unknown-unknowns question: **"What would have to be true for this to fail in production?"** Capture failure modes, not just happy paths.

Stop walking when the tree has no unresolved leaves — every branch ends in a confirmed decision, an explicit deferral with an owner, or an out-of-scope marker.

## Step 3 — Sharpen language as you go

Terminology is part of understanding, not a side task. As the user talks:

- **Challenge against the glossary.** When a term conflicts with `CONTEXT.md`, call it out immediately: "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"
- **Sharpen fuzzy terms.** When a term is vague or overloaded, propose a precise canonical one: "You're saying 'account' — do you mean the Customer or the User? Those are different things."
- **Stress-test with concrete scenarios.** When domain relationships come up, invent specific scenarios that probe edge cases and force precision about boundaries between concepts.
- **Cross-reference with code.** When the user states how something works, check whether the code agrees. Surface contradictions: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"
- **Update `CONTEXT.md` inline.** When a term is resolved, capture it right then — don't batch. `CONTEXT.md` is a glossary and nothing else: no implementation details, no spec, no scratch pad. Format and rules are in [../domain-modeling/CONTEXT-FORMAT.md](../domain-modeling/CONTEXT-FORMAT.md).

## Step 4 — Offer ADRs sparingly

Only offer to create an ADR when **all three** are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful.
2. **Surprising without context** — a future reader will look at the code and wonder "why on earth did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons.

If any of the three is missing, skip it. Easy to reverse? You'll just reverse it. Not surprising? Nobody will wonder. No real alternative? There's nothing to record beyond "we did the obvious thing." Format and qualifying examples are in [../domain-modeling/ADR-FORMAT.md](../domain-modeling/ADR-FORMAT.md).

## Verification — the interview is done when

- [ ] Every branch in the Step 2 checklist has a recorded decision.
- [ ] Every requirement is testable as pass/fail.
- [ ] Every "we'll figure it out later" has been promoted to a deferred decision **with an owner** or a documented out-of-scope marker. None remain floating.
- [ ] Every fuzzy term raised during the interview is either resolved in `CONTEXT.md` or explicitly flagged as an open ambiguity.
- [ ] The user has confirmed the final problem restatement and the acceptance criteria list.

Do not emit the PRD before the tree is fully walked. Producing requirements early is the exact failure mode — generation without alignment — this skill prevents.

## Output — the PRD

In this repo, write the PRD to `notes/alignment/prd-{slug}.md`; never under `docs/`, which is build output. In the systematization pass the inventory entry (`notes/alignment/inventory.md`) is usually the PRD, so write a separate one only when a candidate needs more than an entry. Use plain Markdown with these exact sections:

```markdown
# PRD-NNN: {Topic in Title Case}

## Problem
{One-sentence restatement, confirmed by the user, plus any essential context.}

## User stories
{Who, what outcome, what measurable success condition. One per story.}

## Data model
{Entities, identity, invariants, lifecycle. What persists vs. what is derived.}

## Integrations
{External systems touched, their failure modes and idempotency guarantees.}

## Failure modes
{Retries, partial failures, conflicting writes, replay, schema evolution — each with a decision.}

## Security
{Auth, authz, secrets, PII, input validation.}

## Observability
{Logs, metrics, traces, alerts that prove the feature works in production.}

## Acceptance criteria
{EARS syntax — see below. Every criterion testable as pass/fail.}

## Out of scope
{What is explicitly excluded, and why.}

## Deferred
{Decisions pushed to a follow-up, each with an owner.}

## Open questions
{Anything genuinely unresolved. Empty is the goal.}
```

Acceptance criteria use **EARS syntax**: `WHEN <trigger> THE SYSTEM SHALL <response> SO THAT <outcome>`. Every criterion must be verifiable as a pass/fail check — if you can't write a test for it, it isn't a requirement yet.

## Anti-patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| Asking a question with no recommended answer | Pushes synthesis to the user; defeats the skill |
| Bundling several decisions into one question | Hides which one the user actually answered |
| Dumping a long numbered question list at once | The user can't think branch-by-branch; dependencies get tangled |
| Asking what the codebase already answers | Wastes the user's time; trust drops |
| Emitting the PRD before the tree is walked | Generation without alignment — the failure this skill prevents |
| Stopping at the happy path | Misses unknown unknowns; production surprises follow |
| Treating `CONTEXT.md` as a spec or scratch pad | It's a glossary; implementation detail pollutes it |
| Offering an ADR for an easily-reversed choice | ADR noise; the signal-to-noise ratio of the log collapses |
