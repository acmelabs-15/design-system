// Docs page: Avatar — mirrors https://vercel.com/geist/avatar
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "avatar",
  title: "Avatar",
  lede: "Avatars represent a user or a team, and stacked avatars a group.",
  tags: ["acme-avatar", "acme-avatar-group"],
  examples: [
    {
      h: "Group",
      p: "Each member carries a 1px ring in the page color and overlaps the next; the first sits on top.",
      html: `<acme-avatar-group><acme-avatar>ab</acme-avatar><acme-avatar>cd</acme-avatar><acme-avatar>ef</acme-avatar><acme-avatar>gh</acme-avatar></acme-avatar-group>`,
    },
    {
      h: "Stacking order",
      p: "Add reverse so the last member sits on top.",
      html: `<acme-avatar-group reverse><acme-avatar>ab</acme-avatar><acme-avatar>cd</acme-avatar><acme-avatar>ef</acme-avatar></acme-avatar-group>`,
    },
    {
      h: "Limit",
      p: "Over the limit, the last slot is a +N counter.",
      html: `<acme-avatar-group limit="3"><acme-avatar>ab</acme-avatar><acme-avatar>cd</acme-avatar><acme-avatar>ef</acme-avatar><acme-avatar>gh</acme-avatar><acme-avatar>ij</acme-avatar><acme-avatar>kl</acme-avatar><acme-avatar>mn</acme-avatar></acme-avatar-group>`,
    },
    {
      h: "Size",
      p: "16, 24, 32, 48 and 64.",
      html: `<div class="row" style="gap:16px"><acme-avatar size="xs">a</acme-avatar><acme-avatar size="sm">ab</acme-avatar><acme-avatar>ab</acme-avatar><acme-avatar size="lg">ab</acme-avatar><acme-avatar size="xl">ab</acme-avatar></div>`,
    },
    {
      h: "Image",
      p: "A src with an alt; the fallback letters show until it loads.",
      html: `<acme-avatar src="https://avatars.githubusercontent.com/u/14985020?s=64" alt="Vercel"></acme-avatar>`,
    },
    {
      h: "Presence",
      p: "A 16px service dot at the bottom right.",
      html: `<div class="row" style="gap:16px"><acme-avatar presence="on">pk</acme-avatar><acme-avatar presence="away">pk</acme-avatar><acme-avatar presence="off">pk</acme-avatar></div>`,
    },
    {
      h: "Letter and placeholder",
      p: "One or two uppercase letters, weight 500, on a gray fill.",
      html: `<div class="row" style="gap:16px"><acme-avatar>sl</acme-avatar><acme-avatar>e</acme-avatar><acme-avatar placeholder></acme-avatar><acme-avatar square>sq</acme-avatar></div>`,
    },
  ],
  practices: {
    "When to use": ["20–24px next to label-14, 32px next to label-16, 48–64px in headers.", "A placeholder is a loading shell, never a permanent fallback."],
  },
};
