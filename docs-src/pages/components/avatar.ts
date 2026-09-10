// Docs page: Avatar — mirrors https://vercel.com/geist/avatar
import type { Doc } from "../../site";

const three = `[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]`;

export const doc: Doc = {
  id: "avatar",
  title: "Avatar",
  lede: "An avatar stands for one user or team. A stack of avatars stands for a group of people.",
  tags: ["acme-avatar", "acme-avatar-group"],
  examples: [
    {
      h: "Group",
      html: `<div class="row" style="gap:16px"><acme-avatar-group members='${three}' size="32"></acme-avatar-group><acme-avatar-group limit="4" members='[{"username":"christopherkindl"},{"username":"rauno"},{"username":"shuding"},{"username":"skllcrn"},{"username":"almonk"}]' size="32"></acme-avatar-group></div>`,
    },
    {
      h: "Stacking order",
      p: "The first member sits on top of the stack, so the first credited author stays the most visible. Add reverse to put the last member on top. The left-to-right order does not change.",
      html: `<div class="row" style="gap:16px"><acme-avatar-group members='${three}' size="32"></acme-avatar-group><acme-avatar-group members='${three}' reverse size="32"></acme-avatar-group></div>`,
    },
    {
      h: "Overlap",
      p: 'With overlap="auto" (the default) the spacing scales with the size, so the cluster stays even at any size.',
      html: `<div class="row" style="gap:24px"><acme-avatar-group members='${three}' overlap="auto" size="16"></acme-avatar-group><acme-avatar-group members='${three}' overlap="auto" size="24"></acme-avatar-group><acme-avatar-group members='${three}' overlap="auto" size="32"></acme-avatar-group><acme-avatar-group members='${three}' overlap="auto" size="48"></acme-avatar-group></div>`,
    },
    {
      h: "Fixed overlap",
      p: "A number sets the overlap in pixels. A low value spreads the members out; a high value packs them tight for dense UI.",
      html: `<div class="row" style="gap:16px"><acme-avatar-group members='${three}' overlap="10" size="24"></acme-avatar-group><acme-avatar-group members='${three}' overlap="6" size="24"></acme-avatar-group><acme-avatar-group members='${three}' overlap="0" size="24"></acme-avatar-group></div>`,
    },
    {
      h: "Size",
      html: `<div class="row" style="gap:16px"><acme-avatar size="24" username="evilrabbit"></acme-avatar><acme-avatar size="32" username="evilrabbit"></acme-avatar><acme-avatar size="48" username="evilrabbit"></acme-avatar></div>`,
    },
    {
      h: "Git",
      html: `<div class="row" style="gap:16px"><acme-avatar git="github" size="32" username="rauchg"></acme-avatar><acme-avatar git="gitlab" size="32" username="severinlandolt"></acme-avatar><acme-avatar git="bitbucket" size="32" username="evilrabbit"></acme-avatar></div>`,
    },
    {
      h: "With custom icon",
      html: `<div class="row" style="gap:16px">${["arrow-circle-down", "check-circle-fill", "clock-dashed"].map((i) => `<acme-avatar size="32" icon-background><svg slot="icon" width="14" height="14" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ds-gray-900)" aria-hidden="true"><use href="#i-${i}" fill="none"/></svg></acme-avatar>`).join("")}</div>`,
    },
    {
      h: "Letter",
      html: `<div class="row" style="gap:16px"><acme-avatar letter="SL" placeholder size="32"></acme-avatar><acme-avatar letter="EK" placeholder size="32"></acme-avatar><acme-avatar letter="CK" placeholder size="32"></acme-avatar></div>`,
    },
    {
      h: "Placeholder",
      html: `<acme-avatar placeholder size="90"></acme-avatar>`,
    },
  ],
  practices: {
    "Best Practices": [
      "One acme-avatar for one person, team or organization. Two or more stacked avatars go in an acme-avatar-group, which sets the overlap, the size and one accessible label.",
      "Give src first and fall back to letter (one or two uppercase characters) when there is no image. placeholder is the loading shell, never a lasting fallback.",
      'entity holds the plain name (Acme Inc., Jane Doe). A letter avatar already announces "Avatar with initials:", so do not write "Avatar of …" yourself.',
      "Keep letter uppercase and taken from the entity name. No emoji, no punctuation, no question mark.",
      "Match the size to the type beside it: 20–24px next to label-14, 32px next to label-16, 48–64px in headers and onboarding states.",
    ],
  },
};
