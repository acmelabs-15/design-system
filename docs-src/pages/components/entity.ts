// Docs page: Entity — mirrors https://vercel.com/geist/entity
import type { Doc } from "../../site";

const gray = `class="text-copy-14" style="color:var(--ds-gray-900)"`;
const devices = [
  ["GitHub Desktop on MacBook Pro", "Last used just now"],
  ["VS Code on Windows 11", "Last used 10min ago"],
  ["Terminal on Ubuntu 24.04", "Last used 25min ago"],
];

export const doc: Doc = {
  id: "entity",
  title: "Entity",
  lede: "Displays up-to-two columns of content. The left column can contain arbitrary content, and the right column typically contains controls or actions related to the content in the left column.",
  tags: ["acme-entity", "acme-entity-content", "acme-entity-list"],
  examples: [
    {
      h: "Default",
      html: `<acme-entity><acme-avatar slot="left" size="32" username="evilrabbit"></acme-avatar><acme-entity-content description="Glenn Hitchcock (@gln)" fill title="Evil Rabbit"></acme-entity-content><p slot="right" ${gray}>Connected 1h ago</p></acme-entity>`,
    },
    {
      h: "Entity with Skeleton",
      html: `<acme-entity><div style="display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:8px;flex:1"><acme-skeleton height="20" width="100%"></acme-skeleton><div style="display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:8px;flex:0 1 auto"><acme-skeleton height="20" width="70"></acme-skeleton><acme-skeleton height="20" width="60"></acme-skeleton><acme-skeleton height="20" width="68"></acme-skeleton></div></div></acme-entity>`,
    },
    {
      h: "Entity with List",
      html: `<acme-entity-list>${devices.map(([title, description]) => `<acme-entity as="li"><acme-entity-content description="${description}" title="${title}"></acme-entity-content><acme-button slot="right" size="small" variant="secondary">Decline</acme-button></acme-entity>`).join("")}</acme-entity-list>`,
    },
    {
      h: "Entity with List and Checkbox",
      p: "A clickable row is a button: the page toggles the row's checkbox on its click (a click on the checkbox itself already did).",
      html: `<acme-entity-list>${devices.map(([title, description], i) => `<acme-entity as="button"><acme-checkbox slot="left" aria-label="${title}"${i === 0 ? " checked" : ""}></acme-checkbox><acme-entity-content description="${description}" title="${title}"></acme-entity-content></acme-entity>`).join("")}</acme-entity-list>`,
      script: `for (const row of root.querySelectorAll('acme-entity')) {
  const box = row.querySelector('acme-checkbox');
  row.addEventListener('click', (e) => {
    if (!e.composedPath().includes(box)) box.checked = !box.checked;
  });
}`,
    },
    {
      h: "Entity with Fill",
      html: `<acme-entity-list><acme-entity><acme-entity-content fill description="This is a simple description"></acme-entity-content><acme-entity-content description="This is a simple description"></acme-entity-content></acme-entity></acme-entity-list>`,
    },
    {
      h: "Entity with Column ClassNames",
      p: "The columns are the left and right parts: a page styles them through ::part(left) and ::part(right).",
      html: `<style>.dashed::part(left),.dashed::part(right){border:1px dashed var(--ds-gray-300);border-radius:6px;padding:8px}</style><acme-entity-list><acme-entity class="dashed"><acme-avatar slot="left" placeholder size="50"></acme-avatar><acme-entity-content description="Entity with dashed borders"></acme-entity-content><span slot="right" ${gray}>[some action]</span></acme-entity></acme-entity-list>`,
    },
    {
      h: "Entity with List and Header", census: true,
      p: "A header slot stacks a heading over the list; the list then rounds its bottom corners only.",
      html: `<acme-entity-list><p slot="header" class="text-heading-14">Devices</p><acme-entity as="li"><acme-entity-content description="macOS 15" title="GitHub Desktop on MacBook Pro"></acme-entity-content><span slot="right" ${gray}>Last used just now</span></acme-entity><acme-entity as="li"><acme-entity-content description="Windows 11" title="VS Code"></acme-entity-content><span slot="right" ${gray}>Last used 10min ago</span></acme-entity></acme-entity-list>`,
    },
    {
      h: "Clickable Entity", census: true,
      p: "A clickable row outside a list: a full-width button that inherits its background and tints on hover.",
      html: `<acme-entity as="button"><acme-entity-content description="Last used just now" title="GitHub Desktop on MacBook Pro"></acme-entity-content></acme-entity>`,
    },
  ],
  practices: {
    "When to use": [
      "Use an Entity for a row of descriptive content paired with one or two controls: member rows, integration rows, domain rows.",
      "For tabular data with sortable columns and a shared row shape, use Table instead.",
      "For a static key/value metadata block on a detail page, use Description.",
    ],
    Behavior: [
      "The right column holds at most one or two controls. If the row needs more, move secondary actions into a Dots Menu.",
      'For multi-select rows, the leading Checkbox carries aria-label="Select {entity name}" so the row is selectable without relying on the visual label.',
      "Render the Skeleton variant during load instead of an empty row, and swap to real content once data resolves.",
    ],
    Content: [
      "Lead the left column with a scannable identifier: an Avatar or icon, a Title Case label, then sentence-case secondary metadata (Member since Mar 14, 2026).",
      "Keep right-column buttons Verb + Noun (Remove Member, Resend Invite). Bare verbs like Remove or Confirm lose context once the row scrolls offscreen.",
    ],
  },
};
