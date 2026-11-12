---
id: RES-025
status: resolved # in-progress | resolved
outcome: answered
kind: task
from: IDEA-002#16
date: 2026-11-12
---
# RES-025: Live trial of one component through the Figma MCP

## Question
What does a live trial of one component made through the Figma MCP show: the number of calls, the manual cleanup, the errors, whether `use_figma` counts against the rate limit, and whether a Starter account can write to its own drafts?

## Answer
The trial passed on 2026-11-12. One component set "Button" exists in a draft file of the plan "ACME Labs" (Professional, Full seat), made through the remote Figma MCP. Trial file: https://www.figma.com/design/IDZGIYgjCi97TKQgecNVO4

Completion condition: one component with variants, component properties and variable bindings exists in a Figma draft file, made through the remote Figma MCP, and this record states the calls, the errors and the cleanup. That part is met. Two parts of the question stay open; see "Not answered".

### Measured

| Measure | Result |
|---|---|
| Figma calls in total | 11: `use_figma` 5 (3 write, 2 read), `whoami` 2, `create_new_file` 1, `create_session` 1, `get_metadata` 1, `get_screenshot` 1 |
| Time | About 4 minutes for the 9 calls of the second agent |
| Model | Calls 1 and 2: first agent, on the session's model. Calls 3 to 11: Opus 5.5. The launch asked for medium effort, but the session log shows `xhigh` on every request |
| Errors, refusals, time-limit failures | None. Every call returned a result on its first attempt |
| Rate-limit messages | None |
| AI credits | None spent |

### What exists in the file

- A variable collection "Trial tokens" with the modes Light and Dark and 13 variables: 8 colours, 2 radii, 3 spacing steps. Each has scopes and a WEB code syntax.
- A component `Icon/Plus` and a component set `Button` with 12 variants: Variant (Solid, Outline) × Size (Small, Medium) × State (Default, Hover, Disabled). Every variant uses auto layout.
- Three component properties: Label (TEXT), Show icon (BOOLEAN) and Icon (INSTANCE_SWAP).
- Variable bindings: a read script found 0 unbound fills, strokes, paddings, gaps and radii in the 12 variants. Instances in an explicit Dark mode resolve to the Dark values.
- A Review frame with 12 instances in Light and 12 in Dark.

### Defects and cleanup

1. Found and fixed through the MCP: each Outline variant was 2 px larger than its Solid counterpart, because new auto-layout components include strokes in the layout.
2. The variant grid has uneven gaps and no row or column labels.
3. Not bound to variables: the label font and its sizes, the Outline stroke weight, the icon size and the icon stroke width. The file has no text style.
4. The icon colour is an override on the nested instance. The trial did not test whether it survives a swap to another icon.
5. In Dark mode the disabled Solid button is hard to see on the dark ground. This is a fault of the trial token values.
6. The page keeps its default name, and the icon component sits alone on the canvas.

### Limits of this evidence

- The agent judged its own output from a screenshot and from structure reads. No person has inspected the file yet.
- A Button is a simple component. The trial has no nested slots, no overlay and no motion.
- `get_metadata` shows no component properties and no variable bindings. Their check needs a `use_figma` read script.
- Not tried, by the rules of the trial: library publication and a second file. Not tried at all: an icon swap, and the `get_libraries` and `search_design_system` tools.

### Not answered

- UNVERIFIED: whether `use_figma` counts against the rate limit. Eleven calls brought no rate-limit message, which settles nothing.
- Whether a Starter account can write to its own drafts. The account is on Professional, so the trial could not test it. The decision in IDEA-002#02 does not need it.

### Progress

- 2026-11-12: Peter created the team "ACME Labs" under a Figma account he already had on his personal Gmail address, bought the Professional plan for it, and stored a Figma access token in 1Password. The MCP sign-in does not use the token.
- 2026-11-12: Peter approved the Figma sign-in. `whoami` answers: a Full seat and the admin role on "ACME Labs", tier `pro`.
- 2026-11-12: a first sub-agent on the session's model made two calls and was stopped on Peter's correction. A second sub-agent, `trial-idea002-16b`, on Opus 5.5, finished the trial and reported a pass. Its launch asked for medium effort; the session log shows that it ran at `xhigh`.

## Findings
- The email address of a Figma account can be changed in the account settings. An account that uses Google sign-in must first switch to email and password; after that the email can change to any address. Source: https://help.figma.com/hc/en-us/articles/360039820114-Manage-email-address-or-password, checked 2026-11-12.
- The current owner of a team can transfer ownership to another team member. Source: https://help.figma.com/hc/en-us/articles/360039481134-Transfer-ownership-of-a-team, checked 2026-11-12.
- Figma has a procedure to transfer a team to another plan. Source: https://help.figma.com/hc/en-us/articles/10250387712407-Transfer-a-folder-or-team-to-another-plan, checked 2026-11-12.
- The component set "Button" has 12 variants and the properties Label (TEXT), Show icon (BOOLEAN) and Icon (INSTANCE_SWAP). Source: https://www.figma.com/design/IDZGIYgjCi97TKQgecNVO4, checked 2026-11-12.
- A read script found 0 unbound fills, strokes, paddings, gaps and radii in the 12 variants, and the Dark mode resolves to the Dark values. Source: the trial agent's result file `.artifacts/v1/trial/IDEA-002-16-result.md` (scratch, outside git), checked 2026-11-12.
- The trial used 11 Figma calls with no error, no refusal, no time-limit failure and no rate-limit message. Source: the trial agent's result file `.artifacts/v1/trial/IDEA-002-16-result.md` (scratch, outside git), checked 2026-11-12.
- New auto-layout components include strokes in the layout, which made the Outline variants 2 px larger until a script set `strokesIncludedInLayout` to false. Source: the trial agent's result file `.artifacts/v1/trial/IDEA-002-16-result.md` (scratch, outside git), checked 2026-11-12.

## Follow-ups
- Does a `use_figma` call count against the MCP rate limit of the seat? It matters when many components are built in one day.
- Does an icon colour override survive an instance swap? The first real component with an icon can show it.

## Next action
None.
