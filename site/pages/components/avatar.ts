import type { Doc } from "../../site";
const members = JSON.stringify([
  { id: "ada", label: "Ada Lovelace" },
  { id: "grace", label: "Grace Hopper" },
  { id: "alan", label: "Alan Turing" },
  { id: "katherine", label: "Katherine Johnson" },
]);
export const doc: Doc = {
  id: "avatar",
  title: "Avatar",
  tags: ["acme-avatar", "acme-avatar-group"],
  lede: "Entity images with a named fallback. Avatar Group adds stable member order and exact remaining counts.",
  examples: [
    { h: "Group", html: `<acme-avatar-group members='${members}'></acme-avatar-group>` },
    {
      h: "Stacking order",
      html: `<div class="row"><acme-avatar-group members='${members}' limit="0"></acme-avatar-group><acme-avatar-group members='${members}' limit="0" reverse></acme-avatar-group></div>`,
    },
    {
      h: "Overlap",
      html: `<div class="row"><acme-avatar-group members='${members}' overlap="auto"></acme-avatar-group><acme-avatar-group members='${members}' overlap="4px"></acme-avatar-group></div>`,
    },
    {
      h: "Size",
      html: '<div class="row"><acme-avatar size="tiny" label="Ada Lovelace"></acme-avatar><acme-avatar size="small" label="Grace Hopper"></acme-avatar><acme-avatar label="Alan Turing"></acme-avatar><acme-avatar size="large" label="Katherine Johnson"></acme-avatar><acme-avatar width="64px" label="Margaret Hamilton"></acme-avatar></div>',
    },
    {
      h: "Image and fallback",
      html: '<div class="row"><acme-avatar src="https://avatars.githubusercontent.com/rauchg?s=96" label="Guillermo Rauch" initials="GR"></acme-avatar><acme-avatar src="/missing-avatar-example.png" label="Ada Lovelace"></acme-avatar><acme-avatar label="Grace Hopper" initials="GH"></acme-avatar></div>',
    },
    { h: "Custom badge", html: '<acme-avatar label="Ada Lovelace"><acme-check-circle-icon slot="badge" size="14px" label="Verified" filled></acme-check-circle-icon></acme-avatar>' },
    { h: "Loading and shape", html: '<div class="row"><acme-avatar label="Ada Lovelace" loading></acme-avatar><acme-avatar label="Grace Hopper" shape="square"></acme-avatar></div>' },
    { h: "Extra members", html: `<div class="row"><acme-avatar-group members='${members}' extra="10"></acme-avatar-group><acme-avatar-group extra="1"></acme-avatar-group></div>` },
    {
      h: "Overflow action",
      html: `<div><acme-avatar-group id="avatar-overflow-example" members='${members}'><acme-icon-button slot="overflow" variant="secondary" shape="circle" size="small" aria-label="Show all people"><acme-more-horiz-icon></acme-more-horiz-icon></acme-icon-button></acme-avatar-group><p id="avatar-overflow-result" hidden></p></div>`,
      script: 'const group = root.querySelector("#avatar-overflow-example"); group.querySelector("acme-icon-button").addEventListener("click", () => { const result = root.querySelector("#avatar-overflow-result"); result.textContent = group.members.map(member => member.label).join(", "); result.hidden = false; });',
    },
  ],
  practices: {
    Content: [
      "Supply an explicit src. An absent or failed image uses fallback content, supplied initials, initials derived from label, or a person icon.",
      "label names the entity. An empty label makes the image decorative. Badge content retains its own meaning.",
      "Image events contain no source URL. Replacing src invalidates completion from the previous image.",
    ],
    Groups: [
      "Member IDs are stable and unique. Arrays and member records are copied into immutable state.",
      "limit includes the overflow presentation. Set limit=0 to show every supplied member. extra adds people without supplied records.",
      "The visible count caps at 9+; accessible text states the full count. Custom overflow content does not add an action unless the application supplies one.",
      "Translate avatarGroup.more.one, avatarGroup.more.other and other locale plural categories with a {count} placeholder through configureMessages.",
    ],
  },
};
