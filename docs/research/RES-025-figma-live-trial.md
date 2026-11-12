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
Not answered yet. No step has run.

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
Step 1: Peter creates the free Figma account for ACMElabs (personal Gmail address, email and password, team named ACMElabs) and says so.
