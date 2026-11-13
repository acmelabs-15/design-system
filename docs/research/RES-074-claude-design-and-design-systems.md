---
id: RES-074
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-008#01
date: 2026-11-13
---
# RES-074: What Claude Design takes from a design system

## Question
What is Claude Design, what does it take from a design system (components, tokens, a design system file, an MCP server, skills), in which formats, and what does it need from a library of web components?

Settled context: the new design system has Lit web components at its core, framework packages over them (React first), design tokens from Figma, an MCP server and agent skills. This record supports IDEA-008#02, the decision what, if anything, the new system does to be compatible with Claude Design.

## Answer
A sufficient answer, from Anthropic's own documentation first, states:
1. What Claude Design is: the product, where it runs, its status and the date of the sources.
2. What it takes from a design system, and in which formats, and how a design system is added and kept in step.
3. What it produces with a design system, and which frameworks and kinds of components it uses.
4. What it needs from a library of web components: custom elements, React, a package, a CDN with no build step.
5. Its documented limits; each uncovered point marked UNVERIFIED.

All sources were read on 2026-11-13. Claude Code versions named: 2.1.265 (for `/design`), 2.1.317 (last `/design-sync` change found).

**1. What it is.** Claude Design is Anthropic's tool for designs, interactive prototypes, one-pagers and decks, made by chat on a canvas of artboards. It launched on 2026-04-17 as an Anthropic Labs product at claude.ai/design. Since 2026-09-16 it is a template that an artifact starts from, in any Claude conversation, the Artifacts tab, the mobile apps and Claude Code (`/design`). It is on all plans; design systems and templates are in beta. The standalone site closes on 2026-12-14.

**2. What it takes, and how.** A design system holds colors, typography, components and layout patterns. In Claude it is an artifact that holds a guide, tokens, components with live previews and notes, and files. There are three routes in:
- From a chat: Claude builds one from connected apps, uploads, Figma files, decks, logos and fonts. Anthropic says this suits brand systems.
- From Claude Code: `/design-sync` converts a React design system in the repository and uploads it. Anthropic says it "reads your tokens and components directly" and suits product systems in code.
- By moving a system from standalone claude.ai/design.
Help pages also name a GitHub repo, design files, raw uploads, DOCX, PPTX and XLSX as import sources.
Keeping in step: `/design-sync` re-runs the sync. In the standalone site, "Remix" edits a system by chat. A moved system cannot be edited by hand on its page yet; editors ask Claude to change it.
No Anthropic source names a token file format (for example DTCG JSON), a Figma variables import, an MCP server or agent skills as inputs. "Connected apps" in the chat route are connectors, but the pages do not say a design system's own MCP server is read. UNVERIFIED: any token format, MCP or skill input.

**3. What it produces.** It produces designs on a canvas and interactive prototypes. Exports are .zip, PDF, PPTX, Google Slides, standalone HTML, sends to partner tools, and handoff to Claude Code. From Claude Code, `/design` imports a design into a codebase or exports code as a live prototype. Help pages say Claude "builds with your real design system components". No Anthropic source names the framework of the prototype code or the code handed to Claude Code. UNVERIFIED: output frameworks.

**4. What it needs from a web component library.** The only documented code route, `/design-sync`, is described for React only: "Convert your repo's React design system". The help page says it applies "if your design system already exists as React components". No Anthropic source mentions web components, custom elements, Lit, Vue or another framework. A third-party walkthrough says the sync bundle carries "a copy of React" and finds components through TypeScript type definitions. UNVERIFIED: whether Claude Design can render or sync custom elements; whether a React wrapper package would satisfy `/design-sync`; whether a chat or GitHub import of a non-React library yields usable components; whether a design can load a library from a CDN. For ordinary artifact pages (not shown to be the Design canvas), the CSP allows scripts only from cdnjs, unpkg, jsDelivr `/npm/` and the Tailwind and jQuery CDNs.

**5. Limits and disagreements.**
- Import is "only as good as its source"; large repositories should go through `/design-sync`; no version history; multi-person editing is basic; a first sync can take hours; `/design-sync` is unavailable on cloud-provider and gateway setups.
- Disagreement: the help page names `/design-sync` as the way to create a design system in Claude, but the Claude Code commands page says it uploads to the standalone site that closes on 2026-12-14. Changelog 2.1.317 says it stops when a system has moved to Claude. No source says how a code-based system is synced into Claude after the standalone site closes. UNVERIFIED.
- The move check limits a design system's files by size, name and kind; the allowed kinds are not listed. UNVERIFIED.
- The host's Artifact types could not be listed in this session (blocked by a local hook), and no `DesignSync` tool was present.

## Findings

Tool check: Firecrawl search and scrape returned live pages from support.claude.com on 2026-11-13.

### What Claude Design is
- Claude Design creates designs, interactive prototypes, one-pagers and other visual work by chat. It is one of the templates an artifact starts from. It runs in any chat, in Claude Code and from the Artifacts tab, with on-canvas editing and the design system included. Source: https://support.claude.com/en/articles/14604416-get-started-with-claude-design, checked 2026-11-13.
- It is on Free, Pro, Max, Ultra, Team and Enterprise plans, on by default. On Enterprise it turns on by default on 2026-10-15. The standalone version at claude.ai/design closes on 2026-12-14. Source: same page, checked 2026-11-13.
- Surfaces: a conversation (Output > Design), the Artifacts tab, Claude Code (/design to create, edit and sync designs, desktop or terminal), the iOS and Android apps, and standalone claude.ai/design until it closes. Source: same page, section "Where you can use Claude Design", checked 2026-11-13.
- It pairs a conversation with a canvas. A design is a canvas of artboards; each artboard holds layers (text, shapes, images). Refinement is by chat, inline comments and direct canvas edits. Source: same page, sections "How Claude Design works" and "Use Claude Design with a keyboard", checked 2026-11-13.
- Design systems are in beta on Pro, Max, Ultra, Team and Enterprise. On Enterprise they are off until an owner turns them on under Organization settings > Artifacts. Source: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design, checked 2026-11-13.

### What it takes from a design system
- A design system captures colors, typography, components and layout patterns. Claude extracts them from assets such as codebases, slide decks or other design references. Source: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design, checked 2026-11-13.
- Source material needs at least one of: a codebase with the design system or component library; a slide deck or document with the visual identity; brand guideline assets (logos, color palettes, typography specs). Source: same page, "Before you start", checked 2026-11-13.
- Three ways to create one: from a chat (connected apps, uploads, Figma files, decks, logos, fonts; "works best for brand design systems"); from Claude Code with /design-sync, which "reads your tokens and components directly" when the system "already exists as React components" and "works best for product design systems in code"; or by moving one from claude.ai/design. Source: same page, "Create a design system", checked 2026-11-13.
- Each moved design system "becomes an artifact Claude can use in any chat, including in Claude Code". A moved system may need cleanup; Claude "tidies its guide, tokens, and components". So the artifact holds a guide, tokens and components. Source: same page, checked 2026-11-13.
- A design system opens as a list of sections. It holds live component previews; each component has a name and notes. Source: same page, "Use a design system with a keyboard", checked 2026-11-13.
- Design systems can be brought in "from a GitHub repo, design files, raw uploads, or your local codebase using the /design-sync command in Claude Code". Claude "builds with your real design system components, checks its own output against your design system, and makes corrections". Source: https://support.claude.com/en/articles/14604416-get-started-with-claude-design, "Attach or import your design system", checked 2026-11-13.
- Standalone claude.ai/design took codebases ("like a React component library", link or upload the repository; "Claude reads the components and styles"), prototypes, screenshots, design files, decks, PDFs and individual assets. The generated system holds a color palette, typography, components and layout patterns. Source: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design, "Set up a design system at claude.ai/design", checked 2026-11-13.
- Keeping in step: in standalone Claude Design an owner opens the system and uses "Remix" to change it by chat. In Claude, /design-sync from Claude Code syncs a design system; "Use /design-sync to pull in your design system". Source: both pages above, checked 2026-11-13.
- Management is under Settings > Capabilities > Design systems (or Settings > Design systems). On Enterprise, admins can reserve publishing, setting the organization default and deleting. Source: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design, checked 2026-11-13.

### What it produces
- Exports: .zip, PDF, PPTX, Google Slides, standalone HTML, sends to third-party tools (among them Canva, Lovable, Netlify, Replit, v0, Vercel, Wix), and handoff to Claude Code (local agent or Claude Code Web). Source: https://support.claude.com/en/articles/14604416-get-started-with-claude-design, "Export and share", checked 2026-11-13.
- From Claude Code, /design imports a design into a codebase, exports code as a live prototype, or builds the whole thing. Source: same page, "Move between Claude Design and Claude Code", checked 2026-11-13.

### Claude Code: templates, /design and page constraints
- In Claude Code, Claude can start an artifact from a template on the claude.ai account: Claude Slides, Claude Design ("for a visual design") or Claude Docs. Each opens in its own editor on claude.ai. Templates are in beta. `/slides` and `/design` need Claude Code v2.1.265 or later. Source: https://code.claude.com/docs/en/artifacts#start-from-a-slides-design-or-docs-template, checked 2026-11-13.
- `/design` with a brief drafts a UI mockup, screen flow, landing page or poster as artboards on one canvas and publishes it as a Claude Design artifact. Each artboard exports as PNG or PDF. Source: https://code.claude.com/docs/en/artifacts#draft-a-design-canvas, checked 2026-11-13.
- An ordinary artifact page uses a built-in design skill that "looks for an existing design system in your project before choosing its own". Design tokens recorded in CLAUDE.md or a theme file in the repository are used; "any clear list of colors, fonts, and spacing works". Source: https://code.claude.com/docs/en/artifacts#improve-the-visual-design, checked 2026-11-13.
- An artifact page is one self-contained page under a strict CSP. It loads scripts only from five public CDN hosts (cdnjs, unpkg, the Tailwind and jQuery CDNs, and selected jsDelivr paths such as `/npm/`) and fonts only from Google Fonts. All other CSS and JavaScript is inlined. Relative links do not resolve. The page does not say whether the Design template's canvas has the same CSP. Source: https://code.claude.com/docs/en/artifacts#page-constraints, checked 2026-11-13.

### /design-sync and the move into Claude
- `/design-sync [hint]` is a bundled skill that will "Convert your repo's React design system and upload it to Claude Design, so designs it produces use your real components". A first-time sync "verifies every component and can take a few hours on a large repo". It "uploads to the standalone claude.ai/design site, which closes by December 14, 2026". It is unavailable on Bedrock, Google Cloud, Microsoft Foundry, Claude Platform on AWS and through a Claude apps gateway. `/design-login` authorizes it. Source: https://code.claude.com/docs/en/commands.md (rows `/design-sync`, `/design-login`, `/design consent`), checked 2026-11-13.
- Claude Code 2.1.317 "Improved `/design-sync` to say up front when your design system has moved to Claude, and stop before building instead of failing at upload". Source: https://code.claude.com/docs/en/changelog.md, version 2.1.317, checked 2026-11-13.
- Claude Design "now lives in Claude". A new design, design system or slide deck started in Claude "is created as an artifact". A moved design system "keeps its files as they were, and you can't edit it yourself on its page yet"; editors ask Claude to make changes. A later move does not update an already moved system; to refresh it, delete it in Claude and move again. Source: https://support.claude.com/en/articles/17440474-move-from-standalone-claude-design-to-claude, checked 2026-11-13.
- The move check lists files that are "Too large for an artifact", have "a name an artifact can't use", are "A kind an artifact can't hold" or "Can't go in a design system artifact". A design system can be too large to move. So a design system is a set of files inside an artifact, with limits on size, names and kinds. The page does not list the allowed kinds. Source: same page, "If a design system can't move", checked 2026-11-13.
- Admin settings under Organization settings > Artifacts: "Design systems" under Templates (on for Team, off for Enterprise) and "Design" and "Slides" under Templates (on). Source: same page, "For Team and Enterprise owners", checked 2026-11-13.
- An Anthropic article (updated September 2026) says the import was rebuilt: "Bring in one or several design systems from a GitHub repo, design files, or raw uploads"; a new admin role can approve one standard system and lock edits. Partners describe a "Claude Design MCP integration" for sending work onward (Replit). Source: https://claude.com/resources/articles/claude-design-stays-on-brand-for-daily-work, checked 2026-11-13.
- Release notes: Claude Design launched 2026-04-17 as an Anthropic Labs product. On 2026-09-16 designs, decks and docs became available in any conversation, including Claude Code and the Artifacts tab, "including on-canvas editing and importing your design system". Source: https://support.claude.com/en/articles/12138966-release-notes, checked 2026-11-13.
- The product page FAQ says: "Import from your codebase, or DOCX, PPTX, and XLSX files", and "Import from GitHub, design files, or your local codebase so Claude can build with your real components". Source: https://claude.com/product/design, checked 2026-11-13.

### Secondary source on the /design-sync format (not Anthropic)
- A third-party walkthrough (published 2026-09-28, modified 2026-11-04) describes the synced "mirror": no source files; one compiled bundle with every component, the stylesheet, the fonts "and a copy of React"; per component a types folder, a standalone preview page and a usage guide; a README with the team's conventions. Settings live in `.design-sync/config.json` with fields `pkg`, `entry`, `globalName` (the global the bundle attaches to), `storybookConfigDir`, `buildCmd`, `cssEntry`, `extraFonts`, `readmeHeader`, and a saved `projectId`. Components are found through the entry file and their TypeScript type definitions. Storybook stories, if present, become previews and the reference; Playwright with Chromium screenshots and grades each preview. The mirror is a one-way snapshot; nothing updates until the next sync. Anthropic's documentation does not confirm these internals. Source: https://nitayneeman.com/blog/how-to-sync-a-design-system-with-claude-design/, checked 2026-11-13.

### Host evidence in this session
- No tool named `DesignSync` is present in this host session; a tool search for it on 2026-11-13 returned only Figma and unrelated tools. A read-only listing of Artifact types was refused by a local hook ("existing artifacts are never listed, read or updated"), so the host's type list could not be read. Source: this session's ToolSearch and Artifact list calls, checked 2026-11-13.
- The `Artifact` tool description in this host lists "a design system" and "a visual design" among Artifact types, and says Claude makes a design system "from a listed Design System type". Source: the host's Artifact tool description, checked 2026-11-13.

### Documented limits
- Known limitations include: design system import "is only as good as its source"; very large repositories should be linked from Claude Code, and design systems synced with /design-sync; no version history; multi-person editing is basic. Source: https://support.claude.com/en/articles/14604416-get-started-with-claude-design, "Known limitations", checked 2026-11-13.
- Live component previews in a design system cannot be reached with Tab. Source: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design, checked 2026-11-13.

## Follow-ups
- A hands-on trial: run `/design-sync` (or a chat import) against a small Lit library and its React wrappers, and record what arrives and what renders. Only a trial can close the UNVERIFIED points in Answer 4.
- After 2026-12-14, recheck how a code-based design system is synced into Claude, since the documented `/design-sync` target closes then.

## Next action
None.
