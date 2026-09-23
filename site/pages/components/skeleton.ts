import type { Doc } from "../../site";
export const doc: Doc = {
  id: "skeleton",
  title: "Skeleton",
  lede: "A decorative placeholder while application content loads.",
  tags: ["acme-skeleton"],
  examples: [
    { h: "Placeholder", html: '<acme-skeleton width="240px" height="24px"></acme-skeleton>' },
    {
      h: "Retained content",
      html: '<acme-button variant="secondary">Toggle loading</acme-button><acme-skeleton><p>Your content remains mounted while the placeholder is visible.</p></acme-skeleton>',
      script: 'const skeleton=root.querySelector("acme-skeleton");root.querySelector("acme-button").addEventListener("click",()=>skeleton.loading=!skeleton.loading);',
    },
    { h: "Shapes", html: '<acme-h-stack gap="4"><acme-skeleton width="64px" height="64px" shape="circle"></acme-skeleton><acme-skeleton width="160px" height="64px"></acme-skeleton></acme-h-stack>' },
  ],
  practices: {
    Loading: [
      "loading defaults to true. The placeholder is decorative and hidden from accessibility; it does not invent a progress announcement.",
      "Content stays mounted. It is hidden and inert while loading, then becomes visible when loading is false. Keep the action that starts loading outside the placeholder.",
      "Mark the surrounding content region busy when the application needs that meaning. Avoid duplicate loading announcements from several placeholders.",
    ],
    Layout: [
      "width and height accept CSS sizes. Omission lets content determine the size, with a minimum placeholder height while loading.",
      "rectangle and circle control the surface shape. The wrapper remains a real layout box.",
      "The shimmer uses the shared Lit Motion lifetime. Reduced motion stops it, and disconnection cancels its work.",
    ],
  },
};
