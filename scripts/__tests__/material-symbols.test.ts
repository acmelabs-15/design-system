import { expect, test } from "bun:test";
import { parseSymbolSvg, symbolClassName, symbolTag } from "../material-symbols";

test("official path-only SVGs become inert geometry", () => {
  expect(parseSymbolSvg('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M0 0h10v10Z"/></svg>')).toEqual({
    viewBox: "0 -960 960 960",
    paths: [{ d: "M0 0h10v10Z" }],
  });
  expect(parseSymbolSvg('<svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px"><path d="M0 0Z"/></svg>').viewBox).toBe("0 0 24 24");
});
test("unrecognized SVG markup fails before generation", () => {
  for (const svg of [
    '<svg width="24" height="24"><script>alert(1)</script></svg>',
    '<svg width="24" height="24" onload="bad()"><path d="M0 0Z"/></svg>',
    '<svg width="24" height="24"><path d="M0 0Z" fill="url(https://example.com)"/></svg>',
    '<svg width="24" height="24" width="32"><path d="M0 0Z"/></svg>',
  ]) {
    expect(() => parseSymbolSvg(svg)).toThrow();
  }
});
test("symbol identifiers produce deterministic class and tag names", () => {
  expect(symbolTag("3d_rotation")).toBe("acme-3d-rotation-icon");
  expect(symbolClassName("3d_rotation")).toBe("Acme3dRotationIcon");
  expect(() => symbolTag("../outside")).toThrow();
});

test("pinned source verification detects modified checkout content", async () => {
  const { verifyGitBlob } = await import("../material-symbols");
  expect(() => verifyGitBlob("", "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391")).not.toThrow();
  expect(() => verifyGitBlob("modified", "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391")).toThrow("differs from the pinned Git object");
});
