// Docs page: Empty State — mirrors https://vercel.com/geist/empty-state
import type { Doc } from "../../site";

const icon = `<acme-icon-tile slot="icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-chart"/></svg></acme-icon-tile>`;
const blank = (attrs = "") => `<acme-empty-state title="Title" description="A message conveying the state of the product."${attrs}>${icon}</acme-empty-state>`;
// The reference's secondary Link (gray-900, an inline row with a 2px gap and the external-link icon): a plain anchor here, styled inline.
const learnMore = `<a href="/" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:2px;color:var(--ds-gray-900)">Learn more<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-ext"/></svg></a>`;
const list = `<ul style="font-size:16px;line-height:24px;color:var(--text-2);margin:16px 0 0;padding-left:20px;max-width:72ch">`;

export const doc: Doc = {
  id: "empty-state",
  title: "Empty State",
  lede: "Fills a space that has no content yet, or is empty for now by the nature of the feature, so the reader is not confused.",
  tags: ["acme-empty-state", "acme-icon-tile"],
  examples: [
    {
      h: "Empty state Design framework",
      p: `A well designed empty state is part of a smooth experience: it gives enough context to keep the user productive. Several approaches fit different situations a developer meets:</p>${list}<li><b>Blank Slate</b> - Basic empty state for first run experience</li><li><b>Informational</b> - Alternative for first use empty state, including in-line CTAs and supplemental documentation links</li><li><b>Educational</b> - Launch a contextual onboarding flow to gain deeper understanding about that area of the app</li><li><b>Guide</b> - Starter content that allows users to interact with data and learn the system by tinkering or setting up their environment</li></ul><p hidden>`,
      html: blank(),
    },
    {
      h: "Blank slate",
      p: "The simplest empty state says what state the view is in.",
      html: blank(),
    },
    {
      h: "Informational",
      p: "Explains the benefit of a product or feature, with a call to action and a link to more information so the user can move on. Show the value rather than tell it; some entry points call for a unique empty state and a call to upgrade. An informational empty state always has a call to action.",
      html: `<acme-empty-state title="Title" description="This should detail the actions you can take on this screen, as well as why it’s valuable.">${icon}<acme-button variant="secondary">Primary Action</acme-button>${learnMore}</acme-empty-state>`,
    },
    {
      h: "Secondary", census: true,
      p: "The background-200 form with the 14px title, for an empty state inside a tinted panel.",
      html: blank(" secondary"),
    },
    {
      h: "No border", census: true,
      p: '<code>border="false"</code> keeps the border box and makes it transparent, for an empty state that sits in a bordered container of its own.',
      html: blank(' border="false"'),
    },
  ],
  practices: {
    "When to use": [
      "Pick the variant by what the user needs: no-results for a filtered list with zero rows, blank slate or informational for a resource not yet created, cleared for finished work, permission for role or tier denials, error for a failed load.",
      "Render the permission and tier-denial variants full-page when the user lands on a route they cannot view. Use a Note only when one tile inside an otherwise accessible page is gated.",
      "Keep critical persistent warnings out of it. An empty state disappears once the list fills; persistent warnings belong in a Note or the page header.",
    ],
    Behavior: [
      "The call to action is a real button or link, not a click handler on a div, so it is in the tab order and has a role.",
      "One primary call to action, plus one secondary only when the first step can be one of two paths (Import Repository and Deploy Template). Three is too many.",
      'After an async filter change, wrap the region in aria-live="polite" so screen readers announce the new state.',
      "Do not start a tour on its own from the educational variant; pair Start Tour with Skip.",
    ],
    Content: [
      "The title is Title Case (No Logs Match Your Filter); the description is sentence case and adds new information instead of repeating the title.",
      `Quote a single typed query verbatim in curly quotes: No logs match “\${query}”. Clear the filter to see all logs. For several facets use the plural No {Items} Match Your Filters and suggest widening or clearing.`,
      "Onboarding text names the next action that creates the first item: Push to your Git repository to create your first one. Tier-gated text follows {Feature value} with the {Plan} plan.",
      "The error variant pairs the text with a copyable request ID and a Try Again button.",
      "Call-to-action labels are Title Case Verb + Noun. Never Get Started, Continue or OK.",
    ],
  },
};
