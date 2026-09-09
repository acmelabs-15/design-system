// Docs page: Command Menu — mirrors https://vercel.com/geist/command-menu
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "command-menu",
  title: "Command Menu",
  lede: "A set of actions in a full-screen overlay behind ⌘K.",
  tags: ["acme-command-menu"],
  examples: [
    {
      h: "Default",
      p: "Shown static here. Without static it opens on ⌘K and closes on Escape.",
      html: `<acme-command-menu static groups='[{"heading":"Suggestions","items":[{"label":"Deploy Project","icon":"arrow"}]},{"heading":"Commands","items":[{"label":"Import Extension","icon":"folder"},{"label":"Manage Extensions","icon":"file"}]},{"heading":"Collaboration","items":[{"label":"Flags Explorer","icon":"globe"}]}]'></acme-command-menu>`,
    },
    {
      h: "With suffix and footer",
      html: `<acme-command-menu static placeholder="Search projects…" groups='[{"items":[{"label":"coding-agent-template","icon":"folder","suffix":"P"},{"label":"next-year-boilerplate","icon":"folder","suffix":"Project"}]},{"heading":"Settings","items":[{"label":"Settings","icon":"globe","suffix":"⌘ ,"}]}]'><div slot="footer" class="cmdk-foot">3 results</div></acme-command-menu>`,
    },
  ],
  practices: {
    Behavior: ["Focus trapped; an aria-live result count; groups keep the visible label first so typeahead matches."],
    Content: ["Title Case Verb + Noun items (Deploy Project); page labels Title Case; placeholders sentence case ending with …; group names 1–2 words."],
  },
};
