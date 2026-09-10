// Maps the service and icon forms of acme-avatar (the wrapper that holds the avatar and its corner dot) to Geist
// GitHubAvatar, GitLabAvatar, BitbucketAvatar and AvatarWithIcon: the generator derives avatar-wrap.styles.ts from this.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "avatar",
  element: "avatar",
  component: ["AvatarWithIcon", "GitHubAvatar", "GitLabAvatar", "BitbucketAvatar"],
  root: (n) => n.tag === "div" && has("shrink-0")(n) && n.children.some((c) => "data-geist-avatar" in c.attrs),
  ours: ".avatar-wrap",
  props: { $tag: { GitHubAvatar: ".github", GitLabAvatar: ".gitlab", BitbucketAvatar: ".bitbucket" } },
  children: [
    { ours: ".avatar", pick: (c) => "data-geist-avatar" in c.attrs, extends: "avatar", leaf: true },
    // The dot carries the service and background attributes; a slotted icon replaces the service mark, which is the slot's fallback.
    { ours: ".service", pick: has("aspect-square"), children: [{ ours: "svg", pick: (c) => c.tag === "svg", leaf: true }] },
  ],
  slotted: ["svg"],
};
