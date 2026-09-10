// Maps acme-avatar-group (src/components/avatar-group) to Geist AvatarGroup: the generator derives avatar-group.styles.ts from this.
import type { GeistMap, SpecNode } from "../gen";

const avatar = (c: SpecNode) => "data-geist-avatar" in c.attrs;

export const geist: GeistMap = {
  page: "avatar",
  component: "AvatarGroup",
  root: (n) => n.tag === "div" && /--avatar-overlap/.test(n.attrs.style ?? ""),
  ours: ".avatar-group",
  children: [
    // Each shown member wraps one avatar (an acme-avatar in ours); the last slot names the hidden members and, past one, shows their count.
    { ours: ".member", pick: (c) => c.tag === "span" && !("aria-label" in c.attrs), all: true, children: [{ ours: "acme-avatar", pick: avatar, extends: "avatar", leaf: true }] },
    {
      ours: ".more",
      pick: (c) => c.tag === "span" && "aria-label" in c.attrs,
      children: [
        { ours: "acme-avatar", pick: avatar, extends: "avatar", leaf: true },
        { ours: ".count", pick: (c) => c.tag === "span" && !avatar(c) },
      ],
    },
  ],
  ignore: ["group"],
};
