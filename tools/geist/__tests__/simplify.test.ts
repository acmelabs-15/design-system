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

test("reference defaults use linked CSS sheets rather than sidecar files", async () => {
  const { copyFile, mkdir, mkdtemp, rm, writeFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const scratch = await mkdtemp(path.join(tmpdir(), "acme-reference-inputs-"));
  try {
    await mkdir(path.join(scratch, "corpus/css"), { recursive: true });
    await mkdir(path.join(scratch, "corpus/html"), { recursive: true });
    for (const file of ["simplify.ts", "tw.ts"]) {
      await copyFile(path.join(import.meta.dir, "..", file), path.join(scratch, file));
    }
    await writeFile(path.join(scratch, "corpus/html/page.html"), '<link rel="stylesheet" href="/linked.css">');
    await writeFile(path.join(scratch, "corpus/css/linked.css"), '@property --tw-linked{syntax:"*";inherits:false;initial-value:1;}');
    await writeFile(path.join(scratch, "corpus/css/notes.txt"), '@property --tw-sidecar{syntax:"*";inherits:false;initial-value:999;}');
    const module = await import(path.join(scratch, "simplify.ts"));
    module.loadReference();
    expect(module.twDefaults["--tw-linked"]).toBe("1");
    expect(module.twDefaults["--tw-sidecar"]).toBeUndefined();
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
