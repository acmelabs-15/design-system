import { describe, expect, test } from "bun:test";
import "../../../index";
import type { AcmeGridCell } from "../../grid-cell/grid-cell";
import type { AcmeGridCross } from "../../grid-cross/grid-cross";
import type { AcmeGridPage } from "../../grid-page/grid-page";
import type { AcmeGridSystem } from "../../grid-system/grid-system";
import { type AcmeGrid, breakpointVars, positionSpan, restrict } from "../grid";

const mount = async <T extends HTMLElement & { updateComplete: Promise<boolean> }>(markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as T;
  await el.updateComplete;
  return el;
};
const settle = async (...els: { updateComplete: Promise<boolean> }[]) => {
  await new Promise((r) => setTimeout(r, 0));
  for (const el of els) await el.updateComplete;
};
const section = (grid: AcmeGrid) => grid.shadowRoot!.querySelector(".grid") as HTMLElement;
const guides = (grid: AcmeGrid, sel = ".guides > .guide") => [...grid.shadowRoot!.querySelectorAll(sel)] as HTMLElement[];

describe("responsive helpers", () => {
  test("restrict fills the breakpoints from their neighbours; a plain value applies everywhere", () => {
    expect(restrict({ sm: 1, md: 2, lg: 3 })).toEqual({ xs: 1, sm: 1, smd: 2, md: 2, lg: 3 });
    expect(restrict({ sm: 6, md: 3 })).toEqual({ xs: 6, sm: 6, smd: 3, md: 3, lg: 3 });
    expect(restrict(4)).toEqual({ xs: 4, sm: 4, smd: 4, md: 4, lg: 4 });
    expect(() => restrict({ md: 2 } as never)).toThrow();
  });
  test("breakpointVars writes one variable for a plain value and one per changed breakpoint for an object", () => {
    expect(breakpointVars("grid-rows", 2)).toEqual({ "--grid-rows": "2" });
    expect(breakpointVars("grid-rows", { sm: 6, md: 3, lg: 2 })).toEqual({ "--sm-grid-rows": "6", "--md-grid-rows": "3", "--lg-grid-rows": "2" });
    expect(breakpointVars("grid-row", restrict({ sm: "1", md: "1/3" }))).toEqual({ "--sm-grid-row": "1", "--smd-grid-row": "1/3" });
    expect(breakpointVars("height", restrict("fit-content"))).toEqual({ "--sm-height": "fit-content" });
  });
  test("positionSpan reads numbers, start/end strings and pairs; negative lines count from the end", () => {
    expect(positionSpan(2)).toEqual([2, 3]);
    expect(positionSpan("1/3")).toEqual([1, 3]);
    expect(positionSpan("1/-1", 12)).toEqual([1, 13]);
    expect(positionSpan([3, 5])).toEqual([3, 5]);
    expect(() => positionSpan("auto")).toThrow();
  });
});

describe("acme-grid-system", () => {
  test("renders the wrapper with the system box, the lazy box and the modifier classes; the variables land as inline style", async () => {
    const el = await mount<AcmeGridSystem>(
      `<acme-grid-system debug dashed-guides use-container guide-width="2" max-width="900" guide-color="red"><acme-grid columns="1" rows="1"></acme-grid></acme-grid-system>`,
    );
    const wrap = el.shadowRoot!.querySelector(".wrap") as HTMLElement;
    expect(wrap.className.trim()).toBe("wrap contained debug dashed");
    const sys = wrap.querySelector(".sys") as HTMLElement;
    expect(sys.getAttribute("style")).toBe("--guide-width:2px;--max-width:900px;--guide-color:red");
    expect(sys.querySelector(":scope > slot:not([name])")).not.toBeNull();
    expect(sys.querySelector(":scope > .lazy > slot[name=lazy]")).not.toBeNull();
    expect(sys.querySelector(":scope > .overlay")).not.toBeNull();
    expect(el.hasAttribute("debug")).toBe(true);
    const plain = await mount<AcmeGridSystem>(`<acme-grid-system></acme-grid-system>`);
    expect(plain.shadowRoot!.querySelector(".wrap")!.className.trim()).toBe("wrap");
    expect(plain.shadowRoot!.querySelector(".overlay")).toBeNull();
    expect(plain.shadowRoot!.querySelector(".sys")!.hasAttribute("style")).toBe(false);
  });
  test("the first two children go to the box, the rest to the lazy box", async () => {
    const el = await mount<AcmeGridSystem>(`<acme-grid-system><acme-grid columns="1" rows="1"></acme-grid><acme-grid columns="1" rows="1"></acme-grid><p>third</p></acme-grid-system>`);
    const main = el.shadowRoot!.querySelector("slot:not([name])") as HTMLSlotElement;
    const lazy = el.shadowRoot!.querySelector("slot[name=lazy]") as HTMLSlotElement;
    expect(main.assignedNodes().length).toBe(2);
    expect(lazy.assignedNodes().map((n) => (n as Element).tagName)).toEqual(["P"]);
  });
});

describe("acme-grid", () => {
  test("renders the section with the count variables and one guide per track; the last track's edges are clipped", async () => {
    const system = await mount<AcmeGridSystem>(`<acme-grid-system><acme-grid columns="3" rows="2"></acme-grid></acme-grid-system>`);
    const grid = system.querySelector("acme-grid") as AcmeGrid;
    await grid.updateComplete;
    const s = section(grid);
    expect(s.tagName).toBe("SECTION");
    expect(s.className.trim()).toBe("grid");
    expect(s.getAttribute("style")).toBe("--grid-rows:2;--grid-columns:3;--sm-height:fit-content");
    expect(s.hasAttribute("data-grid")).toBe(true);
    expect(s.getAttribute("part")).toBe("grid");
    const g = guides(grid);
    expect(g.length).toBe(6);
    expect(g[0].getAttribute("style")).toBe("--x:1;--y:1");
    expect(g[2].getAttribute("style")).toBe("--x:3;--y:1;border-right:none");
    expect(g[5].getAttribute("style")).toBe("--x:3;--y:2;border-right:none;border-bottom:none");
    expect(g[0].getAttribute("aria-hidden")).toBe("true");
  });
  test("height preserve-aspect-ratio and the guide options", async () => {
    const grid = await mount<AcmeGrid>(`<acme-grid columns="12" rows="3" height="preserve-aspect-ratio" hide-guides="row" no-system-border use-container dashed-guides></acme-grid>`);
    const s = section(grid);
    expect(s.getAttribute("style")).toBe("--grid-rows:3;--grid-columns:12;--sm-height:calc(var(--width) / var(--grid-columns) * var(--grid-rows));border-bottom:none");
    expect(s.className.trim()).toBe("grid contained dashed");
    expect(guides(grid).every((g) => g.getAttribute("style")!.endsWith("border-bottom:none"))).toBe(true);
    grid.hideGuides = "column";
    await grid.updateComplete;
    expect(guides(grid).every((g) => g.getAttribute("style")!.includes("border-right:none"))).toBe(true);
    grid.hideGuides = true;
    await grid.updateComplete;
    expect(guides(grid).length).toBe(0);
  });
  test("a solid cell clips the guides it covers; the grid follows cell changes", async () => {
    const grid = await mount<AcmeGrid>(
      `<acme-grid columns="3" rows="2"><acme-grid-cell column="1/3" row="1" solid>1 + 2</acme-grid-cell><acme-grid-cell>3</acme-grid-cell><acme-grid-cell>4</acme-grid-cell><acme-grid-cell column="2/4" row="2" solid>5 + 6</acme-grid-cell></acme-grid>`,
    );
    const cells = [...grid.querySelectorAll("acme-grid-cell")] as AcmeGridCell[];
    await settle(grid, ...cells);
    const styles = guides(grid).map((g) => g.getAttribute("style"));
    expect(styles).toEqual([
      "--x:1;--y:1;border-right:none",
      "--x:2;--y:1",
      "--x:3;--y:1;border-right:none",
      "--x:1;--y:2;border-bottom:none",
      "--x:2;--y:2;border-right:none;border-bottom:none",
      "--x:3;--y:2;border-right:none;border-bottom:none",
    ]);
    cells[0].solid = false;
    await settle(grid, cells[0]);
    expect(guides(grid)[0].getAttribute("style")).toBe("--x:1;--y:1");
  });
  test("responsive counts write a variable per breakpoint and draw one guide set per breakpoint", async () => {
    const grid = await mount<AcmeGrid>(`<acme-grid columns='{"sm":1,"md":2,"lg":3}' rows='{"sm":6,"md":3,"lg":2}'></acme-grid>`);
    const s = section(grid);
    expect(s.getAttribute("style")).toBe("--sm-grid-rows:6;--md-grid-rows:3;--lg-grid-rows:2;--sm-grid-columns:1;--md-grid-columns:2;--lg-grid-columns:3;--sm-height:fit-content");
    expect(grid.shadowRoot!.querySelectorAll(".guides").length).toBe(5);
    expect(guides(grid, ".guides > .guide.xs").length).toBe(6);
    expect(guides(grid, ".guides > .guide.smd").length).toBe(6);
    expect(guides(grid, ".guides > .guide.lg").length).toBe(6);
    expect(guides(grid, ".guides > .guide.lg")[2].getAttribute("style")).toBe("--x:3;--y:1;border-right:none");
  });
  test("the system's debug and dashed modes reach the section as attributes and follow changes", async () => {
    const system = await mount<AcmeGridSystem>(`<acme-grid-system debug><acme-grid columns="1" rows="1"></acme-grid></acme-grid-system>`);
    const grid = system.querySelector("acme-grid") as AcmeGrid;
    await grid.updateComplete;
    expect(section(grid).hasAttribute("data-debug")).toBe(true);
    expect(section(grid).hasAttribute("data-dashed")).toBe(false);
    system.dashedGuides = true;
    system.debug = false;
    await settle(system, grid);
    expect(section(grid).hasAttribute("data-dashed")).toBe(true);
    expect(section(grid).hasAttribute("data-debug")).toBe(false);
  });
});

describe("acme-grid-cell", () => {
  test("placement lands on the host as variables per breakpoint; the shadow tree is a slot", async () => {
    const el = await mount<AcmeGridCell>(`<acme-grid-cell column="1/3" row="1" solid>1 + 2</acme-grid-cell>`);
    expect(el.style.getPropertyValue("--sm-grid-row")).toBe("1");
    expect(el.style.getPropertyValue("--sm-grid-column")).toBe("1/3");
    expect(el.style.getPropertyValue("--sm-cell-columns")).toBe("2");
    expect(el.shadowRoot!.querySelector("slot")).not.toBeNull();
    const flow = await mount<AcmeGridCell>(`<acme-grid-cell>3</acme-grid-cell>`);
    expect(flow.style.getPropertyValue("--sm-grid-row")).toBe("auto");
    expect(flow.style.getPropertyValue("--sm-cell-rows")).toBe("auto");
  });
  test("responsive placement writes the breakpoints that differ", async () => {
    const el = await mount<AcmeGridCell>(`<acme-grid-cell column='{"sm":1,"md":"1/3","lg":"2/4"}' row='{"sm":"5/7","md":3,"lg":2}' solid></acme-grid-cell>`);
    expect(el.style.getPropertyValue("--sm-grid-column")).toBe("1 / span 1");
    expect(el.style.getPropertyValue("--smd-grid-column")).toBe("1/3");
    expect(el.style.getPropertyValue("--lg-grid-column")).toBe("2/4");
    expect(el.style.getPropertyValue("--md-grid-column")).toBe("");
    expect(el.style.getPropertyValue("--sm-grid-row")).toBe("5/7");
    expect(el.style.getPropertyValue("--smd-grid-row")).toBe("3 / span 1");
    expect(el.style.getPropertyValue("--lg-grid-row")).toBe("2 / span 1");
  });
  test("no-padding, behind-grid, overflow and hide become inline styles", async () => {
    const el = await mount<AcmeGridCell>(`<acme-grid-cell no-padding behind-grid overflow hide="xs md"></acme-grid-cell>`);
    expect(el.style.padding).toBe("0px");
    expect(el.style.zIndex).toBe("0");
    expect(el.style.overflow).toBe("visible");
    expect(el.style.getPropertyValue("--xs-block-display")).toBe("none");
    expect(el.style.getPropertyValue("--md-block-display")).toBe("none");
    expect(el.style.getPropertyValue("--sm-block-display")).toBe("");
  });
  test("a solid cell without a row and a column is refused", async () => {
    document.body.innerHTML = `<acme-grid-cell solid>x</acme-grid-cell>`;
    const el = document.body.firstElementChild as AcmeGridCell;
    await expect(el.updateComplete).rejects.toThrow();
  });
});

describe("acme-grid-cross and acme-grid-page", () => {
  test("a cross records its lines on the host and draws a vertical and a horizontal line", async () => {
    const cross = await mount<AcmeGridCross>(`<acme-grid-cross column="4" row="3"></acme-grid-cross>`);
    expect(cross.style.getPropertyValue("--cross-column")).toBe("4");
    expect(cross.style.getPropertyValue("--cross-row")).toBe("3");
    const lines = cross.shadowRoot!.querySelectorAll(".line");
    expect(lines.length).toBe(2);
    expect(lines[0].getAttribute("style")).toContain("border-right-width:var(--guide-width)");
    expect(lines[1].getAttribute("style")).toContain("border-bottom-width:var(--guide-width)");
  });
  test("a page renders the padded column, a banner slot first, and the modifier styles", async () => {
    const page = await mount<AcmeGridPage>(`<acme-grid-page><div slot="banner">Banner</div><acme-grid-system></acme-grid-system></acme-grid-page>`);
    await settle(page);
    const div = page.shadowRoot!.querySelector(".page") as HTMLElement;
    expect(div.className.trim()).toBe("page banner");
    expect(div.getAttribute("style")).toContain("--lg-stack-padding:90px 0px");
    expect(div.querySelector("slot[name=banner] + slot:not([name])")).not.toBeNull();
    const bare = await mount<AcmeGridPage>(`<acme-grid-page remove-padding-y remove-bottom-margin></acme-grid-page>`);
    const b = bare.shadowRoot!.querySelector(".page") as HTMLElement;
    expect(b.className.trim()).toBe("page");
    expect(b.getAttribute("style")).toContain("--stack-padding:0px");
    expect(b.getAttribute("style")).toContain("margin-bottom:-1px");
  });
});
