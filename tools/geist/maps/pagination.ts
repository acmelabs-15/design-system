// Maps acme-pagination (src/components/pagination) to Geist Pagination's nav: a full-width
// space-between row of the previous link, a centered slot hidden below the xl breakpoint, and the
// next link. The links are mapped on their own (maps/pagination-link.ts): each is a hover group.
import { type GeistMap, has } from "../gen";

export const geist: GeistMap = {
  page: "pagination",
  component: "Pagination",
  root: (n) => n.tag === "nav" && n.attrs["aria-label"] === "pagination",
  ours: ".pagination",
  children: [
    { ours: ".prev", pick: has("pl-7"), extends: "pagination-link", leaf: true },
    { ours: ".center", pick: has("left-1/2") },
    { ours: ".next", pick: has("pr-7"), extends: "pagination-link", leaf: true },
  ],
};
