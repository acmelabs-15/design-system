import { describe, expect, test } from "bun:test";
import { parseDecls, serialize, simplify } from "../simplify";

/** The simplifier's merge: a later shorthand replaces the earlier longhands it resets, and only those. */
describe("simplify: shorthand reset", () => {
  const run = (css: string) => serialize(simplify(parseDecls(css), []));

  test("a shorthand replaces the longhands it does reset", () => {
    // `border` sets width, style and color on all four sides, so the earlier longhand goes.
    expect(run("border-top-width:2px;border:none")).toBe("border:none");
    // `padding` sets all four sides.
    expect(run("padding-left:4px;padding:0")).toBe("padding:0");
  });

  test("outline keeps outline-offset: the shorthand does not reset it", () => {
    // CSS UI: "outline-offset is not part of the outline shorthand."
    const out = run("outline-offset:2px;outline:2px solid #0000");
    expect(out).toContain("outline-offset:2px");
    expect(out).toContain("outline:2px solid #0000");
  });

  test("outline still replaces its own longhands", () => {
    expect(run("outline-style:none;outline:2px solid red")).toBe("outline:2px solid red");
  });

  test("transform keeps transform-style: they are separate properties", () => {
    // CSS Transforms 2 gives transform-style its own section; transform is a function list.
    const out = run("transform-style:preserve-3d;transform:rotate(0)");
    expect(out).toContain("transform-style:preserve-3d");
    expect(out).toContain("transform:rotate(0)");
  });

  test("a same-prefixed property outside its shorthand survives", () => {
    // `overflow` sets overflow-x and overflow-y; overflow-wrap is a different property.
    const wrap = run("overflow-wrap:anywhere;overflow:hidden");
    expect(wrap).toContain("overflow-wrap:anywhere");
    expect(wrap).toContain("overflow:hidden");
    // `border` does not reset border-collapse.
    const collapse = run("border-collapse:collapse;border:none");
    expect(collapse).toContain("border-collapse:collapse");
    // `flex` sets grow, shrink and basis; flex-direction belongs to flex-flow.
    const dir = run("flex-direction:column;flex:1");
    expect(dir).toContain("flex-direction:column");
  });
});
