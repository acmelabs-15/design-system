import type { Doc } from "../../site";

export const doc: Doc = {
  id: "stack",
  title: "Stack",
  house: true,
  lede: "Arrange a row or column with house spacing. Optional separators follow visible lines when content wraps.",
  tags: ["acme-stack", "acme-h-stack", "acme-v-stack"],
  examples: [
    {
      h: "Column",
      p: "Stack defaults to a column with stretched cross-axis alignment. Its default gap uses the house spacing role for step 2.",
      html: `<acme-stack><acme-box padding="4" background-color="var(--ds-gray-100)">First section</acme-box><acme-box padding="4" background-color="var(--ds-gray-100)">Second section</acme-box></acme-stack>`,
    },
    {
      h: "Named directions",
      p: "HStack stays horizontal. VStack stays vertical. Both center their cross-axis alignment; use align-items to override that alignment.",
      html: `<acme-h-stack><acme-button>Save</acme-button><acme-button>Cancel</acme-button></acme-h-stack>`,
    },
    {
      h: "Wrapped separators",
      p: "Each divider has the selected gap on both sides. Dividers stay between neighbors on the same visible row or column.",
      html: `<acme-h-stack separator flex-wrap="wrap" gap="2" row-gap="4"><acme-box padding="2">Overview</acme-box><acme-box padding="2">Activity</acme-box><acme-box padding="2">Settings</acme-box><acme-box padding="2">Members</acme-box></acme-h-stack>`,
    },
    {
      h: "Responsive direction",
      html: `<acme-stack flex-direction='{"compact":"column","expanded":"row"}' separator gap="4"><acme-box>Draft</acme-box><acme-box>Last saved a moment ago</acme-box></acme-stack>`,
    },
  ],
  practices: {
    "Preserve content ownership": [
      "Use direct element children for automatic separators. Raw text remains ordinary content and disables decoration with a development diagnostic.",
      "Hidden children leave the sequence. Visibility-hidden children keep their boxes. Absolute and fixed-positioned content remain outside the flex-item sequence.",
      "Stack preserves child nodes, native events and focus. It adds no selection or keyboard behavior.",
    ],
    "Style the line": [
      "Use --acme-stack-separator-color, --acme-stack-separator-width and --acme-stack-separator-inset. Width and inset use CSS lengths.",
      "The separator part reaches the actual line. Separators are decorative and add no focus stop.",
      "A non-wrapping line stretches across the content box. Wrapped lines use the bounds of their visible member row or column.",
    ],
    "Choose a container": [
      "Use Flex for direct layout control, Stack for spacing and optional dividers, and Group for attachment or shared compatible appearance.",
      "General Stack supports flexDirection. The named HStack and VStack forms do not expose that property.",
    ],
  },
};
