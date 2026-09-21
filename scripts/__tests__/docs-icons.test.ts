import { expect, test } from "bun:test";
import { documentationIconEntries } from "../docs-icons";
test("documentation icons use parsed attributes and retain explicit artwork imports", () => {
  expect(
    documentationIconEntries([
      '<acme-home-icon label="not filled >" filled="false"></acme-home-icon><acme-check-icon filled></acme-check-icon>',
      '<acme-home-icon family="sharp" filled></acme-home-icon>',
    ]),
  ).toEqual(["define/check-icon", "define/home-icon", "generated/icons/artwork/rounded/filled/check", "generated/icons/artwork/sharp/filled/home"]);
});
test("escaped examples and comments do not register icons; invalid rendered names fail", () => {
  expect(documentationIconEntries(["<!-- <acme-home-icon> --><code>&lt;acme-check-icon&gt;</code>"])).toEqual([]);
  expect(() => documentationIconEntries(["<acme-unavailable-example-icon></acme-unavailable-example-icon>"])).toThrow("Unknown documentation icon");
});
