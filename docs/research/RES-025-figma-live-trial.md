---
id: RES-025
status: in-progress # in-progress | resolved
kind: task
from: IDEA-002#16
date: 2026-11-12
---
# RES-025: Live trial of one component through the Figma MCP

## Question
What does a live trial of one component made through the Figma MCP show: the number of calls, the manual cleanup, the errors, whether `use_figma` counts against the rate limit, and whether a Starter account can write to its own drafts?

## Answer
Not answered yet. Steps 1 to 4 are done except the small write test, which is now part of step 5. Step 5 runs.

Progress:

- 2026-11-12: Peter reports that he created the team "ACME Labs" under a Figma account he already had on his personal Gmail address, and bought the Professional plan for it. Not stated: monthly or annual billing, and his seat type. The team link is not in this repo, because it holds account identifiers.
- 2026-11-12: the agent started the Figma sign-in and gave Peter the approval link. The Figma tools are not available yet, so the approval is still open.
- 2026-11-12: Peter reports that he created a Figma access token and stored it in 1Password, beside an older Figma entry. The MCP sign-in does not use a token. The token is for Figma's REST API and may serve rows 08 and 09. It is not in this repo and was not shown in chat.
- 2026-11-12: Peter approved the sign-in. The Figma tools are available. `whoami` answers: a Full seat and the admin role on the plan "ACME Labs", tier `pro`. The same account also has a Starter team; the trial does not touch it.
- 2026-11-12: step 5 started. A sub-agent named `trial-idea002-16` builds the trial component in a new draft file of the ACME Labs plan. It runs on the session's model, so that the result shows what the route can do at its best. Its progress file is `.artifacts/v1/trial/IDEA-002-16-progress.md` and its result file is `.artifacts/v1/trial/IDEA-002-16-result.md`; both are scratch files outside git.
- 2026-11-12: Peter corrected the model. The first sub-agent was stopped after two Figma calls (`whoami`, `create_new_file`). The trial file exists; its key is in the scratch progress file. A second sub-agent, `trial-idea002-16b`, continues in that file on Opus 5.5 at medium effort, as `docs/agents/capabilities.md` requires.
- Consequence: the question "can a Starter account write to its own drafts" can no longer be tested with this account. It stays unanswered unless a second, free account is used.

The three findings on account email and team ownership come from search excerpts of the named help articles, not from full reads of the pages. UNVERIFIED: whether Figma accepts a Gmail address as a work email address for the Organization upgrade.

Completion condition: one component with variants, component properties and variable bindings exists in a Figma draft file, made through the remote Figma MCP. This record then states the number of tool calls, each error, the manual cleanup that was necessary, the answer on the rate limit and the answer on Starter drafts.

Planned steps:

1. Peter creates a free Figma account (Starter) for ACMElabs. ACMElabs has no work email address yet (Peter, 2026-11-12), so he signs up with his personal Gmail address, with email and password and not with Google sign-in, and names the team ACMElabs. Only Peter can do this step. The findings below show that the email address and the team owner can change later. RES-024 finds that a self-serve upgrade to Organization needs an account with a work email address.
2. Peter says so. The agent starts the Figma sign-in of the installed plugin, and Peter approves it in the browser.
3. The agent makes one read call and one small write call to a draft file. This shows whether a Starter account can write to its own drafts. Starter allows 20 read calls each month, so the agent counts every call here.
4. If Starter cannot write: Peter buys the Professional plan with one Full seat and monthly billing (RES-024: $20 for each month). Only Peter can do this step.
5. The agent builds the trial component in a draft file, in the order that the `figma-generate-library` skill gives: variables first, then the component set.
6. The agent writes the results here and sets the outcome.

Safe to repeat: steps 2, 3 and 5, on a draft file only. Step 4 is a purchase; do not repeat it.

## Findings
- The email address of a Figma account can be changed in the account settings. An account that uses Google sign-in must first switch to email and password; after that the email can change to any address. Source: https://help.figma.com/hc/en-us/articles/360039820114-Manage-email-address-or-password, checked 2026-11-12.
- The current owner of a team can transfer ownership to another team member. Source: https://help.figma.com/hc/en-us/articles/360039481134-Transfer-ownership-of-a-team, checked 2026-11-12.
- Figma has a procedure to transfer a team to another plan. Source: https://help.figma.com/hc/en-us/articles/10250387712407-Transfer-a-folder-or-team-to-another-plan, checked 2026-11-12.

## Follow-ups
None.

## Next action
Wait for the sub-agent `trial-idea002-16b`. Then read its result file in full, copy the measured facts into this record (step 6) and set the outcome. If the sub-agent stopped early, continue step 5 from its progress file, in the same trial file.
