import { expect, test } from "bun:test";
import { AcmeDataList } from "../data-list";
import "../../../define/data-list";
test("Data List keeps native pairs and rich values owned by the author", async () => {
  document.body.innerHTML = "<acme-data-list><dl><div><dt>Owner</dt><dd><button>Details</button></dd><dd>Secondary</dd></div><dt>Status</dt><dd>Ready</dd></dl></acme-data-list>";
  const root = document.querySelector("acme-data-list") as AcmeDataList,
    list = root.querySelector("dl"),
    button = root.querySelector("button");
  await root.updateComplete;
  root.orientation = "vertical";
  root.columnWidth = "12rem";
  await root.updateComplete;
  expect(root.firstElementChild).toBe(list);
  expect(root.querySelector("button")).toBe(button);
  expect(root.querySelectorAll("dt").length).toBe(2);
  expect(root.querySelectorAll("dd").length).toBe(3);
  expect(() => {
    root.columnWidth = "url(https://example.invalid)";
  }).toThrow();
});
