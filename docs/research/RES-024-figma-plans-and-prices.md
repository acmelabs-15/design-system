---
id: RES-024
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-002#15
date: 2026-11-12
---
# RES-024: Figma plans, seats and prices for each capability

## Question
Which Figma plan and seat does each capability need, and what does each cost today?

## Answer
Sufficient answer: one table of Figma's current plans and seat types against the capabilities below, with each cell sourced and dated. The capabilities are sign-up limits, Figma's MCP server, variables and modes, libraries, the Variables REST API, plugins, Dev Mode, Code Connect and prices. Disagreements between sources and pages dated before 2026 are recorded. The record gives facts, sources and disagreements only. It gives no recommendation.

The condition is met. All sources were read on 2026-11-12. Prices are in USD and exclude sales tax and VAT.

### Plans and seats against capabilities

| Capability | Starter (free) | Professional | Organization | Enterprise | Seat | Sources |
| --- | --- | --- | --- | --- | --- | --- |
| Price of a Full seat, each month | Free | $20 with monthly billing; $16 with annual billing | $55, annual billing only | $90, annual billing only | Full | P |
| Price of a Dev seat, each month | No paid seats | $15 monthly; $12 annual | $25, annual only | $35, annual only | Dev | P |
| Price of a Collab seat, each month | No paid seats | $5 monthly; $3 annual | $5, annual only | $5, annual only | Collab | P |
| Price of a View seat | Not applicable | Free | Free | Free | View | P, B1, B2 |
| Billing unit and term | No billing | One seat for each person; monthly or annual | One seat for each person; annual, quarterly invoices for added seats | Same as Organization | All paid seats | BG, B1, B2 |
| Minimum number of seats | Not applicable | None stated; "any number" of seats | None stated; "any number" of seats | None stated; "any number" of seats; sold only through the sales team | All paid seats | B1, B2, U |
| How to buy | Sign up | Self-serve, credit card | Self-serve with a work email address, or the sales team | The sales team only | Not applicable | U |
| Files and folders | Unlimited drafts; one team with one folder; 3 Figma Design and Sites files, 3 FigJam files, 3 Slides files | Unlimited files and folders in one team | Multiple teams, unlimited folders | Multiple teams and workspaces, unlimited folders | Not applicable | S, C, PO |
| Pages in one file | 3 in a team file | Unlimited | Unlimited | Not stated in the pages article | Not applicable | G |
| Collaborators | Unlimited co-editors on the 3 team files; drafts can be shared with view access only | Unlimited members and collaborators | Not stated in the pages read | Not stated in the pages read | Not applicable | Q, S, PO |
| MCP server, tools that read | 20 tool calls each month | 200 each day and 10 each minute | 200 each day and 15 each minute | 600 each day and 20 each minute | Full or Dev for the paid-plan limits; View and Collab get 20 each month on every plan | M, P |
| MCP server, write to canvas | Not in the list of plans | Yes, free in beta | Yes, free in beta | Yes, free in beta | Full to write outside drafts; Dev writes in drafts only; edit access to the file; remote server only | W, MF, MI |
| MCP desktop server | No | Yes, read only | Yes, read only | Yes, read only | Full or Dev | MI, MD |
| Variables | Yes | Yes | Yes | Yes | Full to edit design files | V1, P, SE |
| Variable modes for each collection | Not included | Up to 10 | Up to 20 | Unlimited with extended collections | Full to edit design files | C, P |
| Export and import of modes as JSON in Figma Design | Not in the list of plans | Yes | Yes | Yes | Not stated | V2 |
| Publish a library of components, styles and variables | No | Yes; no choice of destination | Yes, to a team or the organization | Yes, to a team, a workspace or the organization | Edit access to the library file | L, LG, P |
| Use a library in other files | No | Yes | Yes | Yes | Edit access to the file that uses it; view access to the library | LA, LG |
| Publish a design file to the Figma Community | Yes | Yes | Yes | Yes | Edit access to the file | CF |
| Variables REST API, read | No | No | No | Yes | Organization member with view access; one sentence says Full seat | R1, R2, P |
| Variables REST API, write | No | No | No | Yes | Full seat or admin, with edit access | R1, R2, P |
| Other REST API endpoints (files, components and styles) | Yes, low limits: Tier 1 up to 20 each month | Yes: Tier 1 at 10 each minute | Yes: Tier 1 at 15 each minute | Yes: Tier 1 at 20 each minute | Full or Dev for the paid-plan limits | RL, P |
| Run community plugins | Yes, not in Dev Mode | Yes | Yes | Yes | Full for Figma Design; Dev for Dev Mode; Collab for FigJam and Slides only | PR |
| Build a classic plugin for development | Yes | Yes | Yes | Yes | Not stated; needs the desktop app | PD, PB |
| Publish a plugin to the Figma Community | Yes | Yes | Yes | Yes | Not stated; needs review and two-factor authentication | PP |
| Publish a plugin privately | No | No | Yes | Yes | Any organization member | PP, PI, P |
| Dev Mode | No | Yes | Yes | Yes | Full or Dev; Collab and View get basic inspection | D, SE, S |
| Code Connect | No | Yes: one active library and one active framework | Yes: unlimited libraries, multiple frameworks | Yes: unlimited libraries, multiple frameworks | Full or Dev | CC, P |

Calculated from the monthly amounts above: a Full seat on Professional with annual billing is 12 × $16 = $192 for one year, and with monthly billing 12 × $20 = $240. A Full seat on Organization is 12 × $55 = $660 for one year. The Organization billing article confirms $660 through its proration example.

Discounts:

- Annual billing on Professional has a lower price than monthly billing. No source names a discount for one person.
- Figma for Education is free for verified students and educators. Startups and non-profit organizations do not qualify.
- Figma has no non-profit discount.
- No official Figma page describes a startup program. The URL https://www.figma.com/startups/ returns 404.

Source keys, all checked 2026-11-12:

- P: https://www.figma.com/pricing/
- Q: https://www.figma.com/pricing-faq/
- C: https://help.figma.com/hc/en-us/articles/360040328273-Compare-Figma-plans-and-features
- S: https://help.figma.com/hc/en-us/articles/13838684089751-Starter-plan-overview
- PO: https://help.figma.com/hc/en-us/articles/13839214115607-Professional-plan-overview
- G: https://help.figma.com/hc/en-us/articles/360038511293-Create-and-manage-pages
- SE: https://help.figma.com/hc/en-us/articles/360039960434-Compare-and-manage-seats-in-Figma
- BG: https://help.figma.com/hc/en-us/articles/29717597009431-Guide-to-billing-at-Figma
- B1: https://help.figma.com/hc/en-us/articles/360041061034-Manage-billing-on-the-Professional-plan
- B2: https://help.figma.com/hc/en-us/articles/360040328293-Manage-billing-on-the-Organization-and-Enterprise-plans
- U: https://help.figma.com/hc/en-us/articles/360046216313-Upgrade-or-downgrade-your-plan
- M: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/
- MI: https://developers.figma.com/docs/figma-mcp-server/
- MD: https://developers.figma.com/docs/figma-mcp-server/local-server-installation/
- W: https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/
- MF: https://help.figma.com/hc/en-us/articles/39252411778583-Figma-MCP-server-FAQs
- V1: https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes
- V2: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables
- LG: https://help.figma.com/hc/en-us/articles/360041051154-Guide-to-libraries-in-Figma
- L: https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library
- LA: https://help.figma.com/hc/en-us/articles/1500008731201-Add-or-remove-a-library-from-a-design-file
- CF: https://help.figma.com/hc/en-us/articles/360040035974-Publish-files-to-the-Figma-Community
- R1: https://developers.figma.com/docs/rest-api/variables/
- R2: https://developers.figma.com/docs/rest-api/variables-endpoints/
- RL: https://developers.figma.com/docs/rest-api/rate-limits/
- PR: https://help.figma.com/hc/en-us/articles/360042532714-Use-plugins-in-files
- PD: https://help.figma.com/hc/en-us/articles/360042786733-Create-a-classic-plugin-for-development
- PB: https://help.figma.com/hc/en-us/articles/41407987481879-About-building-plugins-in-Figma
- PP: https://help.figma.com/hc/en-us/articles/360042293394-Publish-classic-plugins-to-the-Figma-Community
- PI: https://help.figma.com/hc/en-us/articles/4404228629655-Create-internal-plugins-for-an-organization
- D: https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode-in-Figma
- CC: https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect

### What the evidence supports for the three decisions

- IDEA-002#02 (design specs in Figma or in the repo): an agent host can read through the MCP server on every plan, with 20 tool calls each month on Starter and 200 each day on Professional with a Full or Dev seat. Writing to the canvas lists paid plans only and needs a Full seat outside drafts. It is free in beta, and Figma says it will become a usage-based paid feature.
- IDEA-002#07 (published library, custom plugin, or both): a library can be published from Professional upward, and a person who uses it needs edit access to the using file and view access to the library. A private plugin needs Organization or Enterprise. A plugin for the Figma Community and a Community file are possible on every plan.
- IDEA-002#09 (token export route): the Variables REST API needs Enterprise for read and for write. Figma Design exports and imports the modes of a collection as JSON on paid plans. The Plugin API reads and creates variables with no plan limit named, except extended collections.

### Disagreements and dated pages

Findings holds the full list under "Disagreements between sources" and "Source dates". The ones that touch a price or a limit:

- The Professional billing article's annual example uses $15 for one month of a Full seat. The pricing page shows $20.
- The REST API rate-limit page gives the Tier 1 low limit as 20 each month in its table and as 6 each month in its text.
- The Variables REST API page says both "Full seat" and "Any organization member" for `GET`.
- The pricing FAQ names debit cards and SEPA direct debit. The upgrade article says credit card only for a new Professional upgrade.
- The pricing FAQ holds text from 2025. "Supported billing currencies" was last edited in 2024. All other cited help center articles were edited in 2026.

### What remains unknown

- The price of writing to the canvas through the MCP server after the beta, and the date of the change. Figma publishes neither.
- Whether a Starter account can write to its own drafts through the MCP server. No page says yes or no.
- Whether `use_figma` calls count toward the MCP rate limit. The page names four exempt tools and not this one.
- The amounts in EUR, GBP, CAD and JPY. The pricing page shows USD only, also on the German page.
- Whether Enterprise has a minimum contract size. Figma sells it through the sales team and publishes no minimum.
- UNVERIFIED: third-party pages describe a "Figma for Startups" program with different terms, and one says it is paused. No Figma page confirms a program.

## Findings

### Plans, seats and prices
- Figma has four plans: Starter (free), Professional, Organization and Enterprise. The pricing page shows prices in USD. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- Paid plans sell three paid seat types: Full, Dev and Collab. A paid plan can also let other people view and comment without a paid seat (the free View seat). Source: https://www.figma.com/pricing/, checked 2026-11-12.
- The Full seat gives full access to all Figma products, including Figma Design and Dev Mode. The Dev seat gives full access to Dev Mode, FigJam, Figma Slides, Figma Buzz and Figma Specs, and view and comment access in Figma Design files. The Collab seat gives full access to FigJam, Figma Slides, Figma Buzz and Figma Specs, view and comment access in Figma Design files, and only basic inspection in Dev Mode. Source: https://www.figma.com/pricing-faq/, checked 2026-11-12.
- Professional with annual billing, shown as a price per month: $16/mo for a Full seat, $12/mo for a Dev seat and $3/mo for a Collab seat. This is the default state of the Monthly/Annual toggle on the Professional card ("Annual selected"). Source: https://www.figma.com/pricing/, checked 2026-11-12.
- Professional with monthly billing: $20/mo for a Full seat, $15/mo for a Dev seat and $5/mo for a Collab seat. Read in a browser after a click on the toggle ("Monthly selected"); the values are not in the server HTML. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- Only the Professional card has a Monthly/Annual toggle. The Organization and Enterprise cards show "Billed annually" with no toggle. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- Organization is "Billed annually" at $55/mo for a Full seat, $25/mo for a Dev seat and $5/mo for a Collab seat. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- Enterprise is "Billed annually" at $90/mo for a Full seat, $35/mo for a Dev seat and $5/mo for a Collab seat. Its purchase button is "Contact sales". Source: https://www.figma.com/pricing/, checked 2026-11-12.
- Figma does not sell products individually; a person chooses a plan and seats. Source: https://www.figma.com/pricing/, checked 2026-11-12.

### Figma's MCP server: access and rate limits
- Rate limits for the MCP server by seat and plan: View and Collab seats get up to 20 tool calls per month on every plan, Starter included. Full and Dev seats get up to 200 per day and 10 per minute on Professional, up to 200 per day and 15 per minute on Organization, and up to 600 per day and 20 per minute on Enterprise. The table gives no Full or Dev value for Starter. Source: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/#rate-limits, checked 2026-11-12.
- Education plans have the same MCP limits as Full and Dev seats on Professional: up to 200 tool calls per day and 10 per minute. Source: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/#rate-limits, checked 2026-11-12.
- The rate limits apply to tools that read data from Figma. Some tools are exempt, "including tools that write to Figma files"; the page names `add_code_connect_map`, `create_new_file`, `generate_figma_design` and `whoami` as examples. Source: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/#rate-limits, checked 2026-11-12.
- "Figma may change rate limits at any time". Source: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/#rate-limits, checked 2026-11-12.
- The pricing page gives the same four values by plan for the Full seat: Starter 20 tool calls per month; Professional 200 per day and 10 per minute; Organization 200 per day and 15 per minute; Enterprise 600 per day and 20 per minute. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- The MCP server works only with files the signed-in account can already access; plan, seat and file permissions still apply. Source: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/#permission-errors, checked 2026-11-12.
- In the pricing page's feature table, the "Figma MCP server" row has the same values with the seat selector on "Full seat" and on "Dev seat". With the selector on "Collab seat" the table has no "Figma MCP server" row. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- The help center guide lists "All plans" under "Who can use this feature" for the MCP server. A client must be in the Figma MCP catalog. Source: https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server, checked 2026-11-12.
- There are two servers. The remote server at `https://mcp.figma.com/mcp` needs no desktop app and has the broadest feature set. The desktop server needs the Figma desktop app and a Dev or Full seat on a Professional, Education, Organization, Government or Enterprise plan; it cannot write to the canvas. Source: https://developers.figma.com/docs/figma-mcp-server/#how-to-connect, checked 2026-11-12.
- Writing to the canvas (`use_figma`) lists Professional, Education, Organization and Enterprise under "Who can use this feature". It needs edit access to the file and a supported client on the remote server. Starter is not in the list. Source: https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/, checked 2026-11-12.
- "You need a Full seat to write to files outside your drafts. With a Dev seat, you can write in your drafts and have read-only access to other files, such as design context, screenshots, metadata, and variables". Source: https://help.figma.com/hc/en-us/articles/39252411778583-Figma-MCP-server-FAQs#h_01KMFMAR4SZF162A7WYHJSMJ49, checked 2026-11-12.
- Writing to the canvas is in beta and free in the beta period. "It will eventually become a usage-based paid feature." The pages give no price and no date. Source: https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/, checked 2026-11-12.
- The tool index puts `use_figma`, `create_new_file`, `upload_assets`, `generate_figma_design` and `add_code_connect_map` under "Write tools". `use_figma` is not one of the four tools that the rate-limit page names as exempt examples. Source: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/, checked 2026-11-12.
- Most MCP tools use no Figma AI credits. `generate_image` and `send_prompt` use AI credits. Source: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/#ai-credits, checked 2026-11-12.
- For Claude Code and for Codex by OpenAI, the client table marks the desktop server, the remote server and write to canvas as supported. Source: https://developers.figma.com/docs/figma-mcp-server/#h_01K25F7RBRZKCATVJHNXCS6KXW, checked 2026-11-12.

### Signing up: the free Starter plan
- The Starter plan is free. Its products are Figma Design, FigJam, Figma Slides, Figma Draw, Figma Sites, Figma Buzz and Figma Make. "Dev Mode is not available on the Starter plan". Source: https://help.figma.com/hc/en-us/articles/13838684089751-Starter-plan-overview, checked 2026-11-12.
- A Starter team has one folder. In that folder the limits are 3 Figma Design and Figma Sites files in total, 3 FigJam files and 3 Figma Slides files. Drafts (files not moved into a folder) are unlimited. Source: https://help.figma.com/hc/en-us/articles/13838684089751-Starter-plan-overview, checked 2026-11-12.
- On Starter, a person can invite collaborators to a draft with `can view` access only; edit access to drafts needs a paid plan. The one folder is open to all members of the plan. Source: https://help.figma.com/hc/en-us/articles/13838684089751-Starter-plan-overview, checked 2026-11-12.
- On Starter, a person can "co-edit with unlimited users on up to 3 files (limit of 3 pages per file)" and share drafts with unlimited viewers. Source: https://www.figma.com/pricing-faq/, checked 2026-11-12.
- Starter has no team libraries, 30 days of version history, no Sites publishing and no AI image tools. Source: https://help.figma.com/hc/en-us/articles/13838684089751-Starter-plan-overview, checked 2026-11-12.
- "In Starter team files, you're limited to a maximum of three pages per file." The article states no page limit for drafts on Starter. Source: https://help.figma.com/hc/en-us/articles/360038511293-Create-and-manage-pages, checked 2026-11-12.

### Seats and billing rules
- Every member or guest on a paid plan has one seat: Full, Dev, Collab or View. Only the Full seat can edit Figma Design files. Full and Dev seats have full Dev Mode access; Collab and View seats do not. All four seats have view, comment and basic inspection. Source: https://help.figma.com/hc/en-us/articles/360039960434-Compare-and-manage-seats-in-Figma#how-seats-work, checked 2026-11-12.
- The billing unit is one seat for each person. The subscription cost depends on the plan and on the number of Full, Dev and Collab seats. View seats are free. Source: https://help.figma.com/hc/en-us/articles/29717597009431-Guide-to-billing-at-Figma, checked 2026-11-12.
- On Professional, "You can purchase any number of Full, Dev, or Collab seats." The article states no minimum. A Professional plan is a single upgraded team. Source: https://help.figma.com/hc/en-us/articles/360041061034-Manage-billing-on-the-Professional-plan#how-billing-works, checked 2026-11-12.
- Professional offers a monthly or an annual subscription. Monthly: invoiced each month; unassigned seats do not renew. Annual: invoiced once a year; seats added in the term are billed on a separate monthly subscription at the monthly price until an admin adds them to the annual subscription. Source: https://help.figma.com/hc/en-us/articles/360041061034-Manage-billing-on-the-Professional-plan#monthly-vs-annual, checked 2026-11-12.
- Figma gives no prorated refund when a user moves to a free View seat. Source: https://help.figma.com/hc/en-us/articles/360041061034-Manage-billing-on-the-Professional-plan#remove-seats-during-billing-term, checked 2026-11-12.
- "Payments for Figma subscriptions are non-refundable". Source: https://www.figma.com/pricing-faq/, checked 2026-11-12.
- A Professional plan can have unlimited files, unlimited folders and an unlimited number of members and collaborators. Source: https://help.figma.com/hc/en-us/articles/13839214115607-Professional-plan-overview, checked 2026-11-12.
- Payment methods are major credit cards, debit cards and SEPA direct debit. Invoicing "may be possible" on Organization. Source: https://www.figma.com/pricing-faq/, checked 2026-11-12.
- Organization and Enterprise have an annual subscription only, charged upfront for the year, with quarterly invoices for seats added in the term. "You can purchase any number of Full, Dev, or Collab seats." The article states no minimum. Source: https://help.figma.com/hc/en-us/articles/360040328293-Manage-billing-on-the-Organization-and-Enterprise-plans#how-billing-works, checked 2026-11-12.
- The Organization billing article's example charges $195.29 for 108 days of one Full seat. That is 108/365 of $660, which is 12 × $55. Source: https://help.figma.com/hc/en-us/articles/360040328293-Manage-billing-on-the-Organization-and-Enterprise-plans#has-renewed, checked 2026-11-12.
- A person can buy Organization self-serve or through the sales team. The self-serve upgrade needs "a Figma account with a work email address". Enterprise is sold only through the sales team. Source: https://help.figma.com/hc/en-us/articles/360046216313-Upgrade-or-downgrade-your-plan, checked 2026-11-12.
- A new Professional upgrade accepts payment by credit card only; PayPal, ACH and wire transfer are not available. Source: https://help.figma.com/hc/en-us/articles/360046216313-Upgrade-or-downgrade-your-plan, checked 2026-11-12.
- Paid plans can be paid in GBP, CAD, EUR, JPY or USD. The article names the currencies and gives no local prices. It says "Starting April 2023", so its text is older than 2026. Source: https://help.figma.com/hc/en-us/articles/13496718847255-Supported-billing-currencies, checked 2026-11-12.
- A cancelled Professional plan becomes a Starter team at the end of the billing period. A team over the Starter file or folder limits is locked for editing until its files are moved. Source: https://help.figma.com/hc/en-us/articles/360046216313-Upgrade-or-downgrade-your-plan, checked 2026-11-12.
- "Prices shown on the Figma website do not include sales tax or value-added tax." For an address in the European Union, Figma adds VAT unless the account gives a valid VAT number. Source: https://help.figma.com/hc/en-us/articles/4418838088983-Sales-tax-and-VAT, checked 2026-11-12.
- The German pricing page shows "Prices in USD" and the same USD amounts as the English page, in both toggle states. Read in a browser. Source: https://www.figma.com/de-de/pricing/, checked 2026-11-12.

### Discounts
- Figma for Education is free for verified students and educators. Higher education, approved bootcamps and high school get the Professional plan; K-12 gets the Enterprise plan through the school or district. Source: https://help.figma.com/hc/en-us/articles/360041061214-Figma-for-Education#features, checked 2026-11-12.
- Education needs a current student or educator who applies with a school email. Self-directed education, startups, edtech companies and non-profit organizations do not qualify. Source: https://help.figma.com/hc/en-us/articles/360041061214-Figma-for-Education#qualifications, checked 2026-11-12.
- "We do not have any discounts for non-profits. Anyone is welcome to use Figma's free plan". Source: https://www.figma.com/pricing-faq/, checked 2026-11-12.
- The pricing page and the pricing FAQ name no discount for a single person. The only price difference they show is annual against monthly billing on Professional. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- The URL https://www.figma.com/startups/ returns "The page you are looking for can't be found" (HTTP 404). The pricing page, the pricing FAQ and the billing guide name no startup program. Source: https://www.figma.com/startups/, checked 2026-11-12.

### Variables and modes
- Variables are available on all plans. One collection can hold up to 5,000 variables. Source: https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes, checked 2026-11-12.
- Variable modes for each collection: the Starter cell is empty, Professional has up to 10, Organization has up to 20, and Enterprise has unlimited modes with extended collections. Source: https://help.figma.com/hc/en-us/articles/360040328273-Compare-Figma-plans-and-features, checked 2026-11-12.
- The pricing page gives the same mode limits: Starter "Not included", Professional "10 modes", Organization "20 modes", Enterprise "Unlimited modes (via extended collections)". It marks "Variables" as included on all four plans. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- The "Modes for variables" article lists Professional, Education, Organization, Government and Enterprise under "Who can use this feature". Starter is not in the list. Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables, checked 2026-11-12.
- Figma Design can export the modes of a variable collection to a JSON file ("Export mode", "Export modes") and import design tokens from a JSON file in the Design Tokens Community Group format ("Import mode"). Both are in the same article, under the same "Who can use this feature" list of paid plans. Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables#h_01KAH0DGH825NZDAV9DBPT3HMX, checked 2026-11-12.
- Variables can be published to team libraries like styles and components. Source: https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes, checked 2026-11-12.

### Libraries
- Libraries of components, styles and variables need a Professional, Education, Organization, Government or Enterprise plan. Source: https://help.figma.com/hc/en-us/articles/360041051154-Guide-to-libraries-in-Figma, checked 2026-11-12.
- "You can still create components and styles on the free Starter plan, but you can't publish them in a library to access them in other files". Source: https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library#h_01J688PTA7SPRDKBNDJ5RYVSP4, checked 2026-11-12.
- To publish, a person needs edit access to the file, and the file must be in a folder, not in drafts. After publication, "anyone with access to the library's source file can use the library in their files". Source: https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library#h_01J688PTA7SPRDKBNDJ5RYVSP4, checked 2026-11-12.
- Only Organization and Enterprise can choose where to publish a library: to one team or to the whole organization. Enterprise can also publish to a workspace. Source: https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library#h_01J688PTA7N7AHMGZMA6QA1F1V, checked 2026-11-12.
- A person can use published libraries in any draft or team file where the person has `can edit` access. Source: https://help.figma.com/hc/en-us/articles/360041051154-Guide-to-libraries-in-Figma#h_01HHN9HHAQCMKHMPB50AE9AASE, checked 2026-11-12.
- The pricing page marks "Team libraries" as not included on Starter and included on Professional, Organization and Enterprise. "Organization-wide design systems" start at Organization. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- Adding a library to a design file needs a paid plan and edit access to that file. "In order to access a library's styles, components, and variables, users need at least `can view` access to the library". Source: https://help.figma.com/hc/en-us/articles/1500008731201-Add-or-remove-a-library-from-a-design-file, checked 2026-11-12.
- A team admin can make a published library available by default in all files of the team, on Professional and higher plans. Source: https://help.figma.com/hc/en-us/articles/360039234953-Enable-a-library-for-a-team, checked 2026-11-12.
- Publishing a design file to the Figma Community is available on Starter, Professional, Education, Organization and Enterprise, with edit access to the file. "Anyone who duplicates the file gets a new copy, without any updates, version history or comments from the original file". Source: https://help.figma.com/hc/en-us/articles/360040035974-Publish-files-to-the-Figma-Community, checked 2026-11-12.

### REST API
- The Variables REST API needs the Enterprise plan for both `GET` and `POST`. `GET` needs view access to the file and the `file_variables:read` scope. `POST` needs edit access to the file, the `file_variables:write` scope, and a Full seat or an admin. Guests cannot use the API. Source: https://developers.figma.com/docs/rest-api/variables/#getting-started, checked 2026-11-12.
- The three endpoints are `GET /v1/files/:file_key/variables/local`, `GET /v1/files/:file_key/variables/published` and `POST /v1/files/:file_key/variables`. Each is "available to full members of Enterprise orgs". On another plan they return 403 with `Limited by Figma plan`. Source: https://developers.figma.com/docs/rest-api/variables-endpoints/, checked 2026-11-12.
- `GET published variables` returns no modes; mode values come from `GET local variables` only. Source: https://developers.figma.com/docs/rest-api/variables-endpoints/#get-published-variables-endpoint, checked 2026-11-12.
- Through `POST variables`, one collection can have at most 40 modes and at most 5,000 variables. Source: https://developers.figma.com/docs/rest-api/variables-endpoints/#post-variables-endpoint, checked 2026-11-12.
- The pricing page marks "REST APIs" as included on all four plans and "REST API for variables" as included on Enterprise only. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- REST API rate limits depend on the seat, the endpoint tier and the plan that owns the requested file. Tier 1 (`GET file`, `GET file nodes`, `GET image`): View and Collab seats up to 20 per month; Dev and Full seats 10 per minute on Professional, 15 on Organization and 20 on Enterprise. Tier 2 (includes both `GET` variables endpoints): View and Collab up to 5 per minute; Dev and Full 25, 50 and 100 per minute. Tier 3 (includes `POST variables` and Components & Styles): View and Collab up to 10 per minute; Dev and Full 50, 100 and 150 per minute. Source: https://developers.figma.com/docs/rest-api/rate-limits/#rate-limits-tier-table, checked 2026-11-12.
- In that table the Starter cell spans both seat rows. A file in a Starter plan gets the View and Collab limit for every seat: up to 20 per month on Tier 1, up to 5 per minute on Tier 2 and up to 10 per minute on Tier 3. Read from the page HTML (`rowspan="2"`). Source: https://developers.figma.com/docs/rest-api/rate-limits/#rate-limits-tier-table, checked 2026-11-12.
- These REST API rate limits are in effect since 2025-11-17. Figma reserves the right to change them. Source: https://developers.figma.com/docs/rest-api/rate-limits/, checked 2026-11-12.

### Plugins
- Running plugins is available on all plans and needs edit access to the file. By plan and seat: Starter runs plugins in Figma Design, FigJam, Figma Slides and Figma Buzz, not in Dev Mode. A Full seat runs them in all five. A Dev seat runs them in Dev Mode, FigJam, Figma Slides and Figma Buzz, not in Figma Design. A Collab seat runs them in FigJam and Figma Slides only. A View seat runs none. Source: https://help.figma.com/hc/en-us/articles/360042532714-Use-plugins-in-files, checked 2026-11-12.
- Creating a classic plugin for development is available on all plans. It needs the Figma desktop app for macOS or Windows. The plugin then shows under "Development" for that person. Source: https://help.figma.com/hc/en-us/articles/360042786733-Create-a-classic-plugin-for-development, checked 2026-11-12.
- A classic plugin is "Free to build and publish". A generative plugin "Costs AI credits to build" and is free to run. Both can be private for an organization or published to the Community. Source: https://help.figma.com/hc/en-us/articles/41407987481879-About-building-plugins-in-Figma#h_01KVS2Y63QG7GA1XH9A8WHYKX2, checked 2026-11-12.
- Publishing a classic plugin to the Figma Community is available on Starter, Professional, Education, Organization and Enterprise. It needs the desktop app and two-factor authentication, and the plugin goes through Figma's review. Source: https://help.figma.com/hc/en-us/articles/360042293394-Publish-classic-plugins-to-the-Figma-Community, checked 2026-11-12.
- The "Publish to" choice between "Organization" (private) and "Community" exists on Organization and Enterprise plans only. Figma does not review a plugin that is shared privately in an organization. Source: https://help.figma.com/hc/en-us/articles/360042293394-Publish-classic-plugins-to-the-Figma-Community#h_01HA2DQNF7CMZW2Q5T6H7DSZX0, checked 2026-11-12.
- Internal plugins for an organization need the Education (K-12), Organization or Enterprise plan. Any member of the organization can make and share one. Source: https://help.figma.com/hc/en-us/articles/4404228629655-Create-internal-plugins-for-an-organization, checked 2026-11-12.
- The pricing page marks "Plugins and widgets" (built by the community) as included on all four plans, and "Private plugins and widgets" as included on Organization and Enterprise only. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- In Dev Mode, the pricing page gives "Plugins" as not included on Starter, "Community plugins only" on Professional, and included on Organization and Enterprise. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- The Plugin API can read and create variables and collections through `figma.variables`. The guide names one plan limit: extended variable collections are "limited to the Enterprise plan". Source: https://developers.figma.com/docs/plugins/working-with-variables/, checked 2026-11-12.

### Dev Mode and Code Connect
- Dev Mode needs a Professional, Education, Organization, Government or Enterprise plan. It is not available on Starter. Source: https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode-in-Figma, checked 2026-11-12.
- Full Dev Mode access needs a Full or Dev seat. Collab and View seats get basic inspection only. Source: https://help.figma.com/hc/en-us/articles/360039960434-Compare-and-manage-seats-in-Figma#how-seats-work, checked 2026-11-12.
- A free viewer can still inspect a file without Dev Mode: view measurements and property values, copy CSS, iOS and Android code, and export assets. Source: https://www.figma.com/pricing-faq/, checked 2026-11-12.
- Code Connect needs a Full or Dev seat on a Professional, Education, Organization, Government or Enterprise plan. Source: https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect, checked 2026-11-12.
- "Professional plans can have one active library and one active framework." The first Code Connect publish sets them; a team admin can change them. Connections for another library or framework stay but are deactivated and "aren't returned by the Figma MCP server". Organization and Enterprise can have multiple active frameworks. Source: https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect#h_01M4GS0JM9PD1Z8ZYZC82GZC1P, checked 2026-11-12.
- The pricing page gives Code Connect as not included on Starter, "One active library and one framework" on Professional, and "Unlimited libraries and multiple frameworks" on Organization and Enterprise. Source: https://www.figma.com/pricing/, checked 2026-11-12.
- Code Connect has two forms: Code Connect UI inside Figma, and the Code Connect CLI in the repository. Components connected through the UI show no code snippets in the Inspect panel; the CLI does. Source: https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect#h_01K5CK9YP3CC33W1J1FGDWAC7W, checked 2026-11-12.
- In Dev Mode on Professional, the pricing page gives "Improved handoff experience" as "Ready for dev on canvas only". Source: https://www.figma.com/pricing/, checked 2026-11-12.
- All plans with Dev Mode have the "Ready for dev" status. The "Completed" status needs Organization or Enterprise. Source: https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode-in-Figma#h_01J04M14T6RRQRVTMAHB5R0RVX, checked 2026-11-12.
- The pricing page marks "REST API with Dev Mode" (dev resources and statuses through the REST API) as included on Enterprise only. Source: https://www.figma.com/pricing/, checked 2026-11-12.

### Source dates
- The help center's article API gives an edit date for each article. Of the 29 help center articles cited here, 28 were last edited between 2026-08-03 and 2026-11-05. "Supported billing currencies" was last edited on 2024-09-05. Source: https://help.figma.com/api/v2/help_center/en-us/articles/13496718847255.json, checked 2026-11-12.
- The pricing page, the pricing FAQ and the developer documentation pages show no publication or edit date. The developer documentation sitemap carries no `lastmod` values. Source: https://developers.figma.com/sitemap.xml, checked 2026-11-12.
- The pricing FAQ holds text from before 2026: custom domains "free of charge through 2025", and "You can purchase additional bandwidth or storage in early 2026". Source: https://www.figma.com/pricing-faq/, checked 2026-11-12.

### Disagreements between sources
- Full seat price with monthly billing on Professional: the pricing page shows $20/mo. The Professional billing article's annual example charges "$15, which is the next month's usage" for a Full seat and $1.50 for 3 days. The same article's monthly example uses $15 for a Dev seat, which agrees with the pricing page. Source: https://help.figma.com/hc/en-us/articles/360041061034-Manage-billing-on-the-Professional-plan#add-seats-during-billing-term, checked 2026-11-12.
- Who can call the Variables REST API with `GET`: one sentence says "you must have a Full seat in an Enterprise org", the table on the same page says "Any organization member", and the endpoints page says "full members of Enterprise orgs". All three agree on the Enterprise plan. Source: https://developers.figma.com/docs/rest-api/variables/#getting-started, checked 2026-11-12.
- REST API Tier 1 limit for a low-limit seat or a Starter file: the table says "Up to 20/month". The text on the same page says "up to 6 per month" and "a maximum of 6 requests monthly". Source: https://developers.figma.com/docs/rest-api/rate-limits/, checked 2026-11-12.
- MCP on Starter: the help center guide says "All plans", and the rate table gives Starter 20 calls per month in the View and Collab row and "—" in the Full and Dev row. The write-to-canvas page lists paid plans only. No page says whether a Starter account can write to its drafts through the MCP server. Source: https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/, checked 2026-11-12.
- Whether `use_figma` counts toward the MCP rate limit: the rate-limit page says the limits apply to tools that read, and that write tools are among the exempt tools, but its four examples do not include `use_figma`. The tool page for `use_figma` says it can also inspect content. Source: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/#rate-limits, checked 2026-11-12.
- Payment method for Professional: the pricing FAQ names credit cards, debit cards and SEPA direct debit. The upgrade article says "We only support payment by credit card for new upgrades to the Professional plan". Source: https://help.figma.com/hc/en-us/articles/360046216313-Upgrade-or-downgrade-your-plan, checked 2026-11-12.
- Mode limit on Enterprise: the plan pages say "Unlimited modes with extended collections". The REST API says "Each collection can have a maximum of 40 modes". Source: https://developers.figma.com/docs/rest-api/variables-endpoints/#post-variables-endpoint, checked 2026-11-12.
- Code Connect plans: the developer documentation lists Professional, Organization and Enterprise. The help center article adds Education and Government. Source: https://developers.figma.com/docs/code-connect/, checked 2026-11-12.
- Education term: the pricing FAQ says two years for K-12 and higher education and 6 months for bootcamps. The Education article says one year for students and two years for educators. Source: https://help.figma.com/hc/en-us/articles/360041061214-Figma-for-Education#apply, checked 2026-11-12.
- Figma for Government and the MCP server: the developer documentation says "desktop server only". The help center guide says it "supports remote and desktop MCP connections". Source: https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server, checked 2026-11-12.

## Follow-ups
- What does Figma charge for writing to the canvas through the MCP server when the beta ends?
- Can a Starter account write to its own drafts through the remote MCP server, and do `use_figma` calls count toward the rate limit? This needs a live test after the Figma sign-in.
- What does Figma charge in EUR for each Professional seat at checkout?

## Next action
None.
