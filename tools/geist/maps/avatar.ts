// Maps acme-avatar (src/components/avatar) to Geist Avatar: the generator derives avatar.styles.ts from this.
import type { GeistMap } from "../gen";

export const geist: GeistMap = {
  page: "avatar",
  component: "Avatar",
  root: "data-geist-avatar",
  ours: ".avatar",
  // The group, service and icon examples render their avatars inside a wrapper: the avatar-group and avatar-wrap mappings cover those.
  skip: ["Group", "Stacking order", "Overlap", "Fixed overlap", "Git", "With custom icon"],
  // The mask and the resolved (image loaded) states are attributes on the root; their rules keep those tokens.
  children: [
    { ours: "img", pick: (c) => c.tag === "img" },
    { ours: ".letter", pick: (c) => c.tag === "span" },
  ],
};
