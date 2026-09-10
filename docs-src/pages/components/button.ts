// Docs page: Button — mirrors https://vercel.com/geist/button
import type { Doc } from "../../site";

const row = (inner: string, gap = 16) => `<div class="row" style="gap:${gap}px;align-items:flex-start">${inner}</div>`;
const up = `<svg class="ic" width="16" height="16" aria-hidden="true"><use href="#i-arrow-up"/></svg>`;
const variants = ["default", "error", "warning", "secondary", "tertiary"];
const typeRow = (size: string) => `<div class="row">${variants.map((v) => `<acme-button${size ? ` size="${size}"` : ""} variant="${v}">Upload</acme-button>`).join("")}</div>`;

export const doc: Doc = {
  id: "button",
  title: "Button",
  lede: "Starts an action or event, such as a form submit or a dialog.",
  tags: ["acme-button", "acme-button-group"],
  examples: [
    {
      h: "Sizes",
      p: "The default size is medium.",
      html: row(`<acme-button size="small">Upload</acme-button><acme-button>Upload</acme-button><acme-button size="large">Upload</acme-button>`),
    },
    {
      h: "All Types and Sizes in comparison",
      html: `<div class="vstack" style="gap:24px">${typeRow("small")}${typeRow("")}${typeRow("large")}</div>`,
    },
    {
      h: "Shapes",
      p: "An icon-only button needs svg-only and an aria-label.",
      html: row(
        `<acme-button aria-label="Upload" shape="square" size="tiny" svg-only>${up}</acme-button><acme-button aria-label="Upload" shape="square" size="small" svg-only>${up}</acme-button><acme-button aria-label="Upload" shape="square" svg-only>${up}</acme-button><acme-button aria-label="Upload" shape="square" size="large" svg-only>${up}</acme-button><acme-button aria-label="Upload" shape="circle" size="tiny" svg-only>${up}</acme-button><acme-button aria-label="Upload" shape="circle" size="small" svg-only>${up}</acme-button><acme-button aria-label="Upload" shape="circle" svg-only>${up}</acme-button><acme-button aria-label="Upload" shape="circle" size="large" svg-only>${up}</acme-button>`,
      ),
    },
    {
      h: "Prefix and suffix",
      html: row(
        `<acme-button><svg class="ic" width="16" height="16" slot="prefix" aria-hidden="true"><use href="#i-arrow-left"/></svg>Upload</acme-button><acme-button>Upload<svg class="ic" width="16" height="16" slot="suffix" aria-hidden="true"><use href="#i-arrow-right"/></svg></acme-button><acme-button><svg class="ic" width="16" height="16" slot="prefix" aria-hidden="true"><use href="#i-arrow-left"/></svg>Upload<svg class="ic" width="16" height="16" slot="suffix" aria-hidden="true"><use href="#i-arrow-right"/></svg></acme-button>`,
      ),
    },
    {
      h: "Rounded",
      p: 'shape="rounded" together with shadow: the marketing pill.',
      html: row(
        `<acme-button shadow shape="rounded" size="small" variant="secondary">Upload</acme-button><acme-button shadow shape="rounded" variant="secondary">Upload</acme-button><acme-button shadow shape="rounded" size="large" variant="secondary">Upload</acme-button>`,
      ),
    },
    {
      h: "Loading",
      html: row(`<acme-button loading size="small">Upload</acme-button><acme-button loading>Upload</acme-button><acme-button loading size="large">Upload</acme-button>`),
    },
    {
      h: "Disabled",
      html: row(`<acme-button disabled size="small">Upload</acme-button><acme-button disabled>Upload</acme-button><acme-button disabled size="large">Upload</acme-button>`),
    },
    {
      h: "Disabled variants",
      html: row(
        `<acme-button disabled>Default</acme-button><acme-button disabled variant="secondary">Secondary</acme-button><acme-button disabled variant="tertiary">Tertiary</acme-button><acme-button disabled variant="error">Error</acme-button><acme-button disabled variant="warning">Warning</acme-button>`,
      ),
    },
    {
      h: "Link",
      p: "An href renders an anchor with the same props as the button.",
      html: `<acme-button href="#" style="width:fit-content">Sign Up</acme-button>`,
    },
    {
      h: "Custom",
      p: 'variant="custom" takes its foreground, background and border from normal, hover and active.',
      html: row(
        `<acme-button variant="custom" active='{"foreground":"#fff","background":"var(--ds-blue-700)","border":"var(--ds-blue-700)"}' hover='{"foreground":"#fff","background":"#0B7BFE","border":"var(--ds-blue-700)"}' normal='{"foreground":"#fff","background":"var(--ds-blue-700)","border":"var(--ds-blue-700)"}' width="160">Upgrade to Pro</acme-button>`,
      ),
    },
  ],
  practices: {
    "Best Practices": [
      "A button is for an action that changes state (deploy, save, delete); a link (href) is for navigation that changes the URL. When several related actions share a row, use a Menu or a Split Button.",
      'The default button is primary. Use variant="secondary" for the supporting action and variant="error" for a destructive confirmation. primary, success, ghost and violet are not variants.',
      'A form submit sets type="submit"; the visual variant lives on variant, not on type.',
      "Set loading instead of swapping in a spinner: the button stays focusable and announces the busy state.",
      "Disable a button only when the action is impossible right now (missing input, no permission), and add a Tooltip that says why.",
      "Title Case the label and name what happens: Deploy Project, Invite Member, Rotate Key. Not a bare verb (Submit) and not a generic confirm (OK, Confirm).",
      "A destructive button reads Verb + Noun and pairs 1:1 with its toast: Delete Project, then Project deleted. A mode switch ends in Instead: Use a Recovery Code Instead.",
      "An icon-only button needs both svg-only and an aria-label. The label names the action and the target (Copy deployment URL), not the icon (Copy).",
      "Do not set an aria-label on a button that has visible text; it replaces the label and the screen reader hears something else.",
    ],
  },
};
