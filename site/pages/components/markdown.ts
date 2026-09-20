// Docs page: Markdown (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "markdown",
  title: "Markdown",
  lede: "Renders Markdown with TanStack Markdown in the Geist type scale; code fences are highlighted by TanStack Highlight. A house component; Geist has no page for it.",
  tags: ["acme-markdown"],
  house: true,
  examples: [
    {
      h: "Default",
      p: "The element's own text is the source; the common indent is removed.",
      html: `<acme-markdown>
  ## Deploy Hooks

  A deploy hook is a URL that starts a build when it receives a **POST**. Create one per branch.

  - Name the hook after the branch: \`main\`, \`staging\`.
  - Keep the URL out of client code.

  > A hook without a branch deploys the production branch.
</acme-markdown>`,
    },
    {
      h: "Code fences",
      p: "Fences name their language; a line-numbers attribute adds the gutter.",
      html: `<acme-markdown line-numbers>
  Install the package, then import it once:

  \`\`\`bash
  bun add @acmelabs/design-system
  \`\`\`

  \`\`\`ts
  import "@acmelabs/design-system";
  import { toasts } from "@acmelabs/design-system";
  toasts.success("Domain added");
  \`\`\`
</acme-markdown>`,
    },
    {
      h: "From a property",
      p: "Set text from script when the source is data.",
      html: `<acme-markdown id="md-prop"></acme-markdown>`,
      script: `root.querySelector("#md-prop").text = "### Release notes\\n\\n| Version | Change |\\n|---|---|\\n| 0.1.1 | Homepage points at the docs |\\n| 0.1.0 | First release |";`,
    },
  ],
  practices: {
    "When to use": ["Authored prose: release notes, help text, a changelog. Not for user-generated content unless the source is trusted; raw HTML stays escaped unless allow-html is set."],
  },
};
