import type { Doc } from "../../site";
export const doc: Doc = {
  id: "empty-state",
  title: "Empty State",
  lede: "Explain an empty collection or view and provide a useful next action.",
  tags: ["acme-empty-state", "acme-empty-state-content", "acme-empty-state-indicator"],
  examples: [
    {
      h: "No matching items",
      html: '<acme-empty-state variant="outline"><acme-empty-state-indicator slot="indicator"><acme-search-icon size="32px"></acme-search-icon></acme-empty-state-indicator><acme-heading slot="heading" as="h3">No matching items</acme-heading><p slot="description">Change the search terms to find an item.</p><acme-button slot="actions" variant="secondary">Clear search</acme-button></acme-empty-state>',
    },
    {
      h: "Composed content",
      html: '<acme-empty-state><acme-empty-state-content><acme-empty-state-indicator><acme-folder-icon size="32px"></acme-folder-icon></acme-empty-state-indicator><acme-heading as="h3">Your collection is empty</acme-heading><p>Create the first item to get started.</p></acme-empty-state-content><acme-button slot="actions">Create item</acme-button></acme-empty-state>',
    },
    {
      h: "Surface treatments",
      html:
        '<acme-v-stack align-items="stretch" gap="4">' +
        ["default", "outline", "subtle"]
          .map(
            (variant) =>
              `<acme-empty-state size="small" variant="${variant}"><acme-heading slot="heading" as="h3">No saved views</acme-heading><p slot="description">Save a view to find it here later.</p></acme-empty-state>`,
          )
          .join("") +
        "</acme-v-stack>",
    },
  ],
  practices: {
    Content: [
      "Use an authored Heading at the correct document level. The component does not choose a heading level or add a live role.",
      "indicator, heading, description and actions slots support a direct composition. Empty State Content and Empty State Indicator support a grouped composition through the default slot.",
      "Keep illustrations meaningful or decorative through their own accessible inputs. Icons without labels are decorative.",
      "Use the description to explain why the collection is empty and what the user can do next.",
    ],
    Layout: [
      "default is a plain surface, outline adds a border, and subtle uses the secondary background. small, medium and large adjust spacing.",
      "Actions keep their native labels and events. The component performs no polling, data loading or network request.",
      "Loading, errors and permission denial are different states. Show appropriate content for each; do not treat every missing result as an empty collection.",
    ],
  },
};
