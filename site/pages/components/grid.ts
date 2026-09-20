// Docs page: Grid — mirrors https://vercel.com/geist/grid
import type { Doc } from "../../site";

const cells = (n: number, indent = "    ") =>
  Array.from({ length: n }, (_, i) => `<acme-grid-cell>${i + 1}</acme-grid-cell>`)
    .join("")
    .replace(/></g, `>\n${indent}<`);
const crosses = (pts: [number, number][], indent = "    ") => pts.map(([c, r]) => `<acme-grid-cross column="${c}" row="${r}"></acme-grid-cross>`).join(`\n${indent}`);
const system = (attrs: string, grid: string) => `<acme-grid-system${attrs ? ` ${attrs}` : ""} use-container>\n  ${grid.replace(/\n/g, "\n  ")}\n</acme-grid-system>`;

export const doc: Doc = {
  id: "grid",
  title: "Grid",
  lede: "Display elements in a grid layout.",
  tags: ["acme-grid-system", "acme-grid", "acme-grid-cell", "acme-grid-cross", "acme-grid-page"],
  examples: [
    {
      h: "Grid",
      p: "A non-responsive grid with no cells.",
      html: system(`debug guide-width="1"`, `<acme-grid columns="5" height="preserve-aspect-ratio" rows="2"></acme-grid>`),
    },
    {
      h: "Basic grid",
      p: "A non-responsive single grid with auto flowing cells configuration.",
      html: system(`guide-width="1"`, `<acme-grid columns="3" rows="2">\n  ${cells(6, "  ")}\n</acme-grid>`),
    },
    {
      h: "Solid cells",
      p: "Using the solid attribute on cells will occlude the guides that the cell overlaps.",
      html: system(
        `guide-width="1"`,
        `<acme-grid columns="3" rows="2">\n  <acme-grid-cell column="1/3" row="1" solid>1 + 2</acme-grid-cell>\n  <acme-grid-cell>3</acme-grid-cell>\n  <acme-grid-cell>4</acme-grid-cell>\n  <acme-grid-cell column="2/4" row="2" solid>5 + 6</acme-grid-cell>\n</acme-grid>`,
      ),
    },
    {
      h: "Responsive grid",
      p: "Grid with responsive rows and columns at all 3 breakpoints.",
      html: system("", `<acme-grid columns='{"sm":1,"md":2,"lg":3}' rows='{"sm":6,"md":3,"lg":2}'>\n  ${cells(6, "  ")}\n</acme-grid>`),
    },
    {
      h: "Responsive Grid with responsive guide clipping cells",
      p: "Grid with responsive rows and columns at all 3 breakpoints as well as guide clipping on specific cells.",
      html: system(
        "",
        `<acme-grid columns='{"sm":1,"md":2,"lg":3}' rows='{"sm":6,"md":3,"lg":2}'>\n  <acme-grid-cell column='{"sm":"1","md":"1/3"}' row='{"sm":"1/3","md":1}' solid>1 + 2</acme-grid-cell>\n  <acme-grid-cell>3</acme-grid-cell>\n  <acme-grid-cell>4</acme-grid-cell>\n  <acme-grid-cell column='{"sm":1,"md":"1/3","lg":"2/4"}' row='{"sm":"5/7","md":3,"lg":2}' solid>5 + 6</acme-grid-cell>\n</acme-grid>`,
      ),
    },
    {
      h: "Grid with hidden row guides",
      html: system("", `<acme-grid columns="12" height="preserve-aspect-ratio" hide-guides="row" rows="3"></acme-grid>`),
    },
    {
      h: "Grid with hidden column guides",
      html: system("", `<acme-grid columns="12" height="preserve-aspect-ratio" hide-guides="column" rows="3"></acme-grid>`),
    },
    {
      h: "Grid with overlaying cells",
      p: "Grid with cells that overlay another in various states.",
      html: system(
        "",
        `<acme-grid columns="12" rows="3">\n  <acme-grid-cell column="1/3" row="1/3" solid>1</acme-grid-cell>\n  <acme-grid-cell column="2/4" row="2/4">2</acme-grid-cell>\n  <acme-grid-cell column="3/10" row="2/4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at felis</acme-grid-cell>\n  <acme-grid-cell column="7/12" row="1/-1" solid>3</acme-grid-cell>\n  <acme-grid-cell column="11/13" row="1/3" solid>4</acme-grid-cell>\n</acme-grid>`,
      ),
    },
    {
      h: "Specific Grid with Guide Clipping",
      p: "Grid with guide clipping enabled on specific cells.",
      html: system(
        `guide-width="1"`,
        `<acme-grid columns="3" rows="4">\n  <acme-grid-cell column="1/2" row="1/3" solid>1</acme-grid-cell>\n  <acme-grid-cell column="3/4" row="1/2" solid>2</acme-grid-cell>\n  <acme-grid-cell column="2/3" row="2/4">3</acme-grid-cell>\n  <acme-grid-cell column="1/2" row="4/5" solid>4</acme-grid-cell>\n  <acme-grid-cell column="3/4" row="3/5" solid>5</acme-grid-cell>\n</acme-grid>`,
      ),
    },
    {
      h: "Grid with cross",
      html: system(
        `guide-width="1"`,
        `<acme-grid columns="3" rows="2">\n  ${crosses(
          [
            [1, 1],
            [4, 1],
            [4, 3],
            [1, 3],
          ],
          "  ",
        )}\n  ${cells(6, "  ")}\n</acme-grid>`,
      ),
    },
    {
      h: "Dashed grid with cross",
      html: system(
        `dashed-guides guide-width="1"`,
        `<acme-grid columns="1" rows="1">\n  ${crosses(
          [
            [1, 1],
            [2, 2],
            [2, 1],
            [1, 2],
          ],
          "  ",
        )}\n  <acme-grid-cell>Content here</acme-grid-cell>\n</acme-grid>`,
      ),
    },
    {
      h: "Dashed grid with grid page",
      html: `<acme-grid-page>\n  <acme-grid-system dashed-guides guide-width="1">\n    <acme-grid columns="1" rows="1">\n      ${crosses(
        [
          [1, 1],
          [2, 2],
          [2, 1],
          [1, 2],
        ],
        "      ",
      )}\n      <acme-grid-cell>Content here</acme-grid-cell>\n    </acme-grid>\n  </acme-grid-system>\n</acme-grid-page>`,
    },
  ],
  practices: {
    "When to use": [
      "Grid is for two-dimensional cell-and-guide layouts on marketing pages, docs landings and feature breakdowns, where the rule lines and cell borders are part of the design.",
      "Plain n-column content (cards, lists) is a CSS grid; Grid is too much when no guide is visible.",
      "Nest Grids one level at most. Deeper, the guides overlap into noise and the cell math breaks.",
    ],
    Behavior: [
      "Set columns and rows at all three breakpoints so cells reflow the same way on mobile, tablet and desktop.",
      "A solid cell hides the guides behind it when content needs an opaque background; without it the guides run through the cell.",
      "Hide row or column guides only where their absence helps (single-axis layouts, hero rows). Hiding both usually means a plain CSS grid is the right tool.",
    ],
    Accessibility: [
      "Guides are decorative and aria-hidden; the semantics live in the cell content.",
      "When a cell becomes tappable, give it its own focus ring and keep the tab order in reading order.",
      "Check guide contrast on both themes; the default tokens pass, custom borders can drop under 3:1.",
    ],
  },
};
